import { type NextRequest, NextResponse } from "next/server"
import store from "@/lib/store"
import { sanitizeForgotPasswordInput, validatePasswordStrength } from "@/lib/sanitize"
import crypto from "crypto"

// In-memory store for password reset tokens (in production, use a database)
const resetTokens = new Map<
  string,
  {
    email: string
    token: string
    expiresAt: number
    userId: string
  }
>()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Sanitize input
    const sanitization = sanitizeForgotPasswordInput(body)
    if (!sanitization.sanitized) {
      return NextResponse.json(
        {
          success: false,
          message: sanitization.errors[0] || "Invalid request",
          errors: { email: sanitization.errors },
        },
        { status: 400 },
      )
    }

    const { email } = sanitization.sanitized

    // Find user by email
    const user = await store.findUserByEmail(email)

    if (!user) {
      // For security, don't reveal if user exists
      return NextResponse.json(
        {
          success: true,
          message: "If an account exists with that email, a password reset link has been sent.",
        },
        { status: 200 },
      )
    }

    // Generate reset token (32 bytes of random data, hex encoded)
    const resetToken = crypto.randomBytes(32).toString("hex")
    const expiresAt = Date.now() + 1 * 60 * 60 * 1000 // 1 hour

    // Store reset token
    resetTokens.set(resetToken, {
      email,
      token: resetToken,
      expiresAt,
      userId: user.id,
    })

    // In production, send email with reset link containing the token
    // TODO: Implement email sending with reset link

    return NextResponse.json(
      {
        success: true,
        message: "If an account exists with that email, a password reset link has been sent.",
        // In production, never return the token to client
        // For demo purposes, we return it (not recommended for production)
        ...(process.env.NODE_ENV === "development" && { token: resetToken }),
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Server error processing password reset request.",
      },
      { status: 500 },
    )
  }
}

// GET endpoint to verify reset token
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const token = searchParams.get("token")

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Reset token is required",
        },
        { status: 400 },
      )
    }

    const resetData = resetTokens.get(token)

    if (!resetData) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired reset token",
        },
        { status: 400 },
      )
    }

    if (resetData.expiresAt < Date.now()) {
      resetTokens.delete(token)
      return NextResponse.json(
        {
          success: false,
          message: "Reset token has expired",
        },
        { status: 400 },
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: "Valid reset token",
        email: resetData.email,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Verify reset token error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Server error verifying reset token",
      },
      { status: 500 },
    )
  }
}

// Export for use in other modules
export function getResetTokenData(token: string) {
  return resetTokens.get(token)
}

export function deleteResetToken(token: string) {
  resetTokens.delete(token)
}
