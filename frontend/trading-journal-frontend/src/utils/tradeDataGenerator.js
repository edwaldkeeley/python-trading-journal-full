/**
 * Trade Data Generator for Testing Advanced Metrics
 * Generates realistic trade data with various scenarios
 */

// Sample trading symbols
const SYMBOLS = [
  'EURUSD',
  'GBPUSD',
  'USDJPY',
  'AUDUSD',
  'USDCAD',
  'NZDUSD',
  'EURJPY',
  'GBPJPY',
  'AUDJPY',
  'CADJPY',
]

// Sample strategies
const STRATEGIES = [
  'Scalping',
  'Day Trading',
  'Swing Trading',
  'Position Trading',
  'Breakout',
  'Reversal',
  'Trend Following',
]

// Sample exit reasons
const EXIT_REASONS = [
  'Take Profit',
  'Stop Loss',
  'Manual Close',
  'Time-based',
  'Signal Reversal',
]

// Sample checklist grades
const GRADES = [
  'A+',
  'A',
  'A-',
  'B+',
  'B',
  'B-',
  'C+',
  'C',
  'C-',
  'D+',
  'D',
  'D-',
]

/**
 * Generate a random number between min and max
 */
const randomBetween = (min, max) => Math.random() * (max - min) + min

/**
 * Generate a random integer between min and max (inclusive)
 */
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min

/**
 * Generate a random element from an array
 */
const randomChoice = (array) => array[Math.floor(Math.random() * array.length)]

/**
 * Generate a random date within the last N days
 */
const randomDate = (daysAgo = 30) => {
  const now = new Date()
  const pastDate = new Date(
    now.getTime() - randomInt(1, daysAgo) * 24 * 60 * 60 * 1000
  )
  return pastDate.toISOString()
}

/**
 * Generate a random price for a given symbol
 */
const generatePrice = (symbol) => {
  const basePrices = {
    EURUSD: 1.1,
    GBPUSD: 1.25,
    USDJPY: 110.0,
    AUDUSD: 0.75,
    USDCAD: 1.35,
    NZDUSD: 0.7,
    EURJPY: 120.0,
    GBPJPY: 140.0,
    AUDJPY: 80.0,
    CADJPY: 85.0,
  }

  const basePrice = basePrices[symbol] || 1.0
  const variation = randomBetween(-0.05, 0.05) // ±5% variation
  return basePrice * (1 + variation)
}

/**
 * Generate a realistic PnL based on trade parameters
 */
const generatePnL = (side, entryPrice, exitPrice, quantity, lotSize = 1) => {
  const priceDifference =
    side === 'buy' ? exitPrice - entryPrice : entryPrice - exitPrice

  // Calculate gross PnL based on price movement (simplified calculation)
  const grossPnL = priceDifference * quantity * lotSize * 1000 // Scale for realistic forex values

  // Add realistic fees (spread + commission)
  const fees = Math.round(randomBetween(2, 8) * 100) / 100 // $2-$8 fees
  let pnl = grossPnL - fees

  // Only apply minimum PnL if the calculated PnL is very close to zero
  const minPnL = 2 // Minimum $2 PnL magnitude
  if (Math.abs(pnl) < minPnL && Math.abs(pnl) > 0.1) {
    const sign = pnl >= 0 ? 1 : -1
    pnl = sign * randomBetween(minPnL, minPnL * 2)
  }

  return Math.round(pnl * 100) / 100 // Round to 2 decimal places
}

/**
 * Generate a winning trade by setting appropriate exit price
 */
const generateWinningTrade = (baseTrade) => {
  const profitPercent = randomBetween(0.01, 0.05) // 1% to 5% profit

  if (baseTrade.side === 'buy') {
    baseTrade.exit_price = baseTrade.entry_price * (1 + profitPercent)
  } else {
    baseTrade.exit_price = baseTrade.entry_price * (1 - profitPercent)
  }

  baseTrade.pnl = generatePnL(
    baseTrade.side,
    baseTrade.entry_price,
    baseTrade.exit_price,
    baseTrade.quantity,
    baseTrade.lot_size
  )

  // Ensure PnL is positive for winning trades
  if (baseTrade.pnl <= 0) {
    baseTrade.pnl = randomBetween(10, 200) // Force positive PnL
  }

  // Set grade based on PnL and checklist score
  const checklistScore = baseTrade.checklist_score || 0
  if (baseTrade.pnl > 0 && checklistScore >= 80) {
    baseTrade.checklist_grade = randomChoice(['A+', 'A', 'A-'])
  } else if (baseTrade.pnl > 0 && checklistScore >= 60) {
    baseTrade.checklist_grade = randomChoice(['B+', 'B', 'B-'])
  } else if (baseTrade.pnl > 0 && checklistScore >= 40) {
    baseTrade.checklist_grade = randomChoice(['C+', 'C', 'C-'])
  } else {
    baseTrade.checklist_grade = randomChoice(['D+', 'D', 'D-'])
  }

  return baseTrade
}

