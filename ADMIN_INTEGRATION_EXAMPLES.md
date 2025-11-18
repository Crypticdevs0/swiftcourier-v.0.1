# Admin Dashboard - Integration Examples

## For Developers: How to Extend the Real-Time System

### Example 1: Add Custom Real-Time Events

Broadcast a custom event to all admins:

```typescript
// In your API route or server action
import { realtimeStore } from "@/lib/realtime-store"

// Broadcast package discount applied
realtimeStore.broadcast("admin:packages", {
  type: "discount_applied",
  data: {
    trackingNumber: "SC123456",
    discountAmount: 5.99,
    reason: "Customer complaint resolution"
  }
})
```

### Example 2: Subscribe to Real-Time Updates in Your Code

Create a custom hook for package updates:

```typescript
// hooks/usePackageUpdates.ts
import { useEffect, useState } from "react"
import { realtimeStore } from "@/lib/realtime-store"

export function usePackageUpdates(trackingNumber: string) {
  const [latestUpdate, setLatestUpdate] = useState(null)

  useEffect(() => {
    const unsubscribe = realtimeStore.subscribe(
      `package:${trackingNumber}`,
      (event) => {
        setLatestUpdate(event)
      }
    )

    return unsubscribe
  }, [trackingNumber])

  return latestUpdate
}

// Usage in component
function PackageDetail({ trackingNumber }) {
  const update = usePackageUpdates(trackingNumber)
  
  return (
    <div>
      {update && (
        <p>Last update: {new Date(update.timestamp).toLocaleString()}</p>
      )}
    </div>
  )
}
```

### Example 3: Add Custom Admin Action

Create a new admin action endpoint:

```typescript
// app/api/admin/bulk-update/route.ts
import { type NextRequest, NextResponse } from "next/server"
import { extractAuthFromRequest } from "@/lib/utils"
import { realtimeStore } from "@/lib/realtime-store"
import store from "@/lib/store"

export async function POST(request: NextRequest) {
  const userId = extractAuthFromRequest(request)

  if (!userId) {
    return NextResponse.json({ success: false }, { status: 401 })
  }

  const user = await store.findUserById(userId)
  if (!user || user.role !== "admin") {
    return NextResponse.json({ success: false }, { status: 403 })
  }

  try {
    const { trackingNumbers, newStatus, reason } = await request.json()

    // Update all packages
    const results = []
    for (const trackingNumber of trackingNumbers) {
      const success = await realtimeStore.updatePackageStatus(
        trackingNumber,
        newStatus,
        reason
      )
      results.push({ trackingNumber, success })
    }

    return NextResponse.json({
      success: true,
      updated: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length
    })
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
```

### Example 4: Monitor Admin Actions

Create an admin action log:

```typescript
// lib/admin-audit.ts
import { realtimeStore } from "./realtime-store"

const auditLog: Array<{
  timestamp: string
  admin: string
  action: string
  target: string
  details: any
}> = []

export function logAdminAction(
  admin: string,
  action: string,
  target: string,
  details: any = {}
) {
  const entry = {
    timestamp: new Date().toISOString(),
    admin,
    action,
    target,
    details
  }
  
  auditLog.push(entry)
  
  // Also broadcast to all admins
  realtimeStore.broadcast("admin:audit", {
    type: "admin_action",
    data: entry
  })
  
  return entry
}

export function getAuditLog(limit = 100) {
  return auditLog.slice(-limit)
}
```

### Example 5: Real-Time Dashboard Widget

Create a widget that auto-updates:

```typescript
// components/admin/LivePackageWidget.tsx
"use client"

import { useEffect, useState } from "react"
import { useAdminRealtime } from "@/hooks/useAdminRealtime"

export function LivePackageWidget() {
  const { isConnected, events } = useAdminRealtime()
  const [recentUpdates, setRecentUpdates] = useState([])

  useEffect(() => {
    if (events.length > 0) {
      setRecentUpdates(events.slice(0, 5))
    }
  }, [events])

  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Live Updates</h3>
        <span className={`inline-block w-3 h-3 rounded-full ${
          isConnected ? 'bg-green-500' : 'bg-red-500'
        }`} />
      </div>
      
      <div className="space-y-2">
        {recentUpdates.map((update) => (
          <div key={update.id} className="text-sm p-2 bg-slate-50 rounded">
            <p>{update.type.replace(/_/g, ' ')}</p>
            <p className="text-xs text-gray-500">
              {new Date(update.timestamp).toLocaleTimeString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
```

