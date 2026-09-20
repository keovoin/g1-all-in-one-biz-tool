import { Observable } from 'rxjs';
import { NbDialogRef } from '@nebular/theme';
import { ISelectedEmployee, IEngagement } from '@gauzy/contracts';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import * as i0 from "@angular/core";
export declare class SyncDataSelectionComponent extends TranslationBaseComponent {
    private readonly _us;
    private readonly toastrService;
    protected readonly dialogRef: NbDialogRef<any>;
    private readonly errorHandlingService;
    contractsSettings$: Observable<any>;
    private readonly contractsSignal;
    /** exposes the current contracts value and allows context injection */
    set contracts(value: IEngagement[] | null | undefined);
    get contracts(): IEngagement[];
    constructor();
    syncData(): void;
    setSelectedEmployee(employee: ISelectedEmployee | null | undefined): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<SyncDataSelectionComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<SyncDataSelectionComponent, "ngx-sync-data-selection", never, { "contracts": { "alias": "contracts"; "required": false; }; }, {}, never, never, false, never>;
}
