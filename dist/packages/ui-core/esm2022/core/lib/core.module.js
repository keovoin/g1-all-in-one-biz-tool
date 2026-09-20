import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_RIPPLE_GLOBAL_OPTIONS } from '@angular/material/core';
import { of as observableOf } from 'rxjs';
import { NbAuthModule } from '@nebular/auth';
import { NbSecurityModule, NbRoleProvider } from '@nebular/security';
import { AuthModule } from './auth/auth.module';
import { AnalyticsService, AppGlobalRippleOptions, JitsuService, LayoutService, SeoService } from './services';
import { throwIfAlreadyLoaded } from './module-import-guard';
import * as i0 from "@angular/core";
const DATA_SERVICES = [];
export class NbSimpleRoleProvider extends NbRoleProvider {
    getRole() {
        // here you could provide any role based on any auth flow
        return observableOf('guest');
    }
}
export const NB_CORE_PROVIDERS = [
    ...DATA_SERVICES,
    NbSecurityModule.forRoot({
        accessControl: {
            guest: {
                view: '*'
            },
            user: {
                parent: 'guest',
                create: '*',
                edit: '*',
                remove: '*'
            }
        }
    }).providers,
    {
        provide: NbRoleProvider,
        useClass: NbSimpleRoleProvider
    },
    {
        provide: MAT_RIPPLE_GLOBAL_OPTIONS,
        useExisting: AppGlobalRippleOptions
    },
    AnalyticsService,
    LayoutService,
    SeoService,
    JitsuService
];
export class CoreModule {
    constructor(parentModule) {
        throwIfAlreadyLoaded(parentModule, 'CoreModule');
    }
    /**
     * Returns a ModuleWithProviders object that specifies the CoreModule and its providers.
     *
     * @return {ModuleWithProviders<CoreModule>} A ModuleWithProviders object with the CoreModule and its providers.
     */
    static forRoot() {
        return {
            ngModule: CoreModule,
            providers: [...NB_CORE_PROVIDERS]
        };
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CoreModule, deps: [{ token: CoreModule, optional: true, skipSelf: true }], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: CoreModule, imports: [CommonModule, AuthModule], exports: [NbAuthModule] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CoreModule, imports: [CommonModule, AuthModule, NbAuthModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CoreModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, AuthModule],
                    exports: [NbAuthModule],
                    declarations: []
                }]
        }], ctorParameters: () => [{ type: CoreModule, decorators: [{
                    type: Optional
                }, {
                    type: SkipSelf
                }] }] });
//# sourceMappingURL=core.module.js.map