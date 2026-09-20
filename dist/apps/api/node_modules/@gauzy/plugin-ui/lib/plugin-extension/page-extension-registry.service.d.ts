import { Observable } from 'rxjs';
import { PageExtensionDefinition, PageExtensionSlotId, PageExtensionSlotDefinition, ExtensionVisibilityContext } from './page-extension-slot.types';
import * as i0 from "@angular/core";
/**
 * Extended registration options for tracking plugin ownership.
 */
export interface ExtensionRegistrationOptions {
    /** Plugin ID that owns this extension; used for deregisterByPlugin(). */
    pluginId?: string;
}
/**
 * Options for slot registration.
 */
export interface SlotRegistrationOptions {
    /** Plugin ID that owns this slot */
    pluginId?: string;
    /** Whether to throw if slot already exists */
    throwIfExists?: boolean;
}
/**
 * Registry for UI extensions contributed by plugins or other packages.
 *
 * Provides reactive extension management with Observable support for
 * automatic UI updates when extensions are registered/unregistered.
 *
 * @example
 * ```ts
 * // Register an extension
 * registry.register({
 *   id: 'my-dashboard-widget',
 *   slotId: PAGE_EXTENSION_SLOTS.DASHBOARD_WIDGETS,
 *   component: MyWidgetComponent,
 *   order: 10
 * });
 *
 * // Subscribe to extension changes (reactive)
 * registry.getExtensions$('dashboard-widgets').subscribe(extensions => {
 *   console.log('Extensions updated:', extensions);
 * });
 *
 * // Dynamic slot registration
 * registry.registerSlot({
 *   id: 'my-plugin:custom-area',
 *   name: 'Custom Plugin Area',
 *   multiple: true
 * });
 * ```
 */
export declare class PageExtensionRegistryService {
    private readonly _injector;
    private readonly _permissionChecker;
    private readonly _featureChecker;
    private readonly _extensions$;
    private readonly _slots$;
    private readonly _pluginToExtensions;
    private readonly _pluginToSlots;
    /**
     * Registers a new extension slot.
     * Allows plugins to create their own extension points.
     *
     * @param slot Slot definition
     * @param options Registration options
     */
    registerSlot(slot: PageExtensionSlotDefinition, options?: SlotRegistrationOptions): void;
    /**
     * Gets a slot definition.
     */
    getSlot(slotId: PageExtensionSlotId): PageExtensionSlotDefinition | undefined;
    /**
     * Returns all registered slot definition IDs (from `registerSlot()`).
     * These may have zero extensions — use alongside `getSlotIds()` for a complete picture.
     */
    getRegisteredSlotIds(): PageExtensionSlotId[];
    /**
     * Observable of all registered slots.
     */
    get slots$(): Observable<PageExtensionSlotDefinition[]>;
    /**
     * Unregisters a slot.
     */
    unregisterSlot(slotId: PageExtensionSlotId): void;
    /**
     * Registers an extension for a slot.
     *
     * @param extension The extension definition
     * @param options Optional pluginId for lifecycle cleanup
     */
    register(extension: PageExtensionDefinition, options?: ExtensionRegistrationOptions): void;
    /**
     * Registers multiple extensions.
     *
     * @param extensions Array of extension definitions
     * @param options Optional pluginId for lifecycle cleanup
     */
    registerAll(extensions: PageExtensionDefinition[], options?: ExtensionRegistrationOptions): void;
    /**
     * Internal helper to register an extension to a specific map instance.
     */
    private _registerTo;
    /**
     * Returns all extensions for a slot (non-reactive).
     */
    getExtensions(slotId: PageExtensionSlotId): PageExtensionDefinition[];
    /**
     * Returns all slot IDs that have at least one registered extension.
     * Includes dynamically registered extensions, not just static config.
     */
    getSlotIds(): PageExtensionSlotId[];
    /**
     * Returns an Observable of extensions for a slot (reactive).
     * Updates automatically when extensions are registered/unregistered.
     *
     * @param slotId Slot ID to observe
     * @returns Observable of extensions array
     */
    getExtensions$(slotId: PageExtensionSlotId): Observable<PageExtensionDefinition[]>;
    /**
     * Returns visible extensions for a slot, applying visibility filters.
     * (Enhancement #3 - Visibility Control)
     *
     * @param slotId Slot ID
     * @param context Visibility context with user/organization data
     * @returns Promise of visible extensions
     */
    getVisibleExtensions(slotId: PageExtensionSlotId, context?: Partial<ExtensionVisibilityContext>): Promise<PageExtensionDefinition[]>;
    /**
     * Returns an Observable of visible extensions with reactive updates.
     */
    getVisibleExtensions$(slotId: PageExtensionSlotId, context?: Partial<ExtensionVisibilityContext>): Observable<PageExtensionDefinition[]>;
    /**
     * Removes an extension by id and slot.
     */
    deregister(slotId: PageExtensionSlotId, extensionId: string): void;
    /**
     * Removes all extensions for a slot.
     */
    deregisterAll(slotId: PageExtensionSlotId): void;
    /**
     * Removes all extensions registered by a specific plugin.
     * Call this from ngOnPluginDestroy when the plugin registered extensions with pluginId.
     *
     * Batches all mutations into single emissions to avoid N+M intermediate
     * state updates that would trigger unnecessary change detection cycles.
     */
    deregisterByPlugin(pluginId: string): void;
    /**
     * Checks if an extension is visible (async version).
     */
    private _isExtensionVisible;
    /**
     * Checks if an extension is visible (sync version for Observable).
     * Uses injected permission/feature checkers when available (both are synchronous).
     * Falls back to showing the extension when checkers are not configured.
     */
    private _isExtensionVisibleSync;
    /**
     * Checks user permissions via the injected PLUGIN_PERMISSION_CHECKER.
     * Falls back to allowing access when no checker is provided.
     */
    private _checkPermissions;
    /**
     * Checks a feature flag via the injected PLUGIN_FEATURE_CHECKER.
     * Falls back to allowing access when no checker is provided.
     */
    private _checkFeature;
    static ɵfac: i0.ɵɵFactoryDeclaration<PageExtensionRegistryService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<PageExtensionRegistryService>;
}
