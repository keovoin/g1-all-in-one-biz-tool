import { __decorate, __metadata } from "tslib";
import { ChangeDetectorRef, Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment as ENV } from '@gauzy/ui-config';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { CountryService, Store } from '@gauzy/ui-core/core';
import { distinctUntilChange } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
import * as i1 from "@gauzy/ui-core/core";
import * as i2 from "@ngx-translate/core";
import * as i3 from "@angular/forms";
import * as i4 from "@ng-select/ng-select";
import * as i5 from "@angular/common";
let CountryComponent = class CountryComponent extends TranslationBaseComponent {
    get country() {
        return this._country;
    }
    set country(val) {
        if (val) {
            this._country = val;
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
    constructor(countryService, translateService, cdr, store) {
        super(translateService);
        this.countryService = countryService;
        this.translateService = translateService;
        this.cdr = cdr;
        this.store = store;
        this.formControl = new FormControl();
        this.optionChange = new EventEmitter();
        this.loading = true;
        this.countries$ = this.countryService.countries$;
        this._countries = [];
        this.onChange = () => { };
        this.onTouched = () => { };
        this.countryService.find$.next(true);
    }
    ngOnInit() {
        this.store.selectedOrganization$
            .pipe(distinctUntilChange(), filter((organization) => !!organization), tap((organization) => (this.organization = organization)), tap(({ contact }) => {
            this.country = contact ? contact.country : ENV.DEFAULT_COUNTRY;
            this.formControl.updateValueAndValidity();
        }), untilDestroyed(this))
            .subscribe();
        this.countries$
            .pipe(tap((countries) => (this._countries = countries)), tap(() => this.onSelectChange(this.country)), tap(() => (this.loading = false)), untilDestroyed(this))
            .subscribe();
    }
    ngAfterViewInit() {
        this.cdr.detectChanges();
    }
    onSelectChange(value) {
        if (value && this._countries.length > 0) {
            const country = this._countries.find((country) => country.isoCode === value);
            this.country = country.isoCode;
            this.onOptionChange(country);
        }
    }
    onOptionChange($event) {
        this.optionChange.emit($event);
    }
    writeValue(value) {
        if (value) {
            this.country = value;
        }
        this.cdr.detectChanges();
    }
    registerOnChange(fn) {
        this.onChange = fn;
    }
    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    searchCountry(term, item) {
        return (item.isoCode.toLowerCase().includes(term.toLowerCase()) ||
            item.country.toLowerCase().includes(term.toLowerCase()));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CountryComponent, deps: [{ token: i1.CountryService }, { token: i2.TranslateService }, { token: i0.ChangeDetectorRef }, { token: i1.Store }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: CountryComponent, isStandalone: false, selector: "ga-country", inputs: { formControl: "formControl", country: "country", placeholder: "placeholder" }, outputs: { optionChange: "optionChange" }, providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => CountryComponent),
                multi: true
            }
        ], usesInheritance: true, ngImport: i0, template: "<ng-container>\n\t<div class=\"form-group\">\n\t\t<label class=\"label\" for=\"countrySelect\">\n\t\t\t{{ placeholder || 'FORM.LABELS.COUNTRY' | translate }}\n\t\t</label>\n\t\t<ng-select\n\t\t\t#select\n\t\t\tclass=\"form-field-select\"\n\t\t\t[items]=\"countries$ | async\"\n\t\t\t(clear)=\"select.blur()\"\n\t\t\t[clearable]=\"false\"\n\t\t\t(change)=\"onOptionChange($event); select.blur()\"\n\t\t\t[placeholder]=\"placeholder || 'FORM.PLACEHOLDERS.COUNTRY' | translate\"\n\t\t\t[(ngModel)]=\"country\"\n\t\t\t[searchFn]=\"searchCountry\"\n\t\t\tbindValue=\"isoCode\"\n\t\t\tappendTo=\"body\"\n\t\t\t[class]=\"formControl.invalid && formControl.touched ? 'danger' : 'basic'\"\n\t\t>\n\t\t\t<ng-template ng-option-tmp let-item=\"item\" let-index=\"index\">\n\t\t\t\t{{ item?.country }}\n\t\t\t</ng-template>\n\t\t\t<ng-template ng-label-tmp let-item=\"item\">\n\t\t\t\t{{ item?.country }}\n\t\t\t</ng-template>\n\t\t</ng-select>\n\t</div>\n</ng-container>\n", styles: [":host{display:block}:host ::ng-deep .ng-select.ng-select-searchable .ng-select-container .ng-value-container .ng-input>input{background:none transparent!important}\n"], dependencies: [{ kind: "directive", type: i3.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i3.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "component", type: i4.NgSelectComponent, selector: "ng-select", inputs: ["ariaLabelDropdown", "ariaLabel", "markFirst", "placeholder", "fixedPlaceholder", "notFoundText", "typeToSearchText", "preventToggleOnRightClick", "addTagText", "loadingText", "clearAllText", "dropdownPosition", "appendTo", "outsideClickEvent", "loading", "closeOnSelect", "hideSelected", "selectOnTab", "openOnEnter", "maxSelectedItems", "groupBy", "groupValue", "bufferAmount", "virtualScroll", "selectableGroup", "tabFocusOnClearButton", "selectableGroupAsModel", "searchFn", "trackByFn", "clearOnBackspace", "labelForId", "inputAttrs", "tabIndex", "readonly", "searchWhileComposing", "minTermLength", "editableSearchTerm", "ngClass", "typeahead", "multiple", "addTag", "searchable", "clearable", "clearKeepsDisabledOptions", "deselectOnClick", "clearSearchOnAdd", "compareWith", "keyDownFn", "bindLabel", "bindValue", "appearance", "isOpen", "items"], outputs: ["bindLabelChange", "bindValueChange", "appearanceChange", "isOpenChange", "itemsChange", "blur", "focus", "change", "open", "close", "search", "clear", "add", "remove", "scroll", "scrollToEnd"], exportAs: ["ngSelect"] }, { kind: "directive", type: i4.NgOptionTemplateDirective, selector: "[ng-option-tmp]" }, { kind: "directive", type: i4.NgLabelTemplateDirective, selector: "[ng-label-tmp]" }, { kind: "pipe", type: i5.AsyncPipe, name: "async" }, { kind: "pipe", type: i2.TranslatePipe, name: "translate" }] }); }
};
CountryComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [CountryService,
        TranslateService,
        ChangeDetectorRef,
        Store])
], CountryComponent);
export { CountryComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CountryComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-country', providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => CountryComponent),
                            multi: true
                        }
                    ], standalone: false, template: "<ng-container>\n\t<div class=\"form-group\">\n\t\t<label class=\"label\" for=\"countrySelect\">\n\t\t\t{{ placeholder || 'FORM.LABELS.COUNTRY' | translate }}\n\t\t</label>\n\t\t<ng-select\n\t\t\t#select\n\t\t\tclass=\"form-field-select\"\n\t\t\t[items]=\"countries$ | async\"\n\t\t\t(clear)=\"select.blur()\"\n\t\t\t[clearable]=\"false\"\n\t\t\t(change)=\"onOptionChange($event); select.blur()\"\n\t\t\t[placeholder]=\"placeholder || 'FORM.PLACEHOLDERS.COUNTRY' | translate\"\n\t\t\t[(ngModel)]=\"country\"\n\t\t\t[searchFn]=\"searchCountry\"\n\t\t\tbindValue=\"isoCode\"\n\t\t\tappendTo=\"body\"\n\t\t\t[class]=\"formControl.invalid && formControl.touched ? 'danger' : 'basic'\"\n\t\t>\n\t\t\t<ng-template ng-option-tmp let-item=\"item\" let-index=\"index\">\n\t\t\t\t{{ item?.country }}\n\t\t\t</ng-template>\n\t\t\t<ng-template ng-label-tmp let-item=\"item\">\n\t\t\t\t{{ item?.country }}\n\t\t\t</ng-template>\n\t\t</ng-select>\n\t</div>\n</ng-container>\n", styles: [":host{display:block}:host ::ng-deep .ng-select.ng-select-searchable .ng-select-container .ng-value-container .ng-input>input{background:none transparent!important}\n"] }]
        }], ctorParameters: () => [{ type: i1.CountryService }, { type: i2.TranslateService }, { type: i0.ChangeDetectorRef }, { type: i1.Store }], propDecorators: { formControl: [{
                type: Input
            }], optionChange: [{
                type: Output
            }], country: [{
                type: Input
            }], placeholder: [{
                type: Input
            }] } });
//# sourceMappingURL=country.component.js.map