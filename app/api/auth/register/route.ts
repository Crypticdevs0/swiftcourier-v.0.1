import { type NextRequest, NextResponse } from "next/server"
import * as jwt from "jsonwebtoken"
import store from "@/lib/store"
import { sanitizeRegistrationInput, validatePasswordStrength } from "@/lib/sanitize"
import { checkRateLimit, getRemainingRequests, getResetTime } from "@/lib/rate-limiter"
import { getClientIp, createRateLimitedResponse } from "@/lib/utils"

// Rate limit: 3 registration attempts per hour per IP
const REGISTER_RATE_LIMIT = {
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 3,
}

export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request)
    const rateLimitKey = `register:${clientIp}`

    // Check rate limit
    if (!checkRateLimit(rateLimitKey, REGISTER_RATE_LIMIT)) {
      const resetTime = getResetTime(rateLimitKey)
      const retryAfter = resetTime ? Math.ceil((resetTime - Date.now()) / 1000) : undefined
      return createRateLimitedResponse(retryAfter)
    }

    const body = await request.json()

    // Sanitize input
    const sanitization = sanitizeRegistrationInput(body)
    if (!sanitization.sanitized) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: { general: sanitization.errors },
        },
        { status: 400 },
      )
    }

    const { firstName, lastName, email, password, phone } = sanitization.sanitized

    // Validate password strength
    const passwordValidation = validatePasswordStrength(password)
    if (!passwordValidation.valid) {
      return NextResponse.json(
        {
          success: false,
          message: passwordValidation.errors[0],
          errors: { password: passwordValidation.errors },
        },
        { status: 400 },
      )
    }

    // Verify passwords match
    if (password !== body.confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: { confirmPassword: ["Passwords do not match"] },
        },
        { status: 400 },
      )
    }

    // Check if user already exists
    const existingUser = await store.findUserByEmail(email)
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User with this email already exists",
          errors: { email: ["Email already registered"] },
        },
        { status: 409 },
      )
    }

    // Create new user
    const newUser = await store.createUser({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      name: `${firstName.trim()} ${lastName.trim()}`,
      email: email.toLowerCase(),
      password, // In production, hash this password
      role: "user",
      userType: "new",
      phone: phone || "",
    } as any)

    // Sign JWT token
    const secret = process.env.JWT_SECRET || "dev_jwt_secret"
    const token = jwt.sign({ userId: newUser.id }, secret, { expiresIn: "7d" })

    // Create response (token is set in httpOnly cookie, not returned in JSON)
    const response = NextResponse.json({
      success: true,
      message: "Registration successful",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role,
        userType: newUser.userType,
        createdAt: newUser.createdAt,
      },
    })

    // Set HTTP-only cookie (use SameSite=None and Secure to allow cookies in embedded previews)
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Server error during registration. Please try again.",
      },
      { status: 500 },
    )
  }
}
