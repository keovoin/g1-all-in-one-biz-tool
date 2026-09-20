import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ROUTES, RouterModule } from '@angular/router';
import { NbButtonModule, NbCardModule, NbIconModule, NbLayoutModule, NbSpinnerModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { NgxPermissionsModule } from 'ngx-permissions';
import { AuthService, FeatureStoreService, PageRouteRegistryService, RoleGuard, TenantService } from '@gauzy/ui-core/core';
import { OrganizationsStepFormModule } from '@gauzy/ui-core/shared';
import { ThemeModule, ThemeSelectorModule, ThemeSettingsModule } from '@gauzy/ui-core/theme';
import { createOnboardingRoutes } from './onboarding.routes';
import { OnboardingComponent } from './components/onboarding.component';
import { TenantOnboardingComponent } from './components/tenant-onboarding/tenant-onboarding.component';
import { OnboardingCompleteComponent } from './components/onboarding-complete/onboarding-complete.component';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
import * as i2 from "ngx-permissions";
import * as i3 from "@ngx-translate/core";
export class OnboardingModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: OnboardingModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: OnboardingModule, declarations: [OnboardingComponent, TenantOnboardingComponent, OnboardingCompleteComponent], imports: [CommonModule, i1.RouterModule, NbButtonModule,
            NbCardModule,
            NbIconModule,
            NbLayoutModule,
            NbSpinnerModule, i2.NgxPermissionsModule, i3.TranslateModule, ThemeModule,
            ThemeSelectorModule,
            ThemeSettingsModule,
            OrganizationsStepFormModule], exports: [RouterModule] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: OnboardingModule, providers: [
            AuthService,
            FeatureStoreService,
            TenantService,
            RoleGuard,
            {
                provide: ROUTES,
                useFactory: (service) => createOnboardingRoutes(service),
                deps: [PageRouteRegistryService],
                multi: true
            }
        ], imports: [CommonModule,
            RouterModule.forChild([]),
            NbButtonModule,
            NbCardModule,
            NbIconModule,
            NbLayoutModule,
            NbSpinnerModule,
            NgxPermissionsModule.forRoot(),
            TranslateModule.forChild(),
            ThemeModule,
            ThemeSelectorModule,
            ThemeSettingsModule,
            OrganizationsStepFormModule, RouterModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: OnboardingModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        RouterModule.forChild([]),
                        NbButtonModule,
                        NbCardModule,
                        NbIconModule,
                        NbLayoutModule,
                        NbSpinnerModule,
                        NgxPermissionsModule.forRoot(),
                        TranslateModule.forChild(),
                        ThemeModule,
                        ThemeSelectorModule,
                        ThemeSettingsModule,
                        OrganizationsStepFormModule
                    ],
                    exports: [RouterModule],
                    declarations: [OnboardingComponent, TenantOnboardingComponent, OnboardingCompleteComponent],
                    providers: [
                        AuthService,
                        FeatureStoreService,
                        TenantService,
                        RoleGuard,
                        {
                            provide: ROUTES,
                            useFactory: (service) => createOnboardingRoutes(service),
                            deps: [PageRouteRegistryService],
                            multi: true
                        }
                    ]
                }]
        }] });
//# sourceMappingURL=onboarding.module.js.map