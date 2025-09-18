/**
 * Simple and Reliable Trade Data Generator
 * Generates realistic trade data with exact win rates
 */

// Trading symbols
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
  'USDCHF',
  'EURGBP',
]

// Trading strategies
const STRATEGIES = [
  'Scalping',
  'Day Trading',
  'Swing Trading',
  'Position Trading',
  'Breakout',
  'Reversal',
  'Trend Following',
  'Mean Reversion',
]

// Exit reasons
const EXIT_REASONS = [
  'Take Profit',
  'Stop Loss',
  'Manual Close',
  'Time-based',
  'Signal Reversal',
  'Risk Management',
  'News Event',
]

// Helper functions
const randomChoice = (array) => array[Math.floor(Math.random() * array.length)]
const randomBetween = (min, max) => Math.random() * (max - min) + min
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min

// Generate random date within last 90 days
const randomDate = (daysBack = 90) => {
  const now = new Date()
  const pastDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000)
  const randomTime =
    pastDate.getTime() + Math.random() * (now.getTime() - pastDate.getTime())
  return new Date(randomTime).toISOString()
}

// Generate realistic forex price
const generatePrice = (symbol) => {
  const basePrices = {
    EURUSD: 1.085,
    GBPUSD: 1.265,
    USDJPY: 149.5,
    AUDUSD: 0.655,
    USDCAD: 1.365,
    NZDUSD: 0.605,
    EURJPY: 162.5,
    GBPJPY: 189.5,
    AUDJPY: 98.0,
    CADJPY: 109.0,
    USDCHF: 0.875,
    EURGBP: 0.858,
  }

  const basePrice = basePrices[symbol] || 1.0
  const variation = randomBetween(-0.02, 0.02) // ±2% variation
  return Math.round(basePrice * (1 + variation) * 10000) / 10000
}

// Generate trade notes
const generateNotes = (pnl) => {
  const positiveNotes = [
    'Trade executed according to plan. Strong trend continuation confirmed.',
    'Excellent risk management. Target reached with good R:R ratio.',
    'Technical analysis proved accurate. Market moved as expected.',
    'Good entry timing. Price action confirmed the setup.',
    'Successful trade following established strategy rules.',
  ]

  const negativeNotes = [
    'Stop loss hit as expected. Risk management limited losses.',
    'Market moved against position. Technical setup failed.',
    'News event caused unexpected volatility. Cut losses quickly.',
    'Entry timing was off. Better to wait for confirmation.',
    'Position size was appropriate. Loss within risk parameters.',
  ]

  return pnl > 0 ? randomChoice(positiveNotes) : randomChoice(negativeNotes)
}

// Generate a single trade
const generateTrade = (index, isClosed = true) => {
  const symbol = randomChoice(SYMBOLS)
  const side = randomChoice(['buy', 'sell'])
  const quantity = randomInt(1, 10)
  const lotSize = randomInt(1, 3)
  const entryPrice = generatePrice(symbol)
  const entryTime = randomDate(90)

  let exitPrice = null
  let exitTime = null
  let pnl = null
  let exitReason = null

  if (isClosed) {
    exitTime = new Date(entryTime)
    exitTime.setTime(exitTime.getTime() + randomInt(1, 7) * 24 * 60 * 60 * 1000)
    exitTime = exitTime.toISOString()
    exitReason = randomChoice(EXIT_REASONS)
  }

  // Generate checklist data
  const checklistItems = {
    risk_management: randomInt(1, 2),
    entry_timing: randomInt(0, 2),
    market_analysis: randomInt(0, 2),
    position_sizing: randomInt(1, 2),
    exit_strategy: randomInt(0, 2),
    emotional_control: randomInt(0, 2),
    market_conditions: randomInt(0, 2),
    trade_plan: randomInt(1, 2),
  }

  const totalScore = Object.values(checklistItems).reduce(
    (sum, score) => sum + score,
    0
  )
  const maxScore = Object.keys(checklistItems).length * 2
  const checklistScore = Math.round((totalScore / maxScore) * 100)

  // Calculate stop loss and take profit
  const stopLossPercent = randomBetween(0.01, 0.03) // 1-3%
  const takeProfitPercent = randomBetween(0.02, 0.06) // 2-6%

  let stopLoss, takeProfit
  if (side === 'buy') {
    stopLoss = entryPrice * (1 - stopLossPercent)
    takeProfit = entryPrice * (1 + takeProfitPercent)
  } else {
    stopLoss = entryPrice * (1 + stopLossPercent)
    takeProfit = entryPrice * (1 - takeProfitPercent)
  }

  return {
    id: `trade_${index + 1}`,
    symbol,
    side,
    quantity,
    lot_size: lotSize,
    entry_price: Math.round(entryPrice * 10000) / 10000,
    exit_price: exitPrice ? Math.round(exitPrice * 10000) / 10000 : null,
    entry_time: entryTime,
    exit_time: exitTime,
    pnl,
    is_closed: isClosed,
    exit_reason: exitReason,
    strategy: randomChoice(STRATEGIES),
    notes: null, // Will be set after PnL is determined
    fees: Math.round(randomBetween(3, 12) * 100) / 100,
    take_profit: Math.round(takeProfit * 10000) / 10000,
    stop_loss: Math.round(stopLoss * 10000) / 10000,
    checklist_score: checklistScore,
    checklist_grade: null, // Will be set after PnL is determined
    checklist_items: checklistItems,
  }
}

