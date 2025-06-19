import { nanoid } from "nanoid"

export interface TrackingEvent {
  id: string
  timestamp: string
  location: string
  status: string
  description: string
  facilityType?: "origin" | "transit" | "destination" | "delivery"
}

export interface Package {
  trackingNumber: string
  status: "pending" | "in_transit" | "out_for_delivery" | "delivered" | "exception"
  estimatedDelivery: string
  currentLocation: string
  progress: number
  recipient: {
    name: string
    address: string
    city: string
    state: string
    zip: string
  }
  sender: {
    name: string
    address: string
    city: string
    state: string
    zip: string
  }
  service: string
  weight: number
  dimensions: {
    length: number
    width: number
    height: number
  }
  events: TrackingEvent[]
  createdAt: string
  deliveredAt?: string
}

// Generate unique tracking number
export function generateTrackingNumber(): string {
  const prefix = "SC"
  const timestamp = Date.now().toString().slice(-6)
  const random = nanoid(6).toUpperCase()
  return `${prefix}${timestamp}${random}`
}

// Generate tracking events based on package status
export function generateTrackingEvents(
  trackingNumber: string,
  status: Package["status"],
  createdAt: string,
): TrackingEvent[] {
  const events: TrackingEvent[] = []
  const baseTime = new Date(createdAt).getTime()

  // Package received
  events.push({
    id: nanoid(),
    timestamp: new Date(baseTime).toISOString(),
    location: "Origin Facility - New York, NY",
    status: "Package Received",
    description: "Package received at Swift Courier facility",
    facilityType: "origin",
  })

  if (status === "pending") return events

  // In transit events
  events.push({
    id: nanoid(),
    timestamp: new Date(baseTime + 2 * 60 * 60 * 1000).toISOString(),
    location: "Origin Facility - New York, NY",
    status: "Departed Facility",
    description: "Package has left the origin facility",
    facilityType: "origin",
  })

  events.push({
    id: nanoid(),
    timestamp: new Date(baseTime + 8 * 60 * 60 * 1000).toISOString(),
    location: "Sorting Facility - Philadelphia, PA",
    status: "In Transit",
    description: "Package arrived at sorting facility",
    facilityType: "transit",
  })

  if (status === "in_transit") return events

  // Out for delivery
  events.push({
    id: nanoid(),
    timestamp: new Date(baseTime + 24 * 60 * 60 * 1000).toISOString(),
    location: "Distribution Center - Chicago, IL",
    status: "Arrived at Destination",
    description: "Package arrived at destination facility",
    facilityType: "destination",
  })

  events.push({
    id: nanoid(),
    timestamp: new Date(baseTime + 26 * 60 * 60 * 1000).toISOString(),
    location: "Chicago, IL",
    status: "Out for Delivery",
    description: "Package is out for delivery",
    facilityType: "delivery",
  })

  if (status === "out_for_delivery") return events

  // Delivered
  if (status === "delivered") {
    events.push({
      id: nanoid(),
      timestamp: new Date(baseTime + 28 * 60 * 60 * 1000).toISOString(),
      location: "Chicago, IL 60601",
      status: "Delivered",
      description: "Package delivered to recipient",
      facilityType: "delivery",
    })
  }

  return events
}

// Calculate delivery progress
export function calculateProgress(status: Package["status"]): number {
  switch (status) {
    case "pending":
      return 10
    case "in_transit":
      return 50
    case "out_for_delivery":
      return 85
    case "delivered":
      return 100
    case "exception":
      return 25
    default:
      return 0
  }
}
