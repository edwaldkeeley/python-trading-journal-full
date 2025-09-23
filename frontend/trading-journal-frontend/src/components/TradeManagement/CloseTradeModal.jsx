import React, { useState, useEffect, useRef } from 'react'
import useModalAnimation from '../../hooks/useModalAnimation'
import { useScrollToModalError } from '../../hooks/useScrollToTop'

const CloseTradeModal = ({ isOpen, onClose, onSubmit, trade }) => {
  const { isClosing, handleClose } = useModalAnimation(onClose)
  const [exitPrice, setExitPrice] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
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

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Clear previous errors
    setError('')

    if (!exitPrice || exitPrice <= 0) {
      setError('Please enter a valid exit price')
      return
    }

    const price = parseFloat(exitPrice)
    if (isNaN(price)) {
      setError('Please enter a valid number for exit price')
      return
    }

    setIsLoading(true)
    try {
      await onSubmit({ tradeId: trade.id, exitPrice: price })
      setExitPrice('')
      setError('')
      onClose()
    } catch (error) {
      setError(error.message || 'Failed to close trade. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen || !trade) return null

  return (
    <div
      className={`modal-overlay ${isClosing ? 'closing' : ''}`}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="close-trade-title"
    >
      <div
        className={`modal ${isClosing ? 'closing' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 id="close-trade-title">Close Trade</h2>
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
          </div>

          <div className="form-help">
            <small>
              💡 <strong>Smart Exit:</strong> If your exit price exceeds take
              profit or hits stop loss, it will automatically be adjusted to the
              respective level for optimal P&L calculation.
            </small>
          </div>

          <form className="trade-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="exit-price">Exit Price: *</label>
              <input
                id="exit-price"
                type="number"
                name="exit_price"
                value={exitPrice}
                onChange={(e) => setExitPrice(e.target.value)}
                step="0.0001"
                placeholder="1.0850"
                min="0"
                required
              />
            </div>
          </form>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? 'Closing...' : 'Close Trade'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CloseTradeModal
