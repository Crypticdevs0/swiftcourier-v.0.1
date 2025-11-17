import { type NextRequest, NextResponse } from "next/server"
import { extractAuthFromRequest } from "@/lib/utils"
import { realtimeStore } from "@/lib/realtime-store"
import store from "@/lib/store"

interface AdminUser extends ReturnType<typeof store.findUserById> {
  role?: string
}

export async function GET(request: NextRequest) {
  const userId = extractAuthFromRequest(request)

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  // Verify admin role
  const user = await store.findUserById(userId)
  if (!user || user.role !== "admin") {
    return new NextResponse("Forbidden", { status: 403 })
  }

  // Set up SSE headers
  const responseHeaders = {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  }

  const encoder = new TextEncoder()
  let isClosed = false

  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection message
      const initMessage = {
        type: "connection",
        status: "connected",
        timestamp: new Date().toISOString(),
        userId,
      }
      controller.enqueue(encoder.encode(`data: ${JSON.stringify(initMessage)}\n\n`))

      // Send initial stats
      const stats = realtimeStore.getPackageStats()
      controller.enqueue(
        encoder.encode(
          `data: ${JSON.stringify({
            type: "stats",
            data: stats,
            timestamp: new Date().toISOString(),
          })}\n\n`
        )
      )

      // Subscribe to realtime updates
      const unsubscribeAll = realtimeStore.subscribe("admin:packages", (event) => {
        if (!isClosed) {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(event)}\n\n`)
          )
        }
      })

      const unsubscribeWildcard = realtimeStore.subscribe("*", (event) => {
        if (!isClosed && (event.type === "package_updated" || event.type === "status_changed")) {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(event)}\n\n`)
          )
        }
      })

      // Heartbeat to keep connection alive
      const heartbeatInterval = setInterval(() => {
        if (!isClosed) {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: "heartbeat",
                timestamp: new Date().toISOString(),
              })}\n\n`
            )
          )
        } else {
          clearInterval(heartbeatInterval)
        }
      }, 30000) // 30 second heartbeat

      // Cleanup on close
      const originalClose = controller.close.bind(controller)
      controller.close = () => {
        isClosed = true
        clearInterval(heartbeatInterval)
        unsubscribeAll()
        unsubscribeWildcard()
        originalClose()
      }
    },
    cancel() {
      isClosed = true
    },
  })

  return new NextResponse(stream, { headers: responseHeaders })
}
