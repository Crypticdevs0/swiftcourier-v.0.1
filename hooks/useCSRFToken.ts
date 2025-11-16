'use client'

import { useState, useEffect } from 'react'

export function useCSRFToken() {
  const [csrfToken, setCSRFToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCSRFToken()
  }, [])

  const fetchCSRFToken = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/csrf-token')
      const data = await response.json()
      
      if (data.success && data.token) {
        setCSRFToken(data.token)
      } else {
        setError('Failed to fetch CSRF token')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch CSRF token')
    } finally {
      setLoading(false)
    }
  }

  return {
    csrfToken,
    loading,
    error,
    refetchToken: fetchCSRFToken,
  }
}
