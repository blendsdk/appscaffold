/** User answers from interactive prompts or CLI flags */
export interface ScaffoldAnswers {
    name: string;
    scope: string;
    description: string;
    backendPort: string;
    frontendPort: string;
    dbName: string;
    dbPort: string;
    redisPort: string;
    oidc: boolean;
    i18n: boolean;
    mailer: boolean;
    fileUpload: boolean;
    blueGreen: boolean;
}

/** CLI flags parsed from command-line arguments */
export interface ScaffoldFlags {
    name?: string;
    scope?: string;
    description?: string;
    port?: string;
    frontendPort?: string;
    dbName?: string;
    dbPort?: string;
    redisPort?: string;
    oidc?: boolean;
    i18n?: boolean;
    mailer?: boolean;
    fileUpload?: boolean;
    blueGreen?: boolean;
    force?: boolean;
    dryRun?: boolean;
    help?: boolean;
}

/** Template variables for rendering */
export interface TemplateVars {
    [key: string]: string;
}

/** File generation result */
export interface FileResult {
    dest: string;
    status: 'created' | 'overwritten' | 'skipped' | 'dry-run';
}

/** File entry for generation */
export interface FileEntry {
    templatePath: string;
    destPath: string;
    executable?: boolean;
}

/** Generation options */
export interface GenerateOptions {
    outputDir: string;
    force?: boolean;
    dryRun?: boolean;
}

/** Default values */
export const DEFAULTS = {
    backendPort: '4000',
    frontendPort: '5173',
    dbPort: '5432',
    redisPort: '6379',
} as const;
