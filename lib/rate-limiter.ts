/**
 * Simple in-memory rate limiter for public endpoints
 * In production, consider using Redis or a dedicated rate-limiting service
 */

interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Maximum requests per window
}

interface RequestRecord {
  count: number
  resetTime: number
}

const requestMap = new Map<string, RequestRecord>()

/**
 * Check if a request should be rate limited
 * @param identifier - Unique identifier (IP address, user ID, etc)
 * @param config - Rate limit configuration
 * @returns true if request should be allowed, false if rate limited
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): boolean {
  const now = Date.now()
  const record = requestMap.get(identifier)

  // If no record exists or time window has passed, create new record
  if (!record || now >= record.resetTime) {
    requestMap.set(identifier, {
      count: 1,
      resetTime: now + config.windowMs,
    })
    return true
  }

  // Increment counter
  record.count++

  // Check if limit exceeded
  if (record.count > config.maxRequests) {
    return false
  }

  return true
}

/**
 * Get remaining requests for an identifier
 */
export function getRemainingRequests(
  identifier: string,
  config: RateLimitConfig
): number {
  const record = requestMap.get(identifier)
  const now = Date.now()

  if (!record || now >= record.resetTime) {
    return config.maxRequests
  }

  return Math.max(0, config.maxRequests - record.count)
}

/**
 * Get reset time for an identifier
 */
export function getResetTime(identifier: string): number | null {
  const record = requestMap.get(identifier)
  return record ? record.resetTime : null
}

/**
 * Clear all rate limit records (for testing)
 */
export function clearRateLimitCache(): void {
  requestMap.clear()
}
