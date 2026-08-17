# Changelog

All notable changes to this project are documented in this file.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [1.0.0] — 2026-07-27

First standalone release of the CommonsDB Registry Viewer.

### Added

- Explorer with search by ISCC content code, declaration ID, or declarer DID, plus drag-and-drop
  file search via ISCC fingerprinting.
- Declaration detail view with rights statement, public-domain rationale, source link, and
  signature verification link.
- Supersession history: replaced declarations are folded into their successor with a viewable
  timeline of changes.
- Conflict detection for works whose declarations disagree on rights status.
- Random declarations page.
- Statistics dashboard: declarations over time (monthly / quarterly / cumulative) and
  distributions by supplier, licence, media type, and public-domain rationale.
- Server-side proxy for the registry API with input validation, upstream error propagation, and
  per-instance rate limiting.
- English localisation via i18next; additional languages can be added under
  `src/shared/utils/i18n/locales/`.
