import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import type { ScaffoldAnswers } from '../types.js';
import { generateAllFiles } from '../generator.js';

let tmpDir: string;

const MINIMAL_ANSWERS: ScaffoldAnswers = {
    name: 'TestApp',
    scope: '@testapp',
    description: 'Integration test project',
    backendPort: '4000',
    frontendPort: '5173',
    httpsPort: '8443',
    dbName: 'testapp',
    dbPort: '5432',
    redisPort: '6379',
    oidc: false,
    i18n: false,
    i18nDb: false,
    mailer: false,
    fileUpload: false,
    blueGreen: false,
};

const FULL_ANSWERS: ScaffoldAnswers = {
    ...MINIMAL_ANSWERS,
    oidc: true,
    i18n: true,
    i18nDb: false,
    mailer: true,
    fileUpload: true,
};

beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'scaffold-integration-'));
});

afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe('integration: generateAllFiles', () => {
    it('generates complete project with minimal config', () => {
        const results = generateAllFiles(MINIMAL_ANSWERS, { outputDir: tmpDir });
        const created = results.filter((r) => r.status === 'created');
        expect(created.length).toBeGreaterThan(30);

        // Core files exist
        expect(fs.existsSync(path.join(tmpDir, 'package.json'))).toBe(true);
        expect(fs.existsSync(path.join(tmpDir, 'turbo.json'))).toBe(true);
        expect(fs.existsSync(path.join(tmpDir, 'tsconfig.base.json'))).toBe(true);
        expect(fs.existsSync(path.join(tmpDir, 'packages/shared/package.json'))).toBe(true);
        expect(fs.existsSync(path.join(tmpDir, 'packages/webapi/package.json'))).toBe(true);
        expect(fs.existsSync(path.join(tmpDir, 'packages/webclient/package.json'))).toBe(true);
        expect(fs.existsSync(path.join(tmpDir, 'packages/codegen/package.json'))).toBe(true);
    });

    it('generates project with all features enabled', () => {
        const results = generateAllFiles(FULL_ANSWERS, { outputDir: tmpDir });
        expect(fs.existsSync(path.join(tmpDir, 'packages/webapi/src/plugins/oidc-auth-plugin.ts'))).toBe(true);
        expect(fs.existsSync(path.join(tmpDir, 'packages/webapi/resources/i18n/.gitkeep'))).toBe(true);
    });

    it('generated root package.json is valid JSON', () => {
        generateAllFiles(MINIMAL_ANSWERS, { outputDir: tmpDir });
        const content = fs.readFileSync(path.join(tmpDir, 'package.json'), 'utf-8');
        const parsed = JSON.parse(content);
        expect(parsed.name).toBe('testapp');
        expect(parsed.workspaces).toBeDefined();
    });

    it('generated turbo.json is valid JSON', () => {
        generateAllFiles(MINIMAL_ANSWERS, { outputDir: tmpDir });
        const content = fs.readFileSync(path.join(tmpDir, 'turbo.json'), 'utf-8');
        const parsed = JSON.parse(content);
        expect(parsed.tasks).toBeDefined();
        expect(parsed.tasks.build).toBeDefined();
    });

    it('generated webapi package.json has blendsdk', () => {
        generateAllFiles(MINIMAL_ANSWERS, { outputDir: tmpDir });
        const content = fs.readFileSync(path.join(tmpDir, 'packages/webapi/package.json'), 'utf-8');
        const parsed = JSON.parse(content);
        expect(parsed.dependencies.blendsdk).toBeDefined();
    });

    it('generated webclient package.json has FluentUI v9', () => {
        generateAllFiles(MINIMAL_ANSWERS, { outputDir: tmpDir });
        const content = fs.readFileSync(path.join(tmpDir, 'packages/webclient/package.json'), 'utf-8');
        const parsed = JSON.parse(content);
        expect(parsed.dependencies['@fluentui/react-components']).toBeDefined();
    });

    it('generated codegen package.json has blendsdk', () => {
        generateAllFiles(MINIMAL_ANSWERS, { outputDir: tmpDir });
        const content = fs.readFileSync(path.join(tmpDir, 'packages/codegen/package.json'), 'utf-8');
        const parsed = JSON.parse(content);
        expect(parsed.dependencies.blendsdk).toBeDefined();
    });

    it('generated .gitignore files exist at all levels', () => {
        generateAllFiles(MINIMAL_ANSWERS, { outputDir: tmpDir });
        expect(fs.existsSync(path.join(tmpDir, '.gitignore'))).toBe(true);
        expect(fs.existsSync(path.join(tmpDir, 'packages/shared/.gitignore'))).toBe(true);
        expect(fs.existsSync(path.join(tmpDir, 'packages/webapi/.gitignore'))).toBe(true);
        expect(fs.existsSync(path.join(tmpDir, 'packages/webclient/.gitignore'))).toBe(true);
        expect(fs.existsSync(path.join(tmpDir, 'packages/codegen/.gitignore'))).toBe(true);
    });

    it('generated webapi index.ts has correct port', () => {
        generateAllFiles(MINIMAL_ANSWERS, { outputDir: tmpDir });
        const content = fs.readFileSync(path.join(tmpDir, 'packages/webapi/src/index.ts'), 'utf-8');
        expect(content).toContain('4000');
    });

    it('generated webapi index.ts includes pino logger plugin', () => {
        generateAllFiles(MINIMAL_ANSWERS, { outputDir: tmpDir });
        const content = fs.readFileSync(path.join(tmpDir, 'packages/webapi/src/index.ts'), 'utf-8');
        expect(content).toContain("import { pinoLoggerPlugin } from 'blendsdk/webafx-pino'");
        expect(content).toContain('pinoLoggerPlugin(');
        expect(content).toContain("serviceName: 'testapp'");
    });

    it('generated webapi package.json includes pino-pretty devDependency', () => {
        generateAllFiles(MINIMAL_ANSWERS, { outputDir: tmpDir });
        const content = fs.readFileSync(path.join(tmpDir, 'packages/webapi/package.json'), 'utf-8');
        const parsed = JSON.parse(content);
        expect(parsed.devDependencies['pino-pretty']).toBeDefined();
    });

    it('generated health controller uses req.log for structured logging', () => {
        generateAllFiles(MINIMAL_ANSWERS, { outputDir: tmpDir });
        const content = fs.readFileSync(
            path.join(tmpDir, 'packages/webapi/src/controllers/health-controller.ts'),
            'utf-8',
        );
        expect(content).toContain('req.log');
        expect(content).toContain("log.info('Health check completed'");
    });

    it('generated vite.config.ts has correct proxy target', () => {
        generateAllFiles(MINIMAL_ANSWERS, { outputDir: tmpDir });
        const content = fs.readFileSync(path.join(tmpDir, 'packages/webclient/vite.config.ts'), 'utf-8');
        expect(content).toContain('http://localhost:4000');
    });

    it('generated vite.config.ts has host: true for nginx proxy access', () => {
        generateAllFiles(MINIMAL_ANSWERS, { outputDir: tmpDir });
        const content = fs.readFileSync(path.join(tmpDir, 'packages/webclient/vite.config.ts'), 'utf-8');
        expect(content).toContain('host: true');
    });

    it('generates nginx proxy files', () => {
        generateAllFiles(MINIMAL_ANSWERS, { outputDir: tmpDir });
        expect(fs.existsSync(path.join(tmpDir, 'packages/webapi/docker/nginx/nginx.conf'))).toBe(true);
        expect(fs.existsSync(path.join(tmpDir, 'packages/webapi/docker/nginx/generate-certs.sh'))).toBe(true);
    });

    it('generated nginx.conf has correct ports and hostname', () => {
        generateAllFiles(MINIMAL_ANSWERS, { outputDir: tmpDir });
        const content = fs.readFileSync(path.join(tmpDir, 'packages/webapi/docker/nginx/nginx.conf'), 'utf-8');
        // Upstream ports should match the configured backend and frontend ports
        expect(content).toContain('host.docker.internal:4000');
        expect(content).toContain('host.docker.internal:5173');
        // Server name should use the project name
        expect(content).toContain('dev.testapp.local');
        // No unresolved placeholders
        expect(content).not.toContain('{{');
    });

    it('generated generate-certs.sh has correct hostname', () => {
        generateAllFiles(MINIMAL_ANSWERS, { outputDir: tmpDir });
        const content = fs.readFileSync(
            path.join(tmpDir, 'packages/webapi/docker/nginx/generate-certs.sh'),
            'utf-8',
        );
        expect(content).toContain('dev.testapp.local');
        expect(content).toContain('8443');
        expect(content).not.toContain('{{');
    });

    it('generated docker-compose.yml has nginx-proxy service', () => {
        generateAllFiles(MINIMAL_ANSWERS, { outputDir: tmpDir });
        const content = fs.readFileSync(
            path.join(tmpDir, 'packages/webapi/docker/docker-compose.yml'),
            'utf-8',
        );
        expect(content).toContain('nginx-proxy');
        expect(content).toContain('8443:443');
        expect(content).toContain('host.docker.internal:host-gateway');
    });

    it('generated root package.json has docker:certs script', () => {
        generateAllFiles(MINIMAL_ANSWERS, { outputDir: tmpDir });
        const content = fs.readFileSync(path.join(tmpDir, 'package.json'), 'utf-8');
        const parsed = JSON.parse(content);
        expect(parsed.scripts['docker:certs']).toBeDefined();
        expect(parsed.scripts['docker:certs']).toContain('generate-certs.sh');
    });

    it('generated root package.json has docker:setup script', () => {
        generateAllFiles(MINIMAL_ANSWERS, { outputDir: tmpDir });
        const content = fs.readFileSync(path.join(tmpDir, 'package.json'), 'utf-8');
        const parsed = JSON.parse(content);
        expect(parsed.scripts['docker:setup']).toBeDefined();
        expect(parsed.scripts['docker:setup']).toContain('setup-dev.sh');
    });

    it('generates setup-dev.sh with correct hostname and port', () => {
        generateAllFiles(MINIMAL_ANSWERS, { outputDir: tmpDir });
        const filePath = path.join(tmpDir, 'packages/webapi/docker/setup-dev.sh');
        expect(fs.existsSync(filePath)).toBe(true);
        const content = fs.readFileSync(filePath, 'utf-8');
        expect(content).toContain('dev.testapp.local');
        expect(content).toContain('8443');
        expect(content).toContain('mkcert');
        expect(content).not.toContain('{{');
    });

    it('generated nginx files use custom https port when configured', () => {
        const answers = { ...MINIMAL_ANSWERS, httpsPort: '9443' };
        generateAllFiles(answers, { outputDir: tmpDir });
        const compose = fs.readFileSync(
            path.join(tmpDir, 'packages/webapi/docker/docker-compose.yml'),
            'utf-8',
        );
        expect(compose).toContain('9443:443');
        const certs = fs.readFileSync(
            path.join(tmpDir, 'packages/webapi/docker/nginx/generate-certs.sh'),
            'utf-8',
        );
        expect(certs).toContain('9443');
    });

    it('placeholder replacement works end-to-end for scope', () => {
        generateAllFiles(MINIMAL_ANSWERS, { outputDir: tmpDir });
        const content = fs.readFileSync(path.join(tmpDir, 'packages/shared/package.json'), 'utf-8');
        expect(content).toContain('@testapp/shared');
        expect(content).not.toContain('{{PACKAGE_SCOPE}}');
    });
});

