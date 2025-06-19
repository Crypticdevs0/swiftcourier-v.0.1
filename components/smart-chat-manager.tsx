"use client"

import { useEffect, useState } from "react"
import { TawkToChat } from "./tawk-to-chat"
import { FallbackChat } from "./fallback-chat"

export function SmartChatManager() {
  const [useFallback, setUseFallback] = useState(false)

  useEffect(() => {
    // Check if Tawk.to is available after a reasonable time
    const checkTawkTo = setTimeout(() => {
      if (typeof window !== "undefined" && !window.Tawk_API) {
        console.log("Tawk.to not available, using fallback chat")
        setUseFallback(true)
      }
    }, 5000) // Wait 5 seconds for Tawk.to to load

    return () => clearTimeout(checkTawkTo)
  }, [])

  return (
    <>
      {!useFallback && <TawkToChat />}
      {useFallback && <FallbackChat />}
    </>
  )
}
