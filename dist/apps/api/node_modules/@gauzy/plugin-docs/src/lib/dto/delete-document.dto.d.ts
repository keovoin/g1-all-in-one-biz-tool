/**
 * Query params for `DELETE /api/plugins/docs/documents/:id`.
 * `subtree` (default) soft-deletes the descendants too; `promote-children` re-parents children
 * to the deleted node's parent, preserving relative `index` order.
 */
export declare class DeleteDocumentQueryDTO {
    readonly strategy?: 'subtree' | 'promote-children';
}
