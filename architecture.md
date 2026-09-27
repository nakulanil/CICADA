# 🏛️ CICADA — System Architecture

> **Secure Digital Evidence & Case Management System**
>
> An inter-agency digital platform for structured case management, evidence tracking, document management, access control, integrity verification and auditable investigation workflows.

---

<div align="center">

### 🔐 Secure by Design · 📁 Case-Centric · 🧾 Auditable · 👮 Role-Aware

</div>

---

# 1. Architecture Overview

CICADA follows a layered full-stack architecture built around one core principle:

> **Every important record should remain connected to its case, its responsible users, its permissions and its history.**

```text
┌──────────────────────────────────────────────────────────────────────┐
│                         PRESENTATION LAYER                           │
│                                                                      │
│                    React + Vite Frontend                             │
│                                                                      │
│   Landing │ Authentication │ Dashboard │ Case Dossier │ Profile     │
│   Search  │ Evidence       │ Documents │ Notes        │ RBAC UI      │
└──────────────────────────────┬───────────────────────────────────────┘
                               │
                               │ HTTP / REST
                               ▼
┌──────────────────────────────────────────────────────────────────────┐
│                           API LAYER                                  │
│                                                                      │
│                    Django REST Framework                             │
│                                                                      │
│   Authentication │ Authorization │ Validation │ Business Logic       │
│   Case APIs      │ Document APIs │ Evidence APIs │ Audit APIs        │
└──────────────────────────────┬───────────────────────────────────────┘
                               │
                 ┌─────────────┴──────────────┐
                 │                            │
                 ▼                            ▼
┌──────────────────────────┐      ┌───────────────────────────────────┐
│     APPLICATION LAYER    │      │          STORAGE LAYER            │
│                          │      │                                   │
│ Django Domain Models     │      │ PostgreSQL                        │
│                          │      │   └─ Structured application data  │
│ Accounts                 │      │                                   │
│ Cases                    │      │ MinIO / S3-compatible storage     │
│ Persons                  │      │   └─ Documents & digital files    │
│ Documents                │      │                                   │
│ Evidence                 │      │ SHA-256 integrity metadata       │
│ Audit                    │      │                                   │
└─────────────┬────────────┘      └───────────────────────────────────┘
              │
              ▼
┌──────────────────────────────────────────────────────────────────────┐
│                         SECURITY & AUDIT                             │
│                                                                      │
│        Identity → Role → Case Membership → Permissions              │
│                              ↓                                       │
│                         AuditLog                                     │
│                              ↓                                       │
│                   Traceable system activity                         │
└──────────────────────────────────────────────────────────────────────┘
```

---

# 2. Design Philosophy

CICADA is structured around five architectural principles.

## 2.1 Case-Centric Data Model

A case is the central unit around which investigation information is organized.

```text
                         ┌─────────────┐
                         │    CASE     │
                         └──────┬──────┘
                                │
        ┌───────────────┬───────┼────────┬───────────────┐
        ▼               ▼       ▼        ▼               ▼
     Persons         Members  Documents Evidence       Audit
```

This keeps people, documents, evidence and responsibilities connected to the case they belong to.

---

## 2.2 Least-Privilege Access

Users are associated with:

```text
Organization
      │
      ▼
     User
      │
      ├──── Role
      │
      └──── Case Membership
```

Access can therefore be represented at multiple levels:

* Organization-level identity
* Role-level permissions
* Case-level responsibility
* Document-level permissions

---

## 2.3 Evidence Traceability

Evidence is not treated as an ordinary file.

Instead, the system maintains:

```text
Evidence
   │
   ├── Collection information
   ├── Current custodian
   ├── Current status
   │
   └── Custody Events
           │
           ├── Collected
           ├── Transferred
           ├── Received
           ├── Submitted
           └── Released
```

This provides a chronological history of evidence custody.

---

## 2.4 Versioned Documents

Documents are separated from their individual file versions.

```text
Document
   │
   ├── Version 1
   ├── Version 2
   ├── Version 3
   └── ...
```

Each version can store:

