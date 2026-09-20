import { inject, Injectable } from '@angular/core';
import { PLUGIN_APP_STORE } from '../plugin-ui.helper';
import * as i0 from "@angular/core";
/**
 * Adapter that bridges the host application's store to the
 * `IPluginPermissionChecker` interface expected by `PluginUiModule`.
 *
 * Uses the `PLUGIN_APP_STORE` token so that `@gauzy/plugin-ui` does not
 * depend on `@gauzy/ui-core/core` directly. The host app provides:
 * ```typescript
 * { provide: PLUGIN_APP_STORE, useExisting: Store }
 * ```
 *
 * Provided via `PluginUiModule.init({ permissionChecker: PermissionAdapterService })`.
 * Used by `PageExtensionRegistryService` to check extension-level permissions.
 */
export class PermissionAdapterService {
    _store = inject(PLUGIN_APP_STORE);
    /** Returns true if the user has the specified permission. */
    hasPermission(permission) {
        return this._store.hasPermission(permission);
    }
    /** Returns true if the user has ALL specified permissions. */
    hasAllPermissions(...permissions) {
        return this._store.hasAllPermissions(...permissions);
    }
    /** Returns true if the user has ANY of the specified permissions. */
    hasAnyPermission(...permissions) {
        return this._store.hasAnyPermission(...permissions);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PermissionAdapterService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PermissionAdapterService, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PermissionAdapterService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });
//# sourceMappingURL=permission-adapter.service.js.map