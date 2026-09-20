import * as i0 from "@angular/core";
export declare class CompanyLogoComponent {
    value: string | number;
    /** The Font Awesome classes for this row's glyph. Recomputed when the row changes. */
    iconClass: string;
    private _rowData;
    set rowData(data: any);
    get rowData(): any;
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
    private static toIconClass;
    static ɵfac: i0.ɵɵFactoryDeclaration<CompanyLogoComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<CompanyLogoComponent, "ga-company-logo", never, { "value": { "alias": "value"; "required": false; }; "rowData": { "alias": "rowData"; "required": false; }; }, {}, never, never, false, never>;
}
