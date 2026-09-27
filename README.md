<div align="center">

# 🛡️ CICADA

### Secure Digital Evidence & Case Management System

*Inter-Agency Digital Evidence Management Platform for Secure Case Handling, Evidence Integrity and Chain of Custody*

![Status](https://img.shields.io/badge/STATUS-PROTOTYPE-orange?style=for-the-badge)
![Frontend](https://img.shields.io/badge/FRONTEND-REACT%2019-blue?style=for-the-badge)
![Backend](https://img.shields.io/badge/BACKEND-DJANGO%205.2-green?style=for-the-badge)
![Database](https://img.shields.io/badge/DATABASE-POSTGRESQL-336791?style=for-the-badge)
![Security](https://img.shields.io/badge/SECURITY-RBAC%20%7C%20AUDIT%20%7C%20SHA--256-red?style=for-the-badge)

</div>

---

## Project Overview

**e-Sakshya** is a secure digital case and evidence management system designed to streamline the handling of criminal cases and digital/physical evidence across law-enforcement, forensic, prosecution and judicial stakeholders.

The system provides a centralized environment for managing:

* Case records
* Officers and organizational roles
* Persons associated with a case
* Digital documents and versions
* Physical and digital evidence
* Chain-of-custody events
* Audit trails
* Role-based access
* Investigator case notes

The core objective is to replace fragmented and difficult-to-track evidence workflows with a structured digital system where every case, document and evidence item can be associated with its responsible user, status and history.

---

## The Problem

Traditional evidence and case workflows often involve multiple agencies, physical records, disconnected systems and manual tracking.

This creates challenges such as:

* Difficulty tracking who currently has custody of evidence
* Fragmented case documentation
* Manual record keeping
* Limited visibility across authorized stakeholders
* Risk of inconsistent or outdated document versions
* Difficulty maintaining a complete audit trail
* Delays in sharing information between investigation, forensic and legal teams

e-Sakshya is designed around a **single digital case lifecycle** where evidence and documents remain connected to their cases and every important operation can be recorded and traced.

---

# Key Features

### 🔐 Role-Based Access Control

The system is designed around organization- and role-aware access.

Supported organizational categories include:

* Police
* Forensic Laboratory
* Prosecution
* Court

Roles are associated with individual users and can be used to determine which operations and case information a user is authorized to access.

---

### 📁 Digital Case Management

Each case maintains a structured record containing:

* Unique case number
* Case title
* Case type
* Current status
* Description
* Police station
* Jurisdiction
* Opening and closing timestamps
* Case creator

Cases can move through statuses such as:

```text
ACTIVE
     ↓
UNDER INVESTIGATION
     ↓
IN COURT
     ↓
CLOSED
     ↓
ARCHIVED
```

Cases can also have multiple authorized members with different responsibilities.

---

### 👮 Case Membership & Responsibilities

A case can contain multiple authorized users.

Supported case roles include:

* Lead Investigator
* Supporting Investigator
* Supervisor
* Forensic Officer
* Prosecutor
* Court Staff
* Judge
* Observer

This allows a single case to be handled collaboratively without removing accountability for individual responsibilities.

---

### 📄 Document Management & Versioning

Documents are associated directly with cases and support version tracking.

Example:

```text
Case
 │
 ├── FIR
 ├── Police Report
 ├── Witness Statement
 ├── Charge Sheet
 ├── Forensic Report
 └── Court Filing
```

Each document can contain multiple versions:

```text
Document
   │
   ├── Version 1
   ├── Version 2
   └── Version 3
```

Each version stores metadata such as:

* File path
* SHA-256 hash
* File size
* MIME type
* Uploader
* Upload timestamp

This provides the foundation for tamper-evident document handling.

---

### 🔗 Chain of Custody

A dedicated evidence and custody model is included for tracking the movement of evidence between authorized users.

```text
Evidence Collected
        ↓
     In Custody
        ↓
     Transferred
        ↓
      Received
        ↓
     Submitted
        ↓
     Analyzed
        ↓
     Released
```

Each custody event can record:

* Previous custodian
* New custodian
* Action performed
* Timestamp
* Location
* Reason for transfer
* Integrity hash

This creates a chronological chain of custody for each evidence item.

---

### 🧾 Evidence Integrity

Evidence items can be associated with cryptographic integrity information.

The system models SHA-256 hashes for:

* Document versions
* Evidence-related custody events
* Case evidence records

The intended workflow is:

```text
Evidence / Document
        ↓
   SHA-256 Hash
        ↓
Store Hash + Metadata
        ↓
Later Verification
        ↓
Detect Unexpected Modification
```

---

### 📝 Investigator Notepad

The dashboard includes a case-specific investigator notepad for recording observations and case updates.

Notes can contain:

* Timestamp
* Author
* Text
* Case association

The prototype currently persists these notes locally in the browser while the backend note workflow remains part of the planned system architecture.

---

### 📊 Case Dashboard

The interface provides a dashboard-oriented case workflow with:

* Search
* Case filtering
* Status tabs
* Primary/owned cases
* Delegated cases
* Case summaries
* Evidence counts
* Priority indicators
* Officer information

Cases can be filtered across:

```text
All
Active
Under Investigation
In Court
Closed
Archived
```

---

### 👮 Police Role-Based Dashboard

The prototype includes role-specific police workflows and sample operating data covering ranks such as:

```text
Inspector
Assistant Inspector
Sub-Inspector
Assistant Sub-Inspector
Head Constable
Police Constable
```

The prototype demonstrates different responsibilities including:

* Station supervision
* Investigation
* General diary operations
* Malkhana/evidence custody
* Court process handling
* Beat and field operations

This allows the interface to demonstrate how the same case-management platform can adapt to different operational roles.

---

# System Architecture

```text
┌──────────────────────────────────────────────────────────────────┐
│                         e-SAKSHYA                                 │
│             Secure Digital Case & Evidence System                │
├──────────────────────────────────────────────────────────────────┤
│                          USERS                                   │
│                                                                  │
│  Police      Forensic       Prosecution       Court              │
│    │             │              │               │                │
├────┴─────────────┴──────────────┴───────────────┴────────────────┤
│                      REACT FRONTEND                              │
│                                                                  │
│  Landing • Authentication • Role Selection • Dashboard           │
│  Case Search • Case Dossier • Evidence View • Officer Profile    │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                     DJANGO / DRF BACKEND                         │
│                                                                  │
│  Accounts       Cases       Persons       Documents       Audit    │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                       DATA LAYER                                 │
│                                                                  │
│                 PostgreSQL Database                              │
│                                                                  │
│   Users ── Cases ── Documents ── Evidence ── Custody Events      │
│                │                         │                       │
│                └──────── Audit Logs ─────┘                       │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                    OBJECT STORAGE                                │
│                                                                  │
│                    MinIO / Secure File Storage                   │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

# Core Modules

## 1. Identity & Organization Management

The account system models:

```text
Organization
     │
     ├── Police
     ├── Forensic
     ├── Prosecution
     └── Court

Role
     │
     └── User
```

Each user can be associated with an organization and role.

This provides the foundation for multi-agency access control.

---

## 2. Case Management

The case module manages the central case record.

```text
Case
 ├── Case Members
 ├── Persons
 ├── Documents
 └── Evidence
```

Cases also maintain creator and timestamp metadata for accountability.

---

## 3. Persons & Case Involvement

A person can participate in multiple cases.

Supported involvement types include:

```text
Accused
Victim
Witness
Complainant
Suspect
Other
```

This allows a common person record to be associated with multiple cases without duplicating the underlying personal data.

---

## 4. Document Management

The document module separates the logical document from its versions.

```text
Document
       │
       ├── Version 1
       ├── Version 2
       └── Version N
```

This enables historical version tracking rather than overwriting previous records.

---

## 5. Evidence & Custody Management

Evidence is represented independently from ordinary case documents.

Each evidence item contains:

* Evidence number
* Evidence type
* Description
* Collection details
* Current status
* Current custodian
* Associated case

Its custody history is maintained through separate custody events.

---

## 6. Audit Logging

The audit system is designed to record security-sensitive operations.

Supported audit actions include:

```text
CREATE
READ
UPDATE
DELETE
DOWNLOAD
UPLOAD
LOGIN
LOGOUT
ACCESS_DENIED
```

Each audit record can contain:

* User
* Action
* Resource type
* Resource ID
* Description
* IP address
* Timestamp

This provides the foundation for an accountability and forensic audit trail.

---

# Evidence Workflow

A typical evidence lifecycle can be represented as:

```text
┌───────────────┐
│ Evidence      │
│ Collected     │
└───────┬───────┘
        ↓
┌───────────────┐
│ Register      │
│ Evidence      │
└───────┬───────┘
        ↓
┌───────────────┐
│ Assign        │
│ Custodian     │
└───────┬───────┘
        ↓
┌───────────────┐
│ Transfer /    │
│ Receive       │
└───────┬───────┘
        ↓
┌───────────────┐
│ Submit to     │
│ Forensic Unit │
└───────┬───────┘
        ↓
┌───────────────┐
│ Analysis /    │
│ Examination   │
└───────┬───────┘
        ↓
┌───────────────┐
│ Release /     │
│ Final Record  │
└───────────────┘
```

Each important transition can be associated with an audit event and custody record.

---

# Case Investigation Workflow

```text
Officer Login
      ↓
Role / Organization Context
      ↓
Case Dashboard
      ↓
Search / Filter Case
      ↓
Open Case Dossier
      ↓
View Persons / Documents / Evidence
      ↓
Update Investigation Information
      ↓
Record Evidence / Custody Events
      ↓
Maintain Case Notes
      ↓
Audit Trail
```

---

# User Roles

| Organization           | Typical Responsibilities                                     |
| ---------------------- | ------------------------------------------------------------ |
| 👮 Police              | FIRs, investigations, case management, evidence handling     |
| 🧪 Forensic Laboratory | Evidence examination and forensic documentation              |
| ⚖️ Prosecution         | Case preparation, legal documentation and court coordination |
| 🏛️ Court              | Court records, filings and judicial case information         |

Within the police workflow, the prototype demonstrates role-specific interfaces for ranks including Inspector, SI, ASI, Head Constable and Constable.

---

# Technology Stack

## Frontend

```text
React 19
React Router
Vite
JavaScript
CSS
```

The frontend follows a component-based architecture with separate pages, reusable dashboard components, role data and case data.

---

## Backend

```text
Python
Django 5.2
Django REST Framework
django-environ
```

The backend is organized into separate Django applications:

```text
accounts
cases
persons
documents
audit
```

---

## Database

```text
PostgreSQL
psycopg
```

The relational model is designed around:

```text
Users
Organizations
Roles
Cases
Case Members
Persons
Documents
Document Versions
Evidence
Custody Events
Audit Logs
```

---

## Object Storage

The architecture is intended to use:

```text
MinIO
```

for secure storage of digital evidence and document objects while PostgreSQL stores metadata and integrity information.

---

## Infrastructure

```text
Docker
PostgreSQL
Nginx
Gunicorn
MinIO
```

The repository contains the initial infrastructure structure for containerized deployment and reverse-proxy configuration.

---

# Project Structure

```text
CICADA/
│
├── backend/
│   ├── accounts/
│   ├── audit/
│   ├── cases/
│   ├── documents/
│   ├── persons/
│   ├── config/
│   └── manage.py
│
├── frontend/
│   └── my-react-app/
│       ├── src/
│       │   ├── components/
│       │   ├── pages/
│       │   ├── data/
│       │   └── assets/
│       └── package.json
│
├── infrastructure/
│   ├── docker/
│   └── nginx/
│
├── docs/
│   ├── architecture/
│   ├── api/
│   └── security/
│
├── tests/
│
├── requirements.txt
├── .env.example
└── README.md
```

---

# Prototype Interface

The current frontend prototype implements the main user-facing flow:

```text
Landing Page
     ↓
Registration
     ↓
Login
     ↓
Role / Officer Context
     ↓
Dashboard
     ↓
Case Search & Filtering
     ↓
Case Dossier
     ↓
Evidence & Notes
     ↓
Officer Profile
```

The interface is designed around a government-system visual language with:

* Navy primary theme
* Government-style navigation
* Officer dashboards
* Case status indicators
* Evidence integrity indicators
* Role-specific information
* Structured case dossiers

---

# Security Architecture

Security is a core design consideration of the system.

The architecture includes the following mechanisms:

### Role-Based Access Control

Users are associated with:

```text
Organization
+
Role
```

which forms the basis for restricting access to resources.

### Cryptographic Integrity

SHA-256 hashes are associated with digital documents and evidence workflows to support integrity verification.

### Auditability

Security-sensitive operations are represented through a dedicated audit log model.

### Controlled Custody

Evidence transfers are represented as explicit custody events instead of simply overwriting the current custodian.

### Versioned Documents

Documents maintain historical versions instead of replacing previous records.

---

# Why e-Sakshya?

Traditional digital document systems focus primarily on storing files.

e-Sakshya instead models the **entire evidence lifecycle**:

```text
CASE
 │
 ├── PERSONS
 │
 ├── DOCUMENTS
 │      └── VERSION HISTORY
 │
 ├── EVIDENCE
 │      └── CHAIN OF CUSTODY
 │
 └── AUDIT TRAIL
```

The result is a system designed around **traceability, accountability and evidence integrity**, rather than simple file storage.

---

# Current Prototype Status

The project currently provides a functional frontend prototype and the core backend data architecture.

### Implemented / Demonstrated

* Government-style landing page
* Officer registration interface
* Officer login interface
* Role-specific police dashboard
* Case search and filtering
* Case dossier interface
* Delegated case workflow representation
* Officer profile interface
* Case notes prototype
* Django domain models
* PostgreSQL schema
* Evidence and custody data model
* Document versioning model
* Audit-log model
* Docker-based PostgreSQL infrastructure

### Planned / Architecture Ready

* Full Django REST API
* Server-side authentication
* Complete RBAC enforcement
* Backend-powered case dashboard
* MinIO evidence storage
* Production custody-transfer APIs
* Automated audit generation
* Complete frontend/backend integration
* Comprehensive security and integration testing

The current submission therefore represents a **working prototype and architectural foundation** for the complete platform.

---

# Getting Started

## Prerequisites

```text
Python 3.12+
Node.js
npm
PostgreSQL
Docker (recommended)
```

---

## Clone the Repository

```bash
git clone https://github.com/nakulanil/CICADA.git
cd CICADA
```

---

## Backend Setup

```bash
cd backend

python -m venv venv
source venv/bin/activate
```

Windows:

```powershell
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r ../requirements.txt
```

Create a `.env` file based on `.env.example`.

Then run:

```bash
python manage.py migrate
python manage.py runserver
```

---

## Frontend Setup

```bash
cd frontend/my-react-app

npm install
npm run dev
```

The development server will provide the frontend URL in the terminal.

---

## Database with Docker

From the repository root:

```bash
cd infrastructure/docker
docker compose up -d
```

This starts the PostgreSQL development database defined in the project infrastructure.

---

# Future Scope

The architecture can be extended into a full production platform with:

* Strong server-side authentication
* Multi-factor authentication
* Fine-grained object-level authorization
* Encrypted evidence storage
* MinIO-based object storage
* Digital signatures
* Automated hash verification
* Immutable audit infrastructure
* Forensic laboratory workflows
* Prosecutor and court dashboards
* Secure inter-agency case sharing
* Advanced search across case records
* Automated compliance reports
* Evidence export packages
* Notification and escalation workflows
* Comprehensive security monitoring
* Full deployment across government infrastructure

---

# Team

**CICADA**

A student development team building a prototype for secure, accountable and digitally traceable evidence management.

---

## License

This project was developed as a prototype for academic / hackathon purposes.

The current repository represents a proof-of-concept architecture and should not be treated as a production law-enforcement system without appropriate security validation, legal review, infrastructure hardening and operational testing.
