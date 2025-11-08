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
          message: "Authentication required",
        },
        { status: 401 },
      )
    }

    // Extract user ID from token
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

    // Generate packages based on user type
    const packages = store.generateMockPackages ? store.generateMockPackages(user.userType, user.id) : []

    return NextResponse.json({
      success: true,
      packages,
      userType: user.userType,
      message: "Packages loaded successfully",
    })
  } catch (error) {
    console.error("Packages API error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Server error loading packages",
        packages: [],
        userType: "new",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const authToken = request.cookies.get("auth-token")?.value

    if (!authToken) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required",
        },
        { status: 401 },
      )
    }

    // Extract user ID from token
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

    // Create new package (mock implementation)
    const newPackage = {
      trackingNumber: "SW" + Math.random().toString(36).substr(2, 9).toUpperCase(),
      status: "pending",
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      currentLocation: "Package created - awaiting pickup",
      progress: 0,
      recipient: body.recipient,
      sender: {
        name: user.name,
        address: body.sender?.address || "",
        city: body.sender?.city || "",
        state: body.sender?.state || "",
        zip: body.sender?.zip || "",
      },
      service: body.service || "Swift Standard",
      weight: body.weight || 1,
      dimensions: body.dimensions || { length: 10, width: 8, height: 4 },
      events: [
        {
          id: "1",
          timestamp: new Date().toISOString(),
          location: "Origin facility",
          description: "Package created",
          status: "pending",
        },
      ],
      createdAt: new Date().toISOString(),
      userId: user.id,
      cost: body.cost || 15.99,
    }

    // Update user type if they were new
    if (user.userType === "new") {
      await store.updateUser(user.id, { userType: "existing" })
    }

    return NextResponse.json({
      success: true,
      package: newPackage,
      message: "Package created successfully",
    })
  } catch (error) {
    console.error("Create package error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Server error creating package",
      },
      { status: 500 },
    )
  }
}
