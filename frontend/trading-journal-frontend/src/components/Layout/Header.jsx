import React from 'react'

const Header = ({ onAddTrade }) => {
  return (
    <header className="header">
      <h1>Trading Journal Dashboard</h1>
      <div className="header-actions">
        <button className="add-trade-btn" onClick={onAddTrade}>
          + Add Trade
        </button>
      </div>
    </header>
  )
}

export default Header
