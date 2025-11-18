import fs from "fs"
import path from "path"
import store from "./store"
import type { Package, User } from "./mock-data"

const DATA_DIR = path.join(process.cwd(), ".data")
const PACKAGES_FILE = path.join(DATA_DIR, "packages.json")
const USERS_FILE = path.join(DATA_DIR, "users.json")

interface RealtimeEvent {
  id: string
  type: "package_updated" | "package_created" | "status_changed" | "event_added"
  timestamp: string
  data: any
  changes?: Record<string, any>
}

class RealtimeStore {
  private subscribers: Map<string, Set<(event: RealtimeEvent) => void>> = new Map()
  private eventHistory: RealtimeEvent[] = []
  private maxHistorySize = 1000
  private persistenceEnabled = true

  constructor() {
    this.initializeDataDir()
  }

  private initializeDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true })
    }
  }

  private persistPackages() {
    if (!this.persistenceEnabled) return
    try {
      const packages = store.getAllPackages()
      fs.writeFileSync(PACKAGES_FILE, JSON.stringify(packages, null, 2))
    } catch (error) {
      console.error("Failed to persist packages:", error)
    }
  }

  private persistUsers() {
    if (!this.persistenceEnabled) return
    try {
      // Get all users from store - this is a simplified approach
      // In production, you'd maintain a proper user list
      const data = { timestamp: new Date().toISOString() }
      fs.writeFileSync(USERS_FILE, JSON.stringify(data, null, 2))
    } catch (error) {
      console.error("Failed to persist users:", error)
    }
  }

  subscribe(channel: string, callback: (event: RealtimeEvent) => void): () => void {
    if (!this.subscribers.has(channel)) {
      this.subscribers.set(channel, new Set())
    }
    this.subscribers.get(channel)!.add(callback)

    // Return unsubscribe function
    return () => {
      this.subscribers.get(channel)?.delete(callback)
    }
  }

  broadcast(channel: string, event: Omit<RealtimeEvent, "id" | "timestamp">) {
    const fullEvent: RealtimeEvent = {
      ...event,
      id: Math.random().toString(36).substring(7),
      timestamp: new Date().toISOString(),
    }

    // Add to history
    this.eventHistory.push(fullEvent)
    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory.shift()
    }

    // Broadcast to subscribers
    const subscribers = this.subscribers.get(channel)
    if (subscribers) {
      subscribers.forEach((callback) => {
        try {
          callback(fullEvent)
        } catch (error) {
          console.error("Error calling subscriber:", error)
        }
      })
    }

    // Also broadcast to wildcard subscribers
    const wildcardSubscribers = this.subscribers.get("*")
    if (wildcardSubscribers) {
      wildcardSubscribers.forEach((callback) => {
        try {
          callback(fullEvent)
        } catch (error) {
          console.error("Error calling wildcard subscriber:", error)
        }
      })
    }
  }

  async updatePackageStatus(trackingNumber: string, newStatus: Package["status"], reason?: string): Promise<boolean> {
    const pkg = store.getPackageByTrackingNumber(trackingNumber)
    if (!pkg) return false

    const oldStatus = pkg.status

    // Add tracking event
    const event = {
      timestamp: new Date().toISOString(),
      status: newStatus,
      location: pkg.recipient.city + ", " + pkg.recipient.state,
      description: reason || `Status updated to ${newStatus}`,
    }

    const success = store.addTrackingEvent(trackingNumber, event)

    if (success) {
      // Update the actual package status
      ;(pkg as any).status = newStatus
      ;(pkg as any).updatedAt = new Date().toISOString()

      if (newStatus === "delivered" && !pkg.actualDelivery) {
        ;(pkg as any).actualDelivery = new Date().toISOString()
      }

      // Persist changes
      this.persistPackages()

      // Broadcast update
      this.broadcast(`package:${trackingNumber}`, {
        type: "status_changed",
        data: {
          trackingNumber,
          oldStatus,
          newStatus,
          reason,
          package: pkg,
        },
        changes: {
          status: newStatus,
          updatedAt: pkg.updatedAt,
        },
      })

      // Also broadcast to admin channel
      this.broadcast("admin:packages", {
        type: "package_updated",
        data: {
          trackingNumber,
          oldStatus,
          newStatus,
          package: pkg,
        },
        changes: {
          status: newStatus,
          updatedAt: pkg.updatedAt,
        },
      })

      return true
    }

    return false
  }

  async addPackageEvent(trackingNumber: string, description: string, location: string): Promise<boolean> {
    const pkg = store.getPackageByTrackingNumber(trackingNumber)
    if (!pkg) return false

    const event = {
      timestamp: new Date().toISOString(),
      status: pkg.status,
      location,
      description,
    }

    const success = store.addTrackingEvent(trackingNumber, event)

    if (success) {
      ;(pkg as any).updatedAt = new Date().toISOString()
      this.persistPackages()

      this.broadcast(`package:${trackingNumber}`, {
        type: "event_added",
        data: {
          trackingNumber,
          event,
          package: pkg,
        },
      })

      return true
    }

    return false
  }

  getEventHistory(limit: number = 50): RealtimeEvent[] {
    return this.eventHistory.slice(-limit)
  }

  getPackageStats(): {
    total: number
    byStatus: Record<string, number>
    recentEvents: number
  } {
    const packages = store.getAllPackages()
    const byStatus: Record<string, number> = {}

    packages.forEach((pkg) => {
      byStatus[pkg.status] = (byStatus[pkg.status] || 0) + 1
    })

    return {
      total: packages.length,
      byStatus,
      recentEvents: this.eventHistory.length,
    }
  }
}

export const realtimeStore = new RealtimeStore()
