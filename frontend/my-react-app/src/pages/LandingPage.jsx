import React, { useEffect, useRef, useState } from 'react'
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

function PublicUtilityIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M9.7 9a2.5 2.5 0 1 1 4.3 1.7c-1.2 1.2-2 1.4-2 3M12 17h.01" /></svg>
}

function PublicUtilityBar({ language, onLanguageChange, onContact }) {
  const [openPanel, setOpenPanel] = useState(null)
  const actionsRef = useRef(null)
  const labels = language === 'hi'
    ? { help: 'मदद', language: 'भाषा', english: 'English', hindi: 'हिंदी', government: 'भारत सरकार' }
    : { help: 'Help', language: 'Language', english: 'English', hindi: 'हिंदी', government: 'Government of India' }

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (actionsRef.current && !actionsRef.current.contains(event.target)) setOpenPanel(null)
    }
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setOpenPanel(null)
    }
    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <div className="public-utility-bar">
      <div className="site-container public-utility-inner">
        <span className="public-utility-government">{labels.government}</span>
        <div ref={actionsRef} className="public-utility-actions" aria-label={labels.language}>
          <button type="button" className="public-utility-button public-utility-text-button" aria-label={labels.help} title={labels.help} onClick={onContact}>
            <PublicUtilityIcon />
            <span>{labels.help}</span>
          </button>

          <div className="public-utility-control">
            <button type="button" className="public-utility-button public-utility-language-button" aria-label={labels.language} title={labels.language} aria-expanded={openPanel === 'language'} onClick={() => setOpenPanel(openPanel === 'language' ? null : 'language')}>
              <span>अ / A</span>
            </button>
            {openPanel === 'language' && (
              <div className="public-utility-panel" role="dialog" aria-label={labels.language}>
                <strong>{labels.language}</strong>
                <button type="button" className={language === 'en' ? 'is-selected' : ''} onClick={() => { onLanguageChange('en'); setOpenPanel(null) }}>{labels.english}</button>
                <button type="button" className={language === 'hi' ? 'is-selected' : ''} onClick={() => { onLanguageChange('hi'); setOpenPanel(null) }}>{labels.hindi}</button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

const LANDING_COPY = {
  en: {
    nav: { home: 'HOME', about: 'ABOUT US', contact: 'CONTACT US' },
    hero: { title: 'Welcome to e-SAKSHYA', description: 'Secure, auditable digital evidence and case-document workflows across Police, Forensics, Prosecution, and Judiciary.', register: 'Register', login: 'Login' },
    features: [['Chain of Custody', 'Tamper-proof audit logs'], ['Automated Reporting & Logs', 'Standardized compliance exports'], ['Real-Time Evidence Tracking', 'Live custody status & exhibits'], ['Role-Based Access Control', 'Zero-trust multi-agency clearance']],
    advisory: 'An authenticated, secure platform for Law Enforcement, Forensics, Prosecution, and Judiciary to manage, store, and transfer digital evidence with complete cryptographic integrity.',
    about: { title: 'ABOUT US', lead: 'e-SAKSHYA serves as a secure, tamper-evident digital repository for law enforcement, forensics, prosecution, and courts to share, collaborate, authenticate, and manage digital and physical evidence.', missionTitle: 'Our Mission', mission: 'Empower police investigating officers, forensic examiners, prosecutors, and judges with a unified, tamper-evident digital custody ecosystem that accelerates case disposal, eliminates evidence tampering, and upholds constitutional due process.', trustTitle: 'Built for Trust', trust: 'Engineered with zero-trust role-based access, SHA-256 bit-stream integrity verification, automated digital seal certificates, and permanent tamper-proof ledger logging compliant with statutory evidence admissibility standards.' },
    what: { title: 'What we do', lead: 'Across the country, e-SAKSHYA provides a common platform to manage and track digital evidence:', bullets: ['Maintain a complete, tamper-evident audit trail for every piece of evidence.', 'Enable seamless collaboration between police stations, forensic labs, medical departments, and prosecution offices.', 'Support comprehensive custody lifecycle tracking, ensuring original records are never altered.', 'Deliver verified digital certificates and files to the judiciary, making evidence admissible in a court of law.'] },
    contact: { title: 'CONTACT US', lead: 'For queries, feedback, or technical support regarding e-SAKSHYA, reach out to the project team:', email: 'Email:', project: 'Project:', prototype: 'Prototype note:', projectValue: 'Smart India Hackathon 2026 — Team CICADA', prototypeValue: "This is a prototype developed for Smart India Hackathon. For production deployment, this section would be replaced with the responsible ministry's official support channels." },
    footer: { agency: 'Ministry of Home Affairs • Government of India', compliance: 'Compliant with Section 65B Indian Evidence Act & Bharatiya Sakshya Adhiniyam (BSA) 2023', rights: 'National Informatics Centre & Ministry of Home Affairs. All rights reserved.' },
  },
  hi: {
    nav: { home: 'होम', about: 'हमारे बारे में', contact: 'संपर्क करें' },
    hero: { title: 'e-SAKSHYA में आपका स्वागत है', description: 'पुलिस, फोरेंसिक, अभियोजन और न्यायपालिका के लिए सुरक्षित, ऑडिट योग्य डिजिटल साक्ष्य और केस-दस्तावेज़ कार्यप्रवाह।', register: 'पंजीकरण', login: 'लॉगिन' },
    features: [['कस्टडी की श्रृंखला', 'छेड़छाड़-रोधी ऑडिट लॉग'], ['स्वचालित रिपोर्टिंग और लॉग', 'मानकीकृत अनुपालन निर्यात'], ['रीयल-टाइम साक्ष्य ट्रैकिंग', 'लाइव कस्टडी स्थिति और प्रदर्श'], ['भूमिका-आधारित अभिगम नियंत्रण', 'शून्य-विश्वास बहु-एजेंसी मंजूरी']],
    advisory: 'कानून प्रवर्तन, फोरेंसिक, अभियोजन और न्यायपालिका के लिए पूर्ण क्रिप्टोग्राफिक अखंडता के साथ डिजिटल साक्ष्य का प्रबंधन, संग्रह और हस्तांतरण करने का प्रमाणित, सुरक्षित मंच।',
    about: { title: 'हमारे बारे में', lead: 'e-SAKSHYA कानून प्रवर्तन, फोरेंसिक, अभियोजन और न्यायालयों के लिए डिजिटल और भौतिक साक्ष्य साझा करने, सहयोग करने, प्रमाणित करने और प्रबंधित करने का सुरक्षित, छेड़छाड़-स्पष्ट डिजिटल भंडार है।', missionTitle: 'हमारा मिशन', mission: 'पुलिस जांच अधिकारियों, फोरेंसिक परीक्षकों, अभियोजकों और न्यायाधीशों को एकीकृत, छेड़छाड़-स्पष्ट डिजिटल कस्टडी तंत्र से सक्षम बनाना, जो मामलों के निपटारे में तेजी लाए, साक्ष्य से छेड़छाड़ रोके और संवैधानिक उचित प्रक्रिया बनाए रखे।', trustTitle: 'विश्वास के लिए निर्मित', trust: 'शून्य-विश्वास भूमिका-आधारित अभिगम, SHA-256 बिट-स्ट्रीम अखंडता सत्यापन, स्वचालित डिजिटल सील प्रमाणपत्र और वैधानिक साक्ष्य स्वीकार्यता मानकों के अनुरूप स्थायी छेड़छाड़-रोधी लेजर लॉगिंग के साथ निर्मित।' },
    what: { title: 'हम क्या करते हैं', lead: 'पूरे देश में e-SAKSHYA डिजिटल साक्ष्य के प्रबंधन और ट्रैकिंग के लिए एक साझा मंच प्रदान करता है:', bullets: ['हर साक्ष्य के लिए पूर्ण, छेड़छाड़-स्पष्ट ऑडिट ट्रेल बनाए रखना।', 'पुलिस थानों, फोरेंसिक प्रयोगशालाओं, चिकित्सा विभागों और अभियोजन कार्यालयों के बीच सहज सहयोग सक्षम करना।', 'व्यापक कस्टडी जीवनचक्र ट्रैकिंग का समर्थन करना और मूल रिकॉर्ड में बदलाव रोकना।', 'न्यायपालिका को सत्यापित डिजिटल प्रमाणपत्र और फाइलें उपलब्ध कराना, ताकि साक्ष्य न्यायालय में स्वीकार्य हो।'] },
    contact: { title: 'संपर्क करें', lead: 'e-SAKSHYA से संबंधित प्रश्नों, प्रतिक्रिया या तकनीकी सहायता के लिए परियोजना टीम से संपर्क करें:', email: 'ईमेल:', project: 'परियोजना:', prototype: 'प्रोटोटाइप नोट:', projectValue: 'स्मार्ट इंडिया हैकाथॉन 2026 — टीम CICADA', prototypeValue: 'यह स्मार्ट इंडिया हैकाथॉन के लिए विकसित एक प्रोटोटाइप है। उत्पादन परिनियोजन के लिए इस अनुभाग को संबंधित मंत्रालय के आधिकारिक सहायता चैनलों से बदला जाएगा।' },
    footer: { agency: 'गृह मंत्रालय • भारत सरकार', compliance: 'भारतीय साक्ष्य अधिनियम की धारा 65B और भारतीय साक्ष्य अधिनियम (BSA) 2023 के अनुरूप', rights: 'राष्ट्रीय सूचना विज्ञान केंद्र और गृह मंत्रालय। सर्वाधिकार सुरक्षित।' },
  },
}

/**
 * DEMS Landing Page (Figma Page 1 Specification)
 * Complete implementation of Frame 1 & Frame 2 with interactive auth modals (Frames 3 & 4)
 */
export default function LandingPage() {
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [language, setLanguage] = useState('en')
  const copy = LANDING_COPY[language]

  const handleNavClick = (sectionId) => {
    setActiveSection(sectionId.replace('-section', ''))
    const elem = document.getElementById(sectionId)
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const openContact = () => handleNavClick('contact-section')

  return (
    <div className="dems-landing-page-root">
      <PublicUtilityBar
        language={language}
        onLanguageChange={setLanguage}
        onContact={openContact}
      />
      {/* 1. Universal Top Header & Navbar */}
      <Navbar
        activePage={activeSection}
        onNavClick={handleNavClick}
        copy={copy.nav}
      />

      {/* 2. Hero Section with Secretariat Background (Frame 1) */}
      <HeroSection
        copy={copy.hero}
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
      <FeatureRibbon copy={copy.features} />

      {/* 4. Golden Ochre Advisory Strip (Frame 1) */}
      <AdvisoryBar copy={copy.advisory} />

      {/* 5. ABOUT US & Dual Navy Cards Section (Frame 2) */}
      <AboutSection copy={copy.about} />

      {/* 6. "What we do" 4-Pillars Section (Frame 2) */}
      <WhatWeDoSection copy={copy.what} />

      {/* 7. CONTACT US Section (Frame 2) */}
      <ContactSection copy={copy.contact} />

      {/* 8. Official Government Footer */}
      <Footer copy={copy.footer} />

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
