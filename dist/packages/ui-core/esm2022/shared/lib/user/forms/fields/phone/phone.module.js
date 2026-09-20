import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbInputModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { PhoneFormInputComponent } from './phone.component';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class PhoneFormInputModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PhoneFormInputModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: PhoneFormInputModule, declarations: [PhoneFormInputComponent], imports: [CommonModule, FormsModule, ReactiveFormsModule, i1.TranslateModule, NbInputModule], exports: [PhoneFormInputComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PhoneFormInputModule, imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslateModule.forChild(), NbInputModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PhoneFormInputModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [PhoneFormInputComponent],
                    exports: [PhoneFormInputComponent],
                    imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslateModule.forChild(), NbInputModule]
                }]
        }] });
//# sourceMappingURL=phone.module.js.map