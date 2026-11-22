import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

describe('In-Browser Phone OS - System Logic & Applications', () => {
  it('handles calculator arithmetic with continuous chaining and division guards', () => {
    function compute(a, op, b) {
      const numA = parseFloat(a);
      const numB = parseFloat(b);
      switch (op) {
        case '+': return String(numA + numB);
        case '-': return String(numA - numB);
        case '×': return String(numA * numB);
        case '÷': return numB === 0 ? 'Error' : String(numA / numB);
        default: return b;
      }
    }

    assert.equal(compute('12', '+', '8'), '20');
    assert.equal(compute('50', '-', '18'), '32');
    assert.equal(compute('6', '×', '7'), '42');
    assert.equal(compute('100', '÷', '4'), '25');
    assert.equal(compute('42', '÷', '0'), 'Error', 'Division by zero must safely report Error');
  });

  it('manages notification stacking, individual dismissal, and bulk clearance', () => {
    let notifications = [
      { id: '1', app: 'Messages', title: 'Dispatch', unread: true },
      { id: '2', app: 'Calendar', title: 'Briefing', unread: true },
      { id: '3', app: 'Security', title: 'Alarm', unread: true },
    ];

    function dismissNotification(id) {
      notifications = notifications.filter((n) => n.id !== id);
    }

    function clearAll() {
      notifications = [];
    }

    // Dismiss single
    dismissNotification('2');
    assert.equal(notifications.length, 2);
    assert.ok(!notifications.some((n) => n.id === '2'));

    // Clear all
    clearAll();
    assert.equal(notifications.length, 0);
  });

  it('validates swipe-to-unlock gesture threshold and velocity snap-back logic', () => {
    const UNLOCK_DISPLACEMENT_THRESHOLD = -140; // Pixels dragged upward
    const UNLOCK_VELOCITY_THRESHOLD = -0.65;     // Velocity flick upward

    function shouldUnlock(displacementY, velocityY) {
      return displacementY < UNLOCK_DISPLACEMENT_THRESHOLD || velocityY < UNLOCK_VELOCITY_THRESHOLD;
    }

    assert.equal(shouldUnlock(-50, -0.1), false, 'Small drag without speed should not unlock');
    assert.equal(shouldUnlock(-160, -0.2), true, 'Deep upward drag must trigger unlock');
    assert.equal(shouldUnlock(-60, -0.9), true, 'Quick flick must trigger velocity unlock');
    assert.equal(shouldUnlock(30, 0.4), false, 'Downward motion must never unlock');
  });

  it('clamps system volume and display brightness strictly between 0 and 100', () => {
    function setSystemLevel(current, delta) {
      return Math.min(100, Math.max(0, current + delta));
    }

    assert.equal(setSystemLevel(80, 30), 100, 'Volume must clamp at 100 maximum');
    assert.equal(setSystemLevel(20, -50), 0, 'Brightness must clamp at 0 minimum');
    assert.equal(setSystemLevel(50, 15), 65);
  });
});
