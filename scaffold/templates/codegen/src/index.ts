import { SchemaContainer, TypeGenerator } from 'blendsdk/codegen';
import * as path from 'node:path';

/**
 * {{PROJECT_NAME}} Code Generator
 *
 * Generates:
 * - Database schema SQL
 * - TypeScript type definitions (shared package)
 * - Data service classes (webapi)
 * - API controller scaffolds (webapi)
 * - REST API client (webclient)
 * - Validation schemas (webapi)
 */

const WebApiRoot = path.join(process.cwd(), '..', 'webapi');
const WebClientRoot = path.join(process.cwd(), '..', 'webclient');
const SharedRoot = path.join(process.cwd(), '..', 'shared');
const packageScope = '{{PACKAGE_SCOPE}}';

export async function generate(): Promise<void> {
    console.log(`🔧 Running code generation for {{PROJECT_NAME}}...`);

    const container = new SchemaContainer();
    const $ = container.scope();

    // TODO: Add database schema definitions
    // TODO: Add type generation
    // TODO: Add API schema definitions
    // TODO: Add data service generation

    console.log('✅ Code generation complete');
}

// Run when executed directly
generate().catch((err) => {
    console.error('❌ Code generation failed:', err);
    process.exit(1);
});
