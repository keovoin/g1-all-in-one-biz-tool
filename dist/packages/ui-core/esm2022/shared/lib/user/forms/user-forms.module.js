import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NbBadgeModule, NbButtonModule, NbCardModule, NbCheckboxModule, NbDatepickerModule, NbIconModule, NbInputModule, NbSelectModule } from '@nebular/theme';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService, CandidatesService, IncomeService, RoleService, TagsService } from '@gauzy/ui-core/core';
import { FileUploaderModule } from '../../file-uploader-input/file-uploader-input.module';
import { TagsColorInputModule } from '../../tags/tags-color-input/tags-color-input.module';
import { SharedModule } from '../../shared.module';
import { PasswordFormFieldModule, RoleFormFieldModule } from './fields';
import { ActionConfirmationComponent, ArchiveConfirmationComponent, BasicInfoFormComponent, CandidateActionConfirmationComponent, DeleteConfirmationComponent } from './';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
const COMPONENTS = [
    BasicInfoFormComponent,
    DeleteConfirmationComponent,
    ActionConfirmationComponent,
    ArchiveConfirmationComponent,
    CandidateActionConfirmationComponent
];
export class UserFormsModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: UserFormsModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: UserFormsModule, declarations: [BasicInfoFormComponent,
            DeleteConfirmationComponent,
            ActionConfirmationComponent,
            ArchiveConfirmationComponent,
            CandidateActionConfirmationComponent], imports: [CommonModule,
            FormsModule,
            ReactiveFormsModule,
            NbBadgeModule,
            NbButtonModule,
            NbCardModule,
            NbCheckboxModule,
            NbDatepickerModule,
            NbIconModule,
            NbInputModule,
            NbSelectModule,
            NgSelectModule, i1.TranslateModule, SharedModule,
            FileUploaderModule,
            TagsColorInputModule,
            PasswordFormFieldModule,
            RoleFormFieldModule], exports: [BasicInfoFormComponent,
            DeleteConfirmationComponent,
            ActionConfirmationComponent,
            ArchiveConfirmationComponent,
            CandidateActionConfirmationComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: UserFormsModule, providers: [AuthService, RoleService, IncomeService, TagsService, CandidatesService], imports: [CommonModule,
            FormsModule,
            ReactiveFormsModule,
            NbBadgeModule,
            NbButtonModule,
            NbCardModule,
            NbCheckboxModule,
            NbDatepickerModule,
            NbIconModule,
            NbInputModule,
            NbSelectModule,
            NgSelectModule,
            TranslateModule.forChild(),
            SharedModule,
            FileUploaderModule,
            TagsColorInputModule,
            PasswordFormFieldModule,
            RoleFormFieldModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: UserFormsModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        FormsModule,
                        ReactiveFormsModule,
                        NbBadgeModule,
                        NbButtonModule,
                        NbCardModule,
                        NbCheckboxModule,
                        NbDatepickerModule,
                        NbIconModule,
                        NbInputModule,
                        NbSelectModule,
                        NgSelectModule,
                        TranslateModule.forChild(),
                        SharedModule,
                        FileUploaderModule,
                        TagsColorInputModule,
                        PasswordFormFieldModule,
                        RoleFormFieldModule
                    ],
                    exports: [...COMPONENTS],
                    declarations: [...COMPONENTS],
                    providers: [AuthService, RoleService, IncomeService, TagsService, CandidatesService]
                }]
        }] });
//# sourceMappingURL=user-forms.module.js.map