"use client"

import React, { useState } from "react"

export default function MockDemoPage() {
  const [trackingNumber, setTrackingNumber] = useState("SC1234567890")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<any | null>(null)

  async function fetchTracking() {
    setLoading(true)
    setError(null)
    setData(null)
    try {
      const res = await fetch(`/api/mock/fedex?trackingNumber=${encodeURIComponent(trackingNumber)}`)
      const json = await res.json()
      if (!res.ok) {
        setError(json.error || json.message || "Unknown error")
      } else {
        setData(json)
      }
    } catch (err: any) {
      setError(err.message || "Network error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-start justify-center p-8 bg-gray-50">
      <div className="w-full max-w-3xl bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-semibold mb-2">Mock FedEx Demo</h1>
        <p className="text-sm text-gray-600 mb-4">Uses internal mock FedEx endpoint and in-memory seed.</p>

        <div className="flex gap-2 mb-4">
          <input
            className="flex-1 border rounded px-3 py-2"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            placeholder="Enter tracking number"
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={fetchTracking}
            disabled={loading}
          >
            {loading ? "Loading..." : "Fetch"}
          </button>
          <form action="/api/mock/seed" method="post">
            <button type="submit" className="ml-2 bg-green-600 text-white px-4 py-2 rounded">Seed In-Memory</button>
          </form>
        </div>

        {error && <div className="text-red-600 mb-4">Error: {error}</div>}

        {data && (
          <div>
            <h2 className="text-lg font-medium">Tracking: {data.tracking?.tracking_number ?? data.tracking_number ?? "-"}</h2>
            <p className="text-sm text-gray-500">Carrier: {data.meta?.carrier ?? data.meta ?? "FEDEX-MOCK"}</p>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 border rounded">
                <h3 className="font-semibold">Summary</h3>
                <p>Status: {data.tracking?.status}</p>
                <p>Service: {data.tracking?.service}</p>
                <p>Estimated Delivery: {data.tracking?.estimated_delivery}</p>
              </div>

              <div className="p-3 border rounded">
                <h3 className="font-semibold">Addresses</h3>
                <p><strong>From:</strong> {data.tracking?.sender?.name} — {data.tracking?.sender?.address}, {data.tracking?.sender?.city}</p>
                <p><strong>To:</strong> {data.tracking?.recipient?.name} — {data.tracking?.recipient?.address}, {data.tracking?.recipient?.city}</p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold">Events</h3>
              <ul className="mt-2 border rounded">
                {(data.tracking?.events ?? data.tracking?.tracking_events ?? []).map((ev: any, idx: number) => (
                  <li key={idx} className="p-3 border-b last:border-b-0">
                    <div className="text-sm text-gray-600">{ev.timestamp}</div>
                    <div className="font-medium">{ev.status}</div>
                    <div className="text-sm text-gray-700">{ev.location}</div>
                    <div className="text-sm text-gray-500">{ev.description}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {!data && !error && (
          <div className="text-gray-500 mt-4">No tracking data loaded. Use the input above to fetch mock data.</div>
        )}
      </div>
    </div>
  )
}
