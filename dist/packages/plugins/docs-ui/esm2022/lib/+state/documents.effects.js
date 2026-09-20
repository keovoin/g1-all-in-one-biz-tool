import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { createEffect, ofType } from '@ngneat/effects';
import { Actions } from '@ngneat/effects-ng';
import { catchError, debounceTime, EMPTY, switchMap, tap } from 'rxjs';
import { Store } from '@gauzy/ui-core/core';
import { DOCS_CARDS_PAGE_SIZE, DOCS_DEFAULT_PAGE_SIZE, DOCS_FILTER_DEBOUNCE_MS } from '../docs.constants';
import { applyPreset, createInitialDocsFilterState, docsFilterToParams, expandStatusFilterForApi } from '../models/docs-filter.model';
import { DocumentsService } from '../services/documents.service';
import { DocumentsActions } from './documents.actions';
import { DocumentsQuery } from './documents.query';
import { DocumentsStore } from './documents.store';
import * as i0 from "@angular/core";
import * as i1 from "@ngneat/effects-ng";
import * as i2 from "./documents.store";
import * as i3 from "./documents.query";
import * as i4 from "../services/documents.service";
import * as i5 from "@gauzy/ui-core/core";
import * as i6 from "@angular/router";
/**
 * Effects for the Documents hub browse state: debounced loads, stale-response
 * rejection via `loadSeq`, facet refresh on settle, and the URL write side
 * effect (merge write, `replaceUrl: true`). Effects never write the URL on
 * `pollTick`.
 */
