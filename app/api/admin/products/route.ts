import { type NextRequest, NextResponse } from "next/server"
import { extractAuthFromRequest } from "@/lib/utils"
import { unifiedStore } from "@/lib/unified-store"
import store from "@/lib/store"

export async function GET(request: NextRequest) {
  const userId = extractAuthFromRequest(request)

  if (!userId) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
  }

  const user = await store.findUserById(userId)
  if (!user || user.role !== "admin") {
    return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 })
  }

  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get("q") || ""

    let products = unifiedStore.getAllProducts()
    if (query) {
      products = unifiedStore.searchProducts(query)
    }

    return NextResponse.json({
      success: true,
      data: products,
      total: products.length,
    })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const userId = extractAuthFromRequest(request)

  if (!userId) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
  }

  const user = await store.findUserById(userId)
  if (!user || user.role !== "admin") {
    return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 })
  }

  try {
    const body = await request.json()
    const { action, id, ...data } = body

    if (action === "create") {
      const product = unifiedStore.createProduct({
        ...data,
        createdBy: userId,
      })
      return NextResponse.json({
        success: true,
        data: product,
        message: "Product created successfully",
      })
    }

    if (action === "update") {
      if (!id) {
        return NextResponse.json(
          { success: false, message: "Product ID required" },
          { status: 400 }
        )
      }
      const product = unifiedStore.updateProduct(id, data)
      if (!product) {
        return NextResponse.json(
          { success: false, message: "Product not found" },
          { status: 404 }
        )
      }
      return NextResponse.json({
        success: true,
        data: product,
        message: "Product updated successfully",
      })
    }

    if (action === "delete") {
      if (!id) {
        return NextResponse.json(
          { success: false, message: "Product ID required" },
          { status: 400 }
        )
      }
      const deleted = unifiedStore.deleteProduct(id)
      if (!deleted) {
        return NextResponse.json(
          { success: false, message: "Product not found" },
          { status: 404 }
        )
      }
      return NextResponse.json({
        success: true,
        message: "Product deleted successfully",
      })
    }

    return NextResponse.json(
      { success: false, message: "Unknown action" },
      { status: 400 }
    )
  } catch (error) {
    console.error("Error in products API:", error)
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}
