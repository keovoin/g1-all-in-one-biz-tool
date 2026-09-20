import { Injectable } from '@angular/core';
import { Store } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
import * as i1 from "@gauzy/ui-core/core";
export class SwitchThemeService {
    constructor(store) {
        this.store = store;
        this._isAlreadyLoaded = false;
        this._hasAlreadyPreferredTheme = false;
        this._hasAlreadyPreferredTheme = this.store.currentTheme ? true : false;
    }
    get isAlreadyLoaded() {
        return this._isAlreadyLoaded;
    }
    set isAlreadyLoaded(value) {
        this._isAlreadyLoaded = value;
    }
    get hasAlreadyPreferredTheme() {
        return this._hasAlreadyPreferredTheme;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: SwitchThemeService, deps: [{ token: i1.Store }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: SwitchThemeService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: SwitchThemeService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.Store }] });
//# sourceMappingURL=switch-theme.service.js.map