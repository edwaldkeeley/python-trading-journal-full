import React, { useState } from 'react'

const TradeEraser = ({ isOpen, onClose, onConfirm, isLoading = false }) => {
  const [confirmText, setConfirmText] = useState('')
  const [isConfirmed, setIsConfirmed] = useState(false)

  const handleConfirm = () => {
    if (isConfirmed) {
      onConfirm()
      setConfirmText('')
      setIsConfirmed(false)
    }
  }

  const handleClose = () => {
    setConfirmText('')
    setIsConfirmed(false)
    onClose()
  }

  const handleTextChange = (e) => {
    const value = e.target.value
    setConfirmText(value)
    setIsConfirmed(value.toLowerCase() === 'delete all trades')
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div className="modal trade-eraser-modal">
        <div className="modal-header">
          <h2>⚠️ Clear All Trade History</h2>
          <button
            className="btn btn-icon btn-sm"
            onClick={handleClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="warning-section">
            <div className="warning-icon">⚠️</div>
            <h3>This action cannot be undone!</h3>
            <p>
              This will permanently delete <strong>ALL</strong> your trade
              history, including:
            </p>
            <ul className="warning-list">
              <li>All closed trades and their P&L data</li>
              <li>All open trades and their positions</li>
              <li>All analytics and performance metrics</li>
              <li>All trade notes and checklist data</li>
            </ul>
          </div>

          <div className="confirmation-section">
            <p>
              To confirm this action, type <strong>"delete all trades"</strong>{' '}
              in the box below:
            </p>
            <input
              type="text"
              className="confirmation-input"
              value={confirmText}
              onChange={handleTextChange}
              placeholder="Type: delete all trades"
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button
            className="btn btn-secondary"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className="btn btn-danger"
            onClick={handleConfirm}
            disabled={!isConfirmed || isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Clearing...
              </>
            ) : (
              '🗑️ Clear All Trades'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default TradeEraser
