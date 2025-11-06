import { type NextRequest, NextResponse } from "next/server"
import { getPackageByTrackingNumber, addTrackingEvent } from "@/lib/mock-data"
import { deterministicRandom } from "@/lib/utils"

export async function GET(request: NextRequest, { params }: { params: { trackingNumber: string } }) {
  try {
    const { trackingNumber } = params

    if (!trackingNumber) {
      return NextResponse.json({ success: false, error: "Tracking number is required" }, { status: 400 })
    }

    // Simulate API delay for realistic experience
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const packageData = getPackageByTrackingNumber(trackingNumber)

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

      addTrackingEvent(trackingNumber, {
        timestamp: new Date().toISOString(),
        status: "In Transit",
        location: randomLocation,
        description: `Package in transit through ${randomLocation}`,
      })
    }

    return NextResponse.json({
      success: true,
      package: packageData,
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
    const body = await request.json()

    if (!trackingNumber) {
      return NextResponse.json({ success: false, error: "Tracking number is required" }, { status: 400 })
    }

    const { event } = body

    if (!event || !event.status || !event.location || !event.description) {
      return NextResponse.json({ success: false, error: "Invalid event data" }, { status: 400 })
    }

    const eventWithTimestamp = {
      ...event,
      timestamp: new Date().toISOString(),
    }

    const success = addTrackingEvent(trackingNumber, eventWithTimestamp)

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
