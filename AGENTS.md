<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Cursor Cloud specific instructions

Single-app repo (**MyHoppies**): Next.js 16 + Prisma/SQLite + Auth.js. No Docker or external services.

### First-time / missing database

If `dev.db` is absent or migrations fail, from repo root (with `.env` present — copy from `.env.example` and set `AUTH_SECRET`):

```bash
npx prisma migrate dev
npm run prisma:seed
```

`npm run build` and `npm run prisma:seed` both require `npx prisma generate` first if `src/generated/prisma` is missing (the VM update script runs generate after `npm install`).

### Running the app

| Command | Purpose |
|---------|---------|
| `npm run dev` | Dev server at http://localhost:3000 |
| `npm run build` / `npm run start` | Production (Playwright `webServer` uses this path) |

Set `AUTH_URL=http://localhost:3000` locally. Default seed login: `dev@myhoppies.local` / `devpassword123` (see `.env.example`).

### Lint / test

| Command | Notes |
|---------|--------|
| `npm run lint` | ESLint; may report a pre-existing `react-hooks/refs` issue in `login-form.tsx` |
| `npm run test:e2e` | Playwright; install browsers once with `npx playwright install chromium`. Reuses an existing server on port 3000 when not in CI. |

See `README.md` for full setup steps.
