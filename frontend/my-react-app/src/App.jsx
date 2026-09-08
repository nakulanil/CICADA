import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'

// Modular Page Components
import LandingPage from './pages/LandingPage'
import RegistrationPage from './pages/RegistrationPage'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'

/**
 * Main Application Router Component
 * Coordinates routing across C-DAC DEMS pages:
 * 1. Landing Page (`/`): Product overview & Entry points
 * 2. Registration Page (`/register`): Dynamic Organization & Role dropdown registration
 * 3. Login Page (`/login`): Direct credentials authentication (Station LAN removed)
 * 4. Dashboard Page (`/dashboard`): Home page with Search, Progress filters, and Case Notepad
 */
function App() {
  return (
    <Routes>
      {/* 1. C-DAC DEMS Product Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* 2. Stakeholder Registration Page */}
      <Route path="/register" element={<RegistrationPage />} />

      {/* 3. Stakeholder Login Page */}
      <Route path="/login" element={<LoginPage />} />

      {/* 4. Case Management & Investigation Notepad Dashboard */}
      <Route path="/dashboard" element={<DashboardPage />} />

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