/**
 * Generate a losing trade by setting appropriate exit price
 */
const generateLosingTrade = (baseTrade) => {
  const lossPercent = randomBetween(0.005, 0.03) // 0.5% to 3% loss

  if (baseTrade.side === 'buy') {
    baseTrade.exit_price = baseTrade.entry_price * (1 - lossPercent)
  } else {
    baseTrade.exit_price = baseTrade.entry_price * (1 + lossPercent)
  }

  baseTrade.pnl = generatePnL(
    baseTrade.side,
    baseTrade.entry_price,
    baseTrade.exit_price,
    baseTrade.quantity,
    baseTrade.lot_size
  )

  // Ensure PnL is negative for losing trades
  if (baseTrade.pnl >= 0) {
    baseTrade.pnl = randomBetween(-200, -10) // Force negative PnL
  }

  // Set grade based on PnL and checklist score
  const checklistScore = baseTrade.checklist_score || 0
  if (baseTrade.pnl < 0 && checklistScore >= 60) {
    baseTrade.checklist_grade = randomChoice(['B+', 'B', 'B-'])
  } else if (baseTrade.pnl < 0 && checklistScore >= 40) {
    baseTrade.checklist_grade = randomChoice(['C+', 'C', 'C-'])
  } else {
    baseTrade.checklist_grade = randomChoice(['D+', 'D', 'D-'])
  }

  return baseTrade
}

/**
 * Generate a single trade
 */
const generateTrade = (index, isClosed = true) => {
  const symbol = randomChoice(SYMBOLS)
  const side = randomChoice(['buy', 'sell'])
  const quantity = randomInt(1, 10)
  const lotSize = randomInt(1, 3)
  const entryPrice = generatePrice(symbol)
  const entryTime = randomDate(90) // Within last 90 days

  let exitPrice = null
  let exitTime = null
  let pnl = null
  let exitReason = null

  // Don't generate exit data here - let generateWinningTrade/generateLosingTrade handle it
  if (isClosed) {
    exitTime = new Date(entryTime)
    exitTime.setTime(exitTime.getTime() + randomInt(1, 7) * 24 * 60 * 60 * 1000) // 1-7 days later
    exitTime = exitTime.toISOString()
    exitReason = randomChoice(EXIT_REASONS)
    // exitPrice and pnl will be set by generateWinningTrade/generateLosingTrade
  }

  // Generate checklist data with more realistic scores
  const checklistItems = {
    risk_management: randomInt(1, 2), // Always at least 1 point
    entry_timing: randomInt(0, 2),
    market_analysis: randomInt(0, 2),
    position_sizing: randomInt(1, 2), // Always at least 1 point
    exit_strategy: randomInt(0, 2),
    emotional_control: randomInt(0, 2),
    market_conditions: randomInt(0, 2),
    trade_plan: randomInt(1, 2), // Always at least 1 point
  }

  const totalScore = Object.values(checklistItems).reduce(
    (sum, score) => sum + score,
    0
  )
  const maxScore = Object.keys(checklistItems).length * 2
  const percentage = Math.round((totalScore / maxScore) * 100)

  // Generate grade based on performance and checklist
  // Note: Grade will be set by generateWinningTrade/generateLosingTrade after pnl is determined
  let grade = null

  return {
    id: `generated_${index}`,
    symbol,
    side,
    quantity,
    lot_size: lotSize,
    entry_price: Math.round(entryPrice * 10000) / 10000, // Round to 4 decimal places
    exit_price: exitPrice ? Math.round(exitPrice * 10000) / 10000 : null,
    entry_time: entryTime,
    exit_time: exitTime,
    pnl,
    exit_reason: exitReason,
    strategy: randomChoice(STRATEGIES),
    notes: `Generated trade ${index}`,
    fees: Math.round(randomBetween(5, 25) * 100) / 100, // Random fees between $5-$25, rounded to 2 decimals
    take_profit:
      Math.round(entryPrice * (side === 'buy' ? 1.02 : 0.98) * 10000) / 10000,
    stop_loss:
      Math.round(entryPrice * (side === 'buy' ? 0.98 : 1.02) * 10000) / 10000,
    is_closed: isClosed,
    checklist_grade: grade,
    checklist_score: totalScore,
    checklist_max_score: maxScore,
    checklist_percentage: percentage,
    ...checklistItems,
  }
}