* Original filename
* File path
* File size
* MIME type
* SHA-256 hash
* Uploading user
* Upload timestamp

---

## 2.5 Auditability

Security-sensitive activity is designed to leave an audit trail.

```text
USER ACTION
     │
     ▼
┌─────────────┐
│ Application │
└──────┬──────┘
       │
       ▼
   AuditLog
       │
       ├── User
       ├── Action
       ├── Resource
       ├── Description
       ├── IP Address
       └── Timestamp
```

---

# 3. High-Level Component Architecture

```text
                              INTERNET
                                  │
                                  ▼
                         ┌─────────────────┐
                         │   Web Browser   │
                         └────────┬────────┘
                                  │
                                  ▼
                    ┌─────────────────────────┐
                    │ React + Vite Frontend   │
                    │                         │
                    │ • Landing Page          │
                    │ • Login / Registration  │
                    │ • Dashboard             │
                    │ • Case Dossier          │
                    │ • Evidence UI            │
                    │ • Document UI            │
                    │ • Profile / Notes        │
                    └────────────┬────────────┘
                                 │
                                 │ REST / HTTP
                                 ▼
                    ┌─────────────────────────┐
                    │ Django Application       │
                    │                         │
                    │ Django + DRF             │
                    │                         │
                    │ ┌─────────────────────┐ │
                    │ │ Accounts            │ │
                    │ │ Cases               │ │
                    │ │ Persons             │ │
                    │ │ Documents           │ │
                    │ │ Audit               │ │
                    │ └─────────────────────┘ │
                    └───────┬─────────┬───────┘
                            │         │
                ┌───────────┘         └────────────┐
                ▼                                  ▼
       ┌──────────────────┐             ┌──────────────────┐
       │   PostgreSQL     │             │ MinIO / S3       │
       │                  │             │                  │
       │ Users            │             │ Digital Files    │
       │ Cases            │             │ Documents        │
       │ Persons          │             │ Evidence Files   │
       │ Metadata         │             │                  │
       │ Audit Records    │             │ Object Storage   │
       └──────────────────┘             └──────────────────┘
```

---

# 4. Frontend Architecture

The frontend uses:

```text
React
  │
  ├── Vite
  ├── React Router
  └── CSS
```

Major UI areas include:

```text
frontend/
└── my-react-app/
    │
    ├── pages/
    │   ├── Landing
    │   ├── Login
    │   ├── Registration
    │   ├── Dashboard
    │   ├── Case Dossier
    │   └── Profile
    │
    ├── components/
    │   ├── Navigation
    │   ├── Dashboard Components
    │   ├── Case Components
    │   └── UI Components
    │
    ├── data/
    │   └── Prototype / UI Data
    │
    └── ...
```

The frontend is responsible for:

* User interaction
* Navigation
* Case visualization
* Evidence/document interfaces
* Role-specific UI
* Search and filtering
* Case notes
* Presentation of security indicators

The backend remains responsible for authoritative persistence, authorization and security enforcement.

---

# 5. Backend Architecture

The backend is divided into domain-specific Django applications.

```text
backend/
│
├── config/
│   ├── settings.py
│   ├── urls.py
│   ├── asgi.py
│   └── wsgi.py
│
├── accounts/
│   └── User / Organization / Role
│
├── cases/
│   └── Case / CaseMember
│
├── persons/
│   └── Person / CasePerson
│
├── documents/
│   └── Document / Evidence / Processing / Access
│
├── audit/
│   └── AuditLog
│
└── manage.py
```

This separation keeps identity, cases, people, evidence and auditing as distinct application domains.

---

# 6. Identity & Access Architecture

## Identity hierarchy

```text
Organization
      │
      ├──────────────┐
      │              │
      ▼              ▼
    Roles           Users
                     │
                     ▼
              Case Membership
                     │
                     ▼
              Case-specific role
```

### Organization

The current model supports:

* Police
* Forensic Laboratory
* Prosecution
* Court

### User

The custom Django `User` model extends Django's `AbstractUser`.

A user can be associated with:

* Organization
* Role

### Role

Roles provide the foundation for role-based access control.

