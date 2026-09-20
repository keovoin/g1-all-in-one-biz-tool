import { OnInit, OnDestroy, TemplateRef, ElementRef } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { LocalDataSource } from 'angular2-smart-table';
import { DiscountTaxTypeEnum, IInvoice } from '@gauzy/contracts';
import { ErrorHandlingService, Store, TranslatableService } from '@gauzy/ui-core/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { CurrencyPositionPipe } from '../../../pipes/currency-position.pipe';
import * as i0 from "@angular/core";
export declare class InvoiceViewInnerComponent extends TranslationBaseComponent implements OnInit, OnDestroy {
    readonly translateService: TranslateService;
    private readonly _store;
    private readonly _translatableService;
    private readonly _currencyPipe;
    private readonly _currencyPipePosition;
    private readonly _errorHandlingService;
    settingsSmartTable: object;
    smartTableSource: LocalDataSource;
    loading: boolean;
    discountTaxTypes: typeof DiscountTaxTypeEnum;
    showInternalNote: boolean;
    invoice: IInvoice;
    isEstimate: boolean;
    buttonsOutlet: TemplateRef<ElementRef>;
    constructor(translateService: TranslateService, _store: Store, _translatableService: TranslatableService, _currencyPipe: CurrencyPipe, _currencyPipePosition: CurrencyPositionPipe, _errorHandlingService: ErrorHandlingService);
    ngOnInit(): void;
    /**
     * Load smart table settings
     */
    private _loadSmartTableSettings;
    /**
     * Apply translation on smart table
     */
    private _applyTranslationOnSmartTable;
    /**
     * Load smart table data
     */
    _loadSmartTableData(): Promise<void>;
    /**
     * Determine name based on invoice type
     *
     * @param item Invoice item
     */
    private getNameBasedOnInvoiceType;
    /**
     * This function transform simple number to currency format.
     *
     * @param value should be the number to transform
     * @param currencyCode should be the currency code of invoice
     * @param position should be the position of currency organization
     * @returns should be a string
     */
    getPipesTransform(value: number, currencyCode: string, position: string): string;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<InvoiceViewInnerComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<InvoiceViewInnerComponent, "ga-invoice-view-inner", never, { "invoice": { "alias": "invoice"; "required": false; }; "isEstimate": { "alias": "isEstimate"; "required": false; }; "buttonsOutlet": { "alias": "buttonsOutlet"; "required": false; }; }, {}, never, never, false, never>;
}
