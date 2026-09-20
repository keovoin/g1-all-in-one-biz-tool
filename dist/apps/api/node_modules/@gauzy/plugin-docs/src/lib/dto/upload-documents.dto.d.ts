import { DocumentSourceEnum, DocumentVisibilityEnum, ID, IDocument } from '@gauzy/contracts';
import { TenantOrganizationBaseDTO } from '@gauzy/core';
/**
 * Form fields accompanying the files of `POST /api/plugins/docs/documents/upload`
 * (multipart text parts — arrays accepted as repeated parts or CSV).
 *
 * `source` accepts only `UPLOAD` (default), `CHAT`, and `EDITOR` from this endpoint;
 * `EMAIL`, `INTEGRATION`, `SYSTEM`, `IMPORT` are reserved for server-side ingestion
 * paths and rejected with 400 `DOCS_SOURCE_RESERVED` (enforced in the service).
 */
export declare class UploadDocumentsDTO extends TenantOrganizationBaseDTO {
    readonly parentId?: ID;
    readonly visibility?: DocumentVisibilityEnum;
    readonly categoryIds?: ID[];
    readonly tagIds?: ID[];
    /** Default = org setting `importToKnowledgeDefault`. */
    readonly importToKnowledge?: boolean;
    /**
     * Per-upload override of the org setting `autoClassify` — the "Classify with AI" toggle of
     * the classification dialog (`01-ux-spec.md` §7.2). `false` skips the `docs.classify` stage
     * for every file of this batch (extraction and, when the document is in knowledge, the
     * chunk→embed→index chain still run). Omitted = follow the organization default.
     */
    readonly classifyWithAi?: boolean;
    readonly source?: DocumentSourceEnum;
}
/**
 * One accepted file of an upload batch.
 */
export interface IDocumentUploadResult {
    document: IDocument;
    /** Set when an active document in the same tenant+organization has the same sha256. */
    duplicateOfId?: ID;
}
/**
 * One rejected file of an upload batch (its bytes are never persisted).
 */
export interface IDocumentUploadRejection {
    fileName: string;
    code: string;
    message: string;
}
/**
 * The 201 envelope of the upload endpoint: per-file accept/reject results.
 */
export interface IDocumentUploadResponse {
    results: IDocumentUploadResult[];
    rejected: IDocumentUploadRejection[];
}
