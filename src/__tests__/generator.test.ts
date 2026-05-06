import { describe, it, expect } from 'vitest';
import type { ScaffoldAnswers } from '../types.js';
import { buildTemplateVars, buildFileList } from '../generator.js';

const MINIMAL_ANSWERS: ScaffoldAnswers = {
    name: 'TestApp',
    scope: '@testapp',
    description: 'Test application',
    backendPort: '4000',
    frontendPort: '5173',
    httpsPort: '8443',
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
    blueGreen: false,
};

describe('buildTemplateVars', () => {
    it('builds correct template vars from minimal answers', () => {
        const vars = buildTemplateVars(MINIMAL_ANSWERS);
        expect(vars.PROJECT_NAME).toBe('TestApp');
        expect(vars.PROJECT_NAME_LOWER).toBe('testapp');
        expect(vars.PACKAGE_SCOPE).toBe('@testapp');
        expect(vars.BACKEND_PORT).toBe('4000');
        expect(vars.FRONTEND_PORT).toBe('5173');
        expect(vars.HTTPS_PORT).toBe('8443');
        expect(vars.DB_NAME).toBe('testapp');
    });

    it('derives PROJECT_NAME_LOWER correctly', () => {
        const answers = { ...MINIMAL_ANSWERS, name: 'My Cool App' };
        const vars = buildTemplateVars(answers);
        expect(vars.PROJECT_NAME_LOWER).toBe('mycoolapp');
    });

    it('has empty partials when features are disabled', () => {
        const vars = buildTemplateVars(MINIMAL_ANSWERS);
        expect(vars.WEBAPI_DEPS_PARTIAL).toBe('');
        expect(vars.WEBAPI_PLUGIN_IMPORTS).toBe('');
        expect(vars.WEBAPI_PLUGIN_REGISTRATIONS).toBe('');
        expect(vars.DOCKER_MAILPIT_PARTIAL).toBe('');
    });

    it('includes OIDC partial when enabled', () => {
        const answers = { ...MINIMAL_ANSWERS, oidc: true };
        const vars = buildTemplateVars(answers);
        expect(vars.WEBAPI_PLUGIN_IMPORTS).toContain('oidcAuthPlugin');
        expect(vars.WEBAPI_PLUGIN_REGISTRATIONS).toContain('oidcAuthPlugin');
        expect(vars.WEBAPI_DEPS_PARTIAL).toContain('jose');
    });

    it('includes mailer partial and docker mailpit when enabled', () => {
        const answers = { ...MINIMAL_ANSWERS, mailer: true };
        const vars = buildTemplateVars(answers);
        expect(vars.WEBAPI_PLUGIN_IMPORTS).toContain('smtpMailPlugin');
        expect(vars.DOCKER_MAILPIT_PARTIAL).toContain('mailpit');
        expect(vars.WEBAPI_DEPS_PARTIAL).toContain('nodemailer');
    });

    it('includes i18n partial when enabled', () => {
        const answers = { ...MINIMAL_ANSWERS, i18n: true };
        const vars = buildTemplateVars(answers);
        expect(vars.WEBAPI_PLUGIN_IMPORTS).toContain('createI18nPlugin');
        expect(vars.WEBAPI_PLUGIN_REGISTRATIONS).toContain('createI18nPlugin');
    });
});

describe('buildFileList', () => {
    it('always includes codegen package', () => {
        const files = buildFileList(MINIMAL_ANSWERS);
        const codegenFiles = files.filter((f) => f.destPath.startsWith('packages/codegen/'));
        expect(codegenFiles.length).toBeGreaterThan(0);
    });

    it('includes core packages in minimal config', () => {
        const files = buildFileList(MINIMAL_ANSWERS);
        const paths = files.map((f) => f.destPath);
        expect(paths).toContain('package.json');
        expect(paths).toContain('turbo.json');
        expect(paths).toContain('packages/shared/package.json');
        expect(paths).toContain('packages/webapi/package.json');
        expect(paths).toContain('packages/webclient/package.json');
    });

    it('includes OIDC plugin file when enabled', () => {
        const answers = { ...MINIMAL_ANSWERS, oidc: true };
        const files = buildFileList(answers);
        const paths = files.map((f) => f.destPath);
        expect(paths).toContain('packages/webapi/src/plugins/oidc-auth-plugin.ts');
    });

    it('excludes OIDC plugin file when disabled', () => {
        const files = buildFileList(MINIMAL_ANSWERS);
        const paths = files.map((f) => f.destPath);
        expect(paths).not.toContain('packages/webapi/src/plugins/oidc-auth-plugin.ts');
    });

    it('includes i18n resource dir when enabled', () => {
        const answers = { ...MINIMAL_ANSWERS, i18n: true };
        const files = buildFileList(answers);
        const paths = files.map((f) => f.destPath);
        expect(paths).toContain('packages/webapi/resources/i18n/.gitkeep');
    });

    it('marks deploy-package.sh as executable', () => {
        const files = buildFileList(MINIMAL_ANSWERS);
        const deploy = files.find((f) => f.destPath === 'deploy-package.sh');
        expect(deploy?.executable).toBe(true);
    });

    it('always includes nginx proxy files', () => {
        const files = buildFileList(MINIMAL_ANSWERS);
        const paths = files.map((f) => f.destPath);
        expect(paths).toContain('packages/webapi/docker/nginx/nginx.conf');
        expect(paths).toContain('packages/webapi/docker/nginx/generate-certs.sh');
    });

    it('marks generate-certs.sh as executable', () => {
        const files = buildFileList(MINIMAL_ANSWERS);
        const certs = files.find((f) => f.destPath === 'packages/webapi/docker/nginx/generate-certs.sh');
        expect(certs?.executable).toBe(true);
    });
});
