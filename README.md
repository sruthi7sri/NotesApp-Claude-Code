# Notes App

A full-stack notes application built with Next.js 16 (App Router), Supabase, and Anthropic Claude for one-line note summaries.

## Stack

- Next.js 16.2.2 + React 19
- TypeScript
- Tailwind CSS v4
- Supabase (`notes` table)
- Anthropic SDK (`claude-opus-4-6`)

## Features

- Create, list, update, and delete notes
- Optimistic delete UX
- Inline edit mode with keyboard shortcuts
- Per-note AI summary generation
- Light/dark theme toggle persisted in `localStorage`

## Project Structure

```text
app/
  page.tsx                        # Main UI
  layout.tsx                      # Root layout + pre-paint theme script
  globals.css                     # Tailwind v4 + class-based dark mode
  api/
    notes/
      route.ts                    # GET /api/notes, POST /api/notes
      [id]/route.ts               # PATCH /api/notes/:id, DELETE /api/notes/:id
      summarize/route.ts          # POST /api/notes/summarize
utils/
  supabase/
    server.ts                     # Supabase server client
```

## Prerequisites

- Node.js 20+
- npm 10+
- Supabase project
- Anthropic API key

## Environment Variables

Create `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
ANTHROPIC_API_KEY=your_anthropic_api_key
```

## Database Setup (Supabase)

Run this SQL in your Supabase SQL editor:

```sql
create extension if not exists pgcrypto;

create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  content text not null,
  created_at timestamptz not null default now()
);
```

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Scripts

```bash
npm run dev    # start dev server
npm run build  # production build
npm run start  # run production server
npm run lint   # eslint
```

## API Endpoints

- `GET /api/notes` - fetch notes ordered by `created_at desc`
- `POST /api/notes` - create note with `{ content }`
- `PATCH /api/notes/:id` - update note content
- `DELETE /api/notes/:id` - delete note
- `POST /api/notes/summarize` - summarize note content with Claude

## Deploy to Vercel

1. Push this repository to GitHub.
2. In Vercel, click `Add New -> Project` and import the GitHub repo.
3. Framework preset: `Next.js` (auto-detected).
4. Add environment variables in Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `ANTHROPIC_API_KEY`
5. Click `Deploy`.
6. For future changes, push to your connected GitHub branch and Vercel will auto-deploy.

## Notes

- This project uses Next.js 16 route handlers (`app/api/...`) for backend logic.
- The dark mode strategy is class-based (`.dark`) rather than media-query based.
