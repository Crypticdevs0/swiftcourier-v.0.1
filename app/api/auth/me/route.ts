import { type NextRequest, NextResponse } from "next/server"

// Mock user database
const mockUsers = [
  {
    id: "1",
    name: "Admin User",
    firstName: "Admin",
    lastName: "User",
    email: "admin@swiftcourier.com",
    role: "admin",
  },
  {
    id: "2",
    name: "Business User",
    firstName: "Business",
    lastName: "User",
    email: "business@swiftcourier.com",
    role: "business",
  },
  {
    id: "3",
    name: "Regular User",
    firstName: "John",
    lastName: "Doe",
    email: "user@swiftcourier.com",
    role: "user",
  },
]

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 })
    }

    // Extract user ID from token (in production, verify JWT)
    const userId = token.replace("token_", "").split("_")[0]
    const user = mockUsers.find((u) => u.id === userId)

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Auth check error:", error)
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}
