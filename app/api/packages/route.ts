import { type NextRequest, NextResponse } from "next/server"
import { generateTrackingNumber } from "@/lib/tracking"

// Mock packages data
const generateMockPackages = (userId: string) => [
  {
    trackingNumber: generateTrackingNumber(),
    status: "in_transit",
    estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    currentLocation: "Distribution Center - Chicago, IL",
    progress: 65,
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
    events: [
      {
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        location: "New York, NY",
        description: "Package picked up",
        status: "picked_up",
      },
      {
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        location: "Chicago, IL",
        description: "Arrived at distribution center",
        status: "in_transit",
      },
    ],
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    userId,
  },
  {
    trackingNumber: generateTrackingNumber(),
    status: "delivered",
    estimatedDelivery: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    currentLocation: "Delivered - Los Angeles, CA",
    progress: 100,
    recipient: {
      name: "Bob Johnson",
      address: "789 Pine St",
      city: "Los Angeles",
      state: "CA",
      zip: "90210",
    },
    sender: {
      name: "John Doe",
      address: "456 Oak Ave",
      city: "New York",
      state: "NY",
      zip: "10001",
    },
    service: "Swift Standard",
    weight: 1.2,
    dimensions: { length: 10, width: 6, height: 3 },
    events: [
      {
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        location: "New York, NY",
        description: "Package picked up",
        status: "picked_up",
      },
      {
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        location: "Los Angeles, CA",
        description: "Package delivered",
        status: "delivered",
      },
    ],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    deliveredAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    trackingNumber: generateTrackingNumber(),
    status: "pending",
    estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    currentLocation: "Processing at Origin Facility",
    progress: 15,
    recipient: {
      name: "Alice Wilson",
      address: "321 Elm Street",
      city: "Miami",
      state: "FL",
      zip: "33101",
    },
    sender: {
      name: "John Doe",
      address: "456 Oak Ave",
      city: "New York",
      state: "NY",
      zip: "10001",
    },
    service: "Swift Economy",
    weight: 0.8,
    dimensions: { length: 8, width: 6, height: 2 },
    events: [
      {
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        location: "New York, NY",
        description: "Shipment created",
        status: "pending",
      },
    ],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    userId,
  },
]

export async function GET(request: NextRequest) {
  try {
    // Check for authentication - either from cookie or localStorage simulation
    const authHeader = request.headers.get("authorization")
    const authCookie = request.cookies.get("auth-token")?.value

    // For development, we'll be more lenient with auth
    // In production, you'd want stricter authentication
    let userId = "user_123" // Default user ID for demo

    if (authCookie) {
      // Extract user ID from cookie if available
      userId = authCookie.replace("token_", "").split("_")[0] || "user_123"
    }

    // Generate mock packages for the user
    const userPackages = generateMockPackages(userId)

    return NextResponse.json({
      success: true,
      packages: userPackages,
      count: userPackages.length,
    })
  } catch (error) {
    console.error("Packages API error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch packages",
        error: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
      },
      { status: 500 },
    )
  }
}

// Handle POST requests for creating new packages
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const { recipient, sender, service, weight } = body

    if (!recipient || !sender || !service || !weight) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 })
    }

    // Create new package
    const newPackage = {
      trackingNumber: generateTrackingNumber(),
      status: "pending",
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      currentLocation: "Processing at Origin Facility",
      progress: 0,
      recipient,
      sender,
      service,
      weight,
      dimensions: body.dimensions || { length: 10, width: 8, height: 6 },
      events: [
        {
          timestamp: new Date().toISOString(),
          location: sender.city + ", " + sender.state,
          description: "Shipment created",
          status: "pending",
        },
      ],
      createdAt: new Date().toISOString(),
      userId: "user_123", // In real app, get from auth
    }

    return NextResponse.json({
      success: true,
      package: newPackage,
      message: "Package created successfully",
    })
  } catch (error) {
    console.error("Package creation error:", error)
    return NextResponse.json({ success: false, message: "Failed to create package" }, { status: 500 })
  }
}
