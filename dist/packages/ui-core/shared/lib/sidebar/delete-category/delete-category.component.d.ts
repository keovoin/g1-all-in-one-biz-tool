import { IHelpCenter } from '@gauzy/contracts';
import { OnDestroy, ErrorHandler } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { HelpCenterService } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
export declare class DeleteCategoryComponent extends TranslationBaseComponent implements OnDestroy {
    protected readonly dialogRef: NbDialogRef<DeleteCategoryComponent>;
    readonly translateService: TranslateService;
    private readonly helpCenterService;
    private readonly errorHandler;
    category: IHelpCenter;
    constructor(dialogRef: NbDialogRef<DeleteCategoryComponent>, translateService: TranslateService, helpCenterService: HelpCenterService, errorHandler: ErrorHandler);
    closeDialog(): void;
    deleteCategory(): Promise<void>;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DeleteCategoryComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DeleteCategoryComponent, "ga-delete-category", never, { "category": { "alias": "category"; "required": false; }; }, {}, never, never, false, never>;
}
