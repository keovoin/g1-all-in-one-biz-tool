import { Params } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@gauzy/ui-core/core';
import { IDocsSavedView } from '../models/docs-saved-view.model';
import * as i0 from "@angular/core";
/**
 * Device-local named filter views (`01-ux-spec.md` §5, phased M5).
 *
 * Storage is `localStorage['gauzy_docs_saved_views_<orgId>']` — **never** the
 * server in v1 (spec 04 §13 open question: "confirm device-local vs server-side
 * when M5 is scoped"; this suite ships device-local). Because the URL is already
 * the single source of truth for browse state (§5.1), a view stores nothing but
 * the canonical query-param set, which keeps it forward-compatible with params
 * added to §5.1 later.
 *
 * Reads are defensive on every hop: another tab, an older build, or a user
 * poking at devtools can leave anything under that key, so a malformed blob
 * degrades to "no saved views" instead of throwing inside the filter bar.
 */
export declare class DocsSavedViewsService {
    private readonly store;
    private readonly _views$;
    readonly views$: Observable<IDocsSavedView[]>;
    /** The organization the currently loaded list belongs to (guards org switches). */
    private loadedOrganizationId;
    constructor(store: Store);
    get views(): IDocsSavedView[];
    /** Re-reads storage when the key changes (first use, organization switch). */
    refresh(): void;
    /**
     * Stores the current query string under `name`. A name that already exists is
     * *overwritten* rather than duplicated: users treat "Save view" with the same
     * name as "update this view", and two identically named rows are unusable.
     */
    save(name: string, params: Params): IDocsSavedView | null;
    rename(id: string, name: string): boolean;
    remove(id: string): void;
    find(id: string): IDocsSavedView | undefined;
    /** True when the saved view's params match the ones currently in the URL. */
    matches(view: IDocsSavedView, params: Params): boolean;
    /**
     * Query-param patch that applies a view.
     *
     * 🛑 Every param the view *owns but does not carry* is explicitly set to
     * `null` so the router's merge write deletes it. Without that, applying a
     * narrow view on top of a wider one leaves the old facets in place and the
     * user sees a result set no saved view ever described. `page` is reset for
     * the same reason (page 7 of the previous view is meaningless here).
     */
    toApplyPatch(view: IDocsSavedView): Params;
    /** Keeps only the §5.1 params a view owns, as plain non-empty strings. */
    private captureParams;
    private sanitizeName;
    private storageKey;
    private organizationId;
    private nextId;
    /** Tolerates absent / malformed / partially-shaped storage without throwing. */
    private read;
    /** A full localStorage quota must not take the filter bar down with it. */
    private write;
    static ɵfac: i0.ɵɵFactoryDeclaration<DocsSavedViewsService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<DocsSavedViewsService>;
}
