import { mockPackages, mockUsers, findUserByEmail as mdFindUserByEmail, findUserById as mdFindUserById, createUser as mdCreateUser, updateUserLastLogin as mdUpdateUserLastLogin, getPackageByTrackingNumber as mdGetPackageByTrackingNumber, addTrackingEvent as mdAddTrackingEvent, generateMockPackages } from "./mock-data"
import type { User, Package } from "./mock-data"
import fs from "fs"
import path from "path"

export type Store = {
  findUserByEmail: (email: string) => User | undefined
  findUserById: (id: string) => User | undefined
  createUser: (userData: Omit<User, "id" | "createdAt">) => User
  updateUser: (userId: string, changes: Partial<User>) => User | undefined
  updateUserLastLogin: (userId: string) => void
  getPackageByTrackingNumber: (trackingNumber: string) => Package | undefined
  addTrackingEvent: (trackingNumber: string, event: Package["events"][0]) => boolean
  getAllPackages: () => Package[]
  seedInMemory: () => { seeded_in_memory: { users: number; packages: number; events: number }; sql_available: boolean }
  generateMockPackages?: (userType: "new" | "demo" | "existing", userId?: string) => Package[]
}

// In-memory adapter (default)
const inMemoryAdapter: Store = {
  findUserByEmail(email: string) {
    return mdFindUserByEmail(email)
  },
  findUserById(id: string) {
    return mdFindUserById(id)
  },
  createUser(userData) {
    return mdCreateUser(userData as any)
  },
  updateUser(userId: string, changes: Partial<User>) {
    const user = mdFindUserById(userId)
    if (!user) return undefined
    Object.assign(user as any, changes)
    return user
  },
  updateUserLastLogin(userId: string) {
    mdUpdateUserLastLogin(userId)
  },
  getPackageByTrackingNumber(trackingNumber: string) {
    return mdGetPackageByTrackingNumber(trackingNumber)
  },
  addTrackingEvent(trackingNumber: string, event) {
    return mdAddTrackingEvent(trackingNumber, event)
  },
  getAllPackages() {
    return mockPackages
  },
  generateMockPackages(userType: "new" | "demo" | "existing", userId?: string) {
    return generateMockPackages(userType, userId)
  },
  seedInMemory() {
    // Mirror previous seeding behavior but make idempotent
    const seeded = { users: 0, packages: 0, events: 0 }

    const demoUserExists = mockUsers.find((u: any) => u.email === "demo@swiftcourier.com")
    if (!demoUserExists) {
      mockUsers.push({
        id: "1",
        email: "demo@swiftcourier.com",
        password: "demo123",
        name: "Demo User",
        firstName: "Demo",
        lastName: "User",
        role: "demo",
        userType: "demo",
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        preferences: { notifications: true, theme: "light", language: "en" },
      })
      seeded.users++
    }

    const adminUserExists = mockUsers.find((u: any) => u.email === "admin@swiftcourier.com")
    if (!adminUserExists) {
      mockUsers.push({
        id: "2",
        email: "admin@swiftcourier.com",
        password: "admin123",
        name: "Admin User",
        firstName: "Admin",
        lastName: "User",
        role: "admin",
        userType: "existing",
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        preferences: { notifications: true, theme: "light", language: "en" },
      })
      seeded.users++
    }

    const pkg003 = mockPackages.find((p: any) => p.id === "pkg_003")
    if (!pkg003) {
      mockPackages.push({
        id: "pkg_003",
        trackingNumber: "SC1122334455",
        status: "pending",
        sender: { name: "Demo Sender", address: "100 Demo St", city: "Demo City", state: "DC", zip: "12345" },
        recipient: { name: "Demo Recipient", address: "200 Test Ave", city: "Test City", state: "TC", zip: "54321" },
        service: "Overnight Express",
        weight: "3.0 lbs",
        dimensions: "10x10x6 inches",
        estimatedDelivery: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        cost: 35.99,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        events: [
          { timestamp: new Date().toISOString(), status: "Package Created", location: "Demo City, DC", description: "Package information received" },
        ],
      })
      seeded.packages++
      seeded.events++
    }

    // Provide informational SQL presence
    const sqlPath = path.resolve(process.cwd(), "db/seed_supabase.sql")
    let sql = null
    try {
      sql = fs.readFileSync(sqlPath, "utf-8")
    } catch (e) {
      // ignore
    }

    return { seeded_in_memory: seeded, sql_available: !!sql }
  },
}

// Supabase adapter (optional, lazy)
async function createSupabaseAdapter(): Promise<Partial<Store> | null> {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) return null
  try {
    const { createClient } = await import("@supabase/supabase-js")
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

    return {
      async findUserByEmail(email: string) {
        const { data } = await supabase.from("users").select("*").eq("email", email).limit(1).single()
        return data as User | undefined
      },
      async findUserById(id: string) {
        const { data } = await supabase.from("users").select("*").eq("id", id).limit(1).single()
        return data as User | undefined
      },
      async createUser(userData: any) {
        const { data } = await supabase.from("users").insert([userData]).select().single()
        return data as User
      },
      async updateUserLastLogin(userId: string) {
        await supabase.from("users").update({ lastLogin: new Date().toISOString() }).eq("id", userId)
      },
      async getPackageByTrackingNumber(trackingNumber: string) {
        const { data } = await supabase.from("packages").select("*").eq("trackingNumber", trackingNumber).limit(1).single()
        return data as Package | undefined
      },
      async addTrackingEvent(trackingNumber: string, event: any) {
        // simplistic: insert into events table
        const { data } = await supabase.from("events").insert([{ trackingNumber, ...event }])
        return !!data
      },
      async getAllPackages() {
        const { data } = await supabase.from("packages").select("*")
        return data as Package[]
      },
    }
  } catch (err) {
    console.warn("Supabase adapter failed to load:", err)
    return null
  }
}

// Active store: start with in-memory. If supabase present, we'll try to override lazily.
const store: Store = inMemoryAdapter

// Try to initialize supabase adapter in the background if configured
;(async () => {
  const sup = await createSupabaseAdapter()
  if (sup) {
    // merge adapters, favor supabase where implemented
    Object.keys(sup).forEach((key) => {
      if ((sup as any)[key]) {
        ;(store as any)[key] = (sup as any)[key]
      }
    })
    console.info("Store: Supabase adapter enabled")
  } else {
    console.info("Store: Using in-memory adapter")
  }
})()

export default store
