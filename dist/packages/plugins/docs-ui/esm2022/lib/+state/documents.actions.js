import { createAction } from '@ngneat/effects';
export class DocumentsActions {
    /** Loads the current page from the API (respects filter/folder/pagination in the store). */
    static { this.loadDocuments = createAction('[Docs] Load Documents', (options) => ({
        options
    })); }
    /**
     * Cards "Load more": fetches the next page and APPENDS it to `rows`
     * (`01-ux-spec.md` §4.2). Never resets pagination and never writes the URL —
     * the shareable state stays the first page.
     */
    static { this.loadMore = createAction('[Docs] Load More'); }
    /** Merges a partial filter change, debounced into a reload + URL write. */
    static { this.filterChanged = createAction('[Docs] Filter Changed', (filter) => ({
        filter
    })); }
    /** Toggles a preset chip (undefined = back to All). */
    static { this.presetToggled = createAction('[Docs] Preset Toggled', (preset) => ({ preset })); }
    /** Table/cards toggle — persisted through `ComponentEnum.DOCUMENTS_HUB`. */
    static { this.viewChanged = createAction('[Docs] View Changed', (view) => ({ view })); }
    /** Tree scope change (null = root). */
    static { this.folderChanged = createAction('[Docs] Folder Changed', (folderId) => ({ folderId })); }
    static { this.paginationChanged = createAction('[Docs] Pagination Changed', (pagination) => ({ pagination })); }
    static { this.detailOpened = createAction('[Docs] Detail Opened', (id) => ({ id })); }
    static { this.detailClosed = createAction('[Docs] Detail Closed'); }
    static { this.selectionChanged = createAction('[Docs] Selection Changed', (ids) => ({ ids })); }
    /** A single row mutated (detail edit / poll refresh) — patch it in place. */
    static { this.rowChanged = createAction('[Docs] Row Changed', (document) => ({ document })); }
    /** A row disappeared from the current scope (archive/delete/move). */
    static { this.rowRemoved = createAction('[Docs] Row Removed', (id) => ({ id })); }
    /** A bulk action finished — reload list + facets, clear selection when destructive. */
    static { this.bulkCompleted = createAction('[Docs] Bulk Completed', (options) => ({
        options
    })); }
    /** 5 s processing poll tick — silent in-place refresh; never writes the URL. */
    static { this.pollTick = createAction('[Docs] Poll Tick', (ids) => ({ ids })); }
    /** Refreshes facets + preset counts (on settle / after mutations). */
    static { this.refreshFacets = createAction('[Docs] Refresh Facets'); }
}
//# sourceMappingURL=documents.actions.js.map