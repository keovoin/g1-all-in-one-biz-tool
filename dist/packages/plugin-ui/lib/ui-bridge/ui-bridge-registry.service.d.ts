import { Observable } from 'rxjs';
import { UiBridge, UiBridgeFramework } from './ui-bridge.interface';
import * as i0 from "@angular/core";
/**
 * Factory function for lazy loading a bridge.
 */
export type BridgeFactory = () => UiBridge | Promise<UiBridge>;
/**
 * Lazy bridge registration.
 */
export interface LazyBridgeRegistration {
    /** The framework ID this bridge handles */
    frameworkId: UiBridgeFramework;
    /** Factory function to create the bridge */
    factory: BridgeFactory;
    /** Whether the bridge has been loaded */
    loaded: boolean;
    /** The loaded bridge instance (if loaded) */
    bridge?: UiBridge;
    /** Loading promise (if currently loading) */
    loading?: Promise<UiBridge>;
}
/**
 * Options for registering a bridge.
 */
export interface BridgeRegistrationOptions {
    /**
     * If true, the bridge will be loaded lazily on first use.
     * Default: false (immediate registration)
     */
    lazy?: boolean;
}
/**
 * Registry service for UI framework bridges.
 *
 * Manages registration and retrieval of UI bridges that enable rendering
 * non-Angular framework components (React, Vue, Svelte, etc.) inside Angular.
 *
 * Supports lazy loading for bridges that are only needed when their
 * framework components are actually used.
 *
 * @example
 * ```typescript
 * // Immediate registration
 * registry.register(new ReactBridge());
 *
 * // Lazy registration (loaded on first use)
 * registry.registerLazy('react', () => import('@gauzy/plugin-ui').then(m => new m.ReactBridge()));
 *
 * // Get a bridge (loads lazily if needed)
 * const bridge = await registry.getAsync('react');
 * if (bridge) {
 *   bridge.mount({ component: MyReactComponent, hostElement, injector });
 * }
 * ```
 */
export declare class UiBridgeRegistryService {
    private readonly _bridges;
    private readonly _lazyBridges;
    private readonly _bridges$;
    /**
     * Observable of all registered bridges (excluding lazy unloaded).
     */
    readonly bridges$: Observable<UiBridge[]>;
    /**
     * Register a UI framework bridge (immediate).
     *
     * @param bridge The bridge instance to register
     */
    register(bridge: UiBridge): void;
    /**
     * Register a UI framework bridge lazily.
     * The bridge will only be created when first requested.
     *
     * @param frameworkId The framework identifier
     * @param factory Factory function to create the bridge
     */
    registerLazy(frameworkId: UiBridgeFramework, factory: BridgeFactory): void;
    /**
     * Get a bridge by framework ID (synchronous).
     * Returns undefined for lazy bridges that haven't been loaded yet.
     *
     * @param frameworkId The framework identifier
     * @returns The bridge instance, or undefined
     */
    get(frameworkId: UiBridgeFramework): UiBridge | undefined;
    /**
     * Get a bridge by framework ID (async, supports lazy loading).
     *
     * @param frameworkId The framework identifier
     * @returns Promise resolving to the bridge, or undefined
     */
    getAsync(frameworkId: UiBridgeFramework): Promise<UiBridge | undefined>;
    /**
     * Preload a lazy bridge without using it.
     *
     * @param frameworkId The framework identifier to preload
     */
    preload(frameworkId: UiBridgeFramework): Promise<void>;
    /**
     * Preload all lazy bridges.
     */
    preloadAll(): Promise<void>;
    /**
     * Loads a lazy bridge.
     */
    private _loadLazyBridge;
    /**
     * Notifies subscribers of bridge changes.
     */
    private _notifyBridgeChange;
    /**
     * Get all registered bridges (excludes unloaded lazy bridges).
     */
    getAll(): UiBridge[];
    /**
     * Check if a framework bridge is registered (immediate or lazy).
     */
    has(frameworkId: UiBridgeFramework): boolean;
    /**
     * Check if a framework bridge is loaded (not just registered lazily).
     */
    isLoaded(frameworkId: UiBridgeFramework): boolean;
    /**
     * Auto-detect which bridge can handle a component.
     * Only checks already-loaded bridges.
     */
    detectBridge(component: unknown): UiBridge | undefined;
    /**
     * Auto-detect which bridge can handle a component (async).
     * Loads lazy bridges if necessary.
     */
    detectBridgeAsync(component: unknown): Promise<UiBridge | undefined>;
    /**
     * Get a list of all registered framework IDs (immediate and lazy).
     */
    getRegisteredFrameworks(): string[];
    /**
     * Unregister a bridge by framework ID.
     */
    unregister(frameworkId: UiBridgeFramework): boolean;
    /**
     * Clear all registered bridges.
     */
    clear(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<UiBridgeRegistryService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<UiBridgeRegistryService>;
}
