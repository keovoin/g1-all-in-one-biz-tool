import { Injectable } from '@angular/core';
import { hasPluginUiLifecycleMethod } from './plugin-ui.helper';
import * as i0 from "@angular/core";
/**
 * Root-level registry that tracks all bootstrapped UI plugin module instances.
 *
 * Feature-level modules register plugin instances here during bootstrap, and
 * the root bootstrap module can use this registry during application shutdown.
 */
export class PluginUiRegistryService {
    /** Ordered set of live plugin module instances. */
    _instances = new Set();
    /**
     * Register a plugin module instance.
     *
     * @param instance The plugin module instance (e.g. `JobEmployeeModule`).
     */
    register(instance) {
        this._instances.add(instance);
    }
    /**
     * Remove a plugin module instance from the registry.
     *
     * @param instance The plugin module instance to deregister.
     */
    deregister(instance) {
        this._instances.delete(instance);
    }
    /**
     * Invoke `ngOnPluginBeforeDestroy` (if implemented), then `ngOnPluginDestroy`
     * on every registered plugin, and clear the registry.
     *
     * Intended to be called by the root bootstrap module during app shutdown.
     */
    async destroyAll() {
        for (const instance of this._instances) {
            if (hasPluginUiLifecycleMethod(instance, 'ngOnPluginBeforeDestroy')) {
                try {
                    const result = instance.ngOnPluginBeforeDestroy();
                    if (result && typeof result.then === 'function') {
                        await result;
                    }
                }
                catch (err) {
                    const name = instance.constructor?.name || '(anonymous plugin)';
                    console.error(`Error in ngOnPluginBeforeDestroy for [${name}]:`, err);
                }
            }
        }
        for (const instance of this._instances) {
            if (hasPluginUiLifecycleMethod(instance, 'ngOnPluginDestroy')) {
                try {
                    await instance.ngOnPluginDestroy();
                    const name = instance.constructor?.name || '(anonymous plugin)';
                    console.log(`Destroyed UI Plugin [${name}]`);
                }
                catch (err) {
                    const name = instance.constructor?.name || '(anonymous plugin)';
                    console.error(`Error destroying UI plugin [${name}]:`, err);
                }
            }
        }
        this._instances.clear();
    }
    /**
     * Returns the number of currently registered plugin instances.
     */
    get size() {
        return this._instances.size;
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PluginUiRegistryService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PluginUiRegistryService, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PluginUiRegistryService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });
//# sourceMappingURL=plugin-ui-registry.service.js.map