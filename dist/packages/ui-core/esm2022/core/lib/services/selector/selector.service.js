import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
export class SelectorService {
    /**
     * Returns boolean values of selectors
     * Used to decide whether or not to show organization, employees etc
     * in the header and organization shortcuts in the sidebar
     * @param url Usually the current url
     */
    showSelectors(url) {
        let showEmployeesSelector = true;
        let showDateSelector = true;
        let showOrganizationsSelector = true;
        let showOrganizationShortcuts = true;
        if (url.endsWith('/employees')) {
            showEmployeesSelector = false;
            showDateSelector = false;
        }
        const profileRegex = RegExp('/pages/employees/edit/.*/profile', 'i');
        const organizationRegex = RegExp('/pages/organizations/edit/.*/settings', 'i');
        if (profileRegex.test(url)) {
            showEmployeesSelector = false;
            showDateSelector = false;
            showOrganizationsSelector = false;
            showOrganizationShortcuts = false;
        }
        if (organizationRegex.test(url)) {
            showEmployeesSelector = false;
            showDateSelector = false;
            showOrganizationsSelector = false;
            showOrganizationShortcuts = true;
        }
        if (url.endsWith('/pages/auth/profile')) {
            showEmployeesSelector = false;
            showDateSelector = false;
            showOrganizationsSelector = false;
            showOrganizationShortcuts = false;
        }
        if (url.endsWith('/organizations')) {
            showEmployeesSelector = false;
            showDateSelector = false;
            showOrganizationsSelector = false;
            showOrganizationShortcuts = false;
        }
        const organizationEditRegex = RegExp('/pages/organizations/edit/[A-Za-z0-9-]+$', 'i');
        if (organizationEditRegex.test(url)) {
            showEmployeesSelector = false;
            showDateSelector = true;
            showOrganizationsSelector = true;
            showOrganizationShortcuts = true;
        }
        return {
            showEmployeesSelector,
            showDateSelector,
            showOrganizationsSelector,
            showOrganizationShortcuts
        };
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: SelectorService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: SelectorService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: SelectorService, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=selector.service.js.map