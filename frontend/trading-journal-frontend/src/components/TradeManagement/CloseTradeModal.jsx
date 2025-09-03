import React, { useState } from 'react';

const CloseTradeModal = ({ isOpen, onClose, onSubmit, trade }) => {
  const [exitPrice, setExitPrice] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!exitPrice || exitPrice <= 0) {
      alert('Please enter a valid exit price');
      return;
    }

    try {
      await onSubmit({ tradeId: trade.id, exitPrice: parseFloat(exitPrice) });
      setExitPrice('');
      onClose();
    } catch (error) {
      console.error('Error closing trade:', error);
      alert('Failed to close trade. Please try again.');
    }
  };

  if (!isOpen || !trade) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>Close Trade</h2>
        <div className="trade-info">
          <p><strong>Symbol:</strong> {trade.symbol}</p>
          <p><strong>Side:</strong> {trade.side.toUpperCase()}</p>
          <p><strong>Quantity:</strong> {trade.quantity}</p>
          <p><strong>Entry Price:</strong> ${trade.entry_price}</p>
          <p><strong>Stop Loss:</strong> ${trade.stop_loss}</p>
          <p><strong>Take Profit:</strong> ${trade.take_profit}</p>
        </div>

        <div className="form-help">
          <small>
            💡 <strong>Smart Exit:</strong> If your exit price exceeds take profit or hits stop loss,
            it will automatically be adjusted to the respective level for optimal P&L calculation.
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
              step="0.01"
              placeholder="0.00"
              min="0"
              required
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit">Close Trade</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CloseTradeModal;
