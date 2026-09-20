import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NbButtonModule, NbFormFieldModule, NbIconModule, NbInputModule } from '@nebular/theme';
import { PasswordFormFieldComponent } from './password.component';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class PasswordFormFieldModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PasswordFormFieldModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: PasswordFormFieldModule, declarations: [PasswordFormFieldComponent], imports: [CommonModule,
            FormsModule,
            ReactiveFormsModule,
            NbButtonModule,
            NbFormFieldModule,
            NbIconModule,
            NbInputModule, i1.TranslateModule], exports: [PasswordFormFieldComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PasswordFormFieldModule, imports: [CommonModule,
            FormsModule,
            ReactiveFormsModule,
            NbButtonModule,
            NbFormFieldModule,
            NbIconModule,
            NbInputModule,
            TranslateModule.forChild()] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PasswordFormFieldModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [PasswordFormFieldComponent],
                    exports: [PasswordFormFieldComponent],
                    imports: [
                        CommonModule,
                        FormsModule,
                        ReactiveFormsModule,
                        NbButtonModule,
                        NbFormFieldModule,
                        NbIconModule,
                        NbInputModule,
                        TranslateModule.forChild()
                    ]
                }]
        }] });
//# sourceMappingURL=password.module.js.map