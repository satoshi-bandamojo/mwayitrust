# Mwayi Trust — Frontend

This repository contains the frontend for Mwayi Trust, a React + TypeScript + Vite application used to showcase programs, collect donations, and manage content via an admin interface.

## Overview

- **Landing pages:** Home, About, Programs, Stories, Gallery, Contact.
- **Donation flow:** A donation form that records a donation record to Supabase and optionally redirects to a configured PayChangu checkout URL.
- **Admin area:** Protected routes for administrators to manage donations, events, gallery, stories, subscribers, and contact messages.
- **Data backend:** Uses Supabase for auth and database operations. Environment variables in `.env` configure the client.

## How the app works (user flows)

1. Landing / Home
  - Users arrive at the landing pages (`/`, `/about`, `/programs`, `/stories`, `/gallery`).
  - Content is static or fetched from Supabase where applicable (stories, gallery items, programs).

2. Donation flow (`/donate`)
  - User chooses a donation tier or enters a custom amount, selects a payment method, and fills contact details.
  - The frontend creates a donation record via `src/services/donations.ts -> createDonation()`, which inserts into the `donations` table in Supabase and returns a `payment_reference`.
  - The frontend invokes the Supabase `create-donation` Edge Function, which creates the PayChangu checkout session server-side and returns a checkout URL.

3. Donation reconciliation and webhooks
  - The Supabase `paychangu-webhook` Edge Function is the only trusted payment status writer. The browser callback is read-only and displays the status recorded by the webhook.

4. Admin interface
  - Admin pages live under `/admin/*` and are protected by `src/components/shared/ProtectedRoute.tsx` which verifies the Supabase session and admin profile via `getCurrentAdminProfile()`.
  - When unauthenticated, users are redirected to `/admin/login`.
  - Admin pages include management views for donations, events, gallery, stories, subscribers, and contact messages.

## Key files and what they do

- `src/main.tsx` — App entry and router mounting.
- `src/router.tsx` — App routes and lazy-loaded pages (public + admin).
- `src/pages/Donate.tsx` — Donation UI and client-side validation; uses `src/services/donations.ts` to save donations.
- `src/services/supabase.ts` — Supabase client wrapper that uses `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`; provides a no-op client when env vars are missing (safe local dev).
- `src/services/donations.ts` — Helper functions for creating donations and reading their server-written status.
- `src/components/shared/ProtectedRoute.tsx` — Protects admin routes by checking Supabase auth and the current admin profile.
- `src/data/programs.ts` — Local program data and image imports used by the Programs page.

## Local development

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the project root with these keys (example):

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=public-anon-key
```

3. Start the dev server:

```bash
npm run dev
```

Open `http://localhost:5173` (or the port shown) to view the app.

## Building for production

```bash
npm run build
```

Static files will be emitted to `dist/`. Deploy these to your preferred static hosting (Netlify, Vercel, Cloudflare Pages) and ensure the environment variables above are set in your deployment settings.

## Admin setup and notes

- Admin authentication is handled through Supabase auth. Use Supabase to create admin users or manage roles.
- `ProtectedRoute` checks for an admin profile using `getCurrentAdminProfile()` — ensure your Supabase `admins` (or equivalent) table and the server-side function match this lookup.
- Admin pages call Supabase directly via the anon key — secure server-side operations (like marking a donation as verified) should be done through server functions or using Row Level Security (RLS) with service role keys on trusted server endpoints.

## Donation integration details

- The frontend constructs a unique reference `MT-<timestamp>-<rand>` for every donation and saves it via `createDonation()`.
- `create-donation` creates the gateway session using the server-only `PAYCHANGU_SECRET_KEY` secret.
- `paychangu-webhook` validates signed gateway notifications using `PAYCHANGU_WEB_SECRET` and updates `donations.status`.
- `/donation-callback` is a read-only result page; URL parameters never complete a donation.

## Environment variables

- `VITE_SUPABASE_URL` — your Supabase project URL.
- `VITE_SUPABASE_ANON_KEY` — public anon key for Supabase (used by the frontend).

## Troubleshooting

- If images or content do not appear, verify the asset file names in `src/assets` (some images were recently converted to `.webp`).
- If Supabase operations return empty values locally, confirm your `.env` variables and that the Supabase project has the expected tables: `donations`, `stories`, `gallery`, `events`, `subscribers`, `contact_messages`, `admins`.

## Contributing

1. Fork and open a PR.
2. Follow existing code style (TypeScript, React hooks, and Tailwind CSS/Tailwind-like styles).
3. Run `npm run dev` and ensure pages load and admin flows work.

## Contact

For backend/webhook setup or database schema questions, reach out to the maintainer or the team managing the Supabase project.

---

