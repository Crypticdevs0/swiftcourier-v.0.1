"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { LoadingSpinner } from "./loading-spinner"
import { CheckCircle, ArrowRight } from "lucide-react"

interface RedirectAnimationProps {
  to: string
  delay?: number
  message?: string
  successMessage?: string
  onComplete?: () => void
}

export function RedirectAnimation({ 
  to, 
  delay = 2000, 
  message = "Redirecting...",
  successMessage = "Success!",
  onComplete 
}: RedirectAnimationProps) {
  const [stage, setStage] = useState<"loading" | "success" | "redirecting">("loading")
  const router = useRouter()

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setStage("success")
    }, delay * 0.6)

    const timer2 = setTimeout(() => {
      setStage("redirecting")
    }, delay * 0.8)

    const timer3 = setTimeout(() => {
      onComplete?.()
      router.push(to)
    }, delay)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [to, delay, router, onComplete])

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-8 shadow-2xl max-w-sm w-full mx-4 text-center">
        <div className="space-y-6">
          {/* Animation Stage */}
          <div className="flex justify-center">
            {stage === "loading" && (
              <LoadingSpinner size="xl" />
            )}
            {stage === "success" && (
              <div className="animate-in zoom-in duration-300">
                <CheckCircle className="h-12 w-12 text-green-500" />
              </div>
            )}
            {stage === "redirecting" && (
              <div className="animate-in slide-in-from-left duration-300 flex items-center space-x-2">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <ArrowRight className="h-6 w-6 text-blue-600 animate-pulse" />
              </div>
            )}
          </div>

          {/* Message */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {stage === "loading" && message}
              {stage === "success" && successMessage}
              {stage === "redirecting" && "Taking you there..."}
            </h3>
            <p className="text-sm text-gray-600">
              {stage === "loading" && "Please wait a moment"}
              {stage === "success" && "Operation completed successfully"}
              {stage === "redirecting" && "You'll be redirected shortly"}
            </p>
          </div>

          {/* Progress indicator */}
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div 
              className="bg-blue-600 h-1 rounded-full transition-all duration-1000 ease-out"
              style={{ 
                width: stage === "loading" ? "60%" : stage === "success" ? "80%" : "100%" 
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// Hook for easy redirect with animation
export function useAnimatedRedirect() {
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [redirectConfig, setRedirectConfig] = useState<{
    to: string
    message?: string
    successMessage?: string
  } | null>(null)

  const redirect = (to: string, message?: string, successMessage?: string) => {
    setRedirectConfig({ to, message, successMessage })
    setIsRedirecting(true)
  }

  const handleComplete = () => {
    setIsRedirecting(false)
    setRedirectConfig(null)
  }

  return {
    redirect,
    isRedirecting,
    RedirectComponent: isRedirecting && redirectConfig ? (
      <RedirectAnimation
        to={redirectConfig.to}
        message={redirectConfig.message}
        successMessage={redirectConfig.successMessage}
        onComplete={handleComplete}
      />
    ) : null
  }
}