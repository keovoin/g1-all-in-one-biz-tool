import { ID, IDocument, IDocumentVersion, IEmployee, JsonData } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '@gauzy/core';
export declare class DocumentVersion extends TenantOrganizationBaseEntity implements IDocumentVersion {
    /**
     * Document title at capture time (titles are versioned here even though the live title
     * lives on `document.name`).
     */
    name: string;
    /**
     * Snapshot of the canonical TipTap JSON document.
     */
    contentJson?: JsonData;
    /**
     * Snapshot of the render cache.
     */
    contentHtml?: string;
    /**
     * Snapshot of the CRDT state (only when the live column was populated).
     */
    contentBinary?: Buffer;
    /**
     * Capture timestamp; history ordering key (no per-row version number — `document.version`
     * is the counter).
     */
    lastSavedAt: Date;
    /**
     * The document this snapshot belongs to.
     */
    document?: IDocument;
    /**
     * The UUID of the snapshotted document.
     */
    documentId: ID;
    /**
     * The editor whose save triggered the capture (`NULL` for system writes).
     */
    createdBy?: IEmployee;
    /**
     * The UUID of the capturing Employee.
     */
    createdById?: ID;
}
