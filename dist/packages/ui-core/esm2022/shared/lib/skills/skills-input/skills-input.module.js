import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkillsInputComponent } from './skills-input.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NbBadgeModule } from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class SkillsInputModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: SkillsInputModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: SkillsInputModule, declarations: [SkillsInputComponent], imports: [CommonModule,
            NgSelectModule,
            NbBadgeModule,
            FormsModule,
            ReactiveFormsModule, i1.TranslateModule], exports: [SkillsInputComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: SkillsInputModule, imports: [CommonModule,
            NgSelectModule,
            NbBadgeModule,
            FormsModule,
            ReactiveFormsModule,
            TranslateModule.forChild()] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: SkillsInputModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        NgSelectModule,
                        NbBadgeModule,
                        FormsModule,
                        ReactiveFormsModule,
                        TranslateModule.forChild()
                    ],
                    exports: [SkillsInputComponent],
                    declarations: [SkillsInputComponent]
                }]
        }] });
//# sourceMappingURL=skills-input.module.js.map