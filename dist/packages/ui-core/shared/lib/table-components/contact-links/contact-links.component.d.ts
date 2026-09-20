import { Router } from '@angular/router';
import * as i0 from "@angular/core";
export declare class ContactLinksComponent {
    private readonly _router;
    rowData: any;
    value: any;
    constructor(_router: Router);
    /**
     * Navigates to the contact view page for the current value.
     *
     * @return {void} This function does not return anything.
     */
    navigateToContact(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ContactLinksComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ContactLinksComponent, "ngx-contact-links", never, { "rowData": { "alias": "rowData"; "required": false; }; "value": { "alias": "value"; "required": false; }; }, {}, never, never, false, never>;
}
