# Contributing

Thanks for helping improve the CommonsDB Registry Viewer.

## Workflow

1. Branch from `main`.
2. Make your change, keeping the conventions in [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md).
3. Ensure the checks pass locally:

   ```bash
   pnpm typecheck && pnpm lint && pnpm test && pnpm build
   ```

4. Open a pull request describing what changed and why. Screenshots help for UI changes.

## Guidelines

- Keep pull requests focused; unrelated refactors belong in their own PR.
- New behaviour in the data-mapping helpers (`src/shared/utils/jsHelpers`) or the registry proxy
  (`src/server`) should come with tests — these run on untrusted external data.
- User-facing strings go through i18n; see docs/DEVELOPMENT.md.
- Never commit credentials. `.env` is gitignored; the registry token must not appear in code,
  fixtures or documentation.

## Reporting issues

Include the page, the search input (if any), what you expected, and what happened. For suspected
registry-data issues (rather than viewer bugs), note the declaration ID so it can be checked
upstream.
