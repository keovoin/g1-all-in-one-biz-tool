import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TaskNumberFieldComponent } from './task-number-field.component';
import { NbInputModule } from '@nebular/theme';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class TaskNumberFieldModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TaskNumberFieldModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: TaskNumberFieldModule, declarations: [TaskNumberFieldComponent], imports: [CommonModule, FormsModule, ReactiveFormsModule, i1.TranslateModule, NbInputModule], exports: [TaskNumberFieldComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TaskNumberFieldModule, imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslateModule.forChild(), NbInputModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TaskNumberFieldModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [TaskNumberFieldComponent],
                    exports: [TaskNumberFieldComponent],
                    imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslateModule.forChild(), NbInputModule]
                }]
        }] });
//# sourceMappingURL=task-number-field.module.js.map