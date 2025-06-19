import { type NextRequest, NextResponse } from "next/server"

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

// Mock users for demo (in production, use a real database)
const mockUsers = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@swiftcourier.com",
    password: "admin123",
    role: "admin",
  },
  {
    id: "2",
    name: "Business User",
    email: "business@swiftcourier.com",
    password: "business123",
    role: "business",
  },
  {
    id: "3",
    name: "Regular User",
    email: "user@swiftcourier.com",
    password: "user123",
    role: "user",
  },
]

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
    const user = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password)

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password",
        },
        { status: 401 },
      )
    }

    // Create simple token (in production, use proper JWT)
    const token = `token_${user.id}_${Date.now()}`

    // Create response
    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
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
