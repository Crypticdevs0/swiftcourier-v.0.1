import { realtimeStore } from "./realtime-store"
import type {
  Product,
  Location,
  TrackingNumber,
  TrackingActivity,
  AdminDashboardStats,
} from "./models"
import { calculateDeliveryStats, generateTrackingNumber } from "./models"

interface UnifiedStore {
  // Products
  getAllProducts: () => Product[]
  getProductById: (id: string) => Product | undefined
  createProduct: (data: Omit<Product, "id" | "createdAt" | "updatedAt">) => Product
  updateProduct: (id: string, data: Partial<Product>) => Product | undefined
  deleteProduct: (id: string) => boolean
  searchProducts: (query: string) => Product[]

  // Locations
  getAllLocations: () => Location[]
  getLocationById: (id: string) => Location | undefined
  createLocation: (data: Omit<Location, "id" | "createdAt" | "updatedAt">) => Location
  updateLocation: (id: string, data: Partial<Location>) => Location | undefined
  deleteLocation: (id: string) => boolean
  searchLocations: (query: string) => Location[]
  getLocationsByType: (type: Location["type"]) => Location[]

  // Tracking Numbers
  getAllTrackingNumbers: () => TrackingNumber[]
  getTrackingNumberById: (id: string) => TrackingNumber | undefined
  getByTrackingNumber: (trackingNumber: string) => TrackingNumber | undefined
  createTrackingNumber: (
    data: Omit<TrackingNumber, "id" | "trackingNumber" | "createdAt" | "updatedAt">
  ) => TrackingNumber
  updateTrackingNumber: (id: string, data: Partial<TrackingNumber>) => TrackingNumber | undefined
  deleteTrackingNumber: (id: string) => boolean
  searchTrackingNumbers: (query: string) => TrackingNumber[]

  // Tracking Activities
  getAllActivities: () => TrackingActivity[]
  getActivitiesByTrackingNumber: (trackingNumber: string) => TrackingActivity[]
  addActivity: (data: Omit<TrackingActivity, "id">) => TrackingActivity
  getRecentActivities: (limit: number) => TrackingActivity[]

  // Statistics
  getDashboardStats: () => AdminDashboardStats
  getStatsByStatus: (status: TrackingNumber["status"]) => TrackingNumber[]
  getStatsByPriority: (priority: TrackingNumber["priority"]) => TrackingNumber[]
  getDeliveredToday: () => TrackingNumber[]
  getExceptions: () => TrackingNumber[]
}

// In-memory data storage
const products: Product[] = []
const locations: Location[] = []
const trackingNumbers: TrackingNumber[] = []
const activities: TrackingActivity[] = []

