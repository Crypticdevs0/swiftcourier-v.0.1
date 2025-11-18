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
    const type = searchParams.get("type") as any || ""

    let locations = unifiedStore.getAllLocations()

    if (query) {
      locations = unifiedStore.searchLocations(query)
    } else if (type) {
      locations = unifiedStore.getLocationsByType(type)
    }

    return NextResponse.json({
      success: true,
      data: locations,
      total: locations.length,
    })
  } catch (error) {
    console.error("Error fetching locations:", error)
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
      const location = unifiedStore.createLocation({
        ...data,
        createdBy: userId,
      })
      return NextResponse.json({
        success: true,
        data: location,
        message: "Location created successfully",
      })
    }

    if (action === "update") {
      if (!id) {
        return NextResponse.json(
          { success: false, message: "Location ID required" },
          { status: 400 }
        )
      }
      const location = unifiedStore.updateLocation(id, data)
      if (!location) {
        return NextResponse.json(
          { success: false, message: "Location not found" },
          { status: 404 }
        )
      }
      return NextResponse.json({
        success: true,
        data: location,
        message: "Location updated successfully",
      })
    }

    if (action === "delete") {
      if (!id) {
        return NextResponse.json(
          { success: false, message: "Location ID required" },
          { status: 400 }
        )
      }
      const deleted = unifiedStore.deleteLocation(id)
      if (!deleted) {
        return NextResponse.json(
          { success: false, message: "Location not found" },
          { status: 404 }
        )
      }
      return NextResponse.json({
        success: true,
        message: "Location deleted successfully",
      })
    }

    return NextResponse.json(
      { success: false, message: "Unknown action" },
      { status: 400 }
    )
  } catch (error) {
    console.error("Error in locations API:", error)
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}
