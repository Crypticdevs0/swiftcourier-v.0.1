import { type NextRequest, NextResponse } from "next/server"
import { shipmentSchema } from "@/lib/validation"
import { createPackage, calculateShippingCost } from "@/lib/tracking"
import { parseAuthToken } from "@/lib/utils"

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 })
    }

    const userId = parseAuthToken(token)
    if (!userId) {
      return NextResponse.json({ success: false, message: "Invalid authentication token" }, { status: 401 })
    }

    const body = await request.json()

    // Validate input
    const validationResult = shipmentSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 },
      )
    }

    const { sender, recipient, package: packageInfo, service, specialInstructions } = validationResult.data

    // Calculate shipping cost
    const cost = calculateShippingCost(packageInfo.weight, packageInfo.dimensions, service)

    // Create package
    const newPackage = createPackage({
      status: "pending",
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days
      currentLocation: "Swift Courier Facility - New York, NY",
      recipient,
      sender,
      service:
        service === "swift_express"
          ? "Swift Express"
          : service === "swift_standard"
            ? "Swift Standard"
            : service === "swift_overnight"
              ? "Swift Overnight"
              : "Swift Ground",
      weight: packageInfo.weight,
      dimensions: packageInfo.dimensions,
      createdAt: new Date().toISOString(),
      userId,
      cost,
      insurance: packageInfo.insurance,
      signature: packageInfo.signature,
      specialInstructions,
    })

    return NextResponse.json({
      success: true,
      message: "Shipment created successfully",
      package: newPackage,
    })
  } catch (error) {
    console.error("Shipment creation error:", error)
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}
