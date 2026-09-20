import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PipesModule } from '../../pipes/pipes.module';
import { TaskBadgeViewComponent } from './task-badge-view.component';
import * as i0 from "@angular/core";
export class TaskBadgeViewComponentModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TaskBadgeViewComponentModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: TaskBadgeViewComponentModule, declarations: [TaskBadgeViewComponent], imports: [CommonModule, PipesModule], exports: [TaskBadgeViewComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TaskBadgeViewComponentModule, imports: [CommonModule, PipesModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TaskBadgeViewComponentModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, PipesModule],
                    declarations: [TaskBadgeViewComponent],
                    exports: [TaskBadgeViewComponent]
                }]
        }] });
//# sourceMappingURL=task-badge-view.module.js.map