import * as path from 'node:path';
import * as fs from 'node:fs';
import { execSync } from 'node:child_process';
import type { ScaffoldFlags, FileResult } from './types.js';
import { runInteractivePrompts, answersFromFlags } from './prompts.js';
import { generateAllFiles } from './generator.js';

const HELP_TEXT = `
BlendSDK App Scaffold Generator

Usage:
  scaffold [options]

Options:
  --name <name>           Project name (enables non-interactive mode)
  --scope <scope>         Package scope (default: @<lowercase-name>)
  --description <desc>    Project description
  --port <port>           Backend port (default: 4000)
  --frontend-port <port>  Frontend dev port (default: 5173)
  --https-port <port>     HTTPS proxy port (default: 8443)
  --db-name <name>        Database name (default: <lowercase-name>)
  --db-port <port>        Database host port (default: 5432)
  --redis-port <port>     Redis host port (default: 6379)
  --oidc                  Include OIDC authentication (default: true)
  --no-oidc               Exclude OIDC authentication
  --i18n                  Include i18n support (default: true)
  --no-i18n               Exclude i18n support
  --mailer                Include email service (default: true)
  --no-mailer             Exclude email service
  --file-upload           Include file upload support
  --no-file-upload        Exclude file upload (default)
  --blue-green            Install blue-green deployment (default: true)
  --no-blue-green         Skip blue-green deployment
  --force                 Overwrite existing files
  --dry-run               Preview without writing files
  --help                  Show this help message

Examples:
  # Interactive mode
  scaffold

  # Non-interactive mode
  scaffold --name CastingAppST --scope @castingappst --port 4000

  # Via install.sh
  curl -fsSL https://raw.githubusercontent.com/blendsdk/appscaffold/master/install.sh | bash
`;

/** Parse CLI arguments into ScaffoldFlags */
function parseArgs(args: string[]): ScaffoldFlags {
    const flags: ScaffoldFlags = {};

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        switch (arg) {
            case '--name':
                flags.name = args[++i];
                break;
            case '--scope':
                flags.scope = args[++i];
                break;
            case '--description':
                flags.description = args[++i];
                break;
            case '--port':
                flags.port = args[++i];
                break;
            case '--frontend-port':
                flags.frontendPort = args[++i];
                break;
            case '--https-port':
                flags.httpsPort = args[++i];
                break;
            case '--db-name':
                flags.dbName = args[++i];
                break;
            case '--db-port':
                flags.dbPort = args[++i];
                break;
            case '--redis-port':
                flags.redisPort = args[++i];
                break;
            case '--oidc':
                flags.oidc = true;
                break;
            case '--no-oidc':
                flags.oidc = false;
                break;
            case '--i18n':
                flags.i18n = true;
                break;
            case '--no-i18n':
                flags.i18n = false;
                break;
            case '--mailer':
                flags.mailer = true;
                break;
            case '--no-mailer':
                flags.mailer = false;
                break;
            case '--file-upload':
                flags.fileUpload = true;
                break;
            case '--no-file-upload':
                flags.fileUpload = false;
                break;
            case '--blue-green':
                flags.blueGreen = true;
                break;
            case '--no-blue-green':
                flags.blueGreen = false;
                break;
            case '--force':
                flags.force = true;
                break;
            case '--dry-run':
                flags.dryRun = true;
                break;
            case '--help':
            case '-h':
                flags.help = true;
                break;
        }
    }

    return flags;
}

/** Print generation summary */
function printSummary(results: FileResult[]): void {
    const created = results.filter((r) => r.status === 'created').length;
    const overwritten = results.filter((r) => r.status === 'overwritten').length;
    const skipped = results.filter((r) => r.status === 'skipped').length;
    const dryRun = results.filter((r) => r.status === 'dry-run').length;

    console.log('');
    console.log('── Summary ───────────────────────────────────');
    console.log(`  ✅ Created:     ${created}`);
    if (overwritten > 0) console.log(`  ♻️  Overwritten: ${overwritten}`);
    if (skipped > 0) console.log(`  ⏭️  Skipped:     ${skipped}`);
    if (dryRun > 0) console.log(`  🔍 Dry-run:     ${dryRun}`);
    console.log(`  📁 Total:       ${results.length}`);
    console.log('');
}

/** Main entry point */
async function main(): Promise<void> {
    const args = process.argv.slice(2);
    const flags = parseArgs(args);

    if (flags.help) {
        console.log(HELP_TEXT);
        process.exit(0);
    }

    console.log('');
    console.log('🚀 BlendSDK App Scaffold Generator');
    console.log('───────────────────────────────────────────────');

    // Determine interactive vs non-interactive mode
    const answers = flags.name ? answersFromFlags(flags) : await runInteractivePrompts();

    // Create a project subfolder based on the project name
    const projectDir = answers.name.toLowerCase().replace(/[^a-z0-9-]/g, '');
    const outputDir = path.join(process.cwd(), projectDir);

    if (!flags.dryRun) {
        if (fs.existsSync(outputDir) && fs.readdirSync(outputDir).length > 0 && !flags.force) {
            console.log('');
            console.log(`  ❌ Directory '${projectDir}' already exists and is not empty.`);
            console.log('     Use --force to overwrite, or choose a different name.');
            process.exit(1);
        }
        fs.mkdirSync(outputDir, { recursive: true });
    }

    console.log('');
    console.log(`📁 Generating project in ./${projectDir}/...`);

    const results = generateAllFiles(answers, {
        outputDir,
        force: flags.force,
        dryRun: flags.dryRun,
    });

    printSummary(results);

    if (!flags.dryRun) {
        const hostname = `dev.${answers.name.toLowerCase().replace(/[^a-z0-9-]/g, '')}.local`;
        console.log('── Next Steps ────────────────────────────────');
        console.log(`  0. cd ${projectDir}`);
        console.log('  1. yarn install && yarn ncu');
        console.log('  2. yarn docker:setup    (certs + /etc/hosts + Docker check)');
        console.log('  3. yarn docker:dev      (start PostgreSQL + Redis + HTTPS proxy)');
        console.log('  4. yarn dev             (start all dev servers)');
        console.log(`  5. Open https://${hostname}:${answers.httpsPort}`);
        console.log('');
        console.log('  💡 Install mkcert before step 2 for browser-trusted certificates:');
        console.log('     brew install mkcert (macOS) | apt install mkcert (Linux)');
        console.log('');
    }

    // Blue-green deployment (post-scaffold step)
    if (answers.blueGreen && !flags.dryRun) {
        console.log('── Blue-Green Deployment ──────────────────────');
        console.log('  Installing blue-green deployment scaffold...');
        console.log('');
        try {
            execSync(
                'curl -fsSL https://raw.githubusercontent.com/blendsdk/blue-green/master/install.sh | bash',
                { cwd: outputDir, stdio: 'inherit' },
            );
        } catch {
            console.log('');
            console.log('  ⚠️  Blue-green installation failed. You can install it later:');
            console.log(
                '     curl -fsSL https://raw.githubusercontent.com/blendsdk/blue-green/master/install.sh | bash',
            );
            console.log('');
        }
    }
}

main().catch((err) => {
    console.error('❌ Scaffold generation failed:', err.message);
    process.exit(1);
});
