import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NbIconModule, NbButtonModule, NbCardModule, NbTabsetModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { CandidateInterviewInfoComponent } from './candidate-interview-info.component';
import { CandidateInterviewMutationModule } from '../candidate-interview-mutation/candidate-interview-mutation.module';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class CandidateInterviewInfoModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CandidateInterviewInfoModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: CandidateInterviewInfoModule, declarations: [CandidateInterviewInfoComponent], imports: [CommonModule,
            FormsModule,
            NbCardModule,
            NbButtonModule,
            NbIconModule,
            NbTabsetModule,
            CandidateInterviewMutationModule, i1.TranslateModule], exports: [CandidateInterviewInfoComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CandidateInterviewInfoModule, imports: [CommonModule,
            FormsModule,
            NbCardModule,
            NbButtonModule,
            NbIconModule,
            NbTabsetModule,
            CandidateInterviewMutationModule,
            TranslateModule.forChild()] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CandidateInterviewInfoModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        FormsModule,
                        NbCardModule,
                        NbButtonModule,
                        NbIconModule,
                        NbTabsetModule,
                        CandidateInterviewMutationModule,
                        TranslateModule.forChild()
                    ],
                    exports: [CandidateInterviewInfoComponent],
                    declarations: [CandidateInterviewInfoComponent]
                }]
        }] });
//# sourceMappingURL=candidate-interview-info.module.js.map