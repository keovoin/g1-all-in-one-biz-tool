import type { IPluginPermissionChecker } from '../plugin-ui.helper';
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
export declare class PermissionAdapterService implements IPluginPermissionChecker {
    private readonly _store;
    /** Returns true if the user has the specified permission. */
    hasPermission(permission: string): boolean;
    /** Returns true if the user has ALL specified permissions. */
    hasAllPermissions(...permissions: string[]): boolean;
    /** Returns true if the user has ANY of the specified permissions. */
    hasAnyPermission(...permissions: string[]): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<PermissionAdapterService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<PermissionAdapterService>;
}
