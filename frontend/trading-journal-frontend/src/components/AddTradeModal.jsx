import React, { useState } from 'react';

const AddTradeModal = ({ isOpen, onClose, onSubmit, isLoading, error }) => {
  const [formData, setFormData] = useState({
    symbol: '',
    side: 'buy',
    quantity: '',
    lot_size: '1',
    entry_price: '',
    stop_loss: '',
    take_profit: '',
    notes: ''
  });

    const [checklistData, setChecklistData] = useState({
    asianSession: false,
    openLine: false,
    fibo62: false,
    averageLine: false,
    movingAverage3: false,
    movingAverage4: false
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleChecklistChange = (checklistItem) => {
    setChecklistData(prev => ({
      ...prev,
      [checklistItem]: !prev[checklistItem]
    }));
  };

  const calculateChecklistScore = () => {
    const totalChecks = Object.keys(checklistData).length;
    const checkedItems = Object.values(checklistData).filter(Boolean).length;
    return Math.round((checkedItems / totalChecks) * 100);
  };

  const getLetterGrade = () => {
    const score = calculateChecklistScore();

    // Check for instant A grade combinations
    const hasAsianSession = checklistData.asianSession;
    const hasMovingAverage = checklistData.movingAverage3 || checklistData.movingAverage4;
    const hasOpenOrFibo = checklistData.openLine || checklistData.fibo62;

    // Instant A if: Asian Session + (MA3 OR MA4) + (Open Line OR 62 Fibo)
    if (hasAsianSession && hasMovingAverage && hasOpenOrFibo) {
      return 'A';
    }

    // Regular scoring for other combinations
    if (score >= 100) return 'A+';
    if (score >= 85) return 'A';
    if (score >= 70) return 'B+';
    if (score >= 55) return 'B';
    if (score >= 40) return 'C+';
    if (score >= 25) return 'C';
    if (score >= 10) return 'D+';
    return 'D';
  };

  const getScoreClass = () => {
    const grade = getLetterGrade();
    if (grade.startsWith('A')) return 'excellent';
    if (grade.startsWith('B')) return 'good';
    if (grade.startsWith('C')) return 'fair';
    if (grade.startsWith('D')) return 'poor';
    return 'failing';
  };

  const getScoreMessage = () => {
    const grade = getLetterGrade();

    // Check if this is an instant A grade
    const hasAsianSession = checklistData.asianSession;
    const hasMovingAverage = checklistData.movingAverage3 || checklistData.movingAverage4;
    const hasOpenOrFibo = checklistData.openLine || checklistData.fibo62;
    const isInstantA = hasAsianSession && hasMovingAverage && hasOpenOrFibo;

    if (grade === 'A+') return '🔥 Master Trader! You nailed everything!';
    if (grade === 'A' && isInstantA) return '⚡ Lightning Strike! Perfect setup detected!';
    if (grade === 'A') return '🎖️ Trading Champion! Almost perfect!';
    if (grade === 'B+') return '💎 Diamond Hands! Strong setup!';
    if (grade === 'B') return '🚀 Rocket Fuel! Good momentum!';
    if (grade === 'C+') return '⭐ Rising Star! Building up!';
    if (grade === 'C') return '🌱 Green Shoots! Getting started!';
    if (grade === 'D+') return '🎯 Aim High! Pick your targets!';
    return '📈 Ready to Launch! Choose your strategy!';
  };

  const validateTradePosition = () => {
    const entryPrice = parseFloat(formData.entry_price);
    const stopLoss = parseFloat(formData.stop_loss);
    const takeProfit = parseFloat(formData.take_profit);
    const side = formData.side;

    // Check if values are valid numbers
    if (isNaN(entryPrice) || isNaN(stopLoss) || isNaN(takeProfit)) {
      return { isValid: false, error: 'All price values must be valid numbers' };
    }

    // Check if values are positive
    if (entryPrice <= 0 || stopLoss <= 0 || takeProfit <= 0) {
      return { isValid: false, error: 'All price values must be greater than zero' };
    }

    if (side === 'buy') {
      // For BUY trades (long positions):
      // - Take Profit should be ABOVE entry price (for profit)
      // - Stop Loss should be BELOW entry price (for loss protection)

      if (takeProfit <= entryPrice) {
        return {
          isValid: false,
          error: `For BUY trades, Take Profit (${takeProfit}) must be ABOVE Entry Price (${entryPrice}) to make a profit`
        };
      }

      if (stopLoss >= entryPrice) {
        return {
          isValid: false,
          error: `For BUY trades, Stop Loss (${stopLoss}) must be BELOW Entry Price (${entryPrice}) to limit losses`
        };
      }

      if (stopLoss >= takeProfit) {
        return {
          isValid: false,
          error: `For BUY trades, Stop Loss (${stopLoss}) must be BELOW Take Profit (${takeProfit})`
        };
      }

    } else if (side === 'sell') {
      // For SELL trades (short positions):
      // - Take Profit should be BELOW entry price (for profit)
      // - Stop Loss should be ABOVE entry price (for loss protection)

      if (takeProfit >= entryPrice) {
        return {
          isValid: false,
          error: `For SELL trades, Take Profit (${takeProfit}) must be BELOW Entry Price (${entryPrice}) to make a profit`
        };
      }

      if (stopLoss <= entryPrice) {
        return {
          isValid: false,
          error: `For SELL trades, Stop Loss (${stopLoss}) must be ABOVE Entry Price (${entryPrice}) to limit losses`
        };
      }

      if (stopLoss <= takeProfit) {
        return {
          isValid: false,
          error: `For SELL trades, Stop Loss (${stopLoss}) must be ABOVE Take Profit (${takeProfit})`
        };
      }
    }

    // Check for reasonable risk/reward ratios
    const risk = Math.abs(entryPrice - stopLoss);
    const reward = Math.abs(takeProfit - entryPrice);
    const riskRewardRatio = reward / risk;

    if (riskRewardRatio < 1.5) {
      return {
        isValid: false,
        error: `Risk/Reward ratio is too low (${riskRewardRatio.toFixed(2)}:1). Aim for at least 1.5:1 for better risk management`
      };
    }

    return { isValid: true, error: null };
  };

  const getRiskRewardRatio = () => {
    if (!formData.entry_price || !formData.stop_loss || !formData.take_profit) return 'N/A';

    const entryPrice = parseFloat(formData.entry_price);
    const stopLoss = parseFloat(formData.stop_loss);
    const takeProfit = parseFloat(formData.take_profit);

    if (isNaN(entryPrice) || isNaN(stopLoss) || isNaN(takeProfit)) return 'N/A';

    const risk = Math.abs(entryPrice - stopLoss);
    const reward = Math.abs(takeProfit - entryPrice);

    if (risk === 0) return 'N/A';

    return (reward / risk).toFixed(2) + ':1';
  };

  const getRiskRewardClass = () => {
    if (!formData.entry_price || !formData.stop_loss || !formData.take_profit) return '';

    const entryPrice = parseFloat(formData.entry_price);
    const stopLoss = parseFloat(formData.stop_loss);
    const takeProfit = parseFloat(formData.take_profit);

    if (isNaN(entryPrice) || isNaN(stopLoss) || isNaN(takeProfit)) return '';

    const risk = Math.abs(entryPrice - stopLoss);
    const reward = Math.abs(takeProfit - entryPrice);

    if (risk === 0) return '';

    const ratio = reward / risk;

    if (ratio >= 2.0) return 'excellent';
    if (ratio >= 1.5) return 'good';
    if (ratio >= 1.0) return 'fair';
    return 'poor';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.symbol || !formData.quantity || !formData.entry_price || !formData.stop_loss || !formData.take_profit) {
      alert('Please fill in all required fields including Stop Loss and Take Profit');
      return;
    }

    // Validate trade position logic
    const validation = validateTradePosition();
    if (!validation.isValid) {
      alert(`❌ Invalid Trade Position:\n\n${validation.error}\n\nPlease correct your Stop Loss and Take Profit levels.`);
      return;
    }

    try {
      // Include checklist data and grade in the trade submission
      const tradeData = {
        ...formData,
        checklist_grade: getLetterGrade(),
        checklist_score: calculateChecklistScore(),
        checklist_data: checklistData
      };

      await onSubmit(tradeData);

      // Reset form and checklist
      setFormData({
        symbol: '',
        side: 'buy',
        quantity: '',
        lot_size: '1',
        entry_price: '',
        stop_loss: '',
        take_profit: '',
        notes: ''
      });
      setChecklistData({
        asianSession: false,
        openLine: false,
        fibo62: false,
        averageLine: false,
        movingAverage3: false,
        movingAverage4: false
      });
      onClose();
    } catch (error) {
      // Error is handled by the mutation
      console.error('Error submitting trade:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>Add New Trade</h2>

        {error && (
          <div className="error-message">
            Error: {error.message}
          </div>
        )}

        <form className="trade-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="symbol">Symbol: *</label>
            <input
              id="symbol"
              type="text"
              name="symbol"
              value={formData.symbol}
              onChange={handleInputChange}
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
              onChange={handleInputChange}
              required
              disabled={isLoading}
            >
              <option value="buy">Buy</option>
              <option value="sell">Sell</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="quantity">Quantity: *</label>
            <input
              id="quantity"
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              placeholder="1"
              min="1"
              step="1"
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
              onChange={handleInputChange}
              placeholder="1"
              min="0.01"
              step="0.01"
              required
              disabled={isLoading}
            />
            <small className="form-help">
              Standard lot size (e.g., 100 for stocks, 1 for crypto, 0.1 for mini lots)
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="entry_price">Entry Price: *</label>
            <input
              id="entry_price"
              type="number"
              name="entry_price"
              value={formData.entry_price}
              onChange={handleInputChange}
              step="0.01"
              placeholder="0.00"
              min="0"
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="stop_loss">Stop Loss: *</label>
            <input
              id="stop_loss"
              type="number"
              name="stop_loss"
              value={formData.stop_loss}
              onChange={handleInputChange}
              step="0.01"
              placeholder="0.00"
              min="0"
              required
              disabled={isLoading}
            />
            <small className="form-help">
              {formData.side === 'buy'
                ? 'Must be BELOW Entry Price (e.g., if Entry is $100, Stop Loss should be $95)'
                : 'Must be ABOVE Entry Price (e.g., if Entry is $100, Stop Loss should be $105)'
              }
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="take_profit">Take Profit: *</label>
            <input
              id="take_profit"
              type="number"
              name="take_profit"
              value={formData.take_profit}
              onChange={handleInputChange}
              step="0.01"
              placeholder="0.00"
              min="0"
              required
              disabled={isLoading}
            />
            <small className="form-help">
              {formData.side === 'buy'
                ? 'Must be ABOVE Entry Price (e.g., if Entry is $100, Take Profit should be $105)'
                : 'Must be BELOW Entry Price (e.g., if Entry is $100, Take Profit should be $95)'
              }
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="notes">Trade Notes:</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Enter your trade rationale, market analysis, entry strategy, risk management plan, and any other relevant details..."
              rows="4"
              disabled={isLoading}
            />
            <small className="form-help">
              Include: Entry reasoning, market conditions, risk management, exit strategy, lessons learned
            </small>
            <small className="form-help">
              <strong>Note:</strong> Stop Loss and Take Profit are required for proper risk management
            </small>
          </div>

          {/* Risk/Reward Ratio Display */}
          {formData.entry_price && formData.stop_loss && formData.take_profit && (
            <div className="risk-reward-display">
              <h4>Risk Management Summary</h4>
              <div className="risk-reward-grid">
                <div className="risk-reward-item">
                  <span className="label">Risk:</span>
                  <span className="value">
                    ${Math.abs(parseFloat(formData.entry_price) - parseFloat(formData.stop_loss)).toFixed(2)}
                  </span>
                </div>
                <div className="risk-reward-item">
                  <span className="label">Reward:</span>
                  <span className="value">
                    ${Math.abs(parseFloat(formData.take_profit) - parseFloat(formData.entry_price)).toFixed(2)}
                  </span>
                </div>
                <div className="risk-reward-item">
                  <span className="label">Risk/Reward:</span>
                  <span className={`value ${getRiskRewardClass()}`}>
                    {getRiskRewardRatio()}
                  </span>
                </div>
              </div>
              {getRiskRewardClass() === 'poor' && (
                <div className="warning-message">
                  ⚠️ Risk/Reward ratio is below 1.5:1. Consider adjusting your levels for better risk management.
                </div>
              )}
            </div>
          )}

                    {/* Trading Checklist */}
          <div className="trading-checklist">
            <h4>🎯 Checklist</h4>
            <div className="checklist-score">
              <span className="score-label">Trade Quality Grade:</span>
              <span className={`score-value ${getScoreClass()}`}>
                {getLetterGrade()}
              </span>
              <div className="score-message">{getScoreMessage()}</div>
            </div>

            <div className="checklist-section">
              <h5>⏰ Market Timing</h5>
              <div className="checklist-items">
                <label className="checklist-item">
                  <input
                    type="checkbox"
                    checked={checklistData.asianSession}
                    onChange={() => handleChecklistChange('asianSession')}
                  />
                  <span>Asian Session (2:00-11:00 GMT)</span>
                </label>
              </div>
            </div>

            <div className="checklist-section">
              <h5>📊 Technical Analysis</h5>
              <div className="checklist-items">
                <label className="checklist-item">
                  <input
                    type="checkbox"
                    checked={checklistData.openLine}
                    onChange={() => handleChecklistChange('openLine')}
                  />
                  <span>Open Line</span>
                </label>
                <label className="checklist-item">
                  <input
                    type="checkbox"
                    checked={checklistData.fibo62}
                    onChange={() => handleChecklistChange('fibo62')}
                  />
                  <span>62 Fibo</span>
                </label>
                <label className="checklist-item">
                  <input
                    type="checkbox"
                    checked={checklistData.averageLine}
                    onChange={() => handleChecklistChange('averageLine')}
                  />
                  <span>Average Line</span>
                </label>
                <label className="checklist-item">
                  <input
                    type="checkbox"
                    checked={checklistData.movingAverage3}
                    onChange={() => handleChecklistChange('movingAverage3')}
                  />
                  <span>Moving Average 3</span>
                </label>
                <label className="checklist-item">
                  <input
                    type="checkbox"
                    checked={checklistData.movingAverage4}
                    onChange={() => handleChecklistChange('movingAverage4')}
                  />
                  <span>Moving Average 4</span>
                </label>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} disabled={isLoading}>
              Cancel
            </button>
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Adding...' : 'Add Trade'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTradeModal;
