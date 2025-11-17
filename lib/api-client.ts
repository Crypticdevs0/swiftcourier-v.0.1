/**
 * API client utilities for making authenticated requests with CSRF token support
 */

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  headers?: Record<string, string>
  body?: any
  csrfToken?: string
}

interface APIResponse<T = any> {
  success: boolean
  message?: string
  error?: string
  data?: T
  [key: string]: any
}

/**
 * Make an authenticated API call with CSRF token support
 * Automatically includes CSRF token for state-changing requests (POST, PUT, DELETE)
 * Includes credentials to ensure cookies are sent with requests
 */
export async function apiCall<T = any>(
  url: string,
  options: RequestOptions = {}
): Promise<APIResponse<T>> {
  const {
    method = 'GET',
    headers = {},
    body,
    csrfToken,
  } = options

  const isStateChanging = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)

  const fetchOptions: RequestInit = {
    method,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  }

  // Add CSRF token for state-changing requests
  if (isStateChanging && csrfToken) {
    fetchOptions.headers = {
      ...fetchOptions.headers,
      'X-CSRF-Token': csrfToken,
    }
  }

  if (body) {
    fetchOptions.body = JSON.stringify({
      ...body,
      ...(isStateChanging && csrfToken && { csrfToken }),
    })
  }

  try {
    const response = await fetch(url, fetchOptions)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || data.message || `HTTP ${response.status}`)
    }

    return data
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return {
      success: false,
      error: errorMessage,
    }
  }
}

/**
 * Make a public (unauthenticated) API call
 */
export async function publicApiCall<T = any>(
  url: string,
  options: RequestOptions = {}
): Promise<APIResponse<T>> {
  const { method = 'GET', headers = {}, body } = options

  const fetchOptions: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  }

  if (body) {
    fetchOptions.body = JSON.stringify(body)
  }

  try {
    const response = await fetch(url, fetchOptions)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || data.message || `HTTP ${response.status}`)
    }

    return data
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return {
      success: false,
      error: errorMessage,
    }
  }
}
