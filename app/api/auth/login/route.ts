import { type NextRequest, NextResponse } from "next/server"
import * as jwt from "jsonwebtoken"
import store from "@/lib/store"
import { sanitizeLoginInput } from "@/lib/sanitize"
import { checkRateLimit, getRemainingRequests, getResetTime } from "@/lib/rate-limiter"
import { getClientIp, createRateLimitedResponse } from "@/lib/utils"

// Rate limit: 5 login attempts per 15 minutes per IP
const LOGIN_RATE_LIMIT = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5,
}

export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request)
    const rateLimitKey = `login:${clientIp}`

    // Check rate limit
    if (!checkRateLimit(rateLimitKey, LOGIN_RATE_LIMIT)) {
      const resetTime = getResetTime(rateLimitKey)
      const retryAfter = resetTime ? Math.ceil((resetTime - Date.now()) / 1000) : undefined
      return createRateLimitedResponse(retryAfter)
    }

    const body = await request.json()

    // Sanitize input
    const sanitization = sanitizeLoginInput(body)
    if (!sanitization.sanitized) {
      return NextResponse.json(
        {
          success: false,
          message: sanitization.errors[0],
          errors: { general: sanitization.errors },
        },
        { status: 400 },
      )
    }

    const { email, password } = sanitization.sanitized

    // Find user (in production, hash and compare passwords)
    const user = await store.findUserByEmail(email)

    if (!user || user.password !== password) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password",
        },
        { status: 401 },
      )
    }

    // Update last login
    await store.updateUserLastLogin(user.id)

    // Update user type based on activity
    if (user.userType === "new") {
      const daysSinceCreation = (Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)
      if (daysSinceCreation > 7) {
        user.userType = "existing"
      }
    }

    // Sign JWT token
    const secret = process.env.JWT_SECRET || "dev_jwt_secret"
    const token = jwt.sign({ userId: user.id }, secret, { expiresIn: "7d" })

    // Create response (token is set in httpOnly cookie, not returned in JSON)
    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        userType: user.userType,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
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
    console.error("Login error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Server error during login. Please try again.",
      },
      { status: 500 },
    )
  }
}
