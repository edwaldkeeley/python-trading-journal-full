import React from 'react'

const Error = ({ error, onRetry, title = 'Something went wrong' }) => {
  return (
    <div className="app">
      <div className="error-container">
        <div className="error-content">
          <div className="error-icon">⚠️</div>
          <h1 className="error-title">{title}</h1>
          <p className="error-message">
            {error ||
              'An unexpected error occurred while loading your trading journal.'}
          </p>
          <div className="error-actions">
            <button className="btn btn-primary" onClick={onRetry}>
              <span className="btn-icon">🔄</span>
              Try Again
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => window.location.reload()}
            >
              <span className="btn-icon">🔄</span>
              Refresh Page
            </button>
          </div>
          <div className="error-help">
            <p>If the problem persists, please:</p>
            <ul>
              <li>Check your internet connection</li>
              <li>Try refreshing the page</li>
              <li>Clear your browser cache</li>
              <li>Contact support if the issue continues</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Error
