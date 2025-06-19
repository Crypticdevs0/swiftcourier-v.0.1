import { type NextRequest, NextResponse } from "next/server"
import { loginSchema } from "@/lib/validation"

// Mock user database (in production, use a real database)
const users = [
  {
    id: 1,
    email: "admin@swiftcourier.com",
    password: "admin123",
    firstName: "Admin",
    lastName: "User",
    role: "admin",
  },
  {
    id: 2,
    email: "user@swiftcourier.com",
    password: "user123",
    firstName: "John",
    lastName: "Doe",
    role: "user",
  },
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validationResult = loginSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid input",
          errors: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 },
      )
    }

    const { email, password } = validationResult.data

    // Find user
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password)

    if (!user) {
      return NextResponse.json({ success: false, message: "Invalid email or password" }, { status: 401 })
    }

    // Generate token
    const token = `mock-jwt-token-${user.id}`

    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
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
    console.error("Login error:", error)
    return NextResponse.json({ success: false, message: "Server error during login" }, { status: 500 })
  }
}
