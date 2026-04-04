import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import { writeFile, ensureDir } from '../writer.js';

let tmpDir: string;

beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'scaffold-writer-test-'));
});

afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe('ensureDir', () => {
    it('creates a directory recursively', () => {
        const dir = path.join(tmpDir, 'a', 'b', 'c');
        ensureDir(dir);
        expect(fs.existsSync(dir)).toBe(true);
    });

    it('does not throw if directory already exists', () => {
        ensureDir(tmpDir);
        expect(fs.existsSync(tmpDir)).toBe(true);
    });
});

describe('writeFile', () => {
    it('creates a new file successfully', () => {
        const dest = path.join(tmpDir, 'test.txt');
        const result = writeFile(dest, 'hello');
        expect(result.status).toBe('created');
        expect(fs.readFileSync(dest, 'utf-8')).toBe('hello');
    });

    it('creates parent directories', () => {
        const dest = path.join(tmpDir, 'nested', 'dir', 'test.txt');
        const result = writeFile(dest, 'content');
        expect(result.status).toBe('created');
        expect(fs.existsSync(dest)).toBe(true);
    });

    it('skips existing file without force', () => {
        const dest = path.join(tmpDir, 'existing.txt');
        fs.writeFileSync(dest, 'original');
        const result = writeFile(dest, 'new content');
        expect(result.status).toBe('skipped');
        expect(fs.readFileSync(dest, 'utf-8')).toBe('original');
    });

    it('overwrites existing file with force', () => {
        const dest = path.join(tmpDir, 'existing.txt');
        fs.writeFileSync(dest, 'original');
        const result = writeFile(dest, 'new content', false, { force: true });
        expect(result.status).toBe('overwritten');
        expect(fs.readFileSync(dest, 'utf-8')).toBe('new content');
    });

    it('dry-run mode never writes', () => {
        const dest = path.join(tmpDir, 'dryrun.txt');
        const result = writeFile(dest, 'content', false, { dryRun: true });
        expect(result.status).toBe('dry-run');
        expect(fs.existsSync(dest)).toBe(false);
    });

    it('sets executable permission on shell scripts', () => {
        const dest = path.join(tmpDir, 'script.sh');
        writeFile(dest, '#!/bin/bash\necho hi', true);
        const stats = fs.statSync(dest);
        // Check that owner has execute permission
        expect(stats.mode & 0o100).toBeTruthy();
    });
});
