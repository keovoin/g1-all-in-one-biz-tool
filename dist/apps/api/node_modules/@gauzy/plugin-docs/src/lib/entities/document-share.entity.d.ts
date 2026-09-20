import { DocumentShareAccessEnum, ID, IDocument, IDocumentShare, IEmployee, IOrganizationTeam } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '@gauzy/core';
export declare class DocumentShare extends TenantOrganizationBaseEntity implements IDocumentShare {
    /**
     * Access level granted: `VIEW` | `COMMENT` | `EDIT`.
     */
    access: DocumentShareAccessEnum;
    /**
     * The shared (PRIVATE) document.
     */
    document?: IDocument;
    /**
     * The UUID of the shared document.
     */
    documentId: ID;
    /**
     * Employee grantee — exactly one of `employeeId` / `teamId` is set per row (XOR, enforced by
     * the `CHK_document_share_target_xor` CHECK constraint and by DTO validation).
     */
    employee?: IEmployee;
    /**
     * The UUID of the grantee Employee.
     */
    employeeId?: ID;
    /**
     * Team grantee — the other half of the XOR pair.
     */
    team?: IOrganizationTeam;
    /**
     * The UUID of the grantee team.
     */
    teamId?: ID;
}
