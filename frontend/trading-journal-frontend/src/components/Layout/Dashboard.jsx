import React, { useState } from 'react';
import { useTrades, useAddTrade, useDeleteTrade, useCloseTrade } from '../../hooks/useTrades';
import { countOpenTrades, getClosedTrades } from '../../utils/tradeUtils';
import Header from './Header';
import SummaryCards from './SummaryCards';
import AnalyticsContainer from '../Analytics/AnalyticsContainer';
import { TradesTable } from '../TradeManagement';
import { TradeForm } from '../TradeManagement';
import { Loading, Error } from '../UI';

const Dashboard = () => {
  const [showAddForm, setShowAddForm] = useState(false);

  // React Query hooks
  const { data: tradesData = { trades: [] }, isLoading, error, refetch } = useTrades();
  const trades = tradesData.trades || [];
  const addTradeMutation = useAddTrade();
  const deleteTradeMutation = useDeleteTrade();
  const closeTradeMutation = useCloseTrade();

  const handleAddTrade = async (tradeData) => {
    await addTradeMutation.mutateAsync(tradeData);
  };

  const handleDeleteTrade = async (tradeId) => {
    try {
      await deleteTradeMutation.mutateAsync(tradeId);
    } catch (error) {
      console.error('Error deleting trade:', error);
      throw error;
    }
  };

  const handleCloseTrade = async ({ tradeId, exitPrice }) => {
    try {
      await closeTradeMutation.mutateAsync({ tradeId, exitPrice });
    } catch (error) {
      console.error('Error closing trade:', error);
      throw error;
    }
  };

  const calculateStats = () => {
    const totalTrades = trades.length;
    const closedTradesArray = getClosedTrades(trades);
    const closedTrades = closedTradesArray.length;
    const openTrades = countOpenTrades(trades);
    const totalPnL = trades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
    const winningTrades = closedTradesArray.filter(trade => trade.pnl && trade.pnl > 0).length;
    const winRate = closedTrades > 0 ? (winningTrades / closedTrades * 100).toFixed(1) : 0;

    return { totalTrades, closedTrades, openTrades, totalPnL, winRate };
  };

  const stats = calculateStats();

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <Error error={error.message} onRetry={refetch} />;
  }

  return (
    <div className="dashboard">
      <Header onAddTrade={() => setShowAddForm(true)} />
      <SummaryCards stats={stats} />
      <AnalyticsContainer trades={trades} />
      <TradesTable
        trades={trades}
        onCloseTrade={handleCloseTrade}
        onDeleteTrade={handleDeleteTrade}
      />

      <TradeForm
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSubmit={handleAddTrade}
        isLoading={addTradeMutation.isPending}
        error={addTradeMutation.error}
      />
    </div>
  );
};

export default Dashboard;
