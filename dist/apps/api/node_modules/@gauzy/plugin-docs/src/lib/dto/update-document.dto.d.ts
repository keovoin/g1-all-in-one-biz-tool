import { CreateDocumentDTO } from './create-document.dto';
declare const UpdateDocumentDTO_base: import("@nestjs/common").Type<Partial<Omit<CreateDocumentDTO, "index" | "kind" | "contentJson" | "contentHtml" | "parentId" | "importToKnowledge">>>;
/**
 * Partial **metadata-only** update for `PUT /api/plugins/docs/documents/:id`.
 *
 * `kind` is immutable and content saves go through `PUT /:id/content` — the content fields are
 * omitted here so `forbidNonWhitelisted` rejects them with 400.
 *
 * `parentId` and `index` are omitted for the same reason: re-parenting is a **tree** operation
 * and belongs exclusively to `POST /:id/move`, which is cycle-guarded and rejects a FILE parent.
 * Writing `parentId` straight through this endpoint bypassed both guards and could build a
 * cycle that the ancestor walks then had to survive.
 */
export declare class UpdateDocumentDTO extends UpdateDocumentDTO_base {
    /** False = metadata-only search (content excluded from lexical search). */
    readonly searchable?: boolean;
    /** View-only lock on a PAGE. */
    readonly isLocked?: boolean;
    /** Human override of the AI summary. */
    readonly summary?: string;
}
export {};
