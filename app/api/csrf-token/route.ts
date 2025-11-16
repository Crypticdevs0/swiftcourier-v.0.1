import { type NextRequest, NextResponse } from "next/server"
import { generateCSRFToken } from "@/lib/csrf"

/**
 * GET endpoint to generate CSRF token
 * This is a public endpoint that returns a CSRF token for use in form submissions
 */
export async function GET(request: NextRequest) {
  try {
    const token = generateCSRFToken()
    
    return NextResponse.json({
      success: true,
      token,
    })
  } catch (error) {
    console.error("CSRF token generation error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to generate CSRF token",
      },
      { status: 500 },
    )
  }
}
