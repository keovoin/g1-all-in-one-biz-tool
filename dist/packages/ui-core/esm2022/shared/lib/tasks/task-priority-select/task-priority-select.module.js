import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { TaskPrioritiesService } from '@gauzy/ui-core/core';
import { TranslateModule } from '@ngx-translate/core';
import { TaskPrioritySelectComponent } from './task-priority-select.component';
import { TaskBadgeViewComponentModule } from '../task-badge-view/task-badge-view.module';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class TaskPrioritySelectModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TaskPrioritySelectModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: TaskPrioritySelectModule, declarations: [TaskPrioritySelectComponent], imports: [CommonModule,
            FormsModule,
            NgSelectModule,
            NgSelectModule, i1.TranslateModule, TaskBadgeViewComponentModule], exports: [TaskPrioritySelectComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TaskPrioritySelectModule, providers: [TaskPrioritiesService], imports: [CommonModule,
            FormsModule,
            NgSelectModule,
            NgSelectModule,
            TranslateModule.forChild(),
            TaskBadgeViewComponentModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TaskPrioritySelectModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        FormsModule,
                        NgSelectModule,
                        NgSelectModule,
                        TranslateModule.forChild(),
                        TaskBadgeViewComponentModule
                    ],
                    declarations: [TaskPrioritySelectComponent],
                    exports: [TaskPrioritySelectComponent],
                    providers: [TaskPrioritiesService]
                }]
        }] });
//# sourceMappingURL=task-priority-select.module.js.map