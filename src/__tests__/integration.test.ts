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
    dbName: 'testapp',
    dbPort: '5432',
    redisPort: '6379',
    oidc: false,
    i18n: false,
    mailer: false,
    fileUpload: false,
    blueGreen: false,
};

const FULL_ANSWERS: ScaffoldAnswers = {
    ...MINIMAL_ANSWERS,
    oidc: true,
    i18n: true,
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

    it('generated vite.config.ts has correct proxy target', () => {
        generateAllFiles(MINIMAL_ANSWERS, { outputDir: tmpDir });
        const content = fs.readFileSync(path.join(tmpDir, 'packages/webclient/vite.config.ts'), 'utf-8');
        expect(content).toContain('http://localhost:4000');
    });

    it('placeholder replacement works end-to-end for scope', () => {
        generateAllFiles(MINIMAL_ANSWERS, { outputDir: tmpDir });
        const content = fs.readFileSync(path.join(tmpDir, 'packages/shared/package.json'), 'utf-8');
        expect(content).toContain('@testapp/shared');
        expect(content).not.toContain('{{PACKAGE_SCOPE}}');
    });
});
