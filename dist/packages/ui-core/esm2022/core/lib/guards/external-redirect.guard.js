import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
export class ExternalRedirectGuard {
    /**
     * Checks if navigation can proceed.
     *
     * @param route - The activated route snapshot containing route parameters.
     * @returns {boolean} - Returns false to prevent navigation to the route and true to allow navigation.
     */
    canActivate(route) {
        const externalUrl = route.paramMap.get('redirect');
        // If an external URL is provided in the route parameters
        if (externalUrl) {
            window.open(externalUrl, '_blank'); // Open the URL in a new tab
            return false; // Prevent navigation to the current route
        }
        return true; // Allow navigation if no external URL is found
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ExternalRedirectGuard, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ExternalRedirectGuard, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ExternalRedirectGuard, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }] });
//# sourceMappingURL=external-redirect.guard.js.map