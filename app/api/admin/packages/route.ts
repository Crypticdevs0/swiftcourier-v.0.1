import { type NextRequest, NextResponse } from "next/server"
import { extractAuthFromRequest } from "@/lib/utils"
import { realtimeStore } from "@/lib/realtime-store"
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
    const packages = store.getAllPackages()
    const stats = realtimeStore.getPackageStats()

    return NextResponse.json({
      success: true,
      data: {
        packages,
        stats,
        totalCount: packages.length,
      },
    })
  } catch (error) {
    console.error("Error fetching packages:", error)
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
    const { action, trackingNumber, ...payload } = body

    if (action === "update_status") {
      const { newStatus, reason } = payload

      if (!trackingNumber || !newStatus) {
        return NextResponse.json(
          { success: false, message: "Missing required fields: trackingNumber, newStatus" },
          { status: 400 }
        )
      }

      const success = await realtimeStore.updatePackageStatus(trackingNumber, newStatus, reason)

      if (!success) {
        return NextResponse.json(
          { success: false, message: "Package not found" },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        message: "Package status updated",
        data: { trackingNumber, newStatus },
      })
    }

    if (action === "add_event") {
      const { description, location } = payload

      if (!trackingNumber || !description || !location) {
        return NextResponse.json(
          { success: false, message: "Missing required fields: trackingNumber, description, location" },
          { status: 400 }
        )
      }

      const success = await realtimeStore.addPackageEvent(trackingNumber, description, location)

      if (!success) {
        return NextResponse.json(
          { success: false, message: "Package not found" },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        message: "Event added to package",
        data: { trackingNumber },
      })
    }

    return NextResponse.json(
      { success: false, message: "Unknown action" },
      { status: 400 }
    )
  } catch (error) {
    console.error("Error in admin packages:", error)
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}
