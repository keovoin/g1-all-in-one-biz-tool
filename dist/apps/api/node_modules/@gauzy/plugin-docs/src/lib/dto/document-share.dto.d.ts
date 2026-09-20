import { DocumentShareAccessEnum, ID } from '@gauzy/contracts';
/**
 * Body of `POST /api/plugins/docs/documents/:id/shares` (03 §4.12).
 *
 * Exactly one of `employeeId` / `teamId` must be present — both or neither is a 400
 * `DOCS_SHARE_TARGET`. The XOR itself is enforced in the service (and by the
 * `CHK_document_share_target_xor` CHECK constraint) because class-validator cannot express
 * "exactly one of" without a custom validator.
 */
export declare class CreateDocumentShareDTO {
    /** Employee grantee (XOR with `teamId`). */
    readonly employeeId?: ID;
    /** Team grantee (XOR with `employeeId`); membership resolves at query time. */
    readonly teamId?: ID;
    /** Granted access level. */
    readonly access: DocumentShareAccessEnum;
}
/**
 * Body of `PUT /api/plugins/docs/documents/:id/shares/:shareId` — the access level is the
 * only mutable field; re-targeting a share means deleting it and creating a new one.
 */
export declare class UpdateDocumentShareDTO {
    /** The new access level. */
    readonly access: DocumentShareAccessEnum;
}
