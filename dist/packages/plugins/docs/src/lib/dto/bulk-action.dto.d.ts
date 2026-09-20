import { ID } from '@gauzy/contracts';
/**
 * Bulk actions accepted by `POST /api/plugins/docs/documents/bulk`.
 *
 * M1 implements `ARCHIVE`, `UNARCHIVE`, `SET_CATEGORIES`, `ADD_TAGS`, `REMOVE_TAGS`, `MOVE`,
 * `DELETE`; the knowledge and review actions arrive with their milestones and fail per-id with
 * `DOCS_BULK_ACTION_UNSUPPORTED` until then.
 */
export declare enum DocumentBulkActionEnum {
    ARCHIVE = "ARCHIVE",
    UNARCHIVE = "UNARCHIVE",
    SET_CATEGORIES = "SET_CATEGORIES",
    ADD_TAGS = "ADD_TAGS",
    REMOVE_TAGS = "REMOVE_TAGS",
    KNOWLEDGE_IMPORT = "KNOWLEDGE_IMPORT",
    KNOWLEDGE_EXCLUDE = "KNOWLEDGE_EXCLUDE",
    MOVE = "MOVE",
    DELETE = "DELETE",
    REVIEW_APPROVE = "REVIEW_APPROVE",
    REVIEW_REJECT = "REVIEW_REJECT"
}
/**
 * Per-id result entry of the bulk endpoint (one HTTP 200, per-id partial failure).
 */
export interface IDocumentBulkResultItem {
    id: ID;
    ok: boolean;
    code?: string;
}
/**
 * Response envelope of the bulk endpoint.
 */
export interface IDocumentBulkResult {
    requested: number;
    succeeded: number;
    failed: number;
    results: IDocumentBulkResultItem[];
}
export declare class BulkDocumentActionDTO {
    readonly ids: ID[];
    readonly action: DocumentBulkActionEnum;
    /** SET_CATEGORIES — replaces; empty clears. */
    readonly categoryIds?: ID[];
    /** ADD_TAGS / REMOVE_TAGS — additive/subtractive. */
    readonly tagIds?: ID[];
    /** MOVE — cycle-guarded per id; null = root. */
    readonly parentId?: ID | null;
    /** REVIEW_REJECT payload. */
    readonly reason?: string;
}
