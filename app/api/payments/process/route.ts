import { type NextRequest, NextResponse } from "next/server"
import { deterministicRandom } from "@/lib/utils"

export async function POST(request: NextRequest) {
  try {
    const { amount, paymentMethod, shippingDetails, items } = await request.json()

    // Simulate payment processing (kept small delay)
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Deterministic success/failure based on payment details
    const seed = JSON.stringify({ amount, last4: paymentMethod?.last4 || "", type: paymentMethod?.type || "" })
    const isSuccess = deterministicRandom(seed) > 0.1 // ~90% success deterministically

    if (isSuccess) {
      const transactionId = `SC_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      return NextResponse.json({
        success: true,
        transactionId,
        amount,
        status: "completed",
        receipt: {
          id: transactionId,
          date: new Date().toISOString(),
          items,
          total: amount,
          paymentMethod: paymentMethod?.type,
          last4: paymentMethod?.last4,
        },
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "Payment declined",
          code: "CARD_DECLINED",
        },
        { status: 400 },
      )
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Payment processing error",
      },
      { status: 500 },
    )
  }
}