---

# 7. Case Management Architecture

The `Case` model is the central domain object.

```text
┌─────────────────────────────┐
│            CASE             │
├─────────────────────────────┤
│ UUID                        │
│ Case Number                 │
│ Title                       │
│ Case Type                   │
│ Status                      │
│ Description                 │
│ Police Station              │
│ Jurisdiction                │
│ Opened At                   │
│ Closed At                   │
│ Created By                  │
│ Created At                  │
│ Updated At                  │
└──────────────┬──────────────┘
               │
       ┌───────┼────────┬───────────────┐
       ▼       ▼        ▼               ▼
    Members Persons Documents        Evidence
```

### Case lifecycle

```text
ACTIVE
  │
  ▼
UNDER_INVESTIGATION
  │
  ▼
IN_COURT
  │
  ▼
CLOSED
  │
  ▼
ARCHIVED
```

---

# 8. Case Membership

Cases can contain multiple users with different responsibilities.

```text
Case
 │
 ├── Lead Investigator
 ├── Supporting Investigator
 ├── Supervisor
 ├── Forensic Officer
 ├── Prosecutor
 ├── Court Staff
 ├── Judge
 └── Observer
```

A `CaseMember` record stores:

* User
* Case
* Case role
* Joined timestamp
* Removal timestamp
* Active/inactive state

---

# 9. Person Management

People are modeled independently from cases.

```text
             ┌────────────┐
             │   Person   │
             └─────┬──────┘
                   │
                   │ CasePerson
          ┌────────┼─────────┐
          ▼        ▼         ▼
        Case A   Case B    Case C
```

This allows one person to be associated with multiple cases without duplicating the core person record.

Supported involvement types:

```text
ACCUSED
VICTIM
WITNESS
COMPLAINANT
SUSPECT
OTHER
```

---

# 10. Document Architecture

Documents are attached to cases and support version tracking.

```text
Case
 │
 └── Document
       │
       ├── Metadata
       │
       └── DocumentVersion
             │
             ├── File
             ├── SHA-256
             ├── MIME Type
             ├── Size
             ├── Original Filename
             ├── Uploaded By
             └── Uploaded At
```

A document represents the logical record, while each version represents a specific file state.

```text
Police Report
     │
     ├── v1 → Original submission
     ├── v2 → Corrected submission
     └── v3 → Final submission
```

---

# 11. Document Access Control

Documents have an additional permission layer.

```text
Document
   │
   └── DocumentAccess
          │
          ├── User
          ├── Permission
          ├── Granted By
          ├── Granted At
          ├── Expires At
          └── Active?
```

Supported permissions:

```text
VIEW
DOWNLOAD
EDIT
SHARE
```

This provides a foundation for granular document-level authorization.

---

# 12. Digital Evidence Architecture

Evidence is modeled separately from ordinary documents because evidence requires custody tracking.

```text
┌──────────────────────────────┐
│           EVIDENCE           │
├──────────────────────────────┤
│ Evidence Number              │
│ Evidence Type                │
│ Description                  │
│ Case                         │
│ Collected By                 │
│ Collected At                 │
│ Collection Location          │
│ Status                       │
│ Current Custodian            │
└───────────────┬──────────────┘
                │
                ▼
        ┌───────────────┐
        │ CustodyEvent  │
        └───────┬───────┘
                │
        ┌───────┼─────────┐
        ▼       ▼         ▼
      User    User      Timestamp
     FROM      TO
```

---

# 13. Chain of Custody

The custody model records each movement of evidence.

```text
Crime Scene
     │
     │ COLLECTED
     ▼
Investigating Officer
     │
     │ TRANSFERRED
     ▼
Malkhana / Custodian
     │
     │ SUBMITTED
     ▼
Forensic Laboratory
     │
     │ RECEIVED
     ▼
Forensic Officer
     │
     │ RELEASED
     ▼
Authorized Destination
```

Each custody event can record:

* Previous custodian
* New custodian
* Action
* Timestamp
* Location
* Reason
* Integrity hash

---

# 14. Evidence Integrity

