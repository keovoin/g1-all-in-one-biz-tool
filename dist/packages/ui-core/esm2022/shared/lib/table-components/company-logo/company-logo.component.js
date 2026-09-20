import { Component, Input } from '@angular/core';
import * as i0 from "@angular/core";
export class CompanyLogoComponent {
    constructor() {
        /** The Font Awesome classes for this row's glyph. Recomputed when the row changes. */
        this.iconClass = 'fab';
    }
    set rowData(data) {
        this._rowData = data;
        this.iconClass = CompanyLogoComponent.toIconClass(data?.name);
    }
    get rowData() {
        return this._rowData;
    }
    /**
     * Turns a company name into the brand class Font Awesome would know it by.
     *
     * The name used to be interpolated into the class list as it stood
     * (`'fab fa-' + rowData?.name | lowercase`), which is only a class at all for a
     * single-word name: "Ever Technologies LTD" produced THREE classes —
     * `fa-ever`, `technologies` and `ltd` — so any company whose name happened to
     * contain a word the page styles (`selected`, `primary`, `action`, `row`) was
     * styled by it. A slug is one class whatever the name is: lower case, ASCII,
     * hyphen separated, which is also the form Font Awesome's own names take, so
     * "Pay Pal" now finds `fa-pay-pal` where before it looked for `fa-pay`.
     *
     * Names that match no brand keep the bare `fab`, and the stylesheet gives that
     * element a generic glyph — see `--fa` there.
     */
    static toIconClass(name) {
        // A name that is not a primitive is no name: `String()` would hand back
        // `[object Object]` and that slugs to a class of its very own.
        const raw = typeof name === 'string' || typeof name === 'number' ? `${name}` : '';
        const slug = raw
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            // One hyphen at either end is all there can be — the replace above has
            // already collapsed every run of non-alphanumerics into a single one — so
            // this needs no quantifier, and without one there is nothing to backtrack.
            .replace(/^-|-$/g, '');
        return slug ? `fab fa-${slug}` : 'fab';
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CompanyLogoComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: CompanyLogoComponent, isStandalone: false, selector: "ga-company-logo", inputs: { value: "value", rowData: "rowData" }, ngImport: i0, template: "<i [class]=\"iconClass\"></i>\n", styles: ["@charset \"UTF-8\";:host{--fa: \"\\f1ad\"}i{font-family:\"Font Awesome 7 Brands\",\"Font Awesome 7 Free\",sans-serif;font-weight:900;font-size:1em;line-height:inherit;color:var(--gauzy-text-color-1);padding:0;margin-inline-end:.375rem}\n"] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CompanyLogoComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-company-logo', standalone: false, template: "<i [class]=\"iconClass\"></i>\n", styles: ["@charset \"UTF-8\";:host{--fa: \"\\f1ad\"}i{font-family:\"Font Awesome 7 Brands\",\"Font Awesome 7 Free\",sans-serif;font-weight:900;font-size:1em;line-height:inherit;color:var(--gauzy-text-color-1);padding:0;margin-inline-end:.375rem}\n"] }]
        }], propDecorators: { value: [{
                type: Input
            }], rowData: [{
                type: Input
            }] } });
//# sourceMappingURL=company-logo.component.js.map