import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NbButtonModule, NbCardModule, NbIconModule, NbStepperModule, NbTagModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { OrganizationsService, RoleService } from '@gauzy/ui-core/core';
import { UserFormsModule } from '../../user/forms/user-forms.module';
import { FileUploaderModule } from '../../file-uploader-input';
import { CandidateMutationComponent } from './candidate-mutation.component';
import { CandidateCvComponent } from '../candidate-cv/candidate-cv.component';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class CandidateMutationModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CandidateMutationModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: CandidateMutationModule, declarations: [CandidateMutationComponent, CandidateCvComponent], imports: [CommonModule,
            FormsModule,
            NbButtonModule,
            NbCardModule,
            NbIconModule,
            NbStepperModule,
            NbTagModule, i1.TranslateModule, UserFormsModule,
            FileUploaderModule], exports: [CandidateMutationComponent, CandidateCvComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CandidateMutationModule, providers: [OrganizationsService, RoleService], imports: [CommonModule,
            FormsModule,
            NbButtonModule,
            NbCardModule,
            NbIconModule,
            NbStepperModule,
            NbTagModule,
            TranslateModule.forChild(),
            UserFormsModule,
            FileUploaderModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CandidateMutationModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        FormsModule,
                        NbButtonModule,
                        NbCardModule,
                        NbIconModule,
                        NbStepperModule,
                        NbTagModule,
                        TranslateModule.forChild(),
                        UserFormsModule,
                        FileUploaderModule
                    ],
                    exports: [CandidateMutationComponent, CandidateCvComponent],
                    declarations: [CandidateMutationComponent, CandidateCvComponent],
                    providers: [OrganizationsService, RoleService]
                }]
        }] });
//# sourceMappingURL=candidate-mutation.module.js.map