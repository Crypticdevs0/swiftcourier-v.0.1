import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const countries = [
    {
      code: "CA",
      name: "Canada",
      region: "North America",
      services: ["Express", "Standard", "Economy"],
      restrictions: ["No lithium batteries", "Customs form required"],
      estimatedDays: { express: "1-3", standard: "5-10", economy: "10-15" },
      customsForms: ["CN22", "CN23"],
    },
    {
      code: "GB",
      name: "United Kingdom",
      region: "Europe",
      services: ["Express", "Standard"],
      restrictions: ["No food items", "Customs form required", "VAT may apply"],
      estimatedDays: { express: "2-4", standard: "7-14" },
      customsForms: ["CN22", "CN23"],
    },
    {
      code: "JP",
      name: "Japan",
      region: "Asia",
      services: ["Express", "Standard"],
      restrictions: ["No meat products", "Customs form required", "Size restrictions apply"],
      estimatedDays: { express: "2-5", standard: "10-20" },
      customsForms: ["CN22", "CN23"],
    },
    {
      code: "AU",
      name: "Australia",
      region: "Oceania",
      services: ["Express", "Standard"],
      restrictions: ["Strict biosecurity laws", "No food/plant items", "Customs form required"],
      estimatedDays: { express: "3-6", standard: "12-25" },
      customsForms: ["CN22", "CN23"],
    },
    {
      code: "DE",
      name: "Germany",
      region: "Europe",
      services: ["Express", "Standard", "Economy"],
      restrictions: ["Customs form required", "VAT may apply"],
      estimatedDays: { express: "2-4", standard: "7-14", economy: "14-21" },
      customsForms: ["CN22", "CN23"],
    },
  ]

  return NextResponse.json({
    success: true,
    countries,
  })
}
