# JobTracker

A full-stack job application tracker to manage your hiring pipeline — from first application to offer.

## Demo

> _Add a screenshot or Loom link here before submitting._

---

## Tech Stack

| Layer     | Technology                                      |
|-----------|-------------------------------------------------|
| Frontend  | React 18 + Vite, TypeScript (strict), React Router v6 |
| Styling   | Vanilla CSS with CSS custom properties          |
| Forms     | React Hook Form + Zod validation                |
| Backend   | Node.js + Express + TypeScript (strict)         |
| Database  | PostgreSQL 16 with raw `pg` driver              |
| API Style | REST                                            |
| Testing   | Jest + ts-jest + Supertest                      |
| DevOps    | Docker + docker-compose                         |

---

## Features

- **Application List** — paginated table with company, title, type, status, and applied date
- **Add / Edit** — modal form with full validation (Zod on frontend, express-validator on backend)
- **Delete** — confirmation modal before deletion
- **Filter by Status** — Applied / Interviewing / Offer / Rejected
- **Search** — live search by company name or job title
- **Detail View** — full application detail page
- **Stats row** — clickable status counters that double as filters
- **Pagination** — server-side, 20 results per page
- **Loading states** — spinners and disabled buttons during async ops
- **Toast notifications** — success and error feedback
- **Database migrations** — versioned, idempotent, run on startup
- **Unit tests** — 9 tests covering all REST endpoints

---

## Prerequisites

- Node.js ≥ 20
- PostgreSQL 16 (or Docker)
- npm ≥ 9

---

## Quick Start (Docker)

```bash
git clone <your-repo-url>
cd jobtracker
docker compose up --build
```

- Frontend: http://localhost:3000  
- Backend API: http://localhost:4000  
- Postgres: localhost:5432

---

## Manual Setup

### 1. Database

Create a PostgreSQL database:

```sql
CREATE DATABASE jobtracker;
```

### 2. Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your DATABASE_URL
npm install
npm run migrate      # runs schema migrations
npm run dev          # starts on http://localhost:4000
```

### 3. Frontend

```bash
cd frontend
cp .env.example .env
# Edit .env: VITE_API_URL=http://localhost:4000
npm install
npm run dev          # starts on http://localhost:5173
```

---

## Environment Variables

### Backend (`backend/.env`)

| Variable       | Default                                              | Description              |
|----------------|------------------------------------------------------|--------------------------|
| `DATABASE_URL` | `postgresql://postgres:password@localhost:5432/jobtracker` | PostgreSQL connection string |
| `PORT`         | `4000`                                               | API server port          |
| `NODE_ENV`     | `development`                                        | Environment              |
| `CORS_ORIGIN`  | `http://localhost:5173`                              | Allowed frontend origin  |

### Frontend (`frontend/.env`)

| Variable        | Default                     | Description       |
|-----------------|-----------------------------|-------------------|
| `VITE_API_URL`  | `http://localhost:4000`     | Backend API URL   |

---

## Running Tests

```bash
cd backend
npm test
```

Runs 9 unit tests covering all five REST endpoints with mocked database layer.

---

## API Reference

Base URL: `http://localhost:4000`

### `GET /applications`

List all applications with optional filtering and pagination.

| Query Param | Type   | Description                              |
|-------------|--------|------------------------------------------|
| `status`    | string | Filter by status (Applied, Interviewing, Offer, Rejected) |
| `search`    | string | Search company name or job title (case-insensitive) |
| `page`      | number | Page number (default: 1)                 |
| `limit`     | number | Results per page (default: 20)           |

**Response:**
```json
{
  "data": [ ...applications ],
  "total": 42,
  "page": 1,
  "limit": 20,
  "totalPages": 3
}
```

### `GET /applications/:id`

Get a single application by ID.

### `POST /applications`

Create a new application.

**Body:**
```json
{
  "company_name": "Leapfrog Technology",
  "job_title": "Software Engineer Intern",
  "job_type": "Internship",
  "status": "Applied",
  "applied_date": "2024-06-01",
  "notes": "Applied via LinkedIn"
}
```

### `PATCH /applications/:id`

Partially update an application. All fields optional.

### `DELETE /applications/:id`

Delete an application. Returns `204 No Content`.

### `GET /health`

Health check. Returns `{ "status": "ok" }`.

---

## Database Schema

```sql
CREATE TABLE applications (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name VARCHAR(255) NOT NULL,
  job_title    VARCHAR(255) NOT NULL,
  job_type     job_type_enum NOT NULL,   -- Internship | Full-time | Part-time
  status       status_enum NOT NULL DEFAULT 'Applied',  -- Applied | Interviewing | Offer | Rejected
  applied_date DATE NOT NULL,
  notes        TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

Indexes on `status`, `applied_date`, and a GIN full-text index on `company_name`.  
An `AFTER UPDATE` trigger keeps `updated_at` current automatically.

---

## Project Structure

```
jobtracker/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Route handlers
│   │   ├── db/               # Pool, repository, migrations
│   │   ├── middleware/        # Validators, error handler
│   │   ├── routes/           # Express routers
│   │   ├── types/            # Shared TypeScript types
│   │   ├── app.ts            # Express app setup
│   │   └── index.ts          # Server entry point
│   ├── Dockerfile
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── api/              # Axios API client
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Route-level page components
│   │   ├── types/            # Shared TypeScript types
│   │   └── App.tsx
│   ├── Dockerfile
│   ├── nginx.conf
│   └── .env.example
└── docker-compose.yml
```
