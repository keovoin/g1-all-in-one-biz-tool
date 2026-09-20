import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ROUTES, RouterModule } from '@angular/router';
import { NbButtonModule, NbCardModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { PageRouteRegistryService } from '@gauzy/ui-core/core';
import { createRoutes } from './miscellaneous.routes';
import { MiscellaneousComponent } from './miscellaneous.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
import * as i2 from "@ngx-translate/core";
const NB_MODULES = [NbCardModule, NbButtonModule];
export class MiscellaneousModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: MiscellaneousModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: MiscellaneousModule, declarations: [MiscellaneousComponent, NotFoundComponent], imports: [CommonModule, i1.RouterModule, NbCardModule, NbButtonModule, i2.TranslateModule], exports: [MiscellaneousComponent, NotFoundComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: MiscellaneousModule, providers: [
            {
                provide: ROUTES,
                useFactory: (service) => createRoutes(service),
                deps: [PageRouteRegistryService],
                multi: true
            }
        ], imports: [CommonModule, RouterModule.forChild([]), NB_MODULES, TranslateModule.forChild()] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: MiscellaneousModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, RouterModule.forChild([]), ...NB_MODULES, TranslateModule.forChild()],
                    declarations: [MiscellaneousComponent, NotFoundComponent],
                    exports: [MiscellaneousComponent, NotFoundComponent],
                    providers: [
                        {
                            provide: ROUTES,
                            useFactory: (service) => createRoutes(service),
                            deps: [PageRouteRegistryService],
                            multi: true
                        }
                    ]
                }]
        }] });
//# sourceMappingURL=miscellaneous.module.js.map