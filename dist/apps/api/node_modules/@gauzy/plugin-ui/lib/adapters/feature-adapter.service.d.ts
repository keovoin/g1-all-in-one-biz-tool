import type { IPluginFeatureChecker } from '../plugin-ui.helper';
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
export declare class FeatureAdapterService implements IPluginFeatureChecker {
    private readonly _store;
    /** Returns true if the specified feature is enabled. */
    isFeatureEnabled(featureKey: string): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<FeatureAdapterService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<FeatureAdapterService>;
}
