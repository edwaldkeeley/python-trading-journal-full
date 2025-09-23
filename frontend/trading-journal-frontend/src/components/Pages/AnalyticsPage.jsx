import React from 'react'
import AnalyticsContainer from '../Analytics/AnalyticsContainer'
import { useTrades } from '../../hooks/useTrades'

const AnalyticsPage = () => {
  const { data: tradesData = { trades: [] } } = useTrades()
  const trades = tradesData.trades || []

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>Analytics</h1>
        <p>Detailed analysis of your trading performance</p>
      </div>
      <AnalyticsContainer trades={trades} />
    </div>
  )
}

export default AnalyticsPage
