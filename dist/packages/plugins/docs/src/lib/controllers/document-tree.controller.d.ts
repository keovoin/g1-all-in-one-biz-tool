import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ID, IDocument } from '@gauzy/contracts';
import { DeleteDocumentQueryDTO, DuplicateDocumentDTO, MoveDocumentDTO, ReorderDocumentsDTO } from '../dto';
export declare class DocumentTreeController {
    private readonly commandBus;
    private readonly queryBus;
    constructor(commandBus: CommandBus, queryBus: QueryBus);
    /**
     * Rewrites `index` for the listed siblings of one parent (`null` = root siblings).
     */
    reorder(input: ReorderDocumentsDTO): Promise<void>;
    /**
     * Moves a node to a new parent (`null` = root); self or descendant targets are rejected
     * with 409 `DOCS_TREE_CYCLE`.
     */
    move(id: ID, input: MoveDocumentDTO): Promise<IDocument>;
    /**
     * Duplicates a node (optionally its whole subtree). Returns 201 with the new root node.
     */
    duplicate(id: ID, input: DuplicateDocumentDTO): Promise<IDocument>;
    /**
     * Archives the node and cascades to the whole subtree. Idempotent.
     */
    archive(id: ID): Promise<IDocument>;
    /**
     * Clears the archive flags on the subtree. Idempotent.
     */
    unarchive(id: ID): Promise<IDocument>;
    /**
     * Soft delete — **allowed only when archived** (else 409 `DOCS_DELETE_REQUIRES_ARCHIVE`).
     * `strategy=subtree` (default) soft-deletes descendants too; `strategy=promote-children`
     * re-parents children. Blobs are never deleted from storage by this endpoint.
     */
    delete(id: ID, query: DeleteDocumentQueryDTO): Promise<IDocument>;
    /**
     * Restores a soft-deleted document; re-parents to root if the original parent is still
     * deleted; the document returns in archived state.
     */
    recover(id: ID): Promise<IDocument>;
}
