# Templates — Root & Shared Package

> **Document**: 04-templates-root.md
> **Parent**: [Index](00-index.md)

## Overview

Root-level configuration templates and the `packages/shared` package template. These set up the Turborepo monorepo structure with Yarn Workspaces.

## Template Files

### `root/package.json`

```json
{
  "name": "{{PROJECT_NAME_LOWER}}",
  "private": true,
  "workspaces": {
    "packages": ["packages/*"]
  },
  "engines": {
    "node": ">=22.0.0",
    "yarn": ">=1.22.0"
  },
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "dev:api": "turbo run dev --filter={{PACKAGE_SCOPE}}/webapi",
    "dev:client": "turbo run dev --filter={{PACKAGE_SCOPE}}/webclient",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "clean": "turbo run clean",
    "typecheck": "turbo run typecheck",
    "docker:dev": "docker compose -f packages/webapi/docker/docker-compose.yml up -d",
    "docker:down": "docker compose -f packages/webapi/docker/docker-compose.yml down",
    "docker:reset": "docker compose -f packages/webapi/docker/docker-compose.yml down -v && yarn docker:dev",
    "ncu": "ncu -u -x \"blendsdk,@fluentui/*,react,react-dom,@types/react,@types/react-dom\" && yarn workspaces foreach -A exec \"ncu -u -x 'blendsdk,@fluentui/*,react,react-dom,@types/react,@types/react-dom'\" && rm -fR node_modules yarn.lock && yarn install"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "npm-check-updates": "^17.0.0",
    "turbo": "^2.0.0",
    "typescript": "^5.9.0"
  }
}
```

### `root/turbo.json`

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["tsconfig.base.json"],
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": []
    },
    "lint": {
      "outputs": []
    },
    "typecheck": {
      "dependsOn": ["^build"],
      "outputs": []
    },
    "clean": {
      "cache": false
    }
  }
}
```

### `root/tsconfig.base.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true
  }
}
```

### `root/.nvmrc`

```
22
```

### `root/.editorconfig`

```ini
root = true

[*]
indent_style = space
indent_size = 4
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.{json,yml,yaml}]
indent_size = 2

[*.md]
trim_trailing_whitespace = false
```

### `root/.prettierrc`

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 120,
  "tabWidth": 4,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

### `root/.gitignore`

```gitignore
# Dependencies
node_modules/

# Build outputs
dist/
*.tgz

# Turborepo
.turbo/

# IDE
.idea/
.vscode/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Environment
.env.local.js
*.local

# Temp
temp/
tmp/

# Deployment
deployment-latest.tgz
local_data/
```

### `root/README.md`

Template with project name, description, getting started instructions, and architecture overview.

## Shared Package Templates

### `shared/package.json`

```json
{
  "name": "{{PACKAGE_SCOPE}}/shared",
  "version": "1.0.0",
  "type": "module",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "clean": "rm -rf dist",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "dev": "tsc --watch"
  },
  "devDependencies": {
    "typescript": "^5.9.0",
    "vitest": "^4.1.0"
  }
}
```

### `shared/tsconfig.json`

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

### `shared/src/index.ts`

```typescript
export * from './types/index.js';
```

### `shared/src/types/index.ts`

```typescript
/**
 * Shared type definitions for {{PROJECT_NAME}}.
 * Types in this package are shared between webapi, webclient, and codegen.
 *
 * Generated types (from codegen) will be added here as the project grows.
 */

/** Base entity interface — all database entities extend this */
export interface BaseEntity {
    id: number;
    created_at: string;
    updated_at: string;
}
```

### `shared/.gitignore`

```gitignore
dist/
node_modules/
```

## Integration Points

- Root `package.json` workspaces field references `packages/*`
- Turborepo `turbo.json` defines the build pipeline (`^build` for dependency order)
- `tsconfig.base.json` is extended by all package-level tsconfigs
- `ncu` script excludes pinned packages to prevent breaking updates
