import { type NextRequest, NextResponse } from "next/server"
import { registrationSchema } from "@/lib/validation"

// Mock user database (in production, use a real database)
const users: Array<{
  id: number
  email: string
  password: string
  firstName: string
  lastName: string
  role: string
  createdAt: string
}> = []

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validationResult = registrationSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 },
      )
    }

    const { firstName, lastName, email, password } = validationResult.data

    // Check if user already exists
    const existingUser = users.find((user) => user.email.toLowerCase() === email.toLowerCase())
    if (existingUser) {
      return NextResponse.json({ success: false, message: "User already exists with this email" }, { status: 409 })
    }

    // Create new user
    const newUser = {
      id: users.length + 1,
      email: email.toLowerCase(),
      password, // In production, hash this password
      firstName,
      lastName,
      role: "user",
      createdAt: new Date().toISOString(),
    }

    users.push(newUser)

    // Generate token
    const token = `mock-jwt-token-${newUser.id}`

    const response = NextResponse.json({
      success: true,
      message: "Account created successfully",
      user: {
        id: newUser.id,
        email: newUser.email,
        name: `${newUser.firstName} ${newUser.lastName}`,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role,
      },
      token,
    })

    // Set HTTP-only cookie
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ success: false, message: "Server error during registration" }, { status: 500 })
  }
}
