import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1/'

// Fetch all trades with pagination
export const useTrades = (limit = 500, offset = 0) => {
  return useQuery({
    queryKey: ['trades', limit, offset],
    queryFn: async () => {
      const response = await fetch(
        `${API_BASE_URL}trades?limit=${limit}&offset=${offset}`
      )
      if (!response.ok) {
        throw new Error(
          `Failed to fetch trades: ${response.status} ${response.statusText}`
        )
      }
      const data = await response.json()

      // Handle both old format (array) and new format (object with trades and pagination)
      if (Array.isArray(data)) {
        return { trades: data, pagination: null }
      } else if (data.trades && Array.isArray(data.trades)) {
        return data
      } else {
        throw new Error('Invalid response format from API')
      }
    },
  })
}

// Add new trade
export const useAddTrade = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (tradeData) => {
      const response = await fetch(`${API_BASE_URL}trades`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...tradeData,
          // Only set entry_time if not provided (for manual trade creation)
          entry_time: tradeData.entry_time || new Date().toISOString(),
        }),
      })

      if (!response.ok) {
        throw new Error(
          `Failed to create trade: ${response.status} ${response.statusText}`
        )
      }

      return response.json()
    },
    onSuccess: (newTrade) => {
      // Optimistically add the new trade to the cache
      queryClient.setQueryData(['trades'], (oldData) => {
        if (!oldData) return { trades: [newTrade], pagination: null }
        if (Array.isArray(oldData)) {
          return { trades: [...oldData, newTrade], pagination: null }
        }
        return { ...oldData, trades: [...oldData.trades, newTrade] }
      })

      // Also invalidate to ensure we have the latest data
      queryClient.invalidateQueries({ queryKey: ['trades'] })
    },
  })
}

// Update trade (for closing trades)
export const useUpdateTrade = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ tradeId, tradeData }) => {
      const response = await fetch(`${API_BASE_URL}trades/${tradeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tradeData),
      })

      if (!response.ok) {
        throw new Error(
          `Failed to update trade: ${response.status} ${response.statusText}`
        )
      }

      return response.json()
    },
    onSuccess: () => {
      // Invalidate and refetch trades after successful update
      queryClient.invalidateQueries({ queryKey: ['trades'] })
    },
  })
}

// Delete trade
export const useDeleteTrade = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (tradeId) => {
      const response = await fetch(`${API_BASE_URL}trades/${tradeId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error(
          `Failed to delete trade: ${response.status} ${response.statusText}`
        )
      }

      return { id: tradeId }
    },
    onSuccess: (_, tradeId) => {
      // Optimistically remove the trade from the cache
      queryClient.setQueryData(['trades'], (oldData) => {
        if (!oldData) return oldData
        if (Array.isArray(oldData)) {
          return oldData.filter((trade) => trade.id !== tradeId)
        }
        return {
          ...oldData,
          trades: oldData.trades.filter((trade) => trade.id !== tradeId),
        }
      })

      // Also invalidate to ensure we have the latest data
      queryClient.invalidateQueries({ queryKey: ['trades'] })
    },
  })
}

