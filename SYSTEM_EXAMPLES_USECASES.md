# Unified Tracking System - Examples and Use Cases

## Real-World Use Cases

### Use Case 1: E-Commerce Logistics Company

**Scenario**: Swift Courier handles shipments for multiple e-commerce sellers

**Setup:**
1. **Create Products** (by seller):
   - SKU: SELLER1-PHONE → iPhone 15 → $29.99 shipping
   - SKU: SELLER1-LAPTOP → MacBook Pro → $49.99 shipping
   - SKU: SELLER2-SHIRT → T-Shirt → $9.99 shipping

2. **Create Locations**:
   - Pickup: New York Warehouse (seller distribution)
   - Pickup: Los Angeles Warehouse (seller distribution)
   - Dropoff: NYC Delivery Hub
   - Dropoff: LA Delivery Hub
   - Dropoff: Chicago Regional Hub

3. **Create Shipments**:
   - Seller 1 ships 100 iPhones from NY → NYC Hub
   - Seller 2 ships 50 T-Shirts from LA → LA Hub
   - Cross-country: 200 items from NY → LA

4. **Monitor Real-Time**:
   - Dashboard shows: 350 total shipments
   - Overview: 287 delivered, 50 in transit, 13 exceptions
   - Revenue: $12,456.50

### Use Case 2: International Courier Service

**Scenario**: Handling packages across multiple countries

**Setup:**
1. **Create Products**:
   - SKU: INTL-DOCS → Important Documents
   - SKU: INTL-PARCEL → General Parcel
   - SKU: INTL-FRAGILE → Fragile Items (special handling)

2. **Create Network**:
   - Pickup: JFK Distribution (New York)
   - Pickup: LAX Distribution (Los Angeles)
   - Dropoff: London Hub (Europe)
   - Dropoff: Tokyo Hub (Asia)
   - Dropoff: Sydney Hub (Oceania)

3. **Track International Movement**:
   - Created: Jan 15, 8:00 AM (NY Warehouse)
   - Picked up: Jan 15, 2:30 PM (JFK Pickup)
   - In transit: Jan 16, 8:15 AM (Left JFK)
   - Location updated: Jan 17, 6:00 PM (Arrived London)
   - Out for delivery: Jan 18, 9:00 AM (London Hub)
   - Delivered: Jan 18, 2:45 PM (Customer address)

### Use Case 3: Same-Day Delivery Service

**Scenario**: Rush deliveries within metro area

**Setup:**
1. **Create Products**:
   - SKU: RUSH-ENVELOPE → Envelope delivery → $15.00
   - SKU: RUSH-PARCEL → Small parcel → $25.00
   - SKU: RUSH-BOX → Large box → $45.00

2. **Create Micro-Locations**:
   - Pickup: Downtown Metro Center
   - Dropoff: North District Hub
   - Dropoff: South District Hub
   - Dropoff: East District Hub
   - Dropoff: West District Hub

3. **Priority Levels**:
   - Overnight: 4-hour delivery
   - Express: 6-hour delivery
   - Standard: 8-hour delivery

4. **Real-Time Tracking**:
   - Order placed: 2:00 PM
   - Picked up: 2:15 PM
   - In transit: 2:20 PM
   - Out for delivery: 2:40 PM
   - Delivered: 3:10 PM

## Step-by-Step Examples

### Example 1: Create a Complete Domestic Shipment

#### Step 1: Create the Product

**Admin Action**: Go to Products tab → Click "+ Add Product"

```json
{
  "sku": "ELEC-SMARTPHONE",
  "name": "Smartphone Package",
  "description": "Electronics - Smartphone shipment",
  "category": "Electronics",
  "dimensions": {
    "length": 15,
    "width": 10,
    "height": 8,
    "unit": "cm"
  },
  "weight": {
    "value": 250,
    "unit": "grams"
  },
  "pricing": {
    "baseCost": 19.99,
    "currency": "USD"
  }
}
```

**Result**: Product created with ID `prod_123456`

#### Step 2: Create Pickup Location

**Admin Action**: Go to Locations tab → Click "+ Add Location"

