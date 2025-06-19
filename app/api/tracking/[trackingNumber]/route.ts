import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"

// Validation schema
const trackingNumberSchema = z
  .string()
  .min(6)
  .max(20)
  .regex(/^[A-Z0-9]+$/i, {
    message: "Tracking number must contain only letters and numbers",
  })

// Mock tracking data
const mockTrackingData = {
  SC123456789: {
    trackingNumber: "SC123456789",
    status: "In Transit",
    estimatedDelivery: "2024-12-22T18:00:00Z",
    currentLocation: "Distribution Center - Chicago, IL",
    progress: 65,
    updates: [
      {
        id: "1",
        timestamp: "2024-12-20T14:30:00Z",
        location: "Distribution Center - Chicago, IL",
        status: "Package scanned at facility",
        description: "Your package has been scanned and is being processed",
      },
      {
        id: "2",
        timestamp: "2024-12-20T10:15:00Z",
        location: "Sorting Facility - Indianapolis, IN",
        status: "Package departed facility",
        description: "Package has left the sorting facility and is in transit",
      },
      {
        id: "3",
        timestamp: "2024-12-20T08:00:00Z",
        location: "Origin Facility - New York, NY",
        status: "Package received",
        description: "Package received at origin facility",
      },
    ],
  },
}

export async function GET(request: NextRequest, { params }: { params: { trackingNumber: string } }) {
  try {
    // Validate tracking number
    const validationResult = trackingNumberSchema.safeParse(params.trackingNumber)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid tracking number format",
          details: validationResult.error.issues.map((issue) => issue.message),
        },
        { status: 400 },
      )
    }

    const trackingNumber = validationResult.data.toUpperCase()

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Check if tracking number exists
    const trackingData = mockTrackingData[trackingNumber as keyof typeof mockTrackingData]

    if (!trackingData) {
      return NextResponse.json(
        {
          error: "Tracking number not found",
          message:
            "The tracking number you entered could not be found in our system. Please check the number and try again.",
        },
        { status: 404 },
      )
    }

    // Return tracking data with proper headers
    return NextResponse.json(trackingData, {
      headers: {
        "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("Error fetching tracking data:", error)

    return NextResponse.json(
      {
        error: "Internal server error",
        message: "An unexpected error occurred while fetching tracking information. Please try again later.",
      },
      { status: 500 },
    )
  }
}

// Handle unsupported methods
export async function POST() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405, headers: { Allow: "GET" } })
}

export async function PUT() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405, headers: { Allow: "GET" } })
}

export async function DELETE() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405, headers: { Allow: "GET" } })
}