export class DocumentsEffects {
    /** Multi-select facet keys — same name on `DocsFilterState` and `IDocumentFindInput`. */
    static { this.FACET_FILTER_KEYS = [
        'kind',
        'status',
        'knowledgeStatus',
        'reviewStatus',
        'source',
        'categoryIds',
        'tagIds'
    ]; }
    /** `DocsFilterState` date key → the `GetDocumentsQueryDTO` name it maps to. */
    static { this.DATE_FILTER_KEYS = [
        ['createdFrom', 'createdAtFrom'],
        ['createdTo', 'createdAtTo'],
        ['updatedFrom', 'updatedAtFrom'],
        ['updatedTo', 'updatedAtTo']
    ]; }
    constructor(action$, documentsStore, documentsQuery, documentsService, store, router) {
        this.action$ = action$;
        this.documentsStore = documentsStore;
        this.documentsQuery = documentsQuery;
        this.documentsService = documentsService;
        this.store = store;
        this.router = router;
        // ─── Filter / preset / folder / pagination ───────────────────
        this.filterChanged$ = createEffect(() => this.action$.pipe(ofType(DocumentsActions.filterChanged), tap(({ filter }) => {
            this.documentsStore.updateFilter(filter);
            this.documentsStore.update({ pagination: { ...this.documentsQuery.pagination, page: 1 } });
        }), debounceTime(DOCS_FILTER_DEBOUNCE_MS), tap(() => {
            this.writeStateToUrl();
            this.action$.dispatch(DocumentsActions.loadDocuments());
        })));
        this.presetToggled$ = createEffect(() => this.action$.pipe(ofType(DocumentsActions.presetToggled), tap(({ preset }) => {
            // Presets replace their implied facet values on a clean base.
            const base = createInitialDocsFilterState();
            const current = this.documentsQuery.filter;
            const next = applyPreset({ ...base, q: current.q, searchIn: current.searchIn, sort: current.sort }, preset);
            this.documentsStore.update({
                filter: next,
                pagination: { ...this.documentsQuery.pagination, page: 1 },
                selectedIds: []
            });
            this.writeStateToUrl();
            this.action$.dispatch(DocumentsActions.loadDocuments());
        })));
        this.folderChanged$ = createEffect(() => this.action$.pipe(ofType(DocumentsActions.folderChanged), tap(({ folderId }) => {
            this.documentsStore.update({
                folderId,
                pagination: { ...this.documentsQuery.pagination, page: 1 },
                selectedIds: []
            });
            this.writeStateToUrl();
            this.action$.dispatch(DocumentsActions.loadDocuments());
        })));
        /**
         * Table ↔ cards switch. Each view owns its page size (table 10, cards 24) and
         * both reset to page 1 — a cards "Load more" run must not leak an oversized
         * window into the table. Switching away from the table clears its selection.
         */
        this.viewChanged$ = createEffect(() => this.action$.pipe(ofType(DocumentsActions.viewChanged), tap(({ view }) => {
            if (this.documentsQuery.view === view)
                return;
            this.documentsStore.update({
                view,
                selectedIds: view === 'cards' ? [] : this.documentsQuery.selectedIds,
                pagination: {
                    page: 1,
                    pageSize: view === 'cards' ? DOCS_CARDS_PAGE_SIZE : DOCS_DEFAULT_PAGE_SIZE
                }
            });
        })));
        this.paginationChanged$ = createEffect(() => this.action$.pipe(ofType(DocumentsActions.paginationChanged), tap(({ pagination }) => {
            this.documentsStore.update({ pagination });
            this.writeStateToUrl();
            this.action$.dispatch(DocumentsActions.loadDocuments());
        })));
        // ─── Detail panel / selection / row patches ──────────────────
        this.detailOpened$ = createEffect(() => this.action$.pipe(ofType(DocumentsActions.detailOpened), tap(({ id }) => {
            this.documentsStore.update({ detailId: id });
            this.mergeUrlParams({ id: String(id) });
        })));
        this.detailClosed$ = createEffect(() => this.action$.pipe(ofType(DocumentsActions.detailClosed), tap(() => {
            this.documentsStore.update({ detailId: null });
            this.mergeUrlParams({ id: null });
        })));
        this.selectionChanged$ = createEffect(() => this.action$.pipe(ofType(DocumentsActions.selectionChanged), tap(({ ids }) => this.documentsStore.update({ selectedIds: ids }))));
        this.rowChanged$ = createEffect(() => this.action$.pipe(ofType(DocumentsActions.rowChanged), tap(({ document }) => this.documentsStore.patchRow(document))));
        this.rowRemoved$ = createEffect(() => this.action$.pipe(ofType(DocumentsActions.rowRemoved), tap(({ id }) => {
            this.documentsStore.removeRow(id);
            if (String(this.documentsQuery.detailId) === String(id)) {
                this.action$.dispatch(DocumentsActions.detailClosed());
            }
        })));
        this.bulkCompleted$ = createEffect(() => this.action$.pipe(ofType(DocumentsActions.bulkCompleted), tap(({ options }) => {
            if (options?.destructive) {
                this.documentsStore.update({ selectedIds: [] });
            }
            this.action$.dispatch(DocumentsActions.loadDocuments());
            this.action$.dispatch(DocumentsActions.refreshFacets());
        })));
        // ─── Loading ─────────────────────────────────────────────────
        this.loadDocuments$ = createEffect(() => this.action$.pipe(ofType(DocumentsActions.loadDocuments), switchMap(({ options }) => {
            const silent = !!options?.silent;
            const seq = this.documentsStore.nextLoadSeq();
            if (!silent) {
                this.documentsStore.update({ loading: true, error: false });
            }
            // 'accumulated' keeps an already loaded-more cards grid whole.
            return this.documentsService.getAll(this.buildFindInput('accumulated')).pipe(tap((result) => {
                if (seq !== this.documentsStore.state.loadSeq)
                    return; // stale response
                this.documentsStore.update({
                    rows: result.items ?? [],
                    totalCount: result.total ?? 0,
                    loading: false,
                    error: false
                });
                if (!silent) {
                    this.action$.dispatch(DocumentsActions.refreshFacets());
                }
            }), catchError(() => {
                if (seq === this.documentsStore.state.loadSeq && !silent) {
                    this.documentsStore.update({ loading: false, error: true });
                }
                return EMPTY;
            }));
        })));
        /**
         * Cards "Load more" (`01-ux-spec.md` §4.2): bumps the page, fetches ONLY that
         * slice and appends it. No URL write — the shareable link stays page 1. A
         * failed append rolls the page counter back so the button stays usable.
         */
        this.loadMore$ = createEffect(() => this.action$.pipe(ofType(DocumentsActions.loadMore), switchMap(() => {
            const { pagination, rows, totalCount, loading } = this.documentsStore.state;
            if (loading || rows.length >= totalCount)
                return EMPTY;
            const previousPage = pagination.page;
            this.documentsStore.update({
                pagination: { ...pagination, page: previousPage + 1 },
                loading: true,
                error: false
            });
            const seq = this.documentsStore.nextLoadSeq();
            // 'page' window: just the newly requested slice, not the accumulation.
            return this.documentsService.getAll(this.buildFindInput('page')).pipe(tap((result) => {
                if (seq !== this.documentsStore.state.loadSeq)
                    return; // stale response
                this.documentsStore.appendRows(result.items ?? [], result.total ?? totalCount);
                this.documentsStore.update({ loading: false });
            }), catchError(() => {
                if (seq === this.documentsStore.state.loadSeq) {
                    this.documentsStore.update({
                        pagination: { ...this.documentsStore.state.pagination, page: previousPage },
                        loading: false
                    });
                }
                return EMPTY;
            }));
        })));
        /** Silent in-place refresh — no spinner, no pagination reset, no URL write. */
        this.pollTick$ = createEffect(() => this.action$.pipe(ofType(DocumentsActions.pollTick), switchMap(() => 
        // UploadQueueService fetches its off-page ids individually; the effect
        // only refreshes the visible page in place.
        this.documentsService.getAll(this.buildFindInput('accumulated')).pipe(tap((result) => {
            this.documentsStore.update({ rows: result.items ?? [], totalCount: result.total ?? 0 });
        }), catchError(() => EMPTY)))));
        /** Cosmetic — facets and counts fail silently. */
        this.refreshFacets$ = createEffect(() => this.action$.pipe(ofType(DocumentsActions.refreshFacets), switchMap(() => this.documentsService.getFacets(this.buildFindInput('facets')).pipe(tap((facets) => {
            this.documentsStore.update({
                facets,
                presetCounts: facets?.presets
                    ? {
                        all: facets.presets.all ?? 0,
                        needsReview: facets.presets.needsReview ?? 0,
                        notInKnowledge: facets.presets.notInKnowledge ?? 0,
                        archived: facets.presets.archived ?? 0
                    }
                    : this.documentsStore.state.presetCounts
            });
        }), catchError(() => EMPTY)))));
    }
    // ─── Internals ───────────────────────────────────────────────
    /**
     * Builds the list query. Each block below contributes only the keys it can
     * actually express — an omitted key is a filter the DTO never sees.
     *
     * @param window which slice to ask for — see `DocsFindWindow`.
     */
    buildFindInput(window = 'page') {
        const { filter, folderId, pagination, view } = this.documentsStore.state;
        const { organizationId, tenantId } = this.orgContext();
        return {
            organizationId,
            tenantId,
            // 🛑 `GetDocumentsQueryDTO.archived` is `@IsIn(['exclude','include','only'])`
            // — the service maps this boolean, never send it raw.
            archived: filter.archived,
            relations: ['categories', 'tags'],
            ...this.buildFacetFilters(filter),
            ...this.buildSearchScope(filter, folderId),
            ...this.buildDateFilters(filter),
            ...this.buildSortParams(filter),
            ...this.buildWindowParams(window, pagination, view)
        };
    }
    /**
     * The multi-select facets, each copied through only when it carries a selection.
     * All of them (incl. `kind`) travel as the arrays the DTO accepts — CSV or
     * repeated params, `IN (...)` server-side.
     */
    buildFacetFilters(filter) {
        const input = {};
        for (const key of DocumentsEffects.FACET_FILTER_KEYS) {
            if (filter[key].length)
                input[key] = filter[key];
        }
        // 🛑 "Processing" is a two-phase truth: the badge, the facet and the URL all
        // hide UPLOADED behind PROCESSING, so the query has to ask for both or a
        // freshly uploaded row vanishes from the filter that claims to list it.
        if (input.status?.length)
            input.status = expandStatusFilterForApi(input.status);
        return input;
    }
    /** A query and a folder scope are mutually exclusive — search results are flat. */
    buildSearchScope(filter, folderId) {
        if (filter.q)
            return { q: filter.q, searchIn: filter.searchIn };
        return folderId ? { parentId: folderId } : {};
    }
    /**
     * The DTO names are `createdAt*`/`updatedAt*`; the URL param names
     * (`createdFrom`…) are the shareable-link contract and stay as they are.
     */
    buildDateFilters(filter) {
        const input = {};
        for (const [filterKey, dtoKey] of DocumentsEffects.DATE_FILTER_KEYS) {
            if (filter[filterKey])
                input[dtoKey] = filter[filterKey];
        }
        return input;
    }
    /** Two separate params — a composite `updatedAt:desc` fails `@IsIn` on `sort`. */
    buildSortParams(filter) {
        return filter.sort ? { sort: filter.sort.field, sortOrder: filter.sort.order } : {};
    }
    /**
     * 🛑 `skip` is a 1-based PAGE NUMBER, not an offset: the API computes
     * `offset = take × (skip − 1)`, so sending a row offset paged in steps of
     * `pageSize²` (page 2 of 10 landed on rows 91-100). The accumulated window
     * is one big page-1 request; the service clamps `take` to the DTO's `@Max(100)`.
     */
    buildWindowParams(window, pagination, view) {
        if (window === 'facets')
            return {};
        const accumulate = window === 'accumulated' && view === 'cards' && pagination.page > 1;
        return {
            skip: accumulate ? 1 : pagination.page,
            take: accumulate ? pagination.page * pagination.pageSize : pagination.pageSize
        };
    }
    orgContext() {
        const organization = this.store.selectedOrganization;
        return organization ? { organizationId: organization.id, tenantId: organization.tenantId } : {};
    }
    /** Single URL write funnel — merge write, `replaceUrl: true`, no history spam. */
    writeStateToUrl() {
        const { filter, folderId, pagination, detailId } = this.documentsStore.state;
        const params = {
            ...docsFilterToParams(filter, pagination),
            folder: folderId ? String(folderId) : null,
            id: detailId ? String(detailId) : null
        };
        this.mergeUrlParams(params);
    }
    mergeUrlParams(params) {
        // `navigate([], …)` targets the CURRENT url — and these effects live on the GLOBAL effects
        // manager, so once the lazy Documents module has loaded they run for the rest of the
        // session, on every page, on debounced timers. Two guards keep that from hijacking the
        // router:
        //
        // 1. Only write while the Documents page is the ACTIVE route. After the user leaves, the
        //    URL belongs to whatever page they navigated to — a background docs write there is
        //    state leakage at best.
        // 2. Never write while ANOTHER navigation is in flight. A same-URL navigate issued
        //    mid-navigation silently SUPERSEDES it (NavigationCancel → NavigationSkipped, no
        //    error, no URL change) — which is exactly how every sidebar click on demo died the
        //    moment the docs module had loaded: the click's imperative navigation was cancelled
        //    by this funnel, while popstate/hash navigations (already past the URL change) kept
        //    working. The dropped write is safe: every effect that lands here re-derives the full
        //    param set from the store, so the next write carries the complete state anyway.
        if (!this.router.url.startsWith('/pages/documents')) {
            return;
        }
        if (this.router.getCurrentNavigation()) {
            return;
        }
        this.router.navigate([], {
            queryParams: params,
            queryParamsHandling: 'merge',
            replaceUrl: true
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DocumentsEffects, deps: [{ token: i1.Actions }, { token: i2.DocumentsStore }, { token: i3.DocumentsQuery }, { token: i4.DocumentsService }, { token: i5.Store }, { token: i6.Router }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DocumentsEffects }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DocumentsEffects, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.Actions }, { type: i2.DocumentsStore }, { type: i3.DocumentsQuery }, { type: i4.DocumentsService }, { type: i5.Store }, { type: i6.Router }] });
//# sourceMappingURL=documents.effects.js.map