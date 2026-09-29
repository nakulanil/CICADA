# Secure DMS --- Security Test Cases

## 1. Purpose

These tests verify that the prototype's authentication, authorization,
document security, integrity controls and audit system work together.

Tests should be performed against the actual API where possible, not
only through the frontend.

## 2. Test Result Format

For every test record:

``` text
Test ID
Description
Preconditions
Request/action
Expected result
Actual result
Pass/Fail
Evidence
```

## 3. Authentication Tests

### AUTH-01 --- Unauthenticated protected request

**Precondition:** No valid authentication.

**Action:** Request a protected case/document endpoint.

**Expected:**

``` text
401 Unauthorized
No protected data returned
```

### AUTH-02 --- Invalid credentials

**Action:** Attempt login with invalid credentials.

**Expected:**

``` text
Login rejected
No session/token issued
LOGIN_FAILED audit event
```

### AUTH-03 --- Inactive user

**Precondition:** User account is inactive.

**Action:** Attempt authentication/access.

**Expected:**

``` text
Access rejected
```

## 4. Organization Isolation Tests

### ORG-01 --- Cross-organization case access

**Precondition:**

``` text
User A → Organization A
Case B → Organization B
```

**Action:** User A requests Case B.

**Expected:**

``` text
Denied
No case data returned
```

### ORG-02 --- Cross-organization document download

**Action:** User A attempts to download a document belonging to
Organization B.

**Expected:**

``` text
Denied
No document bytes returned
Security event recorded
```

### ORG-03 --- Organization ID manipulation

**Action:** Modify request data:

``` json
{
  "organization_id": "another-organization"
}
```

**Expected:**

``` text
Request cannot change authorization context
```

## 5. Case Membership Tests

### CASE-01 --- Authorized member access

**Precondition:** User is a CaseMember.

**Action:** Request the case.

**Expected:**

``` text
Allowed
```

### CASE-02 --- Non-member access

**Precondition:** User belongs to the correct organization but is not a
CaseMember.

**Action:** Request the case/document.

**Expected:**

``` text
Denied
```

### CASE-03 --- Case membership manipulation

**Action:** User attempts to add themselves to a case through an
unauthorized endpoint/request.

**Expected:**

``` text
Denied
Membership unchanged
```

## 6. Role/Privilege Tests

### ROLE-01 --- Viewer upload

**Precondition:** User has Viewer role.

**Action:** POST document upload.

**Expected:**

``` text
403 Forbidden
Document not created
```

### ROLE-02 --- Viewer member management

**Action:** Viewer attempts to add/remove a member.

**Expected:**

``` text
Denied
Membership unchanged
```

### ROLE-03 --- Role ID manipulation

**Action:** User changes submitted `role_id` to a privileged role.

**Expected:**

``` text
Authorization is still based on server-side membership
Privilege is not gained
```

### ROLE-04 --- Privileged operation by lower role

Test each privileged endpoint with every lower-privileged role.

**Expected:**

``` text
Denied consistently
```

## 7. Document Tests

### DOC-01 --- Authorized upload

**Precondition:** User has upload permission.

**Action:** Upload valid document.

**Expected:**

``` text
Document created
Metadata stored
SHA-256 generated
Audit event created
```

### DOC-02 --- Unauthorized download

**Action:** User without document permission requests download.

**Expected:**

``` text
Denied
No document bytes returned
Audit event created
```

### DOC-03 --- Invalid file type

**Action:** Upload unsupported file type.

**Expected:**

``` text
Rejected
No unsafe object stored
```

### DOC-04 --- Oversized file

**Action:** Upload file larger than configured limit.

**Expected:**

``` text
Rejected
```

## 8. Integrity Tests

### INT-01 --- Hash generated on upload

**Action:** Upload document.

**Expected:**

``` text
SHA-256 exists
```

### INT-02 --- Untampered document

**Action:** Verify unchanged document.

**Expected:**

``` text
Calculated hash == stored hash
Integrity passes
```

### INT-03 --- Tampered document

**Action:** Modify the stored bytes without updating the expected hash.

**Expected:**

``` text
Calculated hash != stored hash
Integrity fails
INTEGRITY_CHECK_FAILED audit event
```

This should be one of the prototype's main security demonstrations.

## 9. Version Tests

### VER-01 --- Version creation

**Action:** Upload a new version with appropriate permission.

**Expected:**

``` text
New version created
Previous version remains available according to policy
Audit event created
```

### VER-02 --- Unauthorized restore

**Action:** Viewer attempts to restore an older version.

**Expected:**

``` text
Denied
Current version unchanged
```

## 10. Search Tests

### SEARCH-01 --- Authorized search

**Action:** Search for a keyword in an accessible document.

**Expected:**

``` text
Document appears in results
```

### SEARCH-02 --- Unauthorized search

**Precondition:** Keyword exists only in a restricted document.

**Action:** User without access searches for the keyword.

**Expected:**

``` text
Restricted document does not appear
No restricted snippet/content leaks
```

## 11. AI Retrieval Tests

### AI-01 --- Authorized AI retrieval

**Action:** Ask a question whose answer exists in an authorized
document.

**Expected:**

``` text
AI can retrieve authorized source
Response may cite authorized source
```

### AI-02 --- Unauthorized AI retrieval

**Precondition:** Relevant information exists only in an inaccessible
document.

**Action:** Ask the AI the relevant question.

**Expected:**

``` text
Restricted document is not used
Restricted content is not revealed
No restricted citation is returned
```

## 12. Audit Tests

### AUD-01 --- Download audit

**Action:** Authorized user downloads a document.

**Expected:**

``` text
DOCUMENT_DOWNLOADED event exists
Correct actor/resource/case recorded
```

### AUD-02 --- Unauthorized access audit

**Action:** User attempts unauthorized document access.

**Expected:**

``` text
UNAUTHORIZED_ACCESS_ATTEMPT exists
success = false
```

### AUD-03 --- Audit modification

**Action:** Attempt to update/delete an audit event.

**Expected:**

``` text
Operation unavailable or denied
Original event remains unchanged
```

### AUD-04 --- Actor spoofing

**Action:** Submit another user's ID in request data.

**Expected:**

``` text
Audit actor remains authenticated user
```

## 13. API Tampering Tests

Test protected endpoints by manually changing:

``` text
user_id
organization_id
case_id
document_id
role_id
```

Expected behavior:

``` text
Changing identifiers must never bypass authorization.
```

## 14. Minimum Prototype Security Suite

If time becomes extremely limited, execute these first:

1.  AUTH-01
2.  ORG-01
3.  ORG-02
4.  CASE-02
5.  ROLE-01
6.  ROLE-03
7.  DOC-02
8.  INT-02
9.  INT-03
10. SEARCH-02
11. AI-02
12. AUD-03

These tests directly demonstrate the project's most important security
claims.

## 15. Final Security Demo

Recommended demo sequence:

``` text
1. Login as privileged user
2. Create/access a case
3. Upload document
4. Show SHA-256 hash
5. Download/view as authorized user
6. Login as Viewer
7. Attempt upload → DENIED
8. Attempt restricted case/document → DENIED
9. Attempt cross-organization access → DENIED
10. Tamper with document
11. Run integrity verification → FAILED
12. Open audit trail
13. Show successful and failed security events
14. Run restricted search/AI query
15. Show that unauthorized content is not retrieved
```

This gives the prototype a clear security story rather than merely
showing individual features.
