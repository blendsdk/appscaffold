# Ambiguity Register: Frontend I18n Integration

> **Status**: ✅ GATE PASSED — all 13 items resolved
> **Last Updated**: 2026-05-17

| # | Category | Ambiguity / Gap | Options Presented | User Decision | Status |
|---|----------|----------------|-------------------|---------------|--------|
| 1 | Scaffold Prompt | How to present DB translations choice? | A) Follow-up when i18n=true / B) Separate top-level | A — follow-up | ✅ Resolved |
| 2 | Scaffold Flags | CLI flags for DB translations? | A) `--i18n-db` / `--no-i18n-db` / B) `--translations-db` | A | ✅ Resolved |
| 3 | Tenant Resolution | Where does tenant come from? | A) Env / B) Header / C) Both | **REMOVED** — no multi-tenant | ✅ Resolved |
| 4 | Cache Key | Redis key format | A) `{rootKey}:i18n:{locale}` | A (no tenant) | ✅ Resolved |
| 5 | Cache TTL | Default TTL for translation cache | A) 300s / B) 600s / C) 0 (no expiry) | C — no expiry, manual invalidation | ✅ Resolved |
| 6 | Cache Invalidation | How to clear cache? | A) Pub/sub / B) Admin endpoint / C) Both | B — `GET /api/admin/translations/cache/clear` | ✅ Resolved |
| 7 | DB Migration | Include SQL migration? | A) Yes via codegen / B) Just document | A — via codegen | ✅ Resolved |
| 8 | GlobalLoaderProvider | Always include? | A) Always / B) Only with i18n | A — always | ✅ Resolved |
| 9 | `blendsdk` in webclient | When to add? | A) Only with i18n / B) Always | B — always | ✅ Resolved |
| 10 | ScaffoldAnswers type | New field naming | A) `i18nDb: boolean` / B) Different | A | ✅ Resolved |
| 11 | Controller pattern | How to register conditionally | A) Partials / B) Always include | A — partials | ✅ Resolved |
| 12 | Admin cache clear | Just cache or also reload? | A) Just Redis / B) Redis + reload Translator | B — clear + reload | ✅ Resolved |
| 13 | Sample en.json | Contents | A) Minimal / B) Include plurals | B — include plurals | ✅ Resolved |
