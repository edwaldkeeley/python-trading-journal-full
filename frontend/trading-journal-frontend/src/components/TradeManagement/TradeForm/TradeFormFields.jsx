import React from 'react'
import { TRADE_CONFIG } from '../../../constants/config'

const TradeFormFields = ({ formData, onInputChange, isLoading }) => {
  return (
    <>
      <div className="form-group">
        <label htmlFor="symbol">Symbol: *</label>
        <input
          id="symbol"
          type="text"
          name="symbol"
          value={formData.symbol}
          onChange={onInputChange}
          placeholder="e.g., AAPL"
          required
          disabled={isLoading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="side">Side: *</label>
        <select
          id="side"
          name="side"
          value={formData.side}
          onChange={onInputChange}
          required
          disabled={isLoading}
        >
          <option value="buy">Buy (Long)</option>
          <option value="sell">Sell (Short)</option>
        </select>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="quantity">Quantity: *</label>
          <input
            id="quantity"
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={onInputChange}
            placeholder="100"
            min="0.01"
            step="0.01"
            required
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="lot_size">Lot Size: *</label>
          <input
            id="lot_size"
            type="number"
            name="lot_size"
            value={formData.lot_size}
            onChange={onInputChange}
            placeholder={TRADE_CONFIG.LOT_SIZE.DEFAULT.toString()}
            min={TRADE_CONFIG.LOT_SIZE.MIN}
            max={TRADE_CONFIG.LOT_SIZE.MAX}
            step={TRADE_CONFIG.LOT_SIZE.STEP}
            required
            disabled={isLoading}
          />
          <small className="help-text">
            Lot size multiplier ({TRADE_CONFIG.LOT_SIZE.MIN} -{' '}
            {TRADE_CONFIG.LOT_SIZE.MAX}). Standard lot = 1, Mini lot = 0.1
          </small>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="entry_price">Entry Price: *</label>
        <input
          id="entry_price"
          type="number"
          name="entry_price"
          value={formData.entry_price}
          onChange={onInputChange}
          placeholder="1.0850"
          min="0.0001"
          step="0.0001"
          required
          disabled={isLoading}
        />
        <small className="help-text">
          {formData.side === 'buy'
            ? 'For BUY trades: Take Profit should be ABOVE this price, Stop Loss should be BELOW'
            : 'For SELL trades: Take Profit should be BELOW this price, Stop Loss should be ABOVE'}
        </small>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="stop_loss">Stop Loss: *</label>
          <input
            id="stop_loss"
            type="number"
            name="stop_loss"
            value={formData.stop_loss}
            onChange={onInputChange}
            placeholder={formData.side === 'buy' ? '1.0800' : '1.0900'}
            min="0.0001"
            step="0.0001"
            required
            disabled={isLoading}
          />
          <small className="help-text">
            {formData.side === 'buy'
              ? 'Must be BELOW entry price to limit losses'
              : 'Must be ABOVE entry price to limit losses'}
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="take_profit">Take Profit: *</label>
          <input
            id="take_profit"
            type="number"
            name="take_profit"
            value={formData.take_profit}
            onChange={onInputChange}
            placeholder={formData.side === 'buy' ? '1.0900' : '1.0800'}
            min="0.0001"
            step="0.0001"
            required
            disabled={isLoading}
          />
          <small className="help-text">
            {formData.side === 'buy'
              ? 'Must be ABOVE entry price to make profit'
              : 'Must be BELOW entry price to make profit'}
          </small>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="notes">Notes:</label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={onInputChange}
          placeholder="Trade notes, strategy, market conditions..."
          rows="3"
          disabled={isLoading}
        />
      </div>
    </>
  )
}

export default TradeFormFields
