import React from 'react'

const SymbolChart = ({ symbol, trades, height = 120 }) => {
  // Filter trades for this symbol
  const symbolTrades = trades.filter((trade) => trade.symbol === symbol)

  if (symbolTrades.length === 0) {
    return (
      <div className="symbol-chart">
        <div className="chart-header">
          <span className="symbol-name">{symbol}</span>
          <span className="trade-count">No trades</span>
        </div>
        <div className="chart-placeholder">
          <p>No data available</p>
        </div>
      </div>
    )
  }

  // Calculate performance data
  const sortedTrades = symbolTrades.sort(
    (a, b) =>
      new Date(a.created_at || a.createdAt) -
      new Date(b.created_at || b.createdAt)
  )
  const totalPnL = symbolTrades.reduce(
    (sum, trade) => sum + (trade.pnl || 0),
    0
  )
  const winRate =
    symbolTrades.filter((trade) => (trade.pnl || 0) > 0).length /
    symbolTrades.length
  const avgPnL = totalPnL / symbolTrades.length

  // Create simple line chart data
  const chartData = []
  let cumulativePnL = 0

  sortedTrades.forEach((trade, index) => {
    cumulativePnL += trade.pnl || 0
    chartData.push({
      x: index,
      y: cumulativePnL,
      trade: trade,
    })
  })

  // Find min and max for scaling
  const minY = Math.min(0, ...chartData.map((d) => d.y))
  const maxY = Math.max(0, ...chartData.map((d) => d.y))
  const range = maxY - minY || 1

  // Generate SVG path with proper scaling
  const svgHeight = 100
  const svgWidth = 300
  const padding = 15

  const points = chartData
    .map((point, index) => {
      const x =
        padding + (index / (chartData.length - 1)) * (svgWidth - 2 * padding)
      const y = padding + ((point.y - minY) / range) * (svgHeight - 2 * padding)
      return `${x},${y}`
    })
    .join(' L')

  const pathData = `M ${points}`

  return (
    <div className="symbol-chart">
      <div className="chart-header">
        <span className="symbol-name">{symbol}</span>
        <span className="trade-count">{symbolTrades.length} trades</span>
      </div>

      <div className="chart-stats">
        <div className="stat">
          <span className="stat-label">P&L</span>
          <span
            className={`stat-value ${totalPnL >= 0 ? 'positive' : 'negative'}`}
          >
            ${totalPnL.toFixed(2)}
          </span>
        </div>
        <div className="stat">
          <span className="stat-label">Win Rate</span>
          <span className="stat-value">{(winRate * 100).toFixed(0)}%</span>
        </div>
        <div className="stat">
          <span className="stat-label">Avg</span>
          <span
            className={`stat-value ${avgPnL >= 0 ? 'positive' : 'negative'}`}
          >
            ${avgPnL.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="chart-container">
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Grid lines */}
          <line
            x1={padding}
            y1={svgHeight - padding}
            x2={svgWidth - padding}
            y2={svgHeight - padding}
            stroke="var(--border-color)"
            strokeWidth="0.5"
            opacity="0.3"
          />
          <line
            x1={padding}
            y1={padding}
            x2={svgWidth - padding}
            y2={padding}
            stroke="var(--border-color)"
            strokeWidth="0.5"
            opacity="0.3"
          />

          {/* Zero line */}
          <line
            x1={padding}
            y1={padding + ((0 - minY) / range) * (svgHeight - 2 * padding)}
            x2={svgWidth - padding}
            y2={padding + ((0 - minY) / range) * (svgHeight - 2 * padding)}
            stroke="var(--text-muted)"
            strokeWidth="0.5"
            opacity="0.5"
          />

          {/* Chart line */}
          <path
            d={pathData}
            fill="none"
            stroke={totalPnL >= 0 ? '#27ae60' : '#e74c3c'}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {chartData.map((point, index) => (
            <circle
              key={index}
              cx={
                padding +
                (index / (chartData.length - 1)) * (svgWidth - 2 * padding)
              }
              cy={
                padding + ((point.y - minY) / range) * (svgHeight - 2 * padding)
              }
              r="3"
              fill={point.y >= 0 ? '#27ae60' : '#e74c3c'}
              opacity="0.8"
            />
          ))}
        </svg>
      </div>
    </div>
  )
}

export default SymbolChart
