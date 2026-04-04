# Templates — WebAPI (BlendSDK v5 Backend)

> **Document**: 05-templates-webapi.md
> **Parent**: [Index](00-index.md)

## Overview

Templates for the `packages/webapi` package — a BlendSDK v5 backend application using Express 5, PostgreSQL 16, Redis 7, with ESM and TypeScript.

## Template Files

### `webapi/package.json`

```json
{
  "name": "{{PACKAGE_SCOPE}}/webapi",
  "version": "1.0.0",
  "type": "module",
  "private": true,
  "scripts": {
    "build": "tsc",
    "dev": "tsx watch src/index.ts",
    "clean": "rm -rf dist",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "blendsdk": "^5.35.0",
    "{{PACKAGE_SCOPE}}/shared": "^1.0.0",
    "express": "^5.0.0",
    "cookie-parser": "^1.4.0",
    "cors": "^2.8.0",
    "helmet": "^8.0.0",
    "pg": "^8.18.0",
    "yesql": "^7.0.0",
    "ioredis": "^5.9.0",
    "zod": "^4.0.0"{{WEBAPI_DEPS_PARTIAL}}
  },
  "devDependencies": {
    "@types/express": "^5.0.0",
    "@types/cookie-parser": "^1.4.0",
    "@types/cors": "^2.8.0",
    "@types/pg": "^8.0.0",
    "@types/node": "^22.0.0",
    "tsx": "^4.21.0",
    "typescript": "^5.9.0",
    "vitest": "^4.1.0"
  }
}
```

**Conditional dependencies (partials):**
- OIDC: `"jose": "^6.0.0"`
- Mailer: `"nodemailer": "^6.10.0"` + `"@types/nodemailer": "^6.4.0"` (devDep)
- File upload: (via blendsdk/webafx — no extra peer dep needed)

### `webapi/tsconfig.json`

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

### `webapi/.env.js`

```javascript
export default {
  PORT: {{BACKEND_PORT}},
  ENV_MODE: 'development',
  LOG_LEVEL: 'DEBUG',
  CORS: true,
  DB_HOST: 'localhost',
  DB_PORT: {{DB_PORT}},
  DB_NAME: '{{DB_NAME}}',
  DB_USER: '{{DB_NAME}}',
  DB_PASSWORD: 'secret',
  REDIS_HOST: 'localhost',
  REDIS_PORT: {{REDIS_PORT}},
  REDIS_PASSWORD: 'secret',
  PUBLIC_FOLDER: './resources/public/static',
  STORAGE_FOLDER: './temp/storage',
};
```

### `webapi/.env.local.js.example`

```javascript
// Copy to .env.local.js for local overrides (git-ignored)
export default {
  LOG_LEVEL: 'DEBUG',
};
```

### `webapi/src/index.ts`

Main application entry point using BlendSDK v5 WebApplication.

```typescript
import { WebApplication } from 'blendsdk/webafx';
import { PostgreSQLDatabase } from 'blendsdk/postgresql';
import { redisCachePlugin } from 'blendsdk/webafx-cache';
{{WEBAPI_PLUGIN_IMPORTS}}
import { HealthController } from './controllers/health-controller.js';

const app = new WebApplication({
  PORT: {{BACKEND_PORT}},
  ENV_MODE: 'development',
  LOG_LEVEL: 'INFO',
  CORS: true,
});

// Database service
app.registerService({
  name: 'db',
  type: 'singleton',
  factory: async (container, settings) => {
    const db = new PostgreSQLDatabase({
      host: settings.get('DB_HOST', 'localhost'),
      port: settings.get('DB_PORT', {{DB_PORT}}),
      database: settings.get('DB_NAME', '{{DB_NAME}}'),
      user: settings.get('DB_USER', '{{DB_NAME}}'),
      pass: settings.get('DB_PASSWORD', 'secret'),
    });
    await db.connect();
    return db;
  },
  dispose: async (db) => await db.disconnect(),
});

// Redis cache plugin
app.use(redisCachePlugin({
  rootKey: '{{PROJECT_NAME_LOWER}}',
  host: 'localhost',
  port: {{REDIS_PORT}},
  defaultTTL: 300,
}));

{{WEBAPI_PLUGIN_REGISTRATIONS}}

// Controllers
app.registerController('/api/health', HealthController);

const shutdown = await app.start();
```

### `webapi/src/controllers/health-controller.ts`

Health endpoint with dependency checks.

