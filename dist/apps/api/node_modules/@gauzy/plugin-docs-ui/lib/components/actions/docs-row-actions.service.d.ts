import { OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { Actions } from '@ngneat/effects-ng';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { ID } from '@gauzy/contracts';
import { GenericFavoriteService, FavoriteStoreService, Store, ToastrService } from '@gauzy/ui-core/core';
import { DocsExportService } from '../../services/docs-export.service';
import { DocumentTreeStore } from '../../services/document-tree.store';
import { DocumentsService } from '../../services/documents.service';
import { DocsActionId, IDocsActionTarget } from './docs-action-menu';
import * as i0 from "@angular/core";
/**
 * Runs one row/context-menu action, wherever it was raised from.
 *
 * The tree, the table kebab and the cards kebab all build their items from
 * `buildDocsActionMenu()` and hand the result here, so a mutation behaves
 * identically on all three: same dialogs, same toasts, same tree-cache
 * invalidation and the same store actions (`rowChanged` / `rowRemoved` /
 * `loadDocuments`) that keep the list, facets and preset counts honest.
 *
 * 🛑 The **view** actions (`open` / `details` / `preview`) are deliberately NOT
 * handled here — those need the caller's route context and per-surface meaning
 * (in the tree, opening a FILE means the detail panel; in the table it means the
 * preview modal). `execute()` returns `false` for them so a surface that forgets
 * to route one does nothing rather than doing the wrong thing.
 */
export declare class DocsRowActionsService implements OnDestroy {
    private readonly translateService;
    private readonly documentsService;
    private readonly exportService;
    private readonly treeStore;
    private readonly dialogService;
    private readonly toastrService;
    private readonly actions;
    private readonly router;
    private readonly favoriteStore;
    private readonly genericFavoriteService;
    private readonly store;
    /** Document ids the current user has starred; derived from the shared favorites store. */
    private readonly _favoriteIds$;
    readonly favoriteIds$: Observable<ReadonlySet<string>>;
    /**
     * `FavoriteStoreService` is app-root-scoped and outlives this module-scoped
     * service, so its stream is released explicitly — an unmanaged subscription to
     * a root singleton keeps the whole plugin chunk alive after a route teardown.
     */
    private readonly favoritesSubscription;
    constructor(translateService: TranslateService, documentsService: DocumentsService, exportService: DocsExportService, treeStore: DocumentTreeStore, dialogService: NbDialogService, toastrService: ToastrService, actions: Actions, router: Router, favoriteStore: FavoriteStoreService, genericFavoriteService: GenericFavoriteService, store: Store);
    ngOnDestroy(): void;
    /** Star state for the menu label (`Favorite` vs `Unfavorite`). */
    isFavorite(id: ID): boolean;
    /**
     * Runs `action` against `target`.
     *
     * **Never rejects** — every caller is a menu-click subscription that cannot
     * await it, so an escaping rejection would be an unhandled one. Returns true
     * when something actually changed (the caller may refresh its own surface).
     */
    execute(action: DocsActionId | undefined, target: IDocsActionTarget): Promise<boolean>;
    private createChild;
    /**
     * Hands the upload flow the destination folder through the browse page's
     * one-shot `?upload=1&folder=` deep link.
     *
     * The empty command array is what keeps the current route: Angular's
     * `createUrlTree` short-circuits on `commands.length === 0` and reuses the
     * active URL, so this is a pure query-param merge from any Documents route
     * (the effects write the hub's URL exactly the same way).
     */
    private uploadHere;
    private rename;
    private move;
    /**
     * `POST /:id/duplicate` with `{ deep }` — the deep copy is what the "with
     * children" item sends. A shallow duplicate of a container keeps the copy
     * empty, which is why the two are separate items rather than one guess.
     */
    private duplicate;
    private toggleFavorite;
    /** Deep link to the row: a PAGE opens its editor route, anything else the detail panel. */
    deepLink(target: IDocsActionTarget): string;
    private copyLink;
    /**
     * `GET /:id/download` is a JWT-guarded JSON endpoint answering `{ url }`, not a
     * redirect: the signed provider URL has to be resolved through the
     * authenticated client first and only then opened.
     */
    private download;
    private exportMarkdown;
    private setKnowledge;
    /**
     * Archive/unarchive both cascade over the subtree and both move the row across
     * the `archived` scope, so the list is re-queried rather than patched: which
     * way the row travels depends on the active preset, and `loadDocuments` also
     * refreshes the facets and preset counts.
     */
    private setArchived;
    /**
     * Archived-only delete with the subtree-vs-promote prompt (`01-ux-spec.md`
     * §10.11). The dialog owns the choice; this only forwards it.
     */
    private remove;
    /** `TranslationBaseComponent.getTranslation` is component-side; the service reads the same store. */
    private getTranslation;
    /** `/pages/documents?id=<uuid>` → `<uuid>`; anything else is not a Documents favorite. */
    private documentIdOfLink;
    static ɵfac: i0.ɵɵFactoryDeclaration<DocsRowActionsService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<DocsRowActionsService>;
}
