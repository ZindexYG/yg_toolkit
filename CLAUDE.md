# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager is **pnpm** (locked at 10.25.0 in `package.json`). Do not switch to npm/yarn.

- `pnpm dev` — start Next.js dev server (http://localhost:3000)
- `pnpm build` — production build
- `pnpm start` — run the production build
- `pnpm check` / `pnpm check:fix` — Biome lint + format check (write fixes with `:fix`)
- `pnpm lint` / `pnpm format` — lint-only / format-only via Biome
- `pnpm generate:presets` — regenerate `src/lib/preferences/theme.ts` from CSS files in `src/styles/presets/`. Required after adding a new preset; otherwise it won't appear in the theme switcher. Also wired to the Husky pre-push hook.

There is no test runner configured in this repo.

**Linting/formatting**: Biome (not ESLint/Prettier). `src/components/ui` is explicitly excluded from Biome (it's shadcn-generated). Pre-commit runs `biome check --write --no-errors-on-unmatched` via `lint-staged` + Husky — commits will be blocked on lint errors.

## Architecture

### Stack

Next.js 16 (App Router) + React 19 + Tailwind CSS v4 + shadcn/ui (style `new-york`, base color `neutral`). State via Zustand, server-state via TanStack Query, forms via React Hook Form + Zod, tables via TanStack Table + dnd-kit. **React Compiler is enabled** (`reactCompiler: true` in `next.config.mjs`) — avoid manual `useMemo`/`useCallback` micro-optimizations; let the compiler handle them.

Path alias `@/*` → `./src/*`.

### Route groups (`src/app/`)

- `(external)/` — public/landing pages (no dashboard chrome)
- `(main)/auth/v1/` and `(main)/auth/v2/` — two separate auth UIs, both exposed in the sidebar
- `(main)/dashboard/` — the dashboard. `/dashboard` redirects to `/dashboard/default` (configured in `next.config.mjs`, not in middleware)
- `(main)/dashboard/_components/sidebar/` — shared sidebar shell (`app-sidebar`, `nav-main`, `account-switcher`, `theme-switcher`, `layout-controls`, `search-dialog`)

### Colocation convention

Each dashboard feature owns its components, schemas, and config under a `_components/` folder (the `_` prefix keeps it out of routing). Example: `dashboard/crm/_components/` holds `columns.crm.tsx`, `crm.config.ts`, `schema.ts`, plus card components. When adding a feature, follow this — do **not** scatter feature code under top-level `src/components/`. `src/components/` is reserved for cross-feature primitives (`ui/`, `data-table/`).

### Preferences system (theme, layout, sidebar)

This is the most non-obvious part of the codebase. Six user preferences are managed centrally:

`theme_mode`, `theme_preset`, `content_layout`, `navbar_style`, `sidebar_variant`, `sidebar_collapsible`.

Defining files:
- `src/lib/preferences/preferences-config.ts` — defaults, persistence strategy, key types
- `src/lib/preferences/theme.ts` — theme mode/preset definitions (the preset block is **generated**, see below)
- `src/lib/preferences/layout.ts` — content layout / navbar / sidebar option values
- `src/stores/preferences/preferences-store.ts` + `preferences-provider.tsx` — Zustand store, hydrated from the provider
- `src/scripts/theme-boot.tsx` — inline `<script>` injected in `<head>` to apply data attributes (and `window.__PREFERENCES__`) before React hydrates, preventing FOUC
- `src/server/server-actions.ts` — `getPreference()` reads cookies on the server with allow-list validation

Two hard rules:

1. **Layout-critical preferences (`sidebar_variant`, `sidebar_collapsible`) cannot use `localStorage`.** SSR needs them, so they must be in a cookie. The `PREFERENCE_PERSISTENCE` type enforces this — see `LayoutCriticalPersistence` in `preferences-config.ts`.
2. **`RootLayout` (`src/app/layout.tsx`) stays static.** Don't read cookies/preferences there — that's what `ThemeBootScript` is for. Reading user state in `RootLayout` would force the whole tree to re-render on the server.

The dashboard layout (`src/app/(main)/dashboard/layout.tsx`) is async and reads sidebar cookies via `getPreference()` to seed `SidebarProvider`. Sidebar open/closed state is stored under cookie `sidebar_state` (handled by the shadcn sidebar component itself, separate from the preference system).

### Theme presets

Each preset is a single CSS file in `src/styles/presets/` (e.g., `brutalist.css`, `tangerine.css`) containing `label:` and `value:` comments plus `--primary` color tokens for light/dark. The `generate:presets` script parses these files and replaces the block between `// --- generated:themePresets:start ---` and `// --- generated:themePresets:end ---` in `src/lib/preferences/theme.ts`. **Never edit that block by hand** — re-run the script.

### Sidebar navigation

All sidebar items are defined in one place: `src/navigation/sidebar/sidebar-items.ts` (typed as `NavGroup[]` → `NavMainItem[]` → `NavSubItem[]`). To add a route to the sidebar, edit this file rather than the sidebar components. Items can be marked `comingSoon`, `newTab`, or `isNew`.

## Project conventions

- **Spec-Kit workflow.** `.specify/` and `.github/agents|prompts/` define a multi-stage flow: Spec → Plan → Tasks → Implementation, plus Clarify/Analyze/Checklist. The project constitution (`.specify/memory/constitution.md`) requires that **Spec, Plan, Tasks, Checklist, and Analysis outputs be written in Simplified Chinese**, with technical terms (React, Next.js, Tailwind, etc.) kept in English. Migration decisions should favor "rollback-friendly, low-risk" over cleverness.
- **shadcn UI components in `src/components/ui/` are vendored.** They're regenerated by the shadcn CLI and are excluded from Biome. Don't refactor them in PRs unrelated to a deliberate shadcn re-sync.
- **Server Actions** live in `src/server/server-actions.ts`. Prefer extending this file over scattering `"use server"` blocks across feature folders.
- **Commit messages** follow conventional prefixes (`feat:`, `fix:`, `style:`, `chore:`, etc.) — visible in recent history.
