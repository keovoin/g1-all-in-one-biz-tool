import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbButtonModule, NbCardModule, NbDatepickerModule, NbDialogModule, NbIconModule, NbInputModule, NbRadioModule, NbSelectModule, NbToastrModule, NbToggleModule } from '@nebular/theme';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { TaskSelectModule, TaskStatusSelectModule } from '../../tasks';
import { ProjectSelectModule, SelectorsModule } from '../../selectors';
import { TagsColorInputModule } from '../../tags/tags-color-input/tags-color-input.module';
import { EmployeeMultiSelectModule } from '../../employee/employee-multi-select/employee-multi-select.module';
import { RichTextEditorModule } from '../../rich-text-editor/rich-text-editor.module';
import { ProjectModuleMutationComponent } from './project-module-mutation.component';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "@ngx-translate/core";
export class ProjectModuleMutationModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProjectModuleMutationModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: ProjectModuleMutationModule, declarations: [ProjectModuleMutationComponent], imports: [CommonModule,
            FormsModule,
            ReactiveFormsModule,
            RichTextEditorModule,
            NbButtonModule,
            NbCardModule,
            NbDatepickerModule, i1.NbDialogModule, NbIconModule,
            NbInputModule,
            NbToggleModule,
            NbRadioModule,
            NbSelectModule,
            NbToastrModule,
            NgSelectModule,
            SelectorsModule, i2.TranslateModule, EmployeeMultiSelectModule,
            TagsColorInputModule,
            ProjectSelectModule,
            TaskSelectModule,
            TaskStatusSelectModule], exports: [ProjectModuleMutationComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProjectModuleMutationModule, imports: [CommonModule,
            FormsModule,
            ReactiveFormsModule,
            RichTextEditorModule,
            NbButtonModule,
            NbCardModule,
            NbDatepickerModule,
            NbDialogModule.forChild(),
            NbIconModule,
            NbInputModule,
            NbToggleModule,
            NbRadioModule,
            NbSelectModule,
            NbToastrModule,
            NgSelectModule,
            SelectorsModule,
            TranslateModule.forChild(),
            EmployeeMultiSelectModule,
            TagsColorInputModule,
            ProjectSelectModule,
            TaskSelectModule,
            TaskStatusSelectModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProjectModuleMutationModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        FormsModule,
                        ReactiveFormsModule,
                        RichTextEditorModule,
                        NbButtonModule,
                        NbCardModule,
                        NbDatepickerModule,
                        NbDialogModule.forChild(),
                        NbIconModule,
                        NbInputModule,
                        NbToggleModule,
                        NbRadioModule,
                        NbSelectModule,
                        NbToastrModule,
                        NgSelectModule,
                        SelectorsModule,
                        TranslateModule.forChild(),
                        EmployeeMultiSelectModule,
                        TagsColorInputModule,
                        ProjectSelectModule,
                        TaskSelectModule,
                        TaskStatusSelectModule
                    ],
                    declarations: [ProjectModuleMutationComponent],
                    exports: [ProjectModuleMutationComponent]
                }]
        }] });
//# sourceMappingURL=project-module-mutation.module.js.map