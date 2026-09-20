import { Injectable } from '@angular/core';
import { createStore, withProps } from '@ngneat/elf';
import { DOCS_DEFAULT_PAGE_SIZE } from '../docs.constants';
import { createInitialDocsFilterState } from '../models/docs-filter.model';
import * as i0 from "@angular/core";
export function createInitialDocsState() {
    return {
        rows: [],
        totalCount: 0,
        loading: false,
        error: false,
        filter: createInitialDocsFilterState(),
        view: 'table',
        folderId: null,
        selectedIds: [],
        detailId: null,
        facets: null,
        presetCounts: null,
        pagination: { page: 1, pageSize: DOCS_DEFAULT_PAGE_SIZE },
        loadSeq: 0
    };
}
/**
 * Single elf store for the Documents hub browse state.
 * Provided at module level (not root) so the state dies with the lazy chunk.
 */
export class DocumentsStore {
    constructor() {
        this.store = createStore({ name: 'docs' }, withProps(createInitialDocsState()));
    }
    get state() {
        return this.store.getValue();
    }
    update(partial) {
        this.store.update((state) => ({ ...state, ...partial }));
    }
    updateFilter(partial) {
        this.store.update((state) => ({ ...state, filter: { ...state.filter, ...partial } }));
    }
    /** Bumps and returns the load sequence token for stale-response rejection. */
    nextLoadSeq() {
        const seq = this.state.loadSeq + 1;
        this.update({ loadSeq: seq });
        return seq;
    }
    /**
     * Appends the next page for the cards "Load more" button, de-duplicating by
     * id (a concurrent poll may already have re-fetched an overlapping window).
     */
    appendRows(rows, totalCount) {
        this.store.update((state) => {
            const seen = new Set(state.rows.map((row) => String(row.id)));
            const additions = (rows ?? []).filter((row) => !seen.has(String(row.id)));
            return { ...state, rows: [...state.rows, ...additions], totalCount };
        });
    }
    /** Replaces a single row in place (silent poll refresh / detail mutation). */
    patchRow(document) {
        this.store.update((state) => ({
            ...state,
            rows: state.rows.map((row) => (String(row.id) === String(document.id) ? { ...row, ...document } : row))
        }));
    }
    removeRow(id) {
        this.store.update((state) => ({
            ...state,
            rows: state.rows.filter((row) => String(row.id) !== String(id)),
            selectedIds: state.selectedIds.filter((selected) => String(selected) !== String(id)),
            totalCount: Math.max(0, state.totalCount - 1)
        }));
    }
    reset() {
        this.store.update(() => createInitialDocsState());
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DocumentsStore, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DocumentsStore }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DocumentsStore, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=documents.store.js.map