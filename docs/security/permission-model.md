# Secure DMS --- Permission Model

## 1. Purpose

This document defines the authorization model for the Secure Document
Management System prototype.

The prototype must enforce permissions **server-side**. Frontend
visibility of buttons or pages is not a security control.

## 2. Core Security Model

Every protected request follows this logical flow:

``` text
Request
  ↓
Authenticate user
  ↓
Identify organization
  ↓
Identify case/document
  ↓
Verify resource belongs to user's organization
  ↓
Verify CaseMember relationship
  ↓
Resolve CaseMember.role
  ↓
Check required permission
  ↓
ALLOW / DENY
  ↓
Create audit event
```

A client must never be trusted to provide its own authorization
decision.

Do not trust these values from the frontend:

-   `user_id`
-   `organization_id`
-   `role_id`
-   permission names
-   organization membership
-   case membership
-   document ownership

The backend should derive authorization context from the authenticated
user and database records.

## 3. Existing Data Model

The current database contains:

-   `Organization`
-   `Role`
-   `User`
-   `Case`
-   `CaseMember`

`CaseMember` connects a user to a case and associates a role with that
membership.

Conceptually:

``` text
Organization
   ├── Users
   └── Roles

Case
   └── CaseMembers
          ├── User
          └── Role
```

The role attached to a `CaseMember` is the role used when evaluating
access to that case.

## 4. Prototype Roles

The exact role names can be finalized with M1/M3, but the prototype
should support at least three distinct authorization levels.

Recommended baseline:

  --------------------------------------------------------------------------------------------
  Role                       View   Download    Upload    Create    Manage    Delete   Restore
                                                            Case   Members             Version
  --------------------- --------- ---------- --------- --------- --------- --------- ---------
  Admin                       Yes        Yes       Yes       Yes       Yes       Yes       Yes

  Investigator/Editor         Yes        Yes       Yes     Yes\*        No   Limited       Yes

  Viewer                      Yes        Yes        No        No        No        No        No
  --------------------------------------------------------------------------------------------

`*` Case creation should be restricted to whichever project role is
designated as a case creator.

The important requirement is not the exact naming but that the backend
can distinguish permissions.

## 5. Permission Names

Use explicit permission checks rather than scattering role-name
comparisons throughout the code.

Recommended permissions:

``` text
CASE_VIEW
CASE_CREATE
CASE_UPDATE
CASE_CLOSE
CASE_MANAGE_MEMBERS

DOCUMENT_VIEW
DOCUMENT_DOWNLOAD
DOCUMENT_UPLOAD
DOCUMENT_UPDATE
DOCUMENT_DELETE

VERSION_CREATE
VERSION_RESTORE

SEARCH_CASE
SEARCH_DOCUMENT

INTEGRITY_VERIFY

AUDIT_VIEW
```

For the prototype, not every permission needs a separate UI feature, but
the authorization layer should be structured so these checks can be
added cleanly.

## 6. Authorization Rules

### Organization isolation

A user can only access resources belonging to their organization.

``` text
request.user.organization_id == resource.organization_id
```

If the resource is connected to a case, resolve the organization through
the case and verify it against the authenticated user.

A valid case membership in another organization must still result in
denial.

### Case membership

For case-level resources:

``` text
CaseMember.objects.filter(
    case=case,
    user=request.user
).exists()
```

must be true before the user's case role can grant access.

### Role resolution

Never accept a role ID from the request body as proof of permission.

Resolve the role from the authenticated user's `CaseMember` record.

``` text
authenticated user
        ↓
CaseMember
        ↓
Role
        ↓
Permission
```

## 7. Deny by Default

If the system cannot establish that the user is authorized, deny the
request.

Examples:

-   User is not authenticated → deny.
-   User is inactive → deny.
-   User is outside the resource organization → deny.
-   User is not a case member → deny.
-   Role does not have required permission → deny.
-   Resource does not exist → return an appropriate non-leaking
    response.
-   Authorization context is ambiguous → deny.

## 8. HTTP/API Expectations

Recommended behavior:

-   `401 Unauthorized` --- authentication is missing or invalid.
-   `403 Forbidden` --- user is authenticated but lacks permission.
-   `404 Not Found` --- may be preferable where revealing resource
    existence would create an information leak.

The team should use one consistent policy across protected endpoints.

## 9. Document Access

Document operations must be authorized individually.

Do not assume:

``` text
user can view case
→ user can perform every document operation
```

Instead:

``` text
case access
+
document permission
=
document operation allowed
```

Examples:

-   Viewer can view/download but cannot upload.
-   Investigator can upload and create versions.
-   Only an appropriately privileged role can delete or restore.
-   Unauthorized document download must fail at the backend.

## 10. Search Authorization

Search is also a protected operation.

The search pipeline must not return documents merely because their text
matches a query.

The effective result set should be:

``` text
Search matches
INTERSECT
Documents user is authorized to access
```

Authorization must be applied before returning document content,
snippets, metadata that is considered sensitive, or AI-generated answers
based on unauthorized documents.

## 11. AI Retrieval Authorization

The AI/semantic retrieval feature must follow the same authorization
boundary.

Correct:

``` text
User
 ↓
Authorized cases/documents
 ↓
Embedding/vector search
 ↓
Relevant authorized documents
 ↓
AI response
```

Incorrect:

``` text
User
 ↓
Global vector search
 ↓
Filter results afterward
```

Filtering after retrieval can leak information through ranking,
snippets, citations, or generated responses.

## 12. Integration Contract for M1

The backend should expose reusable authorization logic rather than
implementing ad-hoc checks in each endpoint.

Suggested conceptual interface:

``` text
can(user, permission, resource) -> boolean
```

or a Django/DRF permission/policy structure.

M4 should review protected endpoints with M1 and confirm that every
endpoint has an authorization decision.

## 13. Security Acceptance Criteria

The permission model is considered implemented when:

-   Unauthenticated users cannot access protected resources.
-   Users cannot access cases outside their organization.
-   Non-members cannot access case documents.
-   Viewer cannot upload documents.
-   Unauthorized users cannot download documents.
-   Users cannot change their own role by modifying request data.
-   Users cannot select another organization ID to gain access.
-   Search only returns authorized documents.
-   AI retrieval only uses authorized documents.
-   Authorization failures generate appropriate audit events where
    required.