### Example 6: Notification System

Integrate with notification service:

```typescript
// lib/notifications.ts
import { realtimeStore } from "./realtime-store"

interface NotificationRule {
  event: string
  condition: (data: any) => boolean
  action: (data: any) => Promise<void>
}

const rules: NotificationRule[] = []

export function addNotificationRule(rule: NotificationRule) {
  rules.push(rule)
}

// Subscribe to all events and check rules
realtimeStore.subscribe("*", async (event) => {
  for (const rule of rules) {
    if (event.type === rule.event && rule.condition(event.data)) {
      await rule.action(event.data)
    }
  }
})

// Usage: Send email when exception occurs
addNotificationRule({
  event: "status_changed",
  condition: (data) => data.newStatus === "exception",
  action: async (data) => {
    // Send email notification
    console.log(`Exception reported for ${data.trackingNumber}`)
  }
})
```

### Example 7: Statistics Aggregation

Create custom metrics:

```typescript
// lib/admin-metrics.ts
import store from "./store"

interface Metrics {
  totalPackages: number
  deliveredToday: number
  delayedPackages: number
  avgDeliveryTime: number
  revenueToday: number
}

export function getMetrics(): Metrics {
  const packages = store.getAllPackages()
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const todayPackages = packages.filter(
    pkg => new Date(pkg.createdAt) >= today
  )

  const deliveredToday = todayPackages.filter(
    pkg => pkg.status === "delivered"
  ).length

  const delayed = packages.filter(pkg => {
    if (pkg.status === "delivered") return false
    const estimated = new Date(pkg.estimatedDelivery)
    return estimated < new Date()
  }).length

  const revenueToday = todayPackages.reduce(
    (sum, pkg) => sum + pkg.cost,
    0
  )

  return {
    totalPackages: packages.length,
    deliveredToday,
    delayedPackages: delayed,
    avgDeliveryTime: 2.5, // Calculate based on events
    revenueToday
  }
}
```

### Example 8: Real-Time Alerts

Create alert system:

```typescript
// lib/admin-alerts.ts
import { realtimeStore } from "./realtime-store"

export interface Alert {
  id: string
  severity: "info" | "warning" | "error"
  title: string
  message: string
  timestamp: string
  read: boolean
}

const alerts: Alert[] = []

export function createAlert(
  severity: Alert["severity"],
  title: string,
  message: string
) {
  const alert: Alert = {
    id: Math.random().toString(36).substring(7),
    severity,
    title,
    message,
    timestamp: new Date().toISOString(),
    read: false
  }

  alerts.push(alert)

  // Broadcast to all admins
  realtimeStore.broadcast("admin:alerts", {
    type: "new_alert",
    data: alert
  })

  return alert
}

export function getAlerts(unreadOnly = false) {
  return unreadOnly
    ? alerts.filter(a => !a.read)
    : alerts
}

export function markAlertAsRead(id: string) {
  const alert = alerts.find(a => a.id === id)
  if (alert) {
    alert.read = true
  }
}
```

### Example 9: Bulk Operations

Implement bulk actions:

```typescript
// components/admin/BulkStatusUpdate.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useAdminPackages } from "@/hooks/useAdminPackages"

interface BulkUpdateProps {
  selectedPackages: string[]
}

export function BulkStatusUpdate({ selectedPackages }: BulkUpdateProps) {
  const { updatePackageStatus } = useAdminPackages()
  const [newStatus, setNewStatus] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)

  const handleBulkUpdate = async () => {
    setIsUpdating(true)
    
    for (const trackingNumber of selectedPackages) {
      await updatePackageStatus(
        trackingNumber,
        newStatus,
        "Bulk update by admin"
      )
    }
    
    setIsUpdating(false)
  }

  return (
    <div className="space-y-3">
      <p>{selectedPackages.length} packages selected</p>
      
      <select
        value={newStatus}
        onChange={(e) => setNewStatus(e.target.value)}
        className="w-full p-2 border rounded"
      >
        <option value="">Select status...</option>
        <option value="picked_up">Picked Up</option>
        <option value="in_transit">In Transit</option>
        <option value="out_for_delivery">Out for Delivery</option>
        <option value="delivered">Delivered</option>
      </select>

      <Button
        onClick={handleBulkUpdate}
        disabled={isUpdating || !newStatus}
        className="w-full"
      >
        {isUpdating ? "Updating..." : "Update All"}
      </Button>
    </div>
  )
}
```

