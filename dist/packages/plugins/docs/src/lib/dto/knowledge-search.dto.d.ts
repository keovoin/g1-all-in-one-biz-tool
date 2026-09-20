import { BaseEntityEnum, DocumentKindEnum, ID } from '@gauzy/contracts';
/**
 * Request body of `POST /api/plugins/docs/knowledge/search` (§9.1 of the AI-knowledge spec).
 */
export declare class KnowledgeSearchDTO {
    readonly query: string;
    /** Default 6; clamped to `GAUZY_DOCS_RETRIEVAL_TOPK_MAX` (12). */
    readonly topK?: number;
    /** Optional restriction to specific documents (≤ 20). */
    readonly documentIds?: ID[];
    readonly categoryIds?: ID[];
    readonly tagIds?: ID[];
    /** FILE | PAGE — FOLDER is rejected (never indexable). */
    readonly kinds?: DocumentKindEnum[];
    /** Both or neither with `entityId` — restrict to documents linked to a business record. */
    readonly entity?: BaseEntityEnum;
    readonly entityId?: ID;
}
