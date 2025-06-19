import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Swift Courier Admin - Operations Dashboard",
  description: "Advanced administrative dashboard for Swift Courier operations management",
  robots: "noindex, nofollow",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="min-h-screen">{children}</div>
}
