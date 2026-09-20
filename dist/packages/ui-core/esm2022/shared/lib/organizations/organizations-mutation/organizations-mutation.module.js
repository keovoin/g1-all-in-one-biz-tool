import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbCardModule, NbButtonModule, NbIconModule, NbInputModule, NbDatepickerModule, NbSelectModule, NbToastrModule, NbListModule, NbStepperModule, NbToggleModule } from '@nebular/theme';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { OrganizationDepartmentsService } from '@gauzy/ui-core/core';
import { OrganizationsMutationComponent } from './organizations-mutation.component';
import { ImageUploaderModule } from '../../image-uploader/image-uploader.module';
import { RemoveLodashModule } from '../../remove-lodash/remove-lodash.module';
import { OrganizationsStepFormModule } from '../organizations-step-form/organizations-step-form.module';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "@ngx-translate/core";
export class OrganizationsMutationModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: OrganizationsMutationModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: OrganizationsMutationModule, declarations: [OrganizationsMutationComponent], imports: [CommonModule,
            FormsModule,
            ReactiveFormsModule,
            NbCardModule,
            NbButtonModule,
            NbIconModule,
            NgSelectModule,
            NbInputModule,
            NbDatepickerModule,
            ImageUploaderModule,
            NbSelectModule, i1.NbToastrModule, NbListModule,
            NbStepperModule,
            NbToggleModule,
            RemoveLodashModule,
            OrganizationsStepFormModule, i2.TranslateModule], exports: [OrganizationsMutationComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: OrganizationsMutationModule, providers: [OrganizationDepartmentsService], imports: [CommonModule,
            FormsModule,
            ReactiveFormsModule,
            NbCardModule,
            NbButtonModule,
            NbIconModule,
            NgSelectModule,
            NbInputModule,
            NbDatepickerModule,
            ImageUploaderModule,
            NbSelectModule,
            NbToastrModule.forRoot(),
            NbListModule,
            NbStepperModule,
            NbToggleModule,
            RemoveLodashModule,
            OrganizationsStepFormModule,
            TranslateModule.forChild()] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: OrganizationsMutationModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        FormsModule,
                        ReactiveFormsModule,
                        NbCardModule,
                        NbButtonModule,
                        NbIconModule,
                        NgSelectModule,
                        NbInputModule,
                        NbDatepickerModule,
                        ImageUploaderModule,
                        NbSelectModule,
                        NbToastrModule.forRoot(),
                        NbListModule,
                        NbStepperModule,
                        NbToggleModule,
                        RemoveLodashModule,
                        OrganizationsStepFormModule,
                        TranslateModule.forChild()
                    ],
                    declarations: [OrganizationsMutationComponent],
                    providers: [OrganizationDepartmentsService],
                    exports: [OrganizationsMutationComponent]
                }]
        }] });
//# sourceMappingURL=organizations-mutation.module.js.map