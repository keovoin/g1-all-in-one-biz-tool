import { MaintenanceModeComponent } from './maintenance-mode.component';
/**
 * Creates the routes for the maintenance mode plugin.
 *
 * @param _pageRouteRegistryService An instance of PageRouteRegistryService
 * @returns An array of Route objects
 */
export const createMaintenanceRoutes = (_pageRouteRegistryService) => [
    {
        path: '',
        component: MaintenanceModeComponent
    }
];
//# sourceMappingURL=maintenance-mode.routes.js.map