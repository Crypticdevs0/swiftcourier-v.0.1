import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Parse auth token created as `token_${userId}_${timestamp}` and return the userId.
 * Handles userIds that may contain underscores.
 */
export function parseAuthToken(token?: string | null): string | null {
  if (!token || typeof token !== "string") return null
  const prefix = "token_"
  if (!token.startsWith(prefix)) return null
  const withoutPrefix = token.slice(prefix.length)
  // userId can contain underscores; timestamp is the last segment after the final underscore
  const lastUnderscore = withoutPrefix.lastIndexOf("_")
  if (lastUnderscore === -1) return withoutPrefix || null
  const userId = withoutPrefix.slice(0, lastUnderscore)
  return userId || null
}

/**
 * Deterministic pseudo-random based on input string. Returns a number in [0,1).
 * Stable for the same input, useful for demo deterministic behavior.
 */
export function deterministicRandom(seed: string): number {
  let h = 5381
  for (let i = 0; i < seed.length; i++) {
    h = (h * 33) ^ seed.charCodeAt(i)
  }
  // Convert to positive integer
  const value = Math.abs(h)
  return (value % 1000) / 1000
}
