import { OnInit } from '@angular/core';
import { ICandidate, ICandidateInterview, IEmployee } from '@gauzy/contracts';
import { UntypedFormGroup } from '@angular/forms';
import { CandidatesService } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
export declare class CandidateEmailComponent implements OnInit {
    protected readonly candidatesService: CandidatesService;
    private readonly fb;
    isCandidate: boolean;
    templateData: ICandidateInterview;
    selectedCandidate: ICandidate;
    employees: IEmployee[];
    form: UntypedFormGroup;
    employeeList: string;
    dateTemplate: string;
    candidateName: string;
    emailText: string;
    candidateNameTemplate: string;
    textTemplate: string;
    ngOnInit(): void;
    loadFormData(): void;
    onChange(value: string): void;
    setTemplate(): void;
    getDate(startTime: Date, endTime: Date): void;
    getTime(time: Date): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<CandidateEmailComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<CandidateEmailComponent, "ga-candidate-email", never, { "isCandidate": { "alias": "isCandidate"; "required": false; }; "templateData": { "alias": "templateData"; "required": false; }; "selectedCandidate": { "alias": "selectedCandidate"; "required": false; }; "employees": { "alias": "employees"; "required": false; }; }, {}, never, never, false, never>;
}
