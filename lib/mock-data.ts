export interface User {
  id: string
  email: string
  password: string
  name: string
  userType: "new" | "demo" | "existing"
  createdAt: string
  lastLogin?: string
  preferences?: {
    notifications: boolean
    theme: "light" | "dark"
    language: string
  }
}

export interface Package {
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

export const mockUsers: User[] = [
  {
    id: "1",
    email: "demo@swiftcourier.com",
    password: "demo123",
    name: "Demo User",
    userType: "demo",
    createdAt: "2024-01-01T00:00:00Z",
    lastLogin: new Date().toISOString(),
    preferences: {
      notifications: true,
      theme: "light",
      language: "en",
    },
  },
  {
    id: "2",
    email: "admin@swiftcourier.com",
    password: "admin123",
    name: "Admin User",
    userType: "existing",
    createdAt: "2023-01-01T00:00:00Z",
    lastLogin: new Date().toISOString(),
    preferences: {
      notifications: true,
      theme: "light",
      language: "en",
    },
  },
]

export const mockPackages: Package[] = [
  {
    id: "pkg_001",
    trackingNumber: "SC1234567890",
    status: "in-transit",
    sender: {
      name: "John Smith",
      address: "123 Main St",
      city: "New York",
      state: "NY",
      zip: "10001",
    },
    recipient: {
      name: "Jane Doe",
      address: "456 Oak Ave",
      city: "Los Angeles",
      state: "CA",
      zip: "90210",
    },
    service: "Express Delivery",
    weight: "2.5 lbs",
    dimensions: "12x8x4 inches",
    estimatedDelivery: "2024-12-25T15:00:00Z",
    cost: 24.99,
    createdAt: "2024-12-20T10:00:00Z",
    updatedAt: new Date().toISOString(),
    events: [
      {
        timestamp: "2024-12-20T10:00:00Z",
        status: "Package Created",
        location: "New York, NY",
        description: "Package information received",
      },
      {
        timestamp: "2024-12-20T14:30:00Z",
        status: "Picked Up",
        location: "New York, NY",
        description: "Package picked up by courier",
      },
      {
        timestamp: "2024-12-21T08:15:00Z",
        status: "In Transit",
        location: "Chicago, IL",
        description: "Package in transit to destination",
      },
      {
        timestamp: new Date().toISOString(),
        status: "Out for Delivery",
        location: "Los Angeles, CA",
        description: "Package out for delivery",
      },
    ],
  },
  {
    id: "pkg_002",
    trackingNumber: "SC0987654321",
    status: "delivered",
    sender: {
      name: "Alice Johnson",
      address: "789 Pine St",
      city: "Seattle",
      state: "WA",
      zip: "98101",
    },
    recipient: {
      name: "Bob Wilson",
      address: "321 Elm St",
      city: "Portland",
      state: "OR",
      zip: "97201",
    },
    service: "Standard Delivery",
    weight: "1.2 lbs",
    dimensions: "8x6x2 inches",
    estimatedDelivery: "2024-12-22T12:00:00Z",
    actualDelivery: "2024-12-22T11:45:00Z",
    cost: 12.99,
    createdAt: "2024-12-19T09:00:00Z",
    updatedAt: "2024-12-22T11:45:00Z",
    events: [
      {
        timestamp: "2024-12-19T09:00:00Z",
        status: "Package Created",
        location: "Seattle, WA",
        description: "Package information received",
      },
      {
        timestamp: "2024-12-19T15:20:00Z",
        status: "Picked Up",
        location: "Seattle, WA",
        description: "Package picked up by courier",
      },
      {
        timestamp: "2024-12-20T10:30:00Z",
        status: "In Transit",
        location: "Seattle, WA",
        description: "Package in transit to destination",
      },
      {
        timestamp: "2024-12-22T08:00:00Z",
        status: "Out for Delivery",
        location: "Portland, OR",
        description: "Package out for delivery",
      },
      {
        timestamp: "2024-12-22T11:45:00Z",
        status: "Delivered",
        location: "Portland, OR",
        description: "Package delivered successfully",
      },
    ],
  },
]

export function generateMockPackages(userType: "new" | "demo" | "existing", userId?: string): Package[] {
  switch (userType) {
    case "new":
      return [] // New users have no packages
    case "demo":
      return mockPackages // Demo users see sample data
    case "existing":
      return mockPackages.concat([
        {
          id: "pkg_003",
          trackingNumber: "SC1122334455",
          status: "pending",
          sender: {
            name: "Demo Sender",
            address: "100 Demo St",
            city: "Demo City",
            state: "DC",
            zip: "12345",
          },
          recipient: {
            name: "Demo Recipient",
            address: "200 Test Ave",
            city: "Test City",
            state: "TC",
            zip: "54321",
          },
          service: "Overnight Express",
          weight: "3.0 lbs",
          dimensions: "10x10x6 inches",
          estimatedDelivery: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          cost: 35.99,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          events: [
            {
              timestamp: new Date().toISOString(),
              status: "Package Created",
              location: "Demo City, DC",
              description: "Package information received",
            },
          ],
        },
      ])
    default:
      return []
  }
}

export function findUserByEmail(email: string): User | undefined {
  return mockUsers.find((user) => user.email === email)
}

export function findUserById(id: string): User | undefined {
  return mockUsers.find((user) => user.id === id)
}

export function createUser(userData: Omit<User, "id" | "createdAt">): User {
  const newUser: User = {
    ...userData,
    id: `user_${Date.now()}`,
    createdAt: new Date().toISOString(),
    preferences: {
      notifications: true,
      theme: "light",
      language: "en",
    },
  }
  mockUsers.push(newUser)
  return newUser
}

export function updateUserLastLogin(userId: string): void {
  const user = findUserById(userId)
  if (user) {
    user.lastLogin = new Date().toISOString()
  }
}

export function getPackageByTrackingNumber(trackingNumber: string): Package | undefined {
  return mockPackages.find((pkg) => pkg.trackingNumber === trackingNumber)
}

export function addTrackingEvent(trackingNumber: string, event: Package["events"][0]): boolean {
  const pkg = getPackageByTrackingNumber(trackingNumber)
  if (pkg) {
    pkg.events.push(event)
    pkg.updatedAt = new Date().toISOString()
    return true
  }
  return false
}
