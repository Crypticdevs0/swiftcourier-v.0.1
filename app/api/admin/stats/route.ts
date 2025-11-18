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
    const stats = realtimeStore.getPackageStats()
    const packages = store.getAllPackages()

    const totalRevenue = packages.reduce((sum, pkg) => sum + pkg.cost, 0)
    const recentPackages = packages.slice(-10)

    return NextResponse.json({
      success: true,
      data: {
        stats,
        totalRevenue,
        averagePackageValue: totalRevenue / packages.length,
        recentPackages,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}
