# CEDAR — System Architecture

## 1. Architecture Overview

**CEDAR** is a secure digital evidence and case management platform designed to organize the complete lifecycle of criminal cases, documents, physical/digital evidence, custody transfers and audit records across authorized stakeholders.

The architecture is centered around a **case-centric data model**:

```text
CASE
 │
 ├── PERSONS
 │
 ├── CASE MEMBERS
 │
 ├── DOCUMENTS
 │      └── DOCUMENT VERSIONS
 │
 ├── EVIDENCE
 │      └── CHAIN OF CUSTODY
 │
 └── AUDIT TRAIL
```

The system is intended to support multiple organizational categories such as Police, Forensic Laboratory, Prosecution and Court while maintaining accountability for access and changes.

---

# 2. Design Principles

CEDAR is designed around the following principles:

- **Case-centric organization** — documents, people and evidence remain connected to their case.
- **Role-aware access** — users belong to an organization and role.
- **Traceability** — important actions can be recorded through audit logs.
- **Evidence integrity** — SHA-256 hashes provide a basis for integrity verification.
- **Version preservation** — document versions are stored independently rather than silently overwritten.
- **Chain of custody** — evidence transfers are represented as explicit events.
- **Separation of metadata and files** — PostgreSQL stores structured metadata while object storage is intended for digital files.
- **Prototype transparency** — implemented functionality is distinguished from planned integrations.

---

# 3. High-Level Component Architecture

```text
┌──────────────────────────────────────────────────────────────────┐
│                            CEDAR                                 │
│          Secure Digital Evidence & Case Management               │
├──────────────────────────────────────────────────────────────────┤
│                            USERS                                 │
│                                                                  │
│  Police       Forensic       Prosecution       Court             │
│    │              │               │              │               │
├────┴──────────────┴───────────────┴──────────────┴────────────────┤
│                       REACT FRONTEND                             │
│                                                                  │
│  Landing • Login • Dashboard • Case Search • Case Dossier        │
│  Evidence • Officer Profile • Role-specific Interfaces           │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                     DJANGO / DRF BACKEND                         │
│                                                                  │
│ Accounts • Cases • Persons • Documents • Audit                   │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                       DATA LAYER                                 │
│                                                                  │
│                         PostgreSQL                               │
│                                                                  │
│ Users ─ Cases ─ Persons ─ Documents ─ Evidence ─ Custody Events  │
│                     │                         │                  │
│                     └──────── Audit Logs ─────┘                  │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                      OBJECT STORAGE                              │
│                                                                  │
│                     MinIO / S3-compatible                        │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

# 4. Frontend Architecture

The frontend is implemented using React and Vite.

```text
frontend/
└── my-react-app/
    └── src/
        ├── components/
        ├── pages/
        ├── data/
        ├── assets/
        └── main.jsx
```

The prototype includes interfaces for:

- Landing page
- Registration
- Login
- Dashboard
- Case search and filtering
- Case dossier
- Evidence information
- Officer profile
- Role-specific police workflows
- Investigator notes

The current prototype contains some local/static demonstration data. Full server-backed functionality is part of the target integration architecture.

---

# 5. Backend Architecture

The backend is organized as a Django project with separate domain applications.

```text
backend/
├── accounts/
├── cases/
├── persons/
├── documents/
├── audit/
└── config/
```

### Accounts

Responsible for:

- Organizations
- Roles
- Users
- Organization membership
- Role association

### Cases

Responsible for:

- Case records
- Case status
- Case members
- Case responsibilities

### Persons

Responsible for:

- Person records
- Case-person relationships
- Involvement types

### Documents

Responsible for:

- Logical documents
- Document versions
- File metadata
- SHA-256 hashes
- Document processing metadata
- Evidence
- Custody events
- Document access permissions

### Audit

Responsible for:

- Security-sensitive activity records
- User/action/resource tracking
- Access-denied events
- Timestamps and IP metadata

---

# 6. Identity & Organization Architecture

CEDAR models users through organizations and roles.

```text
Organization
     │
     ├── Police
     ├── Forensic Laboratory
     ├── Prosecution
     └── Court

Role
     │
     └── User
```

The custom user model associates users with an organization and role.

This provides the foundation for:

```text
Authentication
      ↓
Organization Context
      ↓
