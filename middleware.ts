import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Create response
  const response = NextResponse.next()

  // Security headers
  response.headers.set("X-DNS-Prefetch-Control", "on")
  response.headers.set("X-XSS-Protection", "1; mode=block")
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("Referrer-Policy", "origin-when-cross-origin")
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' wss:; frame-src 'none';",
  )

  // CORS headers for API routes: allow credentials and mirror request origin when present
  if (request.nextUrl.pathname.startsWith("/api/")) {
    const origin = request.headers.get("origin") || "*"
    // When credentials are used, the value cannot be '*', so mirror origin
    response.headers.set("Access-Control-Allow-Origin", origin)
    response.headers.set("Access-Control-Allow-Credentials", "true")
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-Requested-With, Accept, Accept-Language, Content-Language",
    )
  }

  // Lightweight admin guard: server-side protect /admin routes by requiring an auth cookie.
  // This is intentionally minimal (edge-compatible) and only checks presence of cookie.
  try {
    const pathname = request.nextUrl.pathname
    if (pathname.startsWith("/admin")) {
      const hasAuth = !!request.cookies.get("auth-token")
      if (!hasAuth) {
        const loginUrl = new URL("/admin/login", request.url)
        return NextResponse.redirect(loginUrl)
      }
    }
  } catch (err) {
    // If anything goes wrong, allow the request to proceed but log in server logs
    console.error("Middleware admin guard error:", err)
  }

  return response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
