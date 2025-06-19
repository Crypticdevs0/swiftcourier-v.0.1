import { type NextRequest, NextResponse } from "next/server"
import { trackingSchema } from "@/lib/validation"
import { findPackageByTrackingNumber, mockPackages, createPackage } from "@/lib/tracking"

// Initialize sample packages for testing
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

  // Sample out for delivery package
  createPackage({
    status: "out_for_delivery",
    estimatedDelivery: new Date().toISOString(),
    currentLocation: "Out for Delivery - Miami, FL",
    recipient: {
      name: "Carlos Rodriguez",
      address: "555 Beach Ave",
      city: "Miami",
      state: "FL",
      zip: "33101",
    },
    sender: {
      name: "Tech Store Inc",
      address: "100 Business Blvd",
      city: "Atlanta",
      state: "GA",
      zip: "30301",
    },
    service: "Swift Overnight",
    weight: 3.2,
    dimensions: { length: 14, width: 10, height: 6 },
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    cost: 35.99,
  })
}

export async function GET(request: NextRequest, { params }: { params: { trackingNumber: string } }) {
  try {
    const { trackingNumber } = params

    // Simulate processing delay (like real tracking systems)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Validate tracking number format
    const validationResult = trackingSchema.safeParse({ trackingNumber })
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "INVALID_FORMAT",
          message: "Invalid tracking number format. Please check your tracking number and try again.",
          details: "Tracking numbers should be in format: SC followed by 12 characters (e.g., SC123456789012)",
        },
        { status: 400 },
      )
    }

    // Find existing package
    let packageData = findPackageByTrackingNumber(trackingNumber)

    // If not found, create a demo package for valid Swift Courier tracking numbers
    if (!packageData && trackingNumber.toUpperCase().startsWith("SC")) {
      const statuses: Array<"pending" | "picked_up" | "in_transit" | "out_for_delivery" | "delivered"> = [
        "pending",
        "picked_up",
        "in_transit",
        "out_for_delivery",
        "delivered",
      ]

      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]
      const createdAt = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()

      packageData = createPackage({
        status: randomStatus,
        estimatedDelivery: new Date(
          Date.now() + (randomStatus === "delivered" ? -1 : 2) * 24 * 60 * 60 * 1000,
        ).toISOString(),
        currentLocation:
          randomStatus === "delivered"
            ? "Delivered - Customer Address"
            : randomStatus === "out_for_delivery"
              ? "Out for Delivery - Local Facility"
              : randomStatus === "in_transit"
                ? "Distribution Center - Chicago, IL"
                : "Origin Facility - Processing",
        recipient: {
          name: "John Customer",
          address: "123 Customer St",
          city: "Anytown",
          state: "NY",
          zip: "12345",
        },
        sender: {
          name: "Swift Courier Store",
          address: "456 Business Ave",
          city: "New York",
          state: "NY",
          zip: "10001",
        },
        service: "Swift Express",
        weight: Math.round((Math.random() * 5 + 0.5) * 10) / 10,
        dimensions: {
          length: Math.floor(Math.random() * 10 + 6),
          width: Math.floor(Math.random() * 8 + 4),
          height: Math.floor(Math.random() * 6 + 2),
        },
        createdAt,
        deliveredAt: randomStatus === "delivered" ? new Date().toISOString() : undefined,
        cost: Math.round((Math.random() * 30 + 10) * 100) / 100,
      })
    }

    if (!packageData) {
      return NextResponse.json(
        {
          success: false,
          error: "NOT_FOUND",
          message: "Tracking number not found in our system.",
          details:
            "Please verify your tracking number and try again. If you continue to have issues, contact customer support.",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      data: packageData,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Tracking API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "SERVER_ERROR",
        message: "Unable to retrieve tracking information at this time.",
        details: "Please try again later. If the problem persists, contact customer support.",
      },
      { status: 500 },
    )
  }
}
