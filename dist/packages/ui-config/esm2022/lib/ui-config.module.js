import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiConfigService } from './ui-config.service';
import * as i0 from "@angular/core";
export class UiConfigModule {
    /**
     * Returns a ModuleWithProviders object that can be used to configure the UiConfigModule.
     *
     * @return {ModuleWithProviders<UiConfigModule>} The ModuleWithProviders object containing the UiConfigModule and an empty providers array.
     */
    static forRoot() {
        return {
            ngModule: UiConfigModule,
            providers: [UiConfigService]
        };
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: UiConfigModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: UiConfigModule, imports: [CommonModule] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: UiConfigModule, imports: [CommonModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: UiConfigModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    providers: []
                }]
        }] });
//# sourceMappingURL=ui-config.module.js.map