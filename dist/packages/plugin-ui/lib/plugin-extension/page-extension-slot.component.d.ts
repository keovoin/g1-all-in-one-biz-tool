import { ComponentRef, OnChanges, OnDestroy, OnInit, Type, SimpleChanges } from '@angular/core';
import { PageExtensionDefinition, PageExtensionSlotId, ExtensionVisibilityContext, ExtensionWrapperConfig, ExtensionWrapperType } from './page-extension-slot.types';
import * as i0 from "@angular/core";
/**
 * Internal tracking for mounted extension components.
 */
interface MountedExtension {
    extension: PageExtensionDefinition;
    componentRef?: ComponentRef<unknown>;
    /** Resolved component class (from eager `component` or lazy `loadComponent`). */
    resolvedComponent?: Type<unknown>;
    /** Whether the lazy component is still loading. */
    loading: boolean;
    mounted: boolean;
    /** Error message if lazy loading failed. */
    error?: string;
    /** Whether this extension is a framework (non-Angular) extension. */
    isFramework: boolean;
    /** Resolved framework component (from eager or lazy loading). */
    resolvedFrameworkComponent?: unknown;
    /** Lazy loader for framework component (from FrameworkExtensionDefinition). */
    loadFrameworkComponent?: () => Promise<unknown>;
}
/**
 * Renders all extensions registered for a given slot with reactive updates.
 *
 * Features:
 * - **Reactive**: Automatically updates when extensions are registered/unregistered
 * - **Lifecycle Hooks**: Calls onMount, onUnmount, onActivate, onDeactivate
 * - **Visibility Control**: Filters extensions based on permissions/features
 * - **Wrappers**: Supports built-in wrappers (card, widget, window, panel)
 * - **Multi-framework**: Auto-detects framework extensions and renders via `<gz-framework-host>`
 * - **Error/retry**: Shows error state with retry button on lazy load failure
 *
 * @example
 * ```html
 * <!-- Basic usage -->
 * <ga-page-extension-slot slotId="dashboard-widgets"></ga-page-extension-slot>
 *
 * <!-- With visibility context -->
 * <ga-page-extension-slot
 *   [slotId]="PAGE_EXTENSION_SLOTS.DASHBOARD_WIDGETS"
 *   [visibilityContext]="{ user: currentUser, organization: org }"
 * ></ga-page-extension-slot>
 *
 * <!-- With wrapper override -->
 * <ga-page-extension-slot
 *   slotId="dashboard-widgets"
 *   defaultWrapper="card"
 * ></ga-page-extension-slot>
 * ```
 */
export declare class PageExtensionSlotComponent implements OnInit, OnChanges, OnDestroy {
    private readonly _extensionRegistry;
    private readonly _injector;
    private readonly _cdr;
    private readonly _destroyRef;
    private readonly _viewContainerRef;
    private readonly _elementRef;
    /** Tracks pending async cleanup to serialize mount/unmount operations. */
    private _pendingCleanup;
    /** Active extension subscription — cancelled before re-subscribing to avoid leaks. */
    private _extensionSub?;
    /**
     * The slot identifier to render extensions for.
     * Use PAGE_EXTENSION_SLOTS constants for well-known slots.
     */
    slotId: PageExtensionSlotId;
    /**
     * Optional CSS class to apply to each extension container.
     */
    extensionClass?: string;
    /**
     * Default wrapper for extensions that don't specify one.
     */
    defaultWrapper?: ExtensionWrapperType;
    /**
     * Context for visibility checks (user, organization, etc.).
     */
    visibilityContext?: Partial<ExtensionVisibilityContext>;
    /**
     * Additional data to pass to extensions via lifecycle context.
     */
    contextData?: Record<string, unknown>;
    /**
     * Whether to use reactive updates (default: true).
     * Set to false for static extension loading.
     */
    reactive: boolean;
    /**
     * Mounted extensions with their component refs.
     */
    _mountedExtensions: MountedExtension[];
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    /**
     * Retry loading a failed extension.
     */
    retryExtension(mounted: MountedExtension): Promise<void>;
    /**
     * Subscribes to extension changes for reactive updates.
     */
    private _subscribeToExtensions;
    /**
     * Updates the mounted extensions based on the new list.
     */
    private _updateExtensions;
    /**
     * Filters extensions based on visibility rules.
     * Delegates to the registry's full visibility check which handles
     * permissions, permissionsAny, featureKey, hidden flag, and custom visible callbacks.
     */
    private _filterVisibleExtensions;
    /**
     * Mounts an extension and calls onMount lifecycle hook.
     * Detects framework extensions and sets up accordingly.
     * If the extension uses `loadComponent`, resolves it lazily before rendering.
     */
    private _mountExtension;
    /**
     * Resolves a lazy Angular component for a mounted extension.
     * Sets error state on failure for retry support.
     */
    private _resolveLazyComponent;
    /**
     * Unmounts an extension and calls onUnmount lifecycle hook.
     */
    private _unmountExtension;
    /**
     * Unmounts all extensions.
     */
    private _unmountAll;
    /**
     * Refreshes visibility for all mounted extensions.
     */
    private _refreshVisibility;
    /**
     * Creates a lifecycle context for an extension.
     */
    private _createLifecycleContext;
    /**
     * Gets the wrapper type for an extension.
     */
    getWrapperType(extension: PageExtensionDefinition): ExtensionWrapperType;
    /**
     * Gets the wrapper config for an extension.
     */
    getWrapperConfig(extension: PageExtensionDefinition): ExtensionWrapperConfig | undefined;
    /**
     * Builds inputs for a custom wrapper component.
     * Passes the extension's resolved component and config so the wrapper can render the content.
     */
    getCustomWrapperInputs(mounted: MountedExtension): Record<string, unknown>;
    /**
     * Activates an extension (calls onActivate hook).
     * Call this when a tab is selected, for example.
     */
    activateExtension(extensionId: string): Promise<void>;
    /**
     * Deactivates an extension (calls onDeactivate hook).
     */
    deactivateExtension(extensionId: string): Promise<void>;
    static ɵfac: i0.ɵɵFactoryDeclaration<PageExtensionSlotComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<PageExtensionSlotComponent, "ga-page-extension-slot", never, { "slotId": { "alias": "slotId"; "required": true; }; "extensionClass": { "alias": "extensionClass"; "required": false; }; "defaultWrapper": { "alias": "defaultWrapper"; "required": false; }; "visibilityContext": { "alias": "visibilityContext"; "required": false; }; "contextData": { "alias": "contextData"; "required": false; }; "reactive": { "alias": "reactive"; "required": false; }; }, {}, never, never, true, never>;
}
export {};
