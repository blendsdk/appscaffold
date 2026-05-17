-- Translation overrides table
-- JSON file translations serve as defaults; database entries override them.
CREATE TABLE IF NOT EXISTS translations (
    id          SERIAL PRIMARY KEY,
    locale      VARCHAR(10)  NOT NULL,
    key         VARCHAR(255) NOT NULL,
    value       TEXT         NOT NULL,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_translations_locale_key UNIQUE (locale, key)
);

-- Index for fast locale-based lookups
CREATE INDEX IF NOT EXISTS idx_translations_locale ON translations (locale);