Role Context
      ↓
Resource Authorization
```

The current frontend authentication is primarily prototype-level; complete server-side authentication and authorization enforcement remain part of the target architecture.

---

# 7. Case Management Architecture

The case is the central entity around which the system is organized.

```text
Case
 │
 ├── Case Members
 │
 ├── Persons
 │
 ├── Documents
 │
 └── Evidence
```

A case stores information such as:

- Case number
- Title
- Case type
- Status
- Description
- Police station
- Jurisdiction
- Opening timestamp
- Closing timestamp
- Creator
- Creation/update timestamps

Supported case states include:

```text
ACTIVE
UNDER_INVESTIGATION
IN_COURT
CLOSED
ARCHIVED
```

---

# 8. Case Membership

A case may have multiple authorized members.

Supported case roles include:

```text
LEAD_INVESTIGATOR
SUPPORTING_INVESTIGATOR
SUPERVISOR
FORENSIC_OFFICER
PROSECUTOR
COURT_STAFF
JUDGE
OBSERVER
```

The membership model records:

- User
- Case
- Case role
- Join time
- Removal time
- Active state

This separates **case responsibility** from the user's global organizational role.

---

# 9. Person Management

CEDAR separates reusable person records from their involvement in a particular case.

```text
Person
   │
   ├── CasePerson ── Case A
   │
   ├── CasePerson ── Case B
   │
   └── CasePerson ── Case C
```

Supported case involvement types include:

```text
ACCUSED
VICTIM
WITNESS
COMPLAINANT
SUSPECT
OTHER
```

This avoids unnecessarily duplicating a person's core record across cases.

---

# 10. Document Architecture

Documents are modeled separately from their versions.

```text
Document
   │
   ├── Version 1
   ├── Version 2
   └── Version N
```

Supported document categories include:

```text
FIR
POLICE_REPORT
WITNESS_STATEMENT
CHARGE_SHEET
COURT_FILING
EVIDENCE_RECORD
FORENSIC_REPORT
LEGAL_NOTICE
JUDGMENT
OTHER
```

Each document version stores metadata including:

- File path/object reference
- Original filename
- SHA-256 hash
- File size
- MIME type
- Uploader
- Timestamp

The versioning model preserves historical file metadata rather than replacing the previous version.

---

# 11. Document Access Control

CEDAR includes a document access model that can represent explicit permissions.

Supported permission types include:

```text
VIEW
DOWNLOAD
EDIT
SHARE
```

Access records can contain:

- Document
- User
- Permission
- Granting user
- Grant timestamp
- Expiration timestamp
- Active state

The model provides a foundation for fine-grained document authorization.

---

# 12. Evidence Architecture

Evidence is modeled independently from ordinary case documents.

```text
Case
 │
 └── Evidence
      ├── Evidence Number
      ├── Type
      ├── Description
      ├── Collection Details
      ├── Status
      └── Current Custodian
```

Evidence statuses include:

```text
COLLECTED
IN_CUSTODY
SUBMITTED
ANALYZED
RELEASED
DISPOSED
```

---

# 13. Chain of Custody

Custody history is represented through separate events.

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

A custody event can contain:

- Evidence item
- Action
- Previous custodian
- New custodian
- Timestamp
- Location
- Reason
- Integrity hash

The important architectural principle is that a transfer does not simply overwrite history. Each transition becomes a separate record.

---

# 14. Cryptographic Integrity

CEDAR models SHA-256 hashes for digital artifacts and custody-related records.

Conceptually:

```text
Digital File
     ↓
SHA-256
     ↓
Store Hash + Metadata
     ↓
Later Verification
     ↓
Compare Hashes
     ↓
Detect Unexpected Change
```

Hashing provides an integrity-verification mechanism; it does not by itself make the storage system immutable.

---

# 15. Document Processing

The document-processing model supports extracted metadata and processing results.

It can represent:

- Processing status
- Extraction method
- Page count
- Raw text
- Cleaned text
- OCR confidence
- FIR number
- FIR date/year
- District
- Police station
- Suspected offence
- Legal sections
- Processing errors
- Processing timestamp

The processing model is designed so document ingestion and extraction can be integrated without coupling extraction logic directly to the core document record.

---

# 16. Audit Architecture

The audit system provides a dedicated record of security-sensitive operations.

Supported actions include:

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

An audit record can contain:

```text
User
Action
Resource Type
Resource ID
Description
IP Address
Timestamp
```

Conceptual flow:

```text
User Action
     ↓
