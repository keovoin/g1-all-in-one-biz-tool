import { OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ITreeOptions } from '@ali-hm/angular-tree-component';
import { NbDialogService, NbMenuItem, NbMenuService } from '@nebular/theme';
import { Actions } from '@ngneat/effects-ng';
import { TranslateService } from '@ngx-translate/core';
import { NgxPermissionsService } from 'ngx-permissions';
import { Observable } from 'rxjs';
import { DocumentKindEnum, ID } from '@gauzy/contracts';
import { FavoriteStoreService, Store, ToastrService } from '@gauzy/ui-core/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { DocumentPermissionService } from '../../services/document-permission.service';
import { DocumentTreeStore, IDocsTreeNode } from '../../services/document-tree.store';
import { DocumentsService } from '../../services/documents.service';
import { DocsRowActionsService } from '../actions/docs-row-actions.service';
import * as i0 from "@angular/core";
interface IRecentEntry {
    id: string;
    name: string;
    kind: DocumentKindEnum;
}
/**
 * Documents tree sidebar: favorites + recents sections above the lazy folder
 * tree. Drag & drop re-parents through the move API with a client-side cycle
 * check; the per-kind context menu is permission-filtered.
 */
export declare class DocsTreeComponent extends TranslationBaseComponent implements OnInit {
    readonly translateService: TranslateService;
    private readonly router;
    private readonly route;
    private readonly actions;
    private readonly treeStore;
    private readonly documentsService;
    private readonly rowActions;
    private readonly documentPermission;
    private readonly toastrService;
    private readonly dialogService;
    private readonly nbMenuService;
    private readonly permissionsService;
    private readonly favoriteStore;
    private readonly store;
    private readonly tree;
    nodes: IDocsTreeNode[];
    recents: IRecentEntry[];
    favorites$: Observable<{
        title: string;
        link?: string;
        icon?: unknown;
    }[]>;
    readonly kindEnum: typeof DocumentKindEnum;
    /** Public: the empty-state create buttons are gated on it in the template. */
    canCreate: boolean;
    private canUpdate;
    private canDelete;
    private canAiImport;
    /** nodeId → last built menu, keyed by the signature it was built from. */
    private readonly menuCache;
    options: ITreeOptions;
    constructor(translateService: TranslateService, router: Router, route: ActivatedRoute, actions: Actions, treeStore: DocumentTreeStore, documentsService: DocumentsService, rowActions: DocsRowActionsService, documentPermission: DocumentPermissionService, toastrService: ToastrService, dialogService: NbDialogService, nbMenuService: NbMenuService, permissionsService: NgxPermissionsService, favoriteStore: FavoriteStoreService, store: Store);
    ngOnInit(): void;
    onNodeActivate(event: {
        node: {
            data: IDocsTreeNode;
        };
    }): void;
    /** Section title / root crumb — clears the folder scope back to "All documents". */
    goToRoot(): void;
    /**
     * Creates a FOLDER or PAGE at the **root**.
     *
     * Deliberately not routed through `DocsRowActionsService.execute('new-folder')`:
     * that executor creates a child *of a target node*, and the whole point of this
     * affordance is the state where no node exists. A created page opens straight in
     * the editor, matching what activating a PAGE node does; a folder stays put and
     * only refreshes the surfaces that show it.
     */
    createAtRoot(kind: DocumentKindEnum): Promise<void>;
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
    uploadHere(): void;
    onMoveNode(event: {
        node: IDocsTreeNode;
        to: {
            parent?: {
                id?: ID;
                virtual?: boolean;
            };
            index: number;
        };
    }): Promise<void>;
    menuTag(node: IDocsTreeNode): string;
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
    menuItemsFor(node: IDocsTreeNode): NbMenuItem[];
    private menuContext;
    /**
     * Runs one context-menu action.
     *
     * 🛑 **Never rejects.** The only caller is the `nbMenuService.onItemClick()` subscription,
     * which cannot await it, so an escaping rejection would be an unhandled one.
     * `DocsRowActionsService.execute()` owns its failure path for every mutation; the
     * `open` branch below is the only tree-local one and cannot throw.
     */
    private onContextAction;
    /**
     * Runs one row action for the focused node through the SAME executor the context
     * menu uses, so F2/Delete open the same dialogs and raise the same toasts and
     * invalidations as their menu items.
     *
     * 🛑 **Never rejects** — the caller is the tree's synchronous key dispatcher,
     * which cannot await it. `execute()` owns its own failure path.
     */
    private runNodeAction;
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
    private reorderNode;
    /**
     * `Shift+F10` / the context-menu key — opens the focused node's kebab.
     *
     * `[nbContextMenu]` exposes no imperative open handle, so the trigger button is
     * addressed by the `data-docs-node-menu` attribute the node template stamps with
     * the node id and clicked: the overlay then anchors exactly as it does on a
     * pointer click. The button is `visibility: hidden` until hover/focus, which does
     * not block a synthetic click.
     */
    private openNodeContextMenu;
    kindIcon(node: IDocsTreeNode): string;
    private recentsKey;
    private loadRecents;
    private recordRecent;
    openFavorite(favorite: {
        link?: string;
    }): void;
    openRecent(entry: IRecentEntry): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DocsTreeComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DocsTreeComponent, "gz-docs-tree", never, {}, {}, never, never, false, never>;
}
export {};
