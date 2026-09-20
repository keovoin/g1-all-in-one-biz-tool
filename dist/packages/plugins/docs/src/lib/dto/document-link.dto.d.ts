import { BaseEntityEnum, ID, IDocumentLinkCreateInput, JsonData } from '@gauzy/contracts';
import { TenantOrganizationBaseDTO } from '@gauzy/core';
/**
 * Create payload for `POST /api/plugins/docs/links` — idempotent on
 * `(documentId, entity, entityId)`; a duplicate returns the existing row with 200.
 */
export declare class CreateDocumentLinkDTO extends TenantOrganizationBaseDTO implements IDocumentLinkCreateInput {
    readonly documentId: ID;
    readonly entity: BaseEntityEnum;
    readonly entityId: ID;
    /** Display label captured at link time (`{ label?, linkedBy? }`). */
    readonly metadata?: JsonData;
}
declare const GetDocumentLinksQueryDTO_base: import("@nestjs/common").Type<Partial<TenantOrganizationBaseDTO>>;
/**
 * Query params for `GET /api/plugins/docs/links` — the "Documents panel" reverse lookup.
 *
 * Extends a partial `TenantOrganizationBaseDTO` so `organizationId` carries the same
 * `@IsOrganizationBelongsToUser()` ownership check as the sibling write DTO: a caller can never
 * name an organization they do not belong to. It stays **optional** — the service falls back to
 * the requester's current organization when it is omitted.
 */
export declare class GetDocumentLinksQueryDTO extends GetDocumentLinksQueryDTO_base {
    readonly entity: BaseEntityEnum;
    readonly entityId: ID;
}
export {};
