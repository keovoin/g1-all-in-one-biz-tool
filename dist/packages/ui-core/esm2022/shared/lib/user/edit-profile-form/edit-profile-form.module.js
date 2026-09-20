import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbCardModule, NbButtonModule, NbIconModule, NbSelectModule, NbInputModule, NbBadgeModule, NbFormFieldModule } from '@nebular/theme';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { OrganizationsService, RoleService } from '@gauzy/ui-core/core';
import { EditProfileFormComponent } from './edit-profile-form.component';
import { UserFormsModule } from '../forms/user-forms.module';
import { ImageUploaderModule } from '../../image-uploader/image-uploader.module';
import { TagsColorInputModule } from '../../tags/tags-color-input/tags-color-input.module';
import { LanguageSelectorModule } from '../../language/language-selector';
import { SharedModule } from '../../shared.module';
import { PasswordFormFieldModule, PhoneFormInputModule, RoleFormFieldModule } from '../forms/fields';
import { TableComponentsModule } from '../../table-components';
import { TimeZoneSelectorModule } from '../../modules/selectors';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class EditProfileFormModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EditProfileFormModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: EditProfileFormModule, declarations: [EditProfileFormComponent], imports: [CommonModule,
            FormsModule,
            ReactiveFormsModule,
            NbButtonModule,
            NbCardModule,
            NbIconModule,
            NbInputModule,
            NbSelectModule,
            NbBadgeModule,
            NbFormFieldModule,
            NgSelectModule,
            TagsColorInputModule,
            UserFormsModule,
            ImageUploaderModule, i1.TranslateModule, LanguageSelectorModule,
            SharedModule,
            PasswordFormFieldModule,
            RoleFormFieldModule,
            TableComponentsModule,
            TimeZoneSelectorModule,
            PhoneFormInputModule], exports: [EditProfileFormComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EditProfileFormModule, providers: [OrganizationsService, RoleService], imports: [CommonModule,
            FormsModule,
            ReactiveFormsModule,
            NbButtonModule,
            NbCardModule,
            NbIconModule,
            NbInputModule,
            NbSelectModule,
            NbBadgeModule,
            NbFormFieldModule,
            NgSelectModule,
            TagsColorInputModule,
            UserFormsModule,
            ImageUploaderModule,
            TranslateModule.forChild(),
            LanguageSelectorModule,
            SharedModule,
            PasswordFormFieldModule,
            RoleFormFieldModule,
            TableComponentsModule,
            TimeZoneSelectorModule,
            PhoneFormInputModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EditProfileFormModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        FormsModule,
                        ReactiveFormsModule,
                        NbButtonModule,
                        NbCardModule,
                        NbIconModule,
                        NbInputModule,
                        NbSelectModule,
                        NbBadgeModule,
                        NbFormFieldModule,
                        NgSelectModule,
                        TagsColorInputModule,
                        UserFormsModule,
                        ImageUploaderModule,
                        TranslateModule.forChild(),
                        LanguageSelectorModule,
                        SharedModule,
                        PasswordFormFieldModule,
                        RoleFormFieldModule,
                        TableComponentsModule,
                        TimeZoneSelectorModule,
                        PhoneFormInputModule
                    ],
                    exports: [EditProfileFormComponent],
                    declarations: [EditProfileFormComponent],
                    providers: [OrganizationsService, RoleService]
                }]
        }] });
//# sourceMappingURL=edit-profile-form.module.js.map