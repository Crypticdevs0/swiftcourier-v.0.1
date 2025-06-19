import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 })
    }

    // Mock user data based on token (in production, decode JWT and fetch from database)
    let user
    if (token === "mock-jwt-token-1") {
      user = {
        id: 1,
        email: "admin@swiftcourier.com",
        name: "Admin User",
        firstName: "Admin",
        lastName: "User",
        role: "admin",
      }
    } else if (token === "mock-jwt-token-2") {
      user = {
        id: 2,
        email: "user@swiftcourier.com",
        name: "John Doe",
        firstName: "John",
        lastName: "Doe",
        role: "user",
      }
    } else {
      return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 })
    }

    return NextResponse.json({
      success: true,
      user,
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}
