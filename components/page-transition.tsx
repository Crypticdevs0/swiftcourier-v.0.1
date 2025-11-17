"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface PageTransitionProps {
  isOpen?: boolean
  onComplete?: () => void
  children?: React.ReactNode
  message?: string
}

export function PageTransition({
  isOpen = false,
  onComplete,
  message = "Loading...",
}: PageTransitionProps) {
  const [show, setShow] = useState(isOpen)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setShow(true)
      setFadeOut(false)
    }
  }, [isOpen])

  const handleComplete = () => {
    setFadeOut(true)
    setTimeout(() => {
      setShow(false)
      onComplete?.()
    }, 500)
  }

  if (!show) return null

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-500",
        fadeOut ? "opacity-0" : "opacity-100",
        "bg-gradient-to-br from-blue-50 via-white to-indigo-50 backdrop-blur-sm"
      )}
    >
      <div className="flex flex-col items-center space-y-6 animate-in fade-in zoom-in duration-500">
        {/* Modern spinning loader */}
        <div className="relative w-20 h-20">
          {/* Outer rotating ring */}
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 border-r-blue-400 animate-spin"></div>

          {/* Inner counter-rotating ring */}
          <div
            className="absolute inset-2 rounded-full border-4 border-transparent border-b-indigo-600 border-l-indigo-400 animate-spin"
            style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
          ></div>

          {/* Center dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Message */}
        <div className="text-center max-w-xs">
          <p className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            {message}
          </p>
          <div className="mt-3 flex justify-center items-center space-x-1">
            <div
              className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"
              style={{ animationDelay: "0s" }}
            ></div>
            <div
              className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"
              style={{ animationDelay: "0.2s" }}
            ></div>
            <div
              className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"
              style={{ animationDelay: "0.4s" }}
            ></div>
          </div>
        </div>

        {/* Completion button (optional) */}
        <button
          onClick={handleComplete}
          className="mt-4 px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors opacity-0 hover:opacity-100"
          style={{ fontSize: "0.75rem" }}
        >
          Press any key or click to continue
        </button>
      </div>
    </div>
  )
}

export function usePageTransition() {
  const [isOpen, setIsOpen] = useState(false)

  const show = (message?: string) => {
    setIsOpen(true)
  }

  const hide = () => {
    setIsOpen(false)
  }

  return { isOpen, show, hide }
}
