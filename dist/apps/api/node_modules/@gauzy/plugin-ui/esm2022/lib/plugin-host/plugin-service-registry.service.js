import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import * as i0 from "@angular/core";
/**
 * Cross-plugin service registry.
 *
 * Allows Plugin A to expose a service implementation and Plugin B to consume it,
 * using a contract-based approach (string contract IDs).
 *
 * Services are registered with a contract ID and can be retrieved synchronously
 * or observed reactively for late-arriving providers.
 *
 * Convention: use `'pluginId:serviceName'` as contract IDs.
 *
 * @example
 * ```ts
 * // Plugin A (provider) — in ngOnPluginBootstrap or bootstrap callback:
 * const serviceRegistry = injector.get(PluginServiceRegistryService);
 * serviceRegistry.register({
 *   contractId: 'analytics:tracker',
 *   instance: new AnalyticsTracker(),
 *   pluginId: 'analytics-plugin'
 * });
 *
 * // Plugin B (consumer):
 * const tracker = serviceRegistry.get<AnalyticsTracker>('analytics:tracker');
 * if (tracker) {
 *   tracker.track('page-view', { page: '/dashboard' });
 * }
 *
 * // Or reactively (wait for late registration):
 * serviceRegistry.get$<AnalyticsTracker>('analytics:tracker').subscribe(tracker => {
 *   if (tracker) tracker.track('page-view', { page: '/dashboard' });
 * });
 * ```
 */
export class PluginServiceRegistryService {
    _services$ = new BehaviorSubject(new Map());
    // Plugin to contract mapping for cleanup
    _pluginToContracts = new Map();
    // ─── Registration ───────────────────────────────────────────────────────
    /**
     * Registers a service under a contract ID.
     * Overwrites any existing registration for the same contract ID.
     */
    register(registration) {
        const services = new Map(this._services$.value);
        // If another plugin previously owned this contract, remove it from that plugin's tracking
        // to prevent unregisterByPlugin from deleting a contract it no longer owns.
        const existing = services.get(registration.contractId);
        if (existing && existing.pluginId !== registration.pluginId) {
            const prevContracts = this._pluginToContracts.get(existing.pluginId);
            if (prevContracts) {
                const idx = prevContracts.indexOf(registration.contractId);
                if (idx !== -1) {
                    prevContracts.splice(idx, 1);
                }
                if (prevContracts.length === 0) {
                    this._pluginToContracts.delete(existing.pluginId);
                }
            }
        }
        services.set(registration.contractId, registration);
        this._services$.next(services);
        // Track for plugin cleanup
        const contracts = this._pluginToContracts.get(registration.pluginId) ?? [];
        if (!contracts.includes(registration.contractId)) {
            contracts.push(registration.contractId);
            this._pluginToContracts.set(registration.pluginId, contracts);
        }
    }
    /**
     * Unregisters a service by contract ID.
     */
    unregister(contractId) {
        const services = new Map(this._services$.value);
        services.delete(contractId);
        this._services$.next(services);
    }
    /**
     * Unregisters all services provided by a plugin.
     * Call from `ngOnPluginDestroy` or plugin cleanup logic.
     */
    unregisterByPlugin(pluginId) {
        const contracts = this._pluginToContracts.get(pluginId);
        if (contracts) {
            const services = new Map(this._services$.value);
            for (const contractId of contracts) {
                services.delete(contractId);
            }
            this._services$.next(services);
            this._pluginToContracts.delete(pluginId);
        }
    }
    // ─── Retrieval ──────────────────────────────────────────────────────────
    /**
     * Gets a service instance by contract ID (synchronous).
     * Returns `undefined` if not registered.
     */
    get(contractId) {
        const reg = this._services$.value.get(contractId);
        return reg?.instance;
    }
    /**
     * Gets a service instance by contract ID, throwing if not found.
     * Use when the service is required and should have been registered.
     */
    getRequired(contractId) {
        const instance = this.get(contractId);
        if (instance === undefined) {
            throw new Error(`[PluginServiceRegistry] Required service '${contractId}' is not registered.`);
        }
        return instance;
    }
    /**
     * Observes a service by contract ID (reactive).
     * Emits `undefined` initially if not yet registered, then the instance
     * when it becomes available.
     */
    get$(contractId) {
        return this._services$.pipe(map((services) => services.get(contractId)?.instance));
    }
    /**
     * Returns the full registration metadata for a contract.
     */
    getRegistration(contractId) {
        return this._services$.value.get(contractId);
    }
    // ─── Query ──────────────────────────────────────────────────────────────
    /**
     * Checks if a service is registered under a contract ID.
     */
    has(contractId) {
        return this._services$.value.has(contractId);
    }
    /**
     * Returns all registered contract IDs.
     */
    getContractIds() {
        return Array.from(this._services$.value.keys());
    }
    /**
     * Returns all registrations for a given plugin.
     */
    getByPlugin(pluginId) {
        const contracts = this._pluginToContracts.get(pluginId) ?? [];
        return contracts
            .map((id) => this._services$.value.get(id))
            .filter((reg) => reg !== undefined);
    }
    /**
     * Observable of all registered services (reactive).
     */
    get all$() {
        return this._services$.pipe(map((services) => Array.from(services.values())));
    }
    /**
     * Clears all registrations.
     */
    clear() {
        this._services$.next(new Map());
        this._pluginToContracts.clear();
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PluginServiceRegistryService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PluginServiceRegistryService, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PluginServiceRegistryService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });
//# sourceMappingURL=plugin-service-registry.service.js.map