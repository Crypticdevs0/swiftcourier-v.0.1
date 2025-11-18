"use client"

import { useState, useCallback } from "react"
import type { Product, Location, TrackingNumber, TrackingActivity } from "@/lib/models"

interface UseUnifiedDashboardReturn {
  trackingNumbers: TrackingNumber[]
  products: Product[]
  locations: Location[]
  activities: TrackingActivity[]
  loading: boolean
  error: string | null
  
  // Tracking Numbers
  fetchTrackingNumbers: (query?: string, status?: string) => Promise<void>
  createTrackingNumber: (data: any) => Promise<boolean>
  updateTrackingNumber: (id: string, data: any) => Promise<boolean>
  deleteTrackingNumber: (id: string) => Promise<boolean>
  
  // Products
  fetchProducts: (query?: string) => Promise<void>
  createProduct: (data: any) => Promise<boolean>
  updateProduct: (id: string, data: any) => Promise<boolean>
  deleteProduct: (id: string) => Promise<boolean>
  
  // Locations
  fetchLocations: (query?: string, type?: string) => Promise<void>
  createLocation: (data: any) => Promise<boolean>
  updateLocation: (id: string, data: any) => Promise<boolean>
  deleteLocation: (id: string) => Promise<boolean>
  
  // Activities
  fetchActivities: (trackingNumber?: string, limit?: number) => Promise<void>
  addActivity: (trackingNumberId: string, data: any) => Promise<boolean>
}

export function useUnifiedDashboard(): UseUnifiedDashboardReturn {
  const [trackingNumbers, setTrackingNumbers] = useState<TrackingNumber[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  const [activities, setActivities] = useState<TrackingActivity[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Tracking Numbers
  const fetchTrackingNumbers = useCallback(async (query?: string, status?: string) => {
    setLoading(true)
    setError(null)
    try {
      let url = "/api/admin/tracking-numbers"
      const params = new URLSearchParams()
      if (query) params.append("q", query)
      if (status) params.append("status", status)
      if (params.toString()) url += `?${params.toString()}`

      const response = await fetch(url, { credentials: "include" })
      if (!response.ok) throw new Error("Failed to fetch tracking numbers")

      const data = await response.json()
      setTrackingNumbers(data.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }, [])

  const createTrackingNumber = useCallback(async (data: any) => {
    try {
      const response = await fetch("/api/admin/tracking-numbers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ action: "create", ...data }),
      })

      if (!response.ok) throw new Error("Failed to create tracking number")
      await fetchTrackingNumbers()
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
      return false
    }
  }, [fetchTrackingNumbers])

  const updateTrackingNumber = useCallback(async (id: string, data: any) => {
    try {
      const response = await fetch("/api/admin/tracking-numbers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ action: "update", id, ...data }),
      })

      if (!response.ok) throw new Error("Failed to update tracking number")
      await fetchTrackingNumbers()
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
      return false
    }
  }, [fetchTrackingNumbers])

  const deleteTrackingNumber = useCallback(async (id: string) => {
    try {
      const response = await fetch("/api/admin/tracking-numbers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ action: "delete", id }),
      })

      if (!response.ok) throw new Error("Failed to delete tracking number")
      await fetchTrackingNumbers()
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
      return false
    }
  }, [fetchTrackingNumbers])

  // Products
  const fetchProducts = useCallback(async (query?: string) => {
    setLoading(true)
    setError(null)
    try {
      let url = "/api/admin/products"
      if (query) url += `?q=${encodeURIComponent(query)}`

      const response = await fetch(url, { credentials: "include" })
      if (!response.ok) throw new Error("Failed to fetch products")

      const data = await response.json()
      setProducts(data.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }, [])

  const createProduct = useCallback(async (data: any) => {
    try {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ action: "create", ...data }),
      })

      if (!response.ok) throw new Error("Failed to create product")
      await fetchProducts()
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
      return false
    }
  }, [fetchProducts])

  const updateProduct = useCallback(async (id: string, data: any) => {
    try {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ action: "update", id, ...data }),
      })

      if (!response.ok) throw new Error("Failed to update product")
      await fetchProducts()
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
      return false
    }
  }, [fetchProducts])

  const deleteProduct = useCallback(async (id: string) => {
    try {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ action: "delete", id }),
      })

      if (!response.ok) throw new Error("Failed to delete product")
      await fetchProducts()
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
      return false
    }
  }, [fetchProducts])

  // Locations
  const fetchLocations = useCallback(async (query?: string, type?: string) => {
    setLoading(true)
    setError(null)
    try {
      let url = "/api/admin/locations"
      const params = new URLSearchParams()
      if (query) params.append("q", query)
      if (type) params.append("type", type)
      if (params.toString()) url += `?${params.toString()}`

      const response = await fetch(url, { credentials: "include" })
      if (!response.ok) throw new Error("Failed to fetch locations")

      const data = await response.json()
      setLocations(data.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }, [])

  const createLocation = useCallback(async (data: any) => {
    try {
      const response = await fetch("/api/admin/locations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ action: "create", ...data }),
      })

      if (!response.ok) throw new Error("Failed to create location")
      await fetchLocations()
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
      return false
    }
  }, [fetchLocations])

  const updateLocation = useCallback(async (id: string, data: any) => {
    try {
      const response = await fetch("/api/admin/locations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ action: "update", id, ...data }),
      })

      if (!response.ok) throw new Error("Failed to update location")
      await fetchLocations()
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
      return false
    }
  }, [fetchLocations])

  const deleteLocation = useCallback(async (id: string) => {
    try {
      const response = await fetch("/api/admin/locations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ action: "delete", id }),
      })

      if (!response.ok) throw new Error("Failed to delete location")
      await fetchLocations()
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
      return false
    }
  }, [fetchLocations])

  // Activities
  const fetchActivities = useCallback(async (trackingNumber?: string, limit?: number) => {
    setLoading(true)
    setError(null)
    try {
      let url = "/api/admin/activities"
      const params = new URLSearchParams()
      if (trackingNumber) params.append("trackingNumber", trackingNumber)
      if (limit) params.append("limit", limit.toString())
      if (params.toString()) url += `?${params.toString()}`

      const response = await fetch(url, { credentials: "include" })
      if (!response.ok) throw new Error("Failed to fetch activities")

      const data = await response.json()
      setActivities(data.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }, [])

  const addActivity = useCallback(
    async (trackingNumberId: string, data: any) => {
      try {
        const response = await fetch("/api/admin/tracking-numbers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            action: "add_activity",
            trackingNumberId,
            ...data,
          }),
        })

        if (!response.ok) throw new Error("Failed to add activity")
        await fetchActivities()
        return true
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error")
        return false
      }
    },
    [fetchActivities]
  )

  return {
    trackingNumbers,
    products,
    locations,
    activities,
    loading,
    error,
    fetchTrackingNumbers,
    createTrackingNumber,
    updateTrackingNumber,
    deleteTrackingNumber,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    fetchLocations,
    createLocation,
    updateLocation,
    deleteLocation,
    fetchActivities,
    addActivity,
  }
}
