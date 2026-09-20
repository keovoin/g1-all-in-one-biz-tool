import { Observable } from 'rxjs';
import * as i0 from "@angular/core";
/**
 * Describes a registered cross-plugin service.
 */
export interface PluginServiceRegistration<T = unknown> {
    /** Unique contract identifier (e.g. 'analytics:tracker', 'auth:session'). */
    contractId: string;
    /** The service instance. */
    instance: T;
    /** Plugin ID of the provider. */
    pluginId: string;
    /** Optional version string for contract compatibility checks. */
    version?: string;
}
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
export declare class PluginServiceRegistryService {
    private readonly _services$;
    private readonly _pluginToContracts;
    /**
     * Registers a service under a contract ID.
     * Overwrites any existing registration for the same contract ID.
     */
    register<T>(registration: PluginServiceRegistration<T>): void;
    /**
     * Unregisters a service by contract ID.
     */
    unregister(contractId: string): void;
    /**
     * Unregisters all services provided by a plugin.
     * Call from `ngOnPluginDestroy` or plugin cleanup logic.
     */
    unregisterByPlugin(pluginId: string): void;
    /**
     * Gets a service instance by contract ID (synchronous).
     * Returns `undefined` if not registered.
     */
    get<T>(contractId: string): T | undefined;
    /**
     * Gets a service instance by contract ID, throwing if not found.
     * Use when the service is required and should have been registered.
     */
    getRequired<T>(contractId: string): T;
    /**
     * Observes a service by contract ID (reactive).
     * Emits `undefined` initially if not yet registered, then the instance
     * when it becomes available.
     */
    get$<T>(contractId: string): Observable<T | undefined>;
    /**
     * Returns the full registration metadata for a contract.
     */
    getRegistration(contractId: string): PluginServiceRegistration | undefined;
    /**
     * Checks if a service is registered under a contract ID.
     */
    has(contractId: string): boolean;
    /**
     * Returns all registered contract IDs.
     */
    getContractIds(): string[];
    /**
     * Returns all registrations for a given plugin.
     */
    getByPlugin(pluginId: string): PluginServiceRegistration[];
    /**
     * Observable of all registered services (reactive).
     */
    get all$(): Observable<PluginServiceRegistration[]>;
    /**
     * Clears all registrations.
     */
    clear(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<PluginServiceRegistryService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<PluginServiceRegistryService>;
}
