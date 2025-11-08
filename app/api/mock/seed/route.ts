import { NextResponse } from "next/server"
import store from "@/lib/store"

export async function POST(request: Request) {
  try {
    const result = await store.seedInMemory()

    const response = {
      success: true,
      ...result,
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
