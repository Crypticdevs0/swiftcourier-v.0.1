import { NextResponse } from "next/server"
import store from "@/lib/store"

function mapToFedexFormat(pkg: any) {
  return {
    tracking_number: pkg.trackingNumber,
    status: pkg.status,
    service: pkg.service,
    weight: pkg.weight,
    dimensions: pkg.dimensions,
    estimated_delivery: pkg.estimatedDelivery,
    actual_delivery: pkg.actualDelivery || null,
    events: pkg.events.map((e: any) => ({
      timestamp: e.timestamp,
      status: e.status,
      location: e.location,
      description: e.description,
    })),
    sender: pkg.sender,
    recipient: pkg.recipient,
    cost: pkg.cost,
    created_at: pkg.createdAt,
    updated_at: pkg.updatedAt,
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const trackingNumber = url.searchParams.get("trackingNumber")
    const all = url.searchParams.get("all")

    // simple check for test key presence (do not leak secret)
    const hasTestKey = !!process.env.FEDEX_TEST_API_KEY

    if (all === "true") {
      const list = (await store.getAllPackages()).map(mapToFedexFormat)
      return NextResponse.json({ success: true, using_test_key: hasTestKey, data: list })
    }

    if (!trackingNumber) {
      return NextResponse.json({ success: false, error: "trackingNumber required" }, { status: 400 })
    }

    const pkg = await store.getPackageByTrackingNumber(trackingNumber)

    if (!pkg) {
      return NextResponse.json({ success: false, error: "Not found" }, { status: 404 })
    }

    const fedexPayload = mapToFedexFormat(pkg)

    // simulate FedEx-style wrapping
    const response = {
      success: true,
      meta: {
        carrier: "FEDEX-MOCK",
        account: process.env.FEDEX_TEST_ACCOUNT_NUMBER ? "****" + String(process.env.FEDEX_TEST_ACCOUNT_NUMBER).slice(-4) : null,
        using_test_key: hasTestKey,
      },
      tracking: fedexPayload,
    }

    return NextResponse.json(response)
  } catch (err) {
    console.error("/api/mock/fedex error", err)
    return NextResponse.json({ success: false, error: "internal" }, { status: 500 })
  }
}
