import { type NextRequest, NextResponse } from "next/server"
import { extractAuthFromRequest } from "@/lib/utils"
import { unifiedStore } from "@/lib/unified-store"
import store from "@/lib/store"

export async function GET(request: NextRequest) {
  const userId = extractAuthFromRequest(request)

  if (!userId) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
  }

  const user = await store.findUserById(userId)
  if (!user || user.role !== "admin") {
    return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 })
  }

  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get("q") || ""
    const status = searchParams.get("status") || ""

    let trackingNumbers = unifiedStore.getAllTrackingNumbers()

    if (query) {
      trackingNumbers = unifiedStore.searchTrackingNumbers(query)
    } else if (status) {
      trackingNumbers = unifiedStore.getStatsByStatus(status as any)
    }

    const stats = unifiedStore.getDashboardStats()

    return NextResponse.json({
      success: true,
      data: trackingNumbers,
      stats,
      total: trackingNumbers.length,
    })
  } catch (error) {
    console.error("Error fetching tracking numbers:", error)
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const userId = extractAuthFromRequest(request)

  if (!userId) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
  }

  const user = await store.findUserById(userId)
  if (!user || user.role !== "admin") {
    return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 })
  }

  try {
    const body = await request.json()
    const { action, id, ...data } = body

    if (action === "create") {
      if (!data.productId || !data.senderLocationId || !data.recipientLocationId) {
        return NextResponse.json(
          {
            success: false,
            message: "productId, senderLocationId, and recipientLocationId are required",
          },
          { status: 400 }
        )
      }

      const trackingNumber = unifiedStore.createTrackingNumber({
        ...data,
        createdBy: userId,
      })

      return NextResponse.json({
        success: true,
        data: trackingNumber,
        message: "Tracking number created successfully",
      })
    }

    if (action === "update") {
      if (!id) {
        return NextResponse.json(
          { success: false, message: "Tracking number ID required" },
          { status: 400 }
        )
      }
      const trackingNumber = unifiedStore.updateTrackingNumber(id, data)
      if (!trackingNumber) {
        return NextResponse.json(
          { success: false, message: "Tracking number not found" },
          { status: 404 }
        )
      }
      return NextResponse.json({
        success: true,
        data: trackingNumber,
        message: "Tracking number updated successfully",
      })
    }

    if (action === "delete") {
      if (!id) {
        return NextResponse.json(
          { success: false, message: "Tracking number ID required" },
          { status: 400 }
        )
      }
      const deleted = unifiedStore.deleteTrackingNumber(id)
      if (!deleted) {
        return NextResponse.json(
          { success: false, message: "Tracking number not found" },
          { status: 404 }
        )
      }
      return NextResponse.json({
        success: true,
        message: "Tracking number deleted successfully",
      })
    }

    if (action === "add_activity") {
      if (!data.trackingNumberId) {
        return NextResponse.json(
          { success: false, message: "trackingNumberId is required" },
          { status: 400 }
        )
      }

      const trackingNum = unifiedStore.getTrackingNumberById(data.trackingNumberId)
      if (!trackingNum) {
        return NextResponse.json(
          { success: false, message: "Tracking number not found" },
          { status: 404 }
        )
      }

      const activity = unifiedStore.addActivity({
        trackingNumberId: data.trackingNumberId,
        trackingNumber: trackingNum.trackingNumber,
        type: data.type || "note_added",
        status: trackingNum.status,
        location: data.location || "Unknown",
        locationId: data.locationId || "",
        description: data.description || "Activity added",
        timestamp: new Date().toISOString(),
        createdBy: userId,
        metadata: data.metadata,
      })

      return NextResponse.json({
        success: true,
        data: activity,
        message: "Activity added successfully",
      })
    }

    return NextResponse.json(
      { success: false, message: "Unknown action" },
      { status: 400 }
    )
  } catch (error) {
    console.error("Error in tracking numbers API:", error)
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}
