import { ICandidateInterview } from '@gauzy/contracts';
import { OnDestroy } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { CandidateInterviewService, CandidateInterviewersService, CandidatePersonalQualitiesService, CandidateTechnologiesService, ToastrService } from '@gauzy/ui-core/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import * as i0 from "@angular/core";
export declare class DeleteInterviewComponent extends TranslationBaseComponent implements OnDestroy {
    protected readonly dialogRef: NbDialogRef<DeleteInterviewComponent>;
    readonly translateService: TranslateService;
    private readonly toastrService;
    private readonly candidateInterviewService;
    private readonly candidateTechnologiesService;
    private readonly candidatePersonalQualitiesService;
    private readonly candidateInterviewersService;
    interview: ICandidateInterview;
    constructor(dialogRef: NbDialogRef<DeleteInterviewComponent>, translateService: TranslateService, toastrService: ToastrService, candidateInterviewService: CandidateInterviewService, candidateTechnologiesService: CandidateTechnologiesService, candidatePersonalQualitiesService: CandidatePersonalQualitiesService, candidateInterviewersService: CandidateInterviewersService);
    delete(): Promise<void>;
    private toastrError;
    closeDialog(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DeleteInterviewComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DeleteInterviewComponent, "ga-delete-interview", never, { "interview": { "alias": "interview"; "required": false; }; }, {}, never, never, false, never>;
}
