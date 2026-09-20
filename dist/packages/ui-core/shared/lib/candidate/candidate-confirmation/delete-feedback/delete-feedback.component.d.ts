import { OnDestroy } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { ToastrService } from '@gauzy/ui-core/core';
import { CandidateCriterionsRatingService, CandidateFeedbacksService } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
export declare class DeleteFeedbackComponent extends TranslationBaseComponent implements OnDestroy {
    protected readonly dialogRef: NbDialogRef<DeleteFeedbackComponent>;
    readonly translateService: TranslateService;
    private readonly toastrService;
    private readonly candidateCriterionsRatingService;
    private readonly candidateFeedbacksService;
    feedbackId: string;
    constructor(dialogRef: NbDialogRef<DeleteFeedbackComponent>, translateService: TranslateService, toastrService: ToastrService, candidateCriterionsRatingService: CandidateCriterionsRatingService, candidateFeedbacksService: CandidateFeedbacksService);
    delete(): Promise<void>;
    private toastrError;
    closeDialog(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DeleteFeedbackComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DeleteFeedbackComponent, "ga-delete-feedback", never, { "feedbackId": { "alias": "feedbackId"; "required": false; }; }, {}, never, never, false, never>;
}
