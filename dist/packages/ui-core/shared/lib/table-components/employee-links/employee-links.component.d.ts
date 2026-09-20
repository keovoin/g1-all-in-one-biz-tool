import { Router } from '@angular/router';
import * as i0 from "@angular/core";
export declare class EmployeeLinksComponent {
    private readonly _router;
    rowData: any;
    value: any;
    isNavigation: boolean;
    constructor(_router: Router);
    /**
     * Navigates to the employee edit page if the necessary conditions are met.
     */
    navigateToEmployee(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<EmployeeLinksComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<EmployeeLinksComponent, "ngx-employee-links", never, { "rowData": { "alias": "rowData"; "required": false; }; "value": { "alias": "value"; "required": false; }; "isNavigation": { "alias": "isNavigation"; "required": false; }; }, {}, never, never, false, never>;
}
