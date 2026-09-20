import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbAlertModule, NbButtonModule, NbCardModule, NbInputModule, NbSelectModule, NbDatepickerModule, NbTagModule, NbIconModule, NbFormFieldModule, NbTooltipModule } from '@nebular/theme';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { InviteService, RoleService } from '@gauzy/ui-core/core';
import { SharedModule } from '../../shared.module';
import { ContactSelectModule } from '../../contact-select/contact-select.module';
import { RoleFormFieldModule } from '../../user/forms/fields/role/role.module';
import { EmailInviteFormComponent } from './email-invite-form/email-invite-form.component';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class InviteFormsModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: InviteFormsModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: InviteFormsModule, declarations: [EmailInviteFormComponent], imports: [CommonModule,
            FormsModule,
            ReactiveFormsModule,
            NbAlertModule,
            NbButtonModule,
            NbCardModule,
            NbDatepickerModule,
            NbFormFieldModule,
            NbIconModule,
            NbInputModule,
            NbSelectModule,
            NbTagModule,
            NbTooltipModule,
            NgSelectModule, i1.TranslateModule, SharedModule,
            ContactSelectModule,
            RoleFormFieldModule], exports: [EmailInviteFormComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: InviteFormsModule, providers: [RoleService, InviteService], imports: [CommonModule,
            FormsModule,
            ReactiveFormsModule,
            NbAlertModule,
            NbButtonModule,
            NbCardModule,
            NbDatepickerModule,
            NbFormFieldModule,
            NbIconModule,
            NbInputModule,
            NbSelectModule,
            NbTagModule,
            NbTooltipModule,
            NgSelectModule,
            TranslateModule.forChild(),
            SharedModule,
            ContactSelectModule,
            RoleFormFieldModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: InviteFormsModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        FormsModule,
                        ReactiveFormsModule,
                        NbAlertModule,
                        NbButtonModule,
                        NbCardModule,
                        NbDatepickerModule,
                        NbFormFieldModule,
                        NbIconModule,
                        NbInputModule,
                        NbSelectModule,
                        NbTagModule,
                        NbTooltipModule,
                        NgSelectModule,
                        TranslateModule.forChild(),
                        SharedModule,
                        ContactSelectModule,
                        RoleFormFieldModule
                    ],
                    exports: [EmailInviteFormComponent],
                    declarations: [EmailInviteFormComponent],
                    providers: [RoleService, InviteService]
                }]
        }] });
//# sourceMappingURL=invite-forms.module.js.map