import { __decorate, __metadata } from "tslib";
import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TreeComponent, TREE_ACTIONS } from '@ali-hm/angular-tree-component';
import { NbDialogService, NbMenuService } from '@nebular/theme';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Actions } from '@ngneat/effects-ng';
import { TranslateService } from '@ngx-translate/core';
import { NgxPermissionsService } from 'ngx-permissions';
import { filter, firstValueFrom, map } from 'rxjs';
import { DocumentKindEnum, PermissionsEnum } from '@gauzy/contracts';
import { FavoriteStoreService, Store, ToastrService } from '@gauzy/ui-core/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { DocumentsActions } from '../../+state/documents.actions';
import { CreateDialogComponent } from '../../dialogs/create-dialog.component';
import { DOCS_PAGE_LINK, DOCS_RECENTS_KEY_PREFIX, DOCS_RECENTS_LIMIT } from '../../docs.constants';
import { DocumentPermissionService } from '../../services/document-permission.service';
import { DocumentTreeStore } from '../../services/document-tree.store';
import { DocumentsService } from '../../services/documents.service';
import { buildDocsActionMenu, docsActionMenuSignature, docsActionOf } from '../actions/docs-action-menu';
import { DocsRowActionsService } from '../actions/docs-row-actions.service';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
import * as i2 from "@angular/router";
import * as i3 from "@ngneat/effects-ng";
import * as i4 from "../../services/document-tree.store";
import * as i5 from "../../services/documents.service";
import * as i6 from "../actions/docs-row-actions.service";
import * as i7 from "../../services/document-permission.service";
import * as i8 from "@gauzy/ui-core/core";
import * as i9 from "@nebular/theme";
import * as i10 from "ngx-permissions";
import * as i11 from "@angular/common";
import * as i12 from "@ali-hm/angular-tree-component";
const TREE_MENU_TAG_PREFIX = 'gz-docs-tree-node-';
/**
 * Key codes the tree binds through `ITreeOptions.actionMapping.keys`
 * (`01-ux-spec.md` §16/§17).
 *
 * 🛑 Numeric, and deliberately NOT taken from the library's exported `KEYS`
 * table: that table stops at the six navigation keys and, worse, ships
 * `CONTEXT_MENU: 32` — the code for Space, not for the context-menu key. Reusing
 * it would have bound "open the node menu" to the key that activates a node.
 */
const TREE_KEY = {
    /** Rename in place. */
    F2: 113,
    /** Archive (the destructive step the row actions gate behind archive-first). */
    DELETE: 46,
    /** `Shift+F10` — the platform's keyboard context-menu chord. */
    F10: 121,
    /** The dedicated context-menu key found on most PC keyboards. */
    CONTEXT_MENU: 93,
    UP: 38,
    DOWN: 40
};
/**
 * Documents tree sidebar: favorites + recents sections above the lazy folder
 * tree. Drag & drop re-parents through the move API with a client-side cycle
 * check; the per-kind context menu is permission-filtered.
 */
