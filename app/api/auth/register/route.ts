import { type NextRequest, NextResponse } from "next/server"
import * as jwt from "jsonwebtoken"
import store from "@/lib/store"
import { sanitizeRegistrationInput, validatePasswordStrength } from "@/lib/sanitize"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validation = validateRegistrationInput(body)
    if (!validation.isValid) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: validation.errors,
        },
        { status: 400 },
      )
    }

    const { firstName, lastName, email, password, phone } = body

    // Check if user already exists
    const existingUser = await store.findUserByEmail(email)
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User with this email already exists",
          errors: { email: ["Email already registered"] },
        },
        { status: 409 },
      )
    }

    // Create new user
    const newUser = await store.createUser({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      name: `${firstName.trim()} ${lastName.trim()}`,
      email: email.toLowerCase(),
      password, // In production, hash this password
      role: "user",
      userType: "new",
      phone: phone || "",
    } as any)

    // Sign JWT token
    const secret = process.env.JWT_SECRET || "dev_jwt_secret"
    const token = jwt.sign({ userId: newUser.id }, secret, { expiresIn: "7d" })

    // Create response
    const response = NextResponse.json({
      success: true,
      message: "Registration successful",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role,
        userType: newUser.userType,
        createdAt: newUser.createdAt,
      },
      token,
    })

    // Set HTTP-only cookie (use SameSite=None and Secure to allow cookies in embedded previews)
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Server error during registration. Please try again.",
      },
      { status: 500 },
    )
  }
}
