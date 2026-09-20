import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbSelectModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../../shared.module';
import { CandidateInterviewerSelectComponent } from './candidate-interviewer-select.component';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class CandidateInterviewerSelectModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CandidateInterviewerSelectModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: CandidateInterviewerSelectModule, declarations: [CandidateInterviewerSelectComponent], imports: [CommonModule, FormsModule, ReactiveFormsModule, NbSelectModule, i1.TranslateModule, SharedModule], exports: [CandidateInterviewerSelectComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CandidateInterviewerSelectModule, imports: [CommonModule, FormsModule, ReactiveFormsModule, NbSelectModule, TranslateModule.forChild(), SharedModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CandidateInterviewerSelectModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, FormsModule, ReactiveFormsModule, NbSelectModule, TranslateModule.forChild(), SharedModule],
                    declarations: [CandidateInterviewerSelectComponent],
                    exports: [CandidateInterviewerSelectComponent],
                    providers: []
                }]
        }] });
//# sourceMappingURL=candidate-interviewer-select.module.js.map