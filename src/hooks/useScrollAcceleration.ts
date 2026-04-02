/**
 * useScrollAcceleration — macOS-style scroll acceleration.
 *
 * Tracks scroll events and applies acceleration when the user scrolls
 * quickly (multiple events in rapid succession). Returns a multiplier
 * that increases with scroll velocity.
 *
 * Config:
 * - baseSpeed: minimum lines per scroll event (default: 3)
 * - maxSpeed: maximum lines per scroll event (default: 15)
 * - decayMs: time before acceleration resets (default: 150ms)
 */
import { useCallback, useRef } from 'react'

type ScrollAccelerationConfig = {
  baseSpeed?: number
  maxSpeed?: number
  decayMs?: number
  enabled?: boolean
}

export function useScrollAcceleration(config: ScrollAccelerationConfig = {}) {
  const {
    baseSpeed = 3,
    maxSpeed = 15,
    decayMs = 150,
    enabled = true,
  } = config

  const lastScrollTime = useRef(0)
  const velocity = useRef(0)

  const getScrollLines = useCallback((): number => {
    if (!enabled) return baseSpeed

    const now = Date.now()
    const elapsed = now - lastScrollTime.current

    if (elapsed < decayMs) {
      // Accelerate: increase velocity based on rapid scrolling
      velocity.current = Math.min(velocity.current + 1, maxSpeed - baseSpeed)
    } else {
      // Decay: reset velocity if enough time has passed
      velocity.current = Math.max(0, velocity.current - Math.floor(elapsed / decayMs))
    }

    lastScrollTime.current = now
    return Math.min(baseSpeed + velocity.current, maxSpeed)
  }, [baseSpeed, maxSpeed, decayMs, enabled])

  const resetAcceleration = useCallback(() => {
    velocity.current = 0
    lastScrollTime.current = 0
  }, [])

  return { getScrollLines, resetAcceleration }
}
