/**
 * Unified Tracking System - Data Models
 * 
 * This file defines all core data structures for the tracking system:
 * - Products (goods being shipped)
 * - Locations (pickup/dropoff points)
 * - Tracking Numbers (shipment identifiers)
 * - Tracking Activities (status history and events)
 */

export interface Product {
  id: string
  sku: string
  name: string
  description: string
  category: string
  dimensions: {
    length: number
    width: number
    height: number
    unit: "cm" | "in"
  }
  weight: {
    value: number
    unit: "kg" | "lbs"
  }
  pricing: {
    baseCost: number
    currency: string
  }
  isActive: boolean
  createdAt: string
  updatedAt: string
  createdBy: string
}

export interface Location {
  id: string
  name: string
  type: "pickup" | "dropoff" | "hub" | "warehouse"
  address: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  coordinates: {
    latitude: number
    longitude: number
  }
  contact: {
    personName: string
    email: string
    phone: string
  }
  operatingHours: {
    monday: { open: string; close: string }
    tuesday: { open: string; close: string }
    wednesday: { open: string; close: string }
    thursday: { open: string; close: string }
    friday: { open: string; close: string }
    saturday: { open: string; close: string }
    sunday: { open: string; close: string }
  }
  capacity: {
    maxPackages: number
    currentPackages: number
  }
  serviceZones: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
  createdBy: string
}

export interface TrackingNumber {
  id: string
  trackingNumber: string
  status: "pending" | "picked_up" | "in_transit" | "out_for_delivery" | "delivered" | "exception"
  productId: string
  senderLocationId: string
  recipientLocationId: string
  recipientName: string
  recipientEmail: string
  recipientPhone: string
  senderName: string
  pickupDate: string
  estimatedDeliveryDate: string
  actualDeliveryDate?: string
  notes: string
  specialHandling: string[]
  assignedAgent?: string
  currentLocation?: string
  priority: "standard" | "express" | "overnight"
  cost: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  createdBy: string
}

export interface TrackingActivity {
  id: string
  trackingNumberId: string
  trackingNumber: string
  type:
    | "created"
    | "picked_up"
    | "in_transit"
    | "out_for_delivery"
    | "delivered"
    | "exception"
    | "note_added"
    | "location_updated"
    | "status_changed"
  status: TrackingNumber["status"]
  location: string
  locationId: string
  description: string
  timestamp: string
  latitude?: number
  longitude?: number
  createdBy: string
  metadata?: Record<string, any>
}

export interface TrackingActivity {
  id: string
  trackingNumberId: string
  trackingNumber: string
  type:
    | "created"
    | "picked_up"
    | "in_transit"
    | "out_for_delivery"
    | "delivered"
    | "exception"
    | "note_added"
    | "location_updated"
    | "status_changed"
  status: TrackingNumber["status"]
  location: string
  locationId: string
  description: string
  timestamp: string
  latitude?: number
  longitude?: number
  createdBy: string
  metadata?: Record<string, any>
}

export interface AdminDashboardStats {
  totalTrackingNumbers: number
  activeShipments: number
  deliveredToday: number
  exceptionCount: number
  totalRevenue: number
  averageDeliveryTime: number
  byStatus: Record<TrackingNumber["status"], number>
  byPriority: Record<TrackingNumber["priority"], number>
  recentActivities: TrackingActivity[]
}

export interface UnifiedTrackingData {
  products: Product[]
  locations: Location[]
  trackingNumbers: TrackingNumber[]
  activities: TrackingActivity[]
  stats: AdminDashboardStats
}

// Utility functions for models

export function generateTrackingNumber(): string {
  const prefix = "SC"
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${prefix}${timestamp}${random}`
}

export function calculateDeliveryStats(
  trackingNumbers: TrackingNumber[]
): AdminDashboardStats {
  const delivered = trackingNumbers.filter((t) => t.status === "delivered")
  const active = trackingNumbers.filter(
    (t) => t.status !== "delivered" && t.status !== "exception"
  )
  const exceptions = trackingNumbers.filter((t) => t.status === "exception")
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const deliveredToday = delivered.filter(
    (t) => new Date(t.actualDeliveryDate || "") >= today
  ).length

  const byStatus: Record<TrackingNumber["status"], number> = {
    pending: 0,
    picked_up: 0,
    in_transit: 0,
    out_for_delivery: 0,
    delivered: 0,
    exception: 0,
  }

  trackingNumbers.forEach((t) => {
    byStatus[t.status]++
  })

  const byPriority: Record<TrackingNumber["priority"], number> = {
    standard: 0,
    express: 0,
    overnight: 0,
  }

  trackingNumbers.forEach((t) => {
    byPriority[t.priority]++
  })

  const totalRevenue = trackingNumbers.reduce((sum, t) => sum + t.cost, 0)
  const avgDeliveryTime = 2.5 // Placeholder - calculate from actual data

  return {
    totalTrackingNumbers: trackingNumbers.length,
    activeShipments: active.length,
    deliveredToday,
    exceptionCount: exceptions.length,
    totalRevenue,
    averageDeliveryTime: avgDeliveryTime,
    byStatus,
    byPriority,
    recentActivities: [],
  }
}
