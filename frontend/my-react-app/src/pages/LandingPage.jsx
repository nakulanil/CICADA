import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import HeroSection from '../components/HeroSection'
import FeatureRibbon from '../components/FeatureRibbon'
import AdvisoryBar from '../components/AdvisoryBar'
import AboutSection from '../components/AboutSection'
import WhatWeDoSection from '../components/WhatWeDoSection'
import ContactSection from '../components/ContactSection'
import Footer from '../components/Footer'
import LoginModal from '../components/LoginModal'
import RegisterModal from '../components/RegisterModal'

/**
 * DEMS Landing Page (Figma Page 1 Specification)
 * Complete implementation of Frame 1 & Frame 2 with interactive auth modals (Frames 3 & 4)
 */
export default function LandingPage() {
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')

  const handleNavClick = (sectionId) => {
    setActiveSection(sectionId.replace('-section', ''))
    const elem = document.getElementById(sectionId)
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="dems-landing-page-root">
      {/* 1. Universal Top Header & Navbar */}
      <Navbar
        activePage={activeSection}
        onNavClick={handleNavClick}
        onOpenLogin={() => {
          setIsRegisterOpen(false)
          setIsLoginOpen(true)
        }}
        onOpenRegister={() => {
          setIsLoginOpen(false)
          setIsRegisterOpen(true)
        }}
      />

      {/* 2. Hero Section with Secretariat Background (Frame 1) */}
      <HeroSection
        onOpenLogin={() => {
          setIsRegisterOpen(false)
          setIsLoginOpen(true)
        }}
        onOpenRegister={() => {
          setIsLoginOpen(false)
          setIsRegisterOpen(true)
        }}
      />

      {/* 3. Floating 4-Feature Card Ribbon (Frame 1) */}
      <FeatureRibbon />

      {/* 4. Golden Ochre Advisory Strip (Frame 1) */}
      <AdvisoryBar />

      {/* 5. ABOUT US & Dual Navy Cards Section (Frame 2) */}
      <AboutSection />

      {/* 6. "What we do" 4-Pillars Section (Frame 2) */}
      <WhatWeDoSection />

      {/* 7. CONTACT US Section (Frame 2) */}
      <ContactSection />

      {/* 8. Official Government Footer */}
      <Footer />

      {/* Frame 3: Officer Login Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSwitchToRegister={() => {
          setIsLoginOpen(false)
          setIsRegisterOpen(true)
        }}
      />

      {/* Frame 4: Officer Registration Modal */}
      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSwitchToLogin={() => {
          setIsRegisterOpen(false)
          setIsLoginOpen(true)
        }}
      />
    </div>
  )
}
