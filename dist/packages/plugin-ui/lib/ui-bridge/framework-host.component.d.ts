import { ElementRef, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { UiBridgeFramework } from './ui-bridge.interface';
import * as i0 from "@angular/core";
/**
 * Generic host component for rendering non-Angular framework components.
 *
 * This component acts as a bridge between Angular and other UI frameworks
 * (React, Vue, Svelte, etc.) by delegating mounting/unmounting to the
 * appropriate registered bridge.
 *
 * Supports:
 * - **Lazy bridges**: Async resolution via `UiBridgeRegistryService.getAsync()`
 * - **Lazy components**: `loadFrameworkComponent` for code-splitting
 * - **Error/retry**: Shows an error state with a retry button on load failure
 *
 * @example
 * ```html
 * <gz-framework-host
 *   frameworkId="react"
 *   [component]="MyReactComponent"
 *   [props]="{ title: 'Hello!' }"
 * />
 *
 * <!-- Lazy component -->
 * <gz-framework-host
 *   frameworkId="react"
 *   [loadComponent]="loadMyReactComponent"
 *   [props]="{ title: 'Lazy!' }"
 * />
 * ```
 */
export declare class FrameworkHostComponent implements OnInit, OnDestroy, OnChanges {
    /**
     * Framework identifier (e.g., 'react', 'vue', 'svelte').
     * Must match a registered bridge in UiBridgeRegistryService.
     */
    frameworkId: UiBridgeFramework;
    /**
     * The framework component to render (eager).
     */
    component?: unknown;
    /**
     * Lazy-load the framework component for code-splitting.
     * Mutually exclusive with `component` — if both set, `loadComponent` takes precedence.
     */
    loadComponent?: () => Promise<unknown>;
    /**
     * Props to pass to the framework component.
     */
    props?: unknown;
    /**
     * Additional context to provide to the component.
     */
    context?: unknown;
    hostRef: ElementRef<HTMLElement>;
    private readonly _bridgeRegistry;
    private readonly _injector;
    private readonly _cdr;
    private _mountResult?;
    /** Incremented on each _mount call to detect stale async completions. */
    private _mountVersion;
    /** Whether the component/bridge is currently loading. */
    _loading: boolean;
    /** Error message if loading failed. */
    _error: string | null;
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    /**
     * Retry mounting after a failure.
     */
    retry(): void;
    private _mount;
    private _unmount;
    static ɵfac: i0.ɵɵFactoryDeclaration<FrameworkHostComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<FrameworkHostComponent, "gz-framework-host", never, { "frameworkId": { "alias": "frameworkId"; "required": true; }; "component": { "alias": "component"; "required": false; }; "loadComponent": { "alias": "loadComponent"; "required": false; }; "props": { "alias": "props"; "required": false; }; "context": { "alias": "context"; "required": false; }; }, {}, never, never, true, never>;
}
