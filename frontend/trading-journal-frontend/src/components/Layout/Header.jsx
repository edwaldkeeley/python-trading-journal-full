import React from 'react'
import { ThemeToggle } from '../UI'

const Header = ({ onAddTrade, onGenerateData, onClearAll }) => {
  return (
    <header className="header">
      <h1>Trading Journal Dashboard</h1>
      <div className="header-actions">
        <ThemeToggle />
        <button
          className="btn btn-secondary btn-sm"
          onClick={onGenerateData}
          title="Generate sample trade data for testing"
        >
          🎲 Generate Sample Data
        </button>
        <button
          className="btn btn-danger btn-sm"
          onClick={onClearAll}
          title="Clear all trade history (cannot be undone)"
        >
          🗑️ Clear All
        </button>
        <button className="add-trade-btn" onClick={onAddTrade}>
          + Add Trade
        </button>
      </div>
    </header>
  )
}

export default Header
