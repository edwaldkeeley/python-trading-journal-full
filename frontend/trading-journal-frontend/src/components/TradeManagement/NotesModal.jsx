import React from 'react'
import useModalAnimation from '../../hooks/useModalAnimation'

const NotesModal = ({ isOpen, onClose, notes, tradeInfo }) => {
  const { isClosing, handleClose } = useModalAnimation(onClose)

  if (!isOpen) return null

  return (
    <div
      className={`modal-overlay ${isClosing ? 'closing' : ''}`}
      onClick={handleClose}
    >
      <div
        className={`modal notes-modal ${isClosing ? 'closing' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>Trade Notes</h2>
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
              <strong>Symbol:</strong> {tradeInfo.symbol}
            </p>
            <p>
              <strong>Side:</strong> {tradeInfo.side.toUpperCase()}
            </p>
            <p>
              <strong>Entry Price:</strong> ${Math.round(tradeInfo.entry_price)}
            </p>
            <p>
              <strong>Entry Time:</strong>{' '}
              {new Date(tradeInfo.entry_time).toLocaleString()}
            </p>
          </div>

          <div className="notes-content">
            <h4>Notes:</h4>
            <div className="notes-text">
              {notes || 'No notes available for this trade.'}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={handleClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotesModal
