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

        // Initialize Tawk_API and LoadStart
        window.Tawk_API = window.Tawk_API || {}
        window.Tawk_LoadStart = new Date()

        // Create script element with your provided configuration
        const script = document.createElement("script")
        const firstScript = document.getElementsByTagName("script")[0]

        script.async = true
        script.src = "https://embed.tawk.to/68536d09a4205c190bec8ae3/default"
        script.charset = "UTF-8"
        script.setAttribute("crossorigin", "*")

        // Add comprehensive error handling
        script.onerror = (error) => {
          console.error("Failed to load Tawk.to chat widget:", error)
          setHasError(true)
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
        }, 15000) // 15 second timeout

        // Insert script using your provided method
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

            // Customize chat widget
            window.Tawk_API.customStyle = {
              visibility: {
                desktop: {
                  position: "br",
                  xOffset: 20,
                  yOffset: 20,
                },
                mobile: {
                  position: "br",
                  xOffset: 10,
                  yOffset: 10,
                },
              },
            }
          } catch (error) {
            console.error("Error configuring Tawk.to:", error)
          }
        }

        window.Tawk_API.onStatusChange = (status: string) => {
          console.log("Chat status:", status)
        }

        window.Tawk_API.onChatMaximized = () => {
          // Ensure chat stays within the page bounds
          try {
            const chatWidget = document.querySelector("#tawkchat-minified-container, #tawkchat-container")
            if (chatWidget) {
              ;(chatWidget as HTMLElement).style.zIndex = "9999"
            }
          } catch (error) {
            console.error("Error adjusting chat widget:", error)
          }
        }

        window.Tawk_API.onChatMinimized = () => {
          console.log("Chat minimized")
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
      const event = new Event("tawk-retry")
      window.dispatchEvent(event)
    }, 2000)
  }

  // Don't render anything visible (chat widget handles its own UI)
  return null
}
