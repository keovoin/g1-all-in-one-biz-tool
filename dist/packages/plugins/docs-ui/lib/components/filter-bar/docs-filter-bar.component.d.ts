import { EventEmitter } from '@angular/core';
import { Params } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ITag } from '@gauzy/contracts';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { DocsPresetCounts } from '../../+state/documents.store';
import { IDocumentFacetBucket, IDocumentFacets } from '../../models/docs-api.model';
import { DocsFilterState, DocsPresetId } from '../../models/docs-filter.model';
import * as i0 from "@angular/core";
/**
 * Filter bar: multi-select facet dropdowns (with live counts), the create-capable
 * tag selector, created/updated date-range pickers, the name-vs-content search
 * scope toggle (content search needs ≥ `DOCS_CONTENT_SEARCH_MIN_CHARS` characters
 * — the backend's own minimum, never a locally chosen one) and clear-all. Emits a
 * single `filterChange` per mutation; the browse page owns debouncing + URL sync.
 */
export declare class DocsFilterBarComponent extends TranslationBaseComponent {
    readonly translateService: TranslateService;
    facets: IDocumentFacets | null;
    value: DocsFilterState | null;
    /** Live URL query params — what the saved-views control captures and compares against. */
    urlParams: Params;
    /**
     * Counts behind the preset chips, which are rendered on this band's first row.
     */
    presetCounts: DocsPresetCounts | null;
    filterChange: EventEmitter<Partial<DocsFilterState>>;
    searchChange: EventEmitter<string>;
    clearAll: EventEmitter<void>;
    /** A saved view was applied — payload is the query-param merge patch. */
    applyView: EventEmitter<Params>;
    /** Re-emitted from the preset chips on this band's first row. */
    presetToggled: EventEmitter<DocsPresetId>;
    /** Interpolated into `DOCS.FILTERS.SEARCH_CONTENT_DISABLED` so the hint can never quote a stale number. */
    readonly contentSearchMinChars = 3;
    constructor(translateService: TranslateService);
    private bucketsCache;
    private facetBuckets;
    get kindBuckets(): IDocumentFacetBucket[];
    get statusBuckets(): IDocumentFacetBucket[];
    get knowledgeBuckets(): IDocumentFacetBucket[];
    get sourceBuckets(): IDocumentFacetBucket[];
    get categoryBuckets(): IDocumentFacetBucket[];
    get tagBuckets(): IDocumentFacetBucket[];
    kindLabel: (value: string) => string;
    statusLabel: (value: string) => string;
    knowledgeLabel: (value: string) => string;
    sourceLabel: (value: string) => string;
    private readonly tagEntityCache;
    private tagStubsCache;
    get selectedTagEntities(): ITag[];
    onTagsChange(tags: ITag[]): void;
    onSearchInput(q: string): void;
    onSearchScopeToggle(content: boolean): void;
    onFacet(field: keyof DocsFilterState, values: string[]): void;
    onCreatedRange(range: {
        start?: Date;
        end?: Date;
    }): void;
    onUpdatedRange(range: {
        start?: Date;
        end?: Date;
    }): void;
    get hasCreatedRange(): boolean;
    get hasUpdatedRange(): boolean;
    clearCreatedRange(input: HTMLInputElement): void;
    clearUpdatedRange(input: HTMLInputElement): void;
    onPresetToggled(preset: DocsPresetId | undefined): void;
    onClearAll(): void;
    get contentSearchDisabled(): boolean;
    private bucketsOrEnum;
    private toIsoDate;
    static ɵfac: i0.ɵɵFactoryDeclaration<DocsFilterBarComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DocsFilterBarComponent, "gz-docs-filter-bar", never, { "facets": { "alias": "facets"; "required": false; }; "value": { "alias": "value"; "required": false; }; "urlParams": { "alias": "urlParams"; "required": false; }; "presetCounts": { "alias": "presetCounts"; "required": false; }; }, { "filterChange": "filterChange"; "searchChange": "searchChange"; "clearAll": "clearAll"; "applyView": "applyView"; "presetToggled": "presetToggled"; }, never, never, false, never>;
}
