"use client"

import { useState, useCallback } from "react"

interface AdminPackage {
  id: string
  trackingNumber: string
  status: "pending" | "picked_up" | "in_transit" | "out_for_delivery" | "delivered" | "exception"
  sender: {
    name: string
    address: string
    city: string
    state: string
    zip: string
  }
  recipient: {
    name: string
    address: string
    city: string
    state: string
    zip: string
  }
  service: string
  weight: string
  dimensions: string
  estimatedDelivery: string
  actualDelivery?: string
  cost: number
  createdAt: string
  updatedAt: string
  events: Array<{
    timestamp: string
    status: string
    location: string
    description: string
  }>
}

export function useAdminPackages() {
  const [packages, setPackages] = useState<AdminPackage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPackages = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/admin/packages", {
        method: "GET",
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Failed to fetch packages")
      }

      const data = await response.json()
      if (data.success) {
        setPackages(data.data.packages)
      } else {
        throw new Error(data.message || "Failed to fetch packages")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error"
      setError(errorMessage)
      console.error("Error fetching packages:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  const updatePackageStatus = useCallback(
    async (trackingNumber: string, newStatus: AdminPackage["status"], reason?: string) => {
      setError(null)
      try {
        const response = await fetch("/api/admin/packages", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "update_status",
            trackingNumber,
            newStatus,
            reason,
          }),
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.message || "Failed to update package status")
        }

        const data = await response.json()
        if (data.success) {
          // Update local state
          setPackages((prev) =>
            prev.map((pkg) =>
              pkg.trackingNumber === trackingNumber
                ? {
                    ...pkg,
                    status: newStatus,
                    updatedAt: new Date().toISOString(),
                  }
                : pkg
            )
          )
        } else {
          throw new Error(data.message || "Failed to update package status")
        }

        return { success: true }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error"
        setError(errorMessage)
        console.error("Error updating package status:", err)
        return { success: false, error: errorMessage }
      }
    },
    []
  )

  const addPackageEvent = useCallback(
    async (trackingNumber: string, description: string, location: string) => {
      setError(null)
      try {
        const response = await fetch("/api/admin/packages", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "add_event",
            trackingNumber,
            description,
            location,
          }),
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.message || "Failed to add event")
        }

        const data = await response.json()
        if (!data.success) {
          throw new Error(data.message || "Failed to add event")
        }

        return { success: true }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error"
        setError(errorMessage)
        console.error("Error adding package event:", err)
        return { success: false, error: errorMessage }
      }
    },
    []
  )

  return {
    packages,
    loading,
    error,
    fetchPackages,
    updatePackageStatus,
    addPackageEvent,
  }
}
