import { Observable } from 'rxjs';
import { type PluginUiDefinition } from './plugin-ui.types';
import { type PluginHealthSnapshot } from './plugin-health.service';
import * as i0 from "@angular/core";
/**
 * Per-plugin debug info.
 */
export interface PluginDebugInfo {
    id: string;
    definition: PluginUiDefinition;
    /** Whether the plugin has a module class. */
    hasModule: boolean;
    /** Whether the plugin is declarative (bootstrap only). */
    isDeclarative: boolean;
    /** Extensions registered by this plugin. */
    extensionCount: number;
    /** Whether settings are registered. */
    hasSettings: boolean;
    /** Cross-plugin services provided by this plugin. */
    serviceContracts: string[];
    /** Dependencies declared via dependsOn. */
    dependencies: string[];
    /** Whether this plugin was dynamically loaded. */
    isDynamic: boolean;
}
/**
 * Full debug snapshot from the DevTools service.
 */
export interface DevToolsSnapshot {
    /** All registered plugin definitions (flattened). */
    plugins: PluginDebugInfo[];
    /** Health monitoring snapshot. */
    health: PluginHealthSnapshot;
    /** All registered extension slot IDs with their extension counts. */
    extensionSlots: Array<{
        slotId: string;
        extensionCount: number;
    }>;
    /** All registered cross-plugin service contract IDs. */
    serviceContracts: string[];
    /** All registered plugin settings plugin IDs. */
    settingsPluginIds: string[];
    /** All state keys currently in PluginStateService. */
    stateKeys: string[];
    /** Count of live plugin instances. */
    registrySize: number;
    /** Dynamically loaded plugin IDs. */
    dynamicPluginIds: string[];
}
/**
 * Plugin DevTools / Debug Service.
 *
 * Aggregates data from all plugin subsystems for introspection.
 * Use for building debug panels, logging, or automated health checks.
 *
 * Dev-only — guard behind `isDevMode()` in production builds to
 * ensure tree-shaking removes it when unused.
 *
 * @example
 * ```ts
 * const devtools = inject(PluginDevToolsService);
 *
 * // Snapshot
 * const snap = devtools.getSnapshot();
 * console.table(snap.plugins);
 *
 * // Reactive
 * devtools.snapshot$.subscribe(snap => {
 *   console.log(`${snap.plugins.length} plugins, ${snap.health.healthy} healthy`);
 * });
 *
 * // Expose for browser console debugging
 * (window as any).__pluginDevtools = devtools;
 * ```
 */
export declare class PluginDevToolsService {
    private readonly _registry;
    private readonly _extRegistry;
    private readonly _stateService;
    private readonly _serviceRegistry;
    private readonly _settingsRegistry;
    private readonly _dynamicLoader;
    private readonly _health;
    /**
     * Returns a point-in-time snapshot of the entire plugin system.
     */
    getSnapshot(): DevToolsSnapshot;
    /**
     * Observable snapshot that updates when any subsystem changes.
     */
    get snapshot$(): Observable<DevToolsSnapshot>;
    /**
     * Logs a formatted summary to the console.
     */
    logSummary(): void;
    /**
     * Returns the dependency graph as adjacency list (pluginId → dependsOn[]).
     */
    getDependencyGraph(): Map<string, string[]>;
    /**
     * Returns plugin IDs that nothing depends on (leaf plugins).
     */
    getLeafPlugins(): string[];
    /**
     * Returns plugin IDs that other plugins depend on (root/core plugins).
     */
    getRootPlugins(): string[];
    private _getExtensionSlotSummary;
    static ɵfac: i0.ɵɵFactoryDeclaration<PluginDevToolsService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<PluginDevToolsService>;
}
