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
            <div className="trade-info-header">
              <h3>{tradeInfo.symbol}</h3>
              <span className={`trade-side ${tradeInfo.side}`}>
                {tradeInfo.side.toUpperCase()}
              </span>
            </div>
            <div className="trade-details">
              <div className="detail-item">
                <span className="label">Entry Price:</span>
                <span className="value">
                  ${parseFloat(tradeInfo.entry_price).toFixed(4)}
                </span>
              </div>
              <div className="detail-item">
                <span className="label">Entry Time:</span>
                <span className="value">
                  {new Date(tradeInfo.entry_time).toLocaleString()}
                </span>
              </div>
              {tradeInfo.exit_price && (
                <div className="detail-item">
                  <span className="label">Exit Price:</span>
                  <span className="value">
                    ${parseFloat(tradeInfo.exit_price).toFixed(4)}
                  </span>
                </div>
              )}
              {tradeInfo.pnl && (
                <div className="detail-item">
                  <span className="label">P&L:</span>
                  <span
                    className={`value ${
                      tradeInfo.pnl >= 0 ? 'positive' : 'negative'
                    }`}
                  >
                    ${parseFloat(tradeInfo.pnl).toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="notes-content">
            <h4>Trade Notes</h4>
            <div className="notes-text">
              {notes ? (
                <div className="notes-formatted">
                  {notes.split('\n').map((line, index) => (
                    <p key={index}>{line || '\u00A0'}</p>
                  ))}
                </div>
              ) : (
                <div className="no-notes">
                  <div className="no-notes-icon">📝</div>
                  <p>No notes available for this trade.</p>
                  <small>
                    Add notes when creating or editing trades to track your
                    strategy and market conditions.
                  </small>
                </div>
              )}
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
