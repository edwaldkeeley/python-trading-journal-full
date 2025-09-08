import React from 'react'
import {
  formatErrorMessage,
  isRetryableError,
} from '../../hooks/useErrorHandler'

const ErrorMessage = ({
  error,
  onRetry,
  onDismiss,
  showDetails = false,
  className = '',
  style = {},
}) => {
  if (!error) return null

  const { message, code, details, timestamp } = error
  const canRetry = isRetryableError(error)
  const formattedMessage = formatErrorMessage(error)

  const getErrorIcon = (code) => {
    switch (code) {
      case 'NETWORK_ERROR':
        return '🌐'
      case 'VALIDATION_ERROR':
        return '⚠️'
      case 'SERVER_ERROR':
        return '🔧'
      case 'NOT_FOUND':
        return '🔍'
      case 'UNAUTHORIZED':
        return '🔒'
      case 'FORBIDDEN':
        return '🚫'
      default:
        return '❌'
    }
  }

  const getErrorColor = (code) => {
    switch (code) {
      case 'VALIDATION_ERROR':
        return '#f59e0b' // amber
      case 'NETWORK_ERROR':
        return '#3b82f6' // blue
      case 'SERVER_ERROR':
        return '#ef4444' // red
      case 'NOT_FOUND':
        return '#6b7280' // gray
      default:
        return '#ef4444' // red
    }
  }

  return (
    <div
      className={`error-message ${className}`}
      style={{
        backgroundColor: '#fef2f2',
        border: `1px solid ${getErrorColor(code)}`,
        borderRadius: '0.5rem',
        padding: '1rem',
        margin: '0.5rem 0',
        fontFamily: 'system-ui, sans-serif',
        ...style,
      }}
    >
      <div
        style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}
      >
        <div style={{ fontSize: '1.25rem', flexShrink: 0 }}>
          {getErrorIcon(code)}
        </div>

        <div style={{ flex: 1 }}>
          <div
            style={{
              fontWeight: '600',
              color: getErrorColor(code),
              marginBottom: '0.25rem',
            }}
          >
            {formattedMessage}
          </div>

          {showDetails && (
            <div
              style={{
                fontSize: '0.875rem',
                color: '#6b7280',
                marginBottom: '0.5rem',
              }}
            >
              Error Code: {code}
              {timestamp && (
                <span> • {new Date(timestamp).toLocaleString()}</span>
              )}
            </div>
          )}

          {details && Object.keys(details).length > 0 && showDetails && (
            <details style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
              <summary style={{ cursor: 'pointer', color: '#6b7280' }}>
                Technical Details
              </summary>
              <pre
                style={{
                  backgroundColor: '#f9fafb',
                  padding: '0.5rem',
                  borderRadius: '0.25rem',
                  marginTop: '0.5rem',
                  fontSize: '0.75rem',
                  overflow: 'auto',
                }}
              >
                {JSON.stringify(details, null, 2)}
              </pre>
            </details>
          )}
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
          {canRetry && onRetry && (
            <button
              onClick={onRetry}
              style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                padding: '0.25rem 0.5rem',
                borderRadius: '0.25rem',
                fontSize: '0.875rem',
                cursor: 'pointer',
              }}
              title="Retry"
            >
              🔄
            </button>
          )}

          {onDismiss && (
            <button
              onClick={onDismiss}
              style={{
                backgroundColor: '#6b7280',
                color: 'white',
                border: 'none',
                padding: '0.25rem 0.5rem',
                borderRadius: '0.25rem',
                fontSize: '0.875rem',
                cursor: 'pointer',
              }}
              title="Dismiss"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ErrorMessage

