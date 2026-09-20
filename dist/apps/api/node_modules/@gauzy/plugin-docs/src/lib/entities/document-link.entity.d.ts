import { BaseEntityEnum, ID, IDocument, IDocumentLink, JsonData } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '@gauzy/core';
export declare class DocumentLink extends TenantOrganizationBaseEntity implements IDocumentLink {
    /**
     * The target record type — a `BaseEntityEnum` value (e.g. `'Invoice'`, `'Task'`, `'Employee'`).
     * No FK — polymorphic by design; validated against the enum.
     */
    entity: BaseEntityEnum;
    /**
     * Target record id. No FK; a deleted target leaves a dangling link that read paths tolerate.
     */
    entityId: ID;
    /**
     * Display label captured at link time (`{ label?, linkedBy? }`) so panels render without
     * cross-entity joins and survive target deletion. (De)serialized on the SQLite path by the
     * links service.
     */
    metadata?: JsonData;
    /**
     * The linked document.
     */
    document?: IDocument;
    /**
     * The UUID of the linked document.
     */
    documentId: ID;
}
