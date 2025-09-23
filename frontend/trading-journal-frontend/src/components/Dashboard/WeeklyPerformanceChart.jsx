import React from 'react'

const WeeklyPerformanceChart = ({ trades, height = 200 }) => {
  // Get current week's trades
  const now = new Date()
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()))
  startOfWeek.setHours(0, 0, 0, 0)

  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(endOfWeek.getDate() + 6)
  endOfWeek.setHours(23, 59, 59, 999)

  const weeklyTrades = trades.filter((trade) => {
    const tradeDate = new Date(trade.created_at || trade.createdAt)
    return tradeDate >= startOfWeek && tradeDate <= endOfWeek
  })

  // Group trades by day
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const dailyData = days.map((day, index) => {
    const dayTrades = weeklyTrades.filter((trade) => {
      const tradeDate = new Date(trade.created_at || trade.createdAt)
      return tradeDate.getDay() === index
    })

    const dayPnL = dayTrades.reduce((sum, trade) => sum + (trade.pnl || 0), 0)
    const tradeCount = dayTrades.length

    return {
      day,
      pnl: dayPnL,
      trades: tradeCount,
      isToday: index === new Date().getDay(),
    }
  })

  // Calculate stats
  const totalWeeklyPnL = dailyData.reduce((sum, day) => sum + day.pnl, 0)
  const totalWeeklyTrades = dailyData.reduce((sum, day) => sum + day.trades, 0)
  const bestDay = dailyData.reduce(
    (best, day) => (day.pnl > best.pnl ? day : best),
    dailyData[0]
  )
  const worstDay = dailyData.reduce(
    (worst, day) => (day.pnl < worst.pnl ? day : worst),
    dailyData[0]
  )

  // Find min and max for scaling
  const minPnL = Math.min(0, ...dailyData.map((d) => d.pnl))
  const maxPnL = Math.max(0, ...dailyData.map((d) => d.pnl))
  const range = maxPnL - minPnL || 1

  // Debug logging
  console.log('Weekly Performance Chart Debug:', {
    weeklyTrades: weeklyTrades.length,
    dailyData,
    minPnL,
    maxPnL,
    range,
  })

  return (
    <div className="weekly-performance-chart" style={{ height }}>
      <div className="chart-header">
        <h3>This Week's Performance</h3>
        <div className="weekly-stats">
          <span
            className={`total-pnl ${
              totalWeeklyPnL >= 0 ? 'positive' : 'negative'
            }`}
          >
            ${totalWeeklyPnL.toFixed(2)}
          </span>
          <span className="total-trades">{totalWeeklyTrades} trades</span>
        </div>
      </div>

      <div className="chart-container">
        <div className="chart-bars">
          {dailyData.map((day, index) => {
            const maxBarHeight = 150
            const barHeight = Math.max(
              4,
              (Math.abs(day.pnl) / range) * maxBarHeight
            )
            const isPositive = day.pnl >= 0

            return (
              <div key={day.day} className="day-bar">
                <div
                  className={`bar ${isPositive ? 'positive' : 'negative'} ${
                    day.isToday ? 'today' : ''
                  }`}
                  style={{
                    height: `${barHeight}px`,
                    width: '32px',
                  }}
                  title={`${day.day}: $${day.pnl.toFixed(2)} (${
                    day.trades
                  } trades)`}
                />
                <div className="day-label">{day.day}</div>
                <div className="day-pnl">
                  {day.pnl !== 0 && (
                    <span
                      className={`pnl-value ${
                        isPositive ? 'positive' : 'negative'
                      }`}
                    >
                      ${day.pnl.toFixed(0)}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="chart-summary">
        <div className="summary-item">
          <span className="label">Best Day:</span>
          <span
            className={`value ${bestDay.pnl >= 0 ? 'positive' : 'negative'}`}
          >
            {bestDay.day} (${bestDay.pnl.toFixed(2)})
          </span>
        </div>
        <div className="summary-item">
          <span className="label">Worst Day:</span>
          <span
            className={`value ${worstDay.pnl >= 0 ? 'positive' : 'negative'}`}
          >
            {worstDay.day} (${worstDay.pnl.toFixed(2)})
          </span>
        </div>
      </div>
    </div>
  )
}

export default WeeklyPerformanceChart
