import { __decorate, __metadata } from "tslib";
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NgxPermissionsService } from 'ngx-permissions';
import { ErrorHandlingService, FeatureStoreService, PermissionsService, Store } from '@gauzy/ui-core/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
import * as i2 from "ngx-permissions";
import * as i3 from "@angular/router";
import * as i4 from "@gauzy/ui-core/core";
import * as i5 from "@nebular/theme";
import * as i6 from "@gauzy/ui-core/theme";
import * as i7 from "@angular/common";
let OnboardingCompleteComponent = class OnboardingCompleteComponent extends TranslationBaseComponent {
    constructor(translationService, _ngxPermissionsService, _router, _store, _permissionsService, _featureStoreService, _errorHandlingService) {
        super(translationService);
        this._ngxPermissionsService = _ngxPermissionsService;
        this._router = _router;
        this._store = _store;
        this._permissionsService = _permissionsService;
        this._featureStoreService = _featureStoreService;
        this._errorHandlingService = _errorHandlingService;
        this.blocks$ = this._featureStoreService.blocks$;
        this.features$ = this._featureStoreService.features$;
    }
    async ngOnInit() {
        const id = this._store.userId;
        if (!id)
            return;
        try {
            // Get user permissions
            const permissions = await this._permissionsService.getPermissions();
            // Only enabled permissions assign to logged in user
            await this.initializeUiPermissions(permissions);
        }
        catch (error) {
            console.log('Error while initializing UI permissions', error);
            this._errorHandlingService.handleError(error);
        }
        finally {
            this.getFeatures();
        }
    }
    /**
     * Initialize UI permissions
     */
    async initializeUiPermissions(userRolePermissions) {
        const permissions = userRolePermissions.map(({ permission }) => permission); // Extract permission from role permissions
        this._ngxPermissionsService.flushPermissions(); // Flush permissions
        this._ngxPermissionsService.loadPermissions(permissions); // Load permissions
    }
    /**
     * Get Features
     */
    getFeatures() {
        this._featureStoreService.loadFeatures(['children']).pipe(untilDestroyed(this)).subscribe();
    }
    /**
     * Navigate to the specified link
     *
     * @param link The relative link to navigate to.
     */
    navigateTo(link) {
        // Normalize the link by removing leading or trailing slashes if any
        const normalizedLink = link.replace(/^\/|\/$/g, '');
        // Construct the URL and navigate
        this._router.navigate([`pages/${normalizedLink}`]);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: OnboardingCompleteComponent, deps: [{ token: i1.TranslateService }, { token: i2.NgxPermissionsService }, { token: i3.Router }, { token: i4.Store }, { token: i4.PermissionsService }, { token: i4.FeatureStoreService }, { token: i4.ErrorHandlingService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: OnboardingCompleteComponent, isStandalone: false, selector: "ga-onboarding-complete", usesInheritance: true, ngImport: i0, template: "<!-- Switch theme -->\n<gauzy-switch-theme class=\"switch-theme\" [hasText]=\"false\"></gauzy-switch-theme>\n\n<!-- Gauzy logo -->\n<div class=\"logo\">\n  <ngx-gauzy-logo [isAccordion]=\"false\"></ngx-gauzy-logo>\n  <h4>{{ 'ONBOARDING.COMPLETE_TITLE' | translate }}</h4>\n  <h6>{{ 'ONBOARDING.COMPLETE_SUB_TITLE' | translate }}</h6>\n</div>\n\n<!-- Blocks -->\n@for (block of blocks$ | async; track block) {\n  <div class=\"row centered\">\n    @for (row of block; track row) {\n      <div class=\"col-3\">\n        <nb-card class=\"shortcut-card\" [status]=\"row?.status\" (click)=\"navigateTo(row?.link)\">\n          <nb-card-header>\n            @if (row?.icon) {\n              <nb-icon [icon]=\"row?.icon\"></nb-icon>\n            }\n            {{ row?.name }}\n          </nb-card-header>\n          <nb-card-body class=\"border border-top-0\">\n            <div class=\"shortcut\">\n              <div>\n                {{ row?.description }}\n              </div>\n            </div>\n          </nb-card-body>\n        </nb-card>\n      </div>\n    }\n  </div>\n}\n", styles: [".logo{display:flex;align-items:center;flex-direction:column;justify-content:center;margin-bottom:32px}.logo h4{font-size:20px;margin-top:20px}.logo h4,.logo h6{font-weight:600}.logo h6{font-size:16px}.logo ngx-gauzy-logo::ng-deep object{width:216px}.shortcut-card{margin-bottom:20px;cursor:pointer;background-color:var(--gauzy-card-2)}.shortcut-card nb-card-body{border-radius:0 0 var(--border-radius) var(--border-radius)}.shortcut-card:hover{transform:translateY(-1px);box-shadow:0 2px 9px #00000042}.centered{justify-content:center}.switch-theme{position:absolute;right:0;top:0}:host{position:relative}\n"], dependencies: [{ kind: "component", type: i5.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i5.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "component", type: i5.NbCardHeaderComponent, selector: "nb-card-header" }, { kind: "component", type: i5.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "component", type: i6.GauzyLogoComponent, selector: "ngx-gauzy-logo", inputs: ["controlled", "isAccordion", "isWorkspaceOpen"], outputs: ["onCollapsed", "onWorkspaceToggle"] }, { kind: "component", type: i6.SwitchThemeComponent, selector: "gauzy-switch-theme", inputs: ["hasText"] }, { kind: "pipe", type: i7.AsyncPipe, name: "async" }, { kind: "pipe", type: i1.TranslatePipe, name: "translate" }] }); }
};
OnboardingCompleteComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [TranslateService,
        NgxPermissionsService,
        Router,
        Store,
        PermissionsService,
        FeatureStoreService,
        ErrorHandlingService])
], OnboardingCompleteComponent);
export { OnboardingCompleteComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: OnboardingCompleteComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-onboarding-complete', standalone: false, template: "<!-- Switch theme -->\n<gauzy-switch-theme class=\"switch-theme\" [hasText]=\"false\"></gauzy-switch-theme>\n\n<!-- Gauzy logo -->\n<div class=\"logo\">\n  <ngx-gauzy-logo [isAccordion]=\"false\"></ngx-gauzy-logo>\n  <h4>{{ 'ONBOARDING.COMPLETE_TITLE' | translate }}</h4>\n  <h6>{{ 'ONBOARDING.COMPLETE_SUB_TITLE' | translate }}</h6>\n</div>\n\n<!-- Blocks -->\n@for (block of blocks$ | async; track block) {\n  <div class=\"row centered\">\n    @for (row of block; track row) {\n      <div class=\"col-3\">\n        <nb-card class=\"shortcut-card\" [status]=\"row?.status\" (click)=\"navigateTo(row?.link)\">\n          <nb-card-header>\n            @if (row?.icon) {\n              <nb-icon [icon]=\"row?.icon\"></nb-icon>\n            }\n            {{ row?.name }}\n          </nb-card-header>\n          <nb-card-body class=\"border border-top-0\">\n            <div class=\"shortcut\">\n              <div>\n                {{ row?.description }}\n              </div>\n            </div>\n          </nb-card-body>\n        </nb-card>\n      </div>\n    }\n  </div>\n}\n", styles: [".logo{display:flex;align-items:center;flex-direction:column;justify-content:center;margin-bottom:32px}.logo h4{font-size:20px;margin-top:20px}.logo h4,.logo h6{font-weight:600}.logo h6{font-size:16px}.logo ngx-gauzy-logo::ng-deep object{width:216px}.shortcut-card{margin-bottom:20px;cursor:pointer;background-color:var(--gauzy-card-2)}.shortcut-card nb-card-body{border-radius:0 0 var(--border-radius) var(--border-radius)}.shortcut-card:hover{transform:translateY(-1px);box-shadow:0 2px 9px #00000042}.centered{justify-content:center}.switch-theme{position:absolute;right:0;top:0}:host{position:relative}\n"] }]
        }], ctorParameters: () => [{ type: i1.TranslateService }, { type: i2.NgxPermissionsService }, { type: i3.Router }, { type: i4.Store }, { type: i4.PermissionsService }, { type: i4.FeatureStoreService }, { type: i4.ErrorHandlingService }] });
//# sourceMappingURL=onboarding-complete.component.js.map