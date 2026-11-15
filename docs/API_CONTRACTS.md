# AkayTheory — API Contracts & Endpoints Specification

**Document Identifier:** AT-API-001  
**Base URL:** `/api/v1`  
**Standard:** REST + JSON + RFC 7807 (Problem Details for HTTP APIs)  
**Status:** Verified Phase 1 API Contracts  
**Date:** 15 November 2026  

---

## 1. System & Health Endpoints

### `GET /api/v1/health`
Returns system status, uptime, and database connectivity.

- **Request:** None
- **Response `200 OK`:**
```json
{
  "success": true,
  "data": {
    "status": "HEALTHY",
    "uptimeSeconds": 142,
    "database": "CONNECTED",
    "version": "1.0.0"
  },
  "meta": {
    "timestamp": "2026-11-15T06:50:00.000Z"
  }
}
```

---

## 2. Authentication & Identity Contracts (Phase 3 Core)

### `POST /api/v1/auth/register`
Creates a new learner account with validated credentials.

- **Request Body:**
```json
{
  "email": "learner@akaytheory.dev",
  "password": "SecurePassword123!",
  "username": "akay_dev",
  "displayName": "Akay Developer"
}
```
- **Response `201 Created`:** Sets HTTP-only session cookie `akaytheory_session`.
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "e4f8d9b2-3a1c-4b5e-8f9a-1c2d3e4f5a6b",
      "email": "learner@akaytheory.dev",
      "username": "akay_dev",
      "displayName": "Akay Developer",
      "role": "LEARNER",
      "isEmailVerified": false
    }
  }
}
```

### `POST /api/v1/auth/login`
Authenticates a user and establishes an HTTP-only cookie session.

- **Request Body:**
```json
{
  "email": "learner@akaytheory.dev",
  "password": "SecurePassword123!"
}
```
- **Response `200 OK`:** Returns user profile and sets session cookie.

---

## 3. Curriculum & Knowledge Graph Contracts

### `GET /api/v1/domains`
Returns all 8 domains with their ordered categories and public topic counts.

### `GET /api/v1/topics/:slug`
Returns full topic metadata, prerequisite dependencies, and cross-domain links.

### `GET /api/v1/lessons/:slug`
Returns published lesson sections, interactive visualizer configurations, and knowledge check questions. Drafts return 404 for non-admin visitors (`BR-016`, `AT-012`).

---

## 4. Mastery & Revision Engine Contracts

### `POST /api/v1/progress/quiz`
Submits answers to a topic quiz, computes score, logs `MasteryAssessment`, and transitions mastery to `FAMILIAR` if score $\ge 75\%$.

- **Request Body:**
```json
{
  "topicId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "answers": [
    {
      "questionId": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
      "selectedOptionId": "d3b07384-d113-46d4-a076-231a473e6a98"
    }
  ]
}
```
- **Response `200 OK`:**
```json
{
  "success": true,
  "data": {
    "scorePercentage": 100,
    "passed": true,
    "masteryLevel": "FAMILIAR",
    "nextRevisionDueAt": "2026-11-18T00:00:00.000Z"
  }
}
```

### `GET /api/v1/revision/due`
Returns all topics due or overdue for spaced repetition based on current UTC time (`AT-013`).

