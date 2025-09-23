import React, { useState } from 'react'
import Sidebar from './Sidebar'

const LayoutWrapper = ({ children }) => {
  return (
    <div className="app-layout">
      <main className="main-content">{children}</main>
    </div>
  )
}

export default LayoutWrapper
