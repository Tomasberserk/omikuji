/**
 * Pure shake detector, separated from React so it can be unit tested.
 *
 * A deliberate shake produces large frame-to-frame changes in acceleration.
 * Walking or handling the phone stays well below `threshold`.
 * Three strong changes must happen inside `hitWindowMs`, which filters out
 * single jolts (putting the phone down, a bump).
 */
export function createShakeDetector({
  threshold = 18,
  hitsNeeded = 3,
  hitWindowMs = 900,
  cooldownMs = 1500,
  armDelayMs = 900,
} = {}) {
  let armedAt = 0
  let last = null
  let hits = []
  let lastFire = -Infinity

  return {
    /** Starts a grace period so picking up the phone is not a shake. */
    arm(now) {
      armedAt = now + armDelayMs
      last = null
      hits = []
    },

    /** Returns true exactly once per detected shake. */
    push(acceleration, now) {
      if (!acceleration || acceleration.x == null) return false

      if (now < armedAt || now - lastFire < cooldownMs) {
        last = acceleration
        return false
      }

      if (!last) {
        last = acceleration
        return false
      }

      const delta =
        Math.abs(acceleration.x - last.x) +
        Math.abs(acceleration.y - last.y) +
        Math.abs(acceleration.z - last.z)

      last = acceleration

      if (delta <= threshold) return false

      hits = hits.filter((time) => now - time < hitWindowMs)
      hits.push(now)

      if (hits.length < hitsNeeded) return false

      hits = []
      lastFire = now
      return true
    },
  }
}
