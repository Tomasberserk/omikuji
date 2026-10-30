import { useCallback, useEffect, useRef, useState } from 'react'

// A deliberate shake produces large frame-to-frame changes in acceleration.
// Walking or handling the phone stays well below this.
const DELTA_THRESHOLD = 18
const HITS_NEEDED = 3
const HIT_WINDOW_MS = 900
const COOLDOWN_MS = 1500
const ARM_DELAY_MS = 900
const SIGNAL_TIMEOUT_MS = 2500

/**
 * Detects a physical phone shake using the DeviceMotion API.
 *
 * status:
 *  - 'needs-permission' → iOS 13+: must call requestPermission() from a user gesture
 *  - 'listening'        → sensor events are being read
 *  - 'denied'           → the user blocked motion access
 *  - 'unsupported'      → the browser has no DeviceMotion at all
 */
export function useShake({ onShake, enabled }) {
  const [status, setStatus] = useState(() => {
    if (typeof window === 'undefined' || !('DeviceMotionEvent' in window)) return 'unsupported'
    if (typeof DeviceMotionEvent.requestPermission === 'function') return 'needs-permission'
    return 'listening'
  })
  const [hasSignal, setHasSignal] = useState(false)
  const [noSignal, setNoSignal] = useState(false)

  const onShakeRef = useRef(onShake)
  useEffect(() => {
    onShakeRef.current = onShake
  }, [onShake])

  const signalRef = useRef(false)

  const requestPermission = useCallback(async () => {
    if (
      typeof DeviceMotionEvent === 'undefined' ||
      typeof DeviceMotionEvent.requestPermission !== 'function'
    ) {
      setStatus('listening')
      return 'granted'
    }

    try {
      const result = await DeviceMotionEvent.requestPermission()
      setStatus(result === 'granted' ? 'listening' : 'denied')
      return result
    } catch {
      setStatus('denied')
      return 'denied'
    }
  }, [])

  // Show a "no motion here" hint when the sensor never reports anything (desktop, some tablets).
  useEffect(() => {
    if (!enabled || status !== 'listening' || hasSignal) {
      setNoSignal(false)
      return
    }
    const timer = setTimeout(() => setNoSignal(true), SIGNAL_TIMEOUT_MS)
    return () => clearTimeout(timer)
  }, [enabled, status, hasSignal])

  useEffect(() => {
    if (!enabled || status !== 'listening') return

    const armedAt = performance.now() + ARM_DELAY_MS
    let last = null
    let hits = []
    let lastFire = 0

    const handleMotion = (event) => {
      const accel = event.accelerationIncludingGravity || event.acceleration
      if (!accel || accel.x == null) return

      if (!signalRef.current) {
        signalRef.current = true
        setHasSignal(true)
      }

      const now = performance.now()
      if (now < armedAt || now - lastFire < COOLDOWN_MS) {
        last = accel
        return
      }

      if (last) {
        const delta =
          Math.abs(accel.x - last.x) +
          Math.abs(accel.y - last.y) +
          Math.abs(accel.z - last.z)

        if (delta > DELTA_THRESHOLD) {
          hits = hits.filter((time) => now - time < HIT_WINDOW_MS)
          hits.push(now)

          if (hits.length >= HITS_NEEDED) {
            hits = []
            lastFire = now
            last = accel
            onShakeRef.current?.()
            return
          }
        }
      }

      last = accel
    }

    window.addEventListener('devicemotion', handleMotion, { passive: true })
    return () => window.removeEventListener('devicemotion', handleMotion)
  }, [enabled, status])

  return { status, hasSignal, noSignal, requestPermission }
}
