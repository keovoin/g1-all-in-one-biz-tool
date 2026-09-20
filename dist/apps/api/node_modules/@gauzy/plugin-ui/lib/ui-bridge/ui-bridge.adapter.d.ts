import { type EnvironmentProviders } from '@angular/core';
import { UiBridge } from './ui-bridge.interface';
/**
 * Interface for a bridge-like object that can be adapted to UiBridge.
 * This allows external packages to provide
 * bridge implementations without directly depending on @gauzy/plugin-ui.
 */
export interface UiBridgeLike {
    config: {
        frameworkId: string;
        name: string;
        version: string;
    };
    mount(options: {
        component: unknown;
        props?: unknown;
        context?: unknown;
        hostElement: HTMLElement;
        injector: unknown;
    }): {
        unmount: () => void;
        updateProps?: (props: unknown) => void;
    };
    isCompatible(component: unknown): boolean;
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
export declare function adaptBridge(bridge: UiBridgeLike): UiBridge;
/**
 * Check if an object is a valid bridge-like object.
 */
export declare function isUiBridgeLike(obj: unknown): obj is UiBridgeLike;
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
export declare function provideBridge(bridgeOrFactory: UiBridgeLike | (() => UiBridgeLike)): EnvironmentProviders;
