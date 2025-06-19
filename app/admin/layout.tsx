import type React from "react"
import type { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Swift Courier Admin - Internal Dashboard",
  description: "Internal admin dashboard for Swift Courier operations",
  robots: "noindex, nofollow", // Prevent search engine indexing
}

// This would typically check authentication in a real app
async function checkAdminAuth() {
  // In production, this would verify JWT tokens, session cookies, etc.
  // For demo purposes, we'll simulate an auth check
  const isAuthenticated = false // This would be actual auth logic

  if (!isAuthenticated) {
    redirect("/admin/login")
  }
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await checkAdminAuth()

  return (
    <html lang="en">
      <body className="bg-gray-100">
        <div className="min-h-screen">
          {/* Admin-specific header */}
          <header className="bg-red-600 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
              <h1 className="text-xl font-bold">Swift Courier Admin Panel</h1>
              <div className="text-sm">Internal Use Only</div>
            </div>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  )
}
