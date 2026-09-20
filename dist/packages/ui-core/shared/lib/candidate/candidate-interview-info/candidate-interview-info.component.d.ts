import { OnInit, OnDestroy } from '@angular/core';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { ICandidateInterview, ICandidate, IOrganization } from '@gauzy/contracts';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { CandidateInterviewService, CandidateInterviewersService, CandidatesService, EmployeesService, ToastrService } from '@gauzy/ui-core/core';
import { Store } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
export declare class CandidateInterviewInfoComponent extends TranslationBaseComponent implements OnInit, OnDestroy {
    private readonly dialogRef;
    private readonly candidateInterviewersService;
    private readonly employeesService;
    private readonly candidatesService;
    private readonly dialogService;
    readonly translateService: TranslateService;
    private readonly toastrService;
    private readonly candidateInterviewService;
    private readonly store;
    interviewId: any;
    interviews: ICandidateInterview[];
    isSlider: boolean;
    selectedCandidate: ICandidate;
    candidateId: string;
    interviewerNames: any[];
    currentInterview: ICandidateInterview;
    nameList: string;
    timeUpdate: string;
    isNextBtn: boolean;
    index: number;
    isPreviousBtn: boolean;
    interviewers: any[];
    organization: IOrganization;
    constructor(dialogRef: NbDialogRef<CandidateInterviewInfoComponent>, candidateInterviewersService: CandidateInterviewersService, employeesService: EmployeesService, candidatesService: CandidatesService, dialogService: NbDialogService, translateService: TranslateService, toastrService: ToastrService, candidateInterviewService: CandidateInterviewService, store: Store);
    /**
     *
     */
    ngOnInit(): Promise<void>;
    edit(): Promise<void>;
    loadData(): void;
    getData(id: string): Promise<void>;
    previous(): void;
    next(): void;
    setTime(time: any): void;
    isPastInterview(interview: ICandidateInterview): boolean;
    private toastrSuccess;
    closeDialog(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<CandidateInterviewInfoComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<CandidateInterviewInfoComponent, "ga-candidate-interview-info", never, { "interviewId": { "alias": "interviewId"; "required": false; }; "interviews": { "alias": "interviews"; "required": false; }; "isSlider": { "alias": "isSlider"; "required": false; }; "selectedCandidate": { "alias": "selectedCandidate"; "required": false; }; }, {}, never, never, false, never>;
}
