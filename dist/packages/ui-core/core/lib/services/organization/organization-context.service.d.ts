import { IOrganization } from '@gauzy/contracts';
import * as i0 from "@angular/core";
/**
 * Service responsible for switching organization context.
 *
 * When a user switches organizations within the same tenant, this service:
 * 1. Calls the backend to generate a new JWT with the correct employeeId for the target organization
 * 2. Updates the store with the new tokens and user data
 * 3. Updates the selected organization in the store
 *
 * This ensures that the JWT always contains the correct employeeId for the current organization,
 * supporting the 1:N relationship between User and Employee.
 */
export declare class OrganizationContextService {
    private readonly store;
    private readonly authService;
    private readonly toastrService;
    /**
     * Switch to a different organization within the same workspace.
     * This generates a new JWT with the correct employeeId for the target organization.
     *
     * @param organization The organization to switch to
     * @returns Promise that resolves when the switch is complete
     */
    switchOrganization(organization: IOrganization): Promise<boolean>;
    /**
     * Apply the new organization data to the store after a successful switch.
     *
     * @param response The auth response from the switch organization API
     * @param organization The target organization
     * @returns true if applied successfully, false if validation failed
     */
    private applyOrganizationData;
    /**
     * Initialize the service.
     *
     * @deprecated This method is retained for backward compatibility with AppInitService.
     * Organization switching is now done explicitly via switchOrganization().
     * This will be removed in a future version.
     */
    initialize(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<OrganizationContextService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<OrganizationContextService>;
}
