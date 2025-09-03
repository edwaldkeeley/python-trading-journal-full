import React from 'react';

const Header = ({ onAddTrade }) => {
  return (
    <header className="header">
      <h1>Trading Journal Dashboard</h1>
      <button
        className="add-trade-btn"
        onClick={onAddTrade}
      >
        + Add Trade
      </button>
    </header>
  );
};

export default Header;
