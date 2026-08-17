# Security Policy

## Reporting a vulnerability

Please report suspected vulnerabilities privately to **paul@openfuture.eu** (Open Future
Foundation, coordinator of the CommonsDB project). Do not open a public issue for security
reports.

Include what you found, where (URL or file), and steps to reproduce. You should receive an
acknowledgement within a few working days.

## Scope

This application is a read-only viewer. The most security-relevant surface is the API proxy under
`src/app/api/v1/`, which attaches a server-held registry credential to upstream requests:

- The credential lives in the `REGISTRY_API_TOKEN` environment variable and never reaches the
  browser.
- Path parameters are validated (`src/server/registry.ts`) before being forwarded.
- A best-effort per-instance rate limit (`src/server/rateLimit.ts`) caps request bursts. For hard
  guarantees, configure a platform-level rate limit (e.g. Vercel WAF) in front of `/api/*`.

## Supported versions

Only the latest release deployed from `main` is supported with security fixes.
