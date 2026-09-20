import { NgModule } from '@angular/core';
import { ROUTES } from '@angular/router';
import { PageRouteRegistryService } from '@gauzy/ui-core/core';
import { createPageLegalRoutes } from './page-legal.routes';
import { CommonLegalModule } from './common-legal.module';
import * as i0 from "@angular/core";
export class PageLegalModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PageLegalModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: PageLegalModule, imports: [CommonLegalModule] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PageLegalModule, providers: [
            {
                provide: ROUTES,
                useFactory: (service) => createPageLegalRoutes(service),
                deps: [PageRouteRegistryService],
                multi: true
            }
        ], imports: [CommonLegalModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PageLegalModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonLegalModule],
                    providers: [
                        {
                            provide: ROUTES,
                            useFactory: (service) => createPageLegalRoutes(service),
                            deps: [PageRouteRegistryService],
                            multi: true
                        }
                    ]
                }]
        }] });
//# sourceMappingURL=page-legal.module.js.map