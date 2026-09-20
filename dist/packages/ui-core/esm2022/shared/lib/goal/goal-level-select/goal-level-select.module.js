import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NbInputModule, NbSelectModule, NbTooltipModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { GoalLevelSelectComponent } from './goal-level-select.component';
import { EmployeeMultiSelectModule } from '../../employee/employee-multi-select/employee-multi-select.module';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class GoalLevelSelectModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: GoalLevelSelectModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: GoalLevelSelectModule, declarations: [GoalLevelSelectComponent], imports: [CommonModule,
            NbInputModule,
            NbTooltipModule,
            ReactiveFormsModule,
            NbSelectModule,
            EmployeeMultiSelectModule, i1.TranslateModule], exports: [GoalLevelSelectComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: GoalLevelSelectModule, imports: [CommonModule,
            NbInputModule,
            NbTooltipModule,
            ReactiveFormsModule,
            NbSelectModule,
            EmployeeMultiSelectModule,
            TranslateModule.forChild()] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: GoalLevelSelectModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [GoalLevelSelectComponent],
                    imports: [
                        CommonModule,
                        NbInputModule,
                        NbTooltipModule,
                        ReactiveFormsModule,
                        NbSelectModule,
                        EmployeeMultiSelectModule,
                        TranslateModule.forChild()
                    ],
                    exports: [GoalLevelSelectComponent]
                }]
        }] });
//# sourceMappingURL=goal-level-select.module.js.map