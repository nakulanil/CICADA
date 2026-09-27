# Secure DMS --- Prototype Threat Model

## 1. Purpose

This threat model identifies the main security risks that must be
addressed in the Secure Document Management System prototype.

The focus is on threats that can realistically be demonstrated during
the prototype deadline.

## 2. Security Objectives

The prototype should demonstrate:

1.  Authentication
2.  Server-side authorization
3.  Organization isolation
4.  Case-level access control
5.  Secure document access
6.  Document integrity verification
7.  Auditability
8.  Permission-aware search
9.  Permission-aware AI retrieval

## 3. Assets

### High-value assets

-   User accounts
-   Passwords/credentials
-   Organization data
-   Case information
-   Case memberships
-   Role assignments
-   Uploaded documents
-   Document versions
-   Document hashes
-   Audit events
-   OCR/search indexes
-   Vector embeddings
-   AI retrieval context

Documents and case metadata may contain sensitive information and must
be treated as protected resources.

## 4. Trust Boundaries

Important trust boundaries include:

``` text
Browser / React frontend
          |
          | untrusted request
          v
Django / DRF backend
          |
     +----+----+
     |         |
     v         v
PostgreSQL   MinIO/S3
     |
     +------ Redis/Celery
              |
              +---- OCR
              +---- AI/search
```

The browser is an untrusted environment.

Never rely on frontend validation for security.

## 5. Threat: Broken Access Control

### Scenario

A user changes an ID in an API request:

``` text
/cases/<another-case-id>/
```

or sends another user's/organization's identifier.

### Risk

Unauthorized access to cases or documents.

### Mitigation

-   Authenticate every protected request.
-   Resolve organization from `request.user`.
-   Verify case membership server-side.
-   Resolve role from `CaseMember`.
-   Check the requested permission.
-   Never trust client-supplied role or organization values.

### Prototype test

Log in as User A and attempt to access User B's case/document.

Expected result:

``` text
Access denied
```

## 6. Threat: Cross-Organization Access

### Scenario

A user attempts to access a resource belonging to another organization.

### Risk

Multi-tenant data isolation failure.

### Mitigation

Every protected resource access must establish organization ownership.

``` text
authenticated_user.organization
        ==
resource.organization
```

### Prototype test

Create two organizations and attempt a cross-organization document
access.

Expected result:

``` text
Denied
```

## 7. Threat: Privilege Escalation

### Scenario

A lower-privileged user submits:

``` json
{
  "role_id": "<admin-role-id>"
}
```

or changes membership data directly through an API.

### Risk

Viewer becomes administrator/editor.

### Mitigation

-   Never accept role assignment as an authorization assertion.
-   Restrict membership-management endpoints.
-   Validate who can add/remove members and assign roles.
-   Test direct API requests, not only the UI.

## 8. Threat: Unauthorized Document Download

### Scenario

A user obtains a document URL or document ID and requests it directly.

### Risk

Sensitive document disclosure.

### Mitigation

The download endpoint must perform authorization before serving the
object.

Do not expose permanent public object-storage URLs.

Prefer controlled backend access or short-lived signed access generated
only after authorization.

## 9. Threat: Insecure Upload

### Scenario

A user uploads an unexpected or malicious file.

### Risks

-   Storage abuse
-   Unsupported file processing
-   Malicious content reaching OCR/preview pipelines
-   Resource exhaustion

### Prototype mitigations

-   Allow only required file types.
-   Enforce maximum upload size.
-   Generate server-side storage object names.
-   Do not use the original filename as the storage key.
-   Validate uploaded metadata.
-   Keep object storage private.
-   Run processing asynchronously where appropriate.

## 10. Threat: Document Tampering

### Scenario

The stored document changes after upload.

### Risk

Evidence/document integrity can no longer be trusted.

### Mitigation

Calculate SHA-256 at upload time.

Store the expected hash with the document/version.

During verification:

``` text
stored/loaded file
       ↓
SHA-256
       ↓
compare with stored hash
       ↓
MATCH / MISMATCH
```

### Prototype demonstration

1.  Upload document.
2.  Store SHA-256.
3.  Verify → pass.
4.  Modify underlying file.
5.  Verify again → fail.
6.  Create an audit event for integrity failure.

## 11. Threat: Audit Log Manipulation

### Scenario

A normal application user attempts to modify or delete audit history.

### Risk

Loss of forensic accountability.

### Mitigation

-   Do not expose ordinary update/delete operations for audit events.
-   Restrict direct database modification.
-   Record important security events server-side.
-   Include actor, timestamp, action, resource and outcome.

For the prototype, the audit log should behave as append-only from the
application's perspective.

## 12. Threat: Unauthorized Search Results

### Scenario

A user searches for a keyword that exists in another user's restricted
document.

### Risk

Search results leak protected metadata or document content.

### Mitigation

Apply authorization to the searchable corpus.

``` text
authorized documents
        ↓
keyword/full-text search
        ↓
results
```

Do not search the entire database and simply hide unauthorized rows in
the frontend.

## 13. Threat: AI Data Leakage

### Scenario

The AI retrieves a document that the requesting user cannot access.

### Risk

The model reveals sensitive information through its answer or citations.

### Mitigation

Authorization must happen before documents enter the AI context.

The AI pipeline should receive only documents that the authenticated
user is allowed to access.

## 14. Threat: Session/Authentication Abuse

### Risks

-   Credential guessing
-   Access with inactive accounts
-   Invalid/expired authentication state
-   Weak password handling

### Prototype mitigations

-   Use Django's password hashing rather than storing plaintext
    passwords.
-   Reject inactive users.
-   Use framework authentication mechanisms.
-   Do not log passwords or tokens.
-   Return generic authentication errors where appropriate.

## 15. Threat Priority

### Critical for prototype

1.  Broken access control
2.  Cross-organization access
3.  Unauthorized document download
4.  Privilege escalation
5.  Document integrity failure
6.  Audit manipulation

### High

7.  Search data leakage
8.  AI retrieval data leakage
9.  Insecure upload

### Later hardening

10. Rate limiting
11. Advanced malware scanning
12. Key management/HSM
13. Advanced anomaly detection
14. Production-grade secrets rotation

## 16. Attack Scenarios to Demonstrate

The final demo should include at least:

### Attack 1 --- Unauthorized case access

User A requests User B's case.

Expected:

``` text
403/404
Audit event
No data returned
```

### Attack 2 --- Viewer upload

Viewer calls document-upload endpoint.

Expected:

``` text
Denied
```

### Attack 3 --- Cross-organization document access

User from Organization A requests Organization B's document.

Expected:

``` text
Denied
```

### Attack 4 --- Role manipulation

User submits another role ID.

Expected:

``` text
Role remains unchanged
```

### Attack 5 --- Tampered document

Document bytes are modified.

Expected:

``` text
SHA-256 mismatch
Integrity check failed
Audit event
```

### Attack 6 --- Unauthorized search/AI retrieval

Restricted document contains a searched keyword.

Expected:

``` text
Restricted document is absent from results
AI cannot cite or reveal it
```
