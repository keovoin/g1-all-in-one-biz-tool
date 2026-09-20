import { ID, IDocument } from '@gauzy/contracts';
import { IDocumentFacets } from '../models/docs-api.model';
import { DocsFilterState } from '../models/docs-filter.model';
import * as i0 from "@angular/core";
/** Preset chip live counts (All / Needs review / Not in AI knowledge / Archived). */
export interface DocsPresetCounts {
    all: number;
    needsReview: number;
    notInKnowledge: number;
    archived: number;
}
export interface DocsState {
    rows: IDocument[];
    totalCount: number;
    loading: boolean;
    error: boolean;
    filter: DocsFilterState;
    view: 'table' | 'cards';
    folderId: ID | null;
    selectedIds: ID[];
    detailId: ID | null;
    facets: IDocumentFacets | null;
    presetCounts: DocsPresetCounts | null;
    pagination: {
        page: number;
        pageSize: number;
    };
    /** Monotonic token — stale list responses are discarded. */
    loadSeq: number;
}
export declare function createInitialDocsState(): DocsState;
/**
 * Single elf store for the Documents hub browse state.
 * Provided at module level (not root) so the state dies with the lazy chunk.
 */
export declare class DocumentsStore {
    readonly store: import("@ngneat/elf").Store<{
        name: string;
        state: DocsState;
        config: undefined;
    }, DocsState>;
    get state(): DocsState;
    update(partial: Partial<DocsState>): void;
    updateFilter(partial: Partial<DocsFilterState>): void;
    /** Bumps and returns the load sequence token for stale-response rejection. */
    nextLoadSeq(): number;
    /**
     * Appends the next page for the cards "Load more" button, de-duplicating by
     * id (a concurrent poll may already have re-fetched an overlapping window).
     */
    appendRows(rows: IDocument[], totalCount: number): void;
    /** Replaces a single row in place (silent poll refresh / detail mutation). */
    patchRow(document: IDocument): void;
    removeRow(id: ID): void;
    reset(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DocumentsStore, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<DocumentsStore>;
}
