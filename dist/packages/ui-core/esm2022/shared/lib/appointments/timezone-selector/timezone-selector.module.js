import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NbCardModule, NbButtonModule } from '@nebular/theme';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { TimezoneSelectorComponent } from './timezone-selector.component';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class TimezoneSelectorModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TimezoneSelectorModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: TimezoneSelectorModule, declarations: [TimezoneSelectorComponent], imports: [CommonModule,
            FormsModule,
            ReactiveFormsModule,
            NbButtonModule,
            NbCardModule,
            NgSelectModule, i1.TranslateModule], exports: [TimezoneSelectorComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TimezoneSelectorModule, imports: [CommonModule,
            FormsModule,
            ReactiveFormsModule,
            NbButtonModule,
            NbCardModule,
            NgSelectModule,
            TranslateModule.forChild()] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TimezoneSelectorModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        FormsModule,
                        ReactiveFormsModule,
                        NbButtonModule,
                        NbCardModule,
                        NgSelectModule,
                        TranslateModule.forChild()
                    ],
                    exports: [TimezoneSelectorComponent],
                    declarations: [TimezoneSelectorComponent],
                    providers: []
                }]
        }] });
//# sourceMappingURL=timezone-selector.module.js.map