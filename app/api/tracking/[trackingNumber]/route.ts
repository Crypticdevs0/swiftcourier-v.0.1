import { type NextRequest, NextResponse } from "next/server"
import store from "@/lib/store"
import { deterministicRandom, parseAuthToken } from "@/lib/utils"
import { verifyCSRFToken } from "@/lib/csrf"

export async function GET(request: NextRequest, { params }: { params: { trackingNumber: string } }) {
  try {
    const { trackingNumber } = params

    if (!trackingNumber) {
      return NextResponse.json({ success: false, error: "Tracking number is required" }, { status: 400 })
    }

    // Simulate API delay for realistic experience
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const packageData = await store.getPackageByTrackingNumber(trackingNumber)

    if (!packageData) {
      return NextResponse.json(
        {
          success: false,
          error: "Package not found",
          message: "No package found with this tracking number. Please check the number and try again.",
        },
        { status: 404 },
      )
    }

    // Simulate real-time updates deterministically (stable per tracking number)
    const shouldAddUpdate = deterministicRandom(trackingNumber) < 0.1 // ~10% chance deterministically
    if (shouldAddUpdate && packageData.status === "in_transit") {
      const locations = [
        "Chicago, IL",
        "Denver, CO",
        "Phoenix, AZ",
        "Las Vegas, NV",
        "Sacramento, CA",
        "Portland, OR",
        "Seattle, WA",
      ]
      // Pick deterministic location based on tracking number
      const idx = Math.floor(deterministicRandom(trackingNumber + "_loc") * locations.length)
      const randomLocation = locations[idx]

      await store.addTrackingEvent(trackingNumber, {
        timestamp: new Date().toISOString(),
        status: "In Transit",
        location: randomLocation,
        description: `Package in transit through ${randomLocation}`,
      })
    }

    return NextResponse.json({
      success: true,
      data: packageData,
      lastUpdated: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error fetching tracking data:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: "Unable to fetch tracking information. Please try again later.",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest, { params }: { params: { trackingNumber: string } }) {
  try {
    const { trackingNumber } = params

    if (!trackingNumber) {
      return NextResponse.json({ success: false, error: "Tracking number is required" }, { status: 400 })
    }

    // Authentication check: only authenticated users can add tracking events
    const authToken = request.cookies.get("auth-token")?.value
    if (!authToken) {
      return NextResponse.json(
        { success: false, error: "Authentication required to add tracking events" },
        { status: 401 },
      )
    }

    // Verify auth token
    const userId = parseAuthToken(authToken)
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Invalid authentication token" },
        { status: 401 },
      )
    }

    // Verify user exists and is admin/staff
    const user = await store.findUserById(userId)
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 },
      )
    }

    // Only allow admin/staff to add tracking events
    if (user.role !== "admin" && user.role !== "staff") {
      return NextResponse.json(
        { success: false, error: "Only administrators can add tracking events" },
        { status: 403 },
      )
    }

    // CSRF token validation
    const body = await request.json()
    const csrfToken = body.csrfToken || request.headers.get("x-csrf-token")

    if (!csrfToken || !verifyCSRFToken(csrfToken)) {
      return NextResponse.json(
        { success: false, error: "Invalid or missing CSRF token" },
        { status: 403 },
      )
    }

    const { event } = body

    if (!event || !event.status || !event.location || !event.description) {
      return NextResponse.json({ success: false, error: "Invalid event data" }, { status: 400 })
    }

    const eventWithTimestamp = {
      ...event,
      timestamp: new Date().toISOString(),
    }

    const success = await store.addTrackingEvent(trackingNumber, eventWithTimestamp)

    if (!success) {
      return NextResponse.json({ success: false, error: "Package not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Tracking event added successfully",
    })
  } catch (error) {
    console.error("Error adding tracking event:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
