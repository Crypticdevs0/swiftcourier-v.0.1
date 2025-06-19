import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  // Mock notifications data
  const notifications = [
    {
      id: 1,
      type: "delivery",
      title: "Package Delivered",
      message: "Your package SC1234567890 has been delivered to Chicago, IL",
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      read: false,
      priority: "normal",
    },
    {
      id: 2,
      type: "pickup",
      title: "Pickup Scheduled",
      message: "Your pickup has been scheduled for tomorrow between 9 AM - 5 PM",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      read: false,
      priority: "normal",
    },
    {
      id: 3,
      type: "delay",
      title: "Delivery Delay",
      message: "Package SC0987654321 is delayed due to weather conditions",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
      read: true,
      priority: "high",
    },
    {
      id: 4,
      type: "promotion",
      title: "Holiday Special",
      message: "Save 20% on all Express shipping through December 31st",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      read: true,
      priority: "low",
    },
  ]

  return NextResponse.json({
    success: true,
    notifications,
    unreadCount: notifications.filter((n) => !n.read).length,
  })
}

export async function POST(request: NextRequest) {
  try {
    const { notificationId, action } = await request.json()

    if (action === "mark_read") {
      // Mock marking notification as read
      return NextResponse.json({
        success: true,
        message: "Notification marked as read",
      })
    }

    if (action === "mark_all_read") {
      // Mock marking all notifications as read
      return NextResponse.json({
        success: true,
        message: "All notifications marked as read",
      })
    }

    return NextResponse.json(
      {
        success: false,
        message: "Invalid action",
      },
      { status: 400 },
    )
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Server error",
      },
      { status: 500 },
    )
  }
}
