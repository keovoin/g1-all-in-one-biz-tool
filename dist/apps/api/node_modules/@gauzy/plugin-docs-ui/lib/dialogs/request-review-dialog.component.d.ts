import { NbDialogRef } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import * as i0 from "@angular/core";
/**
 * Manual review request dialog (`01-ux-spec.md` §11 / backend `RequestReviewDTO`).
 * The reason is OPTIONAL — exactly like rejection — and is what makes the review
 * queue reachable when AI is disabled: without it the only path into `PENDING`
 * is an AI-driven `reviewReason`. Closes with `{ reason?: string }` on confirm,
 * `null` on cancel.
 */
export declare class RequestReviewDialogComponent extends TranslationBaseComponent {
    readonly translateService: TranslateService;
    private readonly dialogRef;
    reason: string;
    constructor(translateService: TranslateService, dialogRef: NbDialogRef<RequestReviewDialogComponent>);
    confirm(): void;
    cancel(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<RequestReviewDialogComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<RequestReviewDialogComponent, "gz-docs-request-review-dialog", never, {}, {}, never, never, false, never>;
}
