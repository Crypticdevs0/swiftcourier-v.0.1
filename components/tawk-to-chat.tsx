"use client"

import { useEffect, useRef, useState } from "react"

declare global {
  interface Window {
    Tawk_API?: any
    Tawk_LoadStart?: Date
  }
}

export function TawkToChat() {
  const isLoaded = useRef(false)
  const [hasError, setHasError] = useState(false)
  const [isRetrying, setIsRetrying] = useState(false)

  useEffect(() => {
    // Prevent multiple loads
    if (isLoaded.current || typeof window === "undefined") return

    const loadTawkTo = async () => {
      try {
        // Check if script already exists
        const existingScript = document.querySelector('script[src*="tawk.to"]')
        if (existingScript) {
          isLoaded.current = true
          return
        }

        // Validate the widget ID first
        const widgetId = "68536d09a4205c190bec8ae3"
        if (!widgetId || widgetId.length < 20) {
          console.warn("Invalid Tawk.to widget ID")
          setHasError(true)
          return
        }

        // Initialize Tawk_API with error handling
        window.Tawk_API = window.Tawk_API || {}
        window.Tawk_LoadStart = new Date()

        // Create and configure script
        const script = document.createElement("script")
        script.async = true
        script.src = `https://embed.tawk.to/${widgetId}/default`
        script.charset = "UTF-8"
        script.setAttribute("crossorigin", "anonymous")

        // Add comprehensive error handling
        script.onerror = (error) => {
          console.error("Failed to load Tawk.to chat widget:", error)
          setHasError(true)
          // Clean up failed script
          script.remove()
        }

        script.onload = () => {
          console.log("Tawk.to chat widget loaded successfully")
          isLoaded.current = true
          setHasError(false)
        }

        // Set a timeout for loading
        const loadTimeout = setTimeout(() => {
          if (!isLoaded.current) {
            console.warn("Tawk.to loading timeout")
            setHasError(true)
            script.remove()
          }
        }, 10000) // 10 second timeout

        // Insert script
        const firstScript = document.getElementsByTagName("script")[0]
        if (firstScript?.parentNode) {
          firstScript.parentNode.insertBefore(script, firstScript)
        } else {
          document.head.appendChild(script)
        }

        // Configure Tawk.to settings with error handling
        window.Tawk_API.onLoad = () => {
          clearTimeout(loadTimeout)
          try {
            window.Tawk_API.setAttributes({
              name: "Swift Courier Customer",
              email: "",
            })
          } catch (error) {
            console.error("Error configuring Tawk.to:", error)
          }
        }

        window.Tawk_API.onStatusChange = (status: string) => {
          console.log("Chat status:", status)
        }

        window.Tawk_API.onChatMaximized = () => {
          // Ensure chat stays within the page
        }
      } catch (error) {
        console.error("Error initializing Tawk.to:", error)
        setHasError(true)
      }
    }

    loadTawkTo()

    // Cleanup function
    return () => {
      try {
        const script = document.querySelector('script[src*="tawk.to"]')
        if (script) {
          script.remove()
        }

        // Clean up global variables
        if (window.Tawk_API) {
          delete window.Tawk_API
        }
        if (window.Tawk_LoadStart) {
          delete window.Tawk_LoadStart
        }

        isLoaded.current = false
      } catch (error) {
        console.error("Error cleaning up Tawk.to:", error)
      }
    }
  }, [])

  // Retry function
  const retryLoad = () => {
    setIsRetrying(true)
    setHasError(false)
    isLoaded.current = false

    // Clean up existing script
    const existingScript = document.querySelector('script[src*="tawk.to"]')
    if (existingScript) {
      existingScript.remove()
    }

    // Retry after a short delay
    setTimeout(() => {
      setIsRetrying(false)
      // Trigger useEffect to reload
      window.location.reload()
    }, 2000)
  }

  // Don't render anything if there's an error (fallback chat will handle it)
  if (hasError) {
    return null
  }

  return null
}
