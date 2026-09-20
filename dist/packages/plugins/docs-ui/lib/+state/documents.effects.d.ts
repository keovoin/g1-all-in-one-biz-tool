import { Router } from '@angular/router';
import { Actions } from '@ngneat/effects-ng';
import { IDocument, IPagination } from '@gauzy/contracts';
import { Store } from '@gauzy/ui-core/core';
import { DocsFilterState } from '../models/docs-filter.model';
import { DocumentsService } from '../services/documents.service';
import { DocumentsQuery } from './documents.query';
import { DocumentsStore } from './documents.store';
import * as i0 from "@angular/core";
/**
 * Effects for the Documents hub browse state: debounced loads, stale-response
 * rejection via `loadSeq`, facet refresh on settle, and the URL write side
 * effect (merge write, `replaceUrl: true`). Effects never write the URL on
 * `pollTick`.
 */
export declare class DocumentsEffects {
    private readonly action$;
    private readonly documentsStore;
    private readonly documentsQuery;
    private readonly documentsService;
    private readonly store;
    private readonly router;
    /** Multi-select facet keys — same name on `DocsFilterState` and `IDocumentFindInput`. */
    private static readonly FACET_FILTER_KEYS;
    /** `DocsFilterState` date key → the `GetDocumentsQueryDTO` name it maps to. */
    private static readonly DATE_FILTER_KEYS;
    constructor(action$: Actions, documentsStore: DocumentsStore, documentsQuery: DocumentsQuery, documentsService: DocumentsService, store: Store, router: Router);
    filterChanged$: import("@ngneat/effects").Effect<{
        filter: Partial<DocsFilterState>;
    } & {
        type: "[Docs] Filter Changed";
    }>;
    presetToggled$: import("@ngneat/effects").Effect<{
        preset: import("@gauzy/plugin-docs-ui").DocsPresetId;
    } & {
        type: "[Docs] Preset Toggled";
    }>;
    folderChanged$: import("@ngneat/effects").Effect<{
        folderId: string;
    } & {
        type: "[Docs] Folder Changed";
    }>;
    /**
     * Table ↔ cards switch. Each view owns its page size (table 10, cards 24) and
     * both reset to page 1 — a cards "Load more" run must not leak an oversized
     * window into the table. Switching away from the table clears its selection.
     */
    viewChanged$: import("@ngneat/effects").Effect<{
        view: "table" | "cards";
    } & {
        type: "[Docs] View Changed";
    }>;
    paginationChanged$: import("@ngneat/effects").Effect<{
        pagination: {
            page: number;
            pageSize: number;
        };
    } & {
        type: "[Docs] Pagination Changed";
    }>;
    detailOpened$: import("@ngneat/effects").Effect<{
        id: string;
    } & {
        type: "[Docs] Detail Opened";
    }>;
    detailClosed$: import("@ngneat/effects").Effect<{
        type: "[Docs] Detail Closed";
    }>;
    selectionChanged$: import("@ngneat/effects").Effect<{
        ids: string[];
    } & {
        type: "[Docs] Selection Changed";
    }>;
    rowChanged$: import("@ngneat/effects").Effect<{
        document: IDocument;
    } & {
        type: "[Docs] Row Changed";
    }>;
    rowRemoved$: import("@ngneat/effects").Effect<{
        id: string;
    } & {
        type: "[Docs] Row Removed";
    }>;
    bulkCompleted$: import("@ngneat/effects").Effect<{
        options: {
            destructive?: boolean;
        };
    } & {
        type: "[Docs] Bulk Completed";
    }>;
    loadDocuments$: import("@ngneat/effects").Effect<IPagination<IDocument>>;
    /**
     * Cards "Load more" (`01-ux-spec.md` §4.2): bumps the page, fetches ONLY that
     * slice and appends it. No URL write — the shareable link stays page 1. A
     * failed append rolls the page counter back so the button stays usable.
     */
    loadMore$: import("@ngneat/effects").Effect<IPagination<IDocument>>;
    /** Silent in-place refresh — no spinner, no pagination reset, no URL write. */
    pollTick$: import("@ngneat/effects").Effect<IPagination<IDocument>>;
    /** Cosmetic — facets and counts fail silently. */
    refreshFacets$: import("@ngneat/effects").Effect<import("@gauzy/plugin-docs-ui").IDocumentFacets>;
    /**
     * Builds the list query. Each block below contributes only the keys it can
     * actually express — an omitted key is a filter the DTO never sees.
     *
     * @param window which slice to ask for — see `DocsFindWindow`.
     */
    private buildFindInput;
    /**
     * The multi-select facets, each copied through only when it carries a selection.
     * All of them (incl. `kind`) travel as the arrays the DTO accepts — CSV or
     * repeated params, `IN (...)` server-side.
     */
    private buildFacetFilters;
    /** A query and a folder scope are mutually exclusive — search results are flat. */
    private buildSearchScope;
    /**
     * The DTO names are `createdAt*`/`updatedAt*`; the URL param names
     * (`createdFrom`…) are the shareable-link contract and stay as they are.
     */
    private buildDateFilters;
    /** Two separate params — a composite `updatedAt:desc` fails `@IsIn` on `sort`. */
    private buildSortParams;
    /**
     * 🛑 `skip` is a 1-based PAGE NUMBER, not an offset: the API computes
     * `offset = take × (skip − 1)`, so sending a row offset paged in steps of
     * `pageSize²` (page 2 of 10 landed on rows 91-100). The accumulated window
     * is one big page-1 request; the service clamps `take` to the DTO's `@Max(100)`.
     */
    private buildWindowParams;
    private orgContext;
    /** Single URL write funnel — merge write, `replaceUrl: true`, no history spam. */
    private writeStateToUrl;
    private mergeUrlParams;
    static ɵfac: i0.ɵɵFactoryDeclaration<DocumentsEffects, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<DocumentsEffects>;
}
