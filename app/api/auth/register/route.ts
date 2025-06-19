import { type NextRequest, NextResponse } from "next/server"
import { mockUsers } from "@/lib/mock-data"

// Simple registration validation
const validateRegistrationInput = (data: any) => {
  const errors: { [key: string]: string[] } = {}

  if (!data.firstName || typeof data.firstName !== "string" || data.firstName.trim().length < 2) {
    errors.firstName = ["First name must be at least 2 characters"]
  }

  if (!data.lastName || typeof data.lastName !== "string" || data.lastName.trim().length < 2) {
    errors.lastName = ["Last name must be at least 2 characters"]
  }

  if (!data.email || typeof data.email !== "string") {
    errors.email = ["Email is required"]
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = ["Invalid email format"]
  }

  if (!data.password || typeof data.password !== "string" || data.password.length < 6) {
    errors.password = ["Password must be at least 6 characters"]
  }

  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = ["Passwords do not match"]
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validation = validateRegistrationInput(body)
    if (!validation.isValid) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: validation.errors,
        },
        { status: 400 },
      )
    }

    const { firstName, lastName, email, password, phone } = body

    // Check if user already exists
    const existingUser = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase())
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
    const newUser = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      name: `${firstName.trim()} ${lastName.trim()}`,
      email: email.toLowerCase(),
      password, // In production, hash this password
      role: "user",
      userType: "new" as const, // New users start as "new"
      phone: phone || "",
      createdAt: new Date().toISOString(),
    }

    // Add to mock storage
    mockUsers.push(newUser)

    // Create simple token
    const token = `token_${newUser.id}_${Date.now()}`

    // Create response
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
