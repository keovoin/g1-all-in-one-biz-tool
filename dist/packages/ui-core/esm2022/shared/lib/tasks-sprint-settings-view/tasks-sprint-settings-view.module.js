import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbButtonModule, NbCardModule, NbDatepickerModule, NbIconModule, NbInputModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../shared.module';
import { GauzyEditableGridModule } from '../editable-grid/gauzy-editable-grid.module';
import { SprintDialogComponent } from './sprint-dialog/sprint-dialog.component';
import { TasksSprintSettingsViewComponent } from './tasks-sprint-settings-view.component';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class TasksSprintSettingsViewModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TasksSprintSettingsViewModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: TasksSprintSettingsViewModule, declarations: [TasksSprintSettingsViewComponent, SprintDialogComponent], imports: [CommonModule,
            NbCardModule,
            NbIconModule,
            NbButtonModule,
            FormsModule,
            ReactiveFormsModule,
            NbDatepickerModule, i1.TranslateModule, GauzyEditableGridModule,
            NbInputModule,
            SharedModule], exports: [TasksSprintSettingsViewComponent, SprintDialogComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TasksSprintSettingsViewModule, imports: [CommonModule,
            NbCardModule,
            NbIconModule,
            NbButtonModule,
            FormsModule,
            ReactiveFormsModule,
            NbDatepickerModule,
            TranslateModule.forChild(),
            GauzyEditableGridModule,
            NbInputModule,
            SharedModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TasksSprintSettingsViewModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [TasksSprintSettingsViewComponent, SprintDialogComponent],
                    exports: [TasksSprintSettingsViewComponent, SprintDialogComponent],
                    imports: [
                        CommonModule,
                        NbCardModule,
                        NbIconModule,
                        NbButtonModule,
                        FormsModule,
                        ReactiveFormsModule,
                        NbDatepickerModule,
                        TranslateModule.forChild(),
                        GauzyEditableGridModule,
                        NbInputModule,
                        SharedModule
                    ]
                }]
        }] });
//# sourceMappingURL=tasks-sprint-settings-view.module.js.map