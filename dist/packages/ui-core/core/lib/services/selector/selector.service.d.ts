import * as i0 from "@angular/core";
export declare class SelectorService {
    /**
     * Returns boolean values of selectors
     * Used to decide whether or not to show organization, employees etc
     * in the header and organization shortcuts in the sidebar
     * @param url Usually the current url
     */
    showSelectors(url: string): {
        showEmployeesSelector: boolean;
        showDateSelector: boolean;
        showOrganizationsSelector: boolean;
        showOrganizationShortcuts: boolean;
    };
    static ɵfac: i0.ɵɵFactoryDeclaration<SelectorService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<SelectorService>;
}
