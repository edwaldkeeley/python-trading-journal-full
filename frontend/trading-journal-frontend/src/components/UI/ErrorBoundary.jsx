import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
      lastErrorTime: null,
    }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      lastErrorTime: new Date().toISOString(),
    }
  }

  componentDidCatch(error, errorInfo) {
    // Log the error with more context
    console.error('🚨 Error caught by boundary:', {
      error: error.toString(),
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      retryCount: this.state.retryCount,
    })

    // Send error to monitoring service (if available)
    if (window.gtag) {
      window.gtag('event', 'exception', {
        description: error.toString(),
        fatal: true,
      })
    }

    this.setState({
      error: error,
      errorInfo: errorInfo,
    })
  }

  handleRetry = () => {
    this.setState((prevState) => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1,
    }))
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      const { error, errorInfo, retryCount, lastErrorTime } = this.state

      return (
        <div
          className="error-boundary"
          style={{
            padding: '2rem',
            textAlign: 'center',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '0.5rem',
            margin: '1rem',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚨</div>
          <h2 style={{ color: '#dc2626', marginBottom: '1rem' }}>
            Oops! Something went wrong
          </h2>
          <p
            style={{
              color: '#6b7280',
              marginBottom: '1.5rem',
              maxWidth: '500px',
              margin: '0 auto 1.5rem',
            }}
          >
            We're sorry, but something unexpected happened. This might be a
            temporary issue.
          </p>

          <div
            style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              marginBottom: '1rem',
            }}
          >
            <button
              onClick={this.handleRetry}
              className="btn btn-primary"
              style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                cursor: 'pointer',
              }}
            >
              🔄 Try Again
            </button>
            <button
              onClick={this.handleReload}
              className="btn btn-secondary"
              style={{
                backgroundColor: '#6b7280',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                cursor: 'pointer',
              }}
            >
              🔃 Refresh Page
            </button>
          </div>

          <div
            style={{
              fontSize: '0.875rem',
              color: '#9ca3af',
              marginBottom: '1rem',
            }}
          >
            Error #{retryCount + 1} •{' '}
            {lastErrorTime
              ? new Date(lastErrorTime).toLocaleString()
              : 'Unknown time'}
          </div>

          {process.env.NODE_ENV === 'development' && error && (
            <details
              style={{
                whiteSpace: 'pre-wrap',
                marginTop: '1rem',
                textAlign: 'left',
                backgroundColor: '#f9fafb',
                padding: '1rem',
                borderRadius: '0.375rem',
                border: '1px solid #e5e7eb',
              }}
            >
              <summary
                style={{
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  marginBottom: '0.5rem',
                }}
              >
                🔍 Error Details (Development Only)
              </summary>
              <div style={{ fontSize: '0.875rem' }}>
                <p>
                  <strong>Error:</strong> {error.toString()}
                </p>
                <p>
                  <strong>Stack:</strong>
                </p>
                <pre
                  style={{
                    backgroundColor: '#f3f4f6',
                    padding: '0.5rem',
                    borderRadius: '0.25rem',
                  }}
                >
                  {error.stack}
                </pre>
                <p>
                  <strong>Component Stack:</strong>
                </p>
                <pre
                  style={{
                    backgroundColor: '#f3f4f6',
                    padding: '0.5rem',
                    borderRadius: '0.25rem',
                  }}
                >
                  {errorInfo?.componentStack}
                </pre>
              </div>
            </details>
          )}
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
