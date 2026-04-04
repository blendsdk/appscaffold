import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { TemplateVars } from './types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** Resolve the scaffold root directory (where templates/ and partials/ live) */
function scaffoldRoot(): string {
    // When bundled: scaffold/scaffold.js → scaffold/
    // When running from src/: src/renderer.ts → project root → scaffold/
    const bundledPath = path.join(path.dirname(__filename), 'templates');
    if (fs.existsSync(bundledPath)) {
        return path.dirname(__filename);
    }
    return path.join(__dirname, '..', 'scaffold');
}

/** Replace {{KEY}} placeholders in template with corresponding values from vars */
export function render(template: string, vars: TemplateVars): string {
    return template.replace(/\{\{([A-Z_][A-Z0-9_]*)\}\}/g, (match, key: string) => {
        return key in vars ? vars[key] : match;
    });
}

/** Read a template file from the templates directory */
export function readTemplate(relativePath: string): string {
    const fullPath = path.join(scaffoldRoot(), 'templates', relativePath);
    if (!fs.existsSync(fullPath)) {
        throw new Error(`Template not found: ${relativePath} (looked in ${fullPath})`);
    }
    return fs.readFileSync(fullPath, 'utf-8');
}

/** Read a partial file from the partials directory */
export function readPartial(filename: string): string {
    const fullPath = path.join(scaffoldRoot(), 'partials', filename);
    if (!fs.existsSync(fullPath)) {
        throw new Error(`Partial not found: ${filename} (looked in ${fullPath})`);
    }
    return fs.readFileSync(fullPath, 'utf-8');
}
