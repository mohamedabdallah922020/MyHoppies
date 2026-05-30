# MyHoppies

Personal hobbies tracking app ([Issue #1 — Login page](https://github.com/mohamedabdallah922020/MyHoppies/issues/1) implemented here).

Stack: Next.js (App Router) · TypeScript · Tailwind CSS · Prisma + SQLite · Auth.js (`next-auth` v5) credentials.

## Setup

```bash
cp .env.example .env
```

Set **`AUTH_SECRET`** (e.g. `openssl rand -base64 32`). Keep **`AUTH_URL=http://localhost:3000`** locally so cookies line up when you browse and when running Playwright on `localhost`.

Install and migrate:

```bash
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev
```

Open `/login`. Default seeded user matches `.env.example` (`SEED_USER_EMAIL` / `SEED_USER_PASSWORD`).

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Dev server |
| `npm run build` | Prisma generate + production build |
| `npm run start` | Production server |
| `npm run prisma:seed` | Upsert seed user |
| `npm run test:e2e` | Playwright smoke (build + migrate + seed + start) |

## Routes

| Path | Notes |
|------|-------|
| `/` | Redirects to `/dashboard` when signed in, else `/login` |
| `/login` | Email/password, remember-me, links to `/register`, `/forgot-password` |
| `/dashboard` | Placeholder landing after login (expanded in Issue #9) |
| `/register`, `/forgot-password` | Stubs linking to Issues #2 and #3 |
