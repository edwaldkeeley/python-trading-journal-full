import React from 'react';
import { getRiskRewardRatio, getRiskRewardClass } from './tradeFormUtils';

const RiskRewardDisplay = ({ formData }) => {
  const riskRewardRatio = getRiskRewardRatio(formData);
  const riskRewardClass = getRiskRewardClass(formData);

  return (
    <div className="risk-reward-section">
      <h3>Risk Management Summary</h3>
      <div className={`risk-reward-display ${riskRewardClass}`}>
        <div className="risk-reward-item">
          <span className="label">Risk/Reward Ratio:</span>
          <span className={`value ${riskRewardClass}`}>
            {riskRewardRatio}
          </span>
        </div>
        <div className="risk-reward-help">
          <small>
            {riskRewardRatio === 'N/A' && 'Fill in all price fields to see risk/reward ratio'}
            {riskRewardRatio !== 'N/A' && riskRewardClass === 'excellent' && '🎯 Excellent! Great risk management!'}
            {riskRewardRatio !== 'N/A' && riskRewardClass === 'good' && '✅ Good! Solid risk/reward ratio'}
            {riskRewardRatio !== 'N/A' && riskRewardClass === 'fair' && '⚠️ Fair. Consider improving your ratio'}
            {riskRewardRatio !== 'N/A' && riskRewardClass === 'poor' && '❌ Poor ratio. High risk, low reward'}
          </small>
        </div>
      </div>
    </div>
  );
};

export default RiskRewardDisplay;
