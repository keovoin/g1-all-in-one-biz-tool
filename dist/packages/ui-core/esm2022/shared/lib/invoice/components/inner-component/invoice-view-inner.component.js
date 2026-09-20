import { __decorate, __metadata } from "tslib";
import { Component, Input, TemplateRef } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { tap } from 'rxjs/operators';
import { LocalDataSource } from 'angular2-smart-table';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { DiscountTaxTypeEnum, InvoiceTypeEnum } from '@gauzy/contracts';
import { ErrorHandlingService, Store, TranslatableService } from '@gauzy/ui-core/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { CurrencyPositionPipe } from '../../../pipes/currency-position.pipe';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
import * as i2 from "@gauzy/ui-core/core";
import * as i3 from "@angular/common";
import * as i4 from "../../../pipes/currency-position.pipe";
import * as i5 from "@nebular/theme";
import * as i6 from "angular2-smart-table";
import * as i7 from "../../../pipes/date-format.pipe";
let InvoiceViewInnerComponent = class InvoiceViewInnerComponent extends TranslationBaseComponent {
    constructor(translateService, _store, _translatableService, _currencyPipe, _currencyPipePosition, _errorHandlingService) {
        super(translateService);
        this.translateService = translateService;
        this._store = _store;
        this._translatableService = _translatableService;
        this._currencyPipe = _currencyPipe;
        this._currencyPipePosition = _currencyPipePosition;
        this._errorHandlingService = _errorHandlingService;
        this.smartTableSource = new LocalDataSource();
        this.loading = true;
        this.discountTaxTypes = DiscountTaxTypeEnum;
        this.showInternalNote = !!this._store.user?.tenantId;
        this.isEstimate = false;
    }
    ngOnInit() {
        this._applyTranslationOnSmartTable();
        this._loadSmartTableSettings();
        this._loadSmartTableData();
    }
    /**
     * Load smart table settings
     */
    _loadSmartTableSettings() {
        this.settingsSmartTable = {
            hideSubHeader: true,
            selectedRowIndex: -1,
            actions: false,
            pager: {
                display: false
            },
            columns: {
                name: {
                    title: this.getTranslation('INVOICES_PAGE.ITEM'),
                    type: 'text',
                    isFilterable: false
                },
                description: {
                    title: this.getTranslation('INVOICES_PAGE.INVOICE_ITEM.DESCRIPTION'),
                    type: 'text',
                    isFilterable: false
                },
                quantity: {
                    title: this.getTranslation('INVOICES_PAGE.INVOICE_ITEM.QUANTITY'),
                    type: 'text',
                    isFilterable: false
                },
                price: {
                    title: this.getTranslation('INVOICES_PAGE.INVOICE_ITEM.PRICE'),
                    type: 'text',
                    isFilterable: false,
                    valuePrepareFunction: (value, cell) => {
                        // Get row data
                        const row = cell.getRow().getData();
                        // Get price transformed
                        return this.getPipesTransform(row.price * row.quantity, row.currency, this.invoice.fromOrganization.currencyPosition);
                    }
                },
                totalValue: {
                    title: this.getTranslation('INVOICES_PAGE.INVOICE_ITEM.TOTAL_VALUE'),
                    type: 'text',
                    isFilterable: false,
                    valuePrepareFunction: (value, cell) => {
                        // Get row data
                        const row = cell.getRow().getData();
                        // Get price transformed
                        return this.getPipesTransform(row.price * row.quantity, row.currency, this.invoice.fromOrganization.currencyPosition);
                    }
                }
            }
        };
    }
    /**
     * Apply translation on smart table
     */
    _applyTranslationOnSmartTable() {
        this.translateService.onLangChange
            .pipe(tap(() => this._loadSmartTableSettings()), untilDestroyed(this))
            .subscribe();
    }
    /**
     * Load smart table data
     */
    async _loadSmartTableData() {
        this.loading = true;
        try {
            // Map invoice items to smart table data
            const data = this.invoice.invoiceItems?.map((item) => {
                // Default inclusion
                const row = {
                    description: item.description,
                    quantity: item.quantity,
                    price: item.price,
                    totalValue: +item.totalValue,
                    currency: this.invoice.currency,
                    id: item.id // Default inclusion
                };
                // Add name based on invoice type
                row['name'] = this.getNameBasedOnInvoiceType(item);
                return row;
            });
            this.smartTableSource.load(data);
        }
        catch (error) {
            console.log('Error while loading smart table data', error);
            this._errorHandlingService.handleError(error);
        }
        finally {
            // Set loading to false
            this.loading = false;
        }
    }
    /**
     * Determine name based on invoice type
     *
     * @param item Invoice item
     */
    getNameBasedOnInvoiceType(item) {
        // Return empty string if item is null
        if (!item) {
            return '';
        }
        switch (this.invoice.invoiceType) {
            case InvoiceTypeEnum.BY_EMPLOYEE_HOURS:
                return item.employeeId ? `${item.employee?.fullName}` : '';
            case InvoiceTypeEnum.BY_PROJECT_HOURS:
                return item.projectId ? item.project?.name : '';
            case InvoiceTypeEnum.BY_TASK_HOURS:
                return item.taskId ? item.task?.title : '';
            case InvoiceTypeEnum.BY_PRODUCTS:
                return item.productId ? this._translatableService.getTranslatedProperty(item.product, 'name') : '';
            case InvoiceTypeEnum.BY_EXPENSES:
                return item.expenseId ? item.expense?.purpose : '';
            default:
                delete this.settingsSmartTable['columns']['name'];
                return ''; // Default case for name
        }
    }
    /**
     * This function transform simple number to currency format.
     *
     * @param value should be the number to transform
     * @param currencyCode should be the currency code of invoice
     * @param position should be the position of currency organization
     * @returns should be a string
     */
    getPipesTransform(value, currencyCode, position) {
        const transform = this._currencyPipe.transform(value, currencyCode);
        return this._currencyPipePosition.transform(transform, position);
    }
    ngOnDestroy() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: InvoiceViewInnerComponent, deps: [{ token: i1.TranslateService }, { token: i2.Store }, { token: i2.TranslatableService }, { token: i3.CurrencyPipe }, { token: i4.CurrencyPositionPipe }, { token: i2.ErrorHandlingService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: InvoiceViewInnerComponent, isStandalone: false, selector: "ga-invoice-view-inner", inputs: { invoice: "invoice", isEstimate: "isEstimate", buttonsOutlet: "buttonsOutlet" }, providers: [TranslatableService, CurrencyPipe, CurrencyPositionPipe], usesInheritance: true, ngImport: i0, template: "@if (invoice) {\n  <nb-card-body [nbSpinner]=\"loading\" nbSpinnerStatus=\"primary\" nbSpinnerSize=\"large\">\n    <div class=\"py-1\">\n      <div class=\"d-flex justify-content-between\">\n        <div class=\"mb-5 w-100\">\n          <div class=\"d-flex justify-content-between\">\n            <div class=\"mb-5 font-weight-bold\">\n              <h4 class=\"d-inline mr-2\">\n                {{\n                (!isEstimate ? 'INVOICES_PAGE.INVOICE_NUMBER' : 'INVOICES_PAGE.ESTIMATE_NUMBER')\n                | translate\n                }}\n              </h4>\n              <h4 class=\"d-inline\">{{ invoice?.invoiceNumber }}</h4>\n            </div>\n            <div>\n              <ng-container>\n                <ng-template [ngTemplateOutlet]=\"buttonsOutlet\"></ng-template>\n              </ng-container>\n            </div>\n          </div>\n          <div class=\"d-flex justify-content-between w-100\">\n            <div>\n              <div class=\"d-flex\">\n                <div>\n                  <div class=\"font-weight-bold\">\n                    {{\n                    (!isEstimate ? 'INVOICES_PAGE.INVOICE_DATE' : 'INVOICES_PAGE.ESTIMATE_DATE')\n                    | translate\n                    }}:\n                  </div>\n                  <div class=\"font-weight-bold text-left\">\n                    {{ 'INVOICES_PAGE.DUE_DATE' | translate }}:\n                  </div>\n                </div>\n                <!-- `dueDate` is optional and `dateFormat` yields undefined for an unset\n                     date, so these labels used to stand over blanks. -->\n                <div class=\"ml-3 mr-3\">\n                  <div>{{ (invoice?.invoiceDate | dateFormat) || '\u2014' }}</div>\n                  <div>{{ (invoice?.dueDate | dateFormat) || '\u2014' }}</div>\n                </div>\n              </div>\n            </div>\n            <div class=\"d-flex\">\n              <div>\n                <div class=\"font-weight-bold text-left\">\n                  {{ 'INVOICES_PAGE.VIEW.FROM' | translate | titlecase }}:\n                </div>\n                <div>{{ invoice?.fromOrganization?.name || '\u2014' }}</div>\n              </div>\n              <div class=\"ml-3\">\n                <div class=\"font-weight-bold text-left\">\n                  {{ 'INVOICES_PAGE.VIEW.TO' | translate | titlecase }}:\n                </div>\n                <!-- A draft invoice can have no contact yet; the label used to sit over a blank. -->\n                <div>{{ invoice?.toContact?.name || '\u2014' }}</div>\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>\n      <div class=\"table-scroll-container table\">\n        <angular2-smart-table\n          [class.ga-table-loading]=\"loading\"\n          [settings]=\"settingsSmartTable\"\n          [source]=\"smartTableSource\"\n          style=\"cursor: pointer\"\n        ></angular2-smart-table>\n      </div>\n      <div class=\"d-flex justify-content-between\">\n        <div class=\"d-flex w-50 mt-3\">\n          <div class=\"d-flex flex-column text-left font-weight-bold mr-5\">\n            <div class=\"mt-2\">{{ 'INVOICES_PAGE.TAX' | translate }}:</div>\n            <div class=\"mt-2\">{{ 'INVOICES_PAGE.TAX_2' | translate }}:</div>\n            <div class=\"mt-2\">{{ 'INVOICES_PAGE.INVOICES_SELECT_DISCOUNT_VALUE' | translate }}:</div>\n            <div class=\"mt-2\">{{ 'INVOICES_PAGE.TOTAL_VALUE' | translate }}:</div>\n            @if (invoice.hasRemainingAmountInvoiced) {\n              <div class=\"mt-2\">{{ 'INVOICES_PAGE.ALREADY_PAID' | translate }}:</div>\n              <div class=\"mt-2\">{{ 'INVOICES_PAGE.AMOUNT_DUE' | translate }}:</div>\n            }\n          </div>\n          <div class=\"d-flex flex-column mr-5 text-left\">\n            <div class=\"mt-2\">\n              @if (invoice.taxType === discountTaxTypes.FLAT_VALUE) {\n                <span>\n                  {{\n                  invoice?.tax || 0\n                  | currency : invoice?.currency\n                  | position : invoice?.fromOrganization.currencyPosition\n                  }}\n                </span>\n              }\n              @if (invoice.taxType === discountTaxTypes.PERCENT) {\n                <span>\n                  {{ invoice?.tax || 0 }}%\n                </span>\n              }\n            </div>\n            <!-- The second tax row was keyed off `taxType`, so a percentage Tax 2 on\n                 a flat-value Tax 1 was rendered as a currency amount. -->\n            <div class=\"mt-2\">\n              @if (invoice.tax2Type === discountTaxTypes.FLAT_VALUE) {\n                <span>\n                  {{\n                  invoice?.tax2 || 0\n                  | currency : invoice?.currency\n                  | position : invoice?.fromOrganization.currencyPosition\n                  }}\n                </span>\n              }\n              @if (invoice.tax2Type === discountTaxTypes.PERCENT) {\n                <span>\n                  {{ invoice?.tax2 || 0 }}%\n                </span>\n              }\n            </div>\n            <div class=\"mt-2\">\n              @if (invoice.discountType === discountTaxTypes.FLAT_VALUE) {\n                <span>\n                  {{\n                  invoice.discountValue || 0\n                  | currency : invoice?.currency\n                  | position : invoice?.fromOrganization.currencyPosition\n                  }}\n                </span>\n              }\n              @if (invoice.discountType === discountTaxTypes.PERCENT) {\n                <!-- The `%` was on its own line, which renders as \"12 %\"; the tax rows\n                     above it read \"12%\". Same figure, one spelling. -->\n                <span>{{ invoice?.discountValue || 0 }}%</span>\n              }\n            </div>\n            <div class=\"mt-2\">\n              <span>\n                {{\n                invoice?.totalValue || 0\n                | currency : invoice?.currency\n                | position : invoice?.fromOrganization?.currencyPosition\n                }}\n              </span>\n            </div>\n            <!-- Show remaining amount invoiced -->\n            @if (invoice.hasRemainingAmountInvoiced) {\n              <div class=\"mt-2\">\n                <span>\n                  {{\n                  invoice?.alreadyPaid || 0\n                  | currency : invoice?.currency\n                  | position : invoice?.fromOrganization?.currencyPosition\n                  }}\n                </span>\n              </div>\n              <div class=\"mt-2\">\n                <span>\n                  {{\n                  invoice?.amountDue || 0\n                  | currency : invoice?.currency\n                  | position : invoice?.fromOrganization?.currencyPosition\n                  }}\n                </span>\n              </div>\n            }\n          </div>\n        </div>\n        <!-- Show Internal Note -->\n        @if (invoice.internalNote) {\n          @if (showInternalNote) {\n            <div class=\"mt-3 w-50\">\n              <h5 class=\"font-weight-bold\">{{ 'INVOICES_PAGE.INTERNAL_NOTE.INTERNAL_NOTE' | translate }}:</h5>\n              {{ invoice.internalNote }}\n            </div>\n          }\n        }\n      </div>\n    </div>\n  </nb-card-body>\n} @else {\n  <!-- Content to display if the invoice does not exist -->\n  <div class=\"no-invoice-description\"></div>\n}\n\n", styles: [".table{margin-top:20px;padding:10px;background-color:var(--gauzy-card-2);max-height:17.5rem}:host{display:block;padding:25px clamp(1rem,6vw,100px) 0}:host{--gauzy-table-font-size: .6875rem;--gauzy-table-line-height: 1rem;--gauzy-table-cell-padding-y: .1875rem;--gauzy-table-cell-padding-x: .4375rem;--gauzy-table-header-font-size: .75rem;--gauzy-table-header-line-height: .8125rem;--gauzy-table-header-padding-y: .3125rem;--gauzy-table-header-padding-x: .4375rem;--gauzy-table-filter-padding-y: .1875rem;--gauzy-table-control-height: 1.5rem;--gauzy-table-badge-height: 1rem;--gauzy-table-badge-radius: .25rem;--gauzy-table-badge-padding-y: .1875rem;--gauzy-table-chip-font-size: .625rem;--gauzy-table-chip-line-height: .75rem;--gauzy-table-chip-padding-y: 0;--gauzy-table-chip-padding-x: .3125rem;--gauzy-table-chip-gap: .125rem;--gauzy-table-chip-block-gap: .5rem;--gauzy-people-avatar-size: 1.25rem;--gauzy-people-font-size: .75rem;--gauzy-people-chip-padding-y: .25rem}:host ::ng-deep angular2-smart-table tr.angular2-smart-titles>th{border-bottom:1px solid var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));vertical-align:middle}:host ::ng-deep angular2-smart-table tbody tr{background:transparent}:host ::ng-deep angular2-smart-table tbody tr>td{vertical-align:middle}:host ::ng-deep angular2-smart-table tbody tr:hover:not(.selected){background:var(--gauzy-hover-tint, rgba(126, 126, 143, .12))!important}:host ::ng-deep angular2-smart-table tbody tr.selected{background:var(--gauzy-active-tint, rgba(126, 126, 143, .2))!important;box-shadow:none!important}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "component", type: i5.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "component", type: i6.Angular2SmartTableComponent, selector: "angular2-smart-table", inputs: ["source", "settings"], outputs: ["rowSelect", "userRowSelect", "delete", "edit", "create", "custom", "deleteConfirm", "editConfirm", "editCancel", "createConfirm", "createCancel", "rowHover", "afterGridInit"] }, { kind: "directive", type: i3.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "pipe", type: i1.TranslatePipe, name: "translate" }, { kind: "pipe", type: i3.TitleCasePipe, name: "titlecase" }, { kind: "pipe", type: i3.CurrencyPipe, name: "currency" }, { kind: "pipe", type: i4.CurrencyPositionPipe, name: "position" }, { kind: "pipe", type: i7.DateFormatPipe, name: "dateFormat" }] }); }
};
InvoiceViewInnerComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [TranslateService,
        Store,
        TranslatableService,
        CurrencyPipe,
        CurrencyPositionPipe,
        ErrorHandlingService])
], InvoiceViewInnerComponent);
export { InvoiceViewInnerComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: InvoiceViewInnerComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-invoice-view-inner', providers: [TranslatableService, CurrencyPipe, CurrencyPositionPipe], standalone: false, template: "@if (invoice) {\n  <nb-card-body [nbSpinner]=\"loading\" nbSpinnerStatus=\"primary\" nbSpinnerSize=\"large\">\n    <div class=\"py-1\">\n      <div class=\"d-flex justify-content-between\">\n        <div class=\"mb-5 w-100\">\n          <div class=\"d-flex justify-content-between\">\n            <div class=\"mb-5 font-weight-bold\">\n              <h4 class=\"d-inline mr-2\">\n                {{\n                (!isEstimate ? 'INVOICES_PAGE.INVOICE_NUMBER' : 'INVOICES_PAGE.ESTIMATE_NUMBER')\n                | translate\n                }}\n              </h4>\n              <h4 class=\"d-inline\">{{ invoice?.invoiceNumber }}</h4>\n            </div>\n            <div>\n              <ng-container>\n                <ng-template [ngTemplateOutlet]=\"buttonsOutlet\"></ng-template>\n              </ng-container>\n            </div>\n          </div>\n          <div class=\"d-flex justify-content-between w-100\">\n            <div>\n              <div class=\"d-flex\">\n                <div>\n                  <div class=\"font-weight-bold\">\n                    {{\n                    (!isEstimate ? 'INVOICES_PAGE.INVOICE_DATE' : 'INVOICES_PAGE.ESTIMATE_DATE')\n                    | translate\n                    }}:\n                  </div>\n                  <div class=\"font-weight-bold text-left\">\n                    {{ 'INVOICES_PAGE.DUE_DATE' | translate }}:\n                  </div>\n                </div>\n                <!-- `dueDate` is optional and `dateFormat` yields undefined for an unset\n                     date, so these labels used to stand over blanks. -->\n                <div class=\"ml-3 mr-3\">\n                  <div>{{ (invoice?.invoiceDate | dateFormat) || '\u2014' }}</div>\n                  <div>{{ (invoice?.dueDate | dateFormat) || '\u2014' }}</div>\n                </div>\n              </div>\n            </div>\n            <div class=\"d-flex\">\n              <div>\n                <div class=\"font-weight-bold text-left\">\n                  {{ 'INVOICES_PAGE.VIEW.FROM' | translate | titlecase }}:\n                </div>\n                <div>{{ invoice?.fromOrganization?.name || '\u2014' }}</div>\n              </div>\n              <div class=\"ml-3\">\n                <div class=\"font-weight-bold text-left\">\n                  {{ 'INVOICES_PAGE.VIEW.TO' | translate | titlecase }}:\n                </div>\n                <!-- A draft invoice can have no contact yet; the label used to sit over a blank. -->\n                <div>{{ invoice?.toContact?.name || '\u2014' }}</div>\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>\n      <div class=\"table-scroll-container table\">\n        <angular2-smart-table\n          [class.ga-table-loading]=\"loading\"\n          [settings]=\"settingsSmartTable\"\n          [source]=\"smartTableSource\"\n          style=\"cursor: pointer\"\n        ></angular2-smart-table>\n      </div>\n      <div class=\"d-flex justify-content-between\">\n        <div class=\"d-flex w-50 mt-3\">\n          <div class=\"d-flex flex-column text-left font-weight-bold mr-5\">\n            <div class=\"mt-2\">{{ 'INVOICES_PAGE.TAX' | translate }}:</div>\n            <div class=\"mt-2\">{{ 'INVOICES_PAGE.TAX_2' | translate }}:</div>\n            <div class=\"mt-2\">{{ 'INVOICES_PAGE.INVOICES_SELECT_DISCOUNT_VALUE' | translate }}:</div>\n            <div class=\"mt-2\">{{ 'INVOICES_PAGE.TOTAL_VALUE' | translate }}:</div>\n            @if (invoice.hasRemainingAmountInvoiced) {\n              <div class=\"mt-2\">{{ 'INVOICES_PAGE.ALREADY_PAID' | translate }}:</div>\n              <div class=\"mt-2\">{{ 'INVOICES_PAGE.AMOUNT_DUE' | translate }}:</div>\n            }\n          </div>\n          <div class=\"d-flex flex-column mr-5 text-left\">\n            <div class=\"mt-2\">\n              @if (invoice.taxType === discountTaxTypes.FLAT_VALUE) {\n                <span>\n                  {{\n                  invoice?.tax || 0\n                  | currency : invoice?.currency\n                  | position : invoice?.fromOrganization.currencyPosition\n                  }}\n                </span>\n              }\n              @if (invoice.taxType === discountTaxTypes.PERCENT) {\n                <span>\n                  {{ invoice?.tax || 0 }}%\n                </span>\n              }\n            </div>\n            <!-- The second tax row was keyed off `taxType`, so a percentage Tax 2 on\n                 a flat-value Tax 1 was rendered as a currency amount. -->\n            <div class=\"mt-2\">\n              @if (invoice.tax2Type === discountTaxTypes.FLAT_VALUE) {\n                <span>\n                  {{\n                  invoice?.tax2 || 0\n                  | currency : invoice?.currency\n                  | position : invoice?.fromOrganization.currencyPosition\n                  }}\n                </span>\n              }\n              @if (invoice.tax2Type === discountTaxTypes.PERCENT) {\n                <span>\n                  {{ invoice?.tax2 || 0 }}%\n                </span>\n              }\n            </div>\n            <div class=\"mt-2\">\n              @if (invoice.discountType === discountTaxTypes.FLAT_VALUE) {\n                <span>\n                  {{\n                  invoice.discountValue || 0\n                  | currency : invoice?.currency\n                  | position : invoice?.fromOrganization.currencyPosition\n                  }}\n                </span>\n              }\n              @if (invoice.discountType === discountTaxTypes.PERCENT) {\n                <!-- The `%` was on its own line, which renders as \"12 %\"; the tax rows\n                     above it read \"12%\". Same figure, one spelling. -->\n                <span>{{ invoice?.discountValue || 0 }}%</span>\n              }\n            </div>\n            <div class=\"mt-2\">\n              <span>\n                {{\n                invoice?.totalValue || 0\n                | currency : invoice?.currency\n                | position : invoice?.fromOrganization?.currencyPosition\n                }}\n              </span>\n            </div>\n            <!-- Show remaining amount invoiced -->\n            @if (invoice.hasRemainingAmountInvoiced) {\n              <div class=\"mt-2\">\n                <span>\n                  {{\n                  invoice?.alreadyPaid || 0\n                  | currency : invoice?.currency\n                  | position : invoice?.fromOrganization?.currencyPosition\n                  }}\n                </span>\n              </div>\n              <div class=\"mt-2\">\n                <span>\n                  {{\n                  invoice?.amountDue || 0\n                  | currency : invoice?.currency\n                  | position : invoice?.fromOrganization?.currencyPosition\n                  }}\n                </span>\n              </div>\n            }\n          </div>\n        </div>\n        <!-- Show Internal Note -->\n        @if (invoice.internalNote) {\n          @if (showInternalNote) {\n            <div class=\"mt-3 w-50\">\n              <h5 class=\"font-weight-bold\">{{ 'INVOICES_PAGE.INTERNAL_NOTE.INTERNAL_NOTE' | translate }}:</h5>\n              {{ invoice.internalNote }}\n            </div>\n          }\n        }\n      </div>\n    </div>\n  </nb-card-body>\n} @else {\n  <!-- Content to display if the invoice does not exist -->\n  <div class=\"no-invoice-description\"></div>\n}\n\n", styles: [".table{margin-top:20px;padding:10px;background-color:var(--gauzy-card-2);max-height:17.5rem}:host{display:block;padding:25px clamp(1rem,6vw,100px) 0}:host{--gauzy-table-font-size: .6875rem;--gauzy-table-line-height: 1rem;--gauzy-table-cell-padding-y: .1875rem;--gauzy-table-cell-padding-x: .4375rem;--gauzy-table-header-font-size: .75rem;--gauzy-table-header-line-height: .8125rem;--gauzy-table-header-padding-y: .3125rem;--gauzy-table-header-padding-x: .4375rem;--gauzy-table-filter-padding-y: .1875rem;--gauzy-table-control-height: 1.5rem;--gauzy-table-badge-height: 1rem;--gauzy-table-badge-radius: .25rem;--gauzy-table-badge-padding-y: .1875rem;--gauzy-table-chip-font-size: .625rem;--gauzy-table-chip-line-height: .75rem;--gauzy-table-chip-padding-y: 0;--gauzy-table-chip-padding-x: .3125rem;--gauzy-table-chip-gap: .125rem;--gauzy-table-chip-block-gap: .5rem;--gauzy-people-avatar-size: 1.25rem;--gauzy-people-font-size: .75rem;--gauzy-people-chip-padding-y: .25rem}:host ::ng-deep angular2-smart-table tr.angular2-smart-titles>th{border-bottom:1px solid var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));vertical-align:middle}:host ::ng-deep angular2-smart-table tbody tr{background:transparent}:host ::ng-deep angular2-smart-table tbody tr>td{vertical-align:middle}:host ::ng-deep angular2-smart-table tbody tr:hover:not(.selected){background:var(--gauzy-hover-tint, rgba(126, 126, 143, .12))!important}:host ::ng-deep angular2-smart-table tbody tr.selected{background:var(--gauzy-active-tint, rgba(126, 126, 143, .2))!important;box-shadow:none!important}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [{ type: i1.TranslateService }, { type: i2.Store }, { type: i2.TranslatableService }, { type: i3.CurrencyPipe }, { type: i4.CurrencyPositionPipe }, { type: i2.ErrorHandlingService }], propDecorators: { invoice: [{
                type: Input
            }], isEstimate: [{
                type: Input
            }], buttonsOutlet: [{
                type: Input
            }] } });
//# sourceMappingURL=invoice-view-inner.component.js.map