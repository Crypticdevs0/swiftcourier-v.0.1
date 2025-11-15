/**
 * Input sanitization utilities for authentication and user data
 */

/**
 * Trim and validate string input
 */
export function sanitizeString(input: unknown, maxLength: number = 255): string | null {
  if (typeof input !== "string") return null
  const trimmed = input.trim()
  if (trimmed.length === 0 || trimmed.length > maxLength) return null
  return trimmed
}

/**
 * Sanitize email address (trim, lowercase, basic validation)
 */
export function sanitizeEmail(input: unknown): string | null {
  const sanitized = sanitizeString(input, 254)
  if (!sanitized) return null
  const email = sanitized.toLowerCase()
  // Basic email regex
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null
  return email
}

/**
 * Sanitize password (trim, no validation of content)
 * Validation should be done separately
 */
export function sanitizePassword(input: unknown): string | null {
  // Don't trim passwords as they might intentionally have spaces
  if (typeof input !== "string") return null
  if (input.length === 0 || input.length > 128) return null
  return input
}

/**
 * Sanitize name field (letters, spaces, hyphens, apostrophes)
 */
export function sanitizeName(input: unknown, maxLength: number = 100): string | null {
  const sanitized = sanitizeString(input, maxLength)
  if (!sanitized) return null
  // Allow letters, spaces, hyphens, apostrophes
  if (!/^[a-zA-Z\s\-']{2,}$/.test(sanitized)) return null
  return sanitized
}

/**
 * Sanitize phone number (digits, spaces, dashes, parentheses, plus)
 */
export function sanitizePhone(input: unknown): string | null {
  const sanitized = sanitizeString(input, 20)
  if (!sanitized) return null
  // Allow digits, spaces, dashes, parentheses, plus for international
  if (!/^[\d\s\-\(\)\+]{7,}$/.test(sanitized)) return null
  return sanitized
}

/**
 * Validate password strength
 * Minimum 6 characters required
 */
export function validatePasswordStrength(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (password.length < 6) {
    errors.push("Password must be at least 6 characters")
  }

  if (password.length > 128) {
    errors.push("Password must not exceed 128 characters")
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Batch sanitization for registration data
 */
export function sanitizeRegistrationInput(data: any): {
  sanitized: {
    firstName: string
    lastName: string
    email: string
    phone: string
    password: string
  } | null
  errors: string[]
} {
  const errors: string[] = []

  const firstName = sanitizeName(data.firstName, 100)
  if (!firstName) errors.push("First name is invalid or missing")

  const lastName = sanitizeName(data.lastName, 100)
  if (!lastName) errors.push("Last name is invalid or missing")

  const email = sanitizeEmail(data.email)
  if (!email) errors.push("Email is invalid or missing")

  const phone = sanitizePhone(data.phone)
  if (!phone) errors.push("Phone number is invalid")

  const password = sanitizePassword(data.password)
  if (!password) errors.push("Password is invalid or missing")

  if (errors.length > 0) {
    return { sanitized: null, errors }
  }

  return {
    sanitized: {
      firstName: firstName!,
      lastName: lastName!,
      email: email!,
      phone: phone!,
      password: password!,
    },
    errors: [],
  }
}

/**
 * Batch sanitization for login data
 */
export function sanitizeLoginInput(data: any): {
  sanitized: { email: string; password: string } | null
  errors: string[]
} {
  const errors: string[] = []

  const email = sanitizeEmail(data.email)
  if (!email) errors.push("Email is invalid or missing")

  const password = sanitizePassword(data.password)
  if (!password) errors.push("Password is invalid or missing")

  if (errors.length > 0) {
    return { sanitized: null, errors }
  }

  return {
    sanitized: {
      email: email!,
      password: password!,
    },
    errors: [],
  }
}

/**
 * Batch sanitization for forgot password data
 */
export function sanitizeForgotPasswordInput(data: any): {
  sanitized: { email: string } | null
  errors: string[]
} {
  const errors: string[] = []

  const email = sanitizeEmail(data.email)
  if (!email) errors.push("Email is invalid or missing")

  if (errors.length > 0) {
    return { sanitized: null, errors }
  }

  return {
    sanitized: { email: email! },
    errors: [],
  }
}

/**
 * Batch sanitization for password reset data
 */
export function sanitizeResetPasswordInput(data: any): {
  sanitized: { password: string; confirmPassword: string } | null
  errors: string[]
} {
  const errors: string[] = []

  const password = sanitizePassword(data.password)
  if (!password) errors.push("Password is invalid or missing")

  const confirmPassword = sanitizePassword(data.confirmPassword)
  if (!confirmPassword) errors.push("Confirm password is invalid or missing")

  if (password && confirmPassword && password !== confirmPassword) {
    errors.push("Passwords do not match")
  }

  if (errors.length > 0) {
    return { sanitized: null, errors }
  }

  return {
    sanitized: {
      password: password!,
      confirmPassword: confirmPassword!,
    },
    errors: [],
  }
}
