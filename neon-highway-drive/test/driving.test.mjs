import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

describe('Neon Highway Drive - Simulation Logic & Physics', () => {
  it('calculates realistic automatic gear shifting based on vehicle speed', () => {
    function calculateGear(speedKmh) {
      if (speedKmh < 45) return 1;
      if (speedKmh < 85) return 2;
      if (speedKmh < 135) return 3;
      if (speedKmh < 190) return 4;
      if (speedKmh < 245) return 5;
      return 6;
    }

    assert.equal(calculateGear(0), 1);
    assert.equal(calculateGear(35), 1);
    assert.equal(calculateGear(70), 2);
    assert.equal(calculateGear(120), 3);
    assert.equal(calculateGear(180), 4);
    assert.equal(calculateGear(220), 5);
    assert.equal(calculateGear(290), 6);
  });

  it('simulates turbo boost pressure accumulating under full throttle and dumping on lift-off', () => {
    let boostPressure = 0.0;
    const maxBoost = 1.8;

    function updateBoost(throttle, dt) {
      if (throttle > 0.8) {
        boostPressure = Math.min(boostPressure + 2.5 * dt, maxBoost);
      } else {
        boostPressure = Math.max(boostPressure - 6.0 * dt, 0.0);
      }
      return boostPressure;
    }

    // Accumulate under full throttle
    updateBoost(1.0, 0.5);
    assert.ok(boostPressure > 1.0, 'Boost should rise under heavy throttle');

    // Clamp at maximum limit
    updateBoost(1.0, 1.0);
    assert.equal(boostPressure, 1.8, 'Boost should cap at 1.8 Bar');

    // Lift off throttle (blow-off dump)
    updateBoost(0.0, 0.4);
    assert.ok(boostPressure < 0.001, 'Boost should drop rapidly on throttle release');
  });

  it('recycles procedural highway chunks seamlessly without memory accumulation', () => {
    const CHUNK_LENGTH = 120;
    const TOTAL_CHUNKS = 6;
    const chunks = [];

    // Initialize 6 chunks along Z axis
    for (let i = 0; i < TOTAL_CHUNKS; i++) {
      chunks.push({ id: i, zOffset: -i * CHUNK_LENGTH });
    }

    function recycleChunks(playerZ) {
      for (const chunk of chunks) {
        // When chunk is more than 1 chunk length behind player, recycle it to the front
        if (chunk.zOffset - playerZ > CHUNK_LENGTH) {
          const mostDistantZ = Math.min(...chunks.map((c) => c.zOffset));
          chunk.zOffset = mostDistantZ - CHUNK_LENGTH;
        }
      }
    }

    // Drive 300 meters forward (playerZ decreases in Three.js coordinates)
    recycleChunks(-350);

    // Assert that count is strictly preserved and chunks cover distance ahead
    assert.equal(chunks.length, 6, 'Chunk count must remain fixed');
    const minZ = Math.min(...chunks.map((c) => c.zOffset));
    assert.ok(minZ <= -720, 'Recycled chunks must advance ahead into the horizon');
  });

  it('correctly maps driving status flags based on telemetry thresholds', () => {
    function getStatusBadge({ speed, isDrifting, isBraking, isNitro, isAutoDrive }) {
      if (isAutoDrive) return 'AUTOPILOT';
      if (isNitro && speed > 100) return 'NITRO';
      if (isDrifting && speed > 40) return 'DRIFTING';
      if (isBraking && speed > 50) return 'HARD BRAKE';
      return 'CRUISING';
    }

    assert.equal(
      getStatusBadge({ speed: 120, isDrifting: false, isBraking: false, isNitro: false, isAutoDrive: false }),
      'CRUISING'
    );
    assert.equal(
      getStatusBadge({ speed: 110, isDrifting: true, isBraking: false, isNitro: false, isAutoDrive: false }),
      'DRIFTING'
    );
    assert.equal(
      getStatusBadge({ speed: 180, isDrifting: false, isBraking: false, isNitro: true, isAutoDrive: false }),
      'NITRO'
    );
    assert.equal(
      getStatusBadge({ speed: 90, isDrifting: false, isBraking: true, isNitro: false, isAutoDrive: false }),
      'HARD BRAKE'
    );
    assert.equal(
      getStatusBadge({ speed: 140, isDrifting: false, isBraking: false, isNitro: false, isAutoDrive: true }),
      'AUTOPILOT'
    );
  });
});
