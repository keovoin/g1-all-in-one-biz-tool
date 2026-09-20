import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbButtonModule, NbCardModule, NbDatepickerModule, NbIconModule, NbInputModule, NbListModule, NbSelectModule, NbSpinnerModule, NbTabsetModule, NbToggleModule } from '@nebular/theme';
import { NgSelectModule } from '@ng-select/ng-select';
import { ColorPickerComponent, ColorPickerDirective } from 'ngx-color-picker';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../shared.module';
import { CurrencyModule } from '../../modules/currency/currency.module';
import { EmployeeMultiSelectModule } from '../../employee/employee-multi-select/employee-multi-select.module';
import { ImageUploaderModule } from '../../image-uploader/image-uploader.module';
import { TagsColorInputModule } from '../../tags/tags-color-input/tags-color-input.module';
import { TeamSelectModule } from '../../selectors/team/team.module';
import { ProjectModuleTableModule } from '../../project-module/project-module-table/project-module-table.module';
import { ProjectMutationComponent } from './project-mutation.component';
import { RepositorySelectorModule } from '../../integrations/github/repository-selector/repository-selector.module';
import { SmartDataViewLayoutModule } from '../../smart-data-layout';
import { RichTextEditorModule } from '../../rich-text-editor/rich-text-editor.module';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class ProjectMutationModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProjectMutationModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: ProjectMutationModule, declarations: [ProjectMutationComponent], imports: [CommonModule,
            FormsModule,
            ReactiveFormsModule,
            NbButtonModule,
            NbCardModule,
            NbDatepickerModule,
            NbInputModule,
            NbListModule,
            NbSelectModule,
            NbSpinnerModule,
            NbTabsetModule,
            NbToggleModule,
            NbIconModule,
            NgSelectModule,
            RichTextEditorModule,
            ColorPickerComponent,
            ColorPickerDirective,
            SharedModule, i1.TranslateModule, CurrencyModule,
            EmployeeMultiSelectModule,
            ImageUploaderModule,
            TagsColorInputModule,
            TeamSelectModule,
            RepositorySelectorModule,
            SmartDataViewLayoutModule,
            ProjectModuleTableModule], exports: [ProjectMutationComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProjectMutationModule, imports: [CommonModule,
            FormsModule,
            ReactiveFormsModule,
            NbButtonModule,
            NbCardModule,
            NbDatepickerModule,
            NbInputModule,
            NbListModule,
            NbSelectModule,
            NbSpinnerModule,
            NbTabsetModule,
            NbToggleModule,
            NbIconModule,
            NgSelectModule,
            RichTextEditorModule,
            ColorPickerComponent,
            SharedModule,
            TranslateModule.forChild(),
            CurrencyModule,
            EmployeeMultiSelectModule,
            ImageUploaderModule,
            TagsColorInputModule,
            TeamSelectModule,
            RepositorySelectorModule,
            SmartDataViewLayoutModule,
            ProjectModuleTableModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProjectMutationModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [ProjectMutationComponent],
                    exports: [ProjectMutationComponent],
                    imports: [
                        CommonModule,
                        FormsModule,
                        ReactiveFormsModule,
                        NbButtonModule,
                        NbCardModule,
                        NbDatepickerModule,
                        NbInputModule,
                        NbListModule,
                        NbSelectModule,
                        NbSpinnerModule,
                        NbTabsetModule,
                        NbToggleModule,
                        NbIconModule,
                        NgSelectModule,
                        RichTextEditorModule,
                        ColorPickerComponent,
                        ColorPickerDirective,
                        SharedModule,
                        TranslateModule.forChild(),
                        CurrencyModule,
                        EmployeeMultiSelectModule,
                        ImageUploaderModule,
                        TagsColorInputModule,
                        TeamSelectModule,
                        RepositorySelectorModule,
                        SmartDataViewLayoutModule,
                        ProjectModuleTableModule
                    ]
                }]
        }] });
//# sourceMappingURL=project-mutation.module.js.map