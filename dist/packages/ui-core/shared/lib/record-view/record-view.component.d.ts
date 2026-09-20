import { OnChanges, SimpleChanges } from '@angular/core';
import { IRecordViewSection, IRecordViewSectionRows } from './record-view.model';
import * as i0 from "@angular/core";
/**
 * Read-only rendering of one record as label/value pairs, driven by a field
 * descriptor list. It never edits and never navigates on its own.
 *
 * @see IRecordViewField for the descriptor shape.
 */
export declare class RecordViewComponent implements OnChanges {
    record: any;
    sections: IRecordViewSection[];
    /** Shown for rows kept via `showWhenEmpty`. */
    placeholder: string;
    resolved: IRecordViewSectionRows[];
    ngOnChanges(changes: SimpleChanges): void;
    /**
     * Resolve the descriptor against the record ONCE per change. The template is
     * then free of method calls, which keeps object identities (the `ga-only-tags`
     * host, the normalized person) stable across change detection.
     */
    private build;
    /**
     * Build one row: resolve the value, decide whether it counts as empty, and
     * pre-shape whatever the chosen renderer needs.
     */
    private toRow;
    /**
     * Walks a dot path into the record. Returns `undefined` rather than throwing
     * when an intermediate link is missing — a half-populated relation is normal
     * for records loaded with a narrow `relations` list.
     */
    private resolve;
    /** `false` and `0` are values, not blanks — only null/undefined/''/[] are. */
    private static isEmpty;
    /**
     * Accepts an employee, a user or a plain `{ name }` and flattens it to what
     * the person renderer needs, so callers do not have to know which of the
     * three a given relation gives them.
     */
    private static toPerson;
    static ɵfac: i0.ɵɵFactoryDeclaration<RecordViewComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<RecordViewComponent, "ngx-record-view", never, { "record": { "alias": "record"; "required": false; }; "sections": { "alias": "sections"; "required": false; }; "placeholder": { "alias": "placeholder"; "required": false; }; }, {}, never, never, false, never>;
}