// Initialize with demo data
function initializeDemo() {
  if (products.length === 0) {
    // Demo products
    products.push(
      {
        id: "prod_001",
        sku: "ELC-001",
        name: "Electronics Package",
        description: "Generic electronics shipment",
        category: "Electronics",
        dimensions: { length: 30, width: 20, height: 15, unit: "cm" },
        weight: { value: 5, unit: "kg" },
        pricing: { baseCost: 25.99, currency: "USD" },
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: "system",
      },
      {
        id: "prod_002",
        sku: "DOC-001",
        name: "Documents",
        description: "Document shipment",
        category: "Documents",
        dimensions: { length: 25, width: 17, height: 2, unit: "cm" },
        weight: { value: 0.5, unit: "kg" },
        pricing: { baseCost: 9.99, currency: "USD" },
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: "system",
      }
    )
  }

  if (locations.length === 0) {
    // Demo locations
    const now = new Date().toLocaleTimeString("en-US", { hour12: false })
    const openTime = "09:00"
    const closeTime = "18:00"

    locations.push(
      {
        id: "loc_001",
        name: "Main Warehouse",
        type: "warehouse",
        address: {
          street: "123 Commerce St",
          city: "New York",
          state: "NY",
          zipCode: "10001",
          country: "USA",
        },
        coordinates: { latitude: 40.7128, longitude: -74.006 },
        contact: {
          personName: "John Manager",
          email: "john@swiftcourier.com",
          phone: "+1-212-555-0001",
        },
        operatingHours: {
          monday: { open: openTime, close: closeTime },
          tuesday: { open: openTime, close: closeTime },
          wednesday: { open: openTime, close: closeTime },
          thursday: { open: openTime, close: closeTime },
          friday: { open: openTime, close: closeTime },
          saturday: { open: "10:00", close: "16:00" },
          sunday: { open: "Closed", close: "Closed" },
        },
        capacity: { maxPackages: 5000, currentPackages: 2341 },
        serviceZones: ["NY", "NJ", "CT"],
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: "system",
      },
      {
        id: "loc_002",
        name: "Downtown Hub",
        type: "hub",
        address: {
          street: "456 Distribution Ave",
          city: "Los Angeles",
          state: "CA",
          zipCode: "90001",
          country: "USA",
        },
        coordinates: { latitude: 34.0522, longitude: -118.2437 },
        contact: {
          personName: "Sarah Hub Manager",
          email: "sarah@swiftcourier.com",
          phone: "+1-213-555-0002",
        },
        operatingHours: {
          monday: { open: openTime, close: closeTime },
          tuesday: { open: openTime, close: closeTime },
          wednesday: { open: openTime, close: closeTime },
          thursday: { open: openTime, close: closeTime },
          friday: { open: openTime, close: closeTime },
          saturday: { open: "Closed", close: "Closed" },
          sunday: { open: "Closed", close: "Closed" },
        },
        capacity: { maxPackages: 3000, currentPackages: 1567 },
        serviceZones: ["CA", "AZ", "NV"],
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: "system",
      }
    )
  }
}

// Initialize demo data on module load
initializeDemo()

