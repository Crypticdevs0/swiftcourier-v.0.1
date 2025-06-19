import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Swift Courier Admin - Internal Dashboard",
  description: "Internal admin dashboard for Swift Courier operations",
  robots: "noindex, nofollow",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin-specific header */}
      <header className="bg-red-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Swift Courier Admin Panel</h1>
          <div className="text-sm">Internal Use Only</div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  )
}
