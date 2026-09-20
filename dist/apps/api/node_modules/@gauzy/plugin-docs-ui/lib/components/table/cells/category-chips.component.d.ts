import { IDocument, IDocumentCategory } from '@gauzy/contracts';
import * as i0 from "@angular/core";
/** Category chips: up to 3 colored chips + "+N" overflow. */
export declare class CategoryChipsComponent {
    rowData: IDocument;
    value: IDocumentCategory[];
    max: number;
    /** Cache so `visible` keeps a stable array reference across change-detection cycles. */
    private visibleCache;
    get categories(): IDocumentCategory[];
    /**
     * Rendered per table row on every browse-list change detection. `slice()` mints a new array
     * identity each call; memoizing it (keyed on the source array reference + `max`) keeps the
     * `*ngFor` reference stable, and `trackById` keeps the chip DOM stable when the content is
     * unchanged — the same reference-stability discipline as `FacetMultiselectComponent`.
     */
    get visible(): IDocumentCategory[];
    get overflow(): number;
    trackById(_index: number, category: IDocumentCategory): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<CategoryChipsComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<CategoryChipsComponent, "gz-docs-category-chips", never, { "rowData": { "alias": "rowData"; "required": false; }; "value": { "alias": "value"; "required": false; }; "max": { "alias": "max"; "required": false; }; }, {}, never, never, false, never>;
}
