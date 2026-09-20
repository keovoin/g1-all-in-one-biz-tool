import { inject, Injectable } from '@angular/core';
import { combineLatest, map } from 'rxjs';
import { getPluginUiConfig } from './plugin-ui.loader';
import { flattenPlugins } from './plugin-ui.types';
import { PluginUiRegistryService } from './plugin-ui-registry.service';
import { PageExtensionRegistryService } from './plugin-extension/page-extension-registry.service';
import { PluginStateService } from './plugin-host/plugin-state.service';
import { PluginServiceRegistryService } from './plugin-host/plugin-service-registry.service';
import { PluginSettingsRegistryService } from './plugin-host/plugin-settings-registry.service';
import { DynamicPluginLoaderService } from './plugin-host/dynamic-plugin-loader.service';
import { PluginHealthService } from './plugin-health.service';
import * as i0 from "@angular/core";
// ─── Service ────────────────────────────────────────────────────────────────
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
export class PluginDevToolsService {
    _registry = inject(PluginUiRegistryService);
    _extRegistry = inject(PageExtensionRegistryService);
    _stateService = inject(PluginStateService);
    _serviceRegistry = inject(PluginServiceRegistryService);
    _settingsRegistry = inject(PluginSettingsRegistryService);
    _dynamicLoader = inject(DynamicPluginLoaderService);
    _health = inject(PluginHealthService);
    // ─── Snapshot ───────────────────────────────────────────────
    /**
     * Returns a point-in-time snapshot of the entire plugin system.
     */
    getSnapshot() {
        let allDefs = [];
        try {
            const config = getPluginUiConfig();
            allDefs = flattenPlugins(config.plugins);
        }
        catch {
            // Config not loaded yet — use empty
        }
        const dynamicIds = new Set(this._dynamicLoader.loadedPluginIds);
        const plugins = allDefs.map((def) => ({
            id: def.id,
            definition: def,
            hasModule: !!def.module || !!def.loadModule,
            isDeclarative: !!def.bootstrap && !def.module && !def.loadModule,
            extensionCount: def.extensions?.length ?? 0,
            hasSettings: this._settingsRegistry.has(def.id),
            serviceContracts: this._serviceRegistry.getByPlugin(def.id).map((r) => r.contractId),
            dependencies: def.dependsOn ?? [],
            isDynamic: dynamicIds.has(def.id)
        }));
        // Add dynamically loaded plugins not in the static config
        for (const dynId of dynamicIds) {
            if (!plugins.some((p) => p.id === dynId)) {
                plugins.push({
                    id: dynId,
                    definition: { id: dynId },
                    hasModule: false,
                    isDeclarative: true,
                    extensionCount: 0,
                    hasSettings: this._settingsRegistry.has(dynId),
                    serviceContracts: this._serviceRegistry.getByPlugin(dynId).map((r) => r.contractId),
                    dependencies: [],
                    isDynamic: true
                });
            }
        }
        return {
            plugins,
            health: this._health.getSnapshot(),
            extensionSlots: this._getExtensionSlotSummary(),
            serviceContracts: this._serviceRegistry.getContractIds(),
            settingsPluginIds: this._settingsRegistry.getPluginIds(),
            stateKeys: this._stateService.keys(),
            registrySize: this._registry.size,
            dynamicPluginIds: this._dynamicLoader.loadedPluginIds
        };
    }
    /**
     * Observable snapshot that updates when any subsystem changes.
     */
    get snapshot$() {
        return combineLatest([
            this._extRegistry.slots$,
            this._serviceRegistry.all$,
            this._settingsRegistry.all$,
            this._dynamicLoader.loadedPluginIds$,
            this._health.snapshot$
        ]).pipe(map(() => this.getSnapshot()));
    }
    // ─── Utilities ──────────────────────────────────────────────
    /**
     * Logs a formatted summary to the console.
     */
    logSummary() {
        const snap = this.getSnapshot();
        console.group('[PluginDevTools] Summary');
        console.log(`Plugins: ${snap.plugins.length} (${snap.dynamicPluginIds.length} dynamic)`);
        console.log(`Health: ${snap.health.healthy} healthy, ${snap.health.degraded} degraded, ${snap.health.errored} errored`);
        console.log(`Total boot time: ${snap.health.totalBootTimeMs}ms`);
        console.log(`Extension slots: ${snap.extensionSlots.length}`);
        console.log(`Cross-plugin services: ${snap.serviceContracts.length}`);
        console.log(`Settings: ${snap.settingsPluginIds.length} plugins`);
        console.log(`State keys: ${snap.stateKeys.length}`);
        console.table(snap.plugins.map((p) => ({
            id: p.id,
            type: p.isDeclarative ? 'declarative' : 'module',
            extensions: p.extensionCount,
            settings: p.hasSettings,
            services: p.serviceContracts.length,
            dynamic: p.isDynamic,
            health: this._health.getStatus(p.id)?.state ?? 'unknown',
            bootMs: this._health.getStatus(p.id)?.bootTimeMs ?? '-'
        })));
        console.groupEnd();
    }
    /**
     * Returns the dependency graph as adjacency list (pluginId → dependsOn[]).
     */
    getDependencyGraph() {
        const snap = this.getSnapshot();
        const graph = new Map();
        for (const p of snap.plugins) {
            graph.set(p.id, p.dependencies);
        }
        return graph;
    }
    /**
     * Returns plugin IDs that nothing depends on (leaf plugins).
     */
    getLeafPlugins() {
        const graph = this.getDependencyGraph();
        const depTargets = new Set();
        for (const deps of graph.values()) {
            for (const dep of deps)
                depTargets.add(dep);
        }
        return Array.from(graph.keys()).filter((id) => !depTargets.has(id));
    }
    /**
     * Returns plugin IDs that other plugins depend on (root/core plugins).
     */
    getRootPlugins() {
        const graph = this.getDependencyGraph();
        const depTargets = new Set();
        for (const deps of graph.values()) {
            for (const dep of deps)
                depTargets.add(dep);
        }
        return Array.from(depTargets);
    }
    // ─── Private ────────────────────────────────────────────────
    _getExtensionSlotSummary() {
        // Merge slot IDs from two sources:
        // 1. Slots with extensions registered (from _extensions$ map)
        // 2. Slots registered via registerSlot() (may have zero extensions)
        const allSlotIds = new Set([
            ...this._extRegistry.getSlotIds(),
            ...this._extRegistry.getRegisteredSlotIds()
        ]);
        return Array.from(allSlotIds).map((slotId) => ({
            slotId,
            extensionCount: this._extRegistry.getExtensions(slotId).length
        }));
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PluginDevToolsService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PluginDevToolsService, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PluginDevToolsService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });
//# sourceMappingURL=plugin-devtools.service.js.map