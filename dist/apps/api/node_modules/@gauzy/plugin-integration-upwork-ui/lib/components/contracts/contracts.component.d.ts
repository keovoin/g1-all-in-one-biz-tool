import { OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { IEngagement } from '@gauzy/contracts';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import * as i0 from "@angular/core";
export declare class ContractsComponent extends TranslationBaseComponent implements OnInit, OnDestroy {
    private readonly _upworkStoreServices;
    private readonly _toastrService;
    private readonly _errorHandlingService;
    private readonly _nbDialogService;
    private readonly _route;
    private readonly _titleCasePipe;
    smartTableSettings: any;
    contracts$: Observable<IEngagement[]>;
    selectedContracts: IEngagement[];
    constructor();
    ngOnInit(): void;
    /**
     * Loads contracts from Upwork and handles errors.
     * This method subscribes to the getContracts method of _upworkStoreServices.
     */
    private _loadContracts;
    /**
     * Loads Smart Table settings for displaying contracts.
     * This method configures the select mode, actions, mode, and columns for the Smart Table.
     */
    private _loadSmartTableSettings;
    /**
     * Handles selection of contracts.
     *
     * @param selected The selected contracts array.
     */
    selectContract({ selected }: {
        selected: any;
    }): void;
    /**
     * Opens a dialog to manage entity synchronization.
     * Waits for the dialog to close before resolving.
     */
    manageEntitiesSync(): Promise<void>;
    /**
     * Initiates the synchronization of selected contracts with Upwork.
     * Displays a success toast upon successful synchronization.
     */
    syncContracts(): void;
    /**
     * Listens for language changes and applies translations to Smart Table settings accordingly.
     * This method subscribes to the onLangChange event from the translateService.
     */
    private _applyTranslationOnSmartTable;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ContractsComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ContractsComponent, "ngx-contracts", never, {}, {}, never, never, false, never>;
}