// Generate winning trade
const generateWinningTrade = (baseTrade) => {
  // Generate profit percentage
  const profitPercent = randomBetween(0.02, 0.08) // 2-8% profit

  if (baseTrade.side === 'buy') {
    baseTrade.exit_price = baseTrade.entry_price * (1 + profitPercent)
  } else {
    baseTrade.exit_price = baseTrade.entry_price * (1 - profitPercent)
  }

  // Set positive PnL
  baseTrade.pnl = Math.round(randomBetween(50, 500) * 100) / 100

  // Generate notes and grade
  baseTrade.notes = generateNotes(baseTrade.pnl)
  baseTrade.checklist_grade =
    baseTrade.checklist_score >= 80
      ? 'A'
      : baseTrade.checklist_score >= 60
      ? 'B'
      : baseTrade.checklist_score >= 40
      ? 'C'
      : 'D'

  return baseTrade
}

// Generate losing trade
const generateLosingTrade = (baseTrade) => {
  // Generate loss percentage
  const lossPercent = randomBetween(0.01, 0.05) // 1-5% loss

  if (baseTrade.side === 'buy') {
    baseTrade.exit_price = baseTrade.entry_price * (1 - lossPercent)
  } else {
    baseTrade.exit_price = baseTrade.entry_price * (1 + lossPercent)
  }

  // Set negative PnL (ensure it's negative)
  const positiveValue = Math.round(randomBetween(50, 500) * 100) / 100
  baseTrade.pnl = -positiveValue

  // Generate notes and grade
  baseTrade.notes = generateNotes(baseTrade.pnl)
  baseTrade.checklist_grade =
    baseTrade.checklist_score >= 60
      ? 'B'
      : baseTrade.checklist_score >= 40
      ? 'C'
      : 'D'

  return baseTrade
}

// Main data generation function
export const generateTradeData = (options = {}) => {
  const { totalTrades = 50, closedTradesRatio = 0.85, winRate = 0.65 } = options

  const trades = []
  const closedTradesCount = Math.floor(totalTrades * closedTradesRatio)
  const winningTradesCount = Math.floor(closedTradesCount * winRate)
  const losingTradesCount = closedTradesCount - winningTradesCount

  // Create trade types array
  const tradeTypes = []
  for (let i = 0; i < winningTradesCount; i++) tradeTypes.push('win')
  for (let i = 0; i < losingTradesCount; i++) tradeTypes.push('loss')

  // Shuffle trade types
  for (let i = tradeTypes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[tradeTypes[i], tradeTypes[j]] = [tradeTypes[j], tradeTypes[i]]
  }

  // Generate closed trades
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

  // Sort by entry time (newest first)
  const sortedTrades = trades.sort(
    (a, b) => new Date(b.entry_time) - new Date(a.entry_time)
  )

  return sortedTrades
}

// Predefined scenarios
export const generateScenarios = {
  profitable: () =>
    generateTradeData({
      totalTrades: 100,
      closedTradesRatio: 0.9,
      winRate: 0.75,
    }),
  struggling: () =>
    generateTradeData({
      totalTrades: 80,
      closedTradesRatio: 0.85,
      winRate: 0.35,
    }),
  breakeven: () =>
    generateTradeData({
      totalTrades: 60,
      closedTradesRatio: 0.8,
      winRate: 0.5,
    }),
  newbie: () =>
    generateTradeData({
      totalTrades: 20,
      closedTradesRatio: 0.7,
      winRate: 0.4,
    }),
  experienced: () =>
    generateTradeData({
      totalTrades: 200,
      closedTradesRatio: 0.95,
      winRate: 0.65,
    }),
  custom: (totalTrades = 100, winRate = 0.6) =>
    generateTradeData({ totalTrades, closedTradesRatio: 0.85, winRate }),
}

export default generateTradeData
