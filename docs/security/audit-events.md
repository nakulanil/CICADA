# Secure DMS --- Audit Event Contract

## 1. Purpose

The audit system records security-relevant actions performed in the
Secure DMS.

The prototype should provide a reliable chronological record of who
performed an action, what resource was affected, when it happened, and
whether it succeeded.

## 2. Design Principles

Audit events should be:

-   Server-generated
-   Append-only from the application perspective
-   Timestamped
-   Associated with the authenticated actor when available
-   Associated with the affected resource
-   Explicit about success/failure
-   Protected from ordinary user modification/deletion

Never accept the actor identity from the request body.

The backend should determine the actor from the authenticated
session/token.

## 3. Recommended Event Fields

Minimum recommended structure:

  Field               Purpose
  ------------------- ------------------------------------------
  `id`                Unique event identifier
  `timestamp`         When the event occurred
  `actor_user_id`     Authenticated user performing the action
  `organization_id`   Organization context
  `action`            Action being recorded
  `resource_type`     Case/document/user/etc.
  `resource_id`       Affected resource
  `case_id`           Related case when applicable
  `success`           Whether the operation succeeded
  `ip_address`        Request source where available
  `user_agent`        Client information where available
  `metadata`          Additional structured information

For privacy and security, metadata should contain only information
useful for auditing.

Do not store passwords, access tokens, or sensitive secrets in audit
metadata.

## 4. Recommended Actions

### Authentication

``` text
LOGIN
LOGIN_FAILED
LOGOUT
```

### Case

``` text
CASE_CREATED
CASE_UPDATED
CASE_CLOSED
```

### Membership

``` text
MEMBER_ADDED
MEMBER_REMOVED
MEMBER_ROLE_CHANGED
```

### Documents

``` text
DOCUMENT_UPLOADED
DOCUMENT_VIEWED
DOCUMENT_DOWNLOADED
DOCUMENT_UPDATED
DOCUMENT_DELETED
```

### Versions

``` text
VERSION_CREATED
VERSION_RESTORED
```

### Security

``` text
UNAUTHORIZED_ACCESS_ATTEMPT
INTEGRITY_CHECK
INTEGRITY_CHECK_FAILED
```

### Search/AI

``` text
DOCUMENT_SEARCH
AI_RETRIEVAL
```

The exact event set can be reduced for the prototype if implementation
time is limited.

## 5. Example Events

### Successful login

``` json
{
  "action": "LOGIN",
  "actor_user_id": "authenticated-user",
  "organization_id": "user-organization",
  "success": true
}
```

### Failed authorization

``` json
{
  "action": "UNAUTHORIZED_ACCESS_ATTEMPT",
  "actor_user_id": "authenticated-user",
  "organization_id": "user-organization",
  "resource_type": "document",
  "resource_id": "requested-document",
  "success": false
}
```

### Successful download

``` json
{
  "action": "DOCUMENT_DOWNLOADED",
  "actor_user_id": "authenticated-user",
  "resource_type": "document",
  "resource_id": "document-id",
  "case_id": "case-id",
  "success": true
}
```

### Integrity failure

``` json
{
  "action": "INTEGRITY_CHECK_FAILED",
  "actor_user_id": "authenticated-user",
  "resource_type": "document_version",
  "resource_id": "version-id",
  "case_id": "case-id",
  "success": false,
  "metadata": {
    "expected_hash": "stored-sha256",
    "actual_hash": "calculated-sha256"
  }
}
```

If storing both hashes is considered too sensitive, store only a
mismatch indicator and retain detailed hashes in a controlled integrity
record.

## 6. When to Audit

At minimum, audit:

### Authentication

-   Successful login
-   Failed login
-   Logout

### Authorization

-   Important denied access attempts
-   Attempts to access another organization/case
-   Attempts to perform privileged actions without permission

### Case management

-   Case creation
-   Case update/close
-   Member addition/removal
-   Role changes

### Documents

-   Upload
-   View
-   Download
-   Delete
-   Version creation
-   Version restoration

### Integrity

-   Verification
-   Verification failure

## 7. Failed Actions Matter

Do not record only successful operations.

Security failures are valuable evidence.

For example:

``` text
User attempts unauthorized download
        ↓
Authorization fails
        ↓
UNAUTHORIZED_ACCESS_ATTEMPT
        ↓
403/404 response
```

This allows the prototype to demonstrate both prevention and
accountability.

## 8. Audit Integrity

Application users must not be able to:

``` text
PUT /audit-events/<id>
DELETE /audit-events/<id>
```

unless the project explicitly creates a tightly controlled
administrative mechanism.

For the prototype, the simplest secure approach is:

``` text
CREATE → allowed internally
UPDATE → not exposed
DELETE → not exposed
```

## 9. Audit API

If an audit viewing endpoint is implemented, it should be read-only.

Example:

``` text
GET /api/audit-events/
```

Access should be restricted to an appropriate privileged role.

Support filtering by:

-   action
-   actor
-   resource
-   case
-   success/failure
-   date range

Do not expose all organizations' audit events to one user.

## 10. Implementation Notes

A reusable audit helper/service should be used so individual endpoints
do not implement inconsistent event creation.

Conceptually:

``` text
record_audit(
    action,
    resource_type,
    resource_id,
    case_id=None,
    success=True,
    metadata=None
)
```

The helper should obtain the actor and organization from trusted
server-side context.

## 11. Acceptance Criteria

The audit system passes the prototype requirement when:

-   Security-sensitive actions create audit events.
-   Failed authorization can be identified in the audit trail.
-   Document downloads are auditable.
-   Integrity failures are auditable.
-   Actor identity is server-derived.
-   Users cannot edit/delete audit events through normal APIs.
-   Audit events are isolated by organization where applicable.
