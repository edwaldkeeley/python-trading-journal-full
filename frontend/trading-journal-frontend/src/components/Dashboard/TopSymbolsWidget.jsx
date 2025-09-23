import React from 'react'
import SymbolChart from './SymbolChart'

const TopSymbolsWidget = ({ trades, limit = 3 }) => {
  // Get most traded symbols
  const symbolCounts = trades.reduce((acc, trade) => {
    const symbol = trade.symbol
    if (!acc[symbol]) {
      acc[symbol] = { count: 0, trades: [] }
    }
    acc[symbol].count++
    acc[symbol].trades.push(trade)
    return acc
  }, {})

  const topSymbols = Object.entries(symbolCounts)
    .sort(([, a], [, b]) => b.count - a.count)
    .slice(0, limit)
    .map(([symbol, data]) => ({ symbol, ...data }))

  if (topSymbols.length === 0) {
    return (
      <div className="dashboard-widget">
        <div className="widget-header">
          <h3>Top Symbols</h3>
          <span className="widget-subtitle">Most traded symbols</span>
        </div>
        <div className="widget-content">
          <div className="empty-state">
            <p>No trades yet</p>
            <small>Start trading to see your top symbols</small>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-widget">
      <div className="widget-header">
        <h3>Top Symbols</h3>
        <span className="widget-subtitle">Most traded symbols</span>
      </div>
      <div className="widget-content">
        <div className="symbols-grid">
          {topSymbols.map(({ symbol, trades: symbolTrades }) => (
            <SymbolChart key={symbol} symbol={symbol} trades={symbolTrades} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default TopSymbolsWidget
