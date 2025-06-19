import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 })
    }

    // In production, verify JWT token here
    // For now, just return success if token exists
    return NextResponse.json({
      success: true,
      message: "Authenticated",
    })
  } catch (error) {
    console.error("Auth check error:", error)
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}
