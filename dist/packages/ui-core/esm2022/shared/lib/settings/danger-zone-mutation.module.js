import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbButtonModule, NbCardModule, NbDatepickerModule, NbIconModule, NbInputModule, NbListModule, NbSelectModule, NbToastrModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService, IncomeService, RoleService } from '@gauzy/ui-core/core';
import { DangerZoneMutationComponent } from './danger-zone-mutation/danger-zone-mutation.component';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class DangerZoneMutationModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DangerZoneMutationModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: DangerZoneMutationModule, declarations: [DangerZoneMutationComponent], imports: [CommonModule,
            FormsModule,
            ReactiveFormsModule,
            NbButtonModule,
            NbCardModule,
            NbDatepickerModule,
            NbIconModule,
            NbInputModule,
            NbListModule,
            NbSelectModule,
            NbToastrModule, i1.TranslateModule], exports: [DangerZoneMutationComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DangerZoneMutationModule, providers: [AuthService, RoleService, IncomeService], imports: [CommonModule,
            FormsModule,
            ReactiveFormsModule,
            NbButtonModule,
            NbCardModule,
            NbDatepickerModule,
            NbIconModule,
            NbInputModule,
            NbListModule,
            NbSelectModule,
            NbToastrModule,
            TranslateModule.forChild()] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DangerZoneMutationModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        FormsModule,
                        ReactiveFormsModule,
                        NbButtonModule,
                        NbCardModule,
                        NbDatepickerModule,
                        NbIconModule,
                        NbInputModule,
                        NbListModule,
                        NbSelectModule,
                        NbToastrModule,
                        TranslateModule.forChild()
                    ],
                    exports: [DangerZoneMutationComponent],
                    declarations: [DangerZoneMutationComponent],
                    providers: [AuthService, RoleService, IncomeService]
                }]
        }] });
//# sourceMappingURL=danger-zone-mutation.module.js.map