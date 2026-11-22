import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

describe('Real-Time Crew Chat - Reliability Engine & Protocol', () => {
  it('generates unique client temporary IDs and prevents duplicate message storage', () => {
    const receivedIds = new Set();
    const storedMessages = [];

    function processMessage(msg) {
      if (receivedIds.has(msg.clientTempId)) {
        return { status: 'duplicate', id: msg.clientTempId };
      }
      receivedIds.add(msg.clientTempId);
      storedMessages.push(msg);
      return { status: 'stored', id: msg.clientTempId };
    }

    const msg1 = { clientTempId: 'temp-1774000-abc1', content: 'Delta team moving to rally point.' };
    const res1 = processMessage(msg1);
    assert.equal(res1.status, 'stored');
    assert.equal(storedMessages.length, 1);

    // Re-sent duplicate (e.g., due to packet retransmission)
    const resDuplicate = processMessage(msg1);
    assert.equal(resDuplicate.status, 'duplicate');
    assert.equal(storedMessages.length, 1, 'Duplicate message must not be inserted twice');
  });

  it('queues messages sent while offline and flushes sequentially upon reconnect', () => {
    let isConnected = false;
    const offlineQueue = [];
    const transmittedMessages = [];

    function sendMessage(content) {
      const msg = { clientTempId: `temp-${Date.now()}-${Math.random()}`, content };
      if (!isConnected) {
        offlineQueue.push(msg);
        return { status: 'queued' };
      }
      transmittedMessages.push(msg);
      return { status: 'sent' };
    }

    function onSocketReconnect() {
      isConnected = true;
      while (offlineQueue.length > 0) {
        const nextMsg = offlineQueue.shift();
        transmittedMessages.push(nextMsg);
      }
    }

    // Try sending 3 messages during disconnection
    sendMessage('First offline packet');
    sendMessage('Second offline packet');
    sendMessage('Third offline packet');

    assert.equal(offlineQueue.length, 3);
    assert.equal(transmittedMessages.length, 0);

    // Trigger reconnect
    onSocketReconnect();

    assert.equal(offlineQueue.length, 0, 'Offline queue must be completely flushed');
    assert.equal(transmittedMessages.length, 3, 'All offline messages must be delivered');
    assert.equal(transmittedMessages[0].content, 'First offline packet');
  });

  it('manages emoji reactions with accurate user toggle state and counts', () => {
    const reactions = [
      { emoji: '🔥', count: 2, users: ['user-1', 'user-2'] },
    ];

    function toggleReaction(emoji, userId) {
      let reaction = reactions.find((r) => r.emoji === emoji);
      if (!reaction) {
        reaction = { emoji, count: 0, users: [] };
        reactions.push(reaction);
      }

      const userIndex = reaction.users.indexOf(userId);
      if (userIndex >= 0) {
        reaction.users.splice(userIndex, 1);
        reaction.count--;
      } else {
        reaction.users.push(userId);
        reaction.count++;
      }
    }

    // User 3 adds fire
    toggleReaction('🔥', 'user-3');
    assert.equal(reactions.find((r) => r.emoji === '🔥').count, 3);

    // User 1 removes fire
    toggleReaction('🔥', 'user-1');
    assert.equal(reactions.find((r) => r.emoji === '🔥').count, 2);

    // User 1 adds skull
    toggleReaction('💀', 'user-1');
    assert.equal(reactions.find((r) => r.emoji === '💀').count, 1);
  });

  it('prunes stale typing indicators when no updates arrive within 3 seconds', () => {
    let typers = [
      { userId: 'u1', username: 'Alex', lastTyped: Date.now() - 1000 },
      { userId: 'u2', username: 'Sarah', lastTyped: Date.now() - 4000 }, // Stale (> 3s)
    ];

    function pruneTypers(now) {
      typers = typers.filter((t) => now - t.lastTyped < 3000);
    }

    pruneTypers(Date.now());
    assert.equal(typers.length, 1);
    assert.equal(typers[0].username, 'Alex');
  });
});
