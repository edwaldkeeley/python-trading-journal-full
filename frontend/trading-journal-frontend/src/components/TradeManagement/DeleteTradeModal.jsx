import React from 'react'
import useModalAnimation from '../../hooks/useModalAnimation'

const DeleteTradeModal = ({ isOpen, onClose, onConfirm, trade, isLoading }) => {
  const { isClosing, handleClose } = useModalAnimation(onClose)

  if (!isOpen || !trade) return null

  return (
    <div
      className={`modal-overlay ${isClosing ? 'closing' : ''}`}
      onClick={handleClose}
    >
      <div
        className={`modal ${isClosing ? 'closing' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>Delete Trade</h2>
          <button
            className="btn btn-icon btn-sm"
            onClick={handleClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="modal-body">
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
              <strong>Entry Price:</strong> ${Math.round(trade.entry_price)}
            </p>
            <p>
              <strong>Stop Loss:</strong> ${Math.round(trade.stop_loss)}
            </p>
            <p>
              <strong>Take Profit:</strong> ${Math.round(trade.take_profit)}
            </p>
            {trade.exit_price && (
              <p>
                <strong>Exit Price:</strong> ${Math.round(trade.exit_price)}
              </p>
            )}
            {trade.pnl !== null && (
              <p>
                <strong>P&L:</strong>{' '}
                <span className={trade.pnl >= 0 ? 'positive' : 'negative'}>
                  ${Math.round(trade.pnl)}
                </span>
              </p>
            )}
          </div>

          <div className="warning-message">
            <p>
              ⚠️ <strong>Warning:</strong> This action cannot be undone.
            </p>
            <p>Are you sure you want to delete this trade?</p>
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
