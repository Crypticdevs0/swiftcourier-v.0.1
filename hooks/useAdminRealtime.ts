"use client"

import { useEffect, useRef, useCallback, useState } from "react"

interface RealtimeEvent {
  id: string
  type: string
  timestamp: string
  data: any
  changes?: Record<string, any>
}

interface UseAdminRealtimeOptions {
  onEvent?: (event: RealtimeEvent) => void
  onStatsUpdate?: (stats: any) => void
  onConnectionChange?: (connected: boolean) => void
}

export function useAdminRealtime(options: UseAdminRealtimeOptions = {}) {
  const eventSourceRef = useRef<EventSource | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [stats, setStats] = useState<any>(null)
  const [events, setEvents] = useState<RealtimeEvent[]>([])

  const connect = useCallback(() => {
    if (eventSourceRef.current) {
      return
    }

    try {
      const eventSource = new EventSource("/api/admin/realtime", {
        withCredentials: true,
      })

      eventSource.addEventListener("message", (event) => {
        try {
          const data = JSON.parse(event.data)

          if (data.type === "connection") {
            setIsConnected(true)
            options.onConnectionChange?.(true)
          } else if (data.type === "stats") {
            setStats(data.data)
            options.onStatsUpdate?.(data.data)
          } else if (data.type === "heartbeat") {
            // Ignore heartbeat
          } else {
            // Regular event
            setEvents((prev) => {
              const updated = [data, ...prev.slice(0, 99)]
              return updated
            })
            options.onEvent?.(data)
          }
        } catch (error) {
          console.error("Error parsing realtime event:", error, event.data)
        }
      })

      eventSource.addEventListener("error", () => {
        console.error("Realtime connection error")
        setIsConnected(false)
        options.onConnectionChange?.(false)
        eventSource.close()
        eventSourceRef.current = null

        // Attempt reconnection
        reconnectTimeoutRef.current = setTimeout(() => {
          connect()
        }, 3000)
      })

      eventSourceRef.current = eventSource
    } catch (error) {
      console.error("Failed to establish realtime connection:", error)
      setIsConnected(false)
      options.onConnectionChange?.(false)

      // Attempt reconnection
      reconnectTimeoutRef.current = setTimeout(() => {
        connect()
      }, 3000)
    }
  }, [options])

  const disconnect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
      eventSourceRef.current = null
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }
    setIsConnected(false)
    options.onConnectionChange?.(false)
  }, [options])

  useEffect(() => {
    connect()

    return () => {
      disconnect()
    }
  }, [connect, disconnect])

  return {
    isConnected,
    stats,
    events,
    connect,
    disconnect,
  }
}