export const unifiedStore: UnifiedStore = {
  // Products
  getAllProducts: () => products,

  getProductById: (id: string) => products.find((p) => p.id === id),

  createProduct: (data) => {
    const product: Product = {
      ...data,
      id: `prod_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    products.push(product)
    realtimeStore.broadcast("admin:products", {
      type: "product_created",
      data: product,
    })
    return product
  },

  updateProduct: (id, data) => {
    const product = products.find((p) => p.id === id)
    if (!product) return undefined
    Object.assign(product, data, { updatedAt: new Date().toISOString() })
    realtimeStore.broadcast("admin:products", {
      type: "product_updated",
      data: product,
      changes: data,
    })
    return product
  },

  deleteProduct: (id) => {
    const index = products.findIndex((p) => p.id === id)
    if (index === -1) return false
    const [deleted] = products.splice(index, 1)
    realtimeStore.broadcast("admin:products", {
      type: "product_deleted",
      data: { id, sku: deleted.sku },
    })
    return true
  },

  searchProducts: (query) => {
    const q = query.toLowerCase()
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    )
  },

  // Locations
  getAllLocations: () => locations,

  getLocationById: (id: string) => locations.find((l) => l.id === id),

  createLocation: (data) => {
    const location: Location = {
      ...data,
      id: `loc_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    locations.push(location)
    realtimeStore.broadcast("admin:locations", {
      type: "location_created",
      data: location,
    })
    return location
  },

  updateLocation: (id, data) => {
    const location = locations.find((l) => l.id === id)
    if (!location) return undefined
    Object.assign(location, data, { updatedAt: new Date().toISOString() })
    realtimeStore.broadcast("admin:locations", {
      type: "location_updated",
      data: location,
      changes: data,
    })
    return location
  },

  deleteLocation: (id) => {
    const index = locations.findIndex((l) => l.id === id)
    if (index === -1) return false
    const [deleted] = locations.splice(index, 1)
    realtimeStore.broadcast("admin:locations", {
      type: "location_deleted",
      data: { id, name: deleted.name },
    })
    return true
  },

  searchLocations: (query) => {
    const q = query.toLowerCase()
    return locations.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.address.city.toLowerCase().includes(q) ||
        l.address.state.toLowerCase().includes(q)
    )
  },

  getLocationsByType: (type) => locations.filter((l) => l.type === type),

  // Tracking Numbers
  getAllTrackingNumbers: () => trackingNumbers,

  getTrackingNumberById: (id: string) => trackingNumbers.find((t) => t.id === id),

  getByTrackingNumber: (trackingNumber: string) =>
    trackingNumbers.find((t) => t.trackingNumber === trackingNumber),

  createTrackingNumber: (data) => {
    const generatedNumber = generateTrackingNumber()
    const trackingNumber: TrackingNumber = {
      ...data,
      id: `tn_${Date.now()}`,
      trackingNumber: generatedNumber,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    trackingNumbers.push(trackingNumber)

    // Add creation activity
    unifiedStore.addActivity({
      trackingNumberId: trackingNumber.id,
      trackingNumber: generatedNumber,
      type: "created",
      status: "pending",
      location: "System",
      locationId: "",
      description: "Tracking number created",
      timestamp: new Date().toISOString(),
      createdBy: data.createdBy,
    })

    realtimeStore.broadcast("admin:tracking", {
      type: "tracking_created",
      data: trackingNumber,
    })

    return trackingNumber
  },

  updateTrackingNumber: (id, data) => {
    const tracking = trackingNumbers.find((t) => t.id === id)
    if (!tracking) return undefined

    const oldStatus = tracking.status
    Object.assign(tracking, data, { updatedAt: new Date().toISOString() })

    if (data.status && data.status !== oldStatus) {
      unifiedStore.addActivity({
        trackingNumberId: tracking.id,
        trackingNumber: tracking.trackingNumber,
        type: "status_changed",
        status: data.status,
        location: data.currentLocation || tracking.currentLocation || "Unknown",
        locationId: "",
        description: `Status updated from ${oldStatus} to ${data.status}`,
        timestamp: new Date().toISOString(),
        createdBy: "system",
      })
    }

    realtimeStore.broadcast("admin:tracking", {
      type: "tracking_updated",
      data: tracking,
      changes: data,
    })

    return tracking
  },

  deleteTrackingNumber: (id) => {
    const index = trackingNumbers.findIndex((t) => t.id === id)
    if (index === -1) return false
    const [deleted] = trackingNumbers.splice(index, 1)
    realtimeStore.broadcast("admin:tracking", {
      type: "tracking_deleted",
      data: { id, trackingNumber: deleted.trackingNumber },
    })
    return true
  },

  searchTrackingNumbers: (query) => {
    const q = query.toLowerCase()
    return trackingNumbers.filter(
      (t) =>
        t.trackingNumber.toLowerCase().includes(q) ||
        t.recipientName.toLowerCase().includes(q) ||
        t.senderName.toLowerCase().includes(q)
    )
  },

  // Tracking Activities
  getAllActivities: () => activities,

  getActivitiesByTrackingNumber: (trackingNumber: string) =>
    activities.filter((a) => a.trackingNumber === trackingNumber),

  addActivity: (data) => {
    const activity: TrackingActivity = {
      ...data,
      id: `act_${Date.now()}`,
    }
    activities.push(activity)
    realtimeStore.broadcast(`tracking:${data.trackingNumber}`, {
      type: "activity_added",
      data: activity,
    })
    realtimeStore.broadcast("admin:activities", {
      type: "activity_added",
      data: activity,
    })
    return activity
  },

  getRecentActivities: (limit = 50) => activities.slice(-limit),

  // Statistics
  getDashboardStats: () => calculateDeliveryStats(trackingNumbers),

  getStatsByStatus: (status) => trackingNumbers.filter((t) => t.status === status),

  getStatsByPriority: (priority) => trackingNumbers.filter((t) => t.priority === priority),

  getDeliveredToday: () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return trackingNumbers.filter(
      (t) =>
        t.status === "delivered" &&
        t.actualDeliveryDate &&
        new Date(t.actualDeliveryDate) >= today
    )
  },

  getExceptions: () => trackingNumbers.filter((t) => t.status === "exception"),
}
