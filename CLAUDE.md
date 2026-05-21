# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Astro dev server (`--host`, `localhost:4321`, log level: error).
- `npm run build` — production build to `./dist/`.
- `npm run preview` — preview built output locally.
- `npm run astro -- <cmd>` — Astro CLI pass-through (e.g. `astro check`, `astro add`).

No test runner, linter, or formatter is configured. Type checking: `npm run astro -- check`.

## Environment variables

Required in production (Netlify env vars dashboard):

| Variable | Scope | Description |
|---|---|---|
| `PUBLIC_TURNSTILE_SITE_KEY` | Public | Cloudflare Turnstile site key (rendered in HTML) |
| `TURNSTILE_SECRET_KEY` | Server-only | Turnstile secret — validated in `/api/booking` |
| `RESEND_API_KEY` | Server-only | Resend API key for transactional email |
| `RESEND_TO_EMAIL` | Server-only | Destination address for booking notifications |

See `.env.example` for setup notes. For local dev use Turnstile test key `1x00000000000000000000AA`.

## Architecture

Marketing site for Kaizen Apps (`https://kaizenapps.net`). **Astro 5 hybrid SSR** with the `@astrojs/netlify` adapter — static pages by default, server-side API routes where needed. React 19 islands, Tailwind v4 via `@tailwindcss/vite`.

The site has three distinct page categories:

### 1. Marketing pages (`src/pages/[lang]/...`)

Bilingual (es/en) with `Layout.astro` (Header / Footer / MobileMenu / BubbleMenu / ViewTransitions). i18n routing uses `prefixDefaultLocale: true` — both `/es/...` and `/en/...` are emitted as static pages. `src/pages/index.astro` is a bridge that renders Spanish content and silently rewrites the URL to `/es/` with `history.replaceState`.

Three template files handle all marketing pages:
- **`[lang]/index.astro`** — home view.
- **`[lang]/[section].astro`** — home view scrolled to an in-page anchor (`servicios`, `nosotros`, `contacto`, etc.). Valid sections are hard-coded in `getStaticPaths`.
- **`[lang]/[...slug].astro`** — every other page (solutions, booking, legal). Iterates `TASKS` from `src/lib/routes.ts` and dispatches to the right view.

**`src/lib/routes.ts` is the single source of truth for routes.** `TASKS` contains id, slugs (per lang), and SEO for every page. `buildRouteMap()` (also in routes.ts) builds the `path ↔ path` map used by Header and MobileMenu for language switching — both consume the same function now. When adding a page add an entry to `TASKS`; when adding a home-scroll section also add it to `getStaticPaths` in `[section].astro` AND to the `SECTION_MAPPINGS` constant in `routes.ts`.

UI strings live in `src/i18n/ui.ts` (flat key/value, default lang `es`). Access via `useTranslations(lang)` from `src/utils/i18n.ts`.

### 2. Iframe wrapper pages (`src/pages/<name>/index.html.ts`)

`/app`, `/bayco`, `/gpt`, `/maz`, `/mobile`, `/sauma`, `/seiri`, `/seiton` are `APIRoute` handlers returning a raw HTML page with a full-screen iframe. All 7 are one-liners that delegate to **`src/lib/iframePage.ts`** — that's the only file to edit when changing the bubble menu, sandbox policy, or any shared HTML structure. `/mobile` is an exception: it redirects to `/es/servicios`.

### 3. Server API (`src/pages/api/`)

`src/pages/api/booking.ts` — POST endpoint that:
1. Validates form fields with manual type-checking (no external schema lib).
2. Verifies the Cloudflare Turnstile token server-side against `challenges.cloudflare.com/turnstile/v0/siteverify` using `TURNSTILE_SECRET_KEY`.
3. Sends a formatted HTML email via the Resend SDK (`RESEND_API_KEY → RESEND_TO_EMAIL`).

The booking form in `Booking.astro` POSTs `application/json` to `/api/booking`. All i18n strings for form states (sending, success, error, captcha prompt) are injected via `define:vars` from the Astro frontmatter so they're never hardcoded in JavaScript.

### Theming

Colors are CSS variables in `src/styles/global.css` (`:root` / `.dark`) mapped to Tailwind via `tailwind.config.mjs`. Dark mode uses the `class` strategy; toggle state is stored in `localStorage` under `kaizen.dark` (`"1"` = dark). An inline script in `Layout.astro` applies the class on load and on `astro:after-swap`.

### Other notes

- Security headers are in `public/_headers` (CSP, HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy) — Netlify serves this automatically.
- `public/_redirects` handles trailing-slash normalization for `/es` and `/en`.
- `<ViewTransitions />` is active. Header / Footer / MobileMenu use `transition:persist` — stateful additions to those components must be persist-aware.
- React islands use `client:load` (`MobileMenuReact`) or `client:visible` (`ThemeButton`, `Brand` in Footer). The `.jsx` files under `src/components/ui/` and `src/components/common/` are the React boundary.
- `BubbleMenu.astro` is the canonical bubble menu for marketing pages. The iframe pages use `src/lib/iframePage.ts` — edit only one file, not eight.
