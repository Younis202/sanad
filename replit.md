# SANAD — National Digital Health Infrastructure

## Project Overview
Enterprise-grade Arabic RTL healthcare platform for Saudi Arabia. Simulates a national digital health OS with 4 distinct operational contexts.

## Architecture

### Frontend (`artifacts/sanad-health`)
- React + Vite + TypeScript
- Tailwind CSS v4 with custom enterprise design system
- Zustand for state management (4 stores)
- Wouter for client-side routing
- Cairo + IBM Plex Mono fonts (Google Fonts)
- No emoji — SVG icons only (enterprise aesthetic)

**Routes:**
- `/` → Home landing page
- `/emergency` → Emergency Interface (paramedic scan)
- `/clinical/dashboard` → Physician Dashboard
- `/citizen` → Citizen Health Dashboard
- `/national/dashboard` → National Operations Center

**Design System (`src/index.css`):**
- CSS custom properties for brand, neutral, semantic, sidebar colors
- Card system: `.card`, `.card-critical`, `.card-warning`, `.card-success`, `.card-info`
- Badge system: `.badge-*` and `.badge-*-solid`
- Typography classes: `.text-h1/.h2/.h3/.h4`, `.text-label`, `.text-caption`, `.stat-value`
- Button system: `.btn`, `.btn-primary`, `.btn-danger`, `.btn-ghost`
- Data table: `.data-table`
- Priority strip: `.priority-strip-critical/warning/info`

**Component Hierarchy:**
```
components/
  system/    → Sidebar, PriorityStrip, AuditFooter
  clinical/  → AIInsightPanel, PatientTimeline
  emergency/ → EmergencyCard
  shared/    → LoadingSpinner, ErrorState

contexts/
  emergency/page.tsx
  clinical/dashboard.tsx
  citizen/page.tsx
  national/dashboard.tsx
  home.tsx

lib/
  api/client.ts          → API abstraction (api.emergency, api.physician, api.citizen, api.national)
  state/emergency.store.ts
  state/clinical.store.ts
  state/citizen.store.ts
  state/national.store.ts
```

### Backend (`artifacts/api-server`)
- Express + TypeScript + Drizzle ORM + PostgreSQL
- Port: 8080, serves on `/api` path

**Endpoints:**
- `GET /api/emergency/:nationalId` → critical patient data
- `GET /api/physician/:nationalId` → full medical record + drug alerts
- `GET /api/citizen/:nationalId` → citizen dashboard
- `GET /api/stats` → national KPIs
- `GET /api/patients` → patient list
- `POST /api/medications/check-interaction` → drug interaction check
- `GET /api/ai/predictions/:nationalId` → AI risk predictions

### Database (`lib/db`)
- PostgreSQL via `DATABASE_URL`
- 6 tables: patients, medicalRecords, medications, labResults, vaccinations, emergencyContacts
- 50 seeded Saudi patients (seed: `pnpm --filter @workspace/scripts run seed-sanad`)

## Demo Patient
- National ID: `1234567890`
- Name: أحمد محمد الشمري (Ahmed Al-Shammari)
- Blood type: O+, allergies: Penicillin + Ibuprofen, conditions: Diabetes T2 + Hypertension

## Key Technical Decisions
- RTL-first (html dir="rtl") — Arabic as primary language
- CSS custom properties for design tokens (not Tailwind variables)
- No emoji — enterprise medical aesthetic
- Zustand stores per context to prevent cross-contamination
- API path `/api` served by Replit's path-based routing directly to port 8080
- Enterprise color system: brand (cyan), critical (rose), warning (amber), success (green), info (blue)
