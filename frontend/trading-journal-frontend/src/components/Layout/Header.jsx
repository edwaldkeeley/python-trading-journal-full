import React from 'react'
import { ThemeToggle } from '../UI'

const Header = ({ onAddTrade }) => {
  return (
    <header className="header">
      <h1>Trading Journal Dashboard</h1>
      <div className="header-actions">
        <ThemeToggle />
        <button className="add-trade-btn" onClick={onAddTrade}>
          + Add Trade
        </button>
      </div>
    </header>
  )
}

export default Header
