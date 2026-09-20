import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NbCardModule, NbInputModule, NbButtonModule, NbSelectModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { GoalTemplatesComponent } from './goal-templates.component';
import { GoalCustomUnitModule } from '../goal-custom-unit/goal-custom-unit.module';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class GoalTemplatesModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: GoalTemplatesModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: GoalTemplatesModule, declarations: [GoalTemplatesComponent], imports: [CommonModule,
            NbCardModule,
            ReactiveFormsModule,
            NbInputModule,
            NbSelectModule,
            NbButtonModule,
            GoalCustomUnitModule, i1.TranslateModule], exports: [GoalTemplatesComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: GoalTemplatesModule, imports: [CommonModule,
            NbCardModule,
            ReactiveFormsModule,
            NbInputModule,
            NbSelectModule,
            NbButtonModule,
            GoalCustomUnitModule,
            TranslateModule.forChild()] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: GoalTemplatesModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [GoalTemplatesComponent],
                    imports: [
                        CommonModule,
                        NbCardModule,
                        ReactiveFormsModule,
                        NbInputModule,
                        NbSelectModule,
                        NbButtonModule,
                        GoalCustomUnitModule,
                        TranslateModule.forChild()
                    ],
                    exports: [GoalTemplatesComponent]
                }]
        }] });
//# sourceMappingURL=goal-templates.module.js.map