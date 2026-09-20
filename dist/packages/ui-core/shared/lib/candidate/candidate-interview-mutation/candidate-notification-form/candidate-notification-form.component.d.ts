import { OnDestroy } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { ICandidateInterview, ICandidate, IEmployee } from '@gauzy/contracts';
import { CandidateEmailComponent } from './candidate-email/candidate-email.component';
import * as i0 from "@angular/core";
export declare class CandidateNotificationFormComponent implements OnDestroy {
    interview: ICandidateInterview;
    selectedCandidate: ICandidate;
    employees: IEmployee[];
    candidateForm: UntypedFormGroup;
    interviewerForm: UntypedFormGroup;
    isCandidateNotification: boolean;
    isInterviewerNotification: boolean;
    emailCandidateForm: CandidateEmailComponent;
    emailInterviewerForm: CandidateEmailComponent;
    constructor();
    notification(): void;
    checkedCandidate(checked: boolean): void;
    checkedInterviewer(checked: boolean): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<CandidateNotificationFormComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<CandidateNotificationFormComponent, "ga-candidate-notification-form", never, { "interview": { "alias": "interview"; "required": false; }; "selectedCandidate": { "alias": "selectedCandidate"; "required": false; }; "employees": { "alias": "employees"; "required": false; }; }, {}, never, never, false, never>;
}
