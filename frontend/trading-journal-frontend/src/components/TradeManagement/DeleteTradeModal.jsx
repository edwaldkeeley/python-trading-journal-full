import React, { useEffect, useRef } from 'react'
import useModalAnimation from '../../hooks/useModalAnimation'
import { useScrollToModalError } from '../../hooks/useScrollToTop'

const DeleteTradeModal = ({
  isOpen,
  onClose,
  onConfirm,
  trade,
  isLoading,
  error,
}) => {
  const { isClosing, handleClose } = useModalAnimation(onClose)
  const errorRef = useRef(null)

  // Scroll to modal top when there's an error
  useScrollToModalError(!!error, '.modal')

  // Focus on error message when it appears
  useEffect(() => {
    if (error && errorRef.current) {
      // Small delay to ensure the error message is rendered
      setTimeout(() => {
        errorRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest',
        })
      }, 100)
    }
  }, [error])

  if (!isOpen || !trade) return null

  return (
    <div
      className={`modal-overlay ${isClosing ? 'closing' : ''}`}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-trade-title"
    >
      <div
        className={`modal ${isClosing ? 'closing' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 id="delete-trade-title">Delete Trade</h2>
          <button
            className="btn btn-icon btn-sm"
            onClick={handleClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="modal-body">
          {error && (
            <div ref={errorRef} className="error-message">
              {error}
            </div>
          )}

          <div className="trade-info">
            <p>
              <strong>Symbol:</strong> {trade.symbol}
            </p>
            <p>
              <strong>Side:</strong> {trade.side.toUpperCase()}
            </p>
            <p>
              <strong>Quantity:</strong> {trade.quantity}
            </p>
            <p>
              <strong>Entry Price:</strong> $
              {parseFloat(trade.entry_price).toFixed(4)}
            </p>
            <p>
              <strong>Stop Loss:</strong> $
              {parseFloat(trade.stop_loss).toFixed(4)}
            </p>
            <p>
              <strong>Take Profit:</strong> $
              {parseFloat(trade.take_profit).toFixed(4)}
            </p>
            {trade.exit_price && (
              <p>
                <strong>Exit Price:</strong> $
                {parseFloat(trade.exit_price).toFixed(4)}
              </p>
            )}
            {trade.pnl !== null && (
              <p>
                <strong>P&L:</strong>{' '}
                <span className={trade.pnl >= 0 ? 'positive' : 'negative'}>
                  ${parseFloat(trade.pnl).toFixed(2)}
                </span>
              </p>
            )}
          </div>

          <div className="warning-message">
            <p>
              ⚠️ <strong>Warning:</strong> This action cannot be undone.
            </p>
            <p>
              You are about to permanently delete this trade from your journal.
              All associated data including P&L, checklist scores, and notes
              will be lost.
            </p>
            <p>
              <strong>Are you sure you want to proceed?</strong>
            </p>
          </div>
        </div>

        <div className="modal-footer">
          <button
            className="btn btn-secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className="btn btn-danger"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Deleting...' : 'Delete Trade'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteTradeModal
