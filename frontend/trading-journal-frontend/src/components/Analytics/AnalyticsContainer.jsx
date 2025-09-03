import React from 'react';
import { getClosedTrades, getOpenTrades } from '../../utils/tradeUtils';
import PerformanceMetrics from './PerformanceMetrics';
import MonthlyPnLChart from './MonthlyPnLChart';
import TradeDistribution from './TradeDistribution';
import GradeDistribution from './GradeDistribution';

const AnalyticsContainer = ({ trades }) => {
  // Calculate analytics data
  const calculateAnalytics = () => {
    if (!trades || trades.length === 0) return null;

    const closedTrades = getClosedTrades(trades);
    const openTrades = getOpenTrades(trades);

    // Monthly P&L data
    const monthlyPnL = {};
    closedTrades.forEach(trade => {
      const month = new Date(trade.exit_time).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
      monthlyPnL[month] = (monthlyPnL[month] || 0) + (trade.pnl || 0);
    });

    // Win/Loss analysis
    const winningTrades = closedTrades.filter(trade => trade.pnl > 0);
    const losingTrades = closedTrades.filter(trade => trade.pnl < 0);
    const winRate = closedTrades.length > 0 ? (winningTrades.length / closedTrades.length * 100).toFixed(1) : 0;

    // Average P&L
    const avgWin = winningTrades.length > 0 ? winningTrades.reduce((sum, t) => sum + t.pnl, 0) / winningTrades.length : 0;
    const avgLoss = losingTrades.length > 0 ? losingTrades.reduce((sum, t) => sum + t.pnl, 0) / losingTrades.length : 0;

    // Risk metrics
    const totalPnL = closedTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);

    // Calculate true max drawdown (peak-to-trough)
    let maxDrawdown = 0;
    if (closedTrades.length > 0) {
      const sortedTrades = [...closedTrades].sort((a, b) => new Date(a.exit_time) - new Date(b.exit_time));
      let runningBalance = 0;
      let peak = 0;
      let maxDrawdownValue = 0;

      sortedTrades.forEach(trade => {
        runningBalance += (trade.pnl || 0);
        if (runningBalance > peak) {
          peak = runningBalance;
        }
        const drawdown = peak - runningBalance;
        if (drawdown > maxDrawdownValue) {
          maxDrawdownValue = drawdown;
        }
      });
      maxDrawdown = maxDrawdownValue;
    }

    // Grade distribution
    const gradeDistribution = {};
    trades.forEach(trade => {
      const grade = trade.checklist_grade || 'No Grade';
      gradeDistribution[grade] = (gradeDistribution[grade] || 0) + 1;
    });

    // Calculate grade statistics
    const totalGradedTrades = trades.filter(t => t.checklist_grade).length;
    const aGrades = trades.filter(t => t.checklist_grade && t.checklist_grade.startsWith('A')).length;
    const bGrades = trades.filter(t => t.checklist_grade && t.checklist_grade.startsWith('B')).length;
    const cGrades = trades.filter(t => t.checklist_grade && t.checklist_grade.startsWith('C')).length;
    const dGrades = trades.filter(t => t.checklist_grade && t.checklist_grade.startsWith('D')).length;
    const noGrades = trades.filter(t => !t.checklist_grade).length;

    return {
      monthlyPnL,
      winRate,
      avgWin,
      avgLoss,
      totalPnL,
      maxDrawdown,
      totalTrades: trades.length,
      closedTrades: closedTrades.length,
      openTrades: openTrades.length,
      gradeDistribution,
      totalGradedTrades,
      aGrades,
      bGrades,
      cGrades,
      dGrades,
      noGrades
    };
  };

  const analytics = calculateAnalytics();

  if (!analytics) {
    return (
      <div className="analytics-section">
        <h2>Analytics</h2>
        <p>No trades available for analysis.</p>
      </div>
    );
  }

  return (
    <div className="analytics-section">
      <h2>Analytics & Performance</h2>
      <div className="analytics-grid">
        <PerformanceMetrics analytics={analytics} />
        <MonthlyPnLChart monthlyPnL={analytics.monthlyPnL} />
        <TradeDistribution
          closedTrades={analytics.closedTrades}
          openTrades={analytics.openTrades}
          totalTrades={analytics.totalTrades}
        />
        <GradeDistribution analytics={analytics} />
      </div>
    </div>
  );
};

export default AnalyticsContainer;
