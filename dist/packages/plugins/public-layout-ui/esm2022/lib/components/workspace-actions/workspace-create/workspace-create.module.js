import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NbButtonModule, NbIconModule, NbCardModule, NbInputModule, NbFormFieldModule, NbSpinnerModule, NbTooltipModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule, OrganizationsStepFormModule, PasswordFormFieldModule } from '@gauzy/ui-core/shared';
import { ThemeModule } from '@gauzy/ui-core/theme';
import { TenantService, OrganizationsService, UsersService, WorkspaceAuthService } from '@gauzy/ui-core/core';
import { WorkspaceCreateComponent } from './workspace-create.component';
import { CountdownTimerService, WorkspaceSharedModule } from '../shared';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
import * as i2 from "@ngx-translate/core";
const routes = [
    {
        path: '',
        component: WorkspaceCreateComponent
    }
];
export class WorkspaceCreateModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: WorkspaceCreateModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: WorkspaceCreateModule, declarations: [WorkspaceCreateComponent], imports: [CommonModule,
            ReactiveFormsModule, i1.RouterModule, NbButtonModule,
            NbIconModule,
            NbCardModule,
            NbInputModule,
            NbFormFieldModule,
            NbSpinnerModule,
            NbTooltipModule, i2.TranslateModule, SharedModule,
            OrganizationsStepFormModule,
            PasswordFormFieldModule,
            ThemeModule,
            WorkspaceSharedModule] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: WorkspaceCreateModule, providers: [TenantService, OrganizationsService, UsersService, WorkspaceAuthService, CountdownTimerService], imports: [CommonModule,
            ReactiveFormsModule,
            RouterModule.forChild(routes),
            NbButtonModule,
            NbIconModule,
            NbCardModule,
            NbInputModule,
            NbFormFieldModule,
            NbSpinnerModule,
            NbTooltipModule,
            TranslateModule.forChild(),
            SharedModule,
            OrganizationsStepFormModule,
            PasswordFormFieldModule,
            ThemeModule,
            WorkspaceSharedModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: WorkspaceCreateModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [WorkspaceCreateComponent],
                    imports: [
                        CommonModule,
                        ReactiveFormsModule,
                        RouterModule.forChild(routes),
                        NbButtonModule,
                        NbIconModule,
                        NbCardModule,
                        NbInputModule,
                        NbFormFieldModule,
                        NbSpinnerModule,
                        NbTooltipModule,
                        TranslateModule.forChild(),
                        SharedModule,
                        OrganizationsStepFormModule,
                        PasswordFormFieldModule,
                        ThemeModule,
                        WorkspaceSharedModule
                    ],
                    providers: [TenantService, OrganizationsService, UsersService, WorkspaceAuthService, CountdownTimerService]
                }]
        }] });
//# sourceMappingURL=workspace-create.module.js.map