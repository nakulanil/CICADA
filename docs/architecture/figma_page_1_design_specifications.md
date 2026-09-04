# DEMS Website - Figma Page 1 Design Specifications & Component Architecture

This document contains the complete design analysis and layout specifications extracted from **Page 1** of the Figma design file for the **Digital Evidence Management System (DEMS)** under the **Ministry of Home Affairs, Government of India**.

---

## 1. Executive Summary & Page 1 Layout Structure

Page 1 defines a complete, modern government-grade web application across **7 core visual frames/views**:

```
+---------------------------------------------------------------------------------------------------------+
|                                    PAGE 1 FIGMA LAYOUT OVERVIEW                                         |
+------------------------------------+------------------------------------+-------------------------------+
| Frame 1: DEMS Landing Hero         | Frame 3: Officer Login Modal       | Frame 5: Main Dashboard Grid  |
| - Top Gov Header & Nav             | - Blurred Secretariat Backdrop     | - Full-width Gov Header       |
| - Indian Secretariat Hero Image    | - Centered White Auth Dialog       | - Officer Greeting Ribbon     |
| - White Floating 4-Feature Ribbon  | - Username / Email & Password      | - Search & Progress Tabs      |
| - Ochre Advisory Bar               | - Blue Action Button               | - Dual Case Columns           |
+------------------------------------+------------------------------------+-------------------------------+
| Frame 2: About & Contact Extended  | Frame 4: Officer Register Modal    | Frame 6: Case Dossier & Notes |
| - Gold "ABOUT US" Heading          | - Multi-Field Officer Form         | - 3-Column Master Layout      |
| - Dual Navy Cards (Mission/Trust)  | - Department & Rank Selection      | - Left: Case Selector Sidebar |
| - "What we do" Bullet List         | - Clearance Certification          | - Center: Seized Evidence Log |
| - "CONTACT US" Official Directory  | - Submit with Hover/Click States   | - Right: Live Officer Notepad |
+------------------------------------+------------------------------------+-------------------------------+
|                                                                         | Frame 7: Profile Dialog       |
|                                                                         | - Officer Settings Modal      |
|                                                                         | - 2-Column Credential Form    |
+-------------------------------------------------------------------------+-------------------------------+
```

---

## 2. Global Design System & Token Specifications

### 2.1 Color Palette

| Token Name | Hex Code | Purpose / Usage |
| :--- | :--- | :--- |
| `--color-navy-dark` | `#0A2540` | Main top dashboard header background, high-contrast dark bars |
| `--color-navy-primary` | `#0E3366` | Primary brand color, navbar, modal title strips, mission cards, submit buttons |
| `--color-slate-blue` | `#17375E` | Sub-header officer ribbon, secondary action buttons |
| `--color-ochre-gold` | `#B37D2E` | "ABOUT US" header, "CONTACT US" header, Confidential Case column banner |
| `--color-ochre-gold-light` | `#C5832B` | Hover states for ochre elements, accent borders |
| `--color-green-active` | `#10B981` | "Active" case status badge, hash verification checkmark |
| `--color-green-active-bg` | `#ECFDF5` | Background for verified/active status pills |
| `--color-amber-priority` | `#F59E0B` | "Confidential / High Priority" badge |
| `--color-amber-priority-bg`| `#FEF3C7` | Background for confidential status pills |
| `--color-bg-page` | `#F4F6F9` | Neutral light dashboard and page background |
| `--color-bg-card` | `#FFFFFF` | White container cards, modal dialogs, and feature boxes |
| `--color-input-bg` | `#F1F5F9` | Form input background color |
| `--color-input-border` | `#CBD5E1` | Form input border |
| `--color-input-border-focus`| `#0E3366` | Form input active focus ring |
| `--color-text-primary` | `#0F172A` | High-contrast body and heading text |
| `--color-text-muted` | `#64748B` | Subtitles, helper text, and secondary metadata |

### 2.2 Typography Hierarchy

- **Font Family**: `"Inter"`, `-apple-system`, `BlinkMacSystemFont`, `"Segoe UI"`, `Roboto`, `sans-serif`
- **Hero Title**: `32px` – `36px` | Weight: `700` (Bold) | Line Height: `1.25` | Color: `#FFFFFF`
- **Section Headers** (`ABOUT US`, `CONTACT US`): `26px` – `28px` | Weight: `700` | Uppercase | Letter Spacing: `1px` | Color: `#B37D2E`
- **Sub-Section Headers** (`What we do`): `22px` – `24px` | Weight: `700` | Color: `#0E3366`
- **Modal Headers**: `18px` – `20px` | Weight: `700` | Uppercase | Color: `#FFFFFF`
- **Card Titles / FIR Tags**: `15px` – `16px` | Weight: `700` | Uppercase | Color: `#0F172A`
- **Body & Description**: `14px` | Weight: `400` / `500` | Line Height: `1.6` | Color: `#334155`
- **Pills / Badges**: `11px` – `12px` | Weight: `600` | Uppercase | Letter Spacing: `0.5px`

---

## 3. View-by-View Detailed Specifications

### View 1: Landing Page - Hero & Quick Features (Frame 1)

1. **Top Universal Header**:
   - Left: Ashoka Lion Emblem + bold title **"DEMS"** + subtitle **"MINISTRY OF HOME AFFAIRS"**.
   - Right: Navigation links `HOME ⌵`, `ABOUT US ⌵`, `CONTACT US ⌵` (gold highlight on active).
2. **Hero Image Banner**:
   - Photographic background of the Government Secretariat (North/South Block, New Delhi).
   - Semi-transparent gradient overlay for text legibility.
   - Text: *"Welcome to the Digital Evidence Management System"* + *"A unified platform for secure, tamper-evident digital evidence workflow across agencies."*
   - Buttons: `[ Register ]` and `[ Login ]` (Navy blue with subtle hover glow).
