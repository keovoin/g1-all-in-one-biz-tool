import { DocumentInboundAddressKindEnum, ID, IDocumentInboundAddressCreateInput, IDocumentInboundAddressUpdateInput } from '@gauzy/contracts';
/** Scope for the list/read routes. */
export declare class DocumentInboundAddressQueryDTO {
    readonly organizationId?: ID;
}
/**
 * Create input.
 *
 * `PLATFORM` addresses are minted automatically on first read, so in practice this endpoint is
 * used for `CUSTOM_DOMAIN`. `domain`/`localPart` are validated properly in the service (label by
 * label) — the decorators here only bound the size of what reaches it.
 */
export declare class CreateDocumentInboundAddressDTO implements IDocumentInboundAddressCreateInput {
    readonly organizationId?: ID;
    readonly kind: DocumentInboundAddressKindEnum;
    readonly domain?: string;
    readonly localPart?: string;
    readonly senderAllowlist?: string[];
    readonly importBodyAsNote?: boolean;
}
/**
 * Update input. `kind`, `token`, `domain` and `address` are deliberately absent — they are
 * server-owned, and changing an address is a rotation rather than an edit.
 */
export declare class UpdateDocumentInboundAddressDTO implements IDocumentInboundAddressUpdateInput {
    readonly organizationId?: ID;
    readonly senderAllowlist?: string[];
    readonly importBodyAsNote?: boolean;
    readonly isActive?: boolean;
}
