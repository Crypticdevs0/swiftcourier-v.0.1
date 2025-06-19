"use client"

import { useEffect } from "react"

export function TawkToChat() {
  useEffect(() => {
    // Initialize Tawk.to - this creates an embedded chat widget on your site
    const script = document.createElement("script")
    script.async = true
    script.src = "https://embed.tawk.to/68536d09a4205c190bec8ae3/default"
    script.charset = "UTF-8"
    script.setAttribute("crossorigin", "*")

    // Insert script into document
    const firstScript = document.getElementsByTagName("script")[0]
    if (firstScript && firstScript.parentNode) {
      firstScript.parentNode.insertBefore(script, firstScript)
    }

    // Initialize Tawk_API for customization
    if (typeof window !== "undefined") {
      ;(window as any).Tawk_API = (window as any).Tawk_API || {}
      ;(window as any).Tawk_LoadStart = new Date()

      // Optional: Customize the widget behavior
      ;(window as any).Tawk_API.onLoad = () => {
        console.log("Tawk.to chat widget loaded successfully")
      }

      // Keep chat contained - prevent external redirects
      ;(window as any).Tawk_API.onChatMaximized = () => {
        // Chat opens in overlay, stays on your site
      }
    }

    // Cleanup function
    return () => {
      const existingScript = document.querySelector('script[src*="tawk.to"]')
      if (existingScript) {
        existingScript.remove()
      }
    }
  }, [])

  return null // Widget appears as overlay, no visible component needed
}
