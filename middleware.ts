import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // HTTPS enforcement: redirect HTTP to HTTPS in production
  if (process.env.NODE_ENV === "production") {
    const proto = request.headers.get("x-forwarded-proto")
    const host = request.headers.get("host")

    if (proto === "http" && host) {
      const httpsUrl = new URL(request.url)
      httpsUrl.protocol = "https:"
      return NextResponse.redirect(httpsUrl, { status: 308 })
    }
  }

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
  // Additional security headers for production
  // HSTS (only enable in production to avoid local dev issues)
  try {
    if (process.env.NODE_ENV === "production") {
      response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload")
    }
  } catch (e) {
    // ignore if headers cannot be set
  }

  // Permissions Policy (reduce powerful APIs)
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=()"
  )

  // Cross-Origin Resource Policy - allow same-origin resources only
  // Keep relaxed for API endpoints if needed; default to same-origin to improve security
  response.headers.set("Cross-Origin-Resource-Policy", "same-origin")

  // CORS headers for API routes: allow credentials and mirror request origin when present
  if (request.nextUrl.pathname.startsWith("/api/")) {
    // Mirror the request origin when present; fall back to the request's origin when absent.
    const originHeader = request.headers.get("origin")
    const origin = originHeader || request.nextUrl.origin
    // When credentials are used, the value cannot be '*', so ensure we set a concrete origin.
    response.headers.set("Access-Control-Allow-Origin", origin)
    response.headers.set("Access-Control-Allow-Credentials", "true")
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-Requested-With, Accept, Accept-Language, Content-Language",
    )
  }

  // Lightweight authentication guard: server-side protect authenticated routes.
  // This is intentionally minimal (edge-compatible) and only checks presence of cookie.
  try {
    const pathname = request.nextUrl.pathname

    // Protected routes that require authentication
    const protectedRoutes = [
      "/dashboard",
      "/profile",
      "/settings",
      "/shipping/create",
      "/search",
      "/business",
      "/store",
      "/checkout",
      "/admin",
    ]

    // Public routes that should NOT require authentication
    const publicRoutes = [
      "/tracking",
      "/track",
      "/",
      "/rates",
      "/locations",
      "/schedule-pickup",
      "/swiftship",
      "/international",
      "/faq",
      "/support",
      "/claims",
      "/careers",
      "/privacy",
      "/terms",
      "/accessibility",
      "/security",
      "/swift-box",
      "/swift-preview",
      "/mobile"
    ]

    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

    // Only protect routes that are explicitly protected and not explicitly public
    if (isProtectedRoute && !isPublicRoute) {
      const hasAuth = !!request.cookies.get("auth-token")
      if (!hasAuth) {
        // Redirect to auth page, preserving the original destination
        const authUrl = new URL("/auth", request.url)
        authUrl.searchParams.set("redirect", pathname)
        return NextResponse.redirect(authUrl)
      }
    }

    // Redirect authenticated users away from auth page
    if (pathname === "/auth" || pathname === "/login" || pathname === "/register") {
      const hasAuth = !!request.cookies.get("auth-token")
      if (hasAuth) {
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }
    }
  } catch (err) {
    // If anything goes wrong, allow the request to proceed but log in server logs
    console.error("Middleware auth guard error:", err)
  }

  return response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
