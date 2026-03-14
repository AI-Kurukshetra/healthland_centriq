# Repository Guidelines

## Tech Stack

- Next.js 16 (App Router), TypeScript, Tailwind CSS, Shadcn UI.
- Validation: Zod.
- State: React Server Components (RSC) first, then Jotai for client state.

## Best Practices

- **No 'use client' by default:** Only add it to leaf components that need interactivity.
- **Server Actions:** Use Server Actions for all data mutations.
- **Data Fetching:** Fetch data directly in Server Components; no `useEffect` fetching.
- **File Naming:** Use `kebab-case` for all files.

## Project Structure & Module Organization

This is a Next.js 16 App Router project with TypeScript.

- Application code lives in `src/app` (routes, layout, global styles).
- Static assets live in `public/` (SVGs, icons, images served from `/`).
- Root-level config files: `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs`.
- Build output (`.next/`) and dependencies (`node_modules/`) are generated; do not commit custom edits there.

## Build, Test, and Development Commands

Use npm (lockfile is `package-lock.json`).

- `npm run dev`: start local dev server at `http://localhost:3000`.
- `npm run build`: create production build.
- `npm run start`: run the production build locally.
- `npm run lint`: run ESLint with Next.js core-web-vitals + TypeScript rules.

Before opening a PR, run:

```bash
npm run lint && npm run build
```

## Coding Style & Naming Conventions

- Language: TypeScript (`.ts`/`.tsx`) with `strict` mode enabled.
- Indentation: 2 spaces; keep imports grouped and unused code removed.
- Components: PascalCase for reusable components (e.g., `PatientCard.tsx`).
- Routes and app files: follow Next App Router conventions (`page.tsx`, `layout.tsx`, `loading.tsx`, etc.).
- Prefer functional React components and modern Next.js patterns (`next/image`, server components by default where applicable).

## Testing Guidelines

There is currently no test framework configured in this repository.

- Minimum quality gate: `npm run lint` and `npm run build` must pass.
- When adding non-trivial logic, introduce tests alongside the feature (recommended: Vitest + React Testing Library) in a colocated `__tests__/` folder or `*.test.ts(x)` files.
- Name tests by behavior (e.g., `home-page-renders-cta.test.tsx`).

## Commit & Pull Request Guidelines

Current history is minimal; use clear, conventional commit messages.

- Recommended format: `type(scope): short description` (e.g., `feat(auth): add login form`).
- Keep commits focused and atomic.
- PRs should include: summary of changes, linked issue/task, validation steps, and screenshots/GIFs for UI updates.
- Highlight config or environment changes explicitly in the PR description.
