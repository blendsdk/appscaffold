import * as readline from 'node:readline';
import * as path from 'node:path';
import type { ScaffoldAnswers, ScaffoldFlags } from './types.js';
import { DEFAULTS } from './types.js';

/** Create a readline interface for interactive prompts */
export function createRL(): readline.Interface {
    return readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
}

/** Ask a text question with optional default value */
export function ask(rl: readline.Interface, question: string, defaultValue?: string): Promise<string> {
    const suffix = defaultValue ? ` [${defaultValue}]` : '';
    return new Promise((resolve) => {
        rl.question(`  ${question}${suffix}: `, (answer) => {
            resolve(answer.trim() || defaultValue || '');
        });
    });
}

/** Ask a yes/no confirmation question */
export function confirm(rl: readline.Interface, question: string, defaultYes = true): Promise<boolean> {
    const hint = defaultYes ? '[Y/n]' : '[y/N]';
    return new Promise((resolve) => {
        rl.question(`  ${question} ${hint}: `, (answer) => {
            const val = answer.trim().toLowerCase();
            if (val === '') {
                resolve(defaultYes);
            } else {
                resolve(val === 'y' || val === 'yes');
            }
        });
    });
}

/** Run the full interactive prompt flow and return answers */
export async function runInteractivePrompts(): Promise<ScaffoldAnswers> {
    const rl = createRL();
    const dirName = path.basename(process.cwd());

    try {
        console.log('');
        console.log('── Project Configuration ─────────────────────');
        const name = await ask(rl, 'Project name', dirName);
        const scopeDefault = `@${name.toLowerCase().replace(/[^a-z0-9-]/g, '')}`;
        const scope = await ask(rl, 'Package scope', scopeDefault);
        const description = await ask(rl, 'Description', '');

        console.log('');
        console.log('── Backend Configuration ─────────────────────');
        const backendPort = await ask(rl, 'Backend port', DEFAULTS.backendPort);
        const dbNameDefault = name.toLowerCase().replace(/[^a-z0-9_]/g, '');
        const dbName = await ask(rl, 'Database name', dbNameDefault);
        const dbPort = await ask(rl, 'Database host port', DEFAULTS.dbPort);
        const redisPort = await ask(rl, 'Redis host port', DEFAULTS.redisPort);

        console.log('');
        console.log('── Frontend Configuration ────────────────────');
        const frontendPort = await ask(rl, 'Frontend dev port', DEFAULTS.frontendPort);

        console.log('');
        console.log('── Features ──────────────────────────────────');
        const oidc = await confirm(rl, 'Include OIDC authentication?', true);
        const i18n = await confirm(rl, 'Include i18n (internationalization)?', true);
        const mailer = await confirm(rl, 'Include email service (mailer)?', false);
        const fileUpload = await confirm(rl, 'Include file upload support?', false);

        console.log('');
        console.log('── Deployment ────────────────────────────────');
        const blueGreen = await confirm(rl, 'Install blue-green deployment scaffold?', true);

        console.log('');

        return {
            name,
            scope,
            description,
            backendPort,
            frontendPort,
            dbName,
            dbPort,
            redisPort,
            oidc,
            i18n,
            mailer,
            fileUpload,
            blueGreen,
        };
    } finally {
        rl.close();
    }
}

/** Build ScaffoldAnswers from CLI flags (non-interactive mode) */
export function answersFromFlags(flags: ScaffoldFlags): ScaffoldAnswers {
    const name = flags.name ?? path.basename(process.cwd());
    const scopeDefault = `@${name.toLowerCase().replace(/[^a-z0-9-]/g, '')}`;

    return {
        name,
        scope: flags.scope ?? scopeDefault,
        description: flags.description ?? '',
        backendPort: flags.port ?? DEFAULTS.backendPort,
        frontendPort: flags.frontendPort ?? DEFAULTS.frontendPort,
        dbName: flags.dbName ?? name.toLowerCase().replace(/[^a-z0-9_]/g, ''),
        dbPort: flags.dbPort ?? DEFAULTS.dbPort,
        redisPort: flags.redisPort ?? DEFAULTS.redisPort,
        oidc: flags.oidc ?? true,
        i18n: flags.i18n ?? true,
        mailer: flags.mailer ?? false,
        fileUpload: flags.fileUpload ?? false,
        blueGreen: flags.blueGreen ?? true,
    };
}
