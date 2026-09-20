import { DocumentVisibilityEnum } from '@gauzy/contracts';
import { TenantOrganizationBaseDTO } from '@gauzy/core';
import { IDocumentQuotaState } from '../services/quota.calculator';
declare const DocumentSettingsQueryDTO_base: import("@nestjs/common").Type<Partial<TenantOrganizationBaseDTO>>;
/**
 * Query params of `GET`/`PUT /api/plugins/docs/settings`.
 *
 * `organizationId` used to be a raw `@Query()` string, which let any `DOCS_READ` holder name an
 * organization they do not belong to and read its settings. Extending a partial
 * `TenantOrganizationBaseDTO` reuses the platform's `@IsOrganizationBelongsToUser()` ownership
 * check; when omitted, the controller falls back to the requester's current organization.
 */
export declare class DocumentSettingsQueryDTO extends DocumentSettingsQueryDTO_base {
}
/**
 * Org-defaults block accepted by `PUT /api/plugins/docs/settings` (partial update).
 * The read-only `capabilities` and `quota` blocks of the GET response are never writable
 * (`quotaBytes` below is the ONE writable quota field — the usage numbers are computed).
 */
export declare class DocumentSettingsDTO {
    /** Default for the upload form's "Import to AI knowledge" toggle. */
    readonly importToKnowledgeDefault?: boolean;
    /** Default visibility for newly created documents. */
    readonly defaultVisibility?: DocumentVisibilityEnum;
    /** Whether the pipeline auto-classifies uploads (categories/summary). */
    readonly autoClassify?: boolean;
    /**
     * Per-organization storage quota in bytes; `0` = unlimited (08 §5.7). Overrides the
     * deployment default `GAUZY_DOCS_ORG_QUOTA_BYTES`.
     */
    readonly quotaBytes?: number;
}
/**
 * The org-defaults block of the settings payloads.
 */
export interface IDocumentSettingsDefaults {
    importToKnowledgeDefault: boolean;
    defaultVisibility: DocumentVisibilityEnum;
    autoClassify: boolean;
    /** Effective organization storage quota in bytes; `0` = unlimited. */
    quotaBytes: number;
}
/**
 * Read-only deployment capabilities reported by `GET /api/plugins/docs/settings`.
 */
export interface IDocumentSettingsCapabilities {
    aiEnabled: boolean;
    vectorSearch: boolean;
    embeddingModel: string;
    maxFileSize: number;
    acceptedTypes: string[];
    /** Whether the inbound-email capture webhook is enabled in this deployment (07 §17.2). */
    inboundEmailEnabled: boolean;
}
/**
 * Full `GET /api/plugins/docs/settings` response shape.
 */
export interface IDocumentSettings {
    defaults: IDocumentSettingsDefaults;
    capabilities: IDocumentSettingsCapabilities;
    /** Live storage-quota state (quota, usage, remaining) — read-only, never writable. */
    quota: IDocumentQuotaState;
}
export {};
