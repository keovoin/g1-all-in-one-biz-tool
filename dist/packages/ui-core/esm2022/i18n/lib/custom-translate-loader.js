import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
/**
 * Custom loader for the translation files.
 */
export class CustomTranslateLoader {
    constructor(http) {
        this.http = http;
    }
    /**
     * Get translation from the server.
     * @param lang - The language code.
     * @returns An Observable that resolves to the translation object.
     */
    getTranslation(lang) {
        return this.http.get(`./assets/i18n/${lang}.json`);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CustomTranslateLoader, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CustomTranslateLoader }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CustomTranslateLoader, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.HttpClient }] });
//# sourceMappingURL=custom-translate-loader.js.map