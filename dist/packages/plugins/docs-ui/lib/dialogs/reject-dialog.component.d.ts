import { NbDialogRef } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import * as i0 from "@angular/core";
/**
 * Review rejection dialog with an explicitly OPTIONAL reason (`01-ux-spec.md`
 * §11 — rejection never requires a reason; the same `reason` field is sent for
 * single and bulk rejection). Closes with `{ reason?: string }` on confirm,
 * `null` on cancel.
 */
export declare class RejectDialogComponent extends TranslationBaseComponent {
    readonly translateService: TranslateService;
    private readonly dialogRef;
    reason: string;
    constructor(translateService: TranslateService, dialogRef: NbDialogRef<RejectDialogComponent>);
    confirm(): void;
    cancel(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<RejectDialogComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<RejectDialogComponent, "gz-docs-reject-dialog", never, {}, {}, never, never, false, never>;
}
