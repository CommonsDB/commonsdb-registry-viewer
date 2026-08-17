# Architecture

## Overview

The viewer is a Next.js 14 App Router application with two halves:

- **Pages** (client components) that render the explorer, random declarations and statistics views.
- **API routes** (`src/app/api/v1`) that proxy the CommonsDB registry. The browser never talks to
  the registry directly — the registry credential lives only on the server.

```
Browser ──▶ Next.js page ──▶ /api/v1/* route ──▶ CommonsDB registry API
                                   │
                                   └─ Authorization: Bearer <REGISTRY_API_TOKEN>
```

The one exception is the ISCC generation service: deriving an ISCC from a dropped file posts the
file directly from the browser to `NEXT_PUBLIC_ISCC_SERVICE_URL`, because routing uploads through
the proxy would double the transfer for no security benefit — that service needs no credential.

## Request flow: a search

1. The user submits a query (or drops a file, which is first resolved to an ISCC).
2. `getSearchStringType` classifies the string — ISCC, declarer DID, or declaration ID — by shape,
   and `getDeclarationsSearch` picks the matching internal route.
3. The route handler validates the path segment (`isSafeSegment`), forwards to the registry via
   `proxyRegistryRequest` (`src/server/registry.ts`), and propagates the upstream status. Upstream
   failures surface as errors, never as an empty 200.
4. `useSearchQuery` runs `composeDataBySupersedes` over the results: declarations that supersede
   earlier ones absorb them into `previousDeclarations`, so each work appears once.
5. `getConflictingIsccs` flags works whose declarations carry conflicting rights statements.
6. `useDeclarationsTable` maps results to display rows (`mapDeclarationToRow`), sorts, and reveals
   them page-by-page as the user scrolls.

## The declaration model

`src/api/types/declaration.ts` is the single description of what the registry returns. The key
subtlety: rights fields (`location`, `rightsStatement`, `pdRationale`) can live in any of three
places depending on the schema version the declaration was made under — `commonsDbRegistry`
(current), `supplierMetadata` or `supplierData` (legacy). `resolveRightsFields` resolves each field
independently in that order; nothing else in the codebase should reach into those objects directly.

## Directory layout

```
src/
├── app/                    Pages and API routes (App Router)
│   ├── (app)/              The application shell: sidebar + header
│   │   ├── explorer/       Search (landing, results per identifier)
│   │   ├── random-declarations/
│   │   └── statistics/
│   └── api/v1/             Registry proxy routes
├── server/                 Server-only code (registry client)
├── api/                    Browser-side data layer
│   ├── http.ts             Axios instances
│   ├── requests/           One function per endpoint
│   ├── queries/            React Query hooks
│   └── types/              Response models
├── config/                 Application configuration as code
│   ├── site.ts             Identity: name, logos, external links
│   ├── navigation.ts       Sidebar entries
│   ├── tables.ts           Table columns and detail-panel fields
│   └── env.ts              Environment variable access
├── components/             Atomic design: atoms → molecules → organisms
├── hooks/                  Shared client hooks
└── shared/
    ├── constants/          Routes, declarers, palettes, registries
    └── utils/              Pure helpers (data mapping, i18n, formatting)
```

## Statistics pipeline

The statistics endpoint returns per-declarer aggregates keyed by DID. Before rendering:

1. `mergeStatisticsBySupplier` collapses multiple DIDs belonging to one institution into a single
   supplier, and subtracts hidden (test) declarers from every aggregate.
2. `enrichStatisticsSuppliers` and the `enrich*Distribution` helpers attach the palette.
3. `transformDeclarationsOverTime` reshapes the monthly series to quarterly or cumulative views.

The sidebar's declaration counter shares this pipeline so the two numbers always agree.

## Internationalisation

i18next with a single `common` namespace; all strings live in
`src/shared/utils/i18n/locales/en/common.json`. The locale comes from the `preferred_language`
cookie. Adding a language = adding `locales/<code>/common.json` and listing the code in
`i18n/settings.ts`.

## Design decisions worth knowing

- **Proxy status propagation.** Handlers never flatten an upstream failure into `results: []`; a
  registry outage must be distinguishable from an empty search.
- **Path-segment validation.** Next decodes percent-escapes before route params reach handler code,
  so `%2F` arrives as `/`. `isSafeSegment` rejects anything that could reshape the upstream URL the
  server signs with its token.
- **Supersession cycle guard.** `composeDataBySupersedes` tolerates self- or mutually-superseding
  declarations; registry data is external input and must not be able to hang the render thread.
- **Signature link.** Each row links its JWT signature to jwt.io deliberately: the signature is
  public material intended for third-party verification.
- **No prerendered routes.** Every page and route is dynamic, so builds need no registry access and
  "random" responses are never frozen by the full-route cache.
