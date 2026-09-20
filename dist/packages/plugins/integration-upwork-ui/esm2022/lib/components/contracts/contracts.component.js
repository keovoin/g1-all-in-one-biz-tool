import { __decorate, __metadata } from "tslib";
import { Component, inject } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { of, EMPTY, firstValueFrom, filter, catchError, tap } from 'rxjs';
import { NbDialogService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import * as moment from 'moment';
import { ErrorHandlingService, ToastrService, UpworkStoreService } from '@gauzy/ui-core/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { DateViewComponent } from '@gauzy/ui-core/shared';
import { SyncDataSelectionComponent } from '../sync-data-selection/sync-data-selection.component';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "angular2-smart-table";
import * as i3 from "@gauzy/ui-core/shared";
import * as i4 from "@ngx-translate/core";
import * as i5 from "@angular/common";
let ContractsComponent = class ContractsComponent extends TranslationBaseComponent {
    constructor() {
        super(inject(TranslateService));
        this._upworkStoreServices = inject(UpworkStoreService);
        this._toastrService = inject(ToastrService);
        this._errorHandlingService = inject(ErrorHandlingService);
        this._nbDialogService = inject(NbDialogService);
        this._route = inject(ActivatedRoute);
        this._titleCasePipe = inject(TitleCasePipe);
        this.contracts$ = this._upworkStoreServices.contracts$;
        this.selectedContracts = [];
    }
    ngOnInit() {
        this._loadSmartTableSettings();
        this._applyTranslationOnSmartTable();
        this._loadContracts();
        // Subscribe to changes in the query parameters
        this._route.queryParamMap
            .pipe(
        // Filter out unwanted changes and only proceed if 'openAddDialog' is 'true'
        filter((params) => !!params && params.get('openAddDialog') === 'true'), 
        // Debounce the changes to avoid rapid triggering
        // Execute the addIncome method when conditions are met
        tap(() => this.manageEntitiesSync()), 
        // Unsubscribe when the component is destroyed
        untilDestroyed(this))
            .subscribe();
    }
    /**
     * Loads contracts from Upwork and handles errors.
     * This method subscribes to the getContracts method of _upworkStoreServices.
     */
    _loadContracts() {
        this._upworkStoreServices
            .getContracts()
            .pipe(
        // Handle errors using the _errorHandlingService.handleError method
        catchError((error) => {
            this._errorHandlingService.handleError(error);
            // Return an observable with a null value to continue the stream
            return of(null);
        }), 
        // Automatically unsubscribe when the component is destroyed
        untilDestroyed(this))
            .subscribe();
    }
    /**
     * Loads Smart Table settings for displaying contracts.
     * This method configures the select mode, actions, mode, and columns for the Smart Table.
     */
    _loadSmartTableSettings() {
        // Configure Smart Table settings
        this.smartTableSettings = {
            selectedRowIndex: -1, // Initialize the selected row index
            selectMode: 'multi',
            actions: {
                add: false,
                edit: false,
                delete: false,
                select: true
            },
            mode: 'external',
            noDataMessage: this.getTranslation('SM_TABLE.NO_DATA.CONTRACT'),
            columns: {
                engagement_start_date: {
                    title: this.getTranslation('SM_TABLE.START_DATE'),
                    type: 'custom',
                    isFilterable: false,
                    renderComponent: DateViewComponent,
                    valuePrepareFunction: (value) => moment.unix(parseInt(value) / 1000),
                    componentInitFunction: (instance, cell) => {
                        instance.rowData = cell.getRow().getData();
                    }
                },
                engagement_end_date: {
                    title: this.getTranslation('SM_TABLE.END_DATE'),
                    type: 'custom',
                    renderComponent: DateViewComponent,
                    isFilterable: false,
                    valuePrepareFunction: (value) => moment.unix(parseInt(value) / 1000),
                    componentInitFunction: (instance, cell) => {
                        instance.rowData = cell.getRow().getData();
                    }
                },
                job__title: {
                    title: this.getTranslation('SM_TABLE.JOB_TITLE'),
                    type: 'string'
                },
                status: {
                    title: this.getTranslation('SM_TABLE.STATUS'),
                    type: 'string',
                    valuePrepareFunction: (value) => this._titleCasePipe.transform(value)
                }
            }
        };
    }
    /**
     * Handles selection of contracts.
     *
     * @param selected The selected contracts array.
     */
    selectContract({ selected }) {
        this.selectedContracts = selected;
    }
    /**
     * Opens a dialog to manage entity synchronization.
     * Waits for the dialog to close before resolving.
     */
    async manageEntitiesSync() {
        try {
            if (this.selectedContracts.length > 0) {
                // Open the dialog for syncing data selection
                const dialog = this._nbDialogService.open(SyncDataSelectionComponent, {
                    context: {
                        contracts: this.selectedContracts
                    }
                });
                // Wait for the dialog to close using firstValueFrom
                await firstValueFrom(dialog.onClose);
            }
        }
        catch (error) {
            // Handle any errors that may occur during the process
            console.error('Error in manageEntitiesSync:', error);
            // Optionally display an error message or handle the error accordingly
        }
    }
    /**
     * Initiates the synchronization of selected contracts with Upwork.
     * Displays a success toast upon successful synchronization.
     */
    syncContracts() {
        // Trigger the synchronization of selected contracts using _upworkStoreServices
        this._upworkStoreServices
            .syncContracts(this.selectedContracts)
            .pipe(
        // Display a success toast upon successful synchronization
        tap(() => {
            this._toastrService.success(this.getTranslation('INTEGRATIONS.UPWORK_PAGE.SYNCED_CONTRACTS'), this.getTranslation('TOASTR.TITLE.SUCCESS'));
        }), 
        // Handle errors using the _ehs.handleError method and return an EMPTY observable
        catchError((error) => {
            this._errorHandlingService.handleError(error);
            return EMPTY;
        }), 
        // Automatically unsubscribe when the component is destroyed
        untilDestroyed(this))
            .subscribe();
    }
    /**
     * Listens for language changes and applies translations to Smart Table settings accordingly.
     * This method subscribes to the onLangChange event from the translateService.
     */
    _applyTranslationOnSmartTable() {
        // Subscribe to language changes using onLangChange
        this.translateService.onLangChange
            .pipe(
        // Trigger the loading of Smart Table settings when the language changes
        tap(() => this._loadSmartTableSettings()), 
        // Automatically unsubscribe when the component is destroyed
        untilDestroyed(this))
            .subscribe();
    }
    ngOnDestroy() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ContractsComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: ContractsComponent, isStandalone: false, selector: "ngx-contracts", providers: [TitleCasePipe], usesInheritance: true, ngImport: i0, template: "<div class=\"contracts-container\">\n\t<div class=\"mb-3 mt-3\">\n\t\t<button nbButton [disabled]=\"!selectedContracts.length\" (click)=\"manageEntitiesSync()\" status=\"primary\">\n\t\t\t<nb-icon class=\"mr-1\" icon=\"edit-outline\"></nb-icon>\n\t\t\t{{ 'BUTTONS.MANAGE' | translate }}\n\t\t</button>\n\t</div>\n\t<angular2-smart-table\n\t\tstyle=\"cursor: pointer\"\n\t\t[settings]=\"smartTableSettings\"\n\t\t(userRowSelect)=\"selectContract($event)\"\n\t\t[source]=\"contracts$ | async\"\n\t></angular2-smart-table>\n</div>\n", styles: ["::ng-deep .contracts-table .angular2-smart-actions{text-align:center;width:5%}::ng-deep .contracts-table .angular2-smart-actions .form-control{width:15px;display:inline-block}:host{--gauzy-table-font-size: .6875rem;--gauzy-table-line-height: 1rem;--gauzy-table-cell-padding-y: .1875rem;--gauzy-table-cell-padding-x: .4375rem;--gauzy-table-header-font-size: .75rem;--gauzy-table-header-line-height: .8125rem;--gauzy-table-header-padding-y: .3125rem;--gauzy-table-header-padding-x: .4375rem;--gauzy-table-filter-padding-y: .1875rem;--gauzy-table-control-height: 1.5rem;--gauzy-table-badge-height: 1rem;--gauzy-table-badge-radius: .25rem;--gauzy-table-badge-padding-y: .1875rem;--gauzy-table-chip-font-size: .625rem;--gauzy-table-chip-line-height: .75rem;--gauzy-table-chip-padding-y: 0;--gauzy-table-chip-padding-x: .3125rem;--gauzy-table-chip-gap: .125rem;--gauzy-table-chip-block-gap: .5rem;--gauzy-people-avatar-size: 1.25rem;--gauzy-people-font-size: .75rem;--gauzy-people-chip-padding-y: .25rem}:host ::ng-deep angular2-smart-table tr.angular2-smart-titles>th{border-bottom:1px solid var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));vertical-align:middle}:host ::ng-deep angular2-smart-table tbody tr{background:transparent}:host ::ng-deep angular2-smart-table tbody tr>td{vertical-align:middle}:host ::ng-deep angular2-smart-table tbody tr:hover:not(.selected){background:var(--gauzy-hover-tint, rgba(126, 126, 143, .12))!important}:host ::ng-deep angular2-smart-table tbody tr.selected{background:var(--gauzy-active-tint, rgba(126, 126, 143, .2))!important;box-shadow:none!important}\n"], dependencies: [{ kind: "component", type: i1.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "component", type: i1.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "component", type: i2.Angular2SmartTableComponent, selector: "angular2-smart-table", inputs: ["source", "settings"], outputs: ["rowSelect", "userRowSelect", "delete", "edit", "create", "custom", "deleteConfirm", "editConfirm", "editCancel", "createConfirm", "createCancel", "rowHover", "afterGridInit"] }, { kind: "directive", type: i3.SmartTableSettlingDirective, selector: "angular2-smart-table" }, { kind: "directive", type: i3.SmartTableFilterToggleDirective, selector: "angular2-smart-table" }, { kind: "pipe", type: i4.TranslatePipe, name: "translate" }, { kind: "pipe", type: i5.AsyncPipe, name: "async" }] }); }
};
ContractsComponent = __decorate([
    UntilDestroy(),
    __metadata("design:paramtypes", [])
], ContractsComponent);
export { ContractsComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ContractsComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-contracts', providers: [TitleCasePipe], standalone: false, template: "<div class=\"contracts-container\">\n\t<div class=\"mb-3 mt-3\">\n\t\t<button nbButton [disabled]=\"!selectedContracts.length\" (click)=\"manageEntitiesSync()\" status=\"primary\">\n\t\t\t<nb-icon class=\"mr-1\" icon=\"edit-outline\"></nb-icon>\n\t\t\t{{ 'BUTTONS.MANAGE' | translate }}\n\t\t</button>\n\t</div>\n\t<angular2-smart-table\n\t\tstyle=\"cursor: pointer\"\n\t\t[settings]=\"smartTableSettings\"\n\t\t(userRowSelect)=\"selectContract($event)\"\n\t\t[source]=\"contracts$ | async\"\n\t></angular2-smart-table>\n</div>\n", styles: ["::ng-deep .contracts-table .angular2-smart-actions{text-align:center;width:5%}::ng-deep .contracts-table .angular2-smart-actions .form-control{width:15px;display:inline-block}:host{--gauzy-table-font-size: .6875rem;--gauzy-table-line-height: 1rem;--gauzy-table-cell-padding-y: .1875rem;--gauzy-table-cell-padding-x: .4375rem;--gauzy-table-header-font-size: .75rem;--gauzy-table-header-line-height: .8125rem;--gauzy-table-header-padding-y: .3125rem;--gauzy-table-header-padding-x: .4375rem;--gauzy-table-filter-padding-y: .1875rem;--gauzy-table-control-height: 1.5rem;--gauzy-table-badge-height: 1rem;--gauzy-table-badge-radius: .25rem;--gauzy-table-badge-padding-y: .1875rem;--gauzy-table-chip-font-size: .625rem;--gauzy-table-chip-line-height: .75rem;--gauzy-table-chip-padding-y: 0;--gauzy-table-chip-padding-x: .3125rem;--gauzy-table-chip-gap: .125rem;--gauzy-table-chip-block-gap: .5rem;--gauzy-people-avatar-size: 1.25rem;--gauzy-people-font-size: .75rem;--gauzy-people-chip-padding-y: .25rem}:host ::ng-deep angular2-smart-table tr.angular2-smart-titles>th{border-bottom:1px solid var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));vertical-align:middle}:host ::ng-deep angular2-smart-table tbody tr{background:transparent}:host ::ng-deep angular2-smart-table tbody tr>td{vertical-align:middle}:host ::ng-deep angular2-smart-table tbody tr:hover:not(.selected){background:var(--gauzy-hover-tint, rgba(126, 126, 143, .12))!important}:host ::ng-deep angular2-smart-table tbody tr.selected{background:var(--gauzy-active-tint, rgba(126, 126, 143, .2))!important;box-shadow:none!important}\n"] }]
        }], ctorParameters: () => [] });
//# sourceMappingURL=contracts.component.js.map