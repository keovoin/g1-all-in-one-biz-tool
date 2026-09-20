import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NbSelectModule } from '@nebular/theme';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { ProjectSelectorComponent } from './project/project.component';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class ProjectSelectModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProjectSelectModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: ProjectSelectModule, declarations: [ProjectSelectorComponent], imports: [CommonModule, FormsModule, NbSelectModule, NgSelectModule, i1.TranslateModule], exports: [ProjectSelectorComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProjectSelectModule, imports: [CommonModule, FormsModule, NbSelectModule, NgSelectModule, TranslateModule.forChild()] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProjectSelectModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, FormsModule, NbSelectModule, NgSelectModule, TranslateModule.forChild()],
                    declarations: [ProjectSelectorComponent],
                    exports: [ProjectSelectorComponent]
                }]
        }] });
//# sourceMappingURL=project.module.js.map