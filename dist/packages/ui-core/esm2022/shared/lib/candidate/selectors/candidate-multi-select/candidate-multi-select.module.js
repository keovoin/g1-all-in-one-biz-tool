import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbSelectModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../../shared.module';
import { CandidateMultiSelectComponent } from './candidate-multi-select.component';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class CandidateMultiSelectModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CandidateMultiSelectModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: CandidateMultiSelectModule, declarations: [CandidateMultiSelectComponent], imports: [CommonModule, NbSelectModule, i1.TranslateModule, SharedModule], exports: [CandidateMultiSelectComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CandidateMultiSelectModule, imports: [CommonModule, NbSelectModule, TranslateModule.forChild(), SharedModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CandidateMultiSelectModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, NbSelectModule, TranslateModule.forChild(), SharedModule],
                    declarations: [CandidateMultiSelectComponent],
                    exports: [CandidateMultiSelectComponent]
                }]
        }] });
//# sourceMappingURL=candidate-multi-select.module.js.map