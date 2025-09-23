import React, { useState } from 'react'

const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage = 10,
  onPageChange,
  onItemsPerPageChange,
}) => {
  const [showPageInput, setShowPageInput] = useState(false)
  const [inputPage, setInputPage] = useState('')
  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Show smart pagination with ellipsis
      if (currentPage <= 3) {
        // Near start: show first 3 + ... + last
        for (let i = 1; i <= 3; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        // Near end: show first + ... + last 3
        pages.push(1)
        pages.push('...')
        for (let i = totalPages - 2; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        // Middle: show first + ... + current ± 1 + ... + last
        pages.push(1)
        pages.push('...')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      }
    }

    return pages
  }

  const handlePageChange = (page) => {
    if (page === '...') {
      setShowPageInput(true)
      setInputPage('')
    } else if (page !== currentPage) {
      onPageChange(page)
    }
  }

  const handlePageInputSubmit = (e) => {
    e.preventDefault()
    const pageNumber = parseInt(inputPage)
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      onPageChange(pageNumber)
      setShowPageInput(false)
      setInputPage('')
    }
  }

  const handlePageInputCancel = () => {
    setShowPageInput(false)
    setInputPage('')
  }

  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = parseInt(e.target.value)
    onItemsPerPageChange(newItemsPerPage)
  }

  // Always show pagination info and items-per-page selector
  // Only hide page navigation when there's only one page
  const showPageNavigation = totalPages > 1

  return (
    <div className="pagination">
      <div className="pagination-info">
        <span>
          Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
          {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}{' '}
          trades
        </span>
      </div>

      <div className="pagination-controls">
        <div className="items-per-page">
          <label htmlFor="items-per-page">Items per page:</label>
          <select
            id="items-per-page"
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={200}>200</option>
          </select>
        </div>

        {showPageNavigation && (
          <div className="page-navigation">
            <button
              className="pagination-btn"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              title="First page"
            >
              «
            </button>

            <button
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              title="Previous page"
            >
              ‹
            </button>

            {getPageNumbers().map((page, index) => (
              <button
                key={index}
                className={`pagination-btn ${
                  page === currentPage ? 'active' : ''
                } ${page === '...' ? 'ellipsis' : ''}`}
                onClick={() => handlePageChange(page)}
                title={page === '...' ? 'Click to enter page number' : ''}
              >
                {page}
              </button>
            ))}

            <button
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              title="Next page"
            >
              ›
            </button>

            <button
              className="pagination-btn"
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              title="Last page"
            >
              »
            </button>
          </div>
        )}
      </div>

      {showPageInput && (
        <div className="page-input-modal">
          <div className="page-input-content">
            <h4>Go to Page</h4>
            <form onSubmit={handlePageInputSubmit}>
              <input
                type="number"
                min="1"
                max={totalPages}
                value={inputPage}
                onChange={(e) => setInputPage(e.target.value)}
                placeholder={`Enter page (1-${totalPages})`}
                autoFocus
                className="page-input"
              />
              <div className="page-input-actions">
                <button type="submit" className="btn btn-primary btn-sm">
                  Go
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={handlePageInputCancel}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Pagination
