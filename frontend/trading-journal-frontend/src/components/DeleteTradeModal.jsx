import React from 'react';

const DeleteTradeModal = ({ isOpen, onClose, onConfirm, trade, isLoading }) => {
  if (!isOpen || !trade) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>Delete Trade</h2>

        <div className="trade-info">
          <p><strong>Symbol:</strong> {trade.symbol}</p>
          <p><strong>Side:</strong> {trade.side.toUpperCase()}</p>
          <p><strong>Quantity:</strong> {trade.quantity}</p>
          <p><strong>Entry Price:</strong> ${trade.entry_price}</p>
          <p><strong>Stop Loss:</strong> ${trade.stop_loss}</p>
          <p><strong>Take Profit:</strong> ${trade.take_profit}</p>
          {trade.exit_price && (
            <p><strong>Exit Price:</strong> ${trade.exit_price}</p>
          )}
          {trade.pnl !== null && (
            <p><strong>P&L:</strong> <span className={trade.pnl >= 0 ? 'positive' : 'negative'}>${trade.pnl.toFixed(2)}</span></p>
          )}
        </div>

        <div className="warning-message">
          <p>⚠️ <strong>Warning:</strong> This action cannot be undone.</p>
          <p>Are you sure you want to delete this trade?</p>
        </div>

        <div className="form-actions">
          <button type="button" onClick={onClose} disabled={isLoading}>
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="delete-confirm-btn"
          >
            {isLoading ? 'Deleting...' : 'Delete Trade'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteTradeModal;
