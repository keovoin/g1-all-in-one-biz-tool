import * as i0 from "@angular/core";
export type SkeletonVariant = 'lines' | 'table' | 'cards';
/**
 * A dependency-free, theme-token-only loading placeholder.
 *
 * It exists so a list surface can say "still loading" instead of the far more
 * alarming "No Data" while its request is still in flight. Three shapes:
 *
 *  - `lines`  a stack of bars, for a generic panel
 *  - `table`  a stack of rows, each split into `columns` bars
 *  - `cards`  a responsive grid of card-shaped blocks, matching `ga-card-grid`
 *
 * The shimmer is pure CSS (no new dependency) and honours
 * `prefers-reduced-motion`.
 */
export declare class SkeletonComponent {
    /** Shape of the placeholder. */
    variant: SkeletonVariant;
    /** How many rows / cards to draw. */
    set rows(value: number);
    get rows(): number;
    private _rows;
    /** How many bars per row (`table` variant only). */
    set columns(value: number);
    get columns(): number;
    private _columns;
    /**
     * `@for` needs a real iterable; these are index arrays rebuilt only when the
     * corresponding count changes, so the template never allocates per CD cycle.
     */
    get rowIndexes(): number[];
    private _rowIndexes;
    get columnIndexes(): number[];
    private _columnIndexes;
    /**
     * Bars inside one row: as many as there are columns for a table, a small
     * fixed stack for a card (title + two content lines), a single bar otherwise.
     */
    get barIndexes(): number[];
    /**
     * Coerce a possibly string/NaN template input into a sane count.
     *
     * @param value raw input value
     * @param min lower bound
     * @param max upper bound
     * @returns an integer within [min, max]
     */
    private clamp;
    static ɵfac: i0.ɵɵFactoryDeclaration<SkeletonComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<SkeletonComponent, "ngx-skeleton", never, { "variant": { "alias": "variant"; "required": false; }; "rows": { "alias": "rows"; "required": false; }; "columns": { "alias": "columns"; "required": false; }; }, {}, never, never, false, never>;
}
