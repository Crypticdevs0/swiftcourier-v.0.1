// Mock user storage (in production, use a real database)
export const mockUsers: Array<{
  id: string
  firstName: string
  lastName: string
  name: string
  email: string
  password: string
  role: string
  userType: "new" | "demo" | "existing"
  phone?: string
  createdAt: string
  lastLogin?: string
}> = [
  // Demo users for testing
  {
    id: "demo_user_123",
    firstName: "Demo",
    lastName: "User",
    name: "Demo User",
    email: "demo@swiftcourier.com",
    password: "demo123",
    role: "user",
    userType: "demo",
    phone: "+1 (555) 123-4567",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
    lastLogin: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
  },
  // Admin user for testing
  {
    id: "admin_user_456",
    firstName: "Admin",
    lastName: "User",
    name: "Admin User",
    email: "admin@swiftcourier.com",
    password: "admin123",
    role: "admin",
    userType: "existing",
    phone: "+1 (555) 987-6543",
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days ago
    lastLogin: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
  },
  // Business user for testing
  {
    id: "business_user_789",
    firstName: "Business",
    lastName: "User",
    name: "Business User",
    email: "business@swiftcourier.com",
    password: "business123",
    role: "business",
    userType: "existing",
    phone: "+1 (555) 456-7890",
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days ago
    lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
  },
]

// Mock packages data based on user type
export const generateMockPackages = (userType: "new" | "demo" | "existing", userId: string) => {
  if (userType === "new") {
    return [] // New users have no packages
  }

  if (userType === "demo") {
    return [
      {
        trackingNumber: "SW" + Math.random().toString(36).substr(2, 9).toUpperCase(),
        status: "in_transit",
        estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        currentLocation: "Distribution Center - Chicago, IL",
        progress: 65,
        recipient: {
          name: "Jane Smith",
          address: "123 Main St",
          city: "Chicago",
          state: "IL",
          zip: "60601",
        },
        sender: {
          name: "Demo User",
          address: "456 Oak Ave",
          city: "New York",
          state: "NY",
          zip: "10001",
        },
        service: "Swift Express",
        weight: 2.5,
        dimensions: { length: 12, width: 8, height: 4 },
        events: [
          {
            id: "1",
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            location: "New York, NY",
            description: "Package picked up",
            status: "picked_up",
          },
          {
            id: "2",
            timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
            location: "Chicago, IL",
            description: "Arrived at distribution center",
            status: "in_transit",
          },
        ],
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        userId,
        cost: 24.99,
      },
      {
        trackingNumber: "SW" + Math.random().toString(36).substr(2, 9).toUpperCase(),
        status: "delivered",
        estimatedDelivery: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        currentLocation: "Delivered",
        progress: 100,
        recipient: {
          name: "John Doe",
          address: "789 Pine St",
          city: "Los Angeles",
          state: "CA",
          zip: "90210",
        },
        sender: {
          name: "Demo User",
          address: "456 Oak Ave",
          city: "New York",
          state: "NY",
          zip: "10001",
        },
        service: "Swift Standard",
        weight: 1.2,
        dimensions: { length: 8, width: 6, height: 3 },
        events: [
          {
            id: "1",
            timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
            location: "New York, NY",
            description: "Package picked up",
            status: "picked_up",
          },
          {
            id: "2",
            timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
            location: "Los Angeles, CA",
            description: "Out for delivery",
            status: "out_for_delivery",
          },
          {
            id: "3",
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            location: "Los Angeles, CA",
            description: "Package delivered",
            status: "delivered",
          },
        ],
        createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
        deliveredAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        userId,
        cost: 18.99,
      },
    ]
  }

  // Existing users get more packages
  return [
    {
      trackingNumber: "SW" + Math.random().toString(36).substr(2, 9).toUpperCase(),
      status: "out_for_delivery",
      estimatedDelivery: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      currentLocation: "Out for delivery - Local facility",
      progress: 90,
      recipient: {
        name: "Alice Johnson",
        address: "321 Elm St",
        city: "Boston",
        state: "MA",
        zip: "02101",
      },
      sender: {
        name: "Business User",
        address: "654 Maple Ave",
        city: "Seattle",
        state: "WA",
        zip: "98101",
      },
      service: "Swift Priority",
      weight: 3.8,
      dimensions: { length: 14, width: 10, height: 6 },
      events: [
        {
          id: "1",
          timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
          location: "Seattle, WA",
          description: "Package picked up",
          status: "picked_up",
        },
        {
          id: "2",
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          location: "Boston, MA",
          description: "Arrived at local facility",
          status: "in_transit",
        },
        {
          id: "3",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          location: "Boston, MA",
          description: "Out for delivery",
          status: "out_for_delivery",
        },
      ],
      createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
      userId,
      cost: 32.99,
    },
  ]
}
