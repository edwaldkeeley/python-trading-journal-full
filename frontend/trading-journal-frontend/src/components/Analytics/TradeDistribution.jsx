import React from 'react';

const TradeDistribution = ({ closedTrades, openTrades, totalTrades }) => {
  return (
    <div className="analytics-card">
      <h3>Trade Distribution</h3>
      <div className="distribution-chart">
        <div className="pie-chart">
          <div className="pie-segment closed" style={{
            transform: `rotate(${closedTrades / totalTrades * 360}deg)`
          }}></div>
          <div className="pie-segment open" style={{
            transform: `rotate(${openTrades / totalTrades * 360}deg)`
          }}></div>
        </div>
        <div className="legend">
          <div className="legend-item">
            <span className="legend-color closed"></span>
            <span>Closed: {closedTrades}</span>
          </div>
          <div className="legend-item">
            <span className="legend-color open"></span>
            <span>Open: {openTrades}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradeDistribution;
