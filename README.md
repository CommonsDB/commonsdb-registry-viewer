# CommonsDB Registry Viewer

A web viewer for the [CommonsDB](https://www.commonsdb.org/) registry — a public record of rights
declarations about Public Domain and openly licensed works, contributed by cultural and scientific
institutions including the Europeana Foundation and Wikimedia Sverige.

The viewer lets anyone look up what the registry knows about a work, inspect the cryptographic
evidence behind each declaration, and see how the registry's holdings break down by supplier,
licence and media type.

## Features

- **Explorer** — search by ISCC content code, declaration ID or declarer DID. Drag in a local file
  and its ISCC is derived client-side so you can find declarations for a file you hold.
- **Declaration detail** — every result expands to show its source, licence, declarer, public-domain
  rationale, and the signature and timestamp needed to verify it independently.
- **Supersession history** — declarations that replace earlier ones are collapsed to the current
  statement, with the full chain viewable per row.
- **Conflict detection** — result sets that mix open and restrictive rights statements are flagged.
- **Random declarations** — a browsable sample of the registry.
- **Statistics** — declarations over time, and distributions by supplier, licence, media type and
  public-domain rationale.

## Quick start

Requires Node.js 18.17+ and [pnpm](https://pnpm.io/).

```bash
pnpm install
```

Copy the example environment file and fill in the registry credential:

```bash
cp .env.example .env
```

`REGISTRY_API_TOKEN` is required — without it every registry request returns 500. API tokens are
issued by the CommonsDB project: contact the Open Future Foundation (Paul Keller,
[paul@openfuture.eu](mailto:paul@openfuture.eu)). See
[docs/CONFIGURATION.md](docs/CONFIGURATION.md) for what each variable does.

```bash
pnpm dev
```

The app is served at http://localhost:3000.

## Scripts

| Script                              | Purpose                            |
| ----------------------------------- | ---------------------------------- |
| `pnpm dev`                          | Development server with hot reload |
| `pnpm build`                        | Production build                   |
| `pnpm start`                        | Serve a production build           |
| `pnpm typecheck`                    | TypeScript, no emit                |
| `pnpm lint` / `pnpm lint:fix`       | ESLint                             |
| `pnpm format` / `pnpm format:check` | Prettier                           |
| `pnpm test` / `pnpm test:watch`     | Vitest                             |

## Documentation

- [Architecture](docs/ARCHITECTURE.md) — how a request flows from the browser to the registry, and
  how the codebase is laid out.
- [Configuration](docs/CONFIGURATION.md) — every environment variable, and the server/client boundary.
- [Development](docs/DEVELOPMENT.md) — conventions, testing, and how to make common changes.
- [Contributing](CONTRIBUTING.md).

## Deployment

A standard Next.js 14 App Router deployment. Set the environment variables from
[docs/CONFIGURATION.md](docs/CONFIGURATION.md) in the hosting platform, then `pnpm build` and
`pnpm start`. All routes are dynamic — nothing is prerendered at build time, so no registry
credential is needed to build.

## License

The source code is released under the [MIT License](LICENSE).

The CommonsDB name and branding, the EU emblem, and the third-party logos in `public/`
(Wikimedia Sverige, Europeana Foundation, Liccium) remain the property of their respective owners
and are not covered by the code license — see the trademark notice in [LICENSE](LICENSE).

CommonsDB is co-funded by the European Union under the 2023 work programme on the financing of Pilot
Projects and Preparatory Actions in the field of Communications Networks, Content and Technology.
