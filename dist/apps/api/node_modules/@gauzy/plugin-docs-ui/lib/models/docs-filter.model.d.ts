import { Params } from '@angular/router';
import { DocumentKindEnum, DocumentKnowledgeStatusEnum, DocumentReviewStatusEnum, DocumentSourceEnum, DocumentStatusEnum, ID } from '@gauzy/contracts';
import { IDocumentFacetBucket } from './docs-api.model';
/**
 * Canonical filter state for the browse view. The URL is the single source of
 * truth for shareable state — see `04-frontend-plugin.md` §6 / `01-ux-spec.md` §5.1.
 */
export interface DocsFilterState {
    q: string;
    searchIn: 'name' | 'content';
    kind: DocumentKindEnum[];
    status: DocumentStatusEnum[];
    knowledgeStatus: DocumentKnowledgeStatusEnum[];
    reviewStatus: DocumentReviewStatusEnum[];
    source: DocumentSourceEnum[];
    categoryIds: ID[];
    tagIds: ID[];
    archived: boolean;
    /** Active preset chip id — canonical ids per `01-ux-spec.md` §5.1. */
    preset?: DocsPresetId;
    createdFrom?: string;
    createdTo?: string;
    updatedFrom?: string;
    updatedTo?: string;
    sort?: {
        field: string;
        order: 'ASC' | 'DESC';
    };
}
/** Canonical preset chip ids (URL values). */
export type DocsPresetId = 'needs-review' | 'not-in-knowledge' | 'archived';
export declare const DOCS_PRESETS: DocsPresetId[];
export declare function createInitialDocsFilterState(): DocsFilterState;
export declare function isDefaultSort(sort?: DocsFilterState['sort']): boolean;
/** True when any non-default filter is active (drives the "no results" empty state). */
export declare function hasActiveFilters(filter: DocsFilterState): boolean;
/**
 * Expands a status selection for the API (`R-STA-02`).
 *
 * 🛑 UPLOADED is an internal first phase the user is never shown: the badge, the
 * facet dropdown and the URL all say "Processing". Filtering must fold the same
 * way — sending a bare `status=PROCESSING` hides every row that is still in
 * UPLOADED, i.e. the freshly uploaded files the filter most obviously promises.
 * The API keeps all four states; only the UI speaks two.
 */
export declare function expandStatusFilterForApi(status: DocumentStatusEnum[]): DocumentStatusEnum[];
/**
 * Folds the UPLOADED facet bucket into PROCESSING for display — the same
 * two-phase truth as {@link expandStatusFilterForApi}, from the other direction.
 * Dropping the bucket instead (what the filter bar used to do) understated the
 * Processing count by exactly the rows that had only just arrived.
 */
export declare function foldStatusFacetBuckets(buckets: IDocumentFacetBucket[] | undefined): IDocumentFacetBucket[];
/**
 * Restores filter state from query params. Unknown enum members, invalid dates
 * and malformed sorts are silently dropped per the §6 restore rules.
 */
export declare function parseDocsFilterFromParams(params: Params): DocsFilterState;
/** Applies the filter values a preset implies (per `01-ux-spec.md` §5.1). */
export declare function applyPreset(state: DocsFilterState, preset: DocsPresetId | undefined): DocsFilterState;
/**
 * Serializes the filter state into query params. Params at their default value
 * are set to `null` so a merge write removes them from the URL.
 */
export declare function docsFilterToParams(filter: DocsFilterState, pagination?: {
    page: number;
    pageSize: number;
}): Params;
