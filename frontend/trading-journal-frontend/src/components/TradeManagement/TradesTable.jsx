import React, { useState } from 'react'
import CloseTradeModal from './CloseTradeModal'
import DeleteTradeModal from './DeleteTradeModal'
import NotesModal from './NotesModal'
import { Pagination } from '../UI'
import useScrollToTop from '../../hooks/useScrollToTop'

const TradesTable = ({ trades, onCloseTrade, onDeleteTrade }) => {
  const [closeModalTrade, setCloseModalTrade] = useState(null)
  const [showCloseModal, setShowCloseModal] = useState(false)
  const [deleteModalTrade, setDeleteModalTrade] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [notesModalTrade, setNotesModalTrade] = useState(null)
  const [showNotesModal, setShowNotesModal] = useState(false)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(50)

  // Calculate pagination values
  const totalItems = trades.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentTrades = trades.slice(startIndex, endIndex)

  // Scroll to top when modals open (for better UX)
  useScrollToTop(showCloseModal || showDeleteModal || showNotesModal)

  // Handle page changes
  const handlePageChange = (page) => {
    setCurrentPage(page)
    // Scroll to top of table
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Handle items per page changes
  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage)
    setCurrentPage(1) // Reset to first page
  }

  const handleCloseTrade = (trade) => {
    setCloseModalTrade(trade)
    setShowCloseModal(true)
  }

  const handleDeleteTrade = (trade) => {
    setDeleteModalTrade(trade)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      await onDeleteTrade(deleteModalTrade.id)
      setShowDeleteModal(false)
      setDeleteModalTrade(null)
    } catch (error) {
      // Error is handled by the mutation
    }
  }

  const handleCloseModalSubmit = async (data) => {
    try {
      await onCloseTrade(data)
      setShowCloseModal(false)
      setCloseModalTrade(null)
    } catch (error) {
      throw error
    }
  }

  return (
    <>
      <div className="trades-section">
        <h2>Trade History</h2>
        <div className="trades-table-container">
          <table className="trades-table">
            <thead>
              <tr>
                <th scope="col">Symbol</th>
                <th scope="col">Side</th>
                <th scope="col">Quantity</th>
                <th scope="col">Lot Size</th>
                <th scope="col">Entry Price</th>
                <th scope="col">Stop Loss</th>
                <th scope="col">Take Profit</th>
                <th scope="col">Grade</th>
                <th scope="col">Notes</th>
                <th scope="col">Exit Price</th>
                <th scope="col">Exit Reason</th>
                <th scope="col">Entry Time</th>
                <th scope="col">Exit Time</th>
                <th scope="col">
                  P&L
                  <span
                    className="info-tooltip"
                    title="P&L = (Exit Price - Entry Price) × Quantity × Lot Size"
                    aria-label="Profit and Loss calculation formula"
                  >
                    ℹ️
                  </span>
                </th>
                <th scope="col">Status</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentTrades.map((trade) => (
                <tr key={trade.id}>
                  <td className="symbol">{trade.symbol}</td>
                  <td className={`side ${trade.side}`}>
                    {trade.side.toUpperCase()}
                  </td>
                  <td>{trade.quantity}</td>
                  <td>{trade.lot_size}</td>
                  <td>${parseFloat(trade.entry_price).toFixed(4)}</td>
                  <td>${parseFloat(trade.stop_loss).toFixed(4)}</td>
                  <td>${parseFloat(trade.take_profit).toFixed(4)}</td>
                  <td
                    className={`checklist-grade ${
                      trade.checklist_grade || 'no-grade'
                    }`}
                  >
                    {trade.checklist_grade || '-'}
                  </td>
                  <td className="notes-cell">
                    {trade.notes ? (
                      <div
                        className="notes-content"
                        onClick={() => {
                          setNotesModalTrade(trade)
                          setShowNotesModal(true)
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            setNotesModalTrade(trade)
                            setShowNotesModal(true)
                          }
                        }}
                        title="Click to view full notes"
                        role="button"
                        tabIndex={0}
                        aria-label={`View notes for trade ${trade.symbol} ${trade.side}`}
                      >
                        <span className="notes-preview">
                          {trade.notes.length > 30
                            ? `${trade.notes.substring(0, 30)}...`
                            : trade.notes}
                        </span>
                        {trade.notes.length > 30 && (
                          <span className="notes-expand">📝</span>
                        )}
                      </div>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td>
                    {trade.exit_price
                      ? `$${parseFloat(trade.exit_price).toFixed(4)}`
                      : '-'}
                  </td>
                  <td className={`exit-reason ${trade.exit_reason || ''}`}>
                    {trade.exit_reason
                      ? trade.exit_reason.replace('_', ' ').toUpperCase()
                      : '-'}
                  </td>
                  <td>{new Date(trade.entry_time).toLocaleDateString()}</td>
                  <td>
                    {trade.exit_time
                      ? new Date(trade.exit_time).toLocaleDateString()
                      : '-'}
                  </td>
                  <td
                    className={`pnl ${
                      trade.pnl >= 0 ? 'positive' : 'negative'
                    }`}
                  >
                    {trade.pnl ? (
                      <span
                        title={`P&L Breakdown: ${
                          trade.side === 'buy'
                            ? `(${parseFloat(trade.exit_price).toFixed(
                                4
                              )} - ${parseFloat(trade.entry_price).toFixed(
                                4
                              )}) × ${trade.quantity} × ${
                                trade.lot_size
                              } = $${parseFloat(trade.pnl).toFixed(2)}`
                            : `(${parseFloat(trade.entry_price).toFixed(
                                4
                              )} - ${parseFloat(trade.exit_price).toFixed(
                                4
                              )}) × ${trade.quantity} × ${
                                trade.lot_size
                              } = $${parseFloat(trade.pnl).toFixed(2)}`
                        }`}
                      >
                        ${parseFloat(trade.pnl).toFixed(2)}
                      </span>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td
                    className={`status ${trade.is_closed ? 'closed' : 'open'}`}
                  >
                    {trade.is_closed ? 'Closed' : 'Open'}
                  </td>
                  <td className="actions">
                    {!trade.is_closed && (
                      <button
                        className="action-btn close-btn"
                        onClick={() => handleCloseTrade(trade)}
                        aria-label={`Close trade ${trade.symbol} ${trade.side}`}
                        title={`Close trade ${trade.symbol} ${trade.side}`}
                      >
                        Close
                      </button>
                    )}
                    <button
                      className="action-btn delete-btn"
                      onClick={() => handleDeleteTrade(trade)}
                      aria-label={`Delete trade ${trade.symbol} ${trade.side}`}
                      title={`Delete trade ${trade.symbol} ${trade.side}`}
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
          setShowCloseModal(false)
          setCloseModalTrade(null)
        }}
        onSubmit={handleCloseModalSubmit}
        trade={closeModalTrade}
      />

      <DeleteTradeModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setDeleteModalTrade(null)
        }}
        onConfirm={handleDeleteConfirm}
        trade={deleteModalTrade}
        isLoading={false}
      />

      <NotesModal
        isOpen={showNotesModal}
        onClose={() => {
          setShowNotesModal(false)
          setNotesModalTrade(null)
        }}
        notes={notesModalTrade?.notes}
        tradeInfo={notesModalTrade}
      />
    </>
  )
}

export default TradesTable
