import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { DocumentKindEnum } from '@gauzy/contracts';
import { DocumentsService } from './documents.service';
import * as i0 from "@angular/core";
import * as i1 from "./documents.service";
/** Children fetched per branch — the query DTO caps `take` at 100. */
const DOCS_TREE_PAGE_SIZE = 100;
/**
 * BehaviorSubject-based node cache for the Documents tree. Kept outside elf
 * deliberately — nodes are shared by the tree, the move dialog and breadcrumbs.
 * Invalidated by move/create/archive mutation events from the browse page.
 */
export class DocumentTreeStore {
    constructor(documentsService) {
        this.documentsService = documentsService;
        /** parentId (or '' for root) → children (undefined = not loaded yet). */
        this._children = new Map();
        /** id → node (flat index across everything loaded so far). */
        this._byId = new Map();
        this._nodes$ = new BehaviorSubject([]);
        /** Root-level nodes (reference refreshed on every cache change). */
        this.nodes$ = this._nodes$.asObservable();
    }
    // ─── Loading ─────────────────────────────────────────────────
    /** Lazily loads (and memoizes) the children of a node; `null` = root level. */
    async loadChildren(parentId) {
        const key = this.keyOf(parentId);
        const cached = this._children.get(key);
        if (cached)
            return cached;
        // 🛑 `'root'`, not `null`: an omitted `parentId` is a FLAT search across the
        // whole tree, and the literal string "null" fails the DTO's `@IsUUID`. No
        // `sort` either — `index` is not in the DTO's `@IsIn` allowlist, and tree
        // browse (`parentId` present) already defaults to `index ASC` server-side.
        const { items } = await firstValueFrom(this.documentsService.getAll({ parentId: parentId ?? 'root', archived: false, take: DOCS_TREE_PAGE_SIZE }));
        const nodes = (items ?? []).map((doc) => this.toNode(doc));
        this._children.set(key, nodes);
        nodes.forEach((node) => this._byId.set(String(node.id), node));
        this.emit();
        return nodes;
    }
    async loadRoots() {
        return this.loadChildren(null);
    }
    // ─── Queries ─────────────────────────────────────────────────
    getNode(id) {
        return id ? this._byId.get(String(id)) : undefined;
    }
    /**
     * Cycle guard for `allowDrop`: true when `nodeId` is an ancestor of
     * `ancestorCandidateId` — i.e. dropping into it would create a cycle.
     * Walks only loaded nodes; unloaded ancestry resolves to false (the server
     * re-validates and the optimistic move reverts on error).
     */
    isDescendantOf(candidateId, nodeId) {
        let current = this.getNode(candidateId);
        const target = String(nodeId);
        const seen = new Set();
        while (current) {
            const id = String(current.id);
            if (id === target)
                return true;
            if (seen.has(id))
                return false; // defensive: malformed cycles
            seen.add(id);
            current = this.getNode(current.parentId ?? undefined);
        }
        return false;
    }
    /** Breadcrumb chain root → node (loaded nodes only). */
    pathOf(id) {
        const path = [];
        let current = this.getNode(id);
        while (current) {
            path.unshift(current);
            current = this.getNode(current.parentId ?? undefined);
        }
        return path;
    }
    // ─── Mutation events ─────────────────────────────────────────
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
    invalidate(parentId) {
        const key = this.keyOf(parentId ?? null);
        const wasLoaded = this._children.has(key);
        this._children.delete(key);
        this.emit();
        // Only reload what was actually cached: invalidating a never-opened branch
        // must not eagerly expand it.
        if (wasLoaded)
            void this.loadChildren(parentId ?? null).catch(() => undefined);
    }
    /** Full cache reset (org switch, bulk mutations) — the roots are reloaded. */
    invalidateAll() {
        const hadRoots = this._children.has('');
        this._children.clear();
        this._byId.clear();
        this.emit();
        if (hadRoots)
            void this.loadRoots().catch(() => undefined);
    }
    /** Optimistic local re-parent; call `invalidate` on API error to revert. */
    applyMove(nodeId, newParentId) {
        const node = this.getNode(nodeId);
        if (!node)
            return;
        const oldKey = this.keyOf(node.parentId ?? null);
        const newKey = this.keyOf(newParentId);
        const oldSiblings = this._children.get(oldKey);
        if (oldSiblings) {
            this._children.set(oldKey, oldSiblings.filter((n) => String(n.id) !== String(nodeId)));
        }
        node.parentId = newParentId;
        const newSiblings = this._children.get(newKey);
        if (newSiblings && !newSiblings.some((n) => String(n.id) === String(nodeId))) {
            this._children.set(newKey, [...newSiblings, node]);
        }
        this.emit();
    }
    // ─── Internals ───────────────────────────────────────────────
    toNode(doc) {
        return {
            id: doc.id,
            name: doc.name,
            kind: doc.kind,
            parentId: doc.parentId ?? null,
            icon: doc.icon,
            color: doc.color,
            isLocked: doc.isLocked,
            visibility: doc.visibility,
            createdByUserId: doc.createdByUserId ?? null,
            // FILE nodes are leaves; FOLDER/PAGE may have lazily loaded children.
            hasChildren: doc.kind !== DocumentKindEnum.FILE,
            // Virtual columns of the list projection (`document.service.ts`), carried
            // so the context menu does not have to re-read the document to decide
            // what it may offer.
            childrenCount: doc.childrenCount,
            knowledgeStatus: doc.knowledgeStatus,
            isArchived: doc.isArchived
        };
    }
    keyOf(parentId) {
        return parentId ? String(parentId) : '';
    }
    emit() {
        this._nodes$.next(this._children.get('') ?? []);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DocumentTreeStore, deps: [{ token: i1.DocumentsService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DocumentTreeStore }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DocumentTreeStore, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.DocumentsService }] });
//# sourceMappingURL=document-tree.store.js.map