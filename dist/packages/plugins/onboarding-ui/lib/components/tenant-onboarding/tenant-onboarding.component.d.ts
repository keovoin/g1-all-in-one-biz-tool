import { OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IOrganization, IOrganizationCreateInput, IUser } from '@gauzy/contracts';
import { AuthService, EmployeesService, ErrorHandlingService, OrganizationsService, Store, TenantService, UsersService } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
export declare class TenantOnboardingComponent implements OnInit, OnDestroy {
    private readonly _router;
    private readonly _activatedRoute;
    private readonly _organizationsService;
    private readonly _tenantService;
    private readonly _usersService;
    private readonly _store;
    private readonly _authService;
    private readonly _employeesService;
    private readonly _errorHandlingService;
    loading: boolean;
    user: IUser;
    constructor(_router: Router, _activatedRoute: ActivatedRoute, _organizationsService: OrganizationsService, _tenantService: TenantService, _usersService: UsersService, _store: Store, _authService: AuthService, _employeesService: EmployeesService, _errorHandlingService: ErrorHandlingService);
    ngOnInit(): void;
    /**
     * Onboard a user by creating a tenant, fetching the user details, and setting up the organization.
     *
     * @param {IOrganizationCreateInput} organization - The organization input data required for onboarding.
     */
    onboardUser(organization: IOrganizationCreateInput): Promise<void>;
    /**
     * Registers the user as an employee during the initial onboarding process.
     *
     * @param {IOrganizationCreateInput} organization - The organization input data required for registration.
     * @param {IOrganization} createdOrganization - The created organization entity.
     */
    registerEmployeeFeature(organization: IOrganizationCreateInput, createdOrganization: IOrganization): Promise<void>;
    /**
     * Get new access token using refresh token stored in _store
     */
    getAccessTokenFromRefreshToken(): Promise<void>;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<TenantOnboardingComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<TenantOnboardingComponent, "ga-tenant-onboarding", never, {}, {}, never, never, false, never>;
}
