# Configuration

All configuration is via environment variables. Copy `.env.example` to `.env` for local
development; set the same variables in your hosting platform for deployments.

## The server/client boundary

Next.js inlines every variable prefixed `NEXT_PUBLIC_` into the JavaScript shipped to browsers.
That prefix is therefore a statement that the value is public. The registry credential must never
carry it; the build reads server-only values through `getServerEnv()`
([src/config/env.ts](../src/config/env.ts)), which fails loudly when one is missing.

## Server-only variables

| Variable             | Required | Purpose                                                                                                                                                                                                                                        |
| -------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `REGISTRY_API_URL`   | yes      | Base URL of the CommonsDB registry API, e.g. `https://api.commonsdb.org`. Used by the proxy routes under `src/app/api/v1`.                                                                                                                     |
| `REGISTRY_API_TOKEN` | yes      | Bearer token sent with every registry request. Issued by the CommonsDB project — contact the Open Future Foundation (Paul Keller, paul@openfuture.eu). Treat as a secret: rotate it if it ever appears in a client bundle, a log, or a commit. |

If either is missing, the API routes return `500 { "error": "Registry is not configured" }` and log
the specific missing variable server-side.

## Public variables

| Variable                          | Required | Purpose                                                                                                                                         |
| --------------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_ISCC_SERVICE_URL`    | no       | Base URL of the ISCC generation service used by drag-and-drop file search. When empty, file search fails gracefully; text search is unaffected. |
| `NEXT_PUBLIC_METADATA_PUBLIC_URL` | no       | Public metadata API base used to build citable declaration links. Defaults to `https://api.commonsdb.org/v1/metadata-pub`.                      |

## Adding a variable

1. Read it in [src/config/env.ts](../src/config/env.ts) — nothing else should touch `process.env`.
2. Decide the boundary deliberately: is the value truly public?
3. Document it in `.env.example` and in the table above.

Note that `process.env` must be referenced with a literal key (`process.env.MY_VAR`, not
`process.env[name]`) — Next.js substitutes these textually at build time.
