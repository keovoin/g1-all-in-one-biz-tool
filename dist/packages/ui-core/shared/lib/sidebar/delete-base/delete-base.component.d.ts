import { OnDestroy, ErrorHandler } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { IHelpCenter } from '@gauzy/contracts';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { HelpCenterService } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
export declare class DeleteBaseComponent extends TranslationBaseComponent implements OnDestroy {
    protected readonly dialogRef: NbDialogRef<DeleteBaseComponent>;
    readonly translateService: TranslateService;
    private readonly helpCenterService;
    private readonly errorHandler;
    base: IHelpCenter;
    constructor(dialogRef: NbDialogRef<DeleteBaseComponent>, translateService: TranslateService, helpCenterService: HelpCenterService, errorHandler: ErrorHandler);
    deleteBase(): Promise<void>;
    closeDialog(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DeleteBaseComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DeleteBaseComponent, "ga-delete-base", never, { "base": { "alias": "base"; "required": false; }; }, {}, never, never, false, never>;
}
