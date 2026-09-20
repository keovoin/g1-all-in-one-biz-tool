import { NgModule } from '@angular/core';
import { ROUTES } from '@angular/router';
import { PageRouteRegistryService } from '@gauzy/ui-core/core';
import { createLegalRoutes } from './legal.routes';
import { CommonLegalModule } from './common-legal.module';
import * as i0 from "@angular/core";
export class LegalModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: LegalModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: LegalModule, imports: [CommonLegalModule] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: LegalModule, providers: [
            {
                provide: ROUTES,
                useFactory: (service) => createLegalRoutes(service),
                deps: [PageRouteRegistryService],
                multi: true
            }
        ], imports: [CommonLegalModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: LegalModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonLegalModule],
                    providers: [
                        {
                            provide: ROUTES,
                            useFactory: (service) => createLegalRoutes(service),
                            deps: [PageRouteRegistryService],
                            multi: true
                        }
                    ]
                }]
        }] });
//# sourceMappingURL=legal.module.js.map