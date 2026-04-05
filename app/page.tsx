'use client';

import { useEffect, useRef, useState } from 'react';

interface Note {
  id: string;
  content: string;
  created_at: string;
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function SunIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  );
}

function SparklesIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
    </svg>
  );
}

// ─── Note card ────────────────────────────────────────────────────────────────

function NoteCard({
  note,
  onUpdate,
  onDelete,
}: {
  note: Note;
  onUpdate: (id: string, content: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(note.content);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [summary, setSummary] = useState('');
  const [summarizing, setSummarizing] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  async function handleSummarize() {
    setSummarizing(true);
    setSummary('');
    const res = await fetch('/api/notes/summarize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: note.content }),
    });
    if (res.ok) {
      const data = await res.json();
      setSummary(data.summary);
    }
    setSummarizing(false);
  }

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  async function handleSave() {
    if (!draft.trim() || draft === note.content) {
      setEditing(false);
      setDraft(note.content);
      return;
    }
    setSaving(true);
    await onUpdate(note.id, draft.trim());
    setSaving(false);
    setEditing(false);
  }

  function handleCancel() {
    setDraft(note.content);
    setEditing(false);
  }

  async function handleDelete() {
    setDeleting(true);
    await onDelete(note.id);
  }

  return (
    <li className={`group relative rounded-2xl border bg-white/75 shadow-sm shadow-black/[0.03] backdrop-blur-sm transition-all duration-200 dark:bg-white/[0.04] dark:shadow-none
      ${deleting ? 'scale-95 opacity-0' : 'opacity-100'}
      ${editing
        ? 'border-violet-300/80 shadow-md shadow-violet-500/10 dark:border-violet-600/40'
        : 'border-zinc-200/70 hover:-translate-y-px hover:border-zinc-300/80 hover:shadow-md hover:shadow-black/[0.06] dark:border-white/[0.07] dark:hover:border-white/[0.11] dark:hover:bg-white/[0.07]'
      }`}
    >
      <div className="px-5 py-4 pr-14">
        {editing ? (
          /* ── Edit mode ── */
          <div className="space-y-3">
            <textarea
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSave(); }
                if (e.key === 'Escape') handleCancel();
              }}
              rows={3}
              className="w-full resize-none rounded-xl border border-zinc-200 bg-zinc-50/80 px-3 py-2.5 text-sm leading-relaxed text-zinc-800 outline-none transition-colors focus:border-violet-400 focus:bg-white dark:border-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-100 dark:focus:bg-zinc-800/60 dark:focus:border-violet-500"
            />
            <div className="flex items-center gap-2">
              <button
                onClick={handleSave}
                disabled={saving || !draft.trim()}
                className="flex items-center gap-1.5 rounded-lg bg-violet-600 px-3 py-1.5 text-[0.72rem] font-semibold text-white transition-all hover:bg-violet-500 active:scale-95 disabled:opacity-50"
              >
                {saving
                  ? <svg className="h-3 w-3 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>
                  : <CheckIcon />}
                Save
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-[0.72rem] font-medium text-zinc-600 transition-all hover:border-zinc-300 hover:bg-zinc-50 active:scale-95 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-600"
              >
                <XIcon />
                Cancel
              </button>
              <span className="ml-auto text-[0.65rem] text-zinc-400 dark:text-zinc-600">
                Esc to cancel · Enter to save
              </span>
            </div>
          </div>
        ) : (
          /* ── View mode ── */
          <>
            <p className="text-sm leading-relaxed text-zinc-800 dark:text-zinc-200">
              {note.content}
            </p>
            <p className="mt-2.5 text-[0.68rem] font-medium tracking-wide text-zinc-400 dark:text-zinc-600">
              {new Date(note.created_at).toLocaleString(undefined, {
                month: 'short', day: 'numeric', year: 'numeric',
                hour: '2-digit', minute: '2-digit',
              })}
            </p>

            {/* Summary */}
            {summarizing && (
              <div className="mt-3 flex items-center gap-2 rounded-lg border border-violet-200/60 bg-violet-50/60 px-3 py-2 dark:border-violet-800/40 dark:bg-violet-900/20">
                <svg className="h-3 w-3 shrink-0 animate-spin text-violet-500" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <span className="text-[0.72rem] text-violet-600 dark:text-violet-400">Summarizing…</span>
              </div>
            )}
            {summary && !summarizing && (
              <div className="mt-3 rounded-lg border border-violet-200/60 bg-violet-50/60 px-3 py-2.5 dark:border-violet-800/40 dark:bg-violet-900/20">
                <div className="mb-1 flex items-center gap-1.5">
                  <SparklesIcon />
                  <span className="text-[0.65rem] font-semibold uppercase tracking-widest text-violet-500 dark:text-violet-400">AI Summary</span>
                </div>
                <p className="text-[0.8rem] leading-relaxed text-violet-800 dark:text-violet-200">{summary}</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Action buttons — visible on hover when not editing */}
      {!editing && (
        <div className="absolute right-3 top-3 flex items-center gap-1 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
          <button
            onClick={handleSummarize}
            disabled={summarizing}
            title="Summarize"
            className="flex h-6 w-6 items-center justify-center rounded-md text-zinc-400 transition-all hover:bg-violet-50 hover:text-violet-500 disabled:opacity-40 dark:hover:bg-violet-500/10 dark:hover:text-violet-400"
          >
            <SparklesIcon />
          </button>
          <button
            onClick={() => setEditing(true)}
            title="Edit"
            className="flex h-6 w-6 items-center justify-center rounded-md text-zinc-400 transition-all hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-700/60 dark:hover:text-zinc-200"
          >
            <PencilIcon />
          </button>
          <button
            onClick={handleDelete}
            title="Delete"
            className="flex h-6 w-6 items-center justify-center rounded-md text-zinc-400 transition-all hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10 dark:hover:text-red-400"
          >
            <TrashIcon />
          </button>
        </div>
      )}
    </li>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Theme init — read whatever the blocking script already applied to <html>
  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  function applyTheme(dark: boolean) {
    document.documentElement.classList.toggle('dark', dark);
  }

  function toggleTheme() {
    const next = !isDark;
    setIsDark(next);
    applyTheme(next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  }

  // Fetch
  useEffect(() => {
    fetch('/api/notes')
      .then((r) => r.json())
      .then((data) => { setNotes(data); setLoading(false); });
  }, []);

  // Create
  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    const res = await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    if (res.ok) {
      const newNote = await res.json();
      setNotes((prev) => [newNote, ...prev]);
      setContent('');
    }
    setSubmitting(false);
  }

  // Update
  async function handleUpdate(id: string, newContent: string) {
    const res = await fetch(`/api/notes/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: newContent }),
    });
    if (res.ok) {
      const updated = await res.json();
      setNotes((prev) => prev.map((n) => (n.id === id ? updated : n)));
    }
  }

  // Delete (optimistic)
  async function handleDelete(id: string) {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    await fetch(`/api/notes/${id}`, { method: 'DELETE' });
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f8f8fb] transition-colors duration-300 dark:bg-[#080810]">

      {/* Ambient blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-48 -top-48 h-[500px] w-[500px] rounded-full bg-violet-300/25 blur-[120px] dark:bg-violet-700/15" />
        <div className="absolute -left-48 top-1/2 h-[400px] w-[400px] rounded-full bg-indigo-300/20 blur-[100px] dark:bg-indigo-800/15" />
        <div className="absolute -bottom-32 right-1/4 h-[350px] w-[350px] rounded-full bg-fuchsia-300/15 blur-[100px] dark:bg-fuchsia-900/10" />
      </div>

      {/* Navbar */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5 sm:px-10">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 shadow-md shadow-violet-500/30">
            <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
            </svg>
          </div>
          <span className="text-sm font-semibold tracking-tight text-zinc-800 dark:text-zinc-100">Notes</span>
        </div>

        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500 shadow-sm transition-all hover:border-zinc-300 hover:text-zinc-800 hover:shadow-md dark:border-zinc-700/60 dark:bg-zinc-800/60 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-zinc-200"
        >
          {isDark ? <SunIcon /> : <MoonIcon />}
        </button>
      </header>

      {/* Main */}
      <main className="relative z-10 mx-auto max-w-[560px] px-4 pb-24 pt-8">

        {/* Hero */}
        <div className="mb-10 text-center">
          <h1 className="text-[2.15rem] font-semibold leading-tight tracking-tight text-zinc-900 dark:text-white">
            Capture your thoughts
          </h1>
          <p className="mt-2.5 text-[0.9rem] leading-relaxed text-zinc-500 dark:text-zinc-400">
            Simple, fast, always there when you need it.
          </p>
        </div>

        {/* Compose */}
        <div className="mb-8 overflow-hidden rounded-2xl border border-zinc-200/70 bg-white/80 shadow-lg shadow-black/[0.04] backdrop-blur-xl dark:border-white/[0.07] dark:bg-white/[0.05] dark:shadow-black/40">
          <form onSubmit={handleSubmit}>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  e.currentTarget.form?.requestSubmit();
                }
              }}
              placeholder="What's on your mind? Press Enter to save."
              rows={3}
              className="w-full resize-none bg-transparent px-5 pb-3 pt-4 text-sm leading-relaxed text-zinc-800 placeholder-zinc-400 outline-none dark:text-zinc-100 dark:placeholder-zinc-600"
            />
            <div className="flex items-center justify-between border-t border-zinc-100 px-4 py-2.5 dark:border-white/[0.06]">
              <span className="text-[0.7rem] text-zinc-400 dark:text-zinc-600">
                {content.length > 0 ? `${content.length} chars` : 'Enter ↵ to submit'}
              </span>
              <button
                type="submit"
                disabled={submitting || !content.trim()}
                className="flex items-center gap-1.5 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 px-4 py-1.5 text-[0.78rem] font-semibold text-white shadow-md shadow-violet-500/25 transition-all hover:brightness-110 hover:shadow-lg hover:shadow-violet-500/35 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {submitting ? (
                  <svg className="h-3 w-3 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                ) : (
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                )}
                {submitting ? 'Saving…' : 'Add note'}
              </button>
            </div>
          </form>
        </div>

        {/* Count divider */}
        {!loading && notes.length > 0 && (
          <div className="mb-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
            <span className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-zinc-400 dark:text-zinc-600">
              {notes.length} {notes.length === 1 ? 'note' : 'notes'}
            </span>
            <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
          </div>
        )}

        {/* Loading skeletons */}
        {loading && (
          <div className="space-y-3">
            {[80, 56, 40].map((w, i) => (
              <div key={i} className="rounded-2xl border border-zinc-200/60 bg-white/60 p-5 dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="h-3 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-700/60" style={{ width: `${w}%` }} />
                <div className="mt-3 h-2 w-24 animate-pulse rounded-full bg-zinc-100 dark:bg-zinc-800/60" />
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && notes.length === 0 && (
          <div className="rounded-2xl border border-dashed border-zinc-300/80 bg-white/30 px-6 py-16 text-center backdrop-blur-sm dark:border-zinc-700/50 dark:bg-white/[0.02]">
            <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-700/60 dark:bg-zinc-800/60">
              <svg className="h-5 w-5 text-zinc-400 dark:text-zinc-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">No notes yet</p>
            <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-600">Your notes will appear here once added.</p>
          </div>
        )}

        {/* Notes list */}
        {!loading && notes.length > 0 && (
          <ul className="space-y-2.5">
            {notes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
