/**
 * Trade utility functions for consistent trade status logic
 */

/**
 * Check if a trade is closed using consistent logic
 * @param {Object} trade - Trade object
 * @returns {boolean} - True if trade is closed
 */
export const isTradeClosed = (trade) => {
  // Use the backend computed field if available
  if (trade.is_closed !== undefined) {
    return trade.is_closed;
  }

  // Fallback to checking exit_price and exit_time are not null/undefined
  return trade.exit_price != null && trade.exit_time != null;
};

/**
 * Get closed trades from an array
 * @param {Array} trades - Array of trade objects
 * @returns {Array} - Array of closed trades
 */
export const getClosedTrades = (trades) => {
  return trades.filter(isTradeClosed);
};

/**
 * Get open trades from an array
 * @param {Array} trades - Array of trade objects
 * @returns {Array} - Array of open trades
 */
export const getOpenTrades = (trades) => {
  return trades.filter(trade => !isTradeClosed(trade));
};

/**
 * Count closed trades
 * @param {Array} trades - Array of trade objects
 * @returns {number} - Number of closed trades
 */
export const countClosedTrades = (trades) => {
  return getClosedTrades(trades).length;
};

/**
 * Count open trades
 * @param {Array} trades - Array of trade objects
 * @returns {number} - Number of open trades
 */
export const countOpenTrades = (trades) => {
  return getOpenTrades(trades).length;
};
