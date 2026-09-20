import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ROUTES, RouterModule } from '@angular/router';
import { NbCardModule, NbIconModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { PageRouteRegistryService } from '@gauzy/ui-core/core';
import { WorkInProgressComponent } from './work-in-progress.component';
import { createWorkInProgressRoutes } from './work-in-progress.routes';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
import * as i2 from "@ngx-translate/core";
const NB_MODULES = [NbCardModule, NbIconModule];
export class WorkInProgressModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: WorkInProgressModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: WorkInProgressModule, declarations: [WorkInProgressComponent], imports: [CommonModule, i1.RouterModule, NbCardModule, NbIconModule, i2.TranslateModule], exports: [WorkInProgressComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: WorkInProgressModule, providers: [
            {
                provide: ROUTES,
                useFactory: (service) => createWorkInProgressRoutes(service),
                deps: [PageRouteRegistryService],
                multi: true
            }
        ], imports: [CommonModule, RouterModule.forChild([]), NB_MODULES, TranslateModule.forChild()] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: WorkInProgressModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, RouterModule.forChild([]), ...NB_MODULES, TranslateModule.forChild()],
                    declarations: [WorkInProgressComponent],
                    exports: [WorkInProgressComponent],
                    providers: [
                        {
                            provide: ROUTES,
                            useFactory: (service) => createWorkInProgressRoutes(service),
                            deps: [PageRouteRegistryService],
                            multi: true
                        }
                    ]
                }]
        }] });
//# sourceMappingURL=work-in-progress.module.js.map