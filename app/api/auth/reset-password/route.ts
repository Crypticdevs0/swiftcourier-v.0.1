import { type NextRequest, NextResponse } from "next/server"
import store from "@/lib/store"
import { sanitizeResetPasswordInput, validatePasswordStrength } from "@/lib/sanitize"
import { getResetTokenData, deleteResetToken } from "../forgot-password/route"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token } = body

    if (!token || typeof token !== "string") {
      return NextResponse.json(
        {
          success: false,
          message: "Reset token is required",
        },
        { status: 400 },
      )
    }

    // Verify reset token exists and is not expired
    const resetData = getResetTokenData(token)

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
      deleteResetToken(token)
      return NextResponse.json(
        {
          success: false,
          message: "Reset token has expired",
        },
        { status: 400 },
      )
    }

    // Sanitize password input
    const sanitization = sanitizeResetPasswordInput(body)
    if (!sanitization.sanitized) {
      return NextResponse.json(
        {
          success: false,
          message: sanitization.errors[0] || "Invalid request",
          errors: { password: sanitization.errors },
        },
        { status: 400 },
      )
    }

    const { password, confirmPassword } = sanitization.sanitized

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

    // Find user
    const user = await store.findUserById(resetData.userId)

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 },
      )
    }

    // Update user password
    await store.updateUser(user.id, {
      password, // In production, hash the password
    })

    // Delete the reset token
    deleteResetToken(token)

    return NextResponse.json(
      {
        success: true,
        message: "Password reset successfully",
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Reset password error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Server error resetting password",
      },
      { status: 500 },
    )
  }
}
