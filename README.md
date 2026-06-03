# Studio Admin

A modern, open-source dashboard starter template built with **Next.js 16**, **React 19**, **Tailwind CSS v4**, and **shadcn/ui**. Designed for SaaS apps, admin panels, and internal tools — fully customizable and production-ready.

## Tech stack

- **Framework**: Next.js 16 (App Router) + React 19 + React Compiler
- **Styling**: Tailwind CSS v4 + shadcn/ui (`new-york` style, `neutral` base)
- **State**: Zustand (client) + TanStack Query (server)
- **Tables**: TanStack Table + dnd-kit
- **Forms**: React Hook Form + Zod
- **Tooling**: Biome (lint + format), Husky, lint-staged, pnpm
- **Testing**: Vitest + Testing Library + Playwright

## Quick start

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). The root route redirects to `/dashboard/default`.

## Commands

| Command | What it does |
|---|---|
| `pnpm dev` | Start dev server |
| `pnpm build` | Production build |
| `pnpm start` | Run production build |
| `pnpm check` / `pnpm check:fix` | Biome lint + format check |
| `pnpm test` | Run unit tests (Vitest) |
| `pnpm test:e2e` | Run end-to-end tests (Playwright) |
| `pnpm generate:presets` | Regenerate theme presets from `src/styles/presets/*.css` |

## Project layout

```
src/
├── app/                     # Next.js App Router
│   ├── (external)/          # Public / landing pages
│   └── (main)/
│       ├── auth/            # Auth UIs (v1, v2)
│       └── dashboard/       # Dashboard area
│           ├── default/     # Analytics overview
│           ├── crm/         # CRM dashboard
│           ├── finance/     # Finance dashboard
│           └── _components/ # Shared dashboard chrome (sidebar, etc.)
├── components/              # Cross-feature primitives
│   ├── ui/                  # shadcn-vendored components
│   └── data-table/          # Reusable data table
├── lib/preferences/         # Theme / layout / sidebar preferences
├── navigation/              # Sidebar navigation config
├── server/                  # Server actions
├── stores/                  # Zustand stores
├── styles/presets/          # Theme preset CSS files
└── types/                   # Shared TypeScript types
```

Each dashboard feature follows a **colocation** convention — components, schemas, and config live under the feature's own `_components/` folder.

## Theming

Six user preferences are managed centrally: `theme_mode`, `theme_preset`, `content_layout`, `navbar_style`, `sidebar_variant`, `sidebar_collapsible`.

To add a new theme preset:

1. Drop a CSS file into `src/styles/presets/` with `label:`, `value:`, and `--primary` tokens for light/dark.
2. Run `pnpm generate:presets`.
3. The preset appears in the theme switcher automatically.

The generator is also wired to the Husky pre-push hook.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the development workflow, code style, and PR guidelines. Detailed architectural notes live in [CLAUDE.md](./CLAUDE.md).

## License

[MIT](./LICENSE)
