import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbButtonModule, NbCardModule, NbInputModule, NbSelectModule, NbSpinnerModule } from '@nebular/theme';
import { NgxPermissionsModule } from 'ngx-permissions';
import { CustomSmtpService } from '@gauzy/ui-core/core';
import { TranslateModule } from '@ngx-translate/core';
import { SMTPComponent } from './smtp.component';
import * as i0 from "@angular/core";
import * as i1 from "ngx-permissions";
import * as i2 from "@ngx-translate/core";
export class SMTPModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: SMTPModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: SMTPModule, declarations: [SMTPComponent], imports: [CommonModule,
            FormsModule,
            ReactiveFormsModule,
            NbButtonModule,
            NbCardModule,
            NbInputModule,
            NbSelectModule,
            NbSpinnerModule, i1.NgxPermissionsModule, i2.TranslateModule], exports: [SMTPComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: SMTPModule, providers: [CustomSmtpService], imports: [CommonModule,
            FormsModule,
            ReactiveFormsModule,
            NbButtonModule,
            NbCardModule,
            NbInputModule,
            NbSelectModule,
            NbSpinnerModule,
            NgxPermissionsModule.forChild(),
            TranslateModule.forChild()] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: SMTPModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        FormsModule,
                        ReactiveFormsModule,
                        NbButtonModule,
                        NbCardModule,
                        NbInputModule,
                        NbSelectModule,
                        NbSpinnerModule,
                        NgxPermissionsModule.forChild(),
                        TranslateModule.forChild()
                    ],
                    exports: [SMTPComponent],
                    declarations: [SMTPComponent],
                    providers: [CustomSmtpService]
                }]
        }] });
//# sourceMappingURL=smtp.module.js.map