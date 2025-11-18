# Unified Tracking System - Complete Documentation

## Overview

A professional, production-ready unified tracking system that empowers admins to manage all aspects of package delivery in one unified interface. No hardcoded data - everything is created and managed through the admin dashboard.

## Key Features

### ✅ Complete Admin Control
- Create tracking numbers (auto-generated, no hardcoded values)
- Manage products/goods inventory
- Setup pickup and dropoff locations
- Monitor all tracking activities in real-time
- Full CRUD operations for all entities

### ✅ Unified Data Model
- **Products**: SKU, description, dimensions, weight, pricing
- **Locations**: Pickup/dropoff points with operating hours, contact info, service zones
- **Tracking Numbers**: Link goods, locations, recipients with auto-generated tracking numbers
- **Activities**: Complete activity log with timestamps and status tracking

### ✅ Real-Time Updates
- Server-Sent Events (SSE) for live data streaming
- Automatic notifications across all connected admins
- Real-time activity feed
- Live statistics and dashboard

### ✅ Advanced Analytics
- Status distribution charts
- Revenue tracking
- Delivery metrics
- Activity logs with filtering
- Performance analytics

## System Architecture

```
┌──────────────────────────────────────────────────────┐
│         Admin Dashboard (React Frontend)              │
│  - Unified Interface for all operations               │
│  - Real-time updates via SSE                          │
│  - CRUD operations for Products, Locations, etc.      │
└──────────────┬───────────────────────────────────────┘
               │
      ┌────────┼────────┬──────────────┬───────────────┐
      │        │        │              │               │
   ┌──▼───┐ ┌──▼──┐ ┌──▼───┐ ┌──────▼────┐ ┌──────▼───┐
   │Track │ │Prod │ │Loc   │ │Activities │ │Real-time │
   │API   │ │API  │ │API   │ │ API       │ │SSE       │
   └──┬───┘ └──┬──┘ └──┬───┘ └──────┬────┘ └──────┬───┘
      │       │       │             │             │
      └───────┴───────┴─────────────┴─────────────┘
              │
    ┌─────────▼──────────────┐
    │  Unified Store         │
    │  - In-Memory Storage   │
    │  - Event Broadcasting  │
    │  - Real-time Sync      │
    └─────────┬──────────────┘
              │
    ┌─────────▼──────────────┐
    │  File Persistence      │
    │  - .data/store.json    │
    │  - Atomic Writes       │
    └───────────────────────┘
```

## Data Models

### Product Model
```typescript
interface Product {
  id: string                    // Auto-generated ID
  sku: string                   // Product SKU (unique)
  name: string                  // Product name
  description: string           // Detailed description
  category: string              // Product category
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
    baseCost: number           // Base shipping cost
    currency: string
  }
  isActive: boolean
  createdAt: string
  updatedAt: string
  createdBy: string             // User ID who created it
}
```

### Location Model
```typescript
interface Location {
  id: string                    // Auto-generated ID
  name: string                  // Location name
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
    [day: string]: { open: string; close: string }
  }
  capacity: {
    maxPackages: number
    currentPackages: number
  }
  serviceZones: string[]        // States/regions served
  isActive: boolean
  createdAt: string
  updatedAt: string
  createdBy: string
}
```

### TrackingNumber Model
```typescript
interface TrackingNumber {
  id: string                    // Auto-generated ID
  trackingNumber: string        // SC + timestamp + random (auto-generated)
  status: "pending" | "picked_up" | "in_transit" | "out_for_delivery" | "delivered" | "exception"
  productId: string             // Link to Product
  senderLocationId: string      // Link to pickup Location
  recipientLocationId: string   // Link to dropoff Location
  recipientName: string
  recipientEmail: string
  recipientPhone: string
  senderName: string
  pickupDate: string
  estimatedDeliveryDate: string
  actualDeliveryDate?: string
  notes: string
  specialHandling: string[]     // e.g., "fragile", "perishable"
  assignedAgent?: string        // Delivery agent ID
  currentLocation?: string      // Current location name
  priority: "standard" | "express" | "overnight"
  cost: number                  // Actual shipping cost
  isActive: boolean
  createdAt: string
  updatedAt: string
  createdBy: string
}
```

### TrackingActivity Model
```typescript
interface TrackingActivity {
  id: string                    // Auto-generated ID
  trackingNumberId: string      // Link to TrackingNumber
  trackingNumber: string        // SC123456 (for quick lookup)
  type: "created" | "picked_up" | "in_transit" | "out_for_delivery" 
        | "delivered" | "exception" | "note_added" | "location_updated" | "status_changed"
  status: TrackingNumber["status"]
  location: string              // Location name
  locationId: string            // Location ID
  description: string           // Activity details
  timestamp: string             // When it happened
  latitude?: number             // GPS coordinates
  longitude?: number
  createdBy: string             // Admin or system user
  metadata?: Record<string, any> // Additional data
}
```

## API Endpoints

### Tracking Numbers

