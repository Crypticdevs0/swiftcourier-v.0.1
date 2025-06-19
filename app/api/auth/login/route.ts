import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Simulate authentication logic
    if (email === "admin@swiftcourier.com" && password === "admin123") {
      const response = NextResponse.json({
        success: true,
        user: {
          id: 1,
          email: "admin@swiftcourier.com",
          name: "Admin User",
          role: "admin",
        },
        token: "mock-jwt-token-admin",
      })

      // Set HTTP-only cookie
      response.cookies.set("auth-token", "mock-jwt-token-admin", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })

      return response
    }

    // Regular user login
    if (email && password) {
      const response = NextResponse.json({
        success: true,
        user: {
          id: 2,
          email: email,
          name: "John Doe",
          role: "user",
        },
        token: "mock-jwt-token-user",
      })

      response.cookies.set("auth-token", "mock-jwt-token-user", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
      })

      return response
    }

    return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}
