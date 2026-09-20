import { OnInit, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { UntypedFormGroup } from '@angular/forms';
import { NbDialogRef, NbStepperComponent } from '@nebular/theme';
import { ICandidate, ICandidateInterview, IEmployee, IDateRange, ICandidatePersonalQualities, ICandidateTechnologies, IOrganization } from '@gauzy/contracts';
import { CandidateInterviewersService, CandidateInterviewService, CandidatePersonalQualitiesService, CandidatesService, CandidateStore, CandidateTechnologiesService, EmployeesService, ErrorHandlingService } from '@gauzy/ui-core/core';
import { Store } from '@gauzy/ui-core/core';
import { CandidateCriterionsFormComponent } from './candidate-criterions-form/candidate-criterions-form.component';
import { CandidateInterviewFormComponent } from './candidate-interview-form/candidate-interview-form.component';
import { CandidateNotificationFormComponent } from './candidate-notification-form/candidate-notification-form.component';
import { CommunicationService } from './communication.service';
import * as i0 from "@angular/core";
export declare class CandidateInterviewMutationComponent implements AfterViewInit, OnInit, OnDestroy {
    protected readonly dialogRef: NbDialogRef<CandidateInterviewMutationComponent>;
    protected readonly employeesService: EmployeesService;
    protected readonly store: Store;
    private readonly cdRef;
    private readonly candidateInterviewService;
    protected readonly candidatesService: CandidatesService;
    private readonly errorHandler;
    private readonly candidateInterviewersService;
    private readonly candidateTechnologiesService;
    private readonly candidatePersonalQualitiesService;
    private readonly router;
    private readonly candidateStore;
    private readonly communicationService;
    editData: ICandidateInterview;
    selectedCandidate: ICandidate;
    interviewId: any;
    isCalendar: boolean;
    _selectedRangeCalendar: IDateRange;
    get selectedRangeCalendar(): IDateRange;
    set selectedRangeCalendar(value: IDateRange);
    _headerTitle: string;
    get headerTitle(): string;
    set headerTitle(value: string);
    _interviews: ICandidateInterview[];
    get interviews(): ICandidateInterview[];
    set interviews(value: ICandidateInterview[]);
    stepper: NbStepperComponent;
    candidateCriterionsForm: CandidateCriterionsFormComponent;
    candidateInterviewForm: CandidateInterviewFormComponent;
    candidateNotificationForm: CandidateNotificationFormComponent;
    form: UntypedFormGroup;
    candidateForm: UntypedFormGroup;
    interviewerForm: UntypedFormGroup;
    interview: any;
    employees: IEmployee[];
    selectedInterviewers: string[];
    criterionsId: any;
    isTitleExist: boolean;
    personalQualities: ICandidatePersonalQualities[];
    technologies: ICandidateTechnologies[];
    selectedCandidateId: string;
    organization: IOrganization;
    constructor(dialogRef: NbDialogRef<CandidateInterviewMutationComponent>, employeesService: EmployeesService, store: Store, cdRef: ChangeDetectorRef, candidateInterviewService: CandidateInterviewService, candidatesService: CandidatesService, errorHandler: ErrorHandlingService, candidateInterviewersService: CandidateInterviewersService, candidateTechnologiesService: CandidateTechnologiesService, candidatePersonalQualitiesService: CandidatePersonalQualitiesService, router: Router, candidateStore: CandidateStore, communicationService: CommunicationService);
    isCriterionsVisible: boolean;
    ngOnInit(): Promise<void>;
    titleExist(value: boolean): void;
    ngAfterViewInit(): Promise<void>;
    next(): void;
    /**
     *
     * @param employeeIds
     */
    getEmployees(employeeIds: string[]): Promise<void>;
    save(): Promise<void>;
    createInterview(interview: ICandidateInterview): Promise<any>;
    addInterviewers(interviewId: string, employeeIds: string[]): Promise<void>;
    addCriterions(interviewId: string, tech?: string[], qual?: string[]): Promise<void>;
    editInterview(): Promise<any>;
    updateCriterions(qual: ICandidatePersonalQualities[], tech: ICandidateTechnologies[]): Promise<void>;
    setCriterions(data: ICandidateTechnologies[] | ICandidatePersonalQualities[], selectedItems: string[]): {
        createInput: any[];
        deleteInput: any[];
    };
    /**
     *
     * @param id
     * @returns
     */
    onCandidateSelected(id: string): Promise<void>;
    closeDialog(interview?: ICandidateInterview): void;
    previous(): void;
    route(): void;
    showCriterions(): void;
    private updateTechnologiesList;
    private removeTechnologyFromList;
    private updatePersonalQualitiesList;
    private removePersonalQualityFromList;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<CandidateInterviewMutationComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<CandidateInterviewMutationComponent, "ga-candidate-interview-mutation", never, { "editData": { "alias": "editData"; "required": false; }; "selectedCandidate": { "alias": "selectedCandidate"; "required": false; }; "interviewId": { "alias": "interviewId"; "required": false; }; "isCalendar": { "alias": "isCalendar"; "required": false; }; "selectedRangeCalendar": { "alias": "selectedRangeCalendar"; "required": false; }; "headerTitle": { "alias": "headerTitle"; "required": false; }; "interviews": { "alias": "interviews"; "required": false; }; }, {}, never, never, false, never>;
}
