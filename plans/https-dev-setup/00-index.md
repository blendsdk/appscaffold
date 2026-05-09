# HTTPS Dev Environment — DX Enhancements

> **Status:** Approved
> **Scope:** Developer experience improvements for HTTPS local development

## Changes

## Summary

The scaffold already has a fully working HTTPS development environment (nginx TLS proxy,
PostgreSQL, Redis, Vite HMR through proxy). These enhancements improve the **first-time
setup experience** with:

1. `setup-dev.sh` — One-command setup (mkcert detection + /etc/hosts + validation)
2. `docker:setup` — Discoverable yarn script entry point
3. Enhanced README — Updated docs referencing `docker:setup` + mkcert recommendation
4. Post-scaffold instructions — Generator prints next steps after scaffolding

## Ambiguity Decisions

| # | Decision | Resolution |
|---|----------|------------|
| A1 | mkcert strategy | Check + instruct + fallback to openssl |
| A2 | TRUST_PROXY | Already handled by BlendSDK (defaults to true) |
| A3 | Vite HMR | Already working through nginx proxy |
| A4 | setup-dev.sh location | `packages/webapi/docker/setup-dev.sh` |
| A5 | docker:setup vs docker:certs | Add alongside, don't replace |
| A6 | .env.example | Skip — .env.js is the chosen pattern |
| A7 | /etc/hosts modification | Try sudo, fallback to print instructions |
| A8 | README scope | Update existing comprehensive README |
| A10 | Blue-green compatibility | Different directories, document port overlap |

## Files Changed

### New Files
- `scaffold/templates/webapi/docker/setup-dev.sh`

### Modified Files
- `scaffold/templates/root/package.json` — Add `docker:setup` script
- `scaffold/templates/root/README.md` — Update setup instructions + mkcert info
- `src/generator.ts` — Add setup-dev.sh to file list + post-scaffold message
