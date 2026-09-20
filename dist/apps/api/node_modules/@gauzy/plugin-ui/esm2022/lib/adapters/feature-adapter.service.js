import { inject, Injectable } from '@angular/core';
import { PLUGIN_APP_STORE } from '../plugin-ui.helper';
import * as i0 from "@angular/core";
/**
 * Adapter that bridges the host application's store to the
 * `IPluginFeatureChecker` interface expected by `PluginUiModule`.
 *
 * Uses the `PLUGIN_APP_STORE` token so that `@gauzy/plugin-ui` does not
 * depend on `@gauzy/ui-core/core` directly. The host app provides:
 * ```typescript
 * { provide: PLUGIN_APP_STORE, useExisting: Store }
 * ```
 *
 * Provided via `PluginUiModule.init({ featureChecker: FeatureAdapterService })`.
 * Used by `PageExtensionRegistryService` to check extension-level feature flags.
 */
export class FeatureAdapterService {
    _store = inject(PLUGIN_APP_STORE);
    /** Returns true if the specified feature is enabled. */
    isFeatureEnabled(featureKey) {
        return this._store.hasFeatureEnabled(featureKey);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: FeatureAdapterService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: FeatureAdapterService, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: FeatureAdapterService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });
//# sourceMappingURL=feature-adapter.service.js.map