import { NgModule } from '@angular/core';
import { NgxPermissionsModule } from 'ngx-permissions';
import * as i0 from "@angular/core";
import * as i1 from "ngx-permissions";
export class UiCoreModule {
    /**
     * Returns a ModuleWithProviders object for the UiCoreModule.
     *
     * @return {ModuleWithProviders<UiCoreModule>}
     */
    static forRoot() {
        return {
            ngModule: UiCoreModule,
            providers: []
        };
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: UiCoreModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: UiCoreModule, imports: [i1.NgxPermissionsModule] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: UiCoreModule, imports: [NgxPermissionsModule.forRoot()] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: UiCoreModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [NgxPermissionsModule.forRoot()],
                    declarations: [],
                    exports: []
                }]
        }] });
//# sourceMappingURL=ui-core.module.js.map