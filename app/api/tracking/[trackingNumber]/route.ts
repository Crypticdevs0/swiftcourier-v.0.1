import { type NextRequest, NextResponse } from "next/server"
import { generateTrackingEvents, calculateProgress, type Package } from "@/lib/tracking"

// Mock database - in production, this would be a real database
const mockPackages: Record<string, Package> = {}

export async function GET(request: NextRequest, { params }: { params: { trackingNumber: string } }) {
  try {
    const trackingNumber = params.trackingNumber.toUpperCase()

    // Check if package exists in mock database
    let packageData = mockPackages[trackingNumber]

    // If not found, generate mock data for demo purposes
    if (!packageData) {
      // Only generate for valid Swift Courier tracking numbers
      if (!trackingNumber.startsWith("SC")) {
        return NextResponse.json(
          {
            error: "Tracking number not found",
            message: "The tracking number you entered could not be found in our system.",
          },
          { status: 404 },
        )
      }

      // Generate mock package data
      const statuses: Package["status"][] = ["pending", "in_transit", "out_for_delivery", "delivered"]
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]
      const createdAt = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()

      packageData = {
        trackingNumber,
        status: randomStatus,
        estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        currentLocation: randomStatus === "delivered" ? "Delivered" : "Distribution Center - Chicago, IL",
        progress: calculateProgress(randomStatus),
        recipient: {
          name: "John Doe",
          address: "123 Main St",
          city: "Chicago",
          state: "IL",
          zip: "60601",
        },
        sender: {
          name: "Swift Courier Store",
          address: "456 Business Ave",
          city: "New York",
          state: "NY",
          zip: "10001",
        },
        service: "Swift Express",
        weight: 2.5,
        dimensions: { length: 12, width: 8, height: 4 },
        events: generateTrackingEvents(trackingNumber, randomStatus, createdAt),
        createdAt,
        deliveredAt: randomStatus === "delivered" ? new Date().toISOString() : undefined,
      }

      // Store in mock database
      mockPackages[trackingNumber] = packageData
    }

    return NextResponse.json(
      {
        success: true,
        data: packageData,
      },
      {
        headers: {
          "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
        },
      },
    )
  } catch (error) {
    console.error("Error fetching tracking data:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        message: "An unexpected error occurred while fetching tracking information.",
      },
      { status: 500 },
    )
  }
}