The architecture supports SHA-256 based integrity metadata.

```text
FILE
 │
 ▼
SHA-256
 │
 ▼
Integrity Hash
 │
 ├── Document Version
 └── Custody Event
```

Conceptually:

```text
Original File
     │
     ▼
 SHA-256 Hash
     │
     ▼
Stored Metadata
     │
     └───────────────┐
                     │
              Later Verification
                     │
                     ▼
                New SHA-256
                     │
              ┌──────┴──────┐
              │             │
           MATCH         MISMATCH
              │             │
           Intact        Investigate
```

The hash provides an integrity indicator; it does not by itself establish legal authenticity.

---

# 15. Document Processing Pipeline

Document versions can have an associated processing result.

```text
Document Upload
      │
      ▼
DocumentVersion
      │
      ▼
Processing Result
      │
      ├── PENDING
      ├── COMPLETED
      └── FAILED
```

The processing model can store:

* Extraction method
* Page count
* Raw text
* Cleaned text
* OCR confidence
* FIR number
* FIR date/year
* District
* Police station
* Suspected offence
* Sections
* Error information

---

# 16. Audit Architecture

The audit subsystem records important system activity.

```text
┌───────────────────────────────┐
│           AuditLog            │
├───────────────────────────────┤
│ ID                            │
│ User                          │
│ Action                        │
│ Resource Type                 │
│ Resource ID                   │
│ Description                   │
│ IP Address                    │
│ Timestamp                     │
└───────────────────────────────┘
```

Supported actions:

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

Example:

```text
Officer
   │
   │ downloads document
   ▼
Authorization Check
   │
   ├── Allowed ──────► File Access
   │                       │
   │                       ▼
   │                    AuditLog
   │
   └── Denied ───────► ACCESS_DENIED
                           │
                           ▼
                       AuditLog
```

---

# 17. Data Relationship Map

```text
                         ┌──────────────┐
                         │ Organization │
                         └──────┬───────┘
                                │
                                ▼
                         ┌──────────────┐
                         │     User     │
                         └───┬──────┬───┘
                             │      │
                        Role │      │ CaseMember
                             │      │
                             │      ▼
                             │  ┌──────────┐
                             └─►│   Case   │
                                └────┬─────┘
                                     │
              ┌──────────────────────┼────────────────────────┐
              │                      │                        │
              ▼                      ▼                        ▼
        ┌──────────┐          ┌────────────┐           ┌───────────┐
        │  Person  │          │  Document  │           │ Evidence  │
        └────┬─────┘          └──────┬─────┘           └─────┬─────┘
             │                       │                       │
             │ CasePerson            │ DocumentVersion       │
             │                       │                       │
             │                       ▼                       ▼
             │                ProcessingResult          CustodyEvent
             │
             └───────────────────────────────────────────────┐
                                                             │
                                                             ▼
                                                       Case Activity

User ───────────────────────────────────────────────────────► AuditLog
```

---

# 18. Storage Architecture

CICADA separates structured application data from binary file storage.

```text
                    Django Application
                           │
             ┌─────────────┴─────────────┐
             │                           │
             ▼                           ▼
      Structured Data                Binary Files
             │                           │
             ▼                           ▼
        PostgreSQL                    MinIO
             │                           │
             ├── Users                   ├── Documents
             ├── Cases                   ├── Evidence
             ├── Persons                 └── File Versions
             ├── Metadata
             └── Audit Logs
```

### PostgreSQL

Used for:

* Identity data
* Cases
* Relationships
* Metadata
* Permissions
* Audit records
* Evidence metadata
* Document metadata

### MinIO / S3-compatible storage

Designed for:

* Uploaded documents
* Evidence files
* Versioned binary objects

---

# 19. Security Architecture

Security is distributed across multiple layers.