describe('integration: i18n feature', () => {
    it('generates i18n files when i18n enabled', () => {
        const answers = { ...MINIMAL_ANSWERS, i18n: true };
        generateAllFiles(answers, { outputDir: tmpDir });

        // Backend i18n files
        expect(fs.existsSync(path.join(tmpDir, 'packages/webapi/src/controllers/translations-controller.ts'))).toBe(true);
        expect(fs.existsSync(path.join(tmpDir, 'packages/webapi/resources/i18n/en.json'))).toBe(true);

        // Frontend i18n files
        expect(fs.existsSync(path.join(tmpDir, 'packages/webclient/src/system/i18n/loader.ts'))).toBe(true);
    });

    it('does not generate i18n files when i18n disabled', () => {
        generateAllFiles(MINIMAL_ANSWERS, { outputDir: tmpDir });

        expect(fs.existsSync(path.join(tmpDir, 'packages/webapi/src/controllers/translations-controller.ts'))).toBe(false);
        expect(fs.existsSync(path.join(tmpDir, 'packages/webapi/resources/i18n/en.json'))).toBe(false);
        expect(fs.existsSync(path.join(tmpDir, 'packages/webclient/src/system/i18n/loader.ts'))).toBe(false);
    });

    it('generated en.json is valid JSON with expected keys', () => {
        const answers = { ...MINIMAL_ANSWERS, i18n: true };
        generateAllFiles(answers, { outputDir: tmpDir });

        const content = fs.readFileSync(path.join(tmpDir, 'packages/webapi/resources/i18n/en.json'), 'utf-8');
        const parsed = JSON.parse(content);
        expect(parsed['app.title']).toBe('TestApp');
        expect(parsed['app.welcome']).toContain('${name}');
        expect(parsed['items.count']).toBeDefined();
        expect(Array.isArray(parsed['items.count'])).toBe(true);
        expect(parsed['items.count']).toHaveLength(2);
    });

    it('generated translations controller has all three endpoints', () => {
        const answers = { ...MINIMAL_ANSWERS, i18n: true };
        generateAllFiles(answers, { outputDir: tmpDir });

        const content = fs.readFileSync(
            path.join(tmpDir, 'packages/webapi/src/controllers/translations-controller.ts'),
            'utf-8',
        );
        expect(content).toContain('getTranslations');
        expect(content).toContain('getGreeting');
        expect(content).toContain('clearCache');
    });

    it('generated frontend loader fetches from API', () => {
        const answers = { ...MINIMAL_ANSWERS, i18n: true };
        generateAllFiles(answers, { outputDir: tmpDir });

        const content = fs.readFileSync(
            path.join(tmpDir, 'packages/webclient/src/system/i18n/loader.ts'),
            'utf-8',
        );
        expect(content).toContain('/api/translations/');
        expect(content).toContain('fetchTranslations');
    });

    it('generated webapi index.ts includes i18n controller when enabled', () => {
        const answers = { ...MINIMAL_ANSWERS, i18n: true };
        generateAllFiles(answers, { outputDir: tmpDir });

        const content = fs.readFileSync(path.join(tmpDir, 'packages/webapi/src/index.ts'), 'utf-8');
        expect(content).toContain('TranslationsController');
        expect(content).toContain('createI18nPlugin');
    });

    it('generated webapi index.ts has no i18n references when disabled', () => {
        generateAllFiles(MINIMAL_ANSWERS, { outputDir: tmpDir });

        const content = fs.readFileSync(path.join(tmpDir, 'packages/webapi/src/index.ts'), 'utf-8');
        expect(content).not.toContain('TranslationsController');
        expect(content).not.toContain('createI18nPlugin');
    });

    it('generated main.tsx always includes GlobalLoaderProvider', () => {
        generateAllFiles(MINIMAL_ANSWERS, { outputDir: tmpDir });

        const content = fs.readFileSync(path.join(tmpDir, 'packages/webclient/src/main.tsx'), 'utf-8');
        expect(content).toContain('GlobalLoaderProvider');
    });

    it('generated main.tsx includes I18nProvider when i18n enabled', () => {
        const answers = { ...MINIMAL_ANSWERS, i18n: true };
        generateAllFiles(answers, { outputDir: tmpDir });

        const content = fs.readFileSync(path.join(tmpDir, 'packages/webclient/src/main.tsx'), 'utf-8');
        expect(content).toContain('I18nProvider');
        expect(content).toContain('fetchTranslations');
    });

    it('generated main.tsx does not include I18nProvider when i18n disabled', () => {
        generateAllFiles(MINIMAL_ANSWERS, { outputDir: tmpDir });

        const content = fs.readFileSync(path.join(tmpDir, 'packages/webclient/src/main.tsx'), 'utf-8');
        expect(content).not.toContain('I18nProvider');
    });

    it('generated Home.tsx includes translation usage when i18n enabled', () => {
        const answers = { ...MINIMAL_ANSWERS, i18n: true };
        generateAllFiles(answers, { outputDir: tmpDir });

        const content = fs.readFileSync(path.join(tmpDir, 'packages/webclient/src/pages/Home.tsx'), 'utf-8');
        expect(content).toContain('useTranslations');
        expect(content).toContain("t('app.welcome'");
        expect(content).toContain("t('items.count'");
    });

    it('generated Home.tsx has no translation usage when i18n disabled', () => {
        generateAllFiles(MINIMAL_ANSWERS, { outputDir: tmpDir });

        const content = fs.readFileSync(path.join(tmpDir, 'packages/webclient/src/pages/Home.tsx'), 'utf-8');
        expect(content).not.toContain('useTranslations');
    });

    it('generated webclient package.json always has blendsdk', () => {
        generateAllFiles(MINIMAL_ANSWERS, { outputDir: tmpDir });

        const content = fs.readFileSync(path.join(tmpDir, 'packages/webclient/package.json'), 'utf-8');
        const parsed = JSON.parse(content);
        expect(parsed.dependencies.blendsdk).toBeDefined();
    });

    it('generated system/index.ts exports fetchTranslations when i18n enabled', () => {
        const answers = { ...MINIMAL_ANSWERS, i18n: true };
        generateAllFiles(answers, { outputDir: tmpDir });

        const content = fs.readFileSync(path.join(tmpDir, 'packages/webclient/src/system/index.ts'), 'utf-8');
        expect(content).toContain('fetchTranslations');
    });

    it('generated system/index.ts does not export fetchTranslations when i18n disabled', () => {
        generateAllFiles(MINIMAL_ANSWERS, { outputDir: tmpDir });

        const content = fs.readFileSync(path.join(tmpDir, 'packages/webclient/src/system/index.ts'), 'utf-8');
        expect(content).not.toContain('fetchTranslations');
    });
});

