import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
export class AppGlobalRippleOptions {
    constructor() {
        /** Whether ripples should be disabled globally. */
        this.disabled = false;
    }
    /**
     * Toggles the Ripple effect.
     * @param enabled Whether to enable or disable the Ripple effect.
     * For more information on updating global options at runtime, refer to:
     * {@link https://material.angular.io/components/ripple/overview#updating-global-options-at-runtime}
     */
    toggle(enabled) {
        // Toggles the disabled state based on the provided value
        this.disabled = !enabled;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: AppGlobalRippleOptions, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: AppGlobalRippleOptions, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: AppGlobalRippleOptions, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }] });
//# sourceMappingURL=app-global-ripple-options.service.js.map