Authorization Check
     ↓
Resource Operation
     ↓
Audit Event
     ↓
AuditLog
```

The current repository contains the audit data model; automatic generation of every audit event remains part of the planned integration layer.

---

# 17. Data Relationship Map

```text
Organization
     │
     └── Users
          │
          └── Roles
               │
               ├──────────────┐
               ↓              ↓
             Cases         Audit Logs
               │
      ┌────────┼─────────┐
      ↓        ↓         ↓
  Members   Persons   Documents
                         │
                         ↓
                  Document Versions

Cases
  │
  └── Evidence
        │
        └── Custody Events
```

---

# 18. Storage Architecture

CEDAR separates structured metadata from digital file storage.

```text
                  CEDAR Backend
                       │
          ┌────────────┴────────────┐
          ↓                         ↓
     PostgreSQL                  MinIO
          │                         │
          ↓                         ↓
   Structured Metadata       Digital Objects
   Users                    Documents
   Cases                    Evidence Files
   Versions                 Other Attachments
   Audit Logs
```

PostgreSQL is intended to store metadata and relationships, while MinIO/S3-compatible storage is intended for the actual digital objects.

---

# 19. Security Architecture

The security design is built around several layers.

```text
┌──────────────────────────────┐
│ Identity & Authentication    │
├──────────────────────────────┤
│ Organization / Role Context  │
├──────────────────────────────┤
│ Case Membership              │
├──────────────────────────────┤
│ Document Permissions         │
├──────────────────────────────┤
│ Evidence Custody Tracking    │
├──────────────────────────────┤
│ SHA-256 Integrity Metadata   │
├──────────────────────────────┤
│ Audit Logging                │
└──────────────────────────────┘
```

The target security architecture includes:

- Server-side authentication
- Role-based authorization
- Object/document-level permissions
- Controlled evidence transfers
- Versioned documents
- Cryptographic integrity metadata
- Audit logging
- Secure object storage
- HTTPS/TLS in deployment

---

# 20. Request Lifecycle

A target authenticated request can follow this flow:

```text
Client
  ↓
Nginx / Reverse Proxy
  ↓
Django Application
  ↓
Authentication
  ↓
Organization / Role Check
  ↓
Case / Resource Authorization
  ↓
Business Operation
  ↓
Database / Object Storage
  ↓
Audit Event
  ↓
Response
```

Not every step above is fully implemented in the current prototype.

---

# 21. Document Access Flow

```text
User
 ↓
Login
 ↓
Organization / Role Context
 ↓
Open Case
 ↓
Check Case Membership
 ↓
Check Document Permission
 ↓
Retrieve Metadata
 ↓
Retrieve Authorized File
 ↓
Record Access Event
```

This is the intended architecture for controlled document access.

---

# 22. Evidence Transfer Flow

```text
Current Custodian
        ↓
Transfer Request
        ↓
Authorization Check
        ↓
Create Custody Event
        ↓
Update Current Custodian
        ↓
Record Integrity Metadata
        ↓
Audit Event
```

The custody event becomes part of the permanent case history.

---

# 23. Deployment Architecture

The intended deployment stack is:

```text
                    Internet
                       │
                       ↓
                  Nginx / TLS
                       │
                       ↓
                 Gunicorn
                       │
                       ↓
                  Django App
                  /         \
                 ↓           ↓
           PostgreSQL       MinIO
```

Containerized development infrastructure can include:

```text
Docker
 ├── Django
 ├── PostgreSQL
 ├── MinIO
 └── Nginx
```

Actual production deployment requires appropriate infrastructure hardening, secrets management, TLS configuration, access controls and monitoring.

---

# 24. Module Dependency Graph

```text
                    accounts
                       │
             ┌─────────┼─────────┐
             ↓         ↓         ↓
           cases    persons    audit
             │
             ↓
         documents
             │
       ┌─────┴─────┐
       ↓           ↓
    versions     evidence
                     │
                     ↓
               custody events