```json
{
  "name": "San Francisco Distribution Center",
  "type": "warehouse",
  "address": {
    "street": "1234 Tech Park Way",
    "city": "San Francisco",
    "state": "CA",
    "zipCode": "94105",
    "country": "USA"
  },
  "coordinates": {
    "latitude": 37.7749,
    "longitude": -122.4194
  },
  "contact": {
    "personName": "Mike Johnson",
    "email": "mike@swiftcourier.com",
    "phone": "+1-415-555-0001"
  },
  "operatingHours": {
    "monday": { "open": "08:00", "close": "20:00" },
    "tuesday": { "open": "08:00", "close": "20:00" },
    "wednesday": { "open": "08:00", "close": "20:00" },
    "thursday": { "open": "08:00", "close": "20:00" },
    "friday": { "open": "08:00", "close": "20:00" },
    "saturday": { "open": "10:00", "close": "18:00" },
    "sunday": { "open": "Closed", "close": "Closed" }
  },
  "capacity": {
    "maxPackages": 10000,
    "currentPackages": 3456
  },
  "serviceZones": ["CA", "NV"]
}
```

**Result**: Pickup location created with ID `loc_sf_dist`

#### Step 3: Create Delivery Location

**Admin Action**: Go to Locations tab → Click "+ Add Location"

```json
{
  "name": "New York Delivery Hub",
  "type": "hub",
  "address": {
    "street": "5678 Commerce Boulevard",
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
    "personName": "Sarah Williams",
    "email": "sarah@swiftcourier.com",
    "phone": "+1-212-555-0002"
  },
  "operatingHours": {
    "monday": { "open": "07:00", "close": "21:00" },
    "tuesday": { "open": "07:00", "close": "21:00" },
    "wednesday": { "open": "07:00", "close": "21:00" },
    "thursday": { "open": "07:00", "close": "21:00" },
    "friday": { "open": "07:00", "close": "21:00" },
    "saturday": { "open": "08:00", "close": "20:00" },
    "sunday": { "open": "09:00", "close": "18:00" }
  },
  "capacity": {
    "maxPackages": 5000,
    "currentPackages": 2134
  },
  "serviceZones": ["NY", "NJ", "CT", "PA"]
}
```

**Result**: Delivery location created with ID `loc_ny_hub`

#### Step 4: Create Tracking Number

**Admin Action**: Go to Tracking tab → Click "+ Create Tracking"

```json
{
  "productId": "prod_123456",
  "senderLocationId": "loc_sf_dist",
  "recipientLocationId": "loc_ny_hub",
  "recipientName": "John Smith",
  "recipientEmail": "john.smith@email.com",
  "recipientPhone": "+1-212-555-1234",
  "senderName": "TechStore Inc",
  "pickupDate": "2024-01-15",
  "estimatedDeliveryDate": "2024-01-18",
  "priority": "express",
  "cost": 19.99,
  "notes": "Premium customer - handle with care",
  "specialHandling": ["fragile", "signature_required"]
}
```

**System Response**:
```json
{
  "id": "tn_abc123xyz",
  "trackingNumber": "SC20240115ABC456",
  "status": "pending",
  "productId": "prod_123456",
  "senderLocationId": "loc_sf_dist",
  "recipientLocationId": "loc_ny_hub",
  "priority": "express",
  "cost": 19.99,
  "createdAt": "2024-01-15T08:30:00Z"
}
```

**Dashboard Update**:
- Overview shows "+1 Total Shipments" → Now 351
- New activity in feed: "Tracking created - SC20240115ABC456"
- Estimated revenue increased by $19.99

#### Step 5: Update Status as Package Moves

**Activity 1 - Pickup**:
```json
{
  "action": "update",
  "id": "tn_abc123xyz",
  "status": "picked_up",
  "currentLocation": "San Francisco Distribution Center"
}
```

**Activities Auto-Created**:
```json
{
  "id": "act_pickup_001",
  "trackingNumber": "SC20240115ABC456",
  "type": "picked_up",
  "status": "picked_up",
  "location": "San Francisco Distribution Center",
  "description": "Package picked up from origin",
  "timestamp": "2024-01-15T14:30:00Z"
}
```

**Activity 2 - In Transit**:
```json
{
  "action": "add_activity",
  "trackingNumberId": "tn_abc123xyz",
  "type": "in_transit",
  "location": "Chicago Regional Hub",
  "locationId": "loc_chicago_hub",
  "description": "Package in transit - changed planes in Chicago",
  "latitude": 41.8781,
  "longitude": -87.6298
}
```

**Activity 3 - Out for Delivery**:
```json
{
  "action": "update",
  "id": "tn_abc123xyz",
  "status": "out_for_delivery",
  "currentLocation": "New York Delivery Hub"
}
```

