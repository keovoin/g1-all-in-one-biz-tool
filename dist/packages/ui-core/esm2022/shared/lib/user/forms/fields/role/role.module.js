import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NbSelectModule } from '@nebular/theme';
import { RoleFormFieldComponent } from './role.component';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class RoleFormFieldModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: RoleFormFieldModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: RoleFormFieldModule, declarations: [RoleFormFieldComponent], imports: [CommonModule, FormsModule, ReactiveFormsModule, NbSelectModule, i1.TranslateModule], exports: [RoleFormFieldComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: RoleFormFieldModule, imports: [CommonModule, FormsModule, ReactiveFormsModule, NbSelectModule, TranslateModule.forChild()] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: RoleFormFieldModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [RoleFormFieldComponent],
                    exports: [RoleFormFieldComponent],
                    imports: [CommonModule, FormsModule, ReactiveFormsModule, NbSelectModule, TranslateModule.forChild()]
                }]
        }] });
//# sourceMappingURL=role.module.js.map