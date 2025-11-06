import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import * as jwt from "jsonwebtoken"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Verify JWT auth token and return the userId from the payload.
 * Falls back to a development secret when JWT_SECRET is not provided.
 */
export function parseAuthToken(token?: string | null): string | null {
  if (!token || typeof token !== "string") return null
  try {
    const secret = process.env.JWT_SECRET || "dev_jwt_secret"
    const decoded = jwt.verify(token, secret) as any
    return decoded?.userId || null
  } catch (err) {
    return null
  }
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
