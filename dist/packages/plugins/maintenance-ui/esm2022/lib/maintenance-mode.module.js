import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ROUTES } from '@angular/router';
import { NbLayoutModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { PageRouteRegistryService } from '@gauzy/ui-core/core';
import { createMaintenanceRoutes } from './maintenance-mode.routes';
import { MaintenanceModeComponent } from './maintenance-mode.component';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class MaintenanceModeModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: MaintenanceModeModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: MaintenanceModeModule, declarations: [MaintenanceModeComponent], imports: [CommonModule, i1.TranslateModule, NbLayoutModule], exports: [RouterModule] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: MaintenanceModeModule, providers: [
            {
                provide: ROUTES,
                useFactory: (service) => createMaintenanceRoutes(service),
                deps: [PageRouteRegistryService],
                multi: true
            }
        ], imports: [CommonModule, TranslateModule.forChild(), NbLayoutModule, RouterModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: MaintenanceModeModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, TranslateModule.forChild(), NbLayoutModule],
                    declarations: [MaintenanceModeComponent],
                    exports: [RouterModule],
                    providers: [
                        {
                            provide: ROUTES,
                            useFactory: (service) => createMaintenanceRoutes(service),
                            deps: [PageRouteRegistryService],
                            multi: true
                        }
                    ]
                }]
        }] });
//# sourceMappingURL=maintenance-mode.module.js.map