```

The case model acts as the central domain relationship for persons, documents and evidence.

---

# 25. Data Integrity Strategy

CEDAR uses multiple complementary mechanisms:

### Relational Integrity

Foreign keys and database constraints maintain relationships between domain entities.

### Uniqueness

Examples include:

- Unique case numbers
- Unique document-version combinations
- Unique case/user membership combinations
- Unique document/user/permission combinations

### Versioning

Previous document versions remain represented rather than being silently overwritten.

### Cryptographic Hashing

SHA-256 hashes provide a mechanism for detecting unexpected changes to digital content.

### Audit Records

Important operations can be represented as timestamped events associated with users and resources.

---

# 26. Case-Centric Rationale

The case is deliberately the central domain object.

Instead of organizing the system primarily around files:

```text
Files
 ├── File 1
 ├── File 2
 └── File 3
```

CEDAR organizes information around the case:

```text
Case
 ├── People
 ├── Documents
 │    └── Versions
 ├── Evidence
 │    └── Custody
 └── Audit History
```

This structure allows the complete context of a case to be represented while retaining accountability for individual resources and actions.

---

# 27. Current vs Target Architecture

## Currently Represented

- Django domain models
- PostgreSQL data model
- User/organization/role relationships
- Case management models
- Case membership
- Person/case relationships
- Document versioning
- Evidence model
- Custody event model
- Document access model
- Audit log model
- React frontend prototype
- Docker-based PostgreSQL infrastructure

## Target / Integration Layer

- Complete Django REST API
- Server-side authentication
- Complete RBAC enforcement
- Backend-powered frontend
- MinIO object storage integration
- Automated audit generation
- Production evidence-transfer APIs
- Full document access enforcement
- Automated integrity verification
- Comprehensive security testing

This distinction prevents the architecture documentation from overstating the current implementation.

---

# 28. Technology Stack

## Frontend

```text
React 19
React Router
Vite
JavaScript
CSS
```

## Backend

```text
Python
Django 5.2
Django REST Framework
django-environ
```

## Database

```text
PostgreSQL
psycopg
```

## Storage

```text
MinIO / S3-compatible object storage
```

## Infrastructure

```text
Docker
Nginx
Gunicorn
PostgreSQL
MinIO
```

---

# 29. Project Structure

```text
CEDAR/
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
│       └── src/
│           ├── components/
│           ├── pages/
│           ├── data/
│           └── assets/
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

# 30. Prototype Interface

The current frontend flow is:

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

The prototype demonstrates a government-oriented interface with structured dashboards, case status indicators, evidence information and role-specific workflows.

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

## Backend

```bash
cd backend

python -m venv venv
source venv/bin/activate

pip install -r ../requirements.txt

python manage.py migrate
python manage.py runserver
```

Windows:

```powershell
venv\Scripts\activate
```

Create `.env` from `.env.example` before running the backend.

## Frontend

```bash
cd frontend/my-react-app

npm install
npm run dev
```

## PostgreSQL with Docker

From the repository root:

```bash
cd infrastructure/docker
docker compose up -d
```

---

# 32. Future Scope

Potential extensions include:

- Strong server-side authentication
- Multi-factor authentication
- Fine-grained object-level authorization
- Encrypted evidence storage
- MinIO-based object storage
- Digital signatures
- Automated hash verification
- Immutable audit infrastructure
- Forensic laboratory workflows
- Prosecutor and court dashboards
- Secure inter-agency case sharing
- Advanced case search
- Compliance reporting
- Evidence export packages
- Notifications and escalation workflows
- Security monitoring
- Production deployment

---

# 33. Architectural Summary

CEDAR is structured around a secure, case-centric model that connects:

```text
Users
  ↓
Organizations & Roles
  ↓
Cases
  ├── Persons
  ├── Documents
  │     └── Versions
  ├── Evidence
  │     └── Custody Events
  └── Audit Logs
```

The architecture is designed to provide:

**Traceability + Accountability + Integrity + Controlled Access**

while maintaining a clear separation between the current prototype implementation and the target production architecture.

---

# 34. Security Principle

> Every important case operation should be attributable to an authorized actor, associated with the relevant resource, and recorded in a way that supports later verification.

CEDAR is a prototype architecture and should not be treated as a production law-enforcement system without appropriate security validation, legal review, infrastructure hardening, privacy controls and operational testing.
