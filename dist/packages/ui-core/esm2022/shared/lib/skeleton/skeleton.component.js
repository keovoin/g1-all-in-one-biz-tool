import { Component, Input } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
/** Frozen index arrays — the template iterates them, so they must be stable. */
const SINGLE_BAR = [0];
const CARD_BARS = [0, 1, 2];
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
export class SkeletonComponent {
    constructor() {
        /** Shape of the placeholder. */
        this.variant = 'lines';
        this._rows = 5;
        this._columns = 4;
        this._rowIndexes = [];
        this._columnIndexes = [];
    }
    /** How many rows / cards to draw. */
    set rows(value) {
        this._rows = this.clamp(value, 1, 24);
    }
    get rows() {
        return this._rows;
    }
    /** How many bars per row (`table` variant only). */
    set columns(value) {
        this._columns = this.clamp(value, 1, 12);
    }
    get columns() {
        return this._columns;
    }
    /**
     * `@for` needs a real iterable; these are index arrays rebuilt only when the
     * corresponding count changes, so the template never allocates per CD cycle.
     */
    get rowIndexes() {
        if (this._rowIndexes.length !== this._rows) {
            this._rowIndexes = Array.from({ length: this._rows }, (_, index) => index);
        }
        return this._rowIndexes;
    }
    get columnIndexes() {
        if (this._columnIndexes.length !== this._columns) {
            this._columnIndexes = Array.from({ length: this._columns }, (_, index) => index);
        }
        return this._columnIndexes;
    }
    /**
     * Bars inside one row: as many as there are columns for a table, a small
     * fixed stack for a card (title + two content lines), a single bar otherwise.
     */
    get barIndexes() {
        if (this.variant === 'table') {
            return this.columnIndexes;
        }
        return this.variant === 'cards' ? CARD_BARS : SINGLE_BAR;
    }
    /**
     * Coerce a possibly string/NaN template input into a sane count.
     *
     * @param value raw input value
     * @param min lower bound
     * @param max upper bound
     * @returns an integer within [min, max]
     */
    clamp(value, min, max) {
        const parsed = Math.floor(Number(value));
        if (!Number.isFinite(parsed)) {
            return min;
        }
        return Math.min(Math.max(parsed, min), max);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: SkeletonComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: SkeletonComponent, isStandalone: false, selector: "ngx-skeleton", inputs: { variant: "variant", rows: "rows", columns: "columns" }, ngImport: i0, template: "<div\n\tclass=\"ga-skeleton\"\n\t[class.ga-skeleton--table]=\"variant === 'table'\"\n\t[class.ga-skeleton--cards]=\"variant === 'cards'\"\n\trole=\"status\"\n\taria-busy=\"true\"\n\t[attr.aria-label]=\"'SM_TABLE.NO_DATA.LOADING' | translate\"\n>\n\t@for (row of rowIndexes; track row) {\n\t\t<div class=\"ga-skeleton__row\">\n\t\t\t@for (bar of barIndexes; track bar) {\n\t\t\t\t<span class=\"ga-skeleton__bar\"></span>\n\t\t\t}\n\t\t</div>\n\t}\n</div>\n", styles: [":host{display:block;width:100%;height:100%}.ga-skeleton{display:flex;flex-direction:column;gap:var(--gauzy-table-cell-padding-y, .375rem);width:100%;padding:var(--gauzy-table-cell-padding-y, .375rem) 0}.ga-skeleton__row{display:flex;align-items:center;gap:var(--gauzy-table-cell-padding-x, .625rem);width:100%}.ga-skeleton__bar{position:relative;display:block;flex:1 1 auto;min-width:0;height:var(--gauzy-table-line-height, 1.25rem);border-radius:var(--gauzy-radius-sm, .375rem);background-color:#7e7e8f33;overflow:hidden}.ga-skeleton__bar:after{content:\"\";position:absolute;top:0;bottom:0;left:0;width:60%;background:linear-gradient(90deg,transparent 0%,rgba(126,126,143,.28) 50%,transparent 100%);animation:ga-skeleton-sweep 1.6s linear infinite}.ga-skeleton--table .ga-skeleton__row{padding:var(--gauzy-table-cell-padding-y, .375rem) var(--gauzy-table-cell-padding-x, .625rem)}.ga-skeleton--table .ga-skeleton__bar:first-child{flex:1.6 1 0}.ga-skeleton--table .ga-skeleton__bar:last-child{flex:.7 1 0}.ga-skeleton--cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(21rem,1fr));align-items:flex-start;gap:1rem;padding:0}.ga-skeleton--cards .ga-skeleton__row{flex-direction:column;align-items:stretch;gap:.625rem;min-height:7.5rem;padding:1rem;border-radius:var(--border-radius);background-color:var(--background-basic-color-3)}.ga-skeleton--cards .ga-skeleton__bar{flex:0 0 auto}.ga-skeleton--cards .ga-skeleton__bar:first-child{width:55%}.ga-skeleton--cards .ga-skeleton__bar:last-child{width:80%}@keyframes ga-skeleton-sweep{0%{transform:translate(-100%)}to{transform:translate(250%)}}@media(prefers-reduced-motion:reduce){.ga-skeleton__bar:after{animation:none}}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "pipe", type: i1.TranslatePipe, name: "translate" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: SkeletonComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-skeleton', standalone: false, template: "<div\n\tclass=\"ga-skeleton\"\n\t[class.ga-skeleton--table]=\"variant === 'table'\"\n\t[class.ga-skeleton--cards]=\"variant === 'cards'\"\n\trole=\"status\"\n\taria-busy=\"true\"\n\t[attr.aria-label]=\"'SM_TABLE.NO_DATA.LOADING' | translate\"\n>\n\t@for (row of rowIndexes; track row) {\n\t\t<div class=\"ga-skeleton__row\">\n\t\t\t@for (bar of barIndexes; track bar) {\n\t\t\t\t<span class=\"ga-skeleton__bar\"></span>\n\t\t\t}\n\t\t</div>\n\t}\n</div>\n", styles: [":host{display:block;width:100%;height:100%}.ga-skeleton{display:flex;flex-direction:column;gap:var(--gauzy-table-cell-padding-y, .375rem);width:100%;padding:var(--gauzy-table-cell-padding-y, .375rem) 0}.ga-skeleton__row{display:flex;align-items:center;gap:var(--gauzy-table-cell-padding-x, .625rem);width:100%}.ga-skeleton__bar{position:relative;display:block;flex:1 1 auto;min-width:0;height:var(--gauzy-table-line-height, 1.25rem);border-radius:var(--gauzy-radius-sm, .375rem);background-color:#7e7e8f33;overflow:hidden}.ga-skeleton__bar:after{content:\"\";position:absolute;top:0;bottom:0;left:0;width:60%;background:linear-gradient(90deg,transparent 0%,rgba(126,126,143,.28) 50%,transparent 100%);animation:ga-skeleton-sweep 1.6s linear infinite}.ga-skeleton--table .ga-skeleton__row{padding:var(--gauzy-table-cell-padding-y, .375rem) var(--gauzy-table-cell-padding-x, .625rem)}.ga-skeleton--table .ga-skeleton__bar:first-child{flex:1.6 1 0}.ga-skeleton--table .ga-skeleton__bar:last-child{flex:.7 1 0}.ga-skeleton--cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(21rem,1fr));align-items:flex-start;gap:1rem;padding:0}.ga-skeleton--cards .ga-skeleton__row{flex-direction:column;align-items:stretch;gap:.625rem;min-height:7.5rem;padding:1rem;border-radius:var(--border-radius);background-color:var(--background-basic-color-3)}.ga-skeleton--cards .ga-skeleton__bar{flex:0 0 auto}.ga-skeleton--cards .ga-skeleton__bar:first-child{width:55%}.ga-skeleton--cards .ga-skeleton__bar:last-child{width:80%}@keyframes ga-skeleton-sweep{0%{transform:translate(-100%)}to{transform:translate(250%)}}@media(prefers-reduced-motion:reduce){.ga-skeleton__bar:after{animation:none}}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], propDecorators: { variant: [{
                type: Input
            }], rows: [{
                type: Input
            }], columns: [{
                type: Input
            }] } });
//# sourceMappingURL=skeleton.component.js.map