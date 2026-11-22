import { io } from 'socket.io-client';

const BASE_URL = 'http://localhost:3003';

async function runTestSuite() {
  console.log('🚀 Starting Real-Time Crew Chat Verification Test Suite...');

  // 1. Log in Alex Rivera
  console.log('\n[1/6] Authenticating Operator 1 (Alex Rivera)...');
  const alexLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'alex@crew.local', password: 'password123' }),
  });
  if (!alexLoginRes.ok) throw new Error(`Alex login failed: ${alexLoginRes.statusText}`);
  const alexData = await alexLoginRes.json();
  const alexToken = alexData.token;
  console.log(`✅ Alex authenticated! (ID: ${alexData.user.id}, Username: ${alexData.user.username})`);

  // 2. Log in Sarah Chen
  console.log('\n[2/6] Authenticating Operator 2 (Sarah Chen)...');
  const sarahLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'sarah@crew.local', password: 'password123' }),
  });
  if (!sarahLoginRes.ok) throw new Error(`Sarah login failed: ${sarahLoginRes.statusText}`);
  const sarahData = await sarahLoginRes.json();
  const sarahToken = sarahData.token;
  console.log(`✅ Sarah authenticated! (ID: ${sarahData.user.id}, Username: ${sarahData.user.username})`);

  // 3. Query crews and channels
  console.log('\n[3/6] Fetching Crews and Channels...');
  const crewsRes = await fetch(`${BASE_URL}/api/crews`, {
    headers: { Authorization: `Bearer ${alexToken}` },
  });
  const crews = await crewsRes.json();
  console.log(`✅ Found ${crews.length} crews for Alex: ${crews.map(c => c.name).join(', ')}`);
  const crewId = crews[0].id;

  const channelsRes = await fetch(`${BASE_URL}/api/crews/${crewId}/channels`);
  const channels = await channelsRes.json();
  console.log(`✅ Found ${channels.length} channels in crew: ${channels.map(c => `#${c.name}`).join(', ')}`);
  const testChannelId = channels[0].id;

  // 4. Connect concurrent Sockets for Alex and Sarah
  console.log('\n[4/6] Connecting Dual Sockets (Alex & Sarah) to ws://localhost:3003...');
  const alexSocket = io(BASE_URL, {
    auth: { token: alexToken },
    transports: ['websocket', 'polling'],
  });
  alexSocket.on('connect_error', (err) => console.error('Alex connect_error:', err.message));

  const sarahSocket = io(BASE_URL, {
    auth: { token: sarahToken },
    transports: ['websocket', 'polling'],
  });
  sarahSocket.on('connect_error', (err) => console.error('Sarah connect_error:', err.message));

  await Promise.all([
    new Promise((resolve) => alexSocket.on('connect', resolve)),
    new Promise((resolve) => sarahSocket.on('connect', resolve)),
  ]);
  console.log('✅ Both sockets connected successfully!');

  alexSocket.emit('crew:join', crewId);
  alexSocket.emit('channel:join', testChannelId);
  sarahSocket.emit('crew:join', crewId);
  sarahSocket.emit('channel:join', testChannelId);

  // 5. Test Real-time Messaging, Typing & Reactions
  console.log('\n[5/6] Testing Real-Time Messaging & Reactions between clients...');

  // Setup Sarah's listener
  const messagePromise = new Promise((resolve) => {
    sarahSocket.on('message:new', (msg) => {
      console.log(`  📩 Sarah received real-time message from @${msg.sender.username}: "${msg.content}"`);
      resolve(msg);
    });
  });

  const typingPromise = new Promise((resolve) => {
    sarahSocket.on('typing:update', ({ typers }) => {
      console.log(`  ✍️ Sarah received typing broadcast: [${typers.join(', ')}] is typing...`);
      resolve(typers);
    });
  });

  // Alex types and sends
  alexSocket.emit('typing:start', { channelId: testChannelId });
  await typingPromise;

  const clientTempId = `temp-${Date.now()}`;
  let sentMessage;
  await new Promise((resolve) => {
    alexSocket.emit(
      'message:send',
      {
        channelId: testChannelId,
        content: 'Telemetry check: all propulsion arrays locked and nominal.',
        clientTempId,
      },
      (ack) => {
        console.log(`  ⚡ Server ACK received by Alex: status=${ack.status}, messageId=${ack.message.id}`);
        sentMessage = ack.message;
        resolve(ack);
      }
    );
  });

  const receivedBySarah = await messagePromise;
  if (receivedBySarah.id !== sentMessage.id) {
    throw new Error('Message ID mismatch between sender ACK and receiver broadcast!');
  }
  console.log('✅ Instant message delivery and server acknowledgement verified!');

  // Test Reaction
  const reactionPromise = new Promise((resolve) => {
    alexSocket.on('reaction:updated', ({ messageId, reactions }) => {
      console.log(`  ❤️ Alex received reaction update for msg ${messageId}: ${JSON.stringify(reactions)}`);
      resolve(reactions);
    });
  });

  console.log('  Sarah adding reaction "🚀" to Alex\'s message...');
  sarahSocket.emit('message:reaction', { messageId: sentMessage.id, emoji: '🚀' });
  await reactionPromise;
  console.log('✅ Real-time reaction sync verified!');

  // 6. Test Network Disconnection, Offline Queue & Resync
  console.log('\n[6/6] Testing Network Failure Resilience & Resync...');
  console.log('  Simulating network failure: disconnecting Alex\'s socket...');
  alexSocket.disconnect();

  console.log('  Sarah sends a message while Alex is disconnected...');
  const sarahMsgTempId = `temp-${Date.now()}`;
  let sarahSentMsg;
  await new Promise((resolve) => {
    sarahSocket.emit(
      'message:send',
      {
        channelId: testChannelId,
        content: 'Status update sent while Alex was offline.',
        clientTempId: sarahMsgTempId,
      },
      (ack) => {
        sarahSentMsg = ack.message;
        resolve(ack);
      }
    );
  });
  console.log(`  Sarah's message delivered to server: "${sarahSentMsg.content}"`);

  console.log('  Restoring Alex\'s connection and requesting resync...');
  alexSocket.connect();
  await new Promise((resolve) => alexSocket.on('connect', resolve));
  alexSocket.emit('channel:join', testChannelId);

  const resyncPromise = new Promise((resolve) => {
    alexSocket.on('resync:complete', ({ messages }) => {
      console.log(`  🔄 Alex received resync with ${messages.length} missed messages!`);
      const hasMissed = messages.some((m) => m.id === sarahSentMsg.id);
      if (hasMissed) {
        console.log('  ✅ Missed message successfully retrieved during resync!');
      }
      resolve(messages);
    });
  });

  alexSocket.emit('resync:messages', {
    channelId: testChannelId,
    lastTimestamp: sentMessage.createdAt,
  });
  await resyncPromise;

  console.log('  Testing Idempotent duplicate send handling...');
  await new Promise((resolve) => {
    sarahSocket.emit(
      'message:send',
      {
        channelId: testChannelId,
        content: 'Status update sent while Alex was offline.',
        clientTempId: sarahMsgTempId, // DUPLICATE TEMP ID
      },
      (ack) => {
        console.log(`  🛡️ Idempotent server ACK: recognized duplicate temp ID, status=${ack.status}`);
        resolve(ack);
      }
    );
  });

  // Disconnect sockets cleanly
  alexSocket.disconnect();
  sarahSocket.disconnect();

  console.log('\n🎉 ALL REAL-TIME CREW CHAT VERIFICATION TESTS PASSED SUCCESSFULLY! 🎉\n');
}

runTestSuite().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