/**
 * Generate a set of trades with different scenarios
 */
export const generateTradeData = (options = {}) => {
  const {
    totalTrades = 50,
    closedTradesRatio = 0.85, // 85% closed trades
    winRate = 0.65, // 65% win rate (more realistic)
  } = options

  const trades = []
  const closedTradesCount = Math.floor(totalTrades * closedTradesRatio)
  const winningTradesCount = Math.floor(closedTradesCount * winRate)
  const losingTradesCount = closedTradesCount - winningTradesCount

  // Create arrays to ensure exact win rate
  const tradeTypes = []

  // Add winning trades
  for (let i = 0; i < winningTradesCount; i++) {
    tradeTypes.push('win')
  }

  // Add losing trades
  for (let i = 0; i < losingTradesCount; i++) {
    tradeTypes.push('loss')
  }

  // Shuffle the array to randomize order
  for (let i = tradeTypes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[tradeTypes[i], tradeTypes[j]] = [tradeTypes[j], tradeTypes[i]]
  }

  // Generate closed trades with exact win rate
  for (let i = 0; i < closedTradesCount; i++) {
    const tradeType = tradeTypes[i]
    let trade = generateTrade(i, true)

    if (tradeType === 'win') {
      trade = generateWinningTrade(trade)
    } else {
      trade = generateLosingTrade(trade)
    }

    trades.push(trade)
  }

  // Generate open trades
  for (let i = closedTradesCount; i < totalTrades; i++) {
    trades.push(generateTrade(i, false))
  }

  // Sort trades by entry time (newest first)
  const sortedTrades = trades.sort(
    (a, b) => new Date(b.entry_time) - new Date(a.entry_time)
  )

  // Debug logging (remove in production)
  const DEBUG = false // Set to true for debugging
  if (DEBUG) {
    const closedTrades = sortedTrades.filter(
      (trade) => trade.is_closed && trade.exit_price && trade.exit_time
    )
    const winningTrades = closedTrades.filter((trade) => trade.pnl > 0)
    const actualWinRate =
      closedTrades.length > 0
        ? (winningTrades.length / closedTrades.length) * 100
        : 0

    console.log('Data Generation Debug:', {
      totalTrades: sortedTrades.length,
      closedTrades: closedTrades.length,
      winningTrades: winningTrades.length,
      losingTrades: closedTrades.length - winningTrades.length,
      expectedWinRate: (winRate * 100).toFixed(1) + '%',
      actualWinRate: actualWinRate.toFixed(1) + '%',
      closedTradesRatio:
        ((closedTrades.length / sortedTrades.length) * 100).toFixed(1) + '%',
      tradeTypes: tradeTypes.slice(0, 10), // Show first 10 trade types
      closedTradesCount,
      winningTradesCount,
      losingTradesCount,
    })

    // Log some sample trades to see their PnL
    console.log(
      'Sample trades:',
      closedTrades.slice(0, 5).map((trade) => ({
        id: trade.id,
        pnl: trade.pnl,
        is_closed: trade.is_closed,
        exit_price: trade.exit_price,
      }))
    )
  }

  return sortedTrades
}

/**
 * Generate different trading scenarios
 */
export const generateScenarios = {
  // High-performing trader
  profitable: () =>
    generateTradeData({
      totalTrades: 100,
      closedTradesRatio: 0.9,
      winRate: 0.75,
      volatility: 'normal',
    }),

  // Struggling trader
  struggling: () =>
    generateTradeData({
      totalTrades: 80,
      closedTradesRatio: 0.85,
      winRate: 0.35,
      volatility: 'high',
    }),

  // Break-even trader
  breakeven: () =>
    generateTradeData({
      totalTrades: 60,
      closedTradesRatio: 0.8,
      winRate: 0.5,
      volatility: 'normal',
    }),

  // New trader (few trades)
  newbie: () =>
    generateTradeData({
      totalTrades: 20,
      closedTradesRatio: 0.7,
      winRate: 0.4,
      volatility: 'high',
    }),

  // Experienced trader (many trades)
  experienced: () =>
    generateTradeData({
      totalTrades: 200,
      closedTradesRatio: 0.95,
      winRate: 0.65,
      volatility: 'normal',
    }),

  // Custom scenario with better win rates
  custom: (totalTrades = 100, winRate = 0.6) =>
    generateTradeData({
      totalTrades,
      closedTradesRatio: 0.85,
      winRate,
      volatility: 'normal',
    }),
}

export default generateTradeData
