import { IDocument } from '@gauzy/contracts';
import * as i0 from "@angular/core";
/**
 * `Updated` cell — one truncating line plus the full timestamp in a tooltip.
 */
export declare class UpdatedCellComponent {
    rowData: IDocument;
    value: string | Date;
    /** Formatting is memoized on the raw value: both getters are template bindings. */
    private cache;
    /** Short form, for the row itself. */
    get display(): string;
    /** Long form, for the tooltip. */
    get tooltip(): string;
    private format;
    static ɵfac: i0.ɵɵFactoryDeclaration<UpdatedCellComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<UpdatedCellComponent, "gz-docs-updated-cell", never, { "rowData": { "alias": "rowData"; "required": false; }; "value": { "alias": "value"; "required": false; }; }, {}, never, never, false, never>;
}
