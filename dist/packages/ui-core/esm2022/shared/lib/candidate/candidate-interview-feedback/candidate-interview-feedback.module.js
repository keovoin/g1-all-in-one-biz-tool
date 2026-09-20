import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbIconModule, NbButtonModule, NbCardModule, NbInputModule, NbRadioModule, NbAccordionModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { CandidateCriterionsRatingService, CandidatePersonalQualitiesService, CandidateTechnologiesService } from '@gauzy/ui-core/core';
import { CandidateInterviewFeedbackComponent } from './candidate-interview-feedback.component';
import { StarRatingInputModule } from '../../star-rating/star-rating-input/star-rating-input.module';
import { CandidateSelectModule } from '../selectors/candidate-select/candidate-select.module';
import { CandidateInterviewerSelectModule } from '../selectors/candidate-interviewer-select/candidate-interviewer-select.module';
import { StarRatingOutputModule } from '../../star-rating/star-rating-output/star-rating-output.module';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class CandidateInterviewFeedbackModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CandidateInterviewFeedbackModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: CandidateInterviewFeedbackModule, declarations: [CandidateInterviewFeedbackComponent], imports: [CommonModule,
            FormsModule,
            ReactiveFormsModule,
            NbInputModule,
            NbButtonModule,
            NbCardModule,
            NbRadioModule,
            NbIconModule,
            StarRatingInputModule,
            StarRatingOutputModule,
            CandidateSelectModule,
            CandidateInterviewerSelectModule,
            NbAccordionModule, i1.TranslateModule], exports: [CandidateInterviewFeedbackComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CandidateInterviewFeedbackModule, providers: [CandidateTechnologiesService, CandidatePersonalQualitiesService, CandidateCriterionsRatingService], imports: [CommonModule,
            FormsModule,
            ReactiveFormsModule,
            NbInputModule,
            NbButtonModule,
            NbCardModule,
            NbRadioModule,
            NbIconModule,
            StarRatingInputModule,
            StarRatingOutputModule,
            CandidateSelectModule,
            CandidateInterviewerSelectModule,
            NbAccordionModule,
            TranslateModule.forChild()] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CandidateInterviewFeedbackModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        FormsModule,
                        ReactiveFormsModule,
                        NbInputModule,
                        NbButtonModule,
                        NbCardModule,
                        NbRadioModule,
                        NbIconModule,
                        StarRatingInputModule,
                        StarRatingOutputModule,
                        CandidateSelectModule,
                        CandidateInterviewerSelectModule,
                        NbAccordionModule,
                        TranslateModule.forChild()
                    ],
                    exports: [CandidateInterviewFeedbackComponent],
                    declarations: [CandidateInterviewFeedbackComponent],
                    providers: [CandidateTechnologiesService, CandidatePersonalQualitiesService, CandidateCriterionsRatingService]
                }]
        }] });
//# sourceMappingURL=candidate-interview-feedback.module.js.map