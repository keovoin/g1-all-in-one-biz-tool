import { Observable } from 'rxjs';
import { DocumentKindEnum, DocumentKnowledgeStatusEnum, ID } from '@gauzy/contracts';
import { DocumentsService } from './documents.service';
import * as i0 from "@angular/core";
/** Lightweight tree node derived from IDocument (shared by tree, move dialog, breadcrumbs). */
export interface IDocsTreeNode {
    id: ID;
    name: string;
    kind: DocumentKindEnum;
    parentId?: ID | null;
    icon?: string;
    color?: string;
    isLocked?: boolean;
    visibility?: string;
    /**
     * Creator of the node — the ownership half of the write rule
     * (`DocumentPermissionService.canMutate`, spec 08 §1.7). Carried on the node so the tree
     * context menu can scope edit/move/archive/delete without re-reading the document; it is
     * part of the list projection (`DOCUMENT_LIST_COLUMNS`).
     */
    createdByUserId?: ID | null;
    /**
     * Whether the node CAN hold children — this drives the tree's expander, so it
     * stays a per-kind capability rather than the real count (a folder that is
     * empty today must still be expandable the moment something is created in it).
     * The real count is `childrenCount`.
     */
    hasChildren: boolean;
    /** Real child count from the list projection — drives the delete subtree prompt. */
    childrenCount?: number;
    /** Decides whether the context menu offers "Add to"/"Exclude from" AI knowledge. */
    knowledgeStatus?: DocumentKnowledgeStatusEnum;
    isArchived?: boolean;
    children?: IDocsTreeNode[];
}
/**
 * BehaviorSubject-based node cache for the Documents tree. Kept outside elf
 * deliberately — nodes are shared by the tree, the move dialog and breadcrumbs.
 * Invalidated by move/create/archive mutation events from the browse page.
 */
export declare class DocumentTreeStore {
    private readonly documentsService;
    /** parentId (or '' for root) → children (undefined = not loaded yet). */
    private readonly _children;
    /** id → node (flat index across everything loaded so far). */
    private readonly _byId;
    private readonly _nodes$;
    /** Root-level nodes (reference refreshed on every cache change). */
    readonly nodes$: Observable<IDocsTreeNode[]>;
    constructor(documentsService: DocumentsService);
    /** Lazily loads (and memoizes) the children of a node; `null` = root level. */
    loadChildren(parentId: ID | null): Promise<IDocsTreeNode[]>;
    loadRoots(): Promise<IDocsTreeNode[]>;
    getNode(id: ID | null | undefined): IDocsTreeNode | undefined;
    /**
     * Cycle guard for `allowDrop`: true when `nodeId` is an ancestor of
     * `ancestorCandidateId` — i.e. dropping into it would create a cycle.
     * Walks only loaded nodes; unloaded ancestry resolves to false (the server
     * re-validates and the optimistic move reverts on error).
     */
    isDescendantOf(candidateId: ID | null | undefined, nodeId: ID): boolean;
    /** Breadcrumb chain root → node (loaded nodes only). */
    pathOf(id: ID): IDocsTreeNode[];
    /**
     * Drops the cached children of a parent (and the root list when null) **and
     * re-fetches them**.
     *
     * Dropping alone emitted an empty list — `emit()` publishes
     * `_children.get('')`, which is exactly what was just deleted — and nothing
     * else ever reloaded the roots, so `invalidate(null)` after a move/create
     * blanked the sidebar until a full page reload. `loadChildren` re-emits when
     * it settles, so the empty frame lasts only for the round trip.
     */
    invalidate(parentId?: ID | null): void;
    /** Full cache reset (org switch, bulk mutations) — the roots are reloaded. */
    invalidateAll(): void;
    /** Optimistic local re-parent; call `invalidate` on API error to revert. */
    applyMove(nodeId: ID, newParentId: ID | null): void;
    private toNode;
    private keyOf;
    private emit;
    static ɵfac: i0.ɵɵFactoryDeclaration<DocumentTreeStore, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<DocumentTreeStore>;
}