**Activity 4 - Delivered**:
```json
{
  "action": "update",
  "id": "tn_abc123xyz",
  "status": "delivered",
  "currentLocation": "Customer Address - New York, NY",
  "actualDeliveryDate": "2024-01-17T15:45:00Z"
}
```

**Final Timeline** (Visible in Activities tab):
```
2024-01-15 08:30 - Created: SC20240115ABC456
2024-01-15 14:30 - Picked up from San Francisco DC
2024-01-16 08:15 - In transit from Chicago Hub
2024-01-17 09:00 - Out for delivery in New York
2024-01-17 15:45 - Delivered to customer
```

### Example 2: Multi-Product Batch Shipment

**Scenario**: One shipment contains multiple products

#### Create Shipment with Multiple Items

Note: For advanced use case, create one tracking per product, or create detailed JSON in notes:

```json
{
  "productId": "prod_batch_001",
  "senderLocationId": "loc_sf_dist",
  "recipientLocationId": "loc_ny_hub",
  "recipientName": "Retail Store ABC",
  "senderName": "Warehouse 5",
  "priority": "standard",
  "cost": 49.99,
  "notes": "Batch shipment - 50 units SKU-001, 30 units SKU-002, 20 units SKU-003",
  "specialHandling": ["fragile_items", "keep_upright"]
}
```

**Admin can then add detailed activity**:
```json
{
  "action": "add_activity",
  "trackingNumberId": "tn_batch_001",
  "type": "note_added",
  "description": "Verified contents: 50× Smartphone (SKU-001), 30× Cases (SKU-002), 20× Chargers (SKU-003). All items accounted for."
}
```

### Example 3: Exception Handling

**Scenario**: Package encounters delivery problem

**Step 1**: Set Status to Exception
```json
{
  "action": "update",
  "id": "tn_delayed_001",
  "status": "exception",
  "currentLocation": "Chicago Regional Hub"
}
```

**Step 2**: Add Detailed Activity
```json
{
  "action": "add_activity",
  "trackingNumberId": "tn_delayed_001",
  "type": "exception",
  "location": "Chicago Regional Hub",
  "description": "Delayed due to weather. Expected to continue on next available flight. Customer notified.",
  "metadata": {
    "reason": "weather_delay",
    "estimated_resolution": "2024-01-20T08:00:00Z",
    "contact_customer": true
  }
}
```

**Step 3**: Update When Resolved
```json
{
  "action": "update",
  "id": "tn_delayed_001",
  "status": "in_transit",
  "currentLocation": "Chicago Regional Hub - Continuing route"
}
```

**Dashboard Effect**:
- Exception count increased by 1
- Activity feed shows: "Exception reported: Weather delay"
- Admin can see metadata about the issue

### Example 4: Geographic Network Setup

**Creating a Multi-Region Network**:

**Regions**: West Coast, Midwest, South, Northeast

**West Coast Setup**:
```
Pickup Locations:
  - Seattle Warehouse (WA)
  - Portland Distribution (OR)
  - San Francisco Distribution (CA)
  - Los Angeles Distribution (CA)

Dropoff Locations:
  - Seattle Hub (WA)
  - Portland Hub (OR)
  - SF Hub (CA)
  - LA Hub (CA)

Service Zones: WA, OR, CA, NV, ID, AZ
```

**Midwest Setup**:
```
Pickup Locations:
  - Chicago Warehouse (IL)
  - St Louis Distribution (MO)
  - Kansas City Distribution (KS)

Dropoff Locations:
  - Chicago Hub (IL)
  - St Louis Hub (MO)
  - Kansas City Hub (KS)

Service Zones: IL, MO, KS, IA, MN, WI
```

**Can now create thousands of shipments** across different combinations:
- Seattle to SF: Local delivery
- SF to Chicago: Inter-regional
- Chicago to NY: Cross-country

## Real-Time Dashboard Scenarios

### Scenario 1: Morning Operations (8:00 AM)

