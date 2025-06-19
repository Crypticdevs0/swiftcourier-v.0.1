import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { trackingNumber: string } }) {
  const trackingNumber = params.trackingNumber

  // Mock tracking data
  const mockTrackingData = {
    SC1234567890: {
      trackingNumber: "SC1234567890",
      status: "In Transit",
      estimatedDelivery: "December 22, 2024",
      currentLocation: "Distribution Center - Chicago, IL",
      progress: 75,
      events: [
        {
          date: "2024-12-19 2:30 PM",
          location: "Distribution Center - Chicago, IL",
          status: "Package arrived at facility",
          description: "Your package has arrived at our Chicago distribution center",
        },
        {
          date: "2024-12-19 8:15 AM",
          location: "Origin Facility - New York, NY",
          status: "Package departed facility",
          description: "Package has left the origin facility",
        },
        {
          date: "2024-12-18 6:45 PM",
          location: "Origin Facility - New York, NY",
          status: "Package received",
          description: "Package received at Swift Courier facility",
        },
      ],
    },
    SC0987654321: {
      trackingNumber: "SC0987654321",
      status: "Delivered",
      estimatedDelivery: "December 18, 2024",
      currentLocation: "Delivered - New York, NY",
      progress: 100,
      events: [
        {
          date: "2024-12-18 3:45 PM",
          location: "New York, NY 10001",
          status: "Delivered",
          description: "Package delivered to recipient",
        },
        {
          date: "2024-12-18 9:30 AM",
          location: "New York, NY",
          status: "Out for delivery",
          description: "Package is out for delivery",
        },
      ],
    },
  }

  const trackingData = mockTrackingData[trackingNumber as keyof typeof mockTrackingData]

  if (!trackingData) {
    return NextResponse.json({ success: false, message: "Tracking number not found" }, { status: 404 })
  }

  return NextResponse.json({
    success: true,
    data: trackingData,
  })
}
