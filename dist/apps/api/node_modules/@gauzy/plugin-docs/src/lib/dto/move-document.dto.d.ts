import { ID } from '@gauzy/contracts';
/**
 * Payload for `POST /api/plugins/docs/documents/:id/move`.
 * `parentId: null` = move to root; sibling `index` values are compacted after insert.
 */
export declare class MoveDocumentDTO {
    readonly parentId: ID | null;
    readonly index?: number;
}
