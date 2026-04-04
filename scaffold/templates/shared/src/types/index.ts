/**
 * Shared type definitions for {{PROJECT_NAME}}.
 * Types in this package are shared between webapi, webclient, and codegen.
 *
 * Generated types (from codegen) will be added here as the project grows.
 */

/** Base entity interface — all database entities extend this */
export interface BaseEntity {
    id: number;
    created_at: string;
    updated_at: string;
}