// Close trade (set exit price and calculate P&L)
export const useCloseTrade = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ tradeId, exitPrice }) => {
      // First get the current trade to calculate P&L
      const tradeResponse = await fetch(`${API_BASE_URL}trades/${tradeId}`)
      if (!tradeResponse.ok) {
        throw new Error(`Failed to fetch trade: ${tradeResponse.status}`)
      }

      const trade = await tradeResponse.json()

      // Auto-adjust exit price based on take profit and stop loss
      let adjustedExitPrice = parseFloat(exitPrice)
      let exitReason = 'manual'

      // Ensure all price values are numbers for proper comparison
      const entryPrice = parseFloat(trade.entry_price)
      const takeProfit = trade.take_profit
        ? parseFloat(trade.take_profit)
        : null
      const stopLoss = trade.stop_loss ? parseFloat(trade.stop_loss) : null
      const quantity = parseFloat(trade.quantity)
      const lotSize = parseFloat(trade.lot_size || 1)

      // P&L calculation for trade closure

      if (trade.side === 'buy') {
        // For buy trades (long positions)
        if (takeProfit && adjustedExitPrice >= takeProfit) {
          // If exit price is at or above take profit, use take profit price
          adjustedExitPrice = takeProfit
          exitReason = 'take_profit'
        } else if (stopLoss && adjustedExitPrice <= stopLoss) {
          // If exit price is at or below stop loss, use stop loss price
          adjustedExitPrice = stopLoss
          exitReason = 'stop_loss'
        }
      } else {
        // For sell trades (short positions)
        if (takeProfit && adjustedExitPrice <= takeProfit) {
          // If exit price is at or below take profit, use take profit price
          adjustedExitPrice = takeProfit
          exitReason = 'take_profit'
        } else if (stopLoss && adjustedExitPrice >= stopLoss) {
          // If exit price is at or above stop loss, use stop loss price
          adjustedExitPrice = stopLoss
          exitReason = 'stop_loss'
        }
      }

      // Calculate P&L based on adjusted exit price
      let pnl = 0

      if (trade.side === 'buy') {
        // For buy trades (long positions): profit when exit > entry
        const priceDifference = adjustedExitPrice - entryPrice
        const gross = priceDifference * quantity * lotSize
        pnl = gross - trade.fees // Subtract fees like backend

        // P&L calculation for buy trade

        // Ensure P&L is a valid number
        if (isNaN(pnl) || !isFinite(pnl)) {
          console.error('Invalid P&L calculation detected:', {
            priceDifference,
            quantity,
            lotSize,
            gross,
            fees: trade.fees,
            pnl,
          })
          pnl = 0
        }
      } else {
        // For sell trades (short positions): profit when exit < entry
        const priceDifference = entryPrice - adjustedExitPrice
        const gross = priceDifference * quantity * lotSize
        pnl = gross - trade.fees // Subtract fees like backend

        // P&L calculation for sell trade

        // Ensure P&L is a valid number
        if (isNaN(pnl) || !isFinite(pnl)) {
          console.error('Invalid P&L calculation detected:', {
            priceDifference,
            quantity,
            lotSize,
            gross,
            fees: trade.fees,
            pnl,
          })
          pnl = 0
        }
      }

      // Final validation
      if (isNaN(pnl) || !isFinite(pnl)) {
        throw new Error('Invalid P&L calculation - check input values')
      }

      // Update the trade with exit information
      const updateData = {
        exit_price: adjustedExitPrice,
        exit_time: new Date().toISOString(),
        pnl: pnl,
        exit_reason: exitReason,
        lot_size: lotSize, // Include lot_size to ensure it's preserved
      }

      // Final P&L calculation complete

      const response = await fetch(`${API_BASE_URL}trades/${tradeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      })

      if (!response.ok) {
        const errorText = await response.text()

        throw new Error(
          `Failed to close trade: ${response.status} ${response.statusText} - ${errorText}`
        )
      }

      const result = await response.json()

      return result
    },
    onSuccess: (updatedTrade) => {
      // Optimistically update the cache with the new trade data
      queryClient.setQueryData(['trades'], (oldData) => {
        if (!oldData) return oldData
        if (Array.isArray(oldData)) {
          return oldData.map((trade) =>
            trade.id === updatedTrade.id ? updatedTrade : trade
          )
        }
        return {
          ...oldData,
          trades: oldData.trades.map((trade) =>
            trade.id === updatedTrade.id ? updatedTrade : trade
          ),
        }
      })

      // Also invalidate to ensure we have the latest data
      queryClient.invalidateQueries({ queryKey: ['trades'] })
    },
    onError: () => {
      // If there's an error, invalidate to refetch fresh data
      queryClient.invalidateQueries({ queryKey: ['trades'] })
    },
  })
}

// Clear all trades
export const useClearAllTrades = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const response = await fetch(`${API_BASE_URL}trades/clear`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error(
          `Failed to clear all trades: ${response.status} ${response.statusText}`
        )
      }

      return response.json()
    },
    onSuccess: () => {
      // Clear all trade-related queries from cache
      queryClient.removeQueries({ queryKey: ['trades'] })
      queryClient.invalidateQueries({ queryKey: ['trades'] })
    },
  })
}
