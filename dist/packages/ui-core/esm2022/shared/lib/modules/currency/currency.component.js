import { __decorate, __metadata } from "tslib";
import { ChangeDetectorRef, Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { filter } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslateService } from '@ngx-translate/core';
import { environment as ENV } from '@gauzy/ui-config';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { CurrencyService, Store } from '@gauzy/ui-core/core';
import { distinctUntilChange, isNotEmpty } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
import * as i2 from "@gauzy/ui-core/core";
import * as i3 from "@angular/forms";
import * as i4 from "@ng-select/ng-select";
import * as i5 from "@angular/common";
let CurrencyComponent = class CurrencyComponent extends TranslationBaseComponent {
    get currency() {
        return this._currency;
    }
    set currency(val) {
        if (isNotEmpty(val)) {
            this._currency = val;
            this.onChange(val);
            this.onTouched();
        }
    }
    get placeholder() {
        return this._placeholder;
    }
    set placeholder(val) {
        if (val) {
            this._placeholder = val;
        }
    }
    get label() {
        return this._label;
    }
    set label(val) {
        this._label = val;
    }
    constructor(translateService, cdr, currencyService, store) {
        super(translateService);
        this.translateService = translateService;
        this.cdr = cdr;
        this.currencyService = currencyService;
        this.store = store;
        this.formControl = new FormControl();
        this.optionChange = new EventEmitter();
        this.loading = true;
        this.currencies$ = this.currencyService.currencies$;
        this._currencies = [];
        this.onChange = () => { };
        this.onTouched = () => { };
        /*
         * Getter & Setter for dynamic label display
         */
        this._label = true;
        this.currencyService.find$.next(true);
    }
    ngOnInit() {
        this.store.selectedOrganization$
            .pipe(distinctUntilChange(), filter((organization) => !!organization), tap((organization) => (this.organization = organization)), tap(({ currency }) => {
            this.currency = currency || ENV.DEFAULT_CURRENCY;
        }), tap(({ currency }) => {
            this.formControl.setValue(currency);
            this.formControl.updateValueAndValidity();
        }), untilDestroyed(this))
            .subscribe();
        this.currencies$
            .pipe(tap((currencies) => (this._currencies = currencies)), tap(() => this.onSelectChange(this.currency)), tap(() => (this.loading = false)), untilDestroyed(this))
            .subscribe();
    }
    ngAfterViewInit() {
        this.cdr.detectChanges();
    }
    onSelectChange(value) {
        if (this._currencies.length > 0) {
            const currency = this._currencies.find((currency) => currency.isoCode === value);
            this.currency = !!currency ? currency.isoCode : null;
            this.onOptionChange(currency);
        }
    }
    onOptionChange($event) {
        this.optionChange.emit($event);
    }
    searchCurrency(term, item) {
        return (item.isoCode.toLowerCase().includes(term.toLowerCase()) ||
            item.currency.toLowerCase().includes(term.toLowerCase()));
    }
    writeValue(value) {
        if (value) {
            this.currency = value;
        }
        this.cdr.detectChanges();
    }
    registerOnChange(fn) {
        this.onChange = fn;
    }
    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CurrencyComponent, deps: [{ token: i1.TranslateService }, { token: i0.ChangeDetectorRef }, { token: i2.CurrencyService }, { token: i2.Store }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: CurrencyComponent, isStandalone: false, selector: "ga-currency", inputs: { formControl: "formControl", currency: "currency", placeholder: "placeholder", label: "label" }, outputs: { optionChange: "optionChange" }, providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => CurrencyComponent),
                multi: true
            }
        ], usesInheritance: true, ngImport: i0, template: "<ng-container>\n  <div class=\"form-group currency-container\">\n    @if (label) {\n      <label class=\"label\" for=\"currencySelect\">\n        {{ placeholder || 'FORM.LABELS.CURRENCY' | translate }}\n      </label>\n    }\n    <ng-select\n      class=\"currency-selector\"\n      #select\n      [items]=\"currencies$ | async\"\n      (clear)=\"select.blur()\"\n      [clearable]=\"false\"\n      (change)=\"onOptionChange($event); select.blur()\"\n      [placeholder]=\"placeholder || 'FORM.PLACEHOLDERS.ALL_CURRENCIES' | translate\"\n      [(ngModel)]=\"currency\"\n      [searchFn]=\"searchCurrency\"\n      [loading]=\"loading\"\n      bindValue=\"isoCode\"\n      appendTo=\"body\"\n      [class]=\"formControl.invalid && formControl.touched ? 'danger' : 'basic'\"\n      >\n      <ng-template ng-option-tmp let-item=\"item\" let-index=\"index\">\n        {{ item?.currency + ' (' + item?.isoCode + ')' }}\n      </ng-template>\n      <ng-template ng-label-tmp let-item=\"item\">\n        {{ item?.currency + ' (' + item?.isoCode + ')' }}\n      </ng-template>\n    </ng-select>\n  </div>\n</ng-container>\n", styles: ["::ng-deep .currency-selector.ng-select-single .ng-select-container .ng-value{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}\n"], dependencies: [{ kind: "directive", type: i3.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i3.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "component", type: i4.NgSelectComponent, selector: "ng-select", inputs: ["ariaLabelDropdown", "ariaLabel", "markFirst", "placeholder", "fixedPlaceholder", "notFoundText", "typeToSearchText", "preventToggleOnRightClick", "addTagText", "loadingText", "clearAllText", "dropdownPosition", "appendTo", "outsideClickEvent", "loading", "closeOnSelect", "hideSelected", "selectOnTab", "openOnEnter", "maxSelectedItems", "groupBy", "groupValue", "bufferAmount", "virtualScroll", "selectableGroup", "tabFocusOnClearButton", "selectableGroupAsModel", "searchFn", "trackByFn", "clearOnBackspace", "labelForId", "inputAttrs", "tabIndex", "readonly", "searchWhileComposing", "minTermLength", "editableSearchTerm", "ngClass", "typeahead", "multiple", "addTag", "searchable", "clearable", "clearKeepsDisabledOptions", "deselectOnClick", "clearSearchOnAdd", "compareWith", "keyDownFn", "bindLabel", "bindValue", "appearance", "isOpen", "items"], outputs: ["bindLabelChange", "bindValueChange", "appearanceChange", "isOpenChange", "itemsChange", "blur", "focus", "change", "open", "close", "search", "clear", "add", "remove", "scroll", "scrollToEnd"], exportAs: ["ngSelect"] }, { kind: "directive", type: i4.NgOptionTemplateDirective, selector: "[ng-option-tmp]" }, { kind: "directive", type: i4.NgLabelTemplateDirective, selector: "[ng-label-tmp]" }, { kind: "pipe", type: i5.AsyncPipe, name: "async" }, { kind: "pipe", type: i1.TranslatePipe, name: "translate" }] }); }
};
CurrencyComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [TranslateService,
        ChangeDetectorRef,
        CurrencyService,
        Store])
], CurrencyComponent);
export { CurrencyComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CurrencyComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-currency', providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => CurrencyComponent),
                            multi: true
                        }
                    ], standalone: false, template: "<ng-container>\n  <div class=\"form-group currency-container\">\n    @if (label) {\n      <label class=\"label\" for=\"currencySelect\">\n        {{ placeholder || 'FORM.LABELS.CURRENCY' | translate }}\n      </label>\n    }\n    <ng-select\n      class=\"currency-selector\"\n      #select\n      [items]=\"currencies$ | async\"\n      (clear)=\"select.blur()\"\n      [clearable]=\"false\"\n      (change)=\"onOptionChange($event); select.blur()\"\n      [placeholder]=\"placeholder || 'FORM.PLACEHOLDERS.ALL_CURRENCIES' | translate\"\n      [(ngModel)]=\"currency\"\n      [searchFn]=\"searchCurrency\"\n      [loading]=\"loading\"\n      bindValue=\"isoCode\"\n      appendTo=\"body\"\n      [class]=\"formControl.invalid && formControl.touched ? 'danger' : 'basic'\"\n      >\n      <ng-template ng-option-tmp let-item=\"item\" let-index=\"index\">\n        {{ item?.currency + ' (' + item?.isoCode + ')' }}\n      </ng-template>\n      <ng-template ng-label-tmp let-item=\"item\">\n        {{ item?.currency + ' (' + item?.isoCode + ')' }}\n      </ng-template>\n    </ng-select>\n  </div>\n</ng-container>\n", styles: ["::ng-deep .currency-selector.ng-select-single .ng-select-container .ng-value{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}\n"] }]
        }], ctorParameters: () => [{ type: i1.TranslateService }, { type: i0.ChangeDetectorRef }, { type: i2.CurrencyService }, { type: i2.Store }], propDecorators: { formControl: [{
                type: Input
            }], optionChange: [{
                type: Output
            }], currency: [{
                type: Input
            }], placeholder: [{
                type: Input
            }], label: [{
                type: Input
            }] } });
//# sourceMappingURL=currency.component.js.map