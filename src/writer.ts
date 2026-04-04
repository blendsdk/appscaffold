import * as fs from 'node:fs';
import * as path from 'node:path';
import type { FileResult } from './types.js';

interface WriteOptions {
    force?: boolean;
    dryRun?: boolean;
}

/** Create directory recursively if it doesn't exist */
export function ensureDir(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

/** Write a single file with conflict detection, force, and dry-run support */
export function writeFile(
    destPath: string,
    content: string,
    executable?: boolean,
    options?: WriteOptions,
): FileResult {
    const { force = false, dryRun = false } = options ?? {};

    if (dryRun) {
        return { dest: destPath, status: 'dry-run' };
    }

    const exists = fs.existsSync(destPath);

    if (exists && !force) {
        return { dest: destPath, status: 'skipped' };
    }

    ensureDir(path.dirname(destPath));
    fs.writeFileSync(destPath, content, 'utf-8');

    if (executable) {
        fs.chmodSync(destPath, 0o755);
    }

    return { dest: destPath, status: exists ? 'overwritten' : 'created' };
}
