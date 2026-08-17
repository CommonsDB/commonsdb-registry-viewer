# Development

## Prerequisites

- Node.js 18.17 or newer
- [pnpm](https://pnpm.io/)

## Setup

```bash
pnpm install
cp .env.example .env   # then fill in REGISTRY_API_TOKEN
pnpm dev
```

## Checks

Run all of these before opening a pull request:

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

Formatting is enforced by Prettier (`pnpm format`), with the Tailwind class-order plugin.

## Testing

Tests live next to the code they cover (`*.test.ts`) and run under Vitest with jsdom. The existing
suites cover the helpers where the registry's data model is trickiest — search-string
classification, supersession-chain folding (including cycles), licence-URL abbreviation, and the
proxy's path-segment validation. Follow that pattern: test pure helpers directly, with realistic
registry shapes.

## Common changes

**Add a sidebar entry** — [src/config/navigation.ts](../src/config/navigation.ts). Internal entries
point at a `ROUTES` member; external ones set `isExternal`.

**Add or reorder table columns** — [src/config/tables.ts](../src/config/tables.ts). A column's
`key` must match a field produced by `mapDeclarationToRow`; add the field there if it is new.
Labels are translation keys.

**Register a new data supplier** —
[src/shared/constants/declarations.ts](../src/shared/constants/declarations.ts) (name, logo, DID)
for table attribution, and the supplier maps in
[src/shared/constants/statisticsColors.ts](../src/shared/constants/statisticsColors.ts) for the
statistics dashboard. A supplier with several signing keys needs one DID entry per key.

**Add a UI string** — add the key to
[src/shared/utils/i18n/locales/en/common.json](../src/shared/utils/i18n/locales/en/common.json) and
reference it with `t('your.key')`. No hardcoded user-facing strings in components.

**Add a registry endpoint** — a route handler under `src/app/api/v1/` built on
`proxyRegistryRequest`, a request function in `src/api/requests/`, and a React Query hook in
`src/api/queries/`. Validate any dynamic path segment with `isSafeSegment`.

## Conventions

- `~/*` maps to `src/*`; prefer it over deep relative imports.
- Components follow atomic design (`atoms` → `molecules` → `organisms`) and are re-exported through
  their directory's `index.ts`.
- No `any` — the registry's response shapes are typed in `src/api/types/declaration.ts`; extend the
  model rather than casting around it.
- Read rights fields through `resolveRightsFields`, never directly off the metadata objects — the
  three-location fallback is a schema-history detail that belongs in one place.
- Server-only code lives in `src/server/`; nothing under `src/api/` or `src/components/` may import
  from it.
