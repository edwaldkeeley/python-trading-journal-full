import React, { useState } from 'react'
import {
  useTrades,
  useAddTrade,
  useDeleteTrade,
  useCloseTrade,
  useClearAllTrades,
} from '../../hooks/useTrades'
import { countOpenTrades, getClosedTrades } from '../../utils/tradeUtils'
import Header from './Header'
import SummaryCards from './SummaryCards'
import AnalyticsContainer from '../Analytics/AnalyticsContainer'
import { TradesTable } from '../TradeManagement'
import { TradeForm } from '../TradeManagement'
import { Loading, Error, DataGenerator, TradeEraser } from '../UI'

const Dashboard = () => {
  const [showAddForm, setShowAddForm] = useState(false)
  const [showDataGenerator, setShowDataGenerator] = useState(false)
  const [showTradeEraser, setShowTradeEraser] = useState(false)

  // React Query hooks
  const {
    data: tradesData = { trades: [] },
    isLoading,
    error,
    refetch,
  } = useTrades()
  const trades = tradesData.trades || []
  const addTradeMutation = useAddTrade()
  const deleteTradeMutation = useDeleteTrade()
  const closeTradeMutation = useCloseTrade()
  const clearAllTradesMutation = useClearAllTrades()

  const handleAddTrade = async (tradeData) => {
    await addTradeMutation.mutateAsync(tradeData)
  }

  const handleDeleteTrade = async (tradeId) => {
    try {
      await deleteTradeMutation.mutateAsync(tradeId)
    } catch (error) {
      console.error('Error deleting trade:', error)
      throw error
    }
  }

  const handleCloseTrade = async ({ tradeId, exitPrice }) => {
    try {
      await closeTradeMutation.mutateAsync({ tradeId, exitPrice })
    } catch (error) {
      console.error('Error closing trade:', error)
      throw error
    }
  }

  const handleClearAllTrades = async () => {
    try {
      await clearAllTradesMutation.mutateAsync()
      setShowTradeEraser(false)
      alert('All trades have been cleared successfully!')
    } catch (error) {
      console.error('Error clearing all trades:', error)
      alert('Error clearing trades. Please try again.')
    }
  }

  const handleGenerateTrades = async (generatedTrades) => {
    try {
      console.log('Generated trades:', generatedTrades)
      console.log('Number of trades to generate:', generatedTrades.length)

      // Count closed vs open trades
      const closedTrades = generatedTrades.filter(
        (trade) => trade.exit_price && trade.exit_time
      )
      const openTrades = generatedTrades.filter(
        (trade) => !trade.exit_price || !trade.exit_time
      )
      console.log('Closed trades:', closedTrades.length)
      console.log('Open trades:', openTrades.length)

      // Send each generated trade to the backend
      const promises = generatedTrades.map(async (trade, index) => {
        try {
          console.log(
            `Adding trade ${index + 1}/${generatedTrades.length}:`,
            trade.symbol,
            trade.side,
            trade.is_closed || (trade.exit_price && trade.exit_time)
          )
          await addTradeMutation.mutateAsync(trade)
        } catch (error) {
          console.error(`Failed to add trade ${trade.id}:`, error)
          // Continue with other trades even if one fails
        }
      })

      // Wait for all trades to be processed
      const results = await Promise.allSettled(promises)
      const successful = results.filter(
        (result) => result.status === 'fulfilled'
      ).length
      const failed = results.filter(
        (result) => result.status === 'rejected'
      ).length

      console.log(`Successfully added ${successful} trades, ${failed} failed`)

      // Refresh the trades data
      refetch()

      // Show success message
      alert(
        `Successfully generated ${generatedTrades.length} trades! (${successful} added, ${failed} failed) The data has been added to your trading journal.`
      )
    } catch (error) {
      console.error('Error handling generated trades:', error)
      alert('Error generating trades. Please try again.')
    }
  }

  const calculateStats = () => {
    const totalTrades = trades.length
    const closedTradesArray = getClosedTrades(trades)
    const closedTrades = closedTradesArray.length
    const openTrades = countOpenTrades(trades)
    const totalPnL = trades.reduce((sum, trade) => sum + (trade.pnl || 0), 0)
    const winningTrades = closedTradesArray.filter(
      (trade) => trade.pnl && trade.pnl > 0
    ).length
    const winRate = closedTrades > 0 ? winningTrades / closedTrades : 0

    return { totalTrades, closedTrades, openTrades, totalPnL, winRate }
  }

  const stats = calculateStats()

  if (isLoading) {
    return <Loading />
  }

  if (error) {
    return <Error error={error.message} onRetry={refetch} />
  }

  return (
    <div className="dashboard">
      <Header
        onAddTrade={() => setShowAddForm(true)}
        onGenerateData={() => setShowDataGenerator(true)}
        onClearAll={() => setShowTradeEraser(true)}
      />
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

      <DataGenerator
        isOpen={showDataGenerator}
        onClose={() => setShowDataGenerator(false)}
        onGenerateTrades={handleGenerateTrades}
      />

      <TradeEraser
        isOpen={showTradeEraser}
        onClose={() => setShowTradeEraser(false)}
        onConfirm={handleClearAllTrades}
        isLoading={clearAllTradesMutation.isPending}
      />
    </div>
  )
}

export default Dashboard
