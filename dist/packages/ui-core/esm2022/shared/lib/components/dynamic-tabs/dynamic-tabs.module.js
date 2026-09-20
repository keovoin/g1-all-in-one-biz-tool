import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbRouteTabsetModule, NbTabsetModule } from '@nebular/theme';
import { DynamicTabsComponent } from './dynamic-tabs.component';
import * as i0 from "@angular/core";
export class DynamicTabsModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DynamicTabsModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: DynamicTabsModule, declarations: [DynamicTabsComponent], imports: [CommonModule, NbTabsetModule, NbRouteTabsetModule], exports: [DynamicTabsComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DynamicTabsModule, imports: [CommonModule, NbTabsetModule, NbRouteTabsetModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DynamicTabsModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, NbTabsetModule, NbRouteTabsetModule],
                    declarations: [DynamicTabsComponent],
                    exports: [DynamicTabsComponent]
                }]
        }] });
//# sourceMappingURL=dynamic-tabs.module.js.map