import { nanoid } from "nanoid"

export interface TrackingEvent {
  id: string
  timestamp: Date
  location: string
  status: string
  description: string
}

export interface Package {
  trackingNumber: string
  status: "pending" | "picked_up" | "in_transit" | "out_for_delivery" | "delivered" | "exception"
  sender: {
    name: string
    address: string
  }
  recipient: {
    name: string
    address: string
  }
  service: string
  weight: number
  dimensions: {
    length: number
    width: number
    height: number
  }
  estimatedDelivery: Date
  events: TrackingEvent[]
  createdAt: Date
}

// Generate unique tracking number
export function generateTrackingNumber(): string {
  const prefix = "SC"
  const timestamp = Date.now().toString().slice(-8)
  const random = nanoid(6).toUpperCase()
  return `${prefix}${timestamp}${random}`
}

// Calculate delivery progress
export function calculateProgress(status: Package["status"]): number {
  const progressMap = {
    pending: 10,
    picked_up: 25,
    in_transit: 50,
    out_for_delivery: 75,
    delivered: 100,
    exception: 0,
  }
  return progressMap[status] || 0
}

// Generate mock tracking events
export function generateTrackingEvents(status: Package["status"]): TrackingEvent[] {
  const events: TrackingEvent[] = []
  const now = new Date()

  // Always add package created event
  events.push({
    id: nanoid(),
    timestamp: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    location: "Swift Courier Facility - New York, NY",
    status: "Package Created",
    description: "Shipping label created and package received at facility",
  })

  if (status === "pending") return events

  // Add picked up event
  events.push({
    id: nanoid(),
    timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    location: "Swift Courier Facility - New York, NY",
    status: "Picked Up",
    description: "Package picked up and processed at origin facility",
  })

  if (status === "picked_up") return events

  // Add in transit events
  events.push({
    id: nanoid(),
    timestamp: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    location: "Swift Courier Hub - Philadelphia, PA",
    status: "In Transit",
    description: "Package in transit to destination facility",
  })

  if (status === "in_transit") return events

  // Add out for delivery event
  events.push({
    id: nanoid(),
    timestamp: new Date(now.getTime() - 4 * 60 * 60 * 1000), // 4 hours ago
    location: "Swift Courier Facility - Boston, MA",
    status: "Out for Delivery",
    description: "Package loaded on delivery vehicle",
  })

  if (status === "out_for_delivery") return events

  // Add delivered event
  if (status === "delivered") {
    events.push({
      id: nanoid(),
      timestamp: new Date(now.getTime() - 1 * 60 * 60 * 1000), // 1 hour ago
      location: "Boston, MA 02101",
      status: "Delivered",
      description: "Package delivered to recipient",
    })
  }

  return events.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
}

// Create mock package data
export function createMockPackage(overrides?: Partial<Package>): Package {
  const trackingNumber = generateTrackingNumber()
  const status = overrides?.status || "in_transit"

  return {
    trackingNumber,
    status,
    sender: {
      name: "John Doe",
      address: "123 Main St, New York, NY 10001",
    },
    recipient: {
      name: "Jane Smith",
      address: "456 Oak Ave, Boston, MA 02101",
    },
    service: "Swift Express",
    weight: 2.5,
    dimensions: {
      length: 12,
      width: 8,
      height: 6,
    },
    estimatedDelivery: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    events: generateTrackingEvents(status),
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    ...overrides,
  }
}
