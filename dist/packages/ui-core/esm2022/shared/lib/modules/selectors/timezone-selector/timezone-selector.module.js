import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { TimeZoneSelectorComponent } from './timezone-selector.component';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class TimeZoneSelectorModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TimeZoneSelectorModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: TimeZoneSelectorModule, declarations: [TimeZoneSelectorComponent], imports: [CommonModule, FormsModule, ReactiveFormsModule, i1.TranslateModule, NgSelectModule], exports: [TimeZoneSelectorComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TimeZoneSelectorModule, imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslateModule.forChild(), NgSelectModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TimeZoneSelectorModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [TimeZoneSelectorComponent],
                    exports: [TimeZoneSelectorComponent],
                    imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslateModule.forChild(), NgSelectModule]
                }]
        }] });
//# sourceMappingURL=timezone-selector.module.js.map