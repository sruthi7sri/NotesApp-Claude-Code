@AGENTS.md

# Notes App

A full-stack notes app built with Next.js 16 (App Router), Supabase, and the Anthropic Claude API.

## Stack

- **Framework:** Next.js 16.2.2 (App Router) + React 19
- **Database:** Supabase — table: `notes` (columns: `id`, `content`, `created_at`)
- **Auth/Client:** `@supabase/ssr` — server client in `utils/supabase/server.ts`
- **AI:** `@anthropic-ai/sdk` — Claude Opus 4.6 for note summarization
- **Styling:** Tailwind CSS v4 (class-based dark mode via `@variant dark`)
- **Language:** TypeScript

## Project Structure

```
app/
  page.tsx                        # Main UI — notes list, create, edit, delete, summarize
  layout.tsx                      # Root layout — inline theme script (no flash), Geist font
  globals.css                     # Tailwind v4 import + class-based dark mode variant
  api/
    notes/
      route.ts                    # GET /api/notes, POST /api/notes
      [id]/route.ts               # PATCH /api/notes/:id, DELETE /api/notes/:id
      summarize/route.ts          # POST /api/notes/summarize
utils/
  supabase/
    server.ts                     # createClient() — async, awaits cookies()
```

## API Routes

| Method   | Route                    | Description                              |
|----------|--------------------------|------------------------------------------|
| GET      | /api/notes               | Fetch all notes ordered by created_at desc |
| POST     | /api/notes               | Insert a note `{ content: string }`      |
| PATCH    | /api/notes/:id           | Update note content `{ content: string }`|
| DELETE   | /api/notes/:id           | Delete a note, returns 204               |
| POST     | /api/notes/summarize     | Summarize `{ content: string }` via Claude, returns `{ summary: string }` |

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
ANTHROPIC_API_KEY=
```

## UI Features

- Create notes with a textarea (Enter to submit, Shift+Enter for newline)
- Per-note hover actions: **Summarize** (sparkles), **Edit** (pencil), **Delete** (trash)
- Inline edit mode with Save/Cancel; Esc to cancel, Enter to save
- AI summary displayed in a violet card below the note content
- Optimistic delete (card fades out immediately, API call follows)
- Dark/light mode toggle — persisted to `localStorage`, applied via `.dark` class on `<html>`
- Blocking inline script in `layout.tsx` prevents theme flash on load

## Key Implementation Notes

- `utils/supabase/server.ts` — `createClient` is `async` and `await`s `cookies()` (required in Next.js 15+)
- `globals.css` uses `@variant dark` (not `@custom-variant`) to override Tailwind's built-in media-query dark mode with class-based dark mode
- Route params in `[id]/route.ts` are typed as `Promise<{ id: string }>` and must be awaited (Next.js 15+)
- Theme toggle reads `document.documentElement.classList.contains('dark')` on mount to sync React state with what the blocking script already applied

## Dev Commands

```bash
npm run dev     # start dev server (Turbopack)
npm run build   # production build
npm run lint    # eslint (not next lint — Next.js 16 change)
```
