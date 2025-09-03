import React, { useState } from 'react';
import CloseTradeModal from './CloseTradeModal';
import DeleteTradeModal from './DeleteTradeModal';
import NotesModal from './NotesModal';
import { Pagination } from '../UI';

const TradesTable = ({ trades, onCloseTrade, onDeleteTrade }) => {
  const [closeModalTrade, setCloseModalTrade] = useState(null);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [deleteModalTrade, setDeleteModalTrade] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [notesModalTrade, setNotesModalTrade] = useState(null);
  const [showNotesModal, setShowNotesModal] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);

  // Calculate pagination values
  const totalItems = trades.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTrades = trades.slice(startIndex, endIndex);

  // Handle page changes
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top of table
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle items per page changes
  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page
  };

  const handleCloseTrade = (trade) => {
    setCloseModalTrade(trade);
    setShowCloseModal(true);
  };

  const handleDeleteTrade = (trade) => {
    setDeleteModalTrade(trade);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await onDeleteTrade(deleteModalTrade.id);
      setShowDeleteModal(false);
      setDeleteModalTrade(null);
    } catch (error) {
      console.error('Error deleting trade:', error);
      // Error is handled by the mutation
    }
  };

  const handleCloseModalSubmit = async (data) => {
    try {
      await onCloseTrade(data);
      setShowCloseModal(false);
      setCloseModalTrade(null);
    } catch (error) {
      console.error('Error closing trade:', error);
      throw error;
    }
  };

  return (
    <>
      <div className="trades-section">
        <h2>Trade History</h2>
        <div className="trades-table-container">
          <table className="trades-table">
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Side</th>
                <th>Quantity</th>
                <th>Lot Size</th>
                <th>Entry Price</th>
                <th>Stop Loss</th>
                <th>Take Profit</th>
                <th>Grade</th>
                <th>Notes</th>
                <th>Exit Price</th>
                <th>Exit Reason</th>
                <th>Entry Time</th>
                <th>Exit Time</th>
                <th>
                  P&L
                  <span className="info-tooltip" title="P&L = (Exit Price - Entry Price) × Quantity × Lot Size">
                    ℹ️
                  </span>
                </th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentTrades.map(trade => (
                <tr key={trade.id}>
                  <td className="symbol">{trade.symbol}</td>
                  <td className={`side ${trade.side}`}>{trade.side.toUpperCase()}</td>
                  <td>{trade.quantity}</td>
                  <td>{trade.lot_size}</td>
                  <td>${trade.entry_price}</td>
                  <td>${trade.stop_loss}</td>
                  <td>${trade.take_profit}</td>
                  <td className={`checklist-grade ${trade.checklist_grade || 'no-grade'}`}>
                    {trade.checklist_grade || '-'}
                  </td>
                  <td className="notes-cell">
                    {trade.notes ? (
                      <div className="notes-content">
                        <span className="notes-preview">
                          {trade.notes.length > 30 ? `${trade.notes.substring(0, 30)}...` : trade.notes}
                        </span>
                        {trade.notes.length > 30 && (
                          <span
                            className="notes-expand"
                            title="Click to view full notes"
                            onClick={() => {
                              setNotesModalTrade(trade);
                              setShowNotesModal(true);
                            }}
                          >
                            📝
                          </span>
                        )}
                      </div>
                    ) : '-'}
                  </td>
                  <td>{trade.exit_price ? `$${trade.exit_price}` : '-'}</td>
                   <td className={`exit-reason ${trade.exit_reason || ''}`}>
                     {trade.exit_reason ? trade.exit_reason.replace('_', ' ').toUpperCase() : '-'}
                   </td>
                   <td>{new Date(trade.entry_time).toLocaleDateString()}</td>
                  <td>{trade.exit_time ? new Date(trade.exit_time).toLocaleDateString() : '-'}</td>
                  <td className={`pnl ${trade.pnl >= 0 ? 'positive' : 'negative'}`}>
                    {trade.pnl ? (
                      <span title={`P&L Breakdown: ${trade.side === 'buy' ?
                        `(${trade.exit_price} - ${trade.entry_price}) × ${trade.quantity} × ${trade.lot_size} = $${trade.pnl.toFixed(2)}` :
                        `(${trade.entry_price} - ${trade.exit_price}) × ${trade.quantity} × ${trade.lot_size} = $${trade.pnl.toFixed(2)}`
                      }`}>
                        ${trade.pnl.toFixed(2)}
                      </span>
                    ) : '-'}
                  </td>
                  <td className={`status ${trade.is_closed ? 'closed' : 'open'}`}>
                    {trade.is_closed ? 'Closed' : 'Open'}
                  </td>
                  <td className="actions">
                    {!trade.is_closed && (
                      <button
                        className="action-btn close-btn"
                        onClick={() => handleCloseTrade(trade)}
                      >
                        Close
                      </button>
                    )}
                    <button
                      className="action-btn delete-btn"
                      onClick={() => handleDeleteTrade(trade)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
                     </table>
         </div>

         {/* Pagination */}
         <Pagination
           currentPage={currentPage}
           totalPages={totalPages}
           totalItems={totalItems}
           itemsPerPage={itemsPerPage}
           onPageChange={handlePageChange}
           onItemsPerPageChange={handleItemsPerPageChange}
         />
       </div>

      <CloseTradeModal
        isOpen={showCloseModal}
        onClose={() => {
          setShowCloseModal(false);
          setCloseModalTrade(null);
        }}
        onSubmit={handleCloseModalSubmit}
        trade={closeModalTrade}
      />

      <DeleteTradeModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeleteModalTrade(null);
        }}
        onConfirm={handleDeleteConfirm}
        trade={deleteModalTrade}
        isLoading={false}
              />

      <NotesModal
        isOpen={showNotesModal}
        onClose={() => {
          setShowNotesModal(false);
          setNotesModalTrade(null);
        }}
        notes={notesModalTrade?.notes}
        tradeInfo={notesModalTrade}
      />
    </>
  );
};

export default TradesTable;
