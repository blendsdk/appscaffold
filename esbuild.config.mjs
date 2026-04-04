import { build } from 'esbuild';

await build({
    entryPoints: ['src/index.ts'],
    bundle: true,
    platform: 'node',
    target: 'node22',
    format: 'esm',
    outfile: 'scaffold/scaffold.js',
    banner: { js: '#!/usr/bin/env node' },
    minify: false, // Keep readable for debugging
});
