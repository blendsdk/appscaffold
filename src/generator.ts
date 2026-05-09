import * as path from 'node:path';
import type { ScaffoldAnswers, TemplateVars, FileEntry, FileResult, GenerateOptions } from './types.js';
import { render, readTemplate, readPartial } from './renderer.js';
import { writeFile } from './writer.js';

/** Build template variables map from user answers */
export function buildTemplateVars(answers: ScaffoldAnswers): TemplateVars {
    const vars: TemplateVars = {
        PROJECT_NAME: answers.name,
        PROJECT_NAME_LOWER: answers.name.toLowerCase().replace(/[^a-z0-9-]/g, ''),
        PACKAGE_SCOPE: answers.scope,
        DESCRIPTION: answers.description,
        BACKEND_PORT: answers.backendPort,
        FRONTEND_PORT: answers.frontendPort,
        HTTPS_PORT: answers.httpsPort,
        DB_NAME: answers.dbName,
        DB_PORT: answers.dbPort,
        REDIS_PORT: answers.redisPort,
    };

    // Conditional partials — deps
    vars.WEBAPI_DEPS_PARTIAL = '';
    if (answers.oidc) {
        vars.WEBAPI_DEPS_PARTIAL += readPartial('deps-oidc.txt');
    }
    if (answers.mailer) {
        vars.WEBAPI_DEPS_PARTIAL += readPartial('deps-mailer.txt');
    }

    // Conditional partials — plugin imports
    vars.WEBAPI_PLUGIN_IMPORTS = '';
    if (answers.oidc) {
        vars.WEBAPI_PLUGIN_IMPORTS += readPartial('oidc-plugin-import.txt');
    }
    if (answers.i18n) {
        vars.WEBAPI_PLUGIN_IMPORTS += readPartial('i18n-plugin-import.txt');
    }
    if (answers.mailer) {
        vars.WEBAPI_PLUGIN_IMPORTS += readPartial('mailer-plugin-import.txt');
    }

    // Conditional partials — plugin registrations
    vars.WEBAPI_PLUGIN_REGISTRATIONS = '';
    if (answers.oidc) {
        vars.WEBAPI_PLUGIN_REGISTRATIONS += readPartial('oidc-plugin-registration.txt');
    }
    if (answers.i18n) {
        vars.WEBAPI_PLUGIN_REGISTRATIONS += readPartial('i18n-plugin-registration.txt');
    }
    if (answers.mailer) {
        vars.WEBAPI_PLUGIN_REGISTRATIONS += readPartial('mailer-plugin-registration.txt');
    }

    // Conditional Docker services
    vars.DOCKER_MAILPIT_PARTIAL = '';
    if (answers.mailer) {
        vars.DOCKER_MAILPIT_PARTIAL = readPartial('docker-mailpit.txt');
    }

    // Conditional webapi devDeps
    vars.WEBAPI_DEVDEPS_PARTIAL = '';
    if (answers.mailer) {
        vars.WEBAPI_DEVDEPS_PARTIAL += readPartial('devdeps-mailer.txt');
    }

    return vars;
}