**Dashboard Shows**:
```
Total Shipments: 245
Active Shipments: 78
Delivered Today: 12
Exceptions: 2
Total Revenue: $4,891.45

Status Breakdown:
  - Pending: 45 (awaiting pickup)
  - Picked Up: 38 (at warehouses)
  - In Transit: 78 (on route)
  - Out for Delivery: 67
  - Delivered: 15
  - Exception: 2

Recent Activities (live feed):
  - 8:15 AM: SC20240115AA001 - Picked up from SF
  - 8:12 AM: SC20240115AA002 - In transit from Chicago
  - 8:10 AM: SC20240115AA003 - Out for delivery
  - 8:08 AM: SC20240115AA004 - Exception reported
```

### Scenario 2: Real-Time Multi-Admin Updates

**Admin 1** (SF Operations):
- Creates 20 new tracking numbers
- Updates 30 pickups

**Admin 2** (Chicago Hub):
- Updates 40 in-transit packages
- Adds 5 exception notes

**Admin 3** (NY Operations):
- Updates 50 out-for-delivery packages
- Marks 15 as delivered

**All Admins See**:
- ✅ Live connection (🟢 Live badge)
- 📊 Dashboard updates in real-time
- 📝 Activities feed shows all updates
- 🔔 Notifications for exceptions
- 📈 Statistics update live

## API Usage Examples

### Create Tracking Number via API

```bash
curl -X POST http://localhost:3000/api/admin/tracking-numbers \
  -H "Content-Type: application/json" \
  -H "Cookie: auth-token=YOUR_TOKEN" \
  -d '{
    "action": "create",
    "productId": "prod_123456",
    "senderLocationId": "loc_sf_dist",
    "recipientLocationId": "loc_ny_hub",
    "recipientName": "John Smith",
    "senderName": "Swift Courier",
    "priority": "express",
    "cost": 25.99
  }'
```

### Search Tracking Numbers

```bash
curl "http://localhost:3000/api/admin/tracking-numbers?q=SC123456" \
  -H "Cookie: auth-token=YOUR_TOKEN"
```

### Get Activities for Tracking Number

```bash
curl "http://localhost:3000/api/admin/activities?trackingNumber=SC123456&limit=50" \
  -H "Cookie: auth-token=YOUR_TOKEN"
```

### Update Package Status

```bash
curl -X POST http://localhost:3000/api/admin/tracking-numbers \
  -H "Content-Type: application/json" \
  -H "Cookie: auth-token=YOUR_TOKEN" \
  -d '{
    "action": "update",
    "id": "tn_123456",
    "status": "delivered",
    "currentLocation": "Customer Address"
  }'
```

## Advanced Scenarios

### International Multi-Stop Shipment

```
Product: Important Documents
Sender: New York Office → SF Distribution
Route:
  1. Created in NY: Jan 15, 10:00 AM
  2. Picked up at JFK: Jan 15, 2:30 PM
  3. In transit to Chicago: Jan 16, 8:00 AM
  4. Transferred at Chicago Hub: Jan 16, 3:00 PM
  5. In transit to LA: Jan 17, 9:00 AM
  6. In transit to Tokyo: Jan 19, 6:00 PM (crossed date line)
  7. Arrived Tokyo Hub: Jan 20, 4:00 PM
  8. Out for delivery: Jan 21, 8:00 AM
  9. Delivered: Jan 21, 2:45 PM
Total Transit Time: 6+ days
```

### Same-Day Metro Delivery

```
Product: Urgent Documents
Sender: Downtown Location
Route:
  1. Created: 10:00 AM
  2. Picked up: 10:15 AM (Downtown Metro Center)
  3. In transit: 10:20 AM (On bike/car)
  4. Out for delivery: 10:45 AM (Recipient's district)
  5. Delivered: 11:15 AM (Recipient's office)
Total Transit Time: 1 hour 15 minutes
```

## Dashboard Insights

### From Activities Tab, Admin Can See:

1. **Operational Efficiency**
   - Average time from pickup to delivery
   - Most congested routes
   - Busiest times of day

2. **Exception Analysis**
   - Common exception reasons
   - Locations with most problems
   - Peak exception times

3. **Customer Service**
   - Failed delivery attempts
   - Special handling compliance
   - Signature capture rate

4. **Network Optimization**
   - Utilization by location
   - Capacity planning data
   - Route optimization opportunities

---

## Summary

This unified system enables:
- ✅ Complete operational control
- ✅ Real-time visibility
- ✅ Professional tracking
- ✅ Data-driven decisions
- ✅ Multi-location management
- ✅ Real-time collaboration
- ✅ Unlimited scalability

All from one unified interface!

---

**Version**: 2.0
**Status**: ✅ Production Ready
