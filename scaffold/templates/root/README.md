# {{PROJECT_NAME}}

{{DESCRIPTION}}

## Architecture

This is a monorepo powered by [Turborepo](https://turbo.build/) and [Yarn Workspaces](https://classic.yarnpkg.com/en/docs/workspaces/).

| Package | Description |
|---------|-------------|
| `packages/shared` | Shared TypeScript types and utilities |
| `packages/webapi` | BlendSDK v5 backend (Express 5 + PostgreSQL + Redis) |
| `packages/webclient` | Vite + React 18 + FluentUI v9 frontend |
| `packages/codegen` | Code generation (BlendSDK codegen) |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) >= 22
- [Yarn](https://classic.yarnpkg.com/) >= 1.22
- [Docker](https://www.docker.com/) (for development databases)

### Setup

```bash
# Install dependencies
yarn install

# One-time dev environment setup (certs + /etc/hosts + Docker check)
yarn docker:setup

# Start development services (PostgreSQL + Redis + HTTPS proxy)
yarn docker:dev

# Start all packages in development mode
yarn dev

# Open https://dev.{{PROJECT_NAME_LOWER}}.local:{{HTTPS_PORT}}
```

### Available Scripts

| Script | Description |
|--------|-------------|
| `yarn build` | Build all packages |
| `yarn dev` | Start all packages in dev mode |
| `yarn dev:api` | Start backend in dev mode |
| `yarn dev:client` | Start frontend in dev mode |
| `yarn test` | Run all tests |
| `yarn typecheck` | Type-check all packages |
| `yarn clean` | Clean all build outputs |
| `yarn docker:setup` | One-time dev environment setup (certs + hosts) |
| `yarn docker:certs` | Regenerate SSL certificates only |
| `yarn docker:dev` | Start dev services (DB + Redis + HTTPS proxy) |
| `yarn docker:down` | Stop dev services |
| `yarn docker:reset` | Reset dev services (destroy data) |
| `yarn ncu` | Update all dependencies |

### Development URLs

| Service | URL |
|---------|-----|
| Application (HTTPS) | https://dev.{{PROJECT_NAME_LOWER}}.local:{{HTTPS_PORT}} |
| Health Check (HTTPS) | https://dev.{{PROJECT_NAME_LOWER}}.local:{{HTTPS_PORT}}/api/health |
| Frontend (direct) | http://localhost:{{FRONTEND_PORT}} |
| Backend API (direct) | http://localhost:{{BACKEND_PORT}} |

### HTTPS Development Proxy

This project includes an nginx reverse proxy that terminates SSL, giving you a
production-like HTTPS environment during local development.

**Architecture:**

```
Browser → https://dev.{{PROJECT_NAME_LOWER}}.local:{{HTTPS_PORT}}
              │
      ┌───────┴────────┐
      │  nginx (Docker) │
      │  SSL termination│
      ├─────────────────┤
      │ /api  → webapi  │  (Node.js on port {{BACKEND_PORT}})
      │ /*    → vite    │  (Vite dev on port {{FRONTEND_PORT}})
      └─────────────────┘
```

**First-time setup:**

Run `yarn docker:setup` — this handles certificates, `/etc/hosts`, and validates
Docker in a single command. See [Setup](#setup) above.

**Browser-trusted certificates (optional):**

Install [mkcert](https://github.com/FiloSottile/mkcert) before running
`yarn docker:setup` to get browser-trusted certificates with no SSL warnings:

```bash
brew install mkcert    # macOS
apt install mkcert     # Ubuntu/Debian
```

If mkcert is not installed, `docker:setup` falls back to openssl self-signed
certificates (you'll need to accept the certificate in your browser once).

**Regenerating certificates:**

```bash
rm -rf packages/webapi/docker/certs
yarn docker:certs
```

## Deployment

Build the deployment package:

```bash
bash deploy-package.sh
```

This creates `deployment-latest.tgz` which can be deployed via the blue-green deployment infrastructure.

## Tech Stack

- **Runtime**: Node.js 22+
- **Backend**: [BlendSDK](https://github.com/blendsdk) v5, Express 5
- **Frontend**: React 18, [FluentUI v9](https://react.fluentui.dev/), Vite
- **Database**: PostgreSQL 16, Redis 7
- **Validation**: zod
- **Testing**: vitest
- **Build**: Turborepo, TypeScript 5.9+
