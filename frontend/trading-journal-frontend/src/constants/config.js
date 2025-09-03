// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  TIMEOUT: 10000,
};

// Trade Configuration
export const TRADE_CONFIG = {
  LOT_SIZE: {
    MIN: 0.01,
    MAX: 100,
    DEFAULT: 1,
    STEP: 0.01,
  },
  QUANTITY: {
    MIN: 0.01,
    STEP: 0.01,
  },
  PRICE: {
    MIN: 0.01,
    STEP: 0.01,
  },
  PAGINATION: {
    DEFAULT_LIMIT: 500,
    DEFAULT_OFFSET: 0,
    PAGE_SIZES: [10, 25, 50, 100, 500],
  },
};

// Checklist Configuration
export const CHECKLIST_CONFIG = {
  ITEMS: [
    { key: 'asianSession', label: 'Asian Session', description: 'Trading during Asian market hours' },
    { key: 'openLine', label: 'Open Line', description: 'Price near opening levels' },
    { key: 'fibo62', label: '62 Fibo', description: 'Price near 61.8% Fibonacci level' },
    { key: 'averageLine', label: 'Average Line', description: 'Price near moving average' },
    { key: 'movingAverage3', label: 'Moving Average 3', description: '3-period moving average signal' },
    { key: 'movingAverage4', label: 'Moving Average 4', description: '4-period moving average signal' }
  ],
  GRADES: {
    'A+': { minScore: 100, message: '🔥 Master Trader! You nailed everything!' },
    'A': { minScore: 85, message: '🎖️ Trading Champion! Almost perfect!' },
    'B+': { minScore: 70, message: '💎 Diamond Hands! Strong setup!' },
    'B': { minScore: 55, message: '🚀 Rocket Fuel! Good momentum!' },
    'C+': { minScore: 40, message: '⭐ Rising Star! Building up!' },
    'C': { minScore: 25, message: '🌱 Green Shoots! Getting started!' },
    'D+': { minScore: 10, message: '🎯 Aim High! Pick your targets!' },
    'D': { minScore: 0, message: '📈 Ready to Launch! Choose your strategy!' },
  },
};

// UI Configuration
export const UI_CONFIG = {
  COLORS: {
    PRIMARY: '#3498db',
    SUCCESS: '#27ae60',
    WARNING: '#f39c12',
    DANGER: '#e74c3c',
    INFO: '#17a2b8',
    LIGHT: '#f8f9fa',
    DARK: '#343a40',
  },
  BREAKPOINTS: {
    MOBILE: 768,
    TABLET: 1024,
    DESKTOP: 1200,
  },
};
