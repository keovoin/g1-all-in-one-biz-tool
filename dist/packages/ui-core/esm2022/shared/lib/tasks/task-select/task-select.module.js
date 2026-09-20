import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { TaskSelectorComponent } from './task/task.component';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class TaskSelectModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TaskSelectModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: TaskSelectModule, declarations: [TaskSelectorComponent], imports: [CommonModule, FormsModule, NgSelectModule, i1.TranslateModule], exports: [TaskSelectorComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TaskSelectModule, imports: [CommonModule, FormsModule, NgSelectModule, TranslateModule.forChild()] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TaskSelectModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [TaskSelectorComponent],
                    exports: [TaskSelectorComponent],
                    imports: [CommonModule, FormsModule, NgSelectModule, TranslateModule.forChild()]
                }]
        }] });
//# sourceMappingURL=task-select.module.js.map