# AkayTheory — Deployment & Infrastructure Guide

**Target Environments:** Local Docker, Staging, and Production Kubernetes  
**Runtime Architecture:** Containerized Node.js 20 (Alpine Rootless) + Nginx (Alpine) + PostgreSQL 16  
**Security Standard:** CIS Benchmark & Non-root UID 10001 with `dumb-init`  

---

## 1. Environment Configurations

| Variable | Description | Production Recommended Value |
|---|---|---|
| `NODE_ENV` | Runtime environment | `production` |
| `PORT` | API listener port | `4000` |
| `CLIENT_URL` | Frontend origin for CORS | `https://akaytheory.dev` |
| `DATABASE_URL` | PostgreSQL connection pool URL | `postgresql://user:pass@host:5432/db?sslmode=require&pgbouncer=true` |
| `SESSION_SECRET` | Secret key for session encryption | 32+ cryptographically random bytes |
| `SESSION_COOKIE_NAME` | Cookie name | `__Host-akaytheory_session` |
| `SESSION_TTL_DAYS` | Session lifetime | `30` |
| `RATE_LIMIT_WINDOW_MS`| Rate limit calculation window | `60000` (1 min) |
| `RATE_LIMIT_MAX_REQUESTS` | Global rate limit threshold | `120` |
| `AUTH_RATE_LIMIT_MAX_REQUESTS`| Authentication rate limit threshold | `10` |

---

## 2. Docker Container Builds

### 2.1 Backend API Image Build
```bash
docker build -t akaytheory-api:latest -f Dockerfile.api .
```

### 2.2 Frontend Web Image Build
```bash
docker build -t akaytheory-web:latest -f Dockerfile.web .
```

### 2.3 Running Locally with Docker Compose
```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: akaytheory-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${POSTGRES_USER:-postgres}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-postgres}
      POSTGRES_DB: akaytheory_prod
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

  api:
    build:
      context: .
      dockerfile: Dockerfile.api
    container_name: akaytheory-api
    restart: unless-stopped
    ports:
      - "4000:4000"
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://postgres:postgres@postgres:5432/akaytheory_prod?schema=public
      PORT: 4000
      CLIENT_URL: http://localhost:80
    depends_on:
      postgres:
        condition: service_healthy

  web:
    build:
      context: .
      dockerfile: Dockerfile.web
    container_name: akaytheory-web
    restart: unless-stopped
    ports:
      - "80:80"
    depends_on:
      - api

volumes:
  pgdata:
```

---

## 3. Kubernetes Deployment Manifests

```yaml
# k8s/api-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: akaytheory-api
  labels:
    app: akaytheory-api
spec:
  replicas: 2
  selector:
    matchLabels:
      app: akaytheory-api
  template:
    metadata:
      labels:
        app: akaytheory-api
    spec:
      securityContext:
        runAsNonRoot: true
        runAsUser: 10001
        runAsGroup: 10001
        fsGroup: 10001
      containers:
        - name: api
          image: akaytheory-api:latest
          ports:
            - containerPort: 4000
          livenessProbe:
            httpGet:
              path: /health
              port: 4000
            initialDelaySeconds: 15
            periodSeconds: 20
          readinessProbe:
            httpGet:
              path: /health
              port: 4000
            initialDelaySeconds: 5
            periodSeconds: 10
          resources:
            requests:
              cpu: 250m
              memory: 256Mi
            limits:
              cpu: 1000m
              memory: 512Mi
```

