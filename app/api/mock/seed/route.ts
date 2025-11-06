import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { mockPackages, mockUsers } from "@/lib/mock-data"

export async function POST(request: Request) {
  try {
    // Read SQL for informational purpose
    const sqlPath = path.resolve(process.cwd(), "db/seed_supabase.sql")
    let sql = null
    try {
      sql = fs.readFileSync(sqlPath, "utf-8")
    } catch (e) {
      // ignore if not present
    }

    // In-memory seeding: ensure sample users/packages exist
    const seeded = { users: 0, packages: 0, events: 0 }

    // Seed users
    const demoUserExists = mockUsers.find((u: any) => u.email === "demo@swiftcourier.com")
    if (!demoUserExists) {
      mockUsers.push({
        id: "1",
        email: "demo@swiftcourier.com",
        password: "demo123",
        name: "Demo User",
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
        userType: "existing",
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        preferences: { notifications: true, theme: "light", language: "en" },
      })
      seeded.users++
    }

    // Seed packages: add pkg_003 if missing
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

    const response = {
      success: true,
      seeded_in_memory: seeded,
      sql_available: !!sql,
      message: "Seeded in-memory mock data. To seed a real Supabase/Postgres DB, run the SQL in db/seed_supabase.sql against your database or use the Supabase SQL editor.",
    }

    return NextResponse.json(response)
  } catch (err) {
    console.error("/api/mock/seed error", err)
    return NextResponse.json({ success: false, error: "internal" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ success: true, message: "Send a POST to seed in-memory mock data." })
}
