import { OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import * as i0 from "@angular/core";
/**
 * Health status for a single plugin.
 */
export interface PluginHealthStatus {
    /** Plugin ID. */
    pluginId: string;
    /** Current health state. */
    state: 'healthy' | 'degraded' | 'error';
    /** Boot duration in milliseconds (0 if not yet booted). */
    bootTimeMs: number;
    /** Number of errors recorded. */
    errorCount: number;
    /** Most recent error (if any). */
    lastError?: {
        message: string;
        timestamp: number;
    };
    /** Timestamp of first boot. */
    bootedAt?: number;
    /** Whether the plugin is currently loaded. */
    loaded: boolean;
}
/**
 * Aggregate health snapshot across all plugins.
 */
export interface PluginHealthSnapshot {
    /** Total plugins being tracked. */
    total: number;
    /** Healthy count. */
    healthy: number;
    /** Degraded count. */
    degraded: number;
    /** Errored count. */
    errored: number;
    /** Per-plugin statuses. */
    plugins: PluginHealthStatus[];
    /** Total boot time across all plugins (ms). */
    totalBootTimeMs: number;
}
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
export declare class PluginHealthService implements OnDestroy {
    private readonly _eventBus;
    private readonly _statuses$;
    /** Pending boot start timestamps. */
    private readonly _bootStarts;
    /**
     * Marks the start of a plugin boot sequence.
     */
    recordBootStart(pluginId: string): void;
    /**
     * Marks the end of a plugin boot sequence.
     * Calculates boot duration from the matching `recordBootStart`.
     */
    recordBootEnd(pluginId: string): void;
    /**
     * Records an error for a plugin.
     * Transitions the plugin to 'degraded' (1–4 errors) or 'error' (5+).
     */
    recordError(pluginId: string, error: Error | string): void;
    /**
     * Marks a plugin as unloaded.
     */
    recordUnloaded(pluginId: string): void;
    /**
     * Resets the health status for a plugin.
     */
    reset(pluginId: string): void;
    /**
     * Clears all health records.
     */
    clear(): void;
    /**
     * Gets the health status of a single plugin.
     */
    getStatus(pluginId: string): PluginHealthStatus | undefined;
    /**
     * Gets a snapshot of all plugin health statuses.
     */
    getSnapshot(): PluginHealthSnapshot;
    /**
     * Observable of the full health snapshot (reactive).
     */
    get snapshot$(): Observable<PluginHealthSnapshot>;
    /**
     * Observable of a single plugin's health status.
     */
    getStatus$(pluginId: string): Observable<PluginHealthStatus | undefined>;
    /**
     * Returns all plugin IDs in error or degraded state.
     */
    getUnhealthy(): PluginHealthStatus[];
    ngOnDestroy(): void;
    private _ensureEntry;
    private _updateStatus;
    private _buildSnapshot;
    static ɵfac: i0.ɵɵFactoryDeclaration<PluginHealthService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<PluginHealthService>;
}
