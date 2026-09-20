import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TaskSizesService } from '@gauzy/ui-core/core';
import { TranslateModule } from '@ngx-translate/core';
import { TaskSizeSelectComponent } from './task-size-select.component';
import { TaskBadgeViewComponentModule } from '../task-badge-view/task-badge-view.module';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class TaskSizeSelectModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TaskSizeSelectModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: TaskSizeSelectModule, declarations: [TaskSizeSelectComponent], imports: [CommonModule, FormsModule, NgSelectModule, i1.TranslateModule, TaskBadgeViewComponentModule], exports: [TaskSizeSelectComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TaskSizeSelectModule, providers: [TaskSizesService], imports: [CommonModule, FormsModule, NgSelectModule, TranslateModule.forChild(), TaskBadgeViewComponentModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TaskSizeSelectModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, FormsModule, NgSelectModule, TranslateModule.forChild(), TaskBadgeViewComponentModule],
                    declarations: [TaskSizeSelectComponent],
                    exports: [TaskSizeSelectComponent],
                    providers: [TaskSizesService]
                }]
        }] });
//# sourceMappingURL=task-size-select.module.js.map