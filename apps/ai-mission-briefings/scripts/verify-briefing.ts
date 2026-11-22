const BASE_URL = 'http://localhost:3004';

async function runTestSuite() {
  console.log('🚀 Starting AI Mission Briefings Verification Test Suite...\n');

  // 1. Test POST /api/briefing Streaming Endpoint
  console.log('[1/4] Testing SSE Streaming Endpoint (/api/briefing)...');
  const response = await fetch(`${BASE_URL}/api/briefing`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: 'Execute orbital reconnaissance on satellite node SIGMA-4.',
    }),
  });

  if (!response.ok || !response.body) {
    throw new Error(`API returned HTTP ${response.status}: ${response.statusText}`);
  }
  console.log('✅ SSE Stream connection established (Status: 200 OK)');

  // 2. Consume Stream Chunks
  console.log('\n[2/4] Consuming Token & Tool Chunks from Stream...');
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let tokenCount = 0;
  let toolStarts = 0;
  let toolEnds = 0;
  let cardCount = 0;

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith('data: ')) continue;
      const jsonStr = trimmed.slice(6);
      if (!jsonStr) continue;

      try {
        const chunk = JSON.parse(jsonStr);
        if (chunk.type === 'token') {
          tokenCount++;
        } else if (chunk.type === 'tool_start') {
          toolStarts++;
          console.log(`  🔧 Server Tool Initiated: ${chunk.record.toolName}`);
        } else if (chunk.type === 'tool_end') {
          toolEnds++;
          console.log(`  ⚡ Server Tool Executed: ${chunk.record.toolName} (Status: ${chunk.record.status})`);
        } else if (chunk.type === 'card') {
          cardCount++;
          console.log(`  📋 Intelligence Card Delivered: [${chunk.card.type}] - "${chunk.card.title}"`);
        } else if (chunk.type === 'done') {
          console.log('  🏁 Stream termination received');
        }
      } catch (err) {
        console.error('Parse error:', err);
      }
    }
  }

  console.log(`\nStream Metrics Summary:`);
  console.log(`  - Tokens Streamed: ${tokenCount}`);
  console.log(`  - Tools Executed: ${toolEnds}/${toolStarts}`);
  console.log(`  - Intelligence Cards Generated: ${cardCount}`);

  if (tokenCount < 10) throw new Error('Expected at least 10 tokens streamed');
  if (toolEnds < 1) throw new Error('Expected at least 1 tool executed');
  if (cardCount < 1) throw new Error('Expected at least 1 intelligence card generated');
  console.log('✅ Token streaming, tool execution, and card generation verified!');

  // 3. Test Server Allowlist Tool Enforcement
  console.log('\n[3/4] Testing Server Tool Security Allowlist & Rejection...');
  const { executeServerTool } = await import('../src/ai/tools/index');
  const unauthorizedResult = await executeServerTool(
    'test-call-id',
    'arbitrary_unauthorized_tool',
    { cmd: 'rm -rf /' }
  );
  if (unauthorizedResult.record.status !== 'denied') {
    throw new Error('Security vulnerability: Unauthorized tool was not denied!');
  }
  console.log(`  🛡️ Unauthorized tool correctly DENIED: "${unauthorizedResult.record.error}"`);
  console.log('✅ Server tool allowlist security enforcement verified!');

  // 4. Test Malformed Input Safe Fallback
  console.log('\n[4/4] Testing Zod Validation & Anomaly Safe Fallback...');
  const { safeParseCard } = await import('../src/ai/schemas/index');
  const corruptPayload = {
    type: 'mission_summary',
    title: 'Corrupted Ingress',
    data: { invalidField: 123 }, // Missing title, objective, overview
  };
  const parseResult = safeParseCard(corruptPayload);
  if (parseResult.success) {
    throw new Error('Expected validation failure on malformed payload');
  }
  if (parseResult.fallback.type !== 'fallback_error') {
    throw new Error('Expected fallback card of type fallback_error');
  }
  console.log(`  🛡️ Malformed data quarantined into safe fallback: "${parseResult.fallback.title}"`);
  console.log('✅ Zod schema validation & safe error quarantine verified!');

  console.log('\n🎉 ALL AI MISSION BRIEFINGS VERIFICATION TESTS PASSED! 🎉\n');
}

runTestSuite().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
