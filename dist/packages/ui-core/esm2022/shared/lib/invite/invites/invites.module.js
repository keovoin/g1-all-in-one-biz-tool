import { NgModule } from '@angular/core';
import { NbBadgeModule, NbButtonModule, NbCardModule, NbCheckboxModule, NbDialogModule, NbIconModule, NbInputModule, NbRouteTabsetModule, NbSelectModule, NbSpinnerModule, NbTooltipModule } from '@nebular/theme';
import { NgxPermissionsModule } from 'ngx-permissions';
import { NgSelectModule } from '@ng-select/ng-select';
import { ClipboardModule } from 'ngx-clipboard';
import { TranslateModule } from '@ngx-translate/core';
import { CardGridModule } from '../../card-grid/card-grid.module';
import { SharedModule } from '../../shared.module';
import { SmartDataViewLayoutModule } from '../../smart-data-layout/smart-data-view-layout.module';
import { UserFormsModule } from '../../user/forms/user-forms.module';
import { InviteMutationModule } from '../invite-mutation/invite-mutation.module';
import { InvitesComponent } from './invites.component';
import { ProjectNamesComponent } from './project-names/project-names.component';
import { ResendConfirmationComponent } from './resend-confirmation/resend-confirmation.component';
import { ClientNamesComponent } from './client-names/client-names.component';
import { DepartmentNamesComponent } from './department-names/department-names.component';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "@ngx-translate/core";
import * as i3 from "ngx-permissions";
// Nebular Modules
const NB_MODULES = [
    NbBadgeModule,
    NbButtonModule,
    NbCardModule,
    NbCheckboxModule,
    NbDialogModule.forChild(),
    NbIconModule,
    NbInputModule,
    NbRouteTabsetModule,
    NbSelectModule,
    NbSpinnerModule,
    NbTooltipModule
];
// Components
const COMPONENTS = [
    InvitesComponent,
    ProjectNamesComponent,
    ClientNamesComponent,
    DepartmentNamesComponent,
    ResendConfirmationComponent
];
export class InviteTableModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: InviteTableModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: InviteTableModule, declarations: [InvitesComponent,
            ProjectNamesComponent,
            ClientNamesComponent,
            DepartmentNamesComponent,
            ResendConfirmationComponent], imports: [NbBadgeModule,
            NbButtonModule,
            NbCardModule,
            NbCheckboxModule, i1.NbDialogModule, NbIconModule,
            NbInputModule,
            NbRouteTabsetModule,
            NbSelectModule,
            NbSpinnerModule,
            NbTooltipModule, NgSelectModule,
            ClipboardModule, i2.TranslateModule, i3.NgxPermissionsModule, SharedModule,
            SmartDataViewLayoutModule,
            InviteMutationModule,
            UserFormsModule,
            CardGridModule], exports: [InvitesComponent,
            ProjectNamesComponent,
            ClientNamesComponent,
            DepartmentNamesComponent,
            ResendConfirmationComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: InviteTableModule, imports: [NB_MODULES, NgSelectModule,
            ClipboardModule,
            TranslateModule.forChild(),
            NgxPermissionsModule.forChild(),
            SharedModule,
            SmartDataViewLayoutModule,
            InviteMutationModule,
            UserFormsModule,
            CardGridModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: InviteTableModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        ...NB_MODULES,
                        NgSelectModule,
                        ClipboardModule,
                        TranslateModule.forChild(),
                        NgxPermissionsModule.forChild(),
                        SharedModule,
                        SmartDataViewLayoutModule,
                        InviteMutationModule,
                        UserFormsModule,
                        CardGridModule
                    ],
                    declarations: [...COMPONENTS],
                    exports: [...COMPONENTS]
                }]
        }] });
//# sourceMappingURL=invites.module.js.map