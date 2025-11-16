import crypto from "crypto"

interface CSRFTokenData {
  token: string
  timestamp: number
}

// Store CSRF tokens in memory with expiration (1 hour)
const csrfTokens = new Map<string, number>()
const TOKEN_EXPIRY = 60 * 60 * 1000 // 1 hour

/**
 * Generate a CSRF token
 * In production, you might want to store this in Redis or a database
 */
export function generateCSRFToken(): string {
  const token = crypto.randomBytes(32).toString("hex")
  const timestamp = Date.now()
  csrfTokens.set(token, timestamp)
  
  // Clean up expired tokens periodically
  if (csrfTokens.size > 1000) {
    cleanupExpiredTokens()
  }
  
  return token
}

/**
 * Verify a CSRF token
 */
export function verifyCSRFToken(token: string): boolean {
  if (!token || typeof token !== "string") return false
  
  const timestamp = csrfTokens.get(token)
  if (!timestamp) return false
  
  const isExpired = Date.now() - timestamp > TOKEN_EXPIRY
  if (isExpired) {
    csrfTokens.delete(token)
    return false
  }
  
  // Token is valid - remove it (single-use)
  csrfTokens.delete(token)
  return true
}

/**
 * Clean up expired tokens
 */
function cleanupExpiredTokens(): void {
  const now = Date.now()
  for (const [token, timestamp] of csrfTokens.entries()) {
    if (now - timestamp > TOKEN_EXPIRY) {
      csrfTokens.delete(token)
    }
  }
}
