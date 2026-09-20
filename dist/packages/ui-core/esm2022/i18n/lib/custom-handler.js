import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
/**
 * Custom handler for missing translations.
 */
export class CustomHandler {
    /**
     * Handles missing translations.
     *
     * @param params The parameters containing information about the missing translation.
     * @returns The fallback translation or a default message indicating the translation is missing.
     */
    handle(params) {
        // Implement your custom missing translation handling logic here.
        // For example, you might want to return a default message indicating the translation is missing.
        return params.key;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CustomHandler, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CustomHandler }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CustomHandler, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=custom-handler.js.map