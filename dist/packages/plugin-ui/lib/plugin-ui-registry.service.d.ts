import { IPluginUiExtendedLifecycleMethods } from './plugin-ui.interface';
import * as i0 from "@angular/core";
/**
 * A plugin module instance that may implement lifecycle hooks (required and optional).
 * Used as the type constraint for the registry.
 */
export type PluginUiInstance = Partial<IPluginUiExtendedLifecycleMethods>;
/**
 * Root-level registry that tracks all bootstrapped UI plugin module instances.
 *
 * Feature-level modules register plugin instances here during bootstrap, and
 * the root bootstrap module can use this registry during application shutdown.
 */
export declare class PluginUiRegistryService {
    /** Ordered set of live plugin module instances. */
    private readonly _instances;
    /**
     * Register a plugin module instance.
     *
     * @param instance The plugin module instance (e.g. `JobEmployeeModule`).
     */
    register(instance: PluginUiInstance): void;
    /**
     * Remove a plugin module instance from the registry.
     *
     * @param instance The plugin module instance to deregister.
     */
    deregister(instance: PluginUiInstance): void;
    /**
     * Invoke `ngOnPluginBeforeDestroy` (if implemented), then `ngOnPluginDestroy`
     * on every registered plugin, and clear the registry.
     *
     * Intended to be called by the root bootstrap module during app shutdown.
     */
    destroyAll(): Promise<void>;
    /**
     * Returns the number of currently registered plugin instances.
     */
    get size(): number;
    static ɵfac: i0.ɵɵFactoryDeclaration<PluginUiRegistryService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<PluginUiRegistryService>;
}
