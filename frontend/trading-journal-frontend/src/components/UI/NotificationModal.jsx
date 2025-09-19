import React from 'react'
import useModalAnimation from '../../hooks/useModalAnimation'

const NotificationModal = ({
  isOpen,
  onClose,
  type = 'info', // 'success', 'error', 'warning', 'info'
  title,
  message,
  confirmText = 'OK',
  showCancel = false,
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  const { isClosing, handleClose } = useModalAnimation(onClose)

  if (!isOpen) return null

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm()
    } else {
      handleClose()
    }
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    } else {
      handleClose()
    }
  }

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅'
      case 'error':
        return '❌'
      case 'warning':
        return '⚠️'
      case 'info':
      default:
        return 'ℹ️'
    }
  }

  const getTypeClass = () => {
    switch (type) {
      case 'success':
        return 'notification-success'
      case 'error':
        return 'notification-error'
      case 'warning':
        return 'notification-warning'
      case 'info':
      default:
        return 'notification-info'
    }
  }

  return (
    <div
      className={`modal-overlay ${isClosing ? 'closing' : ''}`}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="notification-title"
    >
      <div
        className={`modal notification-modal ${getTypeClass()} ${
          isClosing ? 'closing' : ''
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="notification-icon">{getIcon()}</div>
          <h2 id="notification-title">{title}</h2>
          <button
            className="btn btn-icon btn-sm"
            onClick={handleClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="notification-content">
            <p className="notification-message">{message}</p>
          </div>
        </div>

        <div className="modal-footer">
          {showCancel && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCancel}
              disabled={isLoading}
            >
              {cancelText}
            </button>
          )}
          <button
            type="button"
            className={`btn ${type === 'error' ? 'btn-danger' : 'btn-primary'}`}
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotificationModal
