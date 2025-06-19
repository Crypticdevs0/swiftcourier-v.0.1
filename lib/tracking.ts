import { nanoid } from "nanoid"

export interface TrackingEvent {
  id: string
  timestamp: string
  location: string
  status: string
  description: string
  facilityType?: "origin" | "transit" | "destination" | "delivery"
}

export interface Address {
  name: string
  address: string
  city: string
  state: string
  zip: string
  country?: string
}

export interface PackageDimensions {
  length: number
  width: number
  height: number
}

export interface Package {
  trackingNumber: string
  status: "pending" | "picked_up" | "in_transit" | "out_for_delivery" | "delivered" | "exception"
  estimatedDelivery: string
  currentLocation: string
  progress: number
  recipient: Address
  sender: Address
  service: string
  weight: number
  dimensions: PackageDimensions
  events: TrackingEvent[]
  createdAt: string
  deliveredAt?: string
  userId?: string
  cost?: number
  insurance?: number
  signature?: boolean
  specialInstructions?: string
}

// Generate unique tracking number
export function generateTrackingNumber(): string {
  const prefix = "SC"
  const timestamp = Date.now().toString().slice(-6)
  const random = nanoid(6)
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "X")
  return `${prefix}${timestamp}${random}`
}

// Calculate delivery progress
export function calculateProgress(status: Package["status"]): number {
  const progressMap = {
    pending: 10,
    picked_up: 25,
    in_transit: 50,
    out_for_delivery: 85,
    delivered: 100,
    exception: 15,
  }
  return progressMap[status] || 0
}

// Generate tracking events based on package status
export function generateTrackingEvents(
  trackingNumber: string,
  status: Package["status"],
  createdAt: string,
): TrackingEvent[] {
  const events: TrackingEvent[] = []
  const baseTime = new Date(createdAt).getTime()

  // Package created
  events.push({
    id: nanoid(),
    timestamp: new Date(baseTime).toISOString(),
    location: "Swift Courier Facility - New York, NY",
    status: "Package Created",
    description: "Shipping label created and package information received",
    facilityType: "origin",
  })

  if (status === "pending") return events

  // Package picked up
  events.push({
    id: nanoid(),
    timestamp: new Date(baseTime + 2 * 60 * 60 * 1000).toISOString(),
    location: "Swift Courier Facility - New York, NY",
    status: "Picked Up",
    description: "Package picked up and processed at origin facility",
    facilityType: "origin",
  })

  if (status === "picked_up") return events

  // In transit events
  events.push({
    id: nanoid(),
    timestamp: new Date(baseTime + 8 * 60 * 60 * 1000).toISOString(),
    location: "Sorting Facility - Philadelphia, PA",
    status: "In Transit",
    description: "Package arrived at sorting facility",
    facilityType: "transit",
  })

  events.push({
    id: nanoid(),
    timestamp: new Date(baseTime + 16 * 60 * 60 * 1000).toISOString(),
    location: "Distribution Center - Chicago, IL",
    status: "In Transit",
    description: "Package departed sorting facility",
    facilityType: "transit",
  })

  if (status === "in_transit") return events

  // Out for delivery
  events.push({
    id: nanoid(),
    timestamp: new Date(baseTime + 24 * 60 * 60 * 1000).toISOString(),
    location: "Local Facility - Chicago, IL",
    status: "Arrived at Destination",
    description: "Package arrived at destination facility",
    facilityType: "destination",
  })

  events.push({
    id: nanoid(),
    timestamp: new Date(baseTime + 26 * 60 * 60 * 1000).toISOString(),
    location: "Chicago, IL",
    status: "Out for Delivery",
    description: "Package loaded on delivery vehicle",
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

  // Exception handling
  if (status === "exception") {
    events.push({
      id: nanoid(),
      timestamp: new Date(baseTime + 12 * 60 * 60 * 1000).toISOString(),
      location: "Sorting Facility - Philadelphia, PA",
      status: "Exception",
      description: "Delivery exception - address verification required",
      facilityType: "transit",
    })
  }

  return events
}

// Calculate shipping cost
export function calculateShippingCost(
  weight: number,
  dimensions: PackageDimensions,
  service: string,
  distance = 1000, // miles
): number {
  const baseRates = {
    swift_express: 15.99,
    swift_standard: 8.99,
    swift_overnight: 25.99,
    swift_ground: 6.99,
  }

  const baseRate = baseRates[service as keyof typeof baseRates] || 8.99
  const weightMultiplier = Math.max(1, Math.ceil(weight))
  const dimensionalWeight = (dimensions.length * dimensions.width * dimensions.height) / 166
  const billableWeight = Math.max(weight, dimensionalWeight)
  const distanceMultiplier = Math.max(1, distance / 1000)

  return Math.round((baseRate * weightMultiplier * distanceMultiplier + billableWeight * 0.5) * 100) / 100
}

// Mock package database
export const mockPackages: Package[] = []

// Create a new package
export function createPackage(packageData: Omit<Package, "trackingNumber" | "events" | "progress">): Package {
  const trackingNumber = generateTrackingNumber()
  const events = generateTrackingEvents(trackingNumber, packageData.status, packageData.createdAt)
  const progress = calculateProgress(packageData.status)

  const newPackage: Package = {
    ...packageData,
    trackingNumber,
    events,
    progress,
  }

  mockPackages.push(newPackage)
  return newPackage
}

// Find package by tracking number
export function findPackageByTrackingNumber(trackingNumber: string): Package | null {
  return mockPackages.find((pkg) => pkg.trackingNumber === trackingNumber) || null
}

// Update package status
export function updatePackageStatus(trackingNumber: string, newStatus: Package["status"]): Package | null {
  const packageIndex = mockPackages.findIndex((pkg) => pkg.trackingNumber === trackingNumber)
  if (packageIndex === -1) return null

  const pkg = mockPackages[packageIndex]
  pkg.status = newStatus
  pkg.progress = calculateProgress(newStatus)
  pkg.events = generateTrackingEvents(trackingNumber, newStatus, pkg.createdAt)

  if (newStatus === "delivered") {
    pkg.deliveredAt = new Date().toISOString()
  }

  return pkg
}
