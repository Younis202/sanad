# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   ├── api-server/         # Express API server
│   └── sanad-health/       # سَنَد React+Vite frontend (at /)
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts
│   └── src/seed-sanad.ts   # Seeds 50 dummy patients
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
└── package.json
```

## SANAD Health System

**Project**: سَنَد - Saudi Arabia National Health Infrastructure Platform

### Pages
- `/` — Landing page (Home)
- `/emergency` — Paramedic interface (emergency critical data)
- `/physician` — Physician dashboard (full medical history + drug interaction checker)
- `/citizen` — Citizen health dashboard (health score, AI alerts, vaccinations)
- `/admin` — System admin stats

### API Routes (all under `/api`)
- `GET /api/healthz` — Health check
- `GET /api/patients` — List all patients
- `GET /api/patients/:nationalId` — Full patient record
- `GET /api/emergency/:nationalId` — Emergency critical data only
- `GET /api/physician/:nationalId` — Physician dashboard with drug alerts
- `POST /api/medications/check-interaction` — Drug interaction checker
- `GET /api/citizen/:nationalId` — Citizen dashboard
- `GET /api/ai/predictions/:nationalId` — AI health predictions
- `GET /api/stats` — System-wide statistics

### Demo Patient
- National ID: `1234567890` (Ahmed Al-Shammari)
- Has: diabetes, hypertension, penicillin allergy, 3 medications, 4 medical records, 5 lab results

### Database Schema
- `patients` — Main patient table with arrays for allergies & chronic conditions
- `emergency_contacts` — Emergency contact persons
- `medications` — Current prescriptions
- `medical_records` — Visit history across hospitals
- `lab_results` — Lab test results with status (normal/high/low)
- `vaccinations` — Vaccination records

### Seed Data
Run: `pnpm --filter @workspace/scripts run seed-sanad`
Seeds 50 Saudi dummy patients with realistic Arabic names, medical data

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references. This means:

- **Always typecheck from the root** — run `pnpm run typecheck` (which runs `tsc --build --emitDeclarationOnly`). This builds the full dependency graph so that cross-package imports resolve correctly. Running `tsc` inside a single package will fail if its dependencies haven't been built yet.
- **`emitDeclarationOnly`** — we only emit `.d.ts` files during typecheck; actual JS bundling is handled by esbuild/tsx/vite...etc, not `tsc`.
- **Project references** — when package A depends on package B, A's `tsconfig.json` must list B in its `references` array. `tsc --build` uses this to determine build order and skip up-to-date packages.

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages that define it
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references

## Packages

### `artifacts/api-server` (`@workspace/api-server`)

Express 5 API server. Routes live in `src/routes/` and use `@workspace/api-zod` for request and response validation and `@workspace/db` for persistence.

- Entry: `src/index.ts` — reads `PORT`, starts Express
- App setup: `src/app.ts` — mounts CORS, JSON/urlencoded parsing, routes at `/api`
- Routes: `src/routes/index.ts` mounts sub-routers
- Depends on: `@workspace/db`, `@workspace/api-zod`
- `pnpm --filter @workspace/api-server run dev` — run the dev server
- `pnpm --filter @workspace/api-server run build` — production esbuild bundle

### `artifacts/sanad-health` (`@workspace/sanad-health`)

React + Vite frontend for SANAD. RTL Arabic UI, served at `/`.

- Packages: lucide-react, framer-motion, recharts, date-fns, tailwind-merge, clsx
- All pages use Arabic RTL layout

### `lib/db` (`@workspace/db`)

Database layer using Drizzle ORM with PostgreSQL. Exports a Drizzle client instance and schema models.

- `src/schema/patients.ts` — patients table
- `src/schema/emergency-contacts.ts` — emergency contacts
- `src/schema/medications.ts` — prescriptions
- `src/schema/medical-records.ts` — visit history
- `src/schema/lab-results.ts` — lab test results
- `src/schema/vaccinations.ts` — vaccination records

Production migrations are handled by Replit when publishing. In development, we use `pnpm --filter @workspace/db run push`.

### `lib/api-spec` (`@workspace/api-spec`)

Owns the OpenAPI 3.1 spec (`openapi.yaml`) and the Orval config (`orval.config.ts`). Run codegen: `pnpm --filter @workspace/api-spec run codegen`

### `lib/api-zod` (`@workspace/api-zod`)

Generated Zod schemas from the OpenAPI spec. Used by `api-server` for response validation.

### `lib/api-client-react` (`@workspace/api-client-react`)

Generated React Query hooks and fetch client from the OpenAPI spec.

### `scripts` (`@workspace/scripts`)

Utility scripts. Run: `pnpm --filter @workspace/scripts run seed-sanad`
