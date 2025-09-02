# Trading Journal Frontend

A React-based frontend for the Trading Journal application.

## Features

- **Dashboard**: View trading statistics and performance metrics
- **Analytics**: Advanced performance analysis with charts and metrics
- **Trade History**: Display all trades in a comprehensive table with required stop loss and take profit fields, **Pagination**: Configurable items per page (25, 50, 100, 200) with smart page navigation
- **Add New Trade**: Modal form to create new trades
- **Close Trades**: Set exit prices and automatically calculate P&L
- **Delete Trades**: Remove trades with confirmation
- **Real-time Updates**: Automatic refresh of trade data using React Query

## Component Structure

```
src/
├── components/
│   ├── Header.jsx          # App header with title and add trade button
│   ├── SummaryCards.jsx    # Statistics cards (total trades, P&L, win rate)
│   ├── Analytics.jsx       # Performance analytics with charts
│   ├── TradesTable.jsx     # Table displaying all trades with actions
│   ├── AddTradeModal.jsx   # Modal form for adding new trades
│   ├── CloseTradeModal.jsx # Modal for closing trades with exit price
│   ├── DeleteTradeModal.jsx # Modal for confirming trade deletion
│   ├── Loading.jsx         # Loading state component
│   ├── Error.jsx           # Error state component
│   └── index.js            # Component exports
├── hooks/
│   └── useTrades.js        # React Query hooks for trade operations
├── App.jsx                 # Main application component
├── App.css                 # Application styles
├── index.css               # Global styles
└── main.jsx                # Application entry point
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. The app will be available at `http://localhost:3000`

## API Integration

The frontend communicates with the backend API at `http://localhost:8000` (Backend is a seperate repository):

- `GET /api/v1/trades` - Fetch all trades
- `POST /api/v1/trades` - Create a new trade
- `PUT /api/v1/trades/{id}` - Update/close a trade
- `DELETE /api/v1/trades/{id}` - Delete a trade

## Trade Management

### Adding Trades
- Fill out the form with symbol, side, quantity, entry price, stop loss, take profit, and optional notes
- Trades are created as "open" positions

### Pagination Features
- **Configurable Page Size**: Choose from 25, 50, 100, or 200 trades per page
- **Smart Navigation**: First, previous, next, and last page buttons
- **Intelligent Page Numbers**: Shows ellipsis (...) for large page counts
- **Page Information**: Displays current range and total count
- **Smooth Scrolling**: Automatically scrolls to top when changing pages
- **Mobile Optimized**: Responsive design for all screen sizes

### Closing Trades
- Click the "Close" button on any open trade
- Enter the exit price
- **Smart Exit Logic**: Exit price automatically adjusts to take profit or stop loss levels if exceeded
- P&L is automatically calculated based on adjusted exit prices and side (buy/sell)
- Trade status changes to "closed" with exit reason tracking

### Deleting Trades
- Click the "Delete" button on any trade
- Confirmation dialog prevents accidental deletion
- Trade is permanently removed from the system

## Smart Exit Logic

### Automatic Price Adjustment
The trading journal automatically adjusts exit prices based on your stop loss and take profit levels:

- **Take Profit Hit**: If you enter an exit price above take profit (for buy trades) or below take profit (for sell trades), it automatically uses the take profit price
- **Stop Loss Hit**: If you enter an exit price below stop loss (for buy trades) or above stop loss (for sell trades), it automatically uses the stop loss price
- **Exit Reason Tracking**: Each closed trade shows the reason for exit (manual, take_profit, or stop_loss)
- **Optimal P&L**: Ensures you get the best possible profit/loss based on your risk management levels

### Example Scenarios
- **Long Position (BUY)**: Take profit at $150, stop loss at $100
  - Enter exit price $160 → Automatically adjusted to $150 (take profit)
  - Enter exit price $90 → Automatically adjusted to $100 (stop loss)
- **Short Position (SELL)**: Take profit at $100, stop loss at $150
  - Enter exit price $90 → Automatically adjusted to $100 (take profit)
  - Enter exit price $160 → Automatically adjusted to $150 (stop loss)

## Analytics & Performance

### Performance Metrics
- **Win Rate**: Percentage of profitable trades
- **Total P&L**: Overall profit/loss from all closed trades
- **Average Win/Loss**: Mean P&L for winning and losing trades
- **Max Drawdown**: Largest single loss

### Visual Charts
- **Monthly P&L Chart**: Bar chart showing monthly performance
- **Trade Distribution**: Pie chart of open vs. closed trades
- **Real-time Updates**: Charts update automatically with trade changes

## Trade Form Fields

- **Symbol** (required): Stock/trading symbol (e.g., AAPL)
- **Side** (required): Buy or Sell
- **Quantity** (required): Number of shares/contracts
- **Entry Price** (required): Price at entry
- **Stop Loss** (required): Stop loss price for risk management
- **Take Profit** (required): Take profit target price
- **Notes** (optional): Comprehensive trade notes including:
  - Entry reasoning and market analysis
  - Risk management plan
  - Exit strategy
  - Lessons learned and trade insights

## Styling

The application uses CSS modules with a clean, modern design. All styles are contained in `App.css` with responsive design for mobile devices.
