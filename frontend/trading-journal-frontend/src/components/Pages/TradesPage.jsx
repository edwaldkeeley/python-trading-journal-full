import React from 'react'
import { TradesTable } from '../TradeManagement'
import { useTrades } from '../../hooks/useTrades'

const TradesPage = ({ onCloseTrade, onDeleteTrade }) => {
  const { data: tradesData = { trades: [] } } = useTrades()
  const trades = tradesData.trades || []

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>Trades</h1>
        <p>Manage and view all your trading records</p>
      </div>
      <TradesTable
        trades={trades}
        onCloseTrade={onCloseTrade}
        onDeleteTrade={onDeleteTrade}
      />
    </div>
  )
}

export default TradesPage