#### GET /api/admin/tracking-numbers
Fetch all tracking numbers with optional filtering.

**Query Parameters:**
- `q` (string): Search by tracking number, sender name, or recipient name
- `status` (string): Filter by status

**Response:**
```json
{
  "success": true,
  "data": [TrackingNumber, ...],
  "stats": {
    "totalTrackingNumbers": 45,
    "activeShipments": 12,
    "deliveredToday": 8,
    "exceptionCount": 2,
    "totalRevenue": 1234.56,
    "byStatus": { "delivered": 20, "in_transit": 15, ... },
    "byPriority": { "standard": 30, "express": 10, ... }
  },
  "total": 45
}
```

#### POST /api/admin/tracking-numbers
Create, update, delete, or add activities to tracking numbers.

**Create Action:**
```json
{
  "action": "create",
  "productId": "prod_001",
  "senderLocationId": "loc_001",
  "recipientLocationId": "loc_002",
  "recipientName": "John Doe",
  "recipientEmail": "john@example.com",
  "recipientPhone": "+1-555-0001",
  "senderName": "Company Name",
  "pickupDate": "2024-01-15",
  "estimatedDeliveryDate": "2024-01-18",
  "priority": "express",
  "cost": 25.99,
  "notes": "Handle with care"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "tn_123456",
    "trackingNumber": "SC123456789ABC",
    "status": "pending",
    ...
  },
  "message": "Tracking number created successfully"
}
```

**Update Action:**
```json
{
  "action": "update",
  "id": "tn_123456",
  "status": "in_transit",
  "currentLocation": "New York Hub"
}
```

**Add Activity Action:**
```json
{
  "action": "add_activity",
  "trackingNumberId": "tn_123456",
  "type": "in_transit",
  "location": "New York Hub",
  "locationId": "loc_003",
  "description": "Package in transit to destination",
  "latitude": 40.7128,
  "longitude": -74.0060
}
```

### Products

#### GET /api/admin/products
Fetch all products with optional search.

**Query Parameters:**
- `q` (string): Search by name, SKU, or category

#### POST /api/admin/products
Create, update, or delete products.

**Create Action:**
```json
{
  "action": "create",
  "sku": "ELEC-001",
  "name": "Electronics Package",
  "description": "Generic electronics shipment",
  "category": "Electronics",
  "dimensions": {
    "length": 30,
    "width": 20,
    "height": 15,
    "unit": "cm"
  },
  "weight": {
    "value": 5,
    "unit": "kg"
  },
  "pricing": {
    "baseCost": 25.99,
    "currency": "USD"
  }
}
```

### Locations

#### GET /api/admin/locations
Fetch all locations with optional filtering.

**Query Parameters:**
- `q` (string): Search by name, city, or state
- `type` (string): Filter by type (pickup, dropoff, hub, warehouse)

#### POST /api/admin/locations
Create, update, or delete locations.

**Create Action:**
```json
{
  "action": "create",
  "name": "Main Warehouse",
  "type": "warehouse",
  "address": {
    "street": "123 Commerce St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "coordinates": {
    "latitude": 40.7128,
    "longitude": -74.0060
  },
  "contact": {
    "personName": "John Manager",
    "email": "john@swiftcourier.com",
    "phone": "+1-212-555-0001"
  },
  "operatingHours": {
    "monday": { "open": "09:00", "close": "18:00" },
    ...
  },
  "capacity": {
    "maxPackages": 5000,
    "currentPackages": 2341
  },
  "serviceZones": ["NY", "NJ", "CT"]
}
```

### Activities

#### GET /api/admin/activities
Fetch tracking activities.

**Query Parameters:**
- `trackingNumber` (string): Get activities for a specific tracking number
- `limit` (number): Maximum number of activities to return (default: 50)

**Response:**
```json
{
  "success": true,
  "data": [TrackingActivity, ...],
  "total": 45
}
```

## Admin Dashboard - Tabs

### 1. **Overview Tab**
- Real-time statistics cards
- Total shipments, delivered today, in transit, exceptions
- Revenue overview
- Recent activities feed

### 2. **Tracking Tab**
- Create new tracking numbers
- View all tracking numbers
- Edit status and details
- Search and filter
- Bulk operations support

### 3. **Products Tab**
- View all products/goods
- Create new products
- Edit product details
- Delete products
- Grid view with key information

### 4. **Locations Tab**
- View all pickup/dropoff locations
- Create new locations
- Edit location details
- Delete locations
- Location types: pickup, dropoff, hub, warehouse

### 5. **Activities Tab**
- Complete activity log
- Filter by tracking number
- Sort by timestamp
- View all status changes
- Track location updates

### 6. **Settings Tab**
- System configuration
- Admin preferences
- API settings

## Workflow Examples

### Example 1: Create Complete Shipment

1. **Create Product** (Products tab)
   - SKU: ELEC-001
   - Name: Electronics Package
   - Pricing: $25.99

2. **Create Locations** (Locations tab)
   - Pickup: Main Warehouse (NY)
   - Dropoff: LA Hub