3. **Floating 4-Feature Card Ribbon**:
   - Elevated white container card with 4 columns:
     1. 🏛️ **Chain of Custody** – Cryptographic verification and tamper-proof trail.
     2. 📋 **Automated Reporting & Logs** – Automated compliance & export ready.
     3. 🔍 **Real-Time Evidence Tracking** – Live custody status and item logging.
     4. 👥 **Role-Based Access Control** – Inter-agency zero-trust clearance.
4. **Golden Ochre Advisory Strip**:
   - Background `#B37D2E` with advisory text and official portal disclaimer.

---

### View 2: About Us, Mission & Contact Directory (Frame 2)

1. **"ABOUT US" Header & Intro**:
   - Gold/Ochre title `#B37D2E`.
   - Comprehensive overview paragraph highlighting DEMS as the national backbone for digital evidence integrity.
2. **Dual High-Contrast Navy Feature Cards**:
   - Two equal-width cards in `#0E3366` with white text:
     - **Card A: "Our Mission"**: Empowering law enforcement, forensic labs, and the judiciary with immutable evidence management and expedited justice delivery.
     - **Card B: "Built for Trust"**: Zero-trust architecture, SHA-256 cryptographic hashing, and automated immutable audit logging.
3. **"What we do" Section**:
   - Heading `#0E3366`.
   - 4 clear bullet points covering audit trails, cross-agency collaboration, tamper-evident handling, and statutory court compliance (IEA / IT Act).
4. **"CONTACT US" Section**:
   - Heading `#B37D2E`.
   - Official address: North Block, Central Secretariat, New Delhi - 110001.
   - Support Email: `support.dems@gov.in` | Toll-Free: `1800-11-DEMS (3367)`.

---

### View 3 & 4: Authentication & Registration Modals (Frames 3 & 4)

1. **Login Modal**:
   - Blurred background of Secretariat building.
   - Header: **LOGIN** with Key icon 🔑.
   - Inputs: Username/Official Email and Password.
   - Action: `[ Sign In ➔ ]` in `#0E3366`.
   - Quick Demo Profile Switcher buttons for instant testing.
2. **Registration Modal**:
   - Centered white modal with User Badge icon 👤.
   - Input Grid: Full Name, Official Email (`@gov.in`), Officer ID / Badge No, Department, Unit / Station, Password, Confirm Password.
   - Action: `[ Register Official Account ]`.

---

### View 5: Master Dashboard & Dual-Column Case Grid (Frame 5)

1. **Top Dashboard Header**:
   - Navy background `#0A2540` with emblem and title **"DIGITAL EVIDENCE MANAGEMENT SYSTEM"**.
   - User profile badge & Logout button on right.
2. **Officer Greeting Ribbon**:
   - Slate blue `#17375E` banner: **"Welcome! Jane Doe"** (or logged-in officer), Officer Rank & Department.
3. **Search & Progress Tabs**:
   - Full-width search bar with magnifying glass icon.
   - Status Tabs: `All`, `Active`, `Under Investigation`, `In Court`, `Closed`, `Archived` with numeric count badges.
4. **Dual Column Case Layout**:
   - **Left Column: "DEMS Pending and Active Files ▾"** (Blue Banner `#0E3366`):
     - Displays self-assigned / primary active investigation cases with Green `ACTIVE` status pills.
   - **Right Column: "Special - Confidential Case Files ▾"** (Gold Banner `#B37D2E`):
     - Displays confidential / supervisory delegated cases with Amber `CONFIDENTIAL` status pills.

---

### View 6: Case Dossier & Live Notepad Modal (Frame 6)

1. **3-Column Dossier Layout**:
   - **Left Column**: Case selector sidebar with colored badges (`Active`, `High Priority`, `In Review`).
   - **Center Column**:
     - Case Summary & FIR Reference metadata.
     - Seized Physical & Digital Evidence list with SHA-256 hash verification indicators.
     - Metric Badges: **9** Evidence Files | **14** Chain of Custody Logs.
     - Timestamped Audit Trail.
   - **Right Column (Live Investigator Notepad)**:
     - Interactive notepad textarea for real-time note-taking.
     - Quick formatting tools (Bold, Italic, Timestamp, Add Note).
     - Persisted list of notes with timestamps and delete buttons.

---

### View 7: Officer Profile & Account Settings (Frame 7)

1. **Modal Header**: Navy blue header `#0E3366` with **"OFFICER PROFILE AND ACCOUNT SETTINGS"** and close button `✕`.
2. **Form Layout**: 2-column input fields for First Name, Last Name, Officer ID, Badge No, Email, Phone, Cadre, and Clearance Level.
3. **Action**: `[ Save & Update Changes ]` button.

---

## 4. Interaction & Animation Requirements

1. **Hover Animations**:
   - Buttons: `transform: translateY(-2px); box-shadow: 0 4px 12px rgba(14, 51, 102, 0.25); transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1)`.
   - Cards: `transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12)`.
   - Feature Ribbon Items: `transform: translateY(-2px); border-bottom: 2px solid #0E3366`.
2. **Click / Active Animations**:
   - Buttons: `transform: scale(0.97) translateY(0px); box-shadow: 0 2px 4px rgba(14, 51, 102, 0.15)`.
3. **Modal Entry Animations**:
   - Keyframe animation: `opacity: 0 -> 1` and `transform: translateY(20px) scale(0.98) -> translateY(0) scale(1)`.
   - Duration: `0.28s cubic-bezier(0.16, 1, 0.3, 1)`.
