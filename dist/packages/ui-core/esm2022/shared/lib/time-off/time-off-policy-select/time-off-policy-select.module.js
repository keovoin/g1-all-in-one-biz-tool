import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NbSelectModule } from '@nebular/theme';
import { TimeOffPolicySelectComponent } from './time-off-policy-select.component';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class TimeOffPolicySelectModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TimeOffPolicySelectModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: TimeOffPolicySelectModule, declarations: [TimeOffPolicySelectComponent], imports: [CommonModule, FormsModule, ReactiveFormsModule, NbSelectModule, i1.TranslateModule], exports: [TimeOffPolicySelectComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TimeOffPolicySelectModule, imports: [CommonModule, FormsModule, ReactiveFormsModule, NbSelectModule, TranslateModule.forChild()] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TimeOffPolicySelectModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [TimeOffPolicySelectComponent],
                    imports: [CommonModule, FormsModule, ReactiveFormsModule, NbSelectModule, TranslateModule.forChild()],
                    exports: [TimeOffPolicySelectComponent]
                }]
        }] });
//# sourceMappingURL=time-off-policy-select.module.js.map