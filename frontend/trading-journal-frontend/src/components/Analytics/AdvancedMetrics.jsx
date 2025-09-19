import React from 'react'
import { getClosedTrades } from '../../utils/tradeUtils'

const AdvancedMetrics = ({ trades = [] }) => {
  // Calculate advanced metrics
  const calculateAdvancedMetrics = (trades) => {
    if (!trades || trades.length === 0) {
      return {
        winRate: 0,
        profitFactor: 0,
        sharpeRatio: 0,
        maxDrawdown: 0,
        avgWin: 0,
        avgLoss: 0,
        winLossRatio: 0,
        expectancy: 0,
        totalTrades: 0,
        winningTrades: 0,
        losingTrades: 0,
        avgHoldingTime: 0,
        bestTrade: 0,
        worstTrade: 0,
        consecutiveWins: 0,
        consecutiveLosses: 0,
        recoveryFactor: 0,
        calmarRatio: 0,
      }
    }

    const closedTrades = getClosedTrades(trades)
    const totalTrades = closedTrades.length

    if (totalTrades === 0) {
      return {
        winRate: 0,
        profitFactor: 0,
        sharpeRatio: 0,
        maxDrawdown: 0,
        avgWin: 0,
        avgLoss: 0,
        winLossRatio: 0,
        expectancy: 0,
        totalTrades: 0,
        winningTrades: 0,
        losingTrades: 0,
        avgHoldingTime: 0,
        bestTrade: 0,
        worstTrade: 0,
        consecutiveWins: 0,
        consecutiveLosses: 0,
        recoveryFactor: 0,
        calmarRatio: 0,
      }
    }

    // Basic calculations
    const pnls = closedTrades.map((trade) => parseFloat(trade.pnl) || 0)
    const winningTrades = pnls.filter((pnl) => pnl > 0)
    const losingTrades = pnls.filter((pnl) => pnl < 0)

    // Calculate PnL metrics for advanced analytics

    const totalPnL = pnls.reduce((sum, pnl) => sum + pnl, 0)
    const totalWins = winningTrades.reduce((sum, pnl) => sum + pnl, 0)
    const totalLosses = Math.abs(
      losingTrades.reduce((sum, pnl) => sum + pnl, 0)
    )

    // Win Rate (as decimal for consistency)
    const winRate = totalTrades > 0 ? winningTrades.length / totalTrades : 0

    // Profit Factor
    const profitFactor = totalLosses > 0 ? totalWins / totalLosses : 0

    // Average Win/Loss
    const avgWin =
      winningTrades.length > 0 ? totalWins / winningTrades.length : 0
    const avgLoss =
      losingTrades.length > 0 ? totalLosses / losingTrades.length : 0

    // Win/Loss Ratio
    const winLossRatio = avgLoss > 0 ? avgWin / avgLoss : 0

    // Expectancy
    const expectancy = totalTrades > 0 ? totalPnL / totalTrades : 0

    // Best and Worst Trades
    const bestTrade = pnls.length > 0 ? Math.max(...pnls) : 0
    const worstTrade = pnls.length > 0 ? Math.min(...pnls) : 0

    // Max Drawdown - need to sort by date first
    let maxDrawdown = 0
    if (closedTrades.length > 0) {
      const sortedTrades = [...closedTrades].sort(
        (a, b) => new Date(a.exit_time) - new Date(b.exit_time)
      )
      let runningPnL = 0
      let peak = 0

      sortedTrades.forEach((trade) => {
        runningPnL += parseFloat(trade.pnl) || 0
        if (runningPnL > peak) {
          peak = runningPnL
        }
        const drawdown = peak - runningPnL
        if (drawdown > maxDrawdown) {
          maxDrawdown = drawdown
        }
      })
    }

    // Consecutive Wins/Losses - need to sort by date first
    let maxConsecutiveWins = 0
    let maxConsecutiveLosses = 0
    let currentWins = 0
    let currentLosses = 0

    if (closedTrades.length > 0) {
      const sortedTrades = [...closedTrades].sort(
        (a, b) => new Date(a.exit_time) - new Date(b.exit_time)
      )

      sortedTrades.forEach((trade) => {
        const pnl = parseFloat(trade.pnl) || 0
        if (pnl > 0) {
          currentWins++
          currentLosses = 0
          maxConsecutiveWins = Math.max(maxConsecutiveWins, currentWins)
        } else if (pnl < 0) {
          currentLosses++
          currentWins = 0
          maxConsecutiveLosses = Math.max(maxConsecutiveLosses, currentLosses)
        }
      })
    }

    // Average Holding Time (simplified - would need actual timestamps)
    const avgHoldingTime = 0 // Placeholder

    // Sharpe Ratio (simplified)
    const meanReturn = expectancy
    const variance =
      totalTrades > 1
        ? pnls.reduce((sum, pnl) => sum + Math.pow(pnl - meanReturn, 2), 0) /
          (totalTrades - 1)
        : 0
    const standardDeviation = Math.sqrt(variance)
    const sharpeRatio =
      standardDeviation > 0 ? meanReturn / standardDeviation : 0

    // Recovery Factor
    const recoveryFactor = maxDrawdown > 0 ? totalPnL / maxDrawdown : 0

    // Calmar Ratio (simplified)
    const calmarRatio = maxDrawdown > 0 ? totalPnL / maxDrawdown : 0

    return {
      winRate: winRate, // Keep as decimal for consistency
      profitFactor: Math.round(profitFactor * 100) / 100,
      sharpeRatio: Math.round(sharpeRatio * 100) / 100,
      maxDrawdown: Math.round(maxDrawdown * 100) / 100,
      avgWin: Math.round(avgWin * 100) / 100,
      avgLoss: Math.round(avgLoss * 100) / 100,
      winLossRatio: Math.round(winLossRatio * 100) / 100,
      expectancy: Math.round(expectancy * 100) / 100,
      totalTrades,
      winningTrades: winningTrades.length,
      losingTrades: losingTrades.length,
      avgHoldingTime,
      bestTrade: Math.round(bestTrade * 100) / 100,
      worstTrade: Math.round(worstTrade * 100) / 100,
      consecutiveWins: maxConsecutiveWins,
      consecutiveLosses: maxConsecutiveLosses,
      recoveryFactor: Math.round(recoveryFactor * 100) / 100,
      calmarRatio: Math.round(calmarRatio * 100) / 100,
    }
  }

  const metrics = calculateAdvancedMetrics(trades)

  // Advanced metrics calculation complete

  // Convert win rate to decimal if it's a string percentage
  const winRate =
    typeof metrics.winRate === 'string'
      ? parseFloat(metrics.winRate) / 100
      : metrics.winRate

  const metricCards = [
    {
      title: 'Win Rate',
      value: `${(winRate * 100).toFixed(1)}%`,
      description: 'Percentage of profitable trades',
      color: winRate >= 0.5 ? 'success' : winRate >= 0.4 ? 'warning' : 'danger',
    },
    {
      title: 'Profit Factor',
      value: metrics.profitFactor.toFixed(2),
      description: 'Gross profit / Gross loss',
      color:
        metrics.profitFactor >= 2
          ? 'success'
          : metrics.profitFactor >= 1.5
          ? 'warning'
          : 'danger',
    },
    {
      title: 'Sharpe Ratio',
      value: metrics.sharpeRatio.toFixed(2),
      description: 'Risk-adjusted returns',
      color:
        metrics.sharpeRatio >= 1
          ? 'success'
          : metrics.sharpeRatio >= 0.5
          ? 'warning'
          : 'danger',
    },
    {
      title: 'Max Drawdown',
      value: `$${metrics.maxDrawdown.toFixed(2)}`,
      description: 'Largest peak-to-trough decline',
      color: 'info',
    },
    {
      title: 'Win/Loss Ratio',
      value: metrics.winLossRatio.toFixed(2),
      description: 'Average win / Average loss',
      color:
        metrics.winLossRatio >= 1.5
          ? 'success'
          : metrics.winLossRatio >= 1
          ? 'warning'
          : 'danger',
    },
    {
      title: 'Expectancy',
      value: `$${metrics.expectancy.toFixed(2)}`,
      description: 'Average expected value per trade',
      color: metrics.expectancy >= 0 ? 'success' : 'danger',
    },
    {
      title: 'Recovery Factor',
      value: metrics.recoveryFactor.toFixed(2),
      description: 'Net profit / Max drawdown',
      color:
        metrics.recoveryFactor >= 2
          ? 'success'
          : metrics.recoveryFactor >= 1
          ? 'warning'
          : 'danger',
    },
    {
      title: 'Calmar Ratio',
      value: metrics.calmarRatio.toFixed(2),
      description: 'Annual return / Max drawdown',
      color:
        metrics.calmarRatio >= 1
          ? 'success'
          : metrics.calmarRatio >= 0.5
          ? 'warning'
          : 'danger',
    },
  ]

  const additionalStats = [
    { label: 'Total Trades', value: metrics.totalTrades },
    { label: 'Winning Trades', value: metrics.winningTrades },
    { label: 'Losing Trades', value: metrics.losingTrades },
    { label: 'Best Trade', value: `$${metrics.bestTrade.toFixed(2)}` },
    { label: 'Worst Trade', value: `$${metrics.worstTrade.toFixed(2)}` },
    { label: 'Max Consecutive Wins', value: metrics.consecutiveWins },
    { label: 'Max Consecutive Losses', value: metrics.consecutiveLosses },
  ]

  if (trades.length === 0) {
    return (
      <div className="advanced-metrics">
        <h3>Advanced Trading Metrics</h3>
        <div className="no-data-message">
          <p>No trades available for advanced metrics calculation.</p>
          <p>Add some trades to see detailed performance analytics.</p>
        </div>
      </div>
    )
  }

  if (getClosedTrades(trades).length === 0) {
    return (
      <div className="advanced-metrics">
        <h3>Advanced Trading Metrics</h3>
        <div className="no-data-message">
          <p>No closed trades available for advanced metrics calculation.</p>
          <p>Close some trades to see detailed performance analytics.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="advanced-metrics">
      <h3>Advanced Trading Metrics</h3>

      <div className="metrics-grid">
        {metricCards.map((metric, index) => (
          <div key={index} className={`metric-card ${metric.color}`}>
            <div className="metric-header">
              <h4>{metric.title}</h4>
              <span className="metric-value">{metric.value}</span>
            </div>
            <p className="metric-description">{metric.description}</p>
          </div>
        ))}
      </div>

      <div className="additional-stats">
        <h4>Additional Statistics</h4>
        <div className="stats-grid">
          {additionalStats.map((stat, index) => (
            <div key={index} className="stat-item">
              <span className="stat-label">{stat.label}</span>
              <span className="stat-value">{stat.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AdvancedMetrics
