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
    const trackingNumber = searchParams.get("trackingNumber") || ""
    const limit = parseInt(searchParams.get("limit") || "50")

    let activities

    if (trackingNumber) {
      activities = unifiedStore.getActivitiesByTrackingNumber(trackingNumber)
    } else {
      activities = unifiedStore.getRecentActivities(limit)
    }

    return NextResponse.json({
      success: true,
      data: activities,
      total: activities.length,
    })
  } catch (error) {
    console.error("Error fetching activities:", error)
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}