```text
┌─────────────────────────────────────────────────────────┐
│                     SECURITY LAYERS                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1. Identity                                            │
│     └── Django Authentication                           │
│                                                         │
│  2. Organization                                        │
│     └── User → Organization                             │
│                                                         │
│  3. Role                                                │
│     └── User → Role                                     │
│                                                         │
│  4. Case Authorization                                  │
│     └── CaseMember                                      │
│                                                         │
│  5. Document Authorization                              │
│     └── DocumentAccess                                  │
│                                                         │
│  6. Integrity                                           │
│     └── SHA-256                                         │
│                                                         │
│  7. Auditability                                        │
│     └── AuditLog                                        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

# 20. Request Lifecycle

A typical authenticated request follows:

```text
Browser
   │
   │ HTTP Request
   ▼
Django / DRF
   │
   ▼
Authentication
   │
   ▼
User Identification
   │
   ▼
Role / Organization Check
   │
   ▼
Case / Document Permission Check
   │
   ├───────────────┐
   │               │
 ALLOWED          DENIED
   │               │
   ▼               ▼
Business Logic   AuditLog
   │
   ▼
Database / Storage
   │
   ▼
Response
   │
   ▼
Browser
```

---

# 21. Example: Accessing a Case Document

```text
Officer
   │
   │ Request document
   ▼
┌───────────────────┐
│ Authentication    │
└─────────┬─────────┘
          ▼
┌───────────────────┐
│ Identify User     │
└─────────┬─────────┘
          ▼
┌───────────────────┐
│ Case Membership   │
└─────────┬─────────┘
          ▼
┌───────────────────┐
│ Document Access   │
└─────────┬─────────┘
          │
       ┌──┴──┐
       ▼     ▼
     ALLOW  DENY
       │     │
       │     └──────────► ACCESS_DENIED AuditLog
       │
       ▼
  Retrieve File
       │
       ▼
  Record Activity
       │
       ▼
   Return File
```

---

# 22. Deployment Architecture

The intended deployment separates the major application components.

```text
                         INTERNET
                            │
                            ▼
                     ┌─────────────┐
                     │    Nginx    │
                     │ Reverse     │
                     │ Proxy       │
                     └──────┬──────┘
                            │
                 ┌──────────┴──────────┐
                 │                     │
                 ▼                     ▼
          Static / Frontend       Gunicorn
                                      │
                                      ▼
                                Django Backend
                                      │
                     ┌────────────────┼────────────────┐
                     │                │                │
                     ▼                ▼                ▼
                PostgreSQL          MinIO          Audit System
```

---

# 23. Module Dependency Graph

```text
                         ┌──────────────┐
                         │   Accounts   │
                         │ Identity/RBAC│
                         └───────┬──────┘
                                 │
                ┌────────────────┼─────────────────┐
                │                │                 │
                ▼                ▼                 ▼
          ┌──────────┐     ┌──────────┐     ┌──────────┐
          │  Cases   │     │ Persons  │     │  Audit   │
          └────┬─────┘     └────┬─────┘     └──────────┘
               │                │
               └───────┬────────┘
                       ▼
                ┌──────────────┐
                │  Documents   │
                │ & Evidence   │
                └──────┬───────┘
                       │
                ┌──────┴──────┐
                ▼             ▼
           PostgreSQL       MinIO
```

---

# 24. Data Integrity Strategy

CICADA uses several complementary integrity mechanisms.

### Database integrity

Model constraints enforce relationships such as:

```text
Case + User
     ↓
Unique Case Membership
```

```text
Case + Evidence Number
     ↓
Unique Evidence Identifier
```

```text
Document + Version Number
     ↓
Unique Document Version
```

### File integrity

```text
File
 ↓
SHA-256
 ↓
Stored Hash
```

### Historical integrity

```text
Document
 ↓
Document Versions

Evidence
 ↓
Custody Events

System Action
 ↓
Audit Logs
```

---

# 25. Why CICADA Is Case-Centric

A basic document management system might look like:

```text
User → Files
```

CICADA instead models:

```text
                         CASE
                          │
       ┌──────────────────┼──────────────────┐
       │                  │                  │
     PEOPLE            DOCUMENTS          EVIDENCE
       │                  │                  │
       │                  │                  └── CUSTODY
       │                  └── VERSIONS
       │
       └── INVOLVEMENT

                          │
                          ▼
                       USERS
                          │
                          ▼
                      AUDITING
