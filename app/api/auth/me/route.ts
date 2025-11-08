import { type NextRequest, NextResponse } from "next/server"
import store from "@/lib/store"
import { parseAuthToken } from "@/lib/utils"

export async function GET(request: NextRequest) {
  try {
    // Get auth token from cookie
    const authToken = request.cookies.get("auth-token")?.value

    if (!authToken) {
      return NextResponse.json(
        {
          success: false,
          message: "No authentication token found",
        },
        { status: 401 },
      )
    }

    // Extract user ID from token using helper
    const userId = parseAuthToken(authToken)

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid authentication token",
        },
        { status: 401 },
      )
    }

    // Find user
    const user = await store.findUserById(userId)

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
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
    })
  } catch (error) {
    console.error("Auth me error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Server error checking authentication",
      },
      { status: 500 },
    )
  }
}
