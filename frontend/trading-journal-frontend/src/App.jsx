import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './App.css'
import {
  Header,
  SummaryCards,
  TradesTable,
  AddTradeModal,
  Loading,
  Error
} from './components'
import Analytics from './components/Analytics'
import { useTrades, useAddTrade, useDeleteTrade, useCloseTrade } from './hooks/useTrades'

// Create a client
const queryClient = new QueryClient()

function AppContent() {
  const [showAddForm, setShowAddForm] = useState(false)

  // React Query hooks
  const { data: tradesData = { trades: [] }, isLoading, error, refetch } = useTrades()
  const trades = tradesData.trades || []
  const addTradeMutation = useAddTrade()
  const deleteTradeMutation = useDeleteTrade()
  const closeTradeMutation = useCloseTrade()

  const handleAddTrade = async (tradeData) => {
    await addTradeMutation.mutateAsync(tradeData)
  }

  const handleDeleteTrade = async (tradeId) => {
    try {
      await deleteTradeMutation.mutateAsync(tradeId)
      console.log('Trade deleted successfully:', tradeId)
    } catch (error) {
      console.error('Error deleting trade:', error)
      throw error
    }
  }

  const handleCloseTrade = async ({ tradeId, exitPrice }) => {
    try {
      await closeTradeMutation.mutateAsync({ tradeId, exitPrice })
      console.log('Trade closed successfully:', { tradeId, exitPrice })
    } catch (error) {
      console.error('Error closing trade:', error)
      throw error
    }
  }

  const calculateStats = () => {
    const totalTrades = trades.length
    const closedTrades = trades.filter(trade => trade.is_closed).length
    const openTrades = totalTrades - closedTrades
    const totalPnL = trades.reduce((sum, trade) => sum + (trade.pnl || 0), 0)
    const winningTrades = trades.filter(trade => trade.pnl && trade.pnl > 0).length
    const winRate = closedTrades > 0 ? (winningTrades / closedTrades * 100).toFixed(1) : 0

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
    <div className="app">
      <Header onAddTrade={() => setShowAddForm(true)} />
      <SummaryCards stats={stats} />
      <Analytics trades={trades} />
      <TradesTable
        trades={trades}
        onCloseTrade={handleCloseTrade}
        onDeleteTrade={handleDeleteTrade}
      />

      <AddTradeModal
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSubmit={handleAddTrade}
        isLoading={addTradeMutation.isPending}
        error={addTradeMutation.error}
      />
    </div>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  )
}

export default App