```

This keeps investigation context connected to the records that support it.

---

# 26. Current Implementation vs Target Architecture

> **Important:** This document describes the implemented domain architecture and the intended integration architecture. Not every component currently has a complete production API implementation.

### Currently represented in the repository

* Django domain models
* Custom user model
* Organizations and roles
* Case management schema
* Case membership
* Person/case relationships
* Document/version schema
* Evidence model
* Chain-of-custody model
* Document access model
* Document processing result model
* Audit log model
* PostgreSQL configuration
* MinIO/S3-compatible storage configuration
* React/Vite frontend
* Prototype dashboards and case interfaces

### Target / integration layer

* Complete DRF API layer
* Backend-driven authentication
* Complete RBAC enforcement
* Case-level authorization
* Document-level authorization
* Production MinIO integration
* Automated audit generation
* Frontend/backend integration
* Automated document processing
* Comprehensive security testing

---

# 27. Technology Stack

```text
┌──────────────────────────────────────────────────────────┐
│                         CICADA                           │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  FRONTEND                                                │
│  React 19 · Vite · React Router · JavaScript · CSS       │
│                                                          │
│  BACKEND                                                 │
│  Python · Django 5.2 · Django REST Framework             │
│                                                          │
│  DATABASE                                                │
│  PostgreSQL · psycopg                                    │
│                                                          │
│  STORAGE                                                 │
│  MinIO · S3-compatible object storage                    │
│                                                          │
│  SERVER                                                  │
│  Nginx · Gunicorn                                        │
│                                                          │
│  INFRASTRUCTURE                                          │
│  Docker                                                   │
│                                                          │
│  SECURITY / INTEGRITY                                    │
│  RBAC · Case Membership · Document Permissions            │
│  SHA-256 · Audit Logging                                 │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

# 28. Project Structure

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

# 29. Prototype Interface

The current frontend prototype follows the main user-facing flow:

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
* Structured navigation
* Officer dashboards
* Case status indicators
* Evidence integrity indicators
* Role-specific information
* Case dossier views

---

# 30. Current Prototype Status

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

# 31. Getting Started

## Prerequisites

```text
Python 3.12+
Node.js
npm
PostgreSQL
Docker (recommended)
```

## Clone the Repository

```bash
git clone https://github.com/nakulanil/CICADA.git
cd CICADA
```

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

Then:

```bash
python manage.py migrate
python manage.py runserver
```

## Frontend Setup

```bash
cd frontend/my-react-app

npm install
npm run dev
```

## Database with Docker

```bash
cd infrastructure/docker
docker compose up -d
```

---

# 32. Future Scope

The architecture can be extended with:

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
* Advanced case search
* Automated compliance reports
* Evidence export packages
* Notification and escalation workflows
* Security monitoring
* Government-scale deployment

---

# 33. Architectural Summary

The CICADA architecture can ultimately be reduced to one pipeline:

```text
                 ┌───────────────┐
                 │    IDENTITY   │
                 └───────┬───────┘
                         │
                         ▼
                 ┌───────────────┐
                 │     ROLE      │
                 └───────┬───────┘
                         │
                         ▼
                 ┌───────────────┐
                 │     CASE      │
                 └───────┬───────┘
                         │
          ┌──────────────┼───────────────┐
          ▼              ▼               ▼
       PERSON         DOCUMENT         EVIDENCE
                         │               │
                         ▼               ▼
                      VERSION         CUSTODY
                         │               │
                         └───────┬───────┘
                                 ▼
                            AUDIT LOG
                                 │
                                 ▼
                         TRACEABLE SYSTEM
```

The architecture connects:

> **Who accessed it → what case it belongs to → what record was involved → what changed → who handled it → and when it happened.**

---

# 🛡️ Security Principle

> **Trust should be supported through identity, authorization, integrity checks and an auditable history — not assumed.**

---

<div align="center">

### CICADA

**Secure Digital Evidence & Case Management System**

`React` · `Django` · `PostgreSQL` · `MinIO` · `RBAC` · `Audit Logging`

</div>
