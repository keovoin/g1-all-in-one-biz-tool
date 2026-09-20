import { ChangeDetectorRef, OnDestroy, OnInit } from '@angular/core';
import * as i0 from "@angular/core";
/**
 * How long a freshly mounted grid is assumed to still be fetching.
 *
 * Kept in step with `NO_DATA_SETTLE_DELAY_MS` so a page whose two layouts (table
 * / card grid) settle at different moments does not flip between a skeleton and
 * an empty state.
 */
export declare const SMART_TABLE_SETTLE_DELAY_MS = 700;
/**
 * Marks every `angular2-smart-table` as "still settling" for the first moments
 * of its life.
 *
 * The library renders `<tr><td colspan="n">{{ noDataMessage }}</td></tr>` the
 * instant the grid holds zero rows, which is the state every list page is in
 * between mounting and its first response — so the very first frame the user
 * sees says "No Data". This directive puts a class on the host for that window
 * and the global `_gauzy-skeleton` rules repaint that one cell as a shimmer.
 *
 * It has NO inputs on purpose. It is attached by element selector to every
 * smart table in scope of `SmartDataViewLayoutModule`, so pages get the fix
 * without touching their templates; pages that own a real `loading` flag can be
 * precise about long requests by binding `[class.ga-table-loading]="loading"`,
 * which is a native class binding and therefore cannot break a template that
 * does not have this module in scope.
 */
export declare class SmartTableSettlingDirective implements OnInit, OnDestroy {
    private readonly cdr;
    settling: boolean;
    private settleTimer;
    constructor(cdr: ChangeDetectorRef);
    ngOnInit(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<SmartTableSettlingDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<SmartTableSettlingDirective, "angular2-smart-table", never, {}, {}, never, never, false, never>;
}