/** Build the list of files to generate based on user answers */
export function buildFileList(answers: ScaffoldAnswers): FileEntry[] {
    const files: FileEntry[] = [
        // Root files
        { templatePath: 'root/package.json', destPath: 'package.json' },
        { templatePath: 'root/turbo.json', destPath: 'turbo.json' },
        { templatePath: 'root/tsconfig.base.json', destPath: 'tsconfig.base.json' },
        { templatePath: 'root/.nvmrc', destPath: '.nvmrc' },
        { templatePath: 'root/.editorconfig', destPath: '.editorconfig' },
        { templatePath: 'root/.prettierrc', destPath: '.prettierrc' },
        { templatePath: 'root/.gitignore', destPath: '.gitignore' },
        { templatePath: 'root/README.md', destPath: 'README.md' },
        { templatePath: 'root/deploy-package.sh', destPath: 'deploy-package.sh', executable: true },

        // Shared package
        { templatePath: 'shared/package.json', destPath: 'packages/shared/package.json' },
        { templatePath: 'shared/tsconfig.json', destPath: 'packages/shared/tsconfig.json' },
        { templatePath: 'shared/.gitignore', destPath: 'packages/shared/.gitignore' },
        { templatePath: 'shared/src/index.ts', destPath: 'packages/shared/src/index.ts' },
        { templatePath: 'shared/src/types/index.ts', destPath: 'packages/shared/src/types/index.ts' },

        // Codegen package (always included)
        { templatePath: 'codegen/package.json', destPath: 'packages/codegen/package.json' },
        { templatePath: 'codegen/tsconfig.json', destPath: 'packages/codegen/tsconfig.json' },
        { templatePath: 'codegen/.gitignore', destPath: 'packages/codegen/.gitignore' },
        { templatePath: 'codegen/src/index.ts', destPath: 'packages/codegen/src/index.ts' },

        // WebAPI package
        { templatePath: 'webapi/package.json', destPath: 'packages/webapi/package.json' },
        { templatePath: 'webapi/tsconfig.json', destPath: 'packages/webapi/tsconfig.json' },
        { templatePath: 'webapi/.gitignore', destPath: 'packages/webapi/.gitignore' },
        { templatePath: 'webapi/.env.js', destPath: 'packages/webapi/.env.js' },
        { templatePath: 'webapi/.env.local.js.example', destPath: 'packages/webapi/.env.local.js.example' },
        { templatePath: 'webapi/src/index.ts', destPath: 'packages/webapi/src/index.ts' },
        {
            templatePath: 'webapi/src/controllers/health-controller.ts',
            destPath: 'packages/webapi/src/controllers/health-controller.ts',
        },
        { templatePath: 'webapi/src/types/index.ts', destPath: 'packages/webapi/src/types/index.ts' },
        { templatePath: 'webapi/config/app.config.js', destPath: 'packages/webapi/config/app.config.js' },
        {
            templatePath: 'webapi/docker/docker-compose.yml',
            destPath: 'packages/webapi/docker/docker-compose.yml',
        },
        {
            templatePath: 'webapi/docker/postgres/1.database.sh',
            destPath: 'packages/webapi/docker/postgres/1.database.sh',
            executable: true,
        },

        // Nginx HTTPS development proxy
        {
            templatePath: 'webapi/docker/nginx/nginx.conf',
            destPath: 'packages/webapi/docker/nginx/nginx.conf',
        },
        {
            templatePath: 'webapi/docker/nginx/generate-certs.sh',
            destPath: 'packages/webapi/docker/nginx/generate-certs.sh',
            executable: true,
        },
        {
            templatePath: 'webapi/docker/setup-dev.sh',
            destPath: 'packages/webapi/docker/setup-dev.sh',
            executable: true,
        },

        // WebClient package
        { templatePath: 'webclient/package.json', destPath: 'packages/webclient/package.json' },
        { templatePath: 'webclient/tsconfig.json', destPath: 'packages/webclient/tsconfig.json' },
        { templatePath: 'webclient/tsconfig.node.json', destPath: 'packages/webclient/tsconfig.node.json' },
        { templatePath: 'webclient/vite.config.ts', destPath: 'packages/webclient/vite.config.ts' },
        { templatePath: 'webclient/index.html', destPath: 'packages/webclient/index.html' },
        { templatePath: 'webclient/.gitignore', destPath: 'packages/webclient/.gitignore' },
        { templatePath: 'webclient/src/main.tsx', destPath: 'packages/webclient/src/main.tsx' },
        { templatePath: 'webclient/src/App.tsx', destPath: 'packages/webclient/src/App.tsx' },
        { templatePath: 'webclient/src/vite-env.d.ts', destPath: 'packages/webclient/src/vite-env.d.ts' },
        {
            templatePath: 'webclient/src/components/Layout/Layout.tsx',
            destPath: 'packages/webclient/src/components/Layout/Layout.tsx',
        },
        { templatePath: 'webclient/src/pages/Home.tsx', destPath: 'packages/webclient/src/pages/Home.tsx' },
        { templatePath: 'webclient/src/theme/index.ts', destPath: 'packages/webclient/src/theme/index.ts' },
        { templatePath: 'webclient/src/styles/global.css', destPath: 'packages/webclient/src/styles/global.css' },
        { templatePath: 'webclient/src/api/index.ts', destPath: 'packages/webclient/src/api/index.ts' },
        { templatePath: 'webclient/src/system/index.ts', destPath: 'packages/webclient/src/system/index.ts' },
        {
            templatePath: 'webclient/src/system/routing/routes.ts',
            destPath: 'packages/webclient/src/system/routing/routes.ts',
        },
        { templatePath: 'webclient/public/favicon.svg', destPath: 'packages/webclient/public/favicon.svg' },
        { templatePath: 'webclient/public/robots.txt', destPath: 'packages/webclient/public/robots.txt' },
    ];

    // Conditional: OIDC auth plugin source file
    if (answers.oidc) {
        files.push({
            templatePath: 'webapi/src/plugins/oidc-auth-plugin.ts',
            destPath: 'packages/webapi/src/plugins/oidc-auth-plugin.ts',
        });
    }

    // Gitkeep files for empty directories
    const gitkeepDirs = [
        'packages/webapi/src/plugins',
        'packages/webapi/src/services',
        'packages/webapi/src/dataservices',
        'packages/webapi/src/modules/api',
        'packages/webapi/src/utils',
        'packages/webapi/resources/database',
        'packages/webapi/resources/public',
        'packages/codegen/resources/database',
    ];

    if (answers.i18n) {
        gitkeepDirs.push('packages/webapi/resources/i18n');
    }

    for (const dir of gitkeepDirs) {
        files.push({
            templatePath: '__gitkeep__',
            destPath: `${dir}/.gitkeep`,
        });
    }

    return files;
}

/** Orchestrate full file generation */
export function generateAllFiles(answers: ScaffoldAnswers, options: GenerateOptions): FileResult[] {
    const vars = buildTemplateVars(answers);
    const fileList = buildFileList(answers);
    const results: FileResult[] = [];

    for (const entry of fileList) {
        const destPath = path.join(options.outputDir, entry.destPath);

        // Special case: .gitkeep files have no template
        let content: string;
        if (entry.templatePath === '__gitkeep__') {
            content = '';
        } else {
            const template = readTemplate(entry.templatePath);
            // Render twice: first pass injects partials, second pass resolves
            // placeholders within those partials (e.g. {{BACKEND_PORT}} inside
            // an OIDC partial that was injected via {{WEBAPI_PLUGIN_REGISTRATIONS}})
            content = render(render(template, vars), vars);
        }

        const result = writeFile(destPath, content, entry.executable, {
            force: options.force,
            dryRun: options.dryRun,
        });
        results.push(result);
    }

    return results;
}
