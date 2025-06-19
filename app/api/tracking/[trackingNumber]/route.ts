import { type NextRequest, NextResponse } from "next/server"
import { trackingSchema } from "@/lib/validation"
import { findPackageByTrackingNumber, mockPackages, createPackage } from "@/lib/tracking"

// Create some sample packages for testing
if (mockPackages.length === 0) {
  // Sample delivered package
  createPackage({
    status: "delivered",
    estimatedDelivery: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    currentLocation: "Delivered - Chicago, IL",
    recipient: {
      name: "Jane Smith",
      address: "123 Main St",
      city: "Chicago",
      state: "IL",
      zip: "60601",
    },
    sender: {
      name: "John Doe",
      address: "456 Oak Ave",
      city: "New York",
      state: "NY",
      zip: "10001",
    },
    service: "Swift Express",
    weight: 2.5,
    dimensions: { length: 12, width: 8, height: 4 },
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    deliveredAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    cost: 24.99,
  })

  // Sample in-transit package
  createPackage({
    status: "in_transit",
    estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    currentLocation: "Distribution Center - Philadelphia, PA",
    recipient: {
      name: "Bob Johnson",
      address: "789 Pine St",
      city: "Los Angeles",
      state: "CA",
      zip: "90210",
    },
    sender: {
      name: "Alice Brown",
      address: "321 Elm St",
      city: "Boston",
      state: "MA",
      zip: "02101",
    },
    service: "Swift Standard",
    weight: 1.8,
    dimensions: { length: 10, width: 6, height: 3 },
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    cost: 18.99,
  })
}

export async function GET(request: NextRequest, { params }: { params: { trackingNumber: string } }) {
  try {
    const { trackingNumber } = params

    // Validate tracking number format
    const validationResult = trackingSchema.safeParse({ trackingNumber })
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid tracking number format",
          errors: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 },
      )
    }

    // Find package
    const packageData = findPackageByTrackingNumber(trackingNumber)
    if (!packageData) {
      return NextResponse.json(
        {
          success: false,
          message: "Package not found",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      package: packageData,
    })
  } catch (error) {
    console.error("Tracking error:", error)
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}