let DocsTreeComponent = class DocsTreeComponent extends TranslationBaseComponent {
    constructor(translateService, router, route, actions, treeStore, documentsService, rowActions, documentPermission, toastrService, dialogService, nbMenuService, permissionsService, favoriteStore, store) {
        super(translateService);
        this.translateService = translateService;
        this.router = router;
        this.route = route;
        this.actions = actions;
        this.treeStore = treeStore;
        this.documentsService = documentsService;
        this.rowActions = rowActions;
        this.documentPermission = documentPermission;
        this.toastrService = toastrService;
        this.dialogService = dialogService;
        this.nbMenuService = nbMenuService;
        this.permissionsService = permissionsService;
        this.favoriteStore = favoriteStore;
        this.store = store;
        this.nodes = [];
        this.recents = [];
        this.kindEnum = DocumentKindEnum;
        /** Public: the empty-state create buttons are gated on it in the template. */
        this.canCreate = false;
        this.canUpdate = false;
        this.canDelete = false;
        this.canAiImport = false;
        /** nodeId → last built menu, keyed by the signature it was built from. */
        this.menuCache = new Map();
        this.options = {
            childrenField: 'children',
            idField: 'id',
            useVirtualScroll: true,
            getChildren: (node) => this.treeStore.loadChildren(node.data.id),
            allowDrag: (node) => this.canUpdate && !node.data.isLocked,
            allowDrop: (element, { parent }) => this.canUpdate &&
                (!parent?.data || parent.data.kind !== DocumentKindEnum.FILE) && // FILE nodes are leaves
                !this.treeStore.isDescendantOf(parent?.data?.id, element.data.id) && // no cycle: never into own subtree
                element.data.id !== parent?.data?.id,
            /**
             * Keyboard parity with the node context menu (`01-ux-spec.md` §16/§17).
             *
             * 🛑 Every handler listed here replaces the library default for that key, so
             * `UP`/`DOWN` must forward to `PREVIOUS_NODE`/`NEXT_NODE` when Ctrl is not held
             * — binding them bare would break plain arrow navigation through the tree.
             * `performKeyAction` calls `preventDefault()` for any key it finds here, which
             * is also what stops the page-level shortcut map from seeing these events.
             */
            actionMapping: {
                keys: {
                    [TREE_KEY.F2]: (_tree, node) => void this.runNodeAction('rename', node),
                    // Archive, not delete: `DELETE /documents/:id` answers 409
                    // `DOCS_DELETE_REQUIRES_ARCHIVE` for anything still live, so the destructive
                    // key does the step that can actually succeed.
                    [TREE_KEY.DELETE]: (_tree, node) => void this.runNodeAction('archive', node),
                    [TREE_KEY.F10]: (_tree, node, event) => {
                        if (event?.shiftKey)
                            this.openNodeContextMenu(node);
                    },
                    [TREE_KEY.CONTEXT_MENU]: (_tree, node) => this.openNodeContextMenu(node),
                    [TREE_KEY.UP]: (tree, node, event) => {
                        if (!event?.ctrlKey)
                            return void TREE_ACTIONS.PREVIOUS_NODE(tree, node, event);
                        void this.reorderNode(node, -1);
                    },
                    [TREE_KEY.DOWN]: (tree, node, event) => {
                        if (!event?.ctrlKey)
                            return void TREE_ACTIONS.NEXT_NODE(tree, node, event);
                        void this.reorderNode(node, 1);
                    }
                }
            }
        };
    }
    ngOnInit() {
        this.permissionsService.permissions$.pipe(untilDestroyed(this)).subscribe((permissions) => {
            this.canCreate = !!permissions[PermissionsEnum.DOCS_CREATE];
            this.canUpdate = !!permissions[PermissionsEnum.DOCS_UPDATE];
            this.canDelete = !!permissions[PermissionsEnum.DOCS_DELETE];
            this.canAiImport = !!permissions[PermissionsEnum.DOCS_AI_IMPORT];
            this.menuCache.clear();
        });
        // Menu labels are baked in at build time, so a language switch (and a star
        // toggled anywhere in the app) has to drop the memo.
        this.translateService.onLangChange.pipe(untilDestroyed(this)).subscribe(() => this.menuCache.clear());
        this.rowActions.favoriteIds$.pipe(untilDestroyed(this)).subscribe(() => this.menuCache.clear());
        this.treeStore.nodes$.pipe(untilDestroyed(this)).subscribe((nodes) => {
            this.nodes = nodes.map((node) => ({ ...node }));
        });
        // Fire-and-forget, but the promise must still be terminated: `loadRoots()` →
        // `loadChildren()` → `firstValueFrom(getAll(...))` carries no internal catch, so a
        // failed roots fetch would escape as an unhandled rejection. An empty sidebar is
        // the same degradation the store already applies to its own reloads
        // (`document-tree.store.ts` `invalidate` / `invalidateAll`).
        void this.treeStore.loadRoots().catch(() => undefined);
        // Starred documents from the shared favorites store, filtered to Documents links.
        this.favorites$ = this.favoriteStore.favoriteItems$.pipe(map((items) => items.filter((item) => String(item?.link ?? '').startsWith(DOCS_PAGE_LINK))));
        this.loadRecents();
        this.nbMenuService
            .onItemClick()
            .pipe(filter(({ tag }) => (tag ?? '').startsWith(TREE_MENU_TAG_PREFIX)), untilDestroyed(this))
            .subscribe(({ tag, item }) => {
            const nodeId = tag.slice(TREE_MENU_TAG_PREFIX.length);
            // Deliberate fire-and-forget (a menu click cannot be awaited) — `void` is safe
            // only because `onContextAction` now owns its failure path and never rejects.
            void this.onContextAction(docsActionOf(item), nodeId);
        });
    }
    // ─── Selection ───────────────────────────────────────────────
    onNodeActivate(event) {
        const node = event?.node?.data;
        if (!node)
            return;
        this.recordRecent(node);
        switch (node.kind) {
            case DocumentKindEnum.FOLDER:
                this.actions.dispatch(DocumentsActions.folderChanged(node.id));
                break;
            case DocumentKindEnum.PAGE:
                this.router.navigate(['page', node.id], { relativeTo: this.route });
                break;
            case DocumentKindEnum.FILE:
                this.actions.dispatch(DocumentsActions.detailOpened(node.id));
                break;
        }
    }
    /** Section title / root crumb — clears the folder scope back to "All documents". */
    goToRoot() {
        this.actions.dispatch(DocumentsActions.folderChanged(null));
    }
    // ─── Root-level create (empty tree) ──────────────────────────
    /**
     * Creates a FOLDER or PAGE at the **root**.
     *
     * Deliberately not routed through `DocsRowActionsService.execute('new-folder')`:
     * that executor creates a child *of a target node*, and the whole point of this
     * affordance is the state where no node exists. A created page opens straight in
     * the editor, matching what activating a PAGE node does; a folder stays put and
     * only refreshes the surfaces that show it.
     */
    async createAtRoot(kind) {
        let created = null;
        try {
            created = await firstValueFrom(this.dialogService.open(CreateDialogComponent, { context: { kind, parentId: null } }).onClose);
        }
        catch {
            // The dialog reports its own failures; a dismissed/failed create is a no-op.
            return;
        }
        if (!created)
            return;
        this.treeStore.invalidate(null);
        this.actions.dispatch(DocumentsActions.loadDocuments());
        if (kind === DocumentKindEnum.PAGE) {
            this.router.navigate(['page', created.id], { relativeTo: this.route });
        }
    }
    /**
     * Raises the upload flow through the browse page's one-shot `?upload=1` deep
     * link — the same channel the node context menu's "Upload here" uses, so the
     * file input, the classification dialog and the queue stay owned by the page
     * that renders them.
     *
     * No `folder` is sent, so the files land in the scope the hub is currently
     * browsing. That is the root wherever this button is reachable: it only renders
     * when the tree has no root nodes, i.e. when the organization has no documents
     * to have drilled into.
     *
     * The empty command array keeps the current route: Angular's `createUrlTree`
     * short-circuits on `commands.length === 0`, so this is a pure query-param merge.
     */
    uploadHere() {
        void this.router.navigate([], {
            queryParams: { upload: 1 },
            queryParamsHandling: 'merge'
        });
    }
    // ─── Drag & drop ─────────────────────────────────────────────
    async onMoveNode(event) {
        const nodeId = event.node?.id;
        if (!nodeId)
            return;
        const rawParent = event.to?.parent;
        const parentId = rawParent && !rawParent.virtual && rawParent.id ? rawParent.id : null;
        const previousParentId = this.treeStore.getNode(nodeId)?.parentId ?? null;
        // Optimistic local re-parent; revert on API error.
        this.treeStore.applyMove(nodeId, parentId);
        try {
            await firstValueFrom(this.documentsService.move(nodeId, { parentId, index: event.to?.index ?? 0 }));
            this.treeStore.invalidate(previousParentId);
            this.treeStore.invalidate(parentId);
        }
        catch {
            this.treeStore.applyMove(nodeId, previousParentId);
            this.treeStore.invalidate(previousParentId);
            this.treeStore.invalidate(parentId);
            this.toastrService.danger(this.getTranslation('DOCS.TOASTS.MOVE_FAILED'));
        }
    }
    // ─── Context menu ────────────────────────────────────────────
    menuTag(node) {
        return `${TREE_MENU_TAG_PREFIX}${node.id}`;
    }
    /**
     * Per-kind, permission-filtered menu for one node (`01-ux-spec.md` §3.5),
     * built by the SAME builder the table and cards kebabs use.
     *
     * 🛑 Memoized. The template calls this from a binding, and `[nbContextMenu]`
     * rebuilds its overlay whenever the bound array is a new reference — an
     * un-memoized builder would rebuild every open menu on every change-detection
     * pass. The signature covers everything the item set is derived from, so a
     * kind/archive/knowledge/favorite/permission change still produces a new array.
     */
    menuItemsFor(node) {
        const context = this.menuContext(node);
        const signature = docsActionMenuSignature(node, context);
        const cached = this.menuCache.get(String(node.id));
        if (cached?.signature === signature)
            return cached.items;
        const items = buildDocsActionMenu(node, context);
        this.menuCache.set(String(node.id), { signature, items });
        return items;
    }
    menuContext(node) {
        return {
            surface: 'tree',
            translate: (key) => this.getTranslation(key),
            isFavorite: node ? this.rowActions.isFavorite(node.id) : false,
            // Ownership half of the write rule (spec 08 §1.7) — the node carries
            // `createdByUserId`/`visibility` from the list projection, so this costs no read.
            canMutate: this.documentPermission.canMutate(node),
            permissions: {
                create: this.canCreate,
                update: this.canUpdate,
                delete: this.canDelete,
                aiImport: this.canAiImport
            }
        };
    }
    /**
     * Runs one context-menu action.
     *
     * 🛑 **Never rejects.** The only caller is the `nbMenuService.onItemClick()` subscription,
     * which cannot await it, so an escaping rejection would be an unhandled one.
     * `DocsRowActionsService.execute()` owns its failure path for every mutation; the
     * `open` branch below is the only tree-local one and cannot throw.
     */
    async onContextAction(action, nodeId) {
        if (!action)
            return;
        const node = this.treeStore.getNode(nodeId);
        if (!node)
            return;
        if (action === 'open') {
            this.onNodeActivate({ node: { data: node } });
            return;
        }
        const changed = await this.rowActions.execute(action, node);
        // A rename/archive/delete changes the label or the membership of the branch
        // the node lives in; the cached menu was built from the pre-mutation node.
        if (changed)
            this.menuCache.delete(String(nodeId));
    }
    // ─── Keyboard actions (`01-ux-spec.md` §16/§17) ──────────────
    /**
     * Runs one row action for the focused node through the SAME executor the context
     * menu uses, so F2/Delete open the same dialogs and raise the same toasts and
     * invalidations as their menu items.
     *
     * 🛑 **Never rejects** — the caller is the tree's synchronous key dispatcher,
     * which cannot await it. `execute()` owns its own failure path.
     */
    async runNodeAction(action, node) {
        const data = node?.data;
        if (!data?.id || !this.canUpdate)
            return;
        const changed = await this.rowActions.execute(action, data);
        // A rename/archive changed the label or the branch membership the cached menu
        // was built from.
        if (changed)
            this.menuCache.delete(String(data.id));
    }
    /**
     * `Ctrl+↑/↓` — reorders the focused node among its siblings.
     *
     * Same `POST /:id/move` the drag & drop path uses, with the node's current parent
     * kept and only `index` shifted. The tree cache is invalidated rather than patched
     * because sibling order is server-owned (`index ASC`), so the reload is what makes
     * the new order authoritative instead of guessed.
     *
     * 🛑 Never rejects — see {@link runNodeAction}.
     */
    async reorderNode(node, delta) {
        const data = node?.data;
        if (!data?.id || !this.canUpdate || data.isLocked)
            return;
        const index = (node.index ?? 0) + delta;
        // Nothing above the first sibling. The upper bound is left to the server, which
        // clamps to the sibling count — the client's view of a branch can be stale.
        if (index < 0)
            return;
        const parentId = data.parentId ?? null;
        try {
            await firstValueFrom(this.documentsService.move(data.id, { parentId, index }));
            this.treeStore.invalidate(parentId);
        }
        catch {
            this.toastrService.danger(this.getTranslation('DOCS.TOASTS.MOVE_FAILED'));
        }
    }
    /**
     * `Shift+F10` / the context-menu key — opens the focused node's kebab.
     *
     * `[nbContextMenu]` exposes no imperative open handle, so the trigger button is
     * addressed by the `data-docs-node-menu` attribute the node template stamps with
     * the node id and clicked: the overlay then anchors exactly as it does on a
     * pointer click. The button is `visibility: hidden` until hover/focus, which does
     * not block a synthetic click.
     */
    openNodeContextMenu(node) {
        const id = node?.data?.id;
        if (!id)
            return;
        const trigger = document.querySelector(`[data-docs-node-menu="${String(id)}"]`);
        trigger?.click();
    }
    // ─── Node rendering helpers ──────────────────────────────────
    kindIcon(node) {
        switch (node.kind) {
            case DocumentKindEnum.FOLDER:
                return 'folder-outline';
            case DocumentKindEnum.PAGE:
                return 'file-text-outline';
            default:
                return 'file-outline';
        }
    }
    // ─── Recents (localStorage, per organization) ────────────────
    recentsKey() {
        return `${DOCS_RECENTS_KEY_PREFIX}${this.store.selectedOrganization?.id ?? 'default'}`;
    }
    loadRecents() {
        try {
            this.recents = JSON.parse(localStorage.getItem(this.recentsKey()) ?? '[]');
        }
        catch {
            this.recents = [];
        }
    }
    recordRecent(node) {
        const entry = { id: String(node.id), name: node.name, kind: node.kind };
        this.recents = [entry, ...this.recents.filter((recent) => recent.id !== entry.id)].slice(0, DOCS_RECENTS_LIMIT);
        localStorage.setItem(this.recentsKey(), JSON.stringify(this.recents));
    }
    openFavorite(favorite) {
        if (favorite?.link) {
            this.router.navigateByUrl(favorite.link);
        }
    }
    openRecent(entry) {
        this.onNodeActivate({ node: { data: { ...entry, id: entry.id, hasChildren: false } } });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DocsTreeComponent, deps: [{ token: i1.TranslateService }, { token: i2.Router }, { token: i2.ActivatedRoute }, { token: i3.Actions }, { token: i4.DocumentTreeStore }, { token: i5.DocumentsService }, { token: i6.DocsRowActionsService }, { token: i7.DocumentPermissionService }, { token: i8.ToastrService }, { token: i9.NbDialogService }, { token: i9.NbMenuService }, { token: i10.NgxPermissionsService }, { token: i8.FavoriteStoreService }, { token: i8.Store }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: DocsTreeComponent, isStandalone: false, selector: "gz-docs-tree", viewQueries: [{ propertyName: "tree", first: true, predicate: TreeComponent, descendants: true }], usesInheritance: true, ngImport: i0, template: "<div class=\"docs-tree\">\n\t<!-- Favorites -->\n\t<ng-container *ngIf=\"favorites$ | async as favorites\">\n\t\t<div class=\"docs-tree-section\" *ngIf=\"favorites.length\">\n\t\t\t<div class=\"docs-tree-section-title\">{{ 'DOCS.TREE.FAVORITES' | translate }}</div>\n\t\t\t<a class=\"docs-tree-link\" *ngFor=\"let favorite of favorites\" (click)=\"openFavorite(favorite)\">\n\t\t\t\t<nb-icon icon=\"star-outline\" size=\"tiny\"></nb-icon>\n\t\t\t\t<span class=\"docs-tree-link-name\">{{ favorite.title }}</span>\n\t\t\t</a>\n\t\t</div>\n\t</ng-container>\n\n\t<!-- Recents -->\n\t<div class=\"docs-tree-section\" *ngIf=\"recents.length\">\n\t\t<div class=\"docs-tree-section-title\">{{ 'DOCS.TREE.RECENTS' | translate }}</div>\n\t\t<a class=\"docs-tree-link\" *ngFor=\"let recent of recents\" (click)=\"openRecent(recent)\">\n\t\t\t<nb-icon\n\t\t\t\t[icon]=\"recent.kind === kindEnum.FOLDER ? 'folder-outline' : recent.kind === kindEnum.PAGE ? 'file-text-outline' : 'file-outline'\"\n\t\t\t\tsize=\"tiny\"\n\t\t\t></nb-icon>\n\t\t\t<span class=\"docs-tree-link-name\">{{ recent.name }}</span>\n\t\t</a>\n\t</div>\n\n\t<!-- Tree -->\n\t<div class=\"docs-tree-section docs-tree-main\">\n\t\t<!-- The section title doubles as the root crumb: drilled into a folder, this is the\n\t\t     sidebar's way back to \"everything\" (`00-product-spec.md` \u00A76.9 R-TRE-01). A real\n\t\t     <button> so focus, Enter and Space come from the platform; the SCSS only undoes\n\t\t     the user-agent chrome, so it still renders as the section label it always was. -->\n\t\t<button type=\"button\" class=\"docs-tree-section-title docs-tree-root\" (click)=\"goToRoot()\">\n\t\t\t{{ 'DOCS.TREE.ALL_DOCUMENTS' | translate }}\n\t\t</button>\n\t\t<div class=\"docs-tree-empty\" *ngIf=\"!nodes.length\">\n\t\t\t<span>{{ 'DOCS.TREE.EMPTY' | translate }}</span>\n\t\t\t<!-- An empty tree has no node to raise a context menu on, so without these the\n\t\t\t     first folder/page of a brand-new organization is unreachable from the sidebar. -->\n\t\t\t<div class=\"docs-tree-empty-actions\" *ngIf=\"canCreate\">\n\t\t\t\t<button nbButton ghost size=\"tiny\" (click)=\"createAtRoot(kindEnum.FOLDER)\">\n\t\t\t\t\t{{ 'DOCS.TREE.NEW_FOLDER' | translate }}\n\t\t\t\t</button>\n\t\t\t\t<button nbButton ghost size=\"tiny\" (click)=\"createAtRoot(kindEnum.PAGE)\">\n\t\t\t\t\t{{ 'DOCS.TREE.NEW_PAGE' | translate }}\n\t\t\t\t</button>\n\t\t\t\t<button nbButton ghost size=\"tiny\" (click)=\"uploadHere()\">\n\t\t\t\t\t{{ 'DOCS.UPLOAD.BUTTON' | translate }}\n\t\t\t\t</button>\n\t\t\t</div>\n\t\t</div>\n\t\t<tree-root #tree [nodes]=\"nodes\" [options]=\"options\" (moveNode)=\"onMoveNode($event)\" (activate)=\"onNodeActivate($event)\">\n\t\t\t<ng-template #treeNodeTemplate let-node let-index=\"index\">\n\t\t\t\t<span class=\"docs-tree-node\">\n\t\t\t\t\t<span class=\"docs-tree-node-icon\" *ngIf=\"node.data.icon; else defaultIcon\">{{ node.data.icon }}</span>\n\t\t\t\t\t<ng-template #defaultIcon>\n\t\t\t\t\t\t<nb-icon [icon]=\"kindIcon(node.data)\" size=\"tiny\" [style.color]=\"node.data.color || null\"></nb-icon>\n\t\t\t\t\t</ng-template>\n\t\t\t\t\t<span class=\"docs-tree-node-name\">{{ node.data.name }}</span>\n\t\t\t\t\t<nb-icon\n\t\t\t\t\t\t*ngIf=\"node.data.isLocked\"\n\t\t\t\t\t\ticon=\"lock-outline\"\n\t\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\t\tclass=\"docs-tree-node-badge\"\n\t\t\t\t\t></nb-icon>\n\t\t\t\t\t<nb-icon\n\t\t\t\t\t\t*ngIf=\"node.data.visibility === 'PRIVATE'\"\n\t\t\t\t\t\ticon=\"eye-off-outline\"\n\t\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\t\tclass=\"docs-tree-node-badge\"\n\t\t\t\t\t\t[nbTooltip]=\"'DOCS.VISIBILITY.PRIVATE' | translate\"\n\t\t\t\t\t></nb-icon>\n\t\t\t\t\t<button\n\t\t\t\t\t\t*ngIf=\"menuItemsFor(node.data).length\"\n\t\t\t\t\t\tnbButton\n\t\t\t\t\t\tghost\n\t\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\t\tclass=\"docs-tree-node-menu\"\n\t\t\t\t\t\t[nbContextMenu]=\"menuItemsFor(node.data)\"\n\t\t\t\t\t\t[nbContextMenuTag]=\"menuTag(node.data)\"\n\t\t\t\t\t\t[attr.data-docs-node-menu]=\"node.data.id\"\n\t\t\t\t\t\t(click)=\"$event.stopPropagation()\"\n\t\t\t\t\t\t[attr.aria-label]=\"'DOCS.A11Y.NODE_ACTIONS' | translate\"\n\t\t\t\t\t>\n\t\t\t\t\t\t<nb-icon icon=\"more-horizontal-outline\" size=\"tiny\"></nb-icon>\n\t\t\t\t\t</button>\n\t\t\t\t</span>\n\t\t\t</ng-template>\n\t\t</tree-root>\n\t</div>\n</div>\n", styles: ["@charset \"UTF-8\";:host{display:block;min-width:0}.docs-tree{--docs-body-size: .75rem;--docs-meta-size: .6875rem;--docs-label-size: .625rem;--docs-tree-row-height: 1.5rem;display:flex;flex-direction:column;gap:.75rem;font-size:var(--docs-body-size, .75rem);min-height:0;padding-inline-start:.125rem}.docs-tree-section{min-width:0}.docs-tree-section-title{font-size:var(--docs-label-size, .625rem);font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:var(--docs-text-muted, var(--text-hint-color));margin-bottom:.1875rem;padding-inline:.375rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.docs-tree-link{display:flex;align-items:center;gap:.375rem;min-height:var(--docs-tree-row-height, 1.5rem);padding:0 .375rem;border-radius:var(--docs-radius, .375rem);cursor:pointer;color:var(--docs-text, var(--text-basic-color));text-decoration:none}.docs-tree-link:hover{background:var(--docs-hover, rgba(126, 126, 143, .12));color:var(--docs-text, var(--text-basic-color))}.docs-tree-link nb-icon{flex:0 0 auto;font-size:.8125rem;color:var(--docs-text-muted, var(--text-hint-color))}.docs-tree-link .docs-tree-link-name{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.docs-tree-main{flex:1 1 auto;min-height:0}.docs-tree-root{display:block;width:100%;padding:0 .375rem;border:0;background:none;font-family:inherit;line-height:inherit;text-align:inherit;cursor:pointer}.docs-tree-root:hover{color:var(--docs-text, var(--text-basic-color))}.docs-tree-empty{display:flex;flex-direction:column;align-items:flex-start;gap:.25rem;color:var(--docs-text-muted, var(--text-hint-color));padding:.5rem .375rem;font-size:var(--docs-meta-size, .75rem)}.docs-tree-empty .docs-tree-empty-actions{display:flex;flex-wrap:wrap;gap:.25rem}.docs-tree-empty button[nbButton]{height:1.5rem;min-height:1.5rem;padding-inline:.375rem;border-radius:var(--docs-radius, .375rem);font-size:var(--docs-meta-size, .75rem)}.docs-tree-node{display:flex;align-items:center;gap:.375rem;width:100%;max-width:100%;min-width:0}.docs-tree-node .docs-tree-node-name{flex:0 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.docs-tree-node>nb-icon{flex:0 0 auto}.docs-tree-node .docs-tree-node-badge{flex:0 0 auto;color:var(--docs-text-muted, var(--text-hint-color))}.docs-tree-node .docs-tree-node-menu{flex:0 0 auto;margin-inline-start:auto;width:1.25rem;height:1.25rem;padding:0;border-radius:var(--docs-radius, .375rem);visibility:hidden}.docs-tree-node .docs-tree-node-menu nb-icon{margin:0}.docs-tree-node:hover .docs-tree-node-menu,.docs-tree-node .docs-tree-node-menu:focus{visibility:visible}:host ::ng-deep tree-node-content{display:block;min-width:0}:host ::ng-deep .node-wrapper{align-items:center;gap:.125rem}:host ::ng-deep .node-content-wrapper{display:flex;align-items:center;width:100%;min-width:0;min-height:var(--docs-tree-row-height, 1.5rem);padding:0 .375rem;border-radius:var(--docs-radius, .375rem);box-shadow:none;font-weight:400;transition:background-color .12s ease}:host ::ng-deep .node-content-wrapper:hover{background:var(--docs-hover, rgba(126, 126, 143, .12))}:host ::ng-deep .node-content-wrapper-active,:host ::ng-deep .node-content-wrapper.node-content-wrapper-active:hover,:host ::ng-deep .node-content-wrapper-active.node-content-wrapper-focused{background:var(--docs-active, rgba(126, 126, 143, .2));color:var(--docs-text, var(--text-basic-color));font-weight:500}:host ::ng-deep .node-content-wrapper-focused{background:var(--docs-hover, rgba(126, 126, 143, .12))}:host ::ng-deep .tree-children{position:relative;padding-inline-start:.75rem;margin-inline-start:.375rem;border-inline-start:1px solid var(--docs-hairline, rgba(126, 126, 143, .18))}:host ::ng-deep .toggle-children-wrapper{display:inline-flex;align-items:center;justify-content:center;width:1rem;height:var(--docs-tree-row-height, 1.5rem);padding:0}:host ::ng-deep .toggle-children{top:0;width:0;height:0;background-image:none;border-top:.25rem solid transparent;border-bottom:.25rem solid transparent;border-inline-start:.3125rem solid var(--docs-text-muted, var(--text-hint-color))}:host ::ng-deep .toggle-children-placeholder{width:1rem;height:0;padding:0}:host ::ng-deep .node-drop-slot.is-dragging-over{height:.25rem;border:0;border-radius:1rem;background:var(--color-primary-default)}\n"], dependencies: [{ kind: "directive", type: i11.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i11.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: i12.TreeComponent, selector: "Tree, tree-root", inputs: ["nodes", "options", "focused", "state"], outputs: ["toggleExpanded", "activate", "deactivate", "nodeActivate", "nodeDeactivate", "select", "deselect", "focus", "blur", "updateData", "initialized", "moveNode", "copyNode", "loadNodeChildren", "changeFilter", "event", "stateChange"] }, { kind: "component", type: i9.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "directive", type: i9.NbContextMenuDirective, selector: "[nbContextMenu]", inputs: ["nbContextMenuPlacement", "nbContextMenuAdjustment", "nbContextMenuTag", "nbContextMenu", "nbContextMenuTrigger", "nbContextMenuClass"] }, { kind: "component", type: i9.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "directive", type: i9.NbTooltipDirective, selector: "[nbTooltip]", inputs: ["nbTooltip", "nbTooltipPlacement", "nbTooltipAdjustment", "nbTooltipClass", "nbTooltipIcon", "nbTooltipStatus", "nbTooltipTrigger", "nbTooltipOffset", "nbTooltipDisabled"], outputs: ["nbTooltipShowStateChange"], exportAs: ["nbTooltip"] }, { kind: "pipe", type: i11.AsyncPipe, name: "async" }, { kind: "pipe", type: i1.TranslatePipe, name: "translate" }] }); }
};
DocsTreeComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [TranslateService,
        Router,
        ActivatedRoute,
        Actions,
        DocumentTreeStore,
        DocumentsService,
        DocsRowActionsService,
        DocumentPermissionService,
        ToastrService,
        NbDialogService,
        NbMenuService,
        NgxPermissionsService,
        FavoriteStoreService,
        Store])
], DocsTreeComponent);
export { DocsTreeComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DocsTreeComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gz-docs-tree', standalone: false, template: "<div class=\"docs-tree\">\n\t<!-- Favorites -->\n\t<ng-container *ngIf=\"favorites$ | async as favorites\">\n\t\t<div class=\"docs-tree-section\" *ngIf=\"favorites.length\">\n\t\t\t<div class=\"docs-tree-section-title\">{{ 'DOCS.TREE.FAVORITES' | translate }}</div>\n\t\t\t<a class=\"docs-tree-link\" *ngFor=\"let favorite of favorites\" (click)=\"openFavorite(favorite)\">\n\t\t\t\t<nb-icon icon=\"star-outline\" size=\"tiny\"></nb-icon>\n\t\t\t\t<span class=\"docs-tree-link-name\">{{ favorite.title }}</span>\n\t\t\t</a>\n\t\t</div>\n\t</ng-container>\n\n\t<!-- Recents -->\n\t<div class=\"docs-tree-section\" *ngIf=\"recents.length\">\n\t\t<div class=\"docs-tree-section-title\">{{ 'DOCS.TREE.RECENTS' | translate }}</div>\n\t\t<a class=\"docs-tree-link\" *ngFor=\"let recent of recents\" (click)=\"openRecent(recent)\">\n\t\t\t<nb-icon\n\t\t\t\t[icon]=\"recent.kind === kindEnum.FOLDER ? 'folder-outline' : recent.kind === kindEnum.PAGE ? 'file-text-outline' : 'file-outline'\"\n\t\t\t\tsize=\"tiny\"\n\t\t\t></nb-icon>\n\t\t\t<span class=\"docs-tree-link-name\">{{ recent.name }}</span>\n\t\t</a>\n\t</div>\n\n\t<!-- Tree -->\n\t<div class=\"docs-tree-section docs-tree-main\">\n\t\t<!-- The section title doubles as the root crumb: drilled into a folder, this is the\n\t\t     sidebar's way back to \"everything\" (`00-product-spec.md` \u00A76.9 R-TRE-01). A real\n\t\t     <button> so focus, Enter and Space come from the platform; the SCSS only undoes\n\t\t     the user-agent chrome, so it still renders as the section label it always was. -->\n\t\t<button type=\"button\" class=\"docs-tree-section-title docs-tree-root\" (click)=\"goToRoot()\">\n\t\t\t{{ 'DOCS.TREE.ALL_DOCUMENTS' | translate }}\n\t\t</button>\n\t\t<div class=\"docs-tree-empty\" *ngIf=\"!nodes.length\">\n\t\t\t<span>{{ 'DOCS.TREE.EMPTY' | translate }}</span>\n\t\t\t<!-- An empty tree has no node to raise a context menu on, so without these the\n\t\t\t     first folder/page of a brand-new organization is unreachable from the sidebar. -->\n\t\t\t<div class=\"docs-tree-empty-actions\" *ngIf=\"canCreate\">\n\t\t\t\t<button nbButton ghost size=\"tiny\" (click)=\"createAtRoot(kindEnum.FOLDER)\">\n\t\t\t\t\t{{ 'DOCS.TREE.NEW_FOLDER' | translate }}\n\t\t\t\t</button>\n\t\t\t\t<button nbButton ghost size=\"tiny\" (click)=\"createAtRoot(kindEnum.PAGE)\">\n\t\t\t\t\t{{ 'DOCS.TREE.NEW_PAGE' | translate }}\n\t\t\t\t</button>\n\t\t\t\t<button nbButton ghost size=\"tiny\" (click)=\"uploadHere()\">\n\t\t\t\t\t{{ 'DOCS.UPLOAD.BUTTON' | translate }}\n\t\t\t\t</button>\n\t\t\t</div>\n\t\t</div>\n\t\t<tree-root #tree [nodes]=\"nodes\" [options]=\"options\" (moveNode)=\"onMoveNode($event)\" (activate)=\"onNodeActivate($event)\">\n\t\t\t<ng-template #treeNodeTemplate let-node let-index=\"index\">\n\t\t\t\t<span class=\"docs-tree-node\">\n\t\t\t\t\t<span class=\"docs-tree-node-icon\" *ngIf=\"node.data.icon; else defaultIcon\">{{ node.data.icon }}</span>\n\t\t\t\t\t<ng-template #defaultIcon>\n\t\t\t\t\t\t<nb-icon [icon]=\"kindIcon(node.data)\" size=\"tiny\" [style.color]=\"node.data.color || null\"></nb-icon>\n\t\t\t\t\t</ng-template>\n\t\t\t\t\t<span class=\"docs-tree-node-name\">{{ node.data.name }}</span>\n\t\t\t\t\t<nb-icon\n\t\t\t\t\t\t*ngIf=\"node.data.isLocked\"\n\t\t\t\t\t\ticon=\"lock-outline\"\n\t\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\t\tclass=\"docs-tree-node-badge\"\n\t\t\t\t\t></nb-icon>\n\t\t\t\t\t<nb-icon\n\t\t\t\t\t\t*ngIf=\"node.data.visibility === 'PRIVATE'\"\n\t\t\t\t\t\ticon=\"eye-off-outline\"\n\t\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\t\tclass=\"docs-tree-node-badge\"\n\t\t\t\t\t\t[nbTooltip]=\"'DOCS.VISIBILITY.PRIVATE' | translate\"\n\t\t\t\t\t></nb-icon>\n\t\t\t\t\t<button\n\t\t\t\t\t\t*ngIf=\"menuItemsFor(node.data).length\"\n\t\t\t\t\t\tnbButton\n\t\t\t\t\t\tghost\n\t\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\t\tclass=\"docs-tree-node-menu\"\n\t\t\t\t\t\t[nbContextMenu]=\"menuItemsFor(node.data)\"\n\t\t\t\t\t\t[nbContextMenuTag]=\"menuTag(node.data)\"\n\t\t\t\t\t\t[attr.data-docs-node-menu]=\"node.data.id\"\n\t\t\t\t\t\t(click)=\"$event.stopPropagation()\"\n\t\t\t\t\t\t[attr.aria-label]=\"'DOCS.A11Y.NODE_ACTIONS' | translate\"\n\t\t\t\t\t>\n\t\t\t\t\t\t<nb-icon icon=\"more-horizontal-outline\" size=\"tiny\"></nb-icon>\n\t\t\t\t\t</button>\n\t\t\t\t</span>\n\t\t\t</ng-template>\n\t\t</tree-root>\n\t</div>\n</div>\n", styles: ["@charset \"UTF-8\";:host{display:block;min-width:0}.docs-tree{--docs-body-size: .75rem;--docs-meta-size: .6875rem;--docs-label-size: .625rem;--docs-tree-row-height: 1.5rem;display:flex;flex-direction:column;gap:.75rem;font-size:var(--docs-body-size, .75rem);min-height:0;padding-inline-start:.125rem}.docs-tree-section{min-width:0}.docs-tree-section-title{font-size:var(--docs-label-size, .625rem);font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:var(--docs-text-muted, var(--text-hint-color));margin-bottom:.1875rem;padding-inline:.375rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.docs-tree-link{display:flex;align-items:center;gap:.375rem;min-height:var(--docs-tree-row-height, 1.5rem);padding:0 .375rem;border-radius:var(--docs-radius, .375rem);cursor:pointer;color:var(--docs-text, var(--text-basic-color));text-decoration:none}.docs-tree-link:hover{background:var(--docs-hover, rgba(126, 126, 143, .12));color:var(--docs-text, var(--text-basic-color))}.docs-tree-link nb-icon{flex:0 0 auto;font-size:.8125rem;color:var(--docs-text-muted, var(--text-hint-color))}.docs-tree-link .docs-tree-link-name{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.docs-tree-main{flex:1 1 auto;min-height:0}.docs-tree-root{display:block;width:100%;padding:0 .375rem;border:0;background:none;font-family:inherit;line-height:inherit;text-align:inherit;cursor:pointer}.docs-tree-root:hover{color:var(--docs-text, var(--text-basic-color))}.docs-tree-empty{display:flex;flex-direction:column;align-items:flex-start;gap:.25rem;color:var(--docs-text-muted, var(--text-hint-color));padding:.5rem .375rem;font-size:var(--docs-meta-size, .75rem)}.docs-tree-empty .docs-tree-empty-actions{display:flex;flex-wrap:wrap;gap:.25rem}.docs-tree-empty button[nbButton]{height:1.5rem;min-height:1.5rem;padding-inline:.375rem;border-radius:var(--docs-radius, .375rem);font-size:var(--docs-meta-size, .75rem)}.docs-tree-node{display:flex;align-items:center;gap:.375rem;width:100%;max-width:100%;min-width:0}.docs-tree-node .docs-tree-node-name{flex:0 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.docs-tree-node>nb-icon{flex:0 0 auto}.docs-tree-node .docs-tree-node-badge{flex:0 0 auto;color:var(--docs-text-muted, var(--text-hint-color))}.docs-tree-node .docs-tree-node-menu{flex:0 0 auto;margin-inline-start:auto;width:1.25rem;height:1.25rem;padding:0;border-radius:var(--docs-radius, .375rem);visibility:hidden}.docs-tree-node .docs-tree-node-menu nb-icon{margin:0}.docs-tree-node:hover .docs-tree-node-menu,.docs-tree-node .docs-tree-node-menu:focus{visibility:visible}:host ::ng-deep tree-node-content{display:block;min-width:0}:host ::ng-deep .node-wrapper{align-items:center;gap:.125rem}:host ::ng-deep .node-content-wrapper{display:flex;align-items:center;width:100%;min-width:0;min-height:var(--docs-tree-row-height, 1.5rem);padding:0 .375rem;border-radius:var(--docs-radius, .375rem);box-shadow:none;font-weight:400;transition:background-color .12s ease}:host ::ng-deep .node-content-wrapper:hover{background:var(--docs-hover, rgba(126, 126, 143, .12))}:host ::ng-deep .node-content-wrapper-active,:host ::ng-deep .node-content-wrapper.node-content-wrapper-active:hover,:host ::ng-deep .node-content-wrapper-active.node-content-wrapper-focused{background:var(--docs-active, rgba(126, 126, 143, .2));color:var(--docs-text, var(--text-basic-color));font-weight:500}:host ::ng-deep .node-content-wrapper-focused{background:var(--docs-hover, rgba(126, 126, 143, .12))}:host ::ng-deep .tree-children{position:relative;padding-inline-start:.75rem;margin-inline-start:.375rem;border-inline-start:1px solid var(--docs-hairline, rgba(126, 126, 143, .18))}:host ::ng-deep .toggle-children-wrapper{display:inline-flex;align-items:center;justify-content:center;width:1rem;height:var(--docs-tree-row-height, 1.5rem);padding:0}:host ::ng-deep .toggle-children{top:0;width:0;height:0;background-image:none;border-top:.25rem solid transparent;border-bottom:.25rem solid transparent;border-inline-start:.3125rem solid var(--docs-text-muted, var(--text-hint-color))}:host ::ng-deep .toggle-children-placeholder{width:1rem;height:0;padding:0}:host ::ng-deep .node-drop-slot.is-dragging-over{height:.25rem;border:0;border-radius:1rem;background:var(--color-primary-default)}\n"] }]
        }], ctorParameters: () => [{ type: i1.TranslateService }, { type: i2.Router }, { type: i2.ActivatedRoute }, { type: i3.Actions }, { type: i4.DocumentTreeStore }, { type: i5.DocumentsService }, { type: i6.DocsRowActionsService }, { type: i7.DocumentPermissionService }, { type: i8.ToastrService }, { type: i9.NbDialogService }, { type: i9.NbMenuService }, { type: i10.NgxPermissionsService }, { type: i8.FavoriteStoreService }, { type: i8.Store }], propDecorators: { tree: [{
                type: ViewChild,
                args: [TreeComponent]
            }] } });
//# sourceMappingURL=docs-tree.component.js.map