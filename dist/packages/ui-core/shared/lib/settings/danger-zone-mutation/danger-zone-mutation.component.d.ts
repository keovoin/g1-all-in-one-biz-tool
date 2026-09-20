import { EventEmitter } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from '@gauzy/ui-core/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import * as i0 from "@angular/core";
export declare class DangerZoneMutationComponent extends TranslationBaseComponent {
    readonly translate: TranslateService;
    readonly dialogRef: NbDialogRef<DangerZoneMutationComponent>;
    private readonly toastrService;
    recordType: string;
    title: string;
    emitData: EventEmitter<string>;
    data: string;
    constructor(translate: TranslateService, dialogRef: NbDialogRef<DangerZoneMutationComponent>, toastrService: ToastrService);
    close(): void;
    sendData(): void;
    delete(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DangerZoneMutationComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DangerZoneMutationComponent, "ga-danger-zone-mutation", never, {}, { "emitData": "emitData"; }, never, never, false, never>;
}
