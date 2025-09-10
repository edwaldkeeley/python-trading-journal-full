import React from 'react'

const NotesModal = ({ isOpen, onClose, notes, tradeInfo }) => {
  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal notes-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Trade Notes</h3>
          <button className="modal-close" onClick={onClose}>
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
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotesModal
