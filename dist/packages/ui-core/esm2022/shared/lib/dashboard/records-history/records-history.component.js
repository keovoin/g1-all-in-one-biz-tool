import { __decorate, __metadata } from "tslib";
import { Component, Input, Optional } from '@angular/core';
import { debounceTime, tap } from 'rxjs/operators';
import { NbDialogRef } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { LocalDataSource } from 'angular2-smart-table';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { RecurringExpenseDefaultCategoriesEnum, EmployeeStatisticsHistoryEnum as HistoryType } from '@gauzy/contracts';
import { distinctUntilChange } from '@gauzy/ui-core/common';
import { PaginationFilterBaseComponent } from '../../smart-data-layout/pagination/pagination-filter-base.component';
import { ContactLinksComponent, DateViewComponent, IncomeExpenseAmountComponent } from '../../table-components';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
import * as i2 from "@nebular/theme";
import * as i3 from "angular2-smart-table";
import * as i4 from "../../smart-data-layout/pagination/pagination-v2/pagination-v2.component";
import * as i5 from "../../smart-data-layout/smart-table-loading/smart-table-settling.directive";
import * as i6 from "../../smart-data-layout/smart-table-filters/smart-table-filter-toggle.directive";
import * as i7 from "@angular/common";
let RecordsHistoryComponent = class RecordsHistoryComponent extends PaginationFilterBaseComponent {
    constructor(translateService, 
    // Optional so the component can also be rendered inline (the dashboard
    // builder's Records History widget), where there is no dialog to close and
    // therefore no `NbDialogRef` in the injector.
    dialogRef) {
        super(translateService);
        this.dialogRef = dialogRef;
        this.smartTableSource = new LocalDataSource();
        /** Guards {@link ngOnChanges} until the first population has happened in `ngOnInit`. */
        this._initialized = false;
        this._recordsHistory$ = this.subject$;
        this.smartTableSettings = {
            actions: false,
            selectedRowIndex: -1,
            editable: true,
            noDataMessage: this.getTranslation('SM_TABLE.NO_DATA.HISTORY_RECORD'),
            pager: {
                display: false,
                perPage: this.pagination ? this.pagination.itemsPerPage : this.minItemPerPage
            }
        };
    }
    /** True when this instance was opened as a dialog, i.e. when it can be closed. */
    get isDialog() {
        return !!this.dialogRef;
    }
    ngOnInit() {
        this._recordsHistory$
            .pipe(debounceTime(300), tap(() => this._populateSmartTable()), untilDestroyed(this))
            .subscribe();
        this.pagination$
            .pipe(debounceTime(100), distinctUntilChange(), tap(() => this._recordsHistory$.next(true)), untilDestroyed(this))
            .subscribe();
        this._populateSmartTable();
        this.loadSettingsSmartTable();
        this._applyTranslationOnSmartTable();
        this._initialized = true;
    }
    /**
     * Re-renders when the bound history changes.
     *
     * Only inline usage rebinds — a dialog is opened with a fixed `context` and
     * never changes it — so this is inert on the dialog path. `ngOnChanges` also
     * runs BEFORE the first `ngOnInit`, which `_initialized` filters out so the
     * table is not populated twice on creation.
     *
     * @param changes - The inputs Angular re-bound.
     */
    ngOnChanges(changes) {
        if (!this._initialized) {
            return;
        }
        if (changes['type']) {
            // The columns differ per history type (income has a contact, expenses a
            // vendor and a category), so the settings have to be rebuilt first.
            this.loadSettingsSmartTable();
        }
        if (changes['type'] || changes['records']) {
            this._recordsHistory$.next(true);
        }
    }
    _populateSmartTable() {
        this.loading = true;
        let viewModel;
        // Defensive: an inline host binds its rows asynchronously, and the expense
        // branch below would throw on the very first change detection pass.
        const records = this.records ?? [];
        switch (this.type) {
            case HistoryType.INCOME:
            case HistoryType.BONUS_INCOME:
            case HistoryType.NON_BONUS_INCOME:
                viewModel = records;
                this.translatedType = this.getTranslation('INCOME_PAGE.INCOME').toUpperCase();
                break;
            case HistoryType.EXPENSES:
            case HistoryType.EXPENSES_WITHOUT_SALARY:
                viewModel = records.map(({ valueDate, vendorName, categoryName, amount, notes, isRecurring, source, splitExpense }) => {
                    return {
                        valueDate,
                        vendorName,
                        categoryName,
                        amount,
                        notes,
                        recurring: isRecurring,
                        source,
                        splitExpense: splitExpense,
                        originalValue: splitExpense ? splitExpense.originalValue : '',
                        employeeCount: splitExpense ? splitExpense.employeeCount : ''
                    };
                });
                this.translatedType = this.getTranslation('EXPENSES_PAGE.EXPENSES').toUpperCase();
                break;
        }
        const { activePage, itemsPerPage } = this.getPagination();
        this.smartTableSource.setPaging(activePage, itemsPerPage, false);
        this.smartTableSource.load(viewModel);
        this.setPagination({
            ...this.getPagination(),
            totalItems: this.smartTableSource.count()
        });
        this.loading = false;
    }
    loadSettingsSmartTable() {
        switch (this.type) {
            case HistoryType.INCOME:
            case HistoryType.BONUS_INCOME:
            case HistoryType.NON_BONUS_INCOME:
                this.smartTableSettings = {
                    ...this.smartTableSettings,
                    columns: {
                        valueDate: {
                            title: this.getTranslation('SM_TABLE.DATE'),
                            type: 'custom',
                            width: '30%',
                            isFilterable: false,
                            renderComponent: DateViewComponent,
                            componentInitFunction: (instance, cell) => {
                                instance.rowData = cell.getRow().getData();
                                instance.value = cell.getValue();
                            }
                        },
                        client: {
                            title: this.getTranslation('SM_TABLE.CONTACT'),
                            type: 'custom',
                            renderComponent: ContactLinksComponent,
                            componentInitFunction: (instance, cell) => {
                                instance.rowData = cell.getRow().getData();
                                instance.value = cell.getRawValue();
                            }
                        },
                        amount: {
                            title: this.getTranslation('SM_TABLE.VALUE'),
                            type: 'custom',
                            width: '15%',
                            isFilterable: false,
                            renderComponent: IncomeExpenseAmountComponent,
                            componentInitFunction: (instance, cell) => {
                                instance.rowData = cell.getRow().getData();
                                instance.value = cell.getValue();
                            }
                        },
                        notes: {
                            title: this.getTranslation('SM_TABLE.NOTES'),
                            type: 'string'
                        }
                    }
                };
                break;
            case HistoryType.EXPENSES:
            case HistoryType.EXPENSES_WITHOUT_SALARY:
                this.smartTableSettings = {
                    ...this.smartTableSettings,
                    columns: {
                        source: {
                            title: this.getTranslation('SM_TABLE.SOURCE'),
                            type: 'html',
                            class: 'text-center',
                            isFilterable: false,
                            width: '8%',
                            valuePrepareFunction: (_) => `<div class='text-center'>
								${_ === 'org' ? '<i class="fas fa-building"></i>' : '<i class="fas fa-user-alt"></i>'}
								</div>
								`
                        },
                        valueDate: {
                            title: this.getTranslation('SM_TABLE.DATE'),
                            type: 'custom',
                            width: '20%',
                            isFilterable: false,
                            renderComponent: DateViewComponent,
                            componentInitFunction: (instance, cell) => {
                                instance.rowData = cell.getRow().getData();
                                instance.value = cell.getValue();
                            }
                        },
                        vendorName: {
                            title: this.getTranslation('SM_TABLE.VENDOR'),
                            type: 'string'
                        },
                        categoryName: {
                            title: this.getTranslation('SM_TABLE.CATEGORY'),
                            type: 'html',
                            isFilterable: false,
                            valuePrepareFunction: (_) => this.getCategoryName(_)
                        },
                        amount: {
                            title: this.getTranslation('SM_TABLE.VALUE'),
                            type: 'custom',
                            width: '15%',
                            renderComponent: IncomeExpenseAmountComponent,
                            componentInitFunction: (instance, cell) => {
                                instance.rowData = cell.getRow().getData();
                                instance.value = cell.getValue();
                            }
                        },
                        notes: {
                            title: this.getTranslation('SM_TABLE.NOTES'),
                            type: 'string'
                        }
                    }
                };
                break;
        }
    }
    /**
     * Gets the translated category name if it is one of the default categories;
     * otherwise, returns the original category name.
     *
     * @param category - The category name to be translated.
     * @returns The translated category name or the original category name if not a default category.
     */
    getCategoryName(category) {
        const isDefaultCategory = category in RecurringExpenseDefaultCategoriesEnum;
        return isDefaultCategory ? this.getTranslation(`EXPENSES_PAGE.DEFAULT_CATEGORY.${category}`) : category;
    }
    _applyTranslationOnSmartTable() {
        this.translateService.onLangChange.pipe(untilDestroyed(this)).subscribe(() => {
            this.loadSettingsSmartTable();
            this._populateSmartTable();
        });
    }
    close() {
        this.dialogRef?.close();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: RecordsHistoryComponent, deps: [{ token: i1.TranslateService }, { token: i2.NbDialogRef, optional: true }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: RecordsHistoryComponent, isStandalone: false, selector: "ngx-records-history", inputs: { type: "type", records: "records" }, usesInheritance: true, usesOnChanges: true, ngImport: i0, template: "<nb-card\n  class=\"records\"\n  [class.inline]=\"!isDialog\"\n  [nbSpinner]=\"loading\"\n  nbSpinnerStatus=\"primary\"\n  nbSpinnerSize=\"large\"\n>\n  <nb-card-header>\n    <!-- Rendered only as a dialog: inline (dashboard widget) there is nothing to close. -->\n    @if (isDialog) {\n      <span class=\"cancel\"><i class=\"fas fa-times close\" (click)=\"close()\"></i></span>\n    }\n    <h5 class=\"title\">{{ translatedType | titlecase }}</h5>\n  </nb-card-header>\n  <nb-card-body>\n    <div class=\"table-scroll-container\">\n      <angular2-smart-table\n        [class.ga-table-loading]=\"loading\"\n        style=\"cursor: pointer\"\n        [settings]=\"smartTableSettings\"\n        [source]=\"smartTableSource\"\n      ></angular2-smart-table>\n    </div>\n    <div class=\"pagination-container\">\n      @if (smartTableSource) {\n        <ngx-pagination [source]=\"smartTableSource\"></ngx-pagination>\n      }\n    </div>\n  </nb-card-body>\n</nb-card>\n", styles: ["@charset \"UTF-8\";.action{box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));border:none}.action[nbButton].appearance-filled.status-basic{background-color:var(--gauzy-card-2)}.action.info[nbButton].appearance-filled.status-basic,.action.info-text-1[nbButton].appearance-filled.status-basic{color:var(--gauzy-action-info-text)}.action.secondary{color:var(--text-hint-color)}.action.success{color:var(--gauzy-action-success-text)}.action.warning{color:var(--gauzy-action-warning-text)}.action.orange{color:#ffab2d}.action.primary{color:var(--text-primary-color)}.action.primary.soft[nbButton].appearance-filled.status-basic{background-color:#6e49e81a}.action.select-nb ::ng-deep{box-shadow:none}.action.select-nb ::ng-deep .select-button{box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));background:var(--gauzy-card-2)}button{margin:5px}.actions{background:var(--gauzy-card-2);border-radius:var(--button-rectangle-border-radius);padding:2px 4px!important}.gauzy-button-container{display:flex;justify-content:flex-end;width:100%;padding-bottom:0}.card-custom-header{display:flex;flex-direction:column;width:100%;padding-bottom:0}:host ::ng-deep input{border-radius:var(--border-radius);box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18))}:host i{cursor:pointer}:host .cancel{width:100%;display:flex}[dir=ltr] :host .cancel{justify-content:flex-end}[dir=rtl] :host .cancel{justify-content:flex-start}:host .cancel i{font-size:11px;color:var(--gauzy-text-color-1)}:host [nbButton].appearance-outline.status-basic{background-color:transparent;border-color:#f56d584d;border-width:2px;color:#f56d58}:host [nbButton].appearance-outline.status-basic:hover{border-color:#f56d58}:host [nbButton].appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #f56d580d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host .title{color:var(--text-primary-color);font-size:16px;font-weight:600;line-height:16px;letter-spacing:0em}:host [nbButton].gray.appearance-outline.status-basic{background-color:transparent;border-color:#7e7e8f4d;border-width:2px;color:#7e7e8f}:host [nbButton].gray.appearance-outline.status-basic:hover{border-color:#7e7e8f}:host [nbButton].gray.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #7e7e8f0d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].gray.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic{background-color:transparent;border-color:#25b8694d;border-width:2px;color:#25b869}:host [nbButton].green.appearance-outline.status-basic:hover{border-color:#25b869}:host [nbButton].green.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #25b8690d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].green.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic[disabled],:host [nbButton].green.appearance-outline.status-basic.btn-disabled{background-color:var(--button-outline-basic-disabled-background-color);border-color:var(--button-outline-basic-disabled-border-color);color:var(--button-outline-basic-disabled-text-color);box-shadow:unset}:host [nbButton].primary.appearance-filled.status-primary{color:var(--text-primary-color);border:unset;background-color:var(--color-primary-transparent-default);box-shadow:var(--gauzy-shadow)}[dir=ltr] :host ::ng-deep input,[dir=ltr] :host ::ng-deep textarea{text-align:start}[dir=rtl] :host ::ng-deep input,[dir=rtl] :host ::ng-deep textarea{text-align:end}:host ::ng-deep input,:host ::ng-deep nb-select.appearance-outline.status-basic .select-button,:host ::ng-deep .ng-select .ng-select-container{background-color:var(--gauzy-sidebar-background-4)!important;border:none;min-height:calc(var(--select-medium-text-line-height) + .4375rem * 2)!important}:host ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-placeholder,:host ::ng-deep .ng-select.ng-select-single .ng-select-container .ng-value-container .ng-input{top:unset!important}:host ::ng-deep label,:host ::ng-deep .label{font-size:var(--text-label-font-size);font-weight:600;line-height:.8125rem;letter-spacing:-.01em;color:var(--gauzy-text-color-2)}:host ::ng-deep textarea{background-color:var(--gauzy-sidebar-background-4)!important;border:none}:host ::ng-deep .ng-select .ng-select-container input,:host ::ng-deep nb-tag-list input{background-color:unset!important}:host nb-card{background-color:var(--gauzy-card-1)}:host{--gauzy-table-font-size: .6875rem;--gauzy-table-line-height: 1rem;--gauzy-table-cell-padding-y: .1875rem;--gauzy-table-cell-padding-x: .4375rem;--gauzy-table-header-font-size: .75rem;--gauzy-table-header-line-height: .8125rem;--gauzy-table-header-padding-y: .3125rem;--gauzy-table-header-padding-x: .4375rem;--gauzy-table-filter-padding-y: .1875rem;--gauzy-table-control-height: 1.5rem;--gauzy-table-badge-height: 1rem;--gauzy-table-badge-radius: .25rem;--gauzy-table-badge-padding-y: .1875rem;--gauzy-table-chip-font-size: .625rem;--gauzy-table-chip-line-height: .75rem;--gauzy-table-chip-padding-y: 0;--gauzy-table-chip-padding-x: .3125rem;--gauzy-table-chip-gap: .125rem;--gauzy-table-chip-block-gap: .5rem;--gauzy-people-avatar-size: 1.25rem;--gauzy-people-font-size: .75rem;--gauzy-people-chip-padding-y: .25rem}:host nb-card{border-radius:var(--border-radius);margin-bottom:0}:host nb-card.records{width:645px}:host nb-card.records.inline{width:100%;height:100%}:host nb-card nb-card-body{overflow:unset}:host nb-card nb-card-body ::ng-deep input,:host nb-card nb-card-body ::ng-deep nb-select.appearance-outline.status-basic .select-button,:host nb-card nb-card-body ::ng-deep .ng-select .ng-select-container{background-color:var(--gauzy-sidebar-background-4)!important;border:none;min-height:2rem!important}:host nb-card nb-card-body ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-placeholder,:host nb-card nb-card-body ::ng-deep .ng-select.ng-select-single .ng-select-container .ng-value-container .ng-input{top:unset!important}:host nb-card nb-card-body ::ng-deep label,:host nb-card nb-card-body ::ng-deep .label{font-size:var(--text-label-font-size);font-weight:600;line-height:.8125rem;letter-spacing:-.01em;color:var(--gauzy-text-color-2)}:host nb-card nb-card-body ::ng-deep textarea{background-color:var(--gauzy-sidebar-background-4)!important;border:none}:host nb-card nb-card-body ::ng-deep .ng-select .ng-select-container input,:host nb-card nb-card-body ::ng-deep nb-tag-list input{background-color:unset!important}:host nb-card nb-card-body{background-color:var(--gauzy-card-2);padding:1rem 11px}:host nb-card nb-card-body .table-scroll-container{padding:0;background:var(--gauzy-card-1, var(--background-basic-color-1));box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));border-radius:var(--border-radius, .5rem)}:host nb-card h5{font-weight:600;font-size:18px}:host ::ng-deep angular2-smart-table tr.angular2-smart-titles>th{border-bottom:1px solid var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));vertical-align:middle}:host ::ng-deep angular2-smart-table tbody tr{background:transparent}:host ::ng-deep angular2-smart-table tbody tr>td{vertical-align:middle}:host ::ng-deep angular2-smart-table tbody tr:hover:not(.selected){background:var(--gauzy-hover-tint, rgba(126, 126, 143, .12))!important}:host ::ng-deep angular2-smart-table tbody tr.selected{background:var(--gauzy-active-tint, rgba(126, 126, 143, .2))!important;box-shadow:none!important}:host .pagination-container{display:flex;justify-content:flex-end;flex-wrap:wrap;gap:.5rem;margin-top:.25rem}@media(max-width:767px){:host .pagination-container{justify-content:center}}:host .pagination-container ::ng-deep ngx-pagination{width:auto}:host .pagination-container ::ng-deep ngx-pagination nav{margin-top:0!important;gap:.75rem}:host .pagination-container ::ng-deep ngx-pagination .pagination{gap:.125rem;font-size:.75rem}:host .pagination-container ::ng-deep ngx-pagination li a,:host .pagination-container ::ng-deep ngx-pagination li span{margin:0}:host .pagination-container ::ng-deep ngx-pagination li span{display:flex;align-items:center;justify-content:center;min-width:1.75rem;height:1.75rem;padding:0 .375rem;font-size:.75rem;line-height:1;border-radius:var(--gauzy-radius-sm, .375rem)}:host .pagination-container ::ng-deep ngx-pagination li span.icon{padding:0;background:var(--gauzy-hover-tint, rgba(126, 126, 143, .12));box-shadow:none;border-radius:var(--gauzy-radius-sm, .375rem)}:host .pagination-container ::ng-deep ngx-pagination li span.icon nb-icon{font-size:.875rem}:host .pagination-container ::ng-deep ngx-pagination li:hover span.icon{background:var(--gauzy-active-tint, rgba(126, 126, 143, .2))}:host .pagination-container ::ng-deep ngx-pagination li.disabled{opacity:.4;pointer-events:none}:host .pagination-container ::ng-deep ngx-pagination li.active span{width:auto;min-width:1.75rem;height:1.75rem;padding:0 .375rem!important;border-radius:var(--gauzy-radius-sm, .375rem);line-height:1;background:var(--gauzy-active-tint, rgba(126, 126, 143, .2));color:var(--text-basic-color);font-weight:600}:host .pagination-container ::ng-deep ngx-pagination>nav>div{gap:.5rem;font-size:.75rem;color:var(--gauzy-text-color-2, var(--text-hint-color))}:host .pagination-container ::ng-deep ngx-pagination nb-select .select-button{min-width:4rem;height:1.75rem;padding:0 .5rem;border-radius:var(--gauzy-radius-sm, .375rem);font-size:.75rem}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "directive", type: i2.NbSpinnerDirective, selector: "[nbSpinner]", inputs: ["nbSpinnerMessage", "nbSpinnerStatus", "nbSpinnerSize", "nbSpinner"] }, { kind: "component", type: i2.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i2.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "component", type: i2.NbCardHeaderComponent, selector: "nb-card-header" }, { kind: "component", type: i3.Angular2SmartTableComponent, selector: "angular2-smart-table", inputs: ["source", "settings"], outputs: ["rowSelect", "userRowSelect", "delete", "edit", "create", "custom", "deleteConfirm", "editConfirm", "editCancel", "createConfirm", "createCancel", "rowHover", "afterGridInit"] }, { kind: "component", type: i4.PaginationV2Component, selector: "ngx-pagination", inputs: ["source", "perPageSelect"], outputs: ["changePage"] }, { kind: "directive", type: i5.SmartTableSettlingDirective, selector: "angular2-smart-table" }, { kind: "directive", type: i6.SmartTableFilterToggleDirective, selector: "angular2-smart-table" }, { kind: "pipe", type: i7.TitleCasePipe, name: "titlecase" }] }); }
};
RecordsHistoryComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [TranslateService,
        NbDialogRef])
], RecordsHistoryComponent);
export { RecordsHistoryComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: RecordsHistoryComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-records-history', standalone: false, template: "<nb-card\n  class=\"records\"\n  [class.inline]=\"!isDialog\"\n  [nbSpinner]=\"loading\"\n  nbSpinnerStatus=\"primary\"\n  nbSpinnerSize=\"large\"\n>\n  <nb-card-header>\n    <!-- Rendered only as a dialog: inline (dashboard widget) there is nothing to close. -->\n    @if (isDialog) {\n      <span class=\"cancel\"><i class=\"fas fa-times close\" (click)=\"close()\"></i></span>\n    }\n    <h5 class=\"title\">{{ translatedType | titlecase }}</h5>\n  </nb-card-header>\n  <nb-card-body>\n    <div class=\"table-scroll-container\">\n      <angular2-smart-table\n        [class.ga-table-loading]=\"loading\"\n        style=\"cursor: pointer\"\n        [settings]=\"smartTableSettings\"\n        [source]=\"smartTableSource\"\n      ></angular2-smart-table>\n    </div>\n    <div class=\"pagination-container\">\n      @if (smartTableSource) {\n        <ngx-pagination [source]=\"smartTableSource\"></ngx-pagination>\n      }\n    </div>\n  </nb-card-body>\n</nb-card>\n", styles: ["@charset \"UTF-8\";.action{box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));border:none}.action[nbButton].appearance-filled.status-basic{background-color:var(--gauzy-card-2)}.action.info[nbButton].appearance-filled.status-basic,.action.info-text-1[nbButton].appearance-filled.status-basic{color:var(--gauzy-action-info-text)}.action.secondary{color:var(--text-hint-color)}.action.success{color:var(--gauzy-action-success-text)}.action.warning{color:var(--gauzy-action-warning-text)}.action.orange{color:#ffab2d}.action.primary{color:var(--text-primary-color)}.action.primary.soft[nbButton].appearance-filled.status-basic{background-color:#6e49e81a}.action.select-nb ::ng-deep{box-shadow:none}.action.select-nb ::ng-deep .select-button{box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));background:var(--gauzy-card-2)}button{margin:5px}.actions{background:var(--gauzy-card-2);border-radius:var(--button-rectangle-border-radius);padding:2px 4px!important}.gauzy-button-container{display:flex;justify-content:flex-end;width:100%;padding-bottom:0}.card-custom-header{display:flex;flex-direction:column;width:100%;padding-bottom:0}:host ::ng-deep input{border-radius:var(--border-radius);box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18))}:host i{cursor:pointer}:host .cancel{width:100%;display:flex}[dir=ltr] :host .cancel{justify-content:flex-end}[dir=rtl] :host .cancel{justify-content:flex-start}:host .cancel i{font-size:11px;color:var(--gauzy-text-color-1)}:host [nbButton].appearance-outline.status-basic{background-color:transparent;border-color:#f56d584d;border-width:2px;color:#f56d58}:host [nbButton].appearance-outline.status-basic:hover{border-color:#f56d58}:host [nbButton].appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #f56d580d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host .title{color:var(--text-primary-color);font-size:16px;font-weight:600;line-height:16px;letter-spacing:0em}:host [nbButton].gray.appearance-outline.status-basic{background-color:transparent;border-color:#7e7e8f4d;border-width:2px;color:#7e7e8f}:host [nbButton].gray.appearance-outline.status-basic:hover{border-color:#7e7e8f}:host [nbButton].gray.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #7e7e8f0d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].gray.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic{background-color:transparent;border-color:#25b8694d;border-width:2px;color:#25b869}:host [nbButton].green.appearance-outline.status-basic:hover{border-color:#25b869}:host [nbButton].green.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #25b8690d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].green.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic[disabled],:host [nbButton].green.appearance-outline.status-basic.btn-disabled{background-color:var(--button-outline-basic-disabled-background-color);border-color:var(--button-outline-basic-disabled-border-color);color:var(--button-outline-basic-disabled-text-color);box-shadow:unset}:host [nbButton].primary.appearance-filled.status-primary{color:var(--text-primary-color);border:unset;background-color:var(--color-primary-transparent-default);box-shadow:var(--gauzy-shadow)}[dir=ltr] :host ::ng-deep input,[dir=ltr] :host ::ng-deep textarea{text-align:start}[dir=rtl] :host ::ng-deep input,[dir=rtl] :host ::ng-deep textarea{text-align:end}:host ::ng-deep input,:host ::ng-deep nb-select.appearance-outline.status-basic .select-button,:host ::ng-deep .ng-select .ng-select-container{background-color:var(--gauzy-sidebar-background-4)!important;border:none;min-height:calc(var(--select-medium-text-line-height) + .4375rem * 2)!important}:host ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-placeholder,:host ::ng-deep .ng-select.ng-select-single .ng-select-container .ng-value-container .ng-input{top:unset!important}:host ::ng-deep label,:host ::ng-deep .label{font-size:var(--text-label-font-size);font-weight:600;line-height:.8125rem;letter-spacing:-.01em;color:var(--gauzy-text-color-2)}:host ::ng-deep textarea{background-color:var(--gauzy-sidebar-background-4)!important;border:none}:host ::ng-deep .ng-select .ng-select-container input,:host ::ng-deep nb-tag-list input{background-color:unset!important}:host nb-card{background-color:var(--gauzy-card-1)}:host{--gauzy-table-font-size: .6875rem;--gauzy-table-line-height: 1rem;--gauzy-table-cell-padding-y: .1875rem;--gauzy-table-cell-padding-x: .4375rem;--gauzy-table-header-font-size: .75rem;--gauzy-table-header-line-height: .8125rem;--gauzy-table-header-padding-y: .3125rem;--gauzy-table-header-padding-x: .4375rem;--gauzy-table-filter-padding-y: .1875rem;--gauzy-table-control-height: 1.5rem;--gauzy-table-badge-height: 1rem;--gauzy-table-badge-radius: .25rem;--gauzy-table-badge-padding-y: .1875rem;--gauzy-table-chip-font-size: .625rem;--gauzy-table-chip-line-height: .75rem;--gauzy-table-chip-padding-y: 0;--gauzy-table-chip-padding-x: .3125rem;--gauzy-table-chip-gap: .125rem;--gauzy-table-chip-block-gap: .5rem;--gauzy-people-avatar-size: 1.25rem;--gauzy-people-font-size: .75rem;--gauzy-people-chip-padding-y: .25rem}:host nb-card{border-radius:var(--border-radius);margin-bottom:0}:host nb-card.records{width:645px}:host nb-card.records.inline{width:100%;height:100%}:host nb-card nb-card-body{overflow:unset}:host nb-card nb-card-body ::ng-deep input,:host nb-card nb-card-body ::ng-deep nb-select.appearance-outline.status-basic .select-button,:host nb-card nb-card-body ::ng-deep .ng-select .ng-select-container{background-color:var(--gauzy-sidebar-background-4)!important;border:none;min-height:2rem!important}:host nb-card nb-card-body ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-placeholder,:host nb-card nb-card-body ::ng-deep .ng-select.ng-select-single .ng-select-container .ng-value-container .ng-input{top:unset!important}:host nb-card nb-card-body ::ng-deep label,:host nb-card nb-card-body ::ng-deep .label{font-size:var(--text-label-font-size);font-weight:600;line-height:.8125rem;letter-spacing:-.01em;color:var(--gauzy-text-color-2)}:host nb-card nb-card-body ::ng-deep textarea{background-color:var(--gauzy-sidebar-background-4)!important;border:none}:host nb-card nb-card-body ::ng-deep .ng-select .ng-select-container input,:host nb-card nb-card-body ::ng-deep nb-tag-list input{background-color:unset!important}:host nb-card nb-card-body{background-color:var(--gauzy-card-2);padding:1rem 11px}:host nb-card nb-card-body .table-scroll-container{padding:0;background:var(--gauzy-card-1, var(--background-basic-color-1));box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));border-radius:var(--border-radius, .5rem)}:host nb-card h5{font-weight:600;font-size:18px}:host ::ng-deep angular2-smart-table tr.angular2-smart-titles>th{border-bottom:1px solid var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));vertical-align:middle}:host ::ng-deep angular2-smart-table tbody tr{background:transparent}:host ::ng-deep angular2-smart-table tbody tr>td{vertical-align:middle}:host ::ng-deep angular2-smart-table tbody tr:hover:not(.selected){background:var(--gauzy-hover-tint, rgba(126, 126, 143, .12))!important}:host ::ng-deep angular2-smart-table tbody tr.selected{background:var(--gauzy-active-tint, rgba(126, 126, 143, .2))!important;box-shadow:none!important}:host .pagination-container{display:flex;justify-content:flex-end;flex-wrap:wrap;gap:.5rem;margin-top:.25rem}@media(max-width:767px){:host .pagination-container{justify-content:center}}:host .pagination-container ::ng-deep ngx-pagination{width:auto}:host .pagination-container ::ng-deep ngx-pagination nav{margin-top:0!important;gap:.75rem}:host .pagination-container ::ng-deep ngx-pagination .pagination{gap:.125rem;font-size:.75rem}:host .pagination-container ::ng-deep ngx-pagination li a,:host .pagination-container ::ng-deep ngx-pagination li span{margin:0}:host .pagination-container ::ng-deep ngx-pagination li span{display:flex;align-items:center;justify-content:center;min-width:1.75rem;height:1.75rem;padding:0 .375rem;font-size:.75rem;line-height:1;border-radius:var(--gauzy-radius-sm, .375rem)}:host .pagination-container ::ng-deep ngx-pagination li span.icon{padding:0;background:var(--gauzy-hover-tint, rgba(126, 126, 143, .12));box-shadow:none;border-radius:var(--gauzy-radius-sm, .375rem)}:host .pagination-container ::ng-deep ngx-pagination li span.icon nb-icon{font-size:.875rem}:host .pagination-container ::ng-deep ngx-pagination li:hover span.icon{background:var(--gauzy-active-tint, rgba(126, 126, 143, .2))}:host .pagination-container ::ng-deep ngx-pagination li.disabled{opacity:.4;pointer-events:none}:host .pagination-container ::ng-deep ngx-pagination li.active span{width:auto;min-width:1.75rem;height:1.75rem;padding:0 .375rem!important;border-radius:var(--gauzy-radius-sm, .375rem);line-height:1;background:var(--gauzy-active-tint, rgba(126, 126, 143, .2));color:var(--text-basic-color);font-weight:600}:host .pagination-container ::ng-deep ngx-pagination>nav>div{gap:.5rem;font-size:.75rem;color:var(--gauzy-text-color-2, var(--text-hint-color))}:host .pagination-container ::ng-deep ngx-pagination nb-select .select-button{min-width:4rem;height:1.75rem;padding:0 .5rem;border-radius:var(--gauzy-radius-sm, .375rem);font-size:.75rem}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [{ type: i1.TranslateService }, { type: i2.NbDialogRef, decorators: [{
                    type: Optional
                }] }], propDecorators: { type: [{
                type: Input
            }], records: [{
                type: Input
            }] } });
//# sourceMappingURL=records-history.component.js.map