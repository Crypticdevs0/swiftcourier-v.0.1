"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Loader2, Truck, Package, CheckCircle, MapPin, Clock, RefreshCw, DollarSign } from "lucide-react"

interface FedexEvent {
  timestamp: string
  status: string
  location: string
  description: string
}

interface FedexAddress {
  name: string
  address: string
  city: string
  state: string
  zip: string
}

interface FedexTrackingPayload {
  tracking_number: string
  status: string
  service: string
  weight: string
  dimensions: string
  estimated_delivery: string
  actual_delivery?: string | null
  events: FedexEvent[]
  sender: FedexAddress
  recipient: FedexAddress
  cost: number
  created_at: string
  updated_at: string
}

interface FedexResponseMeta {
  carrier: string
  account: string | null
  using_test_key: boolean
}

interface FedexResponse {
  success: boolean
  meta: FedexResponseMeta
  tracking: FedexTrackingPayload
}

export function FedexStyleTracker({ trackingNumber }: { trackingNumber: string }) {
  const [data, setData] = useState<FedexResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!trackingNumber) return
    const controller = new AbortController()
    fetchData(controller.signal)
    return () => controller.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackingNumber])

  const fetchData = async (signal?: AbortSignal) => {
    try {
      setLoading(true)
      setError(null)
      setData(null)
      const res = await fetch(`/api/mock/fedex?trackingNumber=${encodeURIComponent(trackingNumber)}` , { signal })
      const json = await res.json()
      if (!res.ok || !json.success) {
        throw new Error(json.error || json.message || `Unable to fetch tracking for ${trackingNumber}`)
      }
      setData(json as FedexResponse)
    } catch (e: any) {
      if (e?.name === "AbortError") return
      setError(e?.message || "Failed to load tracking data")
    } finally {
      setLoading(false)
    }
  }

  const formatDateTime = (iso: string | undefined | null) =>
    iso ? new Date(iso).toLocaleString() : "-"

  const statusBadge = (status: string) => {
    const s = status.toLowerCase()
    const color =
      s.includes("delivered") ? "bg-green-600" : s.includes("out") ? "bg-blue-600" : s.includes("transit") ? "bg-yellow-600" : "bg-gray-600"
    return (
      <Badge className={`${color} text-white`}>{status}</Badge>
    )
  }

  if (loading) {
    return (
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Loader2 className="h-5 w-5 animate-spin text-blue-600"/>Fetching FedEx Tracking</CardTitle>
          <CardDescription>Tracking Number: {trackingNumber}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-24 flex items-center justify-center text-sm text-gray-600">Please wait…</div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6 text-center">
          <p className="text-red-700 mb-4">{error}</p>
          <Button variant="outline" onClick={() => fetchData()} className="inline-flex items-center"><RefreshCw className="h-4 w-4 mr-2"/>Retry</Button>
        </CardContent>
      </Card>
    )
  }

  if (!data) return null

  const t = data.tracking

  return (
    <div className="space-y-6">
      {/* Summary */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-600"/>
              FedEx-style Tracking
            </CardTitle>
            <CardDescription>Tracking Number: {t.tracking_number}</CardDescription>
          </div>
          {statusBadge(t.status)}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-blue-50">
              <div className="text-sm text-gray-600">Estimated Delivery</div>
              <div className="font-semibold flex items-center gap-2"><Clock className="h-4 w-4"/>{formatDateTime(t.estimated_delivery)}</div>
            </div>
            <div className="p-4 rounded-lg bg-blue-50">
              <div className="text-sm text-gray-600">Service</div>
              <div className="font-semibold flex items-center gap-2"><Truck className="h-4 w-4"/>{t.service}</div>
            </div>
            <div className="p-4 rounded-lg bg-blue-50">
              <div className="text-sm text-gray-600">Cost</div>
              <div className="font-semibold flex items-center gap-2"><DollarSign className="h-4 w-4"/>${t.cost?.toFixed(2)}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-4">
              <div className="text-xs text-gray-500 mb-1">From</div>
              <div className="font-medium">{t.sender.name}</div>
              <div className="text-sm text-gray-600">{t.sender.address}, {t.sender.city}, {t.sender.state} {t.sender.zip}</div>
              <Separator className="my-3"/>
              <div className="text-xs text-gray-500 mb-1">To</div>
              <div className="font-medium">{t.recipient.name}</div>
              <div className="text-sm text-gray-600">{t.recipient.address}, {t.recipient.city}, {t.recipient.state} {t.recipient.zip}</div>
            </div>
            <div className="border rounded-lg p-4">
              <div className="text-xs text-gray-500 mb-1">Package</div>
              <div className="text-sm text-gray-700">Weight: {t.weight}</div>
              <div className="text-sm text-gray-700">Dimensions: {t.dimensions}</div>
              <div className="text-sm text-gray-700">Created: {formatDateTime(t.created_at)}</div>
              <div className="text-sm text-gray-700">Updated: {formatDateTime(t.updated_at)}</div>
              {t.actual_delivery && (
                <div className="text-sm text-gray-700">Delivered: {formatDateTime(t.actual_delivery)}</div>
              )}
              <Separator className="my-3"/>
              <div className="text-xs text-gray-500">Meta</div>
              <div className="text-sm text-gray-700">Carrier: {data.meta.carrier}</div>
              <div className="text-sm text-gray-700">Using Test Key: {data.meta.using_test_key ? "Yes" : "No"}</div>
              {data.meta.account && <div className="text-sm text-gray-700">Account: {data.meta.account}</div>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Events */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5"/> Tracking History
          </CardTitle>
          <CardDescription>Latest updates from origin to destination</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {t.events.map((ev, idx) => (
            <div key={`${ev.timestamp}-${idx}`} className="flex items-start gap-4">
              <div className="mt-1">
                {idx === 0 ? <CheckCircle className="h-4 w-4 text-green-600"/> : <Package className="h-4 w-4 text-gray-400"/>}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{ev.status}</div>
                  <div className="text-xs text-gray-500">{formatDateTime(ev.timestamp)}</div>
                </div>
                <div className="text-sm text-gray-600 flex items-center gap-2"><MapPin className="h-3 w-3"/>{ev.location}</div>
                <div className="text-sm text-gray-500">{ev.description}</div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button variant="outline" onClick={() => fetchData()} className="inline-flex items-center"><RefreshCw className="h-4 w-4 mr-2"/>Refresh</Button>
      </div>
    </div>
  )
}
