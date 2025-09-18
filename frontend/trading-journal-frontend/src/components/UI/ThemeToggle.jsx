import React, { useState } from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import './ThemeToggle.css'

const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme()
  const [isAnimating, setIsAnimating] = useState(false)

  const handleToggle = () => {
    setIsAnimating(true)
    toggleTheme()

    // Reset animation after transition completes
    setTimeout(() => {
      setIsAnimating(false)
    }, 300)
  }

  return (
    <div className={`theme-slider-container ${className}`}>
      <button
        className="theme-slider"
        onClick={handleToggle}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        role="switch"
        aria-checked={theme === 'dark'}
      >
        <div className={`theme-slider-track ${isAnimating ? 'changing' : ''}`}>
          <div
            className="theme-slider-thumb"
            style={{
              transform:
                theme === 'dark' ? 'translateX(28px)' : 'translateX(0px)',
            }}
          >
            <span className="theme-slider-icon">
              {theme === 'light' ? '☀️' : '🌙'}
            </span>
          </div>
        </div>
      </button>
    </div>
  )
}

export default ThemeToggle
