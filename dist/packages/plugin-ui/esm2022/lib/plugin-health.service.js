import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { PluginEventBusService } from './plugin-extension/plugin-event-bus.service';
import * as i0 from "@angular/core";
// ─── Service ────────────────────────────────────────────────────────────────
/**
 * Plugin Health Monitoring Service.
 *
 * Tracks plugin boot times, error counts, and health state.
 * Provides reactive observation and snapshot queries for debugging
 * and DevTools panels.
 *
 * @example
 * ```ts
 * const health = inject(PluginHealthService);
 *
 * // Record boot
 * health.recordBootStart('my-plugin');
 * // ... bootstrap logic ...
 * health.recordBootEnd('my-plugin');
 *
 * // Record error
 * health.recordError('my-plugin', new Error('Something broke'));
 *
 * // Query
 * const status = health.getStatus('my-plugin');
 * console.log(status?.bootTimeMs, status?.errorCount);
 *
 * // Observe all
 * health.snapshot$.subscribe(snap => {
 *   console.log(`${snap.healthy}/${snap.total} plugins healthy`);
 * });
 * ```
 */
export class PluginHealthService {
    _eventBus = inject(PluginEventBusService);
    _statuses$ = new BehaviorSubject(new Map());
    /** Pending boot start timestamps. */
    _bootStarts = new Map();
    // ─── Recording ──────────────────────────────────────────────
    /**
     * Marks the start of a plugin boot sequence.
     */
    recordBootStart(pluginId) {
        this._bootStarts.set(pluginId, performance.now());
        this._ensureEntry(pluginId);
    }
    /**
     * Marks the end of a plugin boot sequence.
     * Calculates boot duration from the matching `recordBootStart`.
     */
    recordBootEnd(pluginId) {
        const start = this._bootStarts.get(pluginId);
        const bootTimeMs = start != null ? Math.round(performance.now() - start) : 0;
        this._bootStarts.delete(pluginId);
        this._updateStatus(pluginId, (status) => ({
            ...status,
            bootTimeMs,
            bootedAt: Date.now(),
            loaded: true,
            state: status.errorCount > 0 ? 'degraded' : 'healthy'
        }));
        this._eventBus.emit('plugin:health:booted', { pluginId, bootTimeMs }, { source: 'plugin-health' });
    }
    /**
     * Records an error for a plugin.
     * Transitions the plugin to 'degraded' (1–4 errors) or 'error' (5+).
     */
    recordError(pluginId, error) {
        const message = typeof error === 'string' ? error : error.message;
        this._updateStatus(pluginId, (status) => {
            const errorCount = status.errorCount + 1;
            return {
                ...status,
                errorCount,
                lastError: { message, timestamp: Date.now() },
                state: errorCount >= 5 ? 'error' : errorCount > 0 ? 'degraded' : 'healthy'
            };
        });
        this._eventBus.emit('plugin:health:error', { pluginId, message }, { source: 'plugin-health' });
    }
    /**
     * Marks a plugin as unloaded.
     */
    recordUnloaded(pluginId) {
        this._updateStatus(pluginId, (status) => ({
            ...status,
            loaded: false
        }));
    }
    /**
     * Resets the health status for a plugin.
     */
    reset(pluginId) {
        this._bootStarts.delete(pluginId);
        const statuses = new Map(this._statuses$.value);
        statuses.delete(pluginId);
        this._statuses$.next(statuses);
    }
    /**
     * Clears all health records.
     */
    clear() {
        this._statuses$.next(new Map());
        this._bootStarts.clear();
    }
    // ─── Queries ────────────────────────────────────────────────
    /**
     * Gets the health status of a single plugin.
     */
    getStatus(pluginId) {
        return this._statuses$.value.get(pluginId);
    }
    /**
     * Gets a snapshot of all plugin health statuses.
     */
    getSnapshot() {
        return this._buildSnapshot(this._statuses$.value);
    }
    /**
     * Observable of the full health snapshot (reactive).
     */
    get snapshot$() {
        return this._statuses$.pipe(map((statuses) => this._buildSnapshot(statuses)));
    }
    /**
     * Observable of a single plugin's health status.
     */
    getStatus$(pluginId) {
        return this._statuses$.pipe(map((statuses) => statuses.get(pluginId)));
    }
    /**
     * Returns all plugin IDs in error or degraded state.
     */
    getUnhealthy() {
        return Array.from(this._statuses$.value.values()).filter((s) => s.state !== 'healthy');
    }
    ngOnDestroy() {
        this._statuses$.complete();
    }
    // ─── Private ────────────────────────────────────────────────
    _ensureEntry(pluginId) {
        if (!this._statuses$.value.has(pluginId)) {
            this._updateStatus(pluginId, () => ({
                pluginId,
                state: 'healthy',
                bootTimeMs: 0,
                errorCount: 0,
                loaded: false
            }));
        }
    }
    _updateStatus(pluginId, updater) {
        const statuses = new Map(this._statuses$.value);
        const current = statuses.get(pluginId) ?? {
            pluginId,
            state: 'healthy',
            bootTimeMs: 0,
            errorCount: 0,
            loaded: false
        };
        statuses.set(pluginId, updater(current));
        this._statuses$.next(statuses);
    }
    _buildSnapshot(statuses) {
        const plugins = Array.from(statuses.values());
        return {
            total: plugins.length,
            healthy: plugins.filter((s) => s.state === 'healthy').length,
            degraded: plugins.filter((s) => s.state === 'degraded').length,
            errored: plugins.filter((s) => s.state === 'error').length,
            plugins,
            totalBootTimeMs: plugins.reduce((sum, s) => sum + s.bootTimeMs, 0)
        };
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PluginHealthService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PluginHealthService, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PluginHealthService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });
//# sourceMappingURL=plugin-health.service.js.map