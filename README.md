# BlendSDK App Scaffold Generator

Generates complete [BlendSDK](https://github.com/blendsdk) v5 monorepo applications with a single command.

## What You Get

- **Turborepo + Yarn Workspaces** monorepo
- **Packages:**
  - `shared` — TypeScript types & utilities
  - `webapi` — BlendSDK v5 backend (Express 5 + PostgreSQL 16 + Redis 7)
  - `webclient` — Vite + React 18 + FluentUI v9 frontend
  - `codegen` — BlendSDK code generation
- **Development stack:**
  - Docker Compose for PostgreSQL + Redis (+ optional Mailpit)
  - Vite dev server with proxy to backend
  - TypeScript 5.9+, ESM throughout
  - vitest for testing
- **Optional features:**
  - OIDC authentication scaffold
  - i18n (internationalization)
  - Email service (SMTP via Mailpit in dev)
  - File upload support
  - Blue-green deployment infrastructure

## Quick Start

```bash
curl -fsSL https://raw.githubusercontent.com/blendsdk/appscaffold/master/install.sh | bash
```

Or with CLI flags (non-interactive):

```bash
curl -fsSL https://raw.githubusercontent.com/blendsdk/appscaffold/master/install.sh | bash -s -- \
  --name MyApp \
  --scope @myapp \
  --port 4000
```

## Usage

### Interactive Mode

```bash
node scaffold/scaffold.js
```

Prompts you for project name, scope, ports, and optional features.

### Non-Interactive Mode

```bash
node scaffold/scaffold.js \
  --name CastingApp \
  --scope @castingapp \
  --description "Casting management system" \
  --port 4000 \
  --frontend-port 5173 \
  --db-name castingapp \
  --oidc \
  --i18n \
  --mailer \
  --blue-green
```

### All Options

| Flag | Default | Description |
|------|---------|-------------|
| `--name <name>` | *(required for non-interactive)* | Project name |
| `--scope <scope>` | `@<lowercase-name>` | npm package scope |
| `--description <desc>` | `"A BlendSDK application"` | Project description |
| `--port <port>` | `4000` | Backend port |
| `--frontend-port <port>` | `5173` | Frontend dev port |
| `--db-name <name>` | `<lowercase-name>` | PostgreSQL database name |
| `--db-port <port>` | `5432` | PostgreSQL host port |
| `--redis-port <port>` | `6379` | Redis host port |
| `--oidc / --no-oidc` | `true` | OIDC authentication |
| `--i18n / --no-i18n` | `true` | Internationalization |
| `--mailer / --no-mailer` | `false` | Email service |
| `--file-upload / --no-file-upload` | `false` | File upload support |
| `--blue-green / --no-blue-green` | `true` | Blue-green deployment |
| `--force` | `false` | Overwrite existing files |
| `--dry-run` | `false` | Preview without writing |

## Development

### Prerequisites

- Node.js >= 22
- Yarn >= 1.22

### Setup

```bash
yarn install
```

### Build

Bundles TypeScript source into `scaffold/scaffold.js`:

```bash
yarn build
```

### Test

```bash
yarn test
```

### Project Structure

```
├── src/                    # TypeScript source
│   ├── types.ts            # Interfaces and constants
│   ├── prompts.ts          # Interactive & CLI prompts
│   ├── renderer.ts         # Template rendering ({{PLACEHOLDER}})
│   ├── generator.ts        # File list & variable building
│   ├── writer.ts           # File system operations
│   └── index.ts            # Main entry point
├── scaffold/               # Bundled output (committed)
│   ├── scaffold.js         # Single-file bundle (esbuild)
│   ├── templates/          # Template files
│   └── partials/           # Conditional code snippets
├── install.sh              # curl-based installer
├── esbuild.config.mjs      # Bundle configuration
└── vitest.config.ts        # Test configuration
```

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Runtime | Node.js 22+ |
| Language | TypeScript 5.9+ |
| Bundler | esbuild |
| Tests | vitest |
| Generated backend | BlendSDK v5, Express 5 |
| Generated frontend | React 18, FluentUI v9, Vite |
| Generated DB | PostgreSQL 16, Redis 7 |

## License

MIT
