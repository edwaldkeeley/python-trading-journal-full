import React, { useState, useEffect } from 'react'
import { ThemeToggle } from '../UI'

const Sidebar = ({
  onAddTrade,
  onGenerateData,
  onClearAll,
  currentPage = 'dashboard',
  onPageChange,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '📊',
      action: () => onPageChange('dashboard'),
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: '📈',
      action: () => onPageChange('analytics'),
    },
    {
      id: 'trades',
      label: 'Trades',
      icon: '📋',
      action: () => onPageChange('trades'),
    },
  ]

  const toolItems = [
    {
      id: 'add-trade',
      label: 'Add Trade',
      icon: '➕',
      action: onAddTrade,
    },
    {
      id: 'generate-data',
      label: 'Generate Data',
      icon: '🎲',
      action: onGenerateData,
    },
    {
      id: 'clear-all',
      label: 'Clear All',
      icon: '🗑️',
      action: onClearAll,
    },
  ]

  if (isCollapsed) {
    return (
      <aside className="sidebar collapsed">
        <div className="sidebar-header">
          <button
            className="sidebar-toggle"
            onClick={() => setIsCollapsed(false)}
            title="Expand sidebar"
          >
            <span className="toggle-icon">▶</span>
          </button>
        </div>
      </aside>
    )
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <span className="brand-icon">📊</span>
          <span className="brand-text">Trading Journal</span>
        </div>
        <button
          className="sidebar-toggle"
          onClick={() => setIsCollapsed(true)}
          title="Collapse sidebar"
        >
          <span className="toggle-icon">◀</span>
        </button>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          <h3 className="nav-section-title">Navigation</h3>
          <ul className="nav-list">
            {navigationItems.map((item) => (
              <li key={item.id}>
                <button
                  className={`nav-item ${
                    currentPage === item.id ? 'active' : ''
                  }`}
                  onClick={item.action}
                  title={item.label}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="nav-section">
          <h3 className="nav-section-title">Tools</h3>
          <ul className="nav-list">
            {toolItems.map((item) => (
              <li key={item.id}>
                <button
                  className="nav-item nav-tool"
                  onClick={item.action}
                  title={item.label}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="sidebar-footer">
        <ThemeToggle />
      </div>
    </aside>
  )
}

export default Sidebar