### Example 10: Custom Dashboard View

Add a specialized admin view:

```typescript
// app/admin/performance/page.tsx
"use client"

import { useEffect, useState } from "react"
import { realtimeStore } from "@/lib/realtime-store"

export default function PerformanceDashboard() {
  const [metrics, setMetrics] = useState({
    ordersPerHour: 0,
    avgDeliveryTime: 0,
    costPerDelivery: 0
  })

  useEffect(() => {
    // Subscribe to package updates
    const unsubscribe = realtimeStore.subscribe(
      "admin:packages",
      (event) => {
        // Recalculate metrics
        const stats = realtimeStore.getPackageStats()
        
        setMetrics({
          ordersPerHour: Math.round(stats.total / 24),
          avgDeliveryTime: 2.5,
          costPerDelivery: 15.99
        })
      }
    )

    return unsubscribe
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Performance Metrics</h1>
      
      <div className="grid grid-cols-3 gap-6">
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-600">Orders per Hour</p>
          <p className="text-2xl font-bold">{metrics.ordersPerHour}</p>
        </div>
        
        <div className="p-4 bg-green-50 rounded-lg">
          <p className="text-sm text-gray-600">Avg Delivery Time</p>
          <p className="text-2xl font-bold">{metrics.avgDeliveryTime} days</p>
        </div>
        
        <div className="p-4 bg-purple-50 rounded-lg">
          <p className="text-sm text-gray-600">Cost per Delivery</p>
          <p className="text-2xl font-bold">${metrics.costPerDelivery}</p>
        </div>
      </div>
    </div>
  )
}
```

## Integration Patterns

### Pattern 1: Real-Time Sync Between Admins
```typescript
// All admins automatically see updates via SSE
realtimeStore.broadcast("admin:packages", event)
```

### Pattern 2: Custom Business Logic
```typescript
// Execute custom logic when status changes
realtimeStore.subscribe("package:*", async (event) => {
  if (event.type === "status_changed") {
    // Custom logic here
  }
})
```

### Pattern 3: Event Aggregation
```typescript
// Combine multiple events into insights
const stats = realtimeStore.getPackageStats()
// Use for dashboards, reports, analytics
```

### Pattern 4: Notification Dispatch
```typescript
// Send notifications based on events
realtimeStore.subscribe("admin:alerts", async (event) => {
  await sendEmailNotification(event.data)
  await sendSlackMessage(event.data)
})
```

## Best Practices

1. **Always Check Auth**: Validate user is admin before allowing actions
2. **Use Transactions**: Wrap multiple operations together
3. **Persist Changes**: Always save to `.data/store.json`
4. **Broadcast Updates**: Notify all admins of changes
5. **Error Handling**: Catch and log all errors
6. **Performance**: Limit event listeners, clean up subscriptions
7. **Security**: Never expose sensitive data in broadcasts
8. **Testing**: Test real-time scenarios with multiple connections

## Common Mistakes to Avoid

❌ Not unsubscribing from events (memory leak)
```typescript
// BAD
useEffect(() => {
  realtimeStore.subscribe("admin:packages", handler)
})

// GOOD
useEffect(() => {
  const unsubscribe = realtimeStore.subscribe(
    "admin:packages",
    handler
  )
  return unsubscribe // Cleanup!
}, [])
```

❌ Blocking operations on broadcast
```typescript
// BAD - Blocks other subscribers
realtimeStore.subscribe("*", (event) => {
  // Synchronous heavy operation
  doHeavyCalculation(event)
})

// GOOD - Use async
realtimeStore.subscribe("*", async (event) => {
  await doHeavyCalculation(event)
})
```

❌ Not handling SSE reconnection
```typescript
// BAD - Assumes connection never fails
const sse = new EventSource("/api/admin/realtime")

// GOOD - Our hook handles reconnection automatically
const { isConnected } = useAdminRealtime()
```

---

**Integration Guide Version**: 1.0
**Last Updated**: 2024