3. **Create Tracking Number** (Tracking tab)
   - Select product: ELEC-001
   - Select sender location: Main Warehouse
   - Select recipient location: LA Hub
   - Add recipient details
   - Set priority: Express
   - System generates: SC123456789ABC

4. **Monitor in Real-Time**
   - Dashboard shows new shipment
   - All admins see it instantly
   - Add activities as package moves

### Example 2: Update Package Status

1. Go to **Tracking** tab
2. Find package by tracking number
3. Click "Edit"
4. Change status: pending → picked_up
5. System automatically:
   - Creates activity entry
   - Broadcasts to all admins
   - Updates statistics
   - Records timestamp

### Example 3: Track Package History

1. Go to **Activities** tab
2. Search by tracking number: SC123456789ABC
3. View complete history:
   - Created: Jan 15, 09:00 AM
   - Picked up: Jan 15, 02:30 PM
   - In transit: Jan 16, 08:15 AM
   - Out for delivery: Jan 17, 09:00 AM
   - Delivered: Jan 17, 02:45 PM

## Key Differentiators

✅ **No Hardcoded Data**
- Every piece of data (products, locations, tracking numbers) created via admin dashboard
- Dynamic data generation
- Full control over all system data

✅ **Unified System**
- One interface for all operations
- Consistent data model
- Linked relationships (products → tracking → locations)
- No data confusion

✅ **Real-Time Capabilities**
- Live updates across all admins
- Instant notifications
- Real-time statistics
- Activity feed streaming

✅ **Complete Tracking**
- Every status change logged
- Timestamp and location tracked
- Complete audit trail
- Activity history

✅ **Advanced Features**
- Auto-generating tracking numbers
- Priority levels (standard, express, overnight)
- Special handling flags
- Service zones
- Operating hours management

## Security

- Authentication required (admin role)
- httpOnly cookies for token storage
- Role-based access control
- All operations audit-logged
- Rate limiting on sensitive endpoints

## Performance

- In-memory storage for fast access
- Real-time updates via SSE
- Automatic caching
- Optimized queries
- Lazy loading of data

## Scalability

- File-based persistence
- Event-driven architecture
- Horizontal scalable design
- Support for unlimited locations/products
- Support for unlimited tracking numbers

## Data Persistence

- Automatic saving to `.data/store.json`
- Survives server restarts
- Atomic write operations
- Human-readable JSON format
- Manual editing support

## Common Operations

### Create a New Tracking Number
```bash
curl -X POST http://localhost:3000/api/admin/tracking-numbers \
  -H "Content-Type: application/json" \
  -H "Cookie: auth-token=..." \
  -d '{
    "action": "create",
    "productId": "prod_001",
    "senderLocationId": "loc_001",
    "recipientLocationId": "loc_002",
    "recipientName": "John Doe",
    "senderName": "Company",
    "priority": "express",
    "cost": 25.99
  }'
```

### Update Tracking Status
```bash
curl -X POST http://localhost:3000/api/admin/tracking-numbers \
  -H "Content-Type: application/json" \
  -H "Cookie: auth-token=..." \
  -d '{
    "action": "update",
    "id": "tn_123456",
    "status": "in_transit",
    "currentLocation": "New York Hub"
  }'
```

### Search Tracking Numbers
```bash
curl "http://localhost:3000/api/admin/tracking-numbers?q=SC123456" \
  -H "Cookie: auth-token=..."
```

## Admin Credentials

**Default Admin User:**
- Email: `admin@swiftcourier.com`
- Password: `admin123`

## Troubleshooting

### Can't create tracking number?
- Verify product exists
- Verify pickup location exists
- Verify dropoff location exists
- Check admin role

### Data not persisting?
- Check `.data/` directory permissions
- Verify disk space
- Check server logs

### Real-time updates not working?
- Check browser SSE connection
- Verify admin role
- Check auth token validity

## File Structure

```
lib/
├── models.ts                 # Data model definitions
├── unified-store.ts          # In-memory store with CRUD
├── realtime-store.ts         # Real-time event system
└── ...

app/api/admin/
├── tracking-numbers/route.ts # Tracking numbers API
├── products/route.ts         # Products API
├── locations/route.ts        # Locations API
├── activities/route.ts       # Activities API
├── realtime/route.ts         # SSE endpoint
└── ...

app/admin/
├── page.tsx                  # Main admin dashboard
├── login/page.tsx            # Login page
└── ...

hooks/
├── useUnifiedDashboard.ts    # Dashboard data hook
├── useAdminRealtime.ts       # Real-time SSE hook
└── ...
```

## Future Enhancements

- WebSocket support for lower latency
- Database migration (PostgreSQL/MySQL)
- Advanced filtering and search
- Bulk operations (upload CSV)
- Custom dashboards per user
- Mobile app
- API webhooks
- Email notifications
- SMS tracking updates
- Integration with delivery partners

---

**Version**: 2.0 (Unified Tracking System)
**Status**: ✅ Production Ready
**Last Updated**: 2024
