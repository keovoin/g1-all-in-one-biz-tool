import { __decorate, __metadata } from "tslib";
import { Component, Input, forwardRef, EventEmitter, Output } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, filter, tap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ErrorHandlingService, ToastrService } from '@gauzy/ui-core/core';
import { Store } from '@gauzy/ui-core/core';
import { OrganizationVendorsService } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
import * as i1 from "@gauzy/ui-core/core";
import * as i2 from "@angular/forms";
import * as i3 from "@ng-select/ng-select";
import * as i4 from "@ngx-translate/core";
let VendorSelectComponent = class VendorSelectComponent {
    get disabled() {
        return this._disabled;
    }
    set disabled(value) {
        this._disabled = value;
    }
    get placeholder() {
        return this._placeholder;
    }
    set placeholder(value) {
        this._placeholder = value;
    }
    get clearable() {
        return this._clearable;
    }
    set clearable(value) {
        this._clearable = value;
    }
    get addTag() {
        return this._addTag;
    }
    set addTag(value) {
        this._addTag = value;
    }
    get searchable() {
        return this._searchable;
    }
    set searchable(value) {
        this._searchable = value;
    }
    set vendor(val) {
        this._vendor = val;
        this.onChange(val);
        this.onTouched(val);
    }
    get vendor() {
        return this._vendor;
    }
    constructor(store, organizationVendorsService, toastrService, errorHandler) {
        this.store = store;
        this.organizationVendorsService = organizationVendorsService;
        this.toastrService = toastrService;
        this.errorHandler = errorHandler;
        this.vendors = [];
        this.subject$ = new Subject();
        /*
         * Getter & Setter for dynamic enabled/disabled element
         */
        this._disabled = false;
        /*
         * Getter & Setter for dynamic add tag option
         */
        this._addTag = false;
        /*
         * Getter & Setter for dynamic searchable option
         */
        this._searchable = false;
        this.onChange = () => { };
        this.onTouched = () => { };
        this.onChanged = new EventEmitter();
        this.addVendor = (name) => {
            try {
                this.toastrService.success('NOTES.ORGANIZATIONS.EDIT_ORGANIZATIONS_VENDOR.ADD_VENDOR', {
                    name
                });
                const { tenantId } = this.store.user;
                const { id: organizationId } = this.organization;
                return this.organizationVendorsService.create({
                    name,
                    organizationId,
                    tenantId
                });
            }
            catch (error) {
                this.errorHandler.handleError(error);
            }
        };
    }
    ngOnInit() {
        this.subject$
            .pipe(debounceTime(100), tap(() => this.getVendors()), untilDestroyed(this))
            .subscribe();
        this.store.selectedOrganization$
            .pipe(filter((organization) => !!organization), tap((organization) => (this.organization = organization)), tap(() => this.subject$.next(true)), untilDestroyed(this))
            .subscribe();
    }
    async getVendors() {
        const { tenantId } = this.store.user;
        const { id: organizationId } = this.organization;
        const { items: vendors } = await this.organizationVendorsService.getAll({
            organizationId,
            tenantId
        });
        this.vendors = vendors;
    }
    writeValue(value) {
        if (value) {
            this._vendor = value;
        }
    }
    registerOnChange(fn) {
        this.onChange = fn;
    }
    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    setDisabledState(isDisabled) {
        this.disabled = isDisabled;
    }
    selectVendor(vendor) {
        this.vendor = vendor;
        this.onChanged.emit(vendor);
    }
    ngOnDestroy() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: VendorSelectComponent, deps: [{ token: i1.Store }, { token: i1.OrganizationVendorsService }, { token: i1.ToastrService }, { token: i1.ErrorHandlingService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: VendorSelectComponent, isStandalone: false, selector: "ga-vendor-select", inputs: { disabled: "disabled", placeholder: "placeholder", clearable: "clearable", addTag: "addTag", searchable: "searchable" }, outputs: { onChanged: "onChanged" }, providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => VendorSelectComponent),
                multi: true
            }
        ], ngImport: i0, template: "<ng-select\n\t[addTag]=\"(addTag) ? addVendor : null\"\n\t[clearable]=\"clearable\"\n\t[disabled]=\"disabled\"\n\t[searchable]=\"searchable\"\n\t[items]=\"vendors\"\n\t(change)=\"selectVendor($event)\"\n\t[(ngModel)]=\"vendor\"\n\t[placeholder]=\"placeholder || 'POP_UPS.ALL_VENDORS' | translate\"\n\tbindLabel=\"name\"\n\tappendTo=\"body\"\n></ng-select>\n", styles: [":host{min-width:0;width:100%;display:block}:host .multiple-select{width:100%}\n"], dependencies: [{ kind: "directive", type: i2.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i2.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "component", type: i3.NgSelectComponent, selector: "ng-select", inputs: ["ariaLabelDropdown", "ariaLabel", "markFirst", "placeholder", "fixedPlaceholder", "notFoundText", "typeToSearchText", "preventToggleOnRightClick", "addTagText", "loadingText", "clearAllText", "dropdownPosition", "appendTo", "outsideClickEvent", "loading", "closeOnSelect", "hideSelected", "selectOnTab", "openOnEnter", "maxSelectedItems", "groupBy", "groupValue", "bufferAmount", "virtualScroll", "selectableGroup", "tabFocusOnClearButton", "selectableGroupAsModel", "searchFn", "trackByFn", "clearOnBackspace", "labelForId", "inputAttrs", "tabIndex", "readonly", "searchWhileComposing", "minTermLength", "editableSearchTerm", "ngClass", "typeahead", "multiple", "addTag", "searchable", "clearable", "clearKeepsDisabledOptions", "deselectOnClick", "clearSearchOnAdd", "compareWith", "keyDownFn", "bindLabel", "bindValue", "appearance", "isOpen", "items"], outputs: ["bindLabelChange", "bindValueChange", "appearanceChange", "isOpenChange", "itemsChange", "blur", "focus", "change", "open", "close", "search", "clear", "add", "remove", "scroll", "scrollToEnd"], exportAs: ["ngSelect"] }, { kind: "pipe", type: i4.TranslatePipe, name: "translate" }] }); }
};
VendorSelectComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [Store,
        OrganizationVendorsService,
        ToastrService,
        ErrorHandlingService])
], VendorSelectComponent);
export { VendorSelectComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: VendorSelectComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-vendor-select', providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => VendorSelectComponent),
                            multi: true
                        }
                    ], standalone: false, template: "<ng-select\n\t[addTag]=\"(addTag) ? addVendor : null\"\n\t[clearable]=\"clearable\"\n\t[disabled]=\"disabled\"\n\t[searchable]=\"searchable\"\n\t[items]=\"vendors\"\n\t(change)=\"selectVendor($event)\"\n\t[(ngModel)]=\"vendor\"\n\t[placeholder]=\"placeholder || 'POP_UPS.ALL_VENDORS' | translate\"\n\tbindLabel=\"name\"\n\tappendTo=\"body\"\n></ng-select>\n", styles: [":host{min-width:0;width:100%;display:block}:host .multiple-select{width:100%}\n"] }]
        }], ctorParameters: () => [{ type: i1.Store }, { type: i1.OrganizationVendorsService }, { type: i1.ToastrService }, { type: i1.ErrorHandlingService }], propDecorators: { disabled: [{
                type: Input
            }], placeholder: [{
                type: Input
            }], clearable: [{
                type: Input
            }], addTag: [{
                type: Input
            }], searchable: [{
                type: Input
            }], onChanged: [{
                type: Output
            }] } });
//# sourceMappingURL=vendor-select.component.js.map