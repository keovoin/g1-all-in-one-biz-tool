import { Router } from '@angular/router';
import { catchError, EMPTY, map } from 'rxjs';
import { inject } from '@angular/core';
import { IntegrationsService } from '../services/integration/integrations.service';
/**
 * Resolver function to fetch integration settings before activating the route.
 *
 * @param route - The activated route snapshot.
 * @returns An observable that emits integration settings or an empty observable on error.
 */
export const IntegrationSettingResolver = (route) => {
    // Inject necessary services
    const _router = inject(Router);
    const _integrationsService = inject(IntegrationsService);
    // Extract integration ID from route parameters
    const integrationId = route.paramMap.get('id');
    // Attempt to fetch integration settings
    return _integrationsService.getIntegrationTenant(integrationId, { relations: ['settings'] }).pipe(
    // Map integration settings to settings array
    map(({ settings }) => settings), 
    // Handle errors
    catchError((error) => {
        // Log the error and navigate to the new integrations page
        console.error('Error while fetching integration settings:', error);
        _router.navigate(['/pages/integrations/new']);
        // Return EMPTY observable
        return EMPTY;
    }));
};
//# sourceMappingURL=integration-setting.resolver.js.map