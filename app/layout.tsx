import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SmartChatManager } from "@/components/smart-chat-manager"
import { ErrorBoundary } from "@/components/error-boundary"
import { AuthProvider } from "@/contexts/AuthContext"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: {
    default: "Swift Courier - Fast, Reliable Package Delivery",
    template: "%s | Swift Courier",
  },
  description:
    "Professional courier and package delivery services with real-time tracking, express shipping, and nationwide coverage. Fast, secure, and reliable delivery solutions.",
  keywords: [
    "courier service",
    "package delivery",
    "shipping",
    "tracking",
    "express delivery",
    "logistics",
    "freight",
    "same day delivery",
  ],
  authors: [{ name: "Swift Courier", url: "https://swiftcourier.com" }],
  creator: "Swift Courier",
  publisher: "Swift Courier",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://swiftcourier.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Swift Courier - Fast, Reliable Package Delivery",
    description:
      "Professional courier and package delivery services with real-time tracking, express shipping, and nationwide coverage.",
    url: "https://swiftcourier.com",
    siteName: "Swift Courier",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Swift Courier - Professional Delivery Services",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Swift Courier - Fast, Reliable Package Delivery",
    description:
      "Professional courier and package delivery services with real-time tracking, express shipping, and nationwide coverage.",
    images: ["/twitter-image.jpg"],
    creator: "@swiftcourier",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ErrorBoundary>
          <AuthProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
              storageKey="swift-courier-theme"
            >
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1" id="main-content" role="main">
                  {children}
                </main>
                <Footer />
                <SmartChatManager />
              </div>
            </ThemeProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
