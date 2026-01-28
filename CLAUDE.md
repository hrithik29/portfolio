# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` - Start development server (http://localhost:3000)
- `npm run build` - Build for production
- `npm run lint` - Run ESLint

## Architecture

This is a Next.js 14 portfolio site using the App Router with TypeScript and Tailwind CSS.

### Structure

- **app/layout.tsx** - Root layout with Navbar, Footer, and Geist fonts
- **app/page.tsx** - Home page
- **app/[route]/page.tsx** - Each route (work, resume, skills, decks, ask) has its own page
- **app/components/** - Shared UI components with barrel export via index.ts

### Component Patterns

- `Container` - Constrains content width (max-w-4xl) with responsive padding
- `Section` - Provides vertical spacing with optional `border` prop for top border
- `PageHeader` - Page title with optional `description` prop
- Pages wrap content in `<Container>` and use `<Section>` for content blocks

### Styling

- Dark theme: neutral-950 background, white/neutral-400 text
- Tailwind responsive prefixes: sm, md, lg
- Components use client directive ("use client") only when needed (e.g., Navbar for useState/usePathname)

### Path Alias

`@/*` maps to project root (e.g., `@/app/components`)
