import { NextResponse } from "next/server"

export async function POST() {
  try {
    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully",
    })

    // Clear the auth cookie
    response.cookies.set("auth-token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0, // Expire immediately
    })

    return response
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error during logout" }, { status: 500 })
  }
}
