# AkayTheory — Authentication Flow & Security Architecture

**Document Identifier:** AT-AUTH-001  
**Authoritative Reference:** `AkayTheory_SRS_v1.4.md` (FR-AUTH-001 to 021, BR-010, BR-014, BR-017, BR-021)  
**Security Model:** HTTP-Only Cookie Session Model with PostgreSQL Backing  
**Status:** Verified Phase 3 Implementation  
**Date:** 15 November 2026  

---

## 1. Authentication Lifecycle

```
[ Learner Client ]                       [ API Server ]                       [ PostgreSQL ]
        │                                      │                                     │
        │ 1. POST /api/v1/auth/register        │                                     │
        ├─────────────────────────────────────►│                                     │
        │    (email, username, password)       │                                     │
        │                                      │ 2. Check duplicate email/username   │
        │                                      ├────────────────────────────────────►│
        │                                      │ 3. Hash password (bcrypt 10 rounds) │
        │                                      │ 4. Create User & Session records    │
        │                                      ├────────────────────────────────────►│
        │ 5. Response 201 Created              │                                     │
        │    Set-Cookie: akaytheory_session    │                                     │
        │    SameSite=Lax; HttpOnly; Path=/    │                                     │
        │◄─────────────────────────────────────┤                                     │
        │                                      │                                     │
        │ 6. Subsequent Request (with cookie)  │                                     │
        ├─────────────────────────────────────►│                                     │
        │                                      │ 7. Query Session & User by token    │
        │                                      ├────────────────────────────────────►│
        │                                      │ 8. Attach req.user (Role-checked)   │
        │ 9. Response 200 OK                   │                                     │
        │◄─────────────────────────────────────┤                                     │
```

---

## 2. Hardened Security Safeguards

### 2.1 Credential Orphaning Prevention (`BR-021`, `AT-014`)
A user authenticated solely via Google OAuth cannot unlink their Google identity if they do not possess a verified local password hash. The backend intercepts the request and responds with:
- **Status:** HTTP 400 Bad Request
- **Code:** `CANNOT_UNLINK_LAST_AUTH`
- **Detail:** "You must establish a verified password before unlinking Google OAuth."

### 2.2 Global Session Revocation (`BR-010`, `BR-014`)
When a user updates their password or requests credential reset, all existing active session records in the `Session` table are immediately deleted in a database transaction (`AuthService.revokeAllUserSessions`), preventing hijacked cookies from remaining valid.

### 2.3 OAuth Pre-Registration Defense (`BR-017`, `AT-011`)
When an unverified local account exists and a user logs in via verified Google OAuth (`email_verified = true`), the pre-existing unverified password hash is automatically purged, preventing credential takeover from unverified registrations.

---

## 3. Implemented API Endpoints

| Method | Endpoint | Protection | Description |
|---|---|---|---|
| `POST` | `/api/v1/auth/register` | Public | Registers learner, hashes password, sets cookie. |
| `POST` | `/api/v1/auth/login` | Public | Validates email/password, issues session cookie. |
| `POST` | `/api/v1/auth/logout` | Session Cookie | Deletes active session, clears cookie header. |
| `GET` | `/api/v1/auth/me` | Session Cookie | Returns authenticated `SessionUser` profile. |
| `POST` | `/api/v1/auth/unlink-oauth` | Session Cookie | Safely unlinks OAuth identity with credential check. |

