import { useState, useCallback } from 'react'

/**
 * Custom hook for handling errors with user-friendly messages
 */
export const useErrorHandler = () => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleError = useCallback((error, context = '') => {
    console.error(`🚨 Error in ${context}:`, error)

    let userMessage = 'Something went wrong. Please try again.'
    let errorCode = 'UNKNOWN_ERROR'
    let details = {}

    // Handle different types of errors
    if (error?.response?.data?.error) {
      // Backend API error
      const apiError = error.response.data.error
      userMessage = apiError.message || userMessage
      errorCode = apiError.code || errorCode
      details = apiError.details || {}
    } else if (error?.response?.status) {
      // HTTP status error
      const status = error.response.status
      switch (status) {
        case 400:
          userMessage = 'Invalid request. Please check your input.'
          errorCode = 'BAD_REQUEST'
          break
        case 401:
          userMessage = 'You are not authorized. Please log in again.'
          errorCode = 'UNAUTHORIZED'
          break
        case 403:
          userMessage = 'You do not have permission to perform this action.'
          errorCode = 'FORBIDDEN'
          break
        case 404:
          userMessage = 'The requested resource was not found.'
          errorCode = 'NOT_FOUND'
          break
        case 422:
          userMessage = 'Validation error. Please check your input.'
          errorCode = 'VALIDATION_ERROR'
          break
        case 500:
          userMessage = 'Server error. Please try again later.'
          errorCode = 'SERVER_ERROR'
          break
        case 503:
          userMessage =
            'Service temporarily unavailable. Please try again later.'
          errorCode = 'SERVICE_UNAVAILABLE'
          break
        default:
          userMessage = `Request failed with status ${status}`
          errorCode = `HTTP_${status}`
      }
    } else if (error?.message) {
      // Network or other error
      if (
        error.message.includes('Network Error') ||
        error.message.includes('fetch')
      ) {
        userMessage = 'Network error. Please check your connection.'
        errorCode = 'NETWORK_ERROR'
      } else {
        userMessage = error.message
        errorCode = 'CLIENT_ERROR'
      }
    }

    setError({
      message: userMessage,
      code: errorCode,
      details,
      originalError: error,
      context,
      timestamp: new Date().toISOString(),
    })
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const executeWithErrorHandling = useCallback(
    async (asyncFunction, context = '') => {
      setIsLoading(true)
      clearError()

      try {
        const result = await asyncFunction()
        return result
      } catch (err) {
        handleError(err, context)
        throw err // Re-throw so calling code can handle if needed
      } finally {
        setIsLoading(false)
      }
    },
    [handleError, clearError]
  )

  return {
    error,
    isLoading,
    handleError,
    clearError,
    executeWithErrorHandling,
  }
}

/**
 * Hook for handling API errors with retry functionality
 */
export const useApiErrorHandler = () => {
  const {
    error,
    isLoading,
    handleError,
    clearError,
    executeWithErrorHandling,
  } = useErrorHandler()
  const [retryCount, setRetryCount] = useState(0)

  const retry = useCallback(
    async (asyncFunction, context = '', maxRetries = 3) => {
      if (retryCount >= maxRetries) {
        handleError(new Error('Maximum retry attempts reached'), context)
        return
      }

      setRetryCount((prev) => prev + 1)
      return executeWithErrorHandling(
        asyncFunction,
        `${context} (retry ${retryCount + 1})`
      )
    },
    [retryCount, executeWithErrorHandling, handleError]
  )

  const resetRetry = useCallback(() => {
    setRetryCount(0)
  }, [])

  return {
    error,
    isLoading,
    retryCount,
    handleError,
    clearError,
    executeWithErrorHandling,
    retry,
    resetRetry,
  }
}

/**
 * Utility function to format error messages for display
 */
export const formatErrorMessage = (error) => {
  if (!error) return null

  const { message, code, details } = error

  // Add field-specific error messages
  if (details?.field) {
    return `${message} (Field: ${details.field})`
  }

  // Add trade-specific error messages
  if (details?.trade_id) {
    return `${message} (Trade ID: ${details.trade_id})`
  }

  return message
}

/**
 * Utility function to check if error is retryable
 */
export const isRetryableError = (error) => {
  if (!error) return false

  const retryableCodes = [
    'NETWORK_ERROR',
    'SERVER_ERROR',
    'SERVICE_UNAVAILABLE',
    'TIMEOUT_ERROR',
  ]

  return (
    retryableCodes.includes(error.code) ||
    error.originalError?.response?.status >= 500
  )
}

