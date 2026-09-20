import { __decorate, __metadata } from "tslib";
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, firstValueFrom, tap } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AuthService, EmployeesService, ErrorHandlingService, OrganizationsService, Store, TenantService, UsersService } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
import * as i2 from "@gauzy/ui-core/core";
import * as i3 from "@gauzy/ui-core/theme";
import * as i4 from "@gauzy/ui-core/shared";
import * as i5 from "@ngx-translate/core";
let TenantOnboardingComponent = class TenantOnboardingComponent {
    constructor(_router, _activatedRoute, _organizationsService, _tenantService, _usersService, _store, _authService, _employeesService, _errorHandlingService) {
        this._router = _router;
        this._activatedRoute = _activatedRoute;
        this._organizationsService = _organizationsService;
        this._tenantService = _tenantService;
        this._usersService = _usersService;
        this._store = _store;
        this._authService = _authService;
        this._employeesService = _employeesService;
        this._errorHandlingService = _errorHandlingService;
        this.loading = true;
    }
    ngOnInit() {
        this._activatedRoute.data
            .pipe(filter(({ user }) => !!user), tap(({ user }) => (this._store.user = user)), tap(() => (this.loading = false)), 
        // Handle component lifecycle to avoid memory leaks
        untilDestroyed(this))
            .subscribe();
    }
    /**
     * Onboard a user by creating a tenant, fetching the user details, and setting up the organization.
     *
     * @param {IOrganizationCreateInput} organization - The organization input data required for onboarding.
     */
    async onboardUser(organization) {
        this.loading = true;
        try {
            const tenant = await this._tenantService.create({ name: organization.name });
            this.user = await this._usersService.getMe(['tenant']);
            this._store.user = this.user;
            try {
                const createdOrganization = await this._organizationsService.create({
                    ...organization,
                    tenant,
                    isDefault: true
                });
                await this.getAccessTokenFromRefreshToken();
                this.registerEmployeeFeature(organization, createdOrganization); // Process in the background
                this._router.navigate(['/onboarding/complete']);
            }
            catch (error) {
                console.error('Error while creating organization:', error);
            }
        }
        catch (error) {
            console.error('Error while creating tenant:', error);
            // Handle and log errors using the _errorHandlingService
            this._errorHandlingService.handleError(error);
        }
        finally {
            this.loading = false;
        }
    }
    /**
     * Registers the user as an employee during the initial onboarding process.
     *
     * @param {IOrganizationCreateInput} organization - The organization input data required for registration.
     * @param {IOrganization} createdOrganization - The created organization entity.
     */
    async registerEmployeeFeature(organization, createdOrganization) {
        if (!createdOrganization || !this.user) {
            return;
        }
        if (organization.registerAsEmployee) {
            const { id: organizationId } = createdOrganization;
            const { id: userId, tenantId } = this.user;
            try {
                await firstValueFrom(this._employeesService.create({
                    startedWorkOn: organization.startedWorkOn ? new Date(organization.startedWorkOn) : null,
                    userId,
                    organizationId,
                    tenantId
                }));
            }
            catch (error) {
                console.error('Error while registering employee:', error);
            }
        }
    }
    /**
     * Get new access token using refresh token stored in _store
     */
    async getAccessTokenFromRefreshToken() {
        try {
            const { refresh_token } = this._store;
            if (refresh_token) {
                const { token } = await this._authService.refreshToken(refresh_token);
                if (token) {
                    this._store.token = token;
                }
            }
        }
        catch (error) {
            console.error('Error while retrieving refresh token', error);
        }
    }
    ngOnDestroy() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TenantOnboardingComponent, deps: [{ token: i1.Router }, { token: i1.ActivatedRoute }, { token: i2.OrganizationsService }, { token: i2.TenantService }, { token: i2.UsersService }, { token: i2.Store }, { token: i2.AuthService }, { token: i2.EmployeesService }, { token: i2.ErrorHandlingService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: TenantOnboardingComponent, isStandalone: false, selector: "ga-tenant-onboarding", ngImport: i0, template: "<gauzy-switch-theme class=\"switch-theme\" [hasText]=\"false\"></gauzy-switch-theme>\n\n<div class=\"logo\">\n\t<ngx-gauzy-logo [isAccordion]=\"false\"></ngx-gauzy-logo>\n\t{{ 'ONBOARDING.FIRST_ORGANIZATION' | translate }}\n</div>\n\n<ga-organizations-step-form\n\tclass=\"step-form\"\n\t[loading]=\"loading\"\n\t[isOnboarding]=\"true\"\n\t(createOrganization)=\"onboardUser($event)\"\n></ga-organizations-step-form>\n", styles: [".logo{display:flex;flex-direction:column;justify-content:center;align-items:center;margin-bottom:10px}.switch-theme{position:absolute;right:0;top:0}:host{display:flex;justify-content:center;align-items:center;flex-direction:column;position:relative}:host .step-form{min-width:60%}:host .step-form ::ng-deep input{background-color:nb-theme(select-outline-basic-background-color)}\n"], dependencies: [{ kind: "component", type: i3.GauzyLogoComponent, selector: "ngx-gauzy-logo", inputs: ["controlled", "isAccordion", "isWorkspaceOpen"], outputs: ["onCollapsed", "onWorkspaceToggle"] }, { kind: "component", type: i3.SwitchThemeComponent, selector: "gauzy-switch-theme", inputs: ["hasText"] }, { kind: "component", type: i4.OrganizationsStepFormComponent, selector: "ga-organizations-step-form", inputs: ["isOnboarding", "closable", "loading"], outputs: ["createOrganization", "closeForm"] }, { kind: "pipe", type: i5.TranslatePipe, name: "translate" }] }); }
};
TenantOnboardingComponent = __decorate([
    UntilDestroy(),
    __metadata("design:paramtypes", [Router,
        ActivatedRoute,
        OrganizationsService,
        TenantService,
        UsersService,
        Store,
        AuthService,
        EmployeesService,
        ErrorHandlingService])
], TenantOnboardingComponent);
export { TenantOnboardingComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TenantOnboardingComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-tenant-onboarding', standalone: false, template: "<gauzy-switch-theme class=\"switch-theme\" [hasText]=\"false\"></gauzy-switch-theme>\n\n<div class=\"logo\">\n\t<ngx-gauzy-logo [isAccordion]=\"false\"></ngx-gauzy-logo>\n\t{{ 'ONBOARDING.FIRST_ORGANIZATION' | translate }}\n</div>\n\n<ga-organizations-step-form\n\tclass=\"step-form\"\n\t[loading]=\"loading\"\n\t[isOnboarding]=\"true\"\n\t(createOrganization)=\"onboardUser($event)\"\n></ga-organizations-step-form>\n", styles: [".logo{display:flex;flex-direction:column;justify-content:center;align-items:center;margin-bottom:10px}.switch-theme{position:absolute;right:0;top:0}:host{display:flex;justify-content:center;align-items:center;flex-direction:column;position:relative}:host .step-form{min-width:60%}:host .step-form ::ng-deep input{background-color:nb-theme(select-outline-basic-background-color)}\n"] }]
        }], ctorParameters: () => [{ type: i1.Router }, { type: i1.ActivatedRoute }, { type: i2.OrganizationsService }, { type: i2.TenantService }, { type: i2.UsersService }, { type: i2.Store }, { type: i2.AuthService }, { type: i2.EmployeesService }, { type: i2.ErrorHandlingService }] });
//# sourceMappingURL=tenant-onboarding.component.js.map