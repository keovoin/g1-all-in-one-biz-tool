import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { TaskStatusesService } from '@gauzy/ui-core/core';
import { TaskBadgeViewComponentModule } from '../task-badge-view/task-badge-view.module';
import { TaskStatusSelectComponent } from './task-status-select.component';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class TaskStatusSelectModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TaskStatusSelectModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: TaskStatusSelectModule, declarations: [TaskStatusSelectComponent], imports: [CommonModule, FormsModule, NgSelectModule, i1.TranslateModule, TaskBadgeViewComponentModule], exports: [TaskStatusSelectComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TaskStatusSelectModule, providers: [TaskStatusesService], imports: [CommonModule, FormsModule, NgSelectModule, TranslateModule.forChild(), TaskBadgeViewComponentModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TaskStatusSelectModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, FormsModule, NgSelectModule, TranslateModule.forChild(), TaskBadgeViewComponentModule],
                    declarations: [TaskStatusSelectComponent],
                    exports: [TaskStatusSelectComponent],
                    providers: [TaskStatusesService]
                }]
        }] });
//# sourceMappingURL=task-status-select.module.js.map