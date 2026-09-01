import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'

// Page Components
import RoleSelectionPage from './pages/RoleSelectionPage'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'

/**
 * Main Application Router Component
 * Coordinates routing between Role Selection, Credentials Login, and Dashboard
 */
function App() {
  return (
    <Routes>
      {/* 1st Page: Officer Role Selection */}
      <Route path="/" element={<RoleSelectionPage />} />

      {/* 2nd Page: Officer Credentials Verification */}
      <Route path="/login/:roleId" element={<LoginPage />} />

      {/* 3rd Page: Case Files & Directives Dashboard */}
      <Route path="/dashboard/:roleId" element={<DashboardPage />} />

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
