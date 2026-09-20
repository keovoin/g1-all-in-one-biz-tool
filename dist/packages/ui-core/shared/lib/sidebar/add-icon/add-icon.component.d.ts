import { OnDestroy } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import * as i0 from "@angular/core";
export declare class AddIconComponent extends TranslationBaseComponent implements OnDestroy {
    protected dialogRef: NbDialogRef<AddIconComponent>;
    readonly translateService: TranslateService;
    private _ngDestroy$;
    constructor(dialogRef: NbDialogRef<AddIconComponent>, translateService: TranslateService);
    closeDialog(): void;
    onIconset(icon: any): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<AddIconComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<AddIconComponent, "ga-add-icon", never, {}, {}, never, never, false, never>;
}
