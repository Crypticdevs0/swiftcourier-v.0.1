import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import * as jwt from "jsonwebtoken"
import { type NextRequest, NextResponse } from "next/server"

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

/**
 * Extract and validate authentication token from request
 * Returns userId if valid, null otherwise
 */
export function extractAuthFromRequest(request: NextRequest): string | null {
  const authToken = request.cookies.get("auth-token")?.value

  if (!authToken) {
    return null
  }

  return parseAuthToken(authToken)
}

/**
 * Helper to create standardized 401 Unauthorized response
 */
export function createUnauthorizedResponse(message: string = "Unauthorized"): NextResponse {
  return NextResponse.json(
    {
      success: false,
      message,
    },
    { status: 401 }
  )
}

/**
 * Helper to create standardized 403 Forbidden response
 */
export function createForbiddenResponse(message: string = "Forbidden"): NextResponse {
  return NextResponse.json(
    {
      success: false,
      message,
    },
    { status: 403 }
  )
}

/**
 * Helper to create standardized 429 Too Many Requests response
 */
export function createRateLimitedResponse(
  retryAfter?: number
): NextResponse {
  const response = NextResponse.json(
    {
      success: false,
      message: "Too many requests, please try again later",
    },
    { status: 429 }
  )

  if (retryAfter) {
    response.headers.set("Retry-After", String(retryAfter))
  }

  return response
}

/**
 * Extract client IP address from request
 */
export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) {
    return forwarded.split(",")[0].trim()
  }
  return request.headers.get("x-real-ip") || "unknown"
}
