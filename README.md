# PayCore 💳

A full-stack digital wallet and payment platform built to production-grade standards.

PayCore demonstrates end-to-end financial system engineering — from secure authentication and atomic wallet transfers, to async event processing, containerised deployment, and horizontal scaling.

---

## Architecture Overview

```
┌─────────────────────────────────────────┐
│           Next.js Frontend              │
│   Auth · Dashboard · Transfers          │
│   Protected Routes · JWT · Idempotency  │
└──────────────┬──────────────────────────┘
               │ HTTPS + JWT
               ▼
┌─────────────────────────────────────────┐
│         Express + TypeScript API        │
│                                         │
│  /auth      → Register, Login, Refresh  │
│  /wallets   → Balance, Fund             │
│  /transfers → Send Money (atomic)       │
│  /history   → Paginated Transactions    │
└────────┬──────────────┬─────────────────┘
         │              │
         ▼              ▼
┌──────────────┐  ┌─────────────────────┐
│  PostgreSQL  │  │        Redis        │
│  via Prisma  │  │                     │
│              │  │  • Idempotency keys │
│  • Users     │  │  • Rate limiting    │
│  • Wallets   │  │  • Session cache    │
│  • Transfers │  │  • Balance cache    │
│  • Audit Log │  └──────────┬──────────┘
└──────────────┘             │
                             ▼
                   ┌──────────────────────┐
                   │      RabbitMQ        │
                   │                      │
                   │  transfer.completed  │
                   │  transfer.failed     │
                   │  audit.log           │
                   └──────┬───────────────┘
                          │
              ┌───────────┼───────────┐
              ▼           ▼           ▼
        ┌──────────┐ ┌─────────┐ ┌──────────────┐
        │  Email   │ │  Audit  │ │Reconciliation│
        │  Worker  │ │  Worker │ │   Worker     │
        └──────────┘ └─────────┘ └──────────────┘

All services containerised with Docker
Orchestrated and scaled with Kubernetes
```

---

## Tech Stack

### Frontend
| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 + TypeScript |
| Styling | Tailwind CSS |
| HTTP Client | Axios with interceptors |
| State | React Context + useReducer |

### Backend
| Layer | Technology |
|-------|-----------|
| Runtime | Node.js + TypeScript |
| Framework | Express.js |
| ORM | Prisma |
| Database | PostgreSQL |
| Cache | Redis |
| Queue | RabbitMQ |
| Auth | JWT (access + refresh token rotation) |
| Validation | Zod |
| Security | Helmet, bcrypt, transaction PIN |

### Infrastructure
| Layer | Technology |
|-------|-----------|
| Containerisation | Docker + docker-compose |
| Orchestration | Kubernetes (minikube) |
| Logging | Winston (structured JSON) |
| API Docs | Swagger / OpenAPI |

---

## Core Features

### Authentication & Security
- JWT access token (short-lived) + refresh token (httpOnly cookie)
- Token rotation on every refresh
- Separate transaction PIN for transfers
- Account locking after failed PIN attempts
- Rate limiting via Redis
- Input validation on every endpoint
- Helmet security headers

### Wallet System
- One wallet per user (auto-created on registration)
- Fund wallet (simulated bank deposit)
- Real-time balance with Redis caching
- Atomic transfers using PostgreSQL transactions

### Transfer Engine
- ACID-compliant wallet transfers
- Client-generated idempotency keys (no duplicate charges)
- Full audit trail on every financial operation
- Paginated transaction history with filters

### Async Processing (Workers)
- Email notification on successful transfer
- Audit log consumer
- Reconciliation worker for failed/pending transactions
- Dead letter queue for failed messages

### Observability
- Structured JSON logging with Winston
- Correlation ID on every request (traceable across services)
- Health check and readiness endpoints
- Request/response logging middleware

---

## Project Structure

```
paycore/
├── frontend/                 # Next.js application
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── dashboard/
│   │   ├── transfer/
│   │   └── history/
│   ├── components/
│   ├── lib/
│   │   ├── api.ts            # Axios instance + interceptors
│   │   └── auth.ts           # Token management
│   └── context/
│       └── AuthContext.tsx
│
├── backend/                  # Express API
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   ├── wallet.routes.ts
│   │   │   └── transfer.routes.ts
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts
│   │   │   ├── rateLimit.middleware.ts
│   │   │   └── idempotency.middleware.ts
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   └── lib/
│   │       ├── redis.ts
│   │       ├── rabbitmq.ts
│   │       └── logger.ts
│   └── Dockerfile
│
├── workers/                  # RabbitMQ consumers
│   ├── email.worker.ts
│   ├── audit.worker.ts
│   └── reconciliation.worker.ts
│
├── k8s/                      # Kubernetes manifests
│   ├── api-deployment.yaml
│   ├── worker-deployment.yaml
│   ├── postgres-statefulset.yaml
│   ├── redis-deployment.yaml
│   └── configmap.yaml
│
├── docker-compose.yml        # Full local stack
├── docker-compose.dev.yml    # Dev with hot reload
└── README.md
```

---

## Build Phases

| Phase | Focus | Status |
|-------|-------|--------|
| 1 | Node/TS + PostgreSQL + Prisma + Atomic Transfers | 🔲 |
| 2 | Redis — Idempotency + Rate Limiting + Caching | 🔲 |
| 3 | RabbitMQ + Workers — Async Event Processing | 🔲 |
| 4 | Docker + docker-compose — Full Stack Containerisation | 🔲 |
| 5 | Security Hardening — PIN, Helmet, Validation, Audit | 🔲 |
| 6 | Next.js Frontend — Auth, Dashboard, Transfers | 🔲 |
| 7 | Kubernetes — Deployment, Scaling, Health Checks | 🔲 |
| 8 | Observability — Structured Logging, Correlation IDs | 🔲 |

---

## Getting Started

### Prerequisites
- Node.js 18+
- Docker + Docker Compose
- PostgreSQL (or use Docker)
- Redis (or use Docker)

### Run everything locally with Docker

```bash
git clone https://github.com/Yusuf-R/paycore.git
cd paycore
docker compose up --build
```

Services will be available at:
- Frontend → http://localhost:3000
- API → http://localhost:5000
- RabbitMQ Dashboard → http://localhost:15672
- PostgreSQL → localhost:5432
- Redis → localhost:6379

### Run backend only (development)

```bash
cd backend
cp .env.example .env
npm install
npx prisma migrate dev
npm run dev
```

---

## Key Engineering Decisions

**Why PostgreSQL for wallets?**
ACID compliance is non-negotiable for financial data. A wallet transfer that partially executes — debiting one account without crediting another — is a critical failure. PostgreSQL transactions guarantee atomicity.

**Why Redis for idempotency?**
Network retries are a reality in distributed systems. Without idempotency, a retry doubles a transfer. Redis stores a request fingerprint with a TTL — duplicate requests return the cached response without touching the database.

**Why RabbitMQ for notifications?**
The transfer API response should not depend on whether an email sends successfully. Publishing to a queue decouples the transfer from its side effects — if the email worker is down, the message waits and delivers when it recovers.

**Why separate transaction PIN?**
Login credentials authenticate identity. A transaction PIN authorises a specific financial action. Separating them limits damage if a session token is compromised — an attacker cannot initiate transfers without the PIN.

**Why httpOnly cookies for refresh tokens?**
localStorage is accessible via JavaScript and vulnerable to XSS attacks. An httpOnly cookie cannot be read by JavaScript — only sent automatically by the browser on matching requests.

---

## Author

**Naviroq Dev-Tech**
