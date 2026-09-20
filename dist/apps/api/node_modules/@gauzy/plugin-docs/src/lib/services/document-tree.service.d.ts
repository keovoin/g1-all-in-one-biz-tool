import { ID } from '@gauzy/contracts';
import { Document } from '../entities/document.entity';
import { TypeOrmDocumentRepository } from '../repositories/type-orm-document.repository';
/**
 * Tree mechanics for the Documents hub: ancestor-chain walks, the move cycle guard, subtree
 * collection (iterative BFS — dialect-portable), sibling `index` maintenance, deep duplicate,
 * archive/unarchive cascade, and the delete strategies (`subtree` vs `promote-children`).
 */
export declare class DocumentTreeService {
    private readonly typeOrmDocumentRepository;
    private readonly logger;
    constructor(typeOrmDocumentRepository: TypeOrmDocumentRepository);
    /**
     * Collects the ids of a node's whole subtree (including the root) with an iterative
     * breadth-first walk — portable across all three dialects.
     *
     * @param root The subtree root.
     * @param withDeleted Include soft-deleted rows (used by recover).
     * @returns All subtree ids, root first.
     */
    collectSubtreeIds(root: Document, withDeleted?: boolean): Promise<ID[]>;
    /**
     * Guards against tree cycles: the new parent must not be the node itself or any of its
     * descendants. Violations raise 409 `DOCS_TREE_CYCLE`.
     *
     * @param document The node being moved.
     * @param newParentId The prospective parent id.
     */
    assertNoCycle(document: Document, newParentId: ID): Promise<void>;
    /**
     * Moves a node to a new parent (`null` = root) at an optional sibling position; sibling
     * `index` values are compacted after insert.
     *
     * @param document The node to move.
     * @param parentId The new parent id or null.
     * @param index The target sibling position (appends when omitted).
     * @returns The moved document.
     */
    moveDocument(document: Document, parentId: ID | null, index?: number): Promise<Document>;
    /**
     * Loads the ids of one parent's children (`null` = root siblings) in `index` order, scoped
     * to the reference document's tenant + organization.
     *
     * @param parentId The parent whose children to load, or null for the root list.
     * @param scope A document carrying the tenant/organization scope.
     * @returns The sibling ids in `index` order.
     */
    private loadSiblingIds;
    /**
     * Rewrites `index` for the listed siblings of one parent (`null` = root siblings).
     * Ids that are not children of `parentId` yield 400 `DOCS_REORDER_MIXED_PARENTS`.
     *
     * @param parentId The common parent id or null.
     * @param orderedIds The sibling ids in the desired order.
     * @param tenantId Tenant scope.
     * @param organizationId Optional organization scope.
     */
    reorderDocuments(parentId: ID | null, orderedIds: ID[], tenantId: ID, organizationId?: ID): Promise<void>;
    /**
     * Duplicates a node (optionally its whole subtree). PAGE content columns are copied; FILE
     * copies re-use the same storage key (bytes are not duplicated) with an independent row.
     * Versions, comments, shares, links, and knowledge state are **not** copied — the copy
     * starts `knowledgeStatus: NONE`, `reviewStatus: NONE`.
     *
     * @param document The source node.
     * @param options `deep` copies the subtree; `parentId`/`name` override the target.
     * @returns The new root node of the copy.
     */
    duplicateDocument(document: Document, options?: {
        deep?: boolean;
        parentId?: ID;
        name?: string;
    }): Promise<Document>;
    /**
     * Archives a node and **cascades to the whole subtree**. Idempotent.
     *
     * @param document The subtree root.
     * @returns The affected row count.
     */
    archiveSubtree(document: Document): Promise<number>;
    /**
     * Clears the archive flags on the subtree, plus any archived ancestors needed to make the
     * node reachable through the tree again. Idempotent.
     *
     * @param document The subtree root.
     * @returns The affected row count.
     */
    unarchiveSubtree(document: Document): Promise<number>;
    /**
     * Soft delete — **allowed only from archived state** (archive-first workflow; else 409).
     * `subtree` (default) soft-deletes the descendants too, stamping `metadata.deletion.batchId`
     * so recovery restores exactly the rows deleted by this operation; `promote-children`
     * re-parents children to the deleted node's parent preserving relative `index` order.
     *
     * @param document The node to delete.
     * @param strategy The delete strategy.
     * @returns The soft-deleted document.
     */
    deleteDocument(document: Document, strategy?: 'subtree' | 'promote-children'): Promise<Document>;
    /**
     * Asserts that every node of a subtree is archived before a `subtree` delete.
     *
     * @param document The subtree root (already known to be archived).
     */
    private assertSubtreeArchived;
    /**
     * Restores a soft-deleted document (and the rows deleted in the same batch, when it was a
     * subtree delete). Re-parents to root if the original parent is still deleted; the document
     * returns in archived state.
     *
     * The caller **must** hand in a row it already resolved through the read scope
     * (`DocumentService.findOneDeletedScoped`) — this method takes the entity, not an id, so a
     * tenant-only lookup can never be the thing that authorizes an un-delete.
     *
     * @param document The soft-deleted document, already resolved within the caller's scope.
     * @returns The recovered document.
     */
    recoverDocument(document: Document): Promise<Document>;
    /**
     * Copies one node (shallow).
     */
    private copyNode;
    /**
     * Breadth-first deep copy of the children of `source` under `target`.
     */
    private copyChildrenRecursive;
    /**
     * Rewrites the `index` column to match the given order.
     */
    private rewriteSiblingIndexes;
    /**
     * Serializes a metadata object for persistence (plain text column on SQLite).
     */
    private serializeMetadata;
    /**
     * Parses a metadata value that may still be serialized (SQLite path).
     */
    private parseMetadata;
}
