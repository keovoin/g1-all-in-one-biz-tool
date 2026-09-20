import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { ContactSelectComponent } from './contact-select.component';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class ContactSelectModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ContactSelectModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: ContactSelectModule, declarations: [ContactSelectComponent], imports: [CommonModule, FormsModule, NgSelectModule, i1.TranslateModule], exports: [ContactSelectComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ContactSelectModule, imports: [CommonModule, FormsModule, NgSelectModule, TranslateModule.forChild()] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ContactSelectModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [ContactSelectComponent],
                    exports: [ContactSelectComponent],
                    imports: [CommonModule, FormsModule, NgSelectModule, TranslateModule.forChild()]
                }]
        }] });
//# sourceMappingURL=contact-select.module.js.map