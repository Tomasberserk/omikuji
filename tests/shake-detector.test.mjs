import test from 'node:test'
import assert from 'node:assert/strict'
import { createShakeDetector } from '../src/lib/shakeDetector.js'

const sample = (x) => ({ x, y: 10, z: 9.8 })

function pushAll(detector, values, start = 1000, step = 16) {
  let fired = false
  values.forEach((value, index) => {
    if (detector.push(sample(value), start + index * step)) fired = true
  })
  return fired
}

test('ignores gentle movement', () => {
  const detector = createShakeDetector()
  detector.arm(0)
  const gentle = Array.from({ length: 30 }, (_, index) => (index % 2 ? 1.2 : -1.2))
  assert.equal(pushAll(detector, gentle), false)
})

test('fires after three strong changes', () => {
  const detector = createShakeDetector()
  detector.arm(0)
  const strong = Array.from({ length: 6 }, (_, index) => (index % 2 ? 26 : -26))
  assert.equal(pushAll(detector, strong), true)
})

test('does not fire during the arming delay', () => {
  const detector = createShakeDetector()
  detector.arm(1000) // armed at 1900
  let fired = false
  for (let index = 0; index < 6; index += 1) {
    fired = detector.push(sample(index % 2 ? 26 : -26), 1000 + index * 16) || fired
  }
  assert.equal(fired, false)
})

test('does not fire when the hits are spread outside the window', () => {
  const detector = createShakeDetector()
  detector.arm(0)
  let fired = false
  fired = detector.push(sample(-26), 1000) || fired
  fired = detector.push(sample(26), 2500) || fired
  fired = detector.push(sample(-26), 4000) || fired
  fired = detector.push(sample(26), 5500) || fired
  assert.equal(fired, false)
})

test('ignores empty acceleration readings', () => {
  const detector = createShakeDetector()
  detector.arm(0)
  assert.equal(detector.push(null, 1000), false)
  assert.equal(detector.push({ x: null, y: null, z: null }, 1016), false)
})

test('respects the cooldown between shakes', () => {
  const detector = createShakeDetector({ cooldownMs: 1500 })
  detector.arm(0)
  let fired = 0

  const shakeAt = (time) => {
    for (let index = 0; index < 6; index += 1) {
      if (detector.push(sample(index % 2 ? 26 : -26), time + index * 16)) fired += 1
    }
  }

  shakeAt(1000)
  shakeAt(1500) // still inside the 1500 ms cooldown
  shakeAt(3000)

  assert.equal(fired, 2)
})
