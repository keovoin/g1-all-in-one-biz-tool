import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NbCardModule, NbButtonModule, NbIconModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { OrganizationContactService, OrganizationDepartmentsService, OrganizationProjectsService, OrganizationsService } from '@gauzy/ui-core/core';
import { InviteMutationComponent } from './invite-mutation.component';
import { InviteFormsModule } from '../forms/invite-forms.module';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class InviteMutationModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: InviteMutationModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: InviteMutationModule, declarations: [InviteMutationComponent], imports: [CommonModule,
            FormsModule,
            NbButtonModule,
            NbCardModule,
            NbIconModule, i1.TranslateModule, InviteFormsModule], exports: [InviteMutationComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: InviteMutationModule, providers: [
            OrganizationsService,
            OrganizationProjectsService,
            OrganizationContactService,
            OrganizationDepartmentsService
        ], imports: [CommonModule,
            FormsModule,
            NbButtonModule,
            NbCardModule,
            NbIconModule,
            TranslateModule.forChild(),
            InviteFormsModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: InviteMutationModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        FormsModule,
                        NbButtonModule,
                        NbCardModule,
                        NbIconModule,
                        TranslateModule.forChild(),
                        InviteFormsModule
                    ],
                    exports: [InviteMutationComponent],
                    declarations: [InviteMutationComponent],
                    providers: [
                        OrganizationsService,
                        OrganizationProjectsService,
                        OrganizationContactService,
                        OrganizationDepartmentsService
                    ]
                }]
        }] });
//# sourceMappingURL=invite-mutation.module.js.map