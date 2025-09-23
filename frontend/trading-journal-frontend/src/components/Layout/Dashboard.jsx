import React, { useState } from 'react'
import {
  useTrades,
  useAddTrade,
  useDeleteTrade,
  useCloseTrade,
  useClearAllTrades,
} from '../../hooks/useTrades'
import { countOpenTrades, getClosedTrades } from '../../utils/tradeUtils'
import useScrollToTop from '../../hooks/useScrollToTop'
import useNotification from '../../hooks/useNotification'
import Header from './Header'
import SummaryCards from './SummaryCards'
import AnalyticsContainer from '../Analytics/AnalyticsContainer'
import { TradesTable } from '../TradeManagement'
import { TradeForm } from '../TradeManagement'
import {
  Loading,
  ErrorBoundary,
  DataGenerator,
  TradeEraser,
  NotificationModal,
} from '../UI'

const Dashboard = () => {
  const [showAddForm, setShowAddForm] = useState(false)
  const [showDataGenerator, setShowDataGenerator] = useState(false)
  const [showTradeEraser, setShowTradeEraser] = useState(false)

  // Notification system
  const { notification, showSuccess, showError, hideNotification } =
    useNotification()

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
    try {
      await addTradeMutation.mutateAsync(tradeData)
      showSuccess(
        'Trade Added Successfully',
        `Trade for ${tradeData.symbol} has been added to your journal.`
      )
    } catch (error) {
      showError(
        'Failed to Add Trade',
        error.message ||
          'An error occurred while adding the trade. Please try again.'
      )
    }
  }

  const handleDeleteTrade = async (tradeId) => {
    try {
      await deleteTradeMutation.mutateAsync(tradeId)
      showSuccess(
        'Trade Deleted',
        'The trade has been successfully removed from your journal.'
      )
    } catch (error) {
      showError(
        'Failed to Delete Trade',
        error.message ||
          'An error occurred while deleting the trade. Please try again.'
      )
      throw error
    }
  }

  const handleCloseTrade = async ({ tradeId, exitPrice }) => {
    try {
      await closeTradeMutation.mutateAsync({ tradeId, exitPrice })
      showSuccess(
        'Trade Closed Successfully',
        'The trade has been closed and P&L has been calculated.'
      )
    } catch (error) {
      showError(
        'Failed to Close Trade',
        error.message ||
          'An error occurred while closing the trade. Please try again.'
      )
      throw error
    }
  }

  const handleClearAllTrades = async () => {
    try {
      await clearAllTradesMutation.mutateAsync()
      setShowTradeEraser(false)
      showSuccess(
        'All Trades Cleared',
        'All trades have been successfully removed from your journal.'
      )
    } catch (error) {
      showError(
        'Failed to Clear Trades',
        error.message ||
          'An error occurred while clearing trades. Please try again.'
      )
    }
  }

  const handleGenerateTrades = async (generatedTrades) => {
    try {
      // Processing generated trades

      // Send each generated trade to the backend
      const promises = generatedTrades.map(async (trade) => {
        try {
          // Adding trade to backend
          await addTradeMutation.mutateAsync(trade)
        } catch {
          // Failed to add trade - continue with others
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

      // Trade generation completed

      // Refresh the trades data
      refetch()

      // Show success message
      showSuccess(
        'Sample Data Generated',
        `Successfully generated ${successful} trades! ${
          failed > 0
            ? `${failed} trades failed to add.`
            : 'All trades added successfully.'
        }`
      )
    } catch (error) {
      showError(
        'Failed to Generate Data',
        error.message ||
          'An error occurred while generating sample data. Please try again.'
      )
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

  // Scroll to top when there's an error
  useScrollToTop(
    !!error ||
      !!addTradeMutation.error ||
      !!deleteTradeMutation.error ||
      !!closeTradeMutation.error
  )

  if (isLoading) {
    return <Loading />
  }

  if (error) {
    // Create a comprehensive error message
    const getDetailedErrorMessage = (error) => {
      let errorDetails = []

      // API URL information
      const apiUrl =
        import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1/'
      errorDetails.push(`🔗 API URL: ${apiUrl}`)
      errorDetails.push(`🌐 Full URL: ${apiUrl}trades`)

      // Basic error message
      if (error.message) {
        errorDetails.push(`❌ Error: ${error.message}`)
      }

      // Error name and type
      if (error.name) {
        errorDetails.push(`🏷️ Error Name: ${error.name}`)
      }

      // Status code
      if (error.status) {
        errorDetails.push(`📊 Status: ${error.status}`)
      }

      // Response status
      if (error.response?.status) {
        errorDetails.push(`🌐 HTTP Status: ${error.response.status}`)
      }

      // Response status text
      if (error.response?.statusText) {
        errorDetails.push(`📝 Status Text: ${error.response.statusText}`)
      }

      // Network error details
      if (error.code) {
        errorDetails.push(`🔍 Error Code: ${error.code}`)
      }

      // URL that failed
      if (error.config?.url) {
        errorDetails.push(`🔗 Failed URL: ${error.config.url}`)
      }

      // Method used
      if (error.config?.method) {
        errorDetails.push(`📤 Method: ${error.config.method.toUpperCase()}`)
      }

      // React Query specific error info
      if (error.cause) {
        errorDetails.push(`🔗 Cause: ${error.cause}`)
      }

      // Stack trace (first few lines)
      if (error.stack) {
        const stackLines = error.stack.split('\n').slice(0, 3)
        errorDetails.push(`📚 Stack: ${stackLines.join(' | ')}`)
      }

      // Timestamp
      errorDetails.push(`⏰ Time: ${new Date().toLocaleString()}`)

      return errorDetails.join('\n')
    }

    // Determine error type based on error properties
    let errorType = 'general'
    let errorTitle = 'Failed to Load Trading Journal'

    // Check for network errors
    if (
      error.code === 'NETWORK_ERROR' ||
      error.message?.includes('Network Error') ||
      error.message?.includes('fetch') ||
      error.message?.includes('Failed to fetch') ||
      error.message?.includes('Connection refused') ||
      error.message?.includes('ECONNREFUSED') ||
      error.name === 'TypeError' ||
      error.name === 'NetworkError'
    ) {
      errorType = 'network'
      errorTitle = 'Cannot Connect to Backend Server'
    }
    // Check for server errors (5xx)
    else if (
      error.status >= 500 ||
      error.response?.status >= 500 ||
      error.message?.includes('500') ||
      error.message?.includes('Internal Server Error') ||
      error.message?.includes('Server Error')
    ) {
      errorType = 'server'
      errorTitle = 'Backend Server Error'
    }
    // Check for client errors (4xx)
    else if (
      error.status >= 400 ||
      error.response?.status >= 400 ||
      error.message?.includes('400') ||
      error.message?.includes('401') ||
      error.message?.includes('403') ||
      error.message?.includes('404') ||
      error.message?.includes('Unauthorized') ||
      error.message?.includes('Forbidden') ||
      error.message?.includes('Not Found')
    ) {
      errorType = 'validation'
      errorTitle = 'Request Validation Error'
    }
    // Check for timeout errors
    else if (
      error.message?.includes('timeout') ||
      error.message?.includes('TIMEOUT') ||
      error.code === 'TIMEOUT'
    ) {
      errorType = 'network'
      errorTitle = 'Connection Timeout'
    }
    // Check for CORS errors
    else if (
      error.message?.includes('CORS') ||
      error.message?.includes('cross-origin') ||
      error.message?.includes('Access-Control-Allow-Origin')
    ) {
      errorType = 'validation'
      errorTitle = 'CORS Configuration Error'
    }

    const detailedError = getDetailedErrorMessage(error)

    return (
      <ErrorBoundary
        error={detailedError}
        onRetry={refetch}
        title={errorTitle}
        type={errorType}
      />
    )
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

      <NotificationModal
        isOpen={notification.isOpen}
        onClose={hideNotification}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        confirmText={notification.confirmText}
        showCancel={notification.showCancel}
        cancelText={notification.cancelText}
        onConfirm={notification.onConfirm}
        onCancel={notification.onCancel}
        isLoading={notification.isLoading}
      />
    </div>
  )
}

export default Dashboard
