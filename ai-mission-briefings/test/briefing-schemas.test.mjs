import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

describe('AI Mission Briefings - Validation & Security Engine', () => {
  const ALLOWED_TOOLS = [
    'scan_threat_intelligence',
    'satellite_reconnaissance',
    'assess_resource_readiness',
    'analyze_telemetry_anomalies',
  ];

  it('enforces strict server tool allowlist authorization', () => {
    function authorizeToolCall(toolName) {
      if (!ALLOWED_TOOLS.includes(toolName)) {
        return { status: 'denied', reason: `Unauthorized tool: ${toolName}` };
      }
      return { status: 'authorized' };
    }

    assert.equal(authorizeToolCall('satellite_reconnaissance').status, 'authorized');
    assert.equal(authorizeToolCall('scan_threat_intelligence').status, 'authorized');
    assert.equal(authorizeToolCall('execute_shell_command').status, 'denied');
    assert.equal(authorizeToolCall('access_file_system').status, 'denied');
    assert.equal(authorizeToolCall('arbitrary_code_eval').status, 'denied');
  });

  it('validates structured intelligence cards and detects schema violations', () => {
    function validateCard(card) {
      if (!card || typeof card !== 'object') return { valid: false, error: 'Must be an object' };
      if (!card.id || typeof card.id !== 'string') return { valid: false, error: 'Missing card id' };
      if (!card.type || typeof card.type !== 'string') return { valid: false, error: 'Missing card type' };
      if (!card.title || typeof card.title !== 'string') return { valid: false, error: 'Missing card title' };
      if (!card.data || typeof card.data !== 'object') return { valid: false, error: 'Missing card data' };
      return { valid: true };
    }

    const validCard = {
      id: 'card-1',
      type: 'mission_summary',
      title: 'Orbital Reconnaissance Briefing',
      data: { objective: 'Track SIGMA-4 node', classification: 'TOP SECRET' },
    };
    assert.equal(validateCard(validCard).valid, true);

    const invalidCardNoTitle = {
      id: 'card-2',
      type: 'mission_summary',
      data: { objective: 'Incomplete card' },
    };
    assert.equal(validateCard(invalidCardNoTitle).valid, false);
  });

  it('safely recovers and quarantines malformed model output into FallbackCard without crashing', () => {
    function safeParseCard(rawJson) {
      try {
        const parsed = JSON.parse(rawJson);
        if (!parsed.type || !parsed.title) {
          throw new Error('Incomplete intelligence schema');
        }
        return { success: true, card: parsed };
      } catch (err) {
        // Safe quarantine fallback
        return {
          success: false,
          card: {
            id: `fallback-${Date.now()}`,
            type: 'fallback_anomaly',
            title: 'Model Output Anomaly Intercepted',
            data: {
              rawContent: rawJson,
              errorDiagnostics: err.message,
              quarantineStatus: 'CONTAINED',
            },
          },
        };
      }
    }

    // Malformed JSON string
    const malformedPayload = '{"type": "risk_assessment", "data": broken_json...';
    const result = safeParseCard(malformedPayload);

    assert.equal(result.success, false);
    assert.equal(result.card.type, 'fallback_anomaly');
    assert.equal(result.card.data.quarantineStatus, 'CONTAINED');
    assert.ok(result.card.data.errorDiagnostics.length > 0);
  });

  it('generates deterministic mock scenario tokens without external API keys', () => {
    function getMockScenario(key) {
      const scenarios = {
        orbital: {
          title: 'Orbital Satellite Intercept',
          tokens: ['Satellite', 'node', 'SIGMA-4', 'detected', 'in', 'LEO', 'orbit.'],
          toolCalls: ['satellite_reconnaissance'],
        },
        cyber: {
          title: 'Critical Infrastructure Breach',
          tokens: ['Anomalous', 'packets', 'detected', 'at', 'power', 'grid', 'substation.'],
          toolCalls: ['scan_threat_intelligence'],
        },
      };
      return scenarios[key] || scenarios.orbital;
    }

    const scenario = getMockScenario('orbital');
    assert.equal(scenario.title, 'Orbital Satellite Intercept');
    assert.equal(scenario.tokens.length, 7);
    assert.ok(scenario.toolCalls.includes('satellite_reconnaissance'));
  });
});
