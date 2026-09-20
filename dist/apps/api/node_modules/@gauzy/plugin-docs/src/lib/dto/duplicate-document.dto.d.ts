import { ID } from '@gauzy/contracts';
/**
 * Payload for `POST /api/plugins/docs/documents/:id/duplicate`.
 * The copy starts `knowledgeStatus: NONE`, `reviewStatus: NONE`; versions, comments, shares,
 * links, and knowledge state are not copied.
 */
export declare class DuplicateDocumentDTO {
    /** True copies the whole subtree. */
    readonly deep?: boolean;
    /** Target parent; defaults to the source node's parent. */
    readonly parentId?: ID;
    /** Name for the copy; defaults to `"<name> (copy)"`. */
    readonly name?: string;
}
