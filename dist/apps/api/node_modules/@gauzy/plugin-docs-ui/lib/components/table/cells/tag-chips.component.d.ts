import { IDocument, ITag } from '@gauzy/contracts';
import * as i0 from "@angular/core";
/** Tag chips: core tag colors, up to 3 + "+N" overflow. */
export declare class TagChipsComponent {
    rowData: IDocument;
    value: ITag[];
    max: number;
    /** Cache so `visible` keeps a stable array reference across change-detection cycles. */
    private visibleCache;
    get tags(): ITag[];
    /**
     * Rendered per table row on every browse-list change detection. `slice()` mints a new array
     * identity each call; memoizing it (keyed on the source array reference + `max`) keeps the
     * `*ngFor` reference stable, and `trackById` keeps the chip DOM stable when the content is
     * unchanged — the same reference-stability discipline as `FacetMultiselectComponent`.
     */
    get visible(): ITag[];
    get overflow(): number;
    trackById(_index: number, tag: ITag): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<TagChipsComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<TagChipsComponent, "gz-docs-tag-chips", never, { "rowData": { "alias": "rowData"; "required": false; }; "value": { "alias": "value"; "required": false; }; "max": { "alias": "max"; "required": false; }; }, {}, never, never, false, never>;
}
