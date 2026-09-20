import { ID } from '@gauzy/contracts';
/**
 * Payload for `POST /api/plugins/docs/documents/reorder` — rewrites `index` for the listed
 * siblings. Ids that are not children of `parentId` yield 400 `DOCS_REORDER_MIXED_PARENTS`.
 */
export declare class ReorderDocumentsDTO {
    readonly parentId: ID | null;
    readonly orderedIds: ID[];
}
