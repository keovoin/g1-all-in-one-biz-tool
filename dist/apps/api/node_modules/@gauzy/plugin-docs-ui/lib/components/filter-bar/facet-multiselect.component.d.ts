import { EventEmitter, OnChanges } from '@angular/core';
import { IDocumentFacetBucket } from '../../models/docs-api.model';
import * as i0 from "@angular/core";
/**
 * Generic multi-select facet dropdown over `{ label, value, count }[]`, built on
 * ng-select.
 */
export declare class FacetMultiselectComponent implements OnChanges {
    buckets: IDocumentFacetBucket[] | null;
    selected: string[];
    labelKey: string;
    /** Optional label resolver for enum facets (value → translated label). */
    labelFor?: (value: string) => string;
    selectionChange: EventEmitter<string[]>;
    options: {
        value: string;
        label: string;
        count?: number;
    }[];
    /** Reference-stable mirror of `selected`. */
    selectedValues: string[];
    /** Content fingerprint of the last-built options. */
    private optionsSignature;
    /** Content fingerprint of selectedValues. */
    private selectedSignature;
    ngOnChanges(): void;
    /**
     * Stable identity for ng-select items.
     */
    trackByValue(option: {
        value: string;
    }): string;
    onSelectedChange(values: string[]): void;
    private resolveLabel;
    static ɵfac: i0.ɵɵFactoryDeclaration<FacetMultiselectComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<FacetMultiselectComponent, "gz-docs-facet-multiselect", never, { "buckets": { "alias": "buckets"; "required": false; }; "selected": { "alias": "selected"; "required": false; }; "labelKey": { "alias": "labelKey"; "required": false; }; "labelFor": { "alias": "labelFor"; "required": false; }; }, { "selectionChange": "selectionChange"; }, never, never, false, never>;
}
