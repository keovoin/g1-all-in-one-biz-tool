import { DocumentKindEnum, DocumentKnowledgeStatusEnum, DocumentReviewStatusEnum, DocumentSourceEnum, DocumentStatusEnum, DocumentVisibilityEnum, ID } from '@gauzy/contracts';
import { BaseQueryDTO } from '@gauzy/core';
import { Document } from '../entities/document.entity';
/**
 * The complete filter set for `GET /api/plugins/docs/documents` (+ `/count` and `/facets`).
 * All params optional; array params accepted as repeated params or CSV.
 */
export declare class GetDocumentsQueryDTO extends BaseQueryDTO<Document> {
    readonly kind?: DocumentKindEnum[];
    readonly status?: DocumentStatusEnum[];
    readonly knowledgeStatus?: DocumentKnowledgeStatusEnum[];
    readonly reviewStatus?: DocumentReviewStatusEnum[];
    /** Shorthand for `reviewStatus=[PENDING]` (wins if both sent). */
    readonly needsReview?: boolean;
    readonly source?: DocumentSourceEnum[];
    /** ANY-match against the categories M2M. */
    readonly categoryIds?: ID[];
    /** ANY-match against the tags M2M. */
    readonly tagIds?: ID[];
    readonly visibility?: DocumentVisibilityEnum;
    /** Archived rows handling; default `exclude`. */
    readonly archived?: 'exclude' | 'include' | 'only';
    /** Filter on the metadata-only search flag. */
    readonly searchable?: boolean;
    readonly createdAtFrom?: string;
    /** Date-only values cover the whole day. */
    readonly createdAtTo?: string;
    readonly updatedAtFrom?: string;
    readonly updatedAtTo?: string;
    /** Tree browse: direct children of the node (`'root'` = top level). Omitted = flat search. */
    readonly parentId?: ID | 'root';
    /** Name search (case-insensitive substring). */
    readonly q?: string;
    /**
     * `content` additionally matches `contentHtml`-derived text and `extractedText`; it requires
     * `q.length >= DOCS_CONTENT_SEARCH_MIN_CHARS` (3) and is otherwise a 400 `DOCS_QUERY_TOO_SHORT`
     * — the client mirrors the same minimum in its search gate.
     */
    readonly searchIn?: 'name' | 'content';
    /** Sort field; default `updatedAt DESC` (tree browse defaults to `index ASC`). */
    readonly sort?: 'name' | 'updatedAt' | 'createdAt' | 'size' | 'kind';
    readonly sortOrder?: 'ASC' | 'DESC';
}
