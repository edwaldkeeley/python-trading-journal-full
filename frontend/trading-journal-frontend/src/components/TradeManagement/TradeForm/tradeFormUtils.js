import { TRADE_CONFIG, CHECKLIST_CONFIG } from '../../../constants/config';

/**
 * Trade form utility functions
 */

export const validateTradePosition = (formData) => {
  const entryPrice = parseFloat(formData.entry_price);
  const stopLoss = parseFloat(formData.stop_loss);
  const takeProfit = parseFloat(formData.take_profit);
  const lotSize = parseFloat(formData.lot_size);
  const side = formData.side;

  // Check if values are valid numbers
  if (isNaN(entryPrice) || isNaN(stopLoss) || isNaN(takeProfit) || isNaN(lotSize)) {
    return { isValid: false, error: 'All price values must be valid numbers' };
  }

  // Check if values are positive
  if (entryPrice <= 0 || stopLoss <= 0 || takeProfit <= 0) {
    return { isValid: false, error: 'All price values must be greater than zero' };
  }

  // Validate lot size
  if (lotSize <= 0) {
    return { isValid: false, error: 'Lot size must be greater than 0' };
  }
  if (lotSize > TRADE_CONFIG.LOT_SIZE.MAX) {
    return { isValid: false, error: `Lot size cannot exceed ${TRADE_CONFIG.LOT_SIZE.MAX}` };
  }

  if (side === 'buy') {
    // For BUY trades (long positions):
    // - Take Profit should be ABOVE entry price (for profit)
    // - Stop Loss should be BELOW entry price (for loss protection)

    if (takeProfit <= entryPrice) {
      return {
        isValid: false,
        error: `For BUY trades, Take Profit (${takeProfit}) must be ABOVE Entry Price (${entryPrice}) to make a profit`
      };
    }

    if (stopLoss >= entryPrice) {
      return {
        isValid: false,
        error: `For BUY trades, Stop Loss (${stopLoss}) must be BELOW Entry Price (${entryPrice}) to limit losses`
      };
    }

    if (stopLoss >= takeProfit) {
      return {
        isValid: false,
        error: `For BUY trades, Stop Loss (${stopLoss}) must be BELOW Take Profit (${takeProfit})`
      };
    }

  } else if (side === 'sell') {
    // For SELL trades (short positions):
    // - Take Profit should be BELOW entry price (for profit)
    // - Stop Loss should be ABOVE entry price (for loss protection)

    if (takeProfit >= entryPrice) {
      return {
        isValid: false,
        error: `For SELL trades, Take Profit (${takeProfit}) must be BELOW Entry Price (${entryPrice}) to make a profit`
      };
    }

    if (stopLoss <= entryPrice) {
      return {
        isValid: false,
        error: `For SELL trades, Stop Loss (${stopLoss}) must be ABOVE Entry Price (${entryPrice}) to limit losses`
      };
    }

    if (stopLoss <= takeProfit) {
      return {
        isValid: false,
        error: `For SELL trades, Stop Loss (${stopLoss}) must be ABOVE Take Profit (${takeProfit})`
      };
    }
  }

  // Check for reasonable risk/reward ratios
  const risk = Math.abs(entryPrice - stopLoss);
  const reward = Math.abs(takeProfit - entryPrice);
  const riskRewardRatio = reward / risk;

  if (riskRewardRatio < 1.5) {
    return {
      isValid: false,
      error: `Risk/Reward ratio is too low (${riskRewardRatio.toFixed(2)}:1). Aim for at least 1.5:1 for better risk management`
    };
  }

  return { isValid: true, error: null };
};

export const getRiskRewardRatio = (formData) => {
  if (!formData.entry_price || !formData.stop_loss || !formData.take_profit) return 'N/A';

  const entryPrice = parseFloat(formData.entry_price);
  const stopLoss = parseFloat(formData.stop_loss);
  const takeProfit = parseFloat(formData.take_profit);

  if (isNaN(entryPrice) || isNaN(stopLoss) || isNaN(takeProfit)) return 'N/A';

  const risk = Math.abs(entryPrice - stopLoss);
  const reward = Math.abs(takeProfit - entryPrice);

  if (risk === 0) return 'N/A';

  return (reward / risk).toFixed(2) + ':1';
};

export const getRiskRewardClass = (formData) => {
  if (!formData.entry_price || !formData.stop_loss || !formData.take_profit) return '';

  const entryPrice = parseFloat(formData.entry_price);
  const stopLoss = parseFloat(formData.stop_loss);
  const takeProfit = parseFloat(formData.take_profit);

  if (isNaN(entryPrice) || isNaN(stopLoss) || isNaN(takeProfit)) return '';

  const risk = Math.abs(entryPrice - stopLoss);
  const reward = Math.abs(takeProfit - entryPrice);

  if (risk === 0) return '';

  const ratio = reward / risk;

  if (ratio >= 2.0) return 'excellent';
  if (ratio >= 1.5) return 'good';
  if (ratio >= 1.0) return 'fair';
  return 'poor';
};

export const calculateChecklistScore = (checklistData) => {
  const totalChecks = Object.keys(checklistData).length;
  const checkedItems = Object.values(checklistData).filter(Boolean).length;
  return Math.round((checkedItems / totalChecks) * 100);
};

export const getLetterGrade = (checklistData) => {
  const score = calculateChecklistScore(checklistData);

  // Check for instant A grade combinations
  const hasAsianSession = checklistData.asianSession;
  const hasMovingAverage = checklistData.movingAverage3 || checklistData.movingAverage4;
  const hasOpenOrFibo = checklistData.openLine || checklistData.fibo62;

  // Instant A if: Asian Session + (MA3 OR MA4) + (Open Line OR 62 Fibo)
  if (hasAsianSession && hasMovingAverage && hasOpenOrFibo) {
    return 'A';
  }

  // Regular scoring for other combinations
  if (score >= 100) return 'A+';
  if (score >= 85) return 'A';
  if (score >= 70) return 'B+';
  if (score >= 55) return 'B';
  if (score >= 40) return 'C+';
  if (score >= 25) return 'C';
  if (score >= 10) return 'D+';
  return 'D';
};

export const getScoreClass = (checklistData) => {
  const grade = getLetterGrade(checklistData);
  if (grade.startsWith('A')) return 'excellent';
  if (grade.startsWith('B')) return 'good';
  if (grade.startsWith('C')) return 'fair';
  if (grade.startsWith('D')) return 'poor';
  return 'failing';
};

export const getScoreMessage = (checklistData) => {
  const grade = getLetterGrade(checklistData);

  // Check if this is an instant A grade
  const hasAsianSession = checklistData.asianSession;
  const hasMovingAverage = checklistData.movingAverage3 || checklistData.movingAverage4;
  const hasOpenOrFibo = checklistData.openLine || checklistData.fibo62;
  const isInstantA = hasAsianSession && hasMovingAverage && hasOpenOrFibo;

  if (grade === 'A+') return '🔥 Master Trader! You nailed everything!';
  if (grade === 'A' && isInstantA) return '⚡ Lightning Strike! Perfect setup detected!';
  if (grade === 'A') return '🎖️ Trading Champion! Almost perfect!';
  if (grade === 'B+') return '💎 Diamond Hands! Strong setup!';
  if (grade === 'B') return '🚀 Rocket Fuel! Good momentum!';
  if (grade === 'C+') return '⭐ Rising Star! Building up!';
  if (grade === 'C') return '🌱 Green Shoots! Getting started!';
  if (grade === 'D+') return '🎯 Aim High! Pick your targets!';
  return '📈 Ready to Launch! Choose your strategy!';
};
