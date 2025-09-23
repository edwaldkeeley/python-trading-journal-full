import React from 'react'
import WeeklyPerformanceChart from './WeeklyPerformanceChart'

const PerformanceOverviewWidget = ({ trades }) => {
  return (
    <div className="dashboard-widget">
      <div className="widget-header">
        <h3>Performance Overview</h3>
        <span className="widget-subtitle">This week's trading performance</span>
      </div>
      <div className="widget-content">
        <WeeklyPerformanceChart trades={trades} />
      </div>
    </div>
  )
}

export default PerformanceOverviewWidget