```typescript
import { BaseController } from 'blendsdk/webafx';
import { PostgreSQLDatabase } from 'blendsdk/postgresql';
import type { CacheProvider } from 'blendsdk/webafx-cache';
import type { Request, Response } from 'express';

export class HealthController extends BaseController {
  routes() {
    return [
      this.route().get('/').handle(this.check),
    ];
  }

  async check(req: Request, res: Response) {
    const checks: Record<string, string> = {};

    // Database check
    try {
      const db = await req.services.get<PostgreSQLDatabase>('db');
      await db.executeQuery('SELECT 1');
      checks.database = 'ok';
    } catch {
      checks.database = 'error';
    }

    // Cache check
    try {
      const cache = await req.services.get<CacheProvider>('cache');
      await cache.getOrSet('health:ping', async () => 'pong', 10);
      checks.cache = 'ok';
    } catch {
      checks.cache = 'error';
    }

    const allOk = Object.values(checks).every((v) => v === 'ok');
    const status = allOk ? 200 : 503;

    res.status(status).json({
      status: allOk ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      checks,
    });
  }
}
```

### `webapi/config/app.config.js`

```javascript
// Runtime configuration — loaded by WebApplication
// Override with .env.local.js for local development
export default {};
```

## Conditional Partials

### `partials/oidc-plugin.ts` (if OIDC enabled)

Generic OIDC authentication plugin — provider-agnostic. Configured via settings:
- `OIDC_ISSUER_URL` — Provider's issuer URL
- `OIDC_CLIENT_ID` — Application client ID
- `OIDC_CLIENT_SECRET` — Application client secret
- `OIDC_REDIRECT_URI` — Callback URL

### `partials/i18n-plugin-import.txt` (if i18n enabled)

Adds `import { i18nPlugin } from 'blendsdk/webafx-i18n';` and registration.

### `partials/mailer-plugin-import.txt` (if mailer enabled)

Adds `import { smtpMailPlugin } from 'blendsdk/webafx-mailer';` and registration.

## Docker Configuration

### `webapi/docker/docker-compose.yml`

```yaml
services:
  db:
    image: postgres:16-alpine
    ports:
      - "{{DB_PORT}}:5432"
    environment:
      POSTGRES_PASSWORD: postgres
      TZ: Europe/Amsterdam
      PGTZ: Europe/Amsterdam
    volumes:
      - ./postgres:/docker-entrypoint-initdb.d
      - ../temp/dev-db:/var/lib/postgresql/data
      - ../resources/database:/resources
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    command: redis-server --requirepass secret
    ports:
      - "{{REDIS_PORT}}:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "-a", "secret", "ping"]
      interval: 5s
      timeout: 3s
      retries: 5
{{DOCKER_MAILPIT_PARTIAL}}
```

### `webapi/docker/postgres/1.database.sh`

```bash
#!/bin/bash
set -e
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE USER {{DB_NAME}} WITH PASSWORD 'secret';
    CREATE DATABASE {{DB_NAME}} OWNER {{DB_NAME}};
    GRANT ALL PRIVILEGES ON DATABASE {{DB_NAME}} TO {{DB_NAME}};
EOSQL
```

### `partials/docker-mailpit.yml` (if mailer enabled)

```yaml
  mailpit:
    image: axllent/mailpit:latest
    ports:
      - "1025:1025"
      - "8025:8025"
    environment:
      MP_SMTP_AUTH_ACCEPT_ANY: 1
      MP_SMTP_AUTH_ALLOW_INSECURE: 1
```

## Directory Structure Templates

```
webapi/
├── src/
│   ├── index.ts
│   ├── controllers/
│   │   └── health-controller.ts
│   ├── plugins/                    # Auth, i18n, mailer plugins
│   │   └── .gitkeep (or oidc-auth-plugin.ts)
│   ├── services/
│   │   └── .gitkeep
│   ├── dataservices/
│   │   └── .gitkeep
│   ├── modules/
│   │   └── api/
│   │       └── .gitkeep
│   ├── types/
│   │   └── index.ts
│   └── utils/
│       └── .gitkeep
├── config/
│   └── app.config.js
├── resources/
│   ├── database/
│   │   └── .gitkeep
│   ├── i18n/                       # (if i18n enabled)
│   │   └── .gitkeep
│   └── public/
│       └── .gitkeep
├── docker/
│   ├── docker-compose.yml
│   └── postgres/
│       └── 1.database.sh
└── .gitignore
```

### `webapi/.gitignore`

```gitignore
dist/
node_modules/
temp/
.env.local.js
```
