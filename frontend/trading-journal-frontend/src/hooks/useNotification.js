import { useState, useCallback } from 'react'

/**
 * Custom hook for managing notification modals
 * Replaces alert() calls with proper modal components
 */
export const useNotification = () => {
  const [notification, setNotification] = useState({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
    confirmText: 'OK',
    showCancel: false,
    cancelText: 'Cancel',
    onConfirm: null,
    onCancel: null,
    isLoading: false,
  })

  const showNotification = useCallback(
    ({
      type = 'info',
      title,
      message,
      confirmText = 'OK',
      showCancel = false,
      cancelText = 'Cancel',
      onConfirm,
      onCancel,
      isLoading = false,
    }) => {
      setNotification({
        isOpen: true,
        type,
        title,
        message,
        confirmText,
        showCancel,
        cancelText,
        onConfirm,
        onCancel,
        isLoading,
      })
    },
    []
  )

  const hideNotification = useCallback(() => {
    setNotification((prev) => ({
      ...prev,
      isOpen: false,
    }))
  }, [])

  // Convenience methods for common notification types
  const showSuccess = useCallback(
    (title, message, options = {}) => {
      showNotification({
        type: 'success',
        title,
        message,
        ...options,
      })
    },
    [showNotification]
  )

  const showError = useCallback(
    (title, message, options = {}) => {
      showNotification({
        type: 'error',
        title,
        message,
        ...options,
      })
    },
    [showNotification]
  )

  const showWarning = useCallback(
    (title, message, options = {}) => {
      showNotification({
        type: 'warning',
        title,
        message,
        ...options,
      })
    },
    [showNotification]
  )

  const showInfo = useCallback(
    (title, message, options = {}) => {
      showNotification({
        type: 'info',
        title,
        message,
        ...options,
      })
    },
    [showNotification]
  )

  // Confirmation dialog (replaces confirm())
  const showConfirmation = useCallback(
    (title, message, onConfirm, options = {}) => {
      showNotification({
        type: 'warning',
        title,
        message,
        showCancel: true,
        confirmText: 'Yes',
        cancelText: 'No',
        onConfirm: () => {
          onConfirm()
          hideNotification()
        },
        onCancel: hideNotification,
        ...options,
      })
    },
    [showNotification, hideNotification]
  )

  return {
    notification,
    showNotification,
    hideNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showConfirmation,
  }
}

export default useNotification
