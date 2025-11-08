import { type NextRequest, NextResponse } from "next/server"
import * as jwt from "jsonwebtoken"
import store from "@/lib/store"

// Simple login validation schema
const validateLoginInput = (data: any) => {
  const errors: string[] = []

  if (!data.email || typeof data.email !== "string") {
    errors.push("Email is required")
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push("Invalid email format")
  }

  if (!data.password || typeof data.password !== "string") {
    errors.push("Password is required")
  } else if (data.password.length < 3) {
    errors.push("Password must be at least 3 characters")
  }

  return { isValid: errors.length === 0, errors }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validation = validateLoginInput(body)
    if (!validation.isValid) {
      return NextResponse.json(
        {
          success: false,
          message: validation.errors[0],
          errors: { general: validation.errors },
        },
        { status: 400 },
      )
    }

    const { email, password } = body

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

    // Create response
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
      token,
    })

    // Set HTTP-only cookie
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
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
