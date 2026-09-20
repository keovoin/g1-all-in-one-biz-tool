import { Route } from '@angular/router';
import { PageRouteLocationId } from '../../common/component-registry.types';
import { IPageRouteRegistry, PageRouteRegistryConfig } from './page-route-registry.types';
import * as i0 from "@angular/core";
/** Location used for top-level section routes (e.g. jobs) contributed by plugins under /pages. */
export declare const PAGE_SECTIONS_LOCATION: PageRouteLocationId;
/**
 * Top-level page paths reserved by core pages routing.
 * Plugins cannot register section routes for these paths; attempting to do so will throw.
 * Keep in sync with getPagesRoutes() in apps/gauzy/.../pages.routes.ts.
 *
 * Core route helpers → reserved paths:
 * - getDashboardRoute     → dashboard
 * - getAccountingRoutes   → accounting
 * - getContactsRoute      → contacts
 * - getProjectsRoute      → projects
 * - getTasksRoute         → tasks
 * - getSalesRoutes        → sales
 * - getEmployeesRoutes    → employees
 * - getOrganizationRoutes → organization
 * - getGoalsRoutes        → goals
 * - getReportsRoutes      → reports
 * - getHelpRoute          → help
 * - getAboutRoute         → about
 * - getIntegrationsRoute  → integrations
 * - getCandidatesRoute    → candidates
 * - getUsersRoute         → users
 * - getOrganizationsRoute → organizations
 * - getAuthRoute          → auth
 * - getSettingsRoute      → settings
 * - getLegalRoute         → legal
 *
 * Plugin paths (NOT reserved, e.g. jobs) are registered via PAGE_SECTIONS_LOCATION.
 */
export declare const RESERVED_PAGE_SECTION_PATHS: Set<string>;
export declare class PageRouteRegistryService implements IPageRouteRegistry {
    /**
     * Registry for storing page route configurations.
     *
     * This Map stores arrays of PageRouteRegistryConfig objects, keyed by PageRouteLocationId.
     */
    private readonly registry;
    /**
     * Retrieves a read-only snapshot of the page route registry.
     *
     * This method returns a new `Map` instance based on the current state of the `registry`.
     * This approach ensures that the original `registry` remains unchanged and protected
     * from direct modifications, preserving encapsulation and immutability.
     *
     * @returns A `ReadonlyMap` containing the current page route registry. This map
     *          provides a snapshot of the registry's state and cannot be modified,
     *          ensuring that internal data integrity is maintained.
     */
    getRegistry(): ReadonlyMap<PageRouteLocationId, PageRouteRegistryConfig[]>;
    /**
     * Register a single page route configuration.
     *
     * This method registers a new page route configuration in the service's internal registry.
     * It ensures that the configuration has a valid location property and checks if a route
     * with the same location already exists to prevent duplicate entries. If the configuration
     * is valid and unique, it adds it to the registry.
     *
     * @param config The configuration for the page route.
     * @throws Will throw an error if the configuration does not have a location property.
     * @throws Will throw an error if a route with the same location has already been registered.
     */
    registerPageRoute(config: PageRouteRegistryConfig): void;
    /**
     * Register multiple page route configurations.
     *
     * This method registers multiple new page route configurations in the service's internal registry.
     * It ensures that each configuration has a valid location property and checks if a route with the same
     * location already exists to prevent duplicate entries. If the configurations are valid and unique,
     * it adds them to the registry.
     *
     * @param configs The array of configurations for the page routes.
     * @throws Will throw an error if a route with the same location and path has already been registered.
     */
    registerPageRoutes(configs: PageRouteRegistryConfig[]): void;
    /**
     * Filters out duplicate route configurations based on location and path combinations.
     *
     * @param configs The array of route configurations.
     * @returns The array of unique route configurations.
     */
    private _filterConfigs;
    /**
     * Get all registered routes for a specific location.
     *
     * This method retrieves all registered route configurations for a specified location identifier.
     * It maps the internal route configurations to Angular Route objects.
     *
     * @param location The page location identifier.
     * @returns The array of registered routes for the specified location.
     */
    getPageLocationRoutes(location: PageRouteLocationId): Route[];
    static ɵfac: i0.ɵɵFactoryDeclaration<PageRouteRegistryService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<PageRouteRegistryService>;
}
