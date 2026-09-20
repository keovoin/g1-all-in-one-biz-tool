import { inject, makeEnvironmentProviders, provideAppInitializer } from '@angular/core';
import { UiBridge } from './ui-bridge.interface';
import { UiBridgeRegistryService } from './ui-bridge-registry.service';
/**
 * Adapter class that wraps a bridge-like object to conform to UiBridge interface.
 */
class UiBridgeAdapter extends UiBridge {
    _bridge;
    config;
    constructor(_bridge) {
        super();
        this._bridge = _bridge;
        this.config = {
            frameworkId: _bridge.config.frameworkId,
            name: _bridge.config.name,
            version: _bridge.config.version
        };
    }
    mount(options) {
        return this._bridge.mount(options);
    }
    isCompatible(component) {
        return this._bridge.isCompatible(component);
    }
}
/**
 * Adapt a bridge-like object to the UiBridge interface.
 *
 * @example
 * ```typescript
 * import { ReactBridge } from '@gauzy/plugin-ui';
 * import { adaptBridge, UiBridgeRegistryService } from '@gauzy/plugin-ui';
 *
 * const registry = inject(UiBridgeRegistryService);
 * const reactBridge = adaptBridge(new ReactBridge());
 * registry.register(reactBridge);
 * ```
 */
export function adaptBridge(bridge) {
    return new UiBridgeAdapter(bridge);
}
/**
 * Check if an object is a valid bridge-like object.
 */
export function isUiBridgeLike(obj) {
    if (!obj || typeof obj !== 'object')
        return false;
    const bridge = obj;
    return (typeof bridge['config'] === 'object' &&
        bridge['config'] !== null &&
        typeof bridge['config']['frameworkId'] === 'string' &&
        typeof bridge['mount'] === 'function' &&
        typeof bridge['isCompatible'] === 'function');
}
/**
 * Provide a bridge-like object to the UI Bridge registry.
 *
 * This is a convenience function that adapts and registers a bridge
 * during application initialization.
 *
 * @example
 * ```typescript
 * import { ReactBridge } from '@gauzy/plugin-ui';
 * import { provideBridge } from '@gauzy/plugin-ui';
 *
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideBridge(new ReactBridge()),
 *     // or with a factory
 *     provideBridge(() => new ReactBridge())
 *   ]
 * };
 * ```
 */
export function provideBridge(bridgeOrFactory) {
    return makeEnvironmentProviders([
        provideAppInitializer(() => {
            const registry = inject(UiBridgeRegistryService);
            const bridge = typeof bridgeOrFactory === 'function' ? bridgeOrFactory() : bridgeOrFactory;
            registry.register(adaptBridge(bridge));
        })
    ]);
}
//# sourceMappingURL=ui-bridge.adapter.js.map