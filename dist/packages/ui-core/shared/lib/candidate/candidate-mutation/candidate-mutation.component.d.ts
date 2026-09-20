import { OnInit, AfterViewInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { NbDialogRef, NbStepperComponent, NbTagComponent } from '@nebular/theme';
import { IRole, ICandidateCreateInput, ICandidate, IOrganization } from '@gauzy/contracts';
import { CandidatesService, ErrorHandlingService, RoleService, Store } from '@gauzy/ui-core/core';
import { BasicInfoFormComponent } from '../../user/forms';
import { CandidateCvComponent } from '../candidate-cv/candidate-cv.component';
import * as i0 from "@angular/core";
export declare class CandidateMutationComponent implements OnInit, AfterViewInit {
    private readonly dialogRef;
    private readonly roleService;
    private readonly store;
    private readonly candidatesService;
    private readonly errorHandler;
    userBasicInfo: BasicInfoFormComponent;
    candidateCv: CandidateCvComponent;
    stepper: NbStepperComponent;
    form: UntypedFormGroup;
    formCV: UntypedFormGroup;
    role: IRole;
    candidates: ICandidateCreateInput[];
    organization: IOrganization;
    constructor(dialogRef: NbDialogRef<CandidateMutationComponent>, roleService: RoleService, store: Store, candidatesService: CandidatesService, errorHandler: ErrorHandlingService);
    ngOnInit(): void;
    ngAfterViewInit(): Promise<void>;
    closeDialog(candidate?: ICandidate[]): void;
    addCandidate(): void;
    add(): Promise<void>;
    /**
     *  Go to another the step without to saving data form
     */
    gotoStep(step: number): void;
    /**
     * Removed one candidate in the array of candidates.
     * @param tag
     */
    onCandidateRemove(tag: NbTagComponent): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<CandidateMutationComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<CandidateMutationComponent, "ga-candidate-mutation", never, {}, {}, never, never, false, never>;
}
