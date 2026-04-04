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

# Start development databases (PostgreSQL + Redis)
yarn docker:dev

# Start all packages in development mode
yarn dev

# Or start individually
yarn dev:api      # Backend only
yarn dev:client   # Frontend only
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
| `yarn docker:dev` | Start dev databases |
| `yarn docker:down` | Stop dev databases |
| `yarn docker:reset` | Reset dev databases (destroy data) |
| `yarn ncu` | Update all dependencies |

### Development URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:{{FRONTEND_PORT}} |
| Backend API | http://localhost:{{BACKEND_PORT}} |
| Health Check | http://localhost:{{BACKEND_PORT}}/api/health |

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