describe('integration: i18nDb feature', () => {
    it('generates migration file when i18nDb enabled', () => {
        const answers = { ...MINIMAL_ANSWERS, i18n: true, i18nDb: true };
        generateAllFiles(answers, { outputDir: tmpDir });

        const filePath = path.join(tmpDir, 'packages/codegen/resources/database/001-translations.sql');
        expect(fs.existsSync(filePath)).toBe(true);

        const content = fs.readFileSync(filePath, 'utf-8');
        expect(content).toContain('CREATE TABLE');
        expect(content).toContain('translations');
        expect(content).toContain('locale');
        expect(content).toContain('UNIQUE');
    });

    it('does not generate migration when i18nDb disabled', () => {
        const answers = { ...MINIMAL_ANSWERS, i18n: true, i18nDb: false };
        generateAllFiles(answers, { outputDir: tmpDir });

        expect(fs.existsSync(
            path.join(tmpDir, 'packages/codegen/resources/database/001-translations.sql'),
        )).toBe(false);
    });

    it('generated webapi index.ts includes postgresqlSource when i18nDb enabled', () => {
        const answers = { ...MINIMAL_ANSWERS, i18n: true, i18nDb: true };
        generateAllFiles(answers, { outputDir: tmpDir });

        const content = fs.readFileSync(path.join(tmpDir, 'packages/webapi/src/index.ts'), 'utf-8');
        expect(content).toContain('postgresqlSource');
    });

    it('generated webapi index.ts does not include postgresqlSource when i18nDb disabled', () => {
        const answers = { ...MINIMAL_ANSWERS, i18n: true, i18nDb: false };
        generateAllFiles(answers, { outputDir: tmpDir });

        const content = fs.readFileSync(path.join(tmpDir, 'packages/webapi/src/index.ts'), 'utf-8');
        expect(content).not.toContain('postgresqlSource');
    });

    it('generates full i18n + i18nDb scaffold end-to-end', () => {
        const answers = { ...MINIMAL_ANSWERS, i18n: true, i18nDb: true, oidc: true };
        const results = generateAllFiles(answers, { outputDir: tmpDir });
        const created = results.filter((r) => r.status === 'created');

        // Should have more files than minimal (base ~40 + i18n + i18nDb + oidc)
        expect(created.length).toBeGreaterThan(40);

        // All i18n files present
        expect(fs.existsSync(path.join(tmpDir, 'packages/webapi/src/controllers/translations-controller.ts'))).toBe(true);
        expect(fs.existsSync(path.join(tmpDir, 'packages/webapi/resources/i18n/en.json'))).toBe(true);
        expect(fs.existsSync(path.join(tmpDir, 'packages/webclient/src/system/i18n/loader.ts'))).toBe(true);
        expect(fs.existsSync(path.join(tmpDir, 'packages/codegen/resources/database/001-translations.sql'))).toBe(true);

        // No unresolved placeholders in key files
        const webapiIndex = fs.readFileSync(path.join(tmpDir, 'packages/webapi/src/index.ts'), 'utf-8');
        expect(webapiIndex).not.toContain('{{');

        const mainTsx = fs.readFileSync(path.join(tmpDir, 'packages/webclient/src/main.tsx'), 'utf-8');
        expect(mainTsx).not.toContain('{{');

        const homeTsx = fs.readFileSync(path.join(tmpDir, 'packages/webclient/src/pages/Home.tsx'), 'utf-8');
        expect(homeTsx).not.toContain('{{');
    });
});
