import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NbSelectModule } from '@nebular/theme';
import { NgSelectModule } from '@ng-select/ng-select';
import { VendorSelectComponent } from './vendor-select.component';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class VendorSelectModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: VendorSelectModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: VendorSelectModule, declarations: [VendorSelectComponent], imports: [CommonModule, NbSelectModule, FormsModule, i1.TranslateModule, NgSelectModule], exports: [VendorSelectComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: VendorSelectModule, imports: [CommonModule, NbSelectModule, FormsModule, TranslateModule.forChild(), NgSelectModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: VendorSelectModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [VendorSelectComponent],
                    exports: [VendorSelectComponent],
                    imports: [CommonModule, NbSelectModule, FormsModule, TranslateModule.forChild(), NgSelectModule]
                }]
        }] });
//# sourceMappingURL=vendor-select.module.js.map