import { ID } from '@gauzy/contracts';
import { TenantOrganizationBaseDTO } from '@gauzy/core';
/**
 * Create payload for `POST /api/plugins/docs/categories`.
 * Names are unique per organization (case-insensitive); the slug is auto-derived when absent.
 */
export declare class CreateDocumentCategoryDTO extends TenantOrganizationBaseDTO {
    readonly name: string;
    readonly slug?: string;
    readonly color?: string;
    readonly icon?: string;
    readonly description?: string;
}
declare const UpdateDocumentCategoryDTO_base: import("@nestjs/common").Type<Partial<CreateDocumentCategoryDTO>>;
/**
 * Update payload for `PUT /api/plugins/docs/categories/:id`.
 * `isSystem` rows: rename allowed, `slug` immutable (service-enforced).
 */
export declare class UpdateDocumentCategoryDTO extends UpdateDocumentCategoryDTO_base {
}
/**
 * Payload for `POST /api/plugins/docs/categories/:id/merge` — re-points all document
 * assignments to `targetId` (deduplicated), then soft-deletes the source.
 */
export declare class MergeDocumentCategoryDTO {
    readonly targetId: ID;
}
export {};
