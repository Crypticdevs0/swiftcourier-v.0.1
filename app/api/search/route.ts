import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")
  const type = searchParams.get("type") || "all"
  const category = searchParams.get("category") || "all"
  const limit = Number.parseInt(searchParams.get("limit") || "20")

  if (!query) {
    return NextResponse.json({ success: false, message: "Query parameter required" }, { status: 400 })
  }

  // Mock search results
  const mockResults = [
    {
      id: "1",
      type: "package",
      title: `Package ${query.toUpperCase()}`,
      description: "Express delivery package with real-time tracking",
      category: "tracking",
      tags: ["express", "tracking", "delivery"],
      relevance: 95,
      url: `/track?number=${query}`,
    },
    {
      id: "2",
      type: "location",
      title: "Swift Courier Locations",
      description: `Find Swift Courier locations near ${query}`,
      category: "locations",
      tags: ["locations", "pickup", "dropoff"],
      relevance: 88,
      url: `/locations?search=${query}`,
    },
    {
      id: "3",
      type: "service",
      title: "Shipping Services",
      description: `Shipping services and rates for ${query}`,
      category: "services",
      tags: ["shipping", "rates", "services"],
      relevance: 82,
      url: `/services?search=${query}`,
    },
  ]

  // Filter results based on type and category
  const filteredResults = mockResults
    .filter((result) => {
      const matchesType = type === "all" || result.type === type
      const matchesCategory = category === "all" || result.category === category
      return matchesType && matchesCategory
    })
    .slice(0, limit)

  return NextResponse.json({
    success: true,
    query,
    results: filteredResults,
    total: filteredResults.length,
    suggestions: ["track package", "shipping rates", "nearest location", "express delivery"],
  })
}

export async function POST(request: NextRequest) {
  try {
    const { query, userId } = await request.json()

    // Mock saving search to user history
    return NextResponse.json({
      success: true,
      message: "Search saved to history",
      searchId: `search_${Date.now()}`,
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to save search" }, { status: 500 })
  }
}
