import { __decorate, __metadata } from "tslib";
import { Component, Input, forwardRef, EventEmitter, Output } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, filter, tap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ErrorHandlingService, OrganizationExpenseCategoriesService, ToastrService } from '@gauzy/ui-core/core';
import { Store } from '@gauzy/ui-core/core';
import { removeDuplicatesByProperty } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
import * as i1 from "@gauzy/ui-core/core";
import * as i2 from "@angular/forms";
import * as i3 from "@ng-select/ng-select";
import * as i4 from "@ngx-translate/core";
let ExpenseCategorySelectComponent = class ExpenseCategorySelectComponent {
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
    set category(val) {
        this._category = val;
        this.onChange(val);
        this.onTouched(val);
    }
    get category() {
        return this._category;
    }
    constructor(store, toastrService, errorHandler, expenseCategoriesService) {
        this.store = store;
        this.toastrService = toastrService;
        this.errorHandler = errorHandler;
        this.expenseCategoriesService = expenseCategoriesService;
        this.categories = [];
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
        this._searchable = true;
        this.onChange = () => { };
        this.onTouched = () => { };
        this.onChanged = new EventEmitter();
        this.addCategory = async (name) => {
            try {
                this.toastrService.success('EXPENSES_PAGE.ADD_EXPENSE_CATEGORY', {
                    name
                });
                const { tenantId } = this.store.user;
                const { id: organizationId } = this.organization;
                return await this.expenseCategoriesService.create({
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
            .pipe(debounceTime(100), tap(() => this.getCategories()), untilDestroyed(this))
            .subscribe();
        this.store.selectedOrganization$
            .pipe(filter((organization) => !!organization), tap((organization) => (this.organization = organization)), tap(() => this.subject$.next(true)), untilDestroyed(this))
            .subscribe();
    }
    async getCategories() {
        const { tenantId } = this.store.user;
        const { id: organizationId } = this.organization;
        const { items = [] } = await this.expenseCategoriesService.getAll({
            organizationId,
            tenantId
        });
        this.categories = removeDuplicatesByProperty(items, 'name');
    }
    writeValue(value) {
        this._category = value;
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
    selectCategory(category) {
        this.category = category;
        this.onChanged.emit(category);
    }
    ngOnDestroy() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ExpenseCategorySelectComponent, deps: [{ token: i1.Store }, { token: i1.ToastrService }, { token: i1.ErrorHandlingService }, { token: i1.OrganizationExpenseCategoriesService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: ExpenseCategorySelectComponent, isStandalone: false, selector: "ga-expense-category-select", inputs: { disabled: "disabled", placeholder: "placeholder", clearable: "clearable", addTag: "addTag", searchable: "searchable" }, outputs: { onChanged: "onChanged" }, providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => ExpenseCategorySelectComponent),
                multi: true
            }
        ], ngImport: i0, template: "<ng-select\n\t[addTag]=\"(addTag) ? addCategory : null\"\n\t[clearable]=\"clearable\"\n\t[disabled]=\"disabled\"\n\t[searchable]=\"searchable\"\n\t[items]=\"categories\"\n\t(change)=\"selectCategory($event)\"\n\t[(ngModel)]=\"category\"\n\t[placeholder]=\"placeholder || 'POP_UPS.ALL_VENDORS' | translate\"\n\tbindLabel=\"name\"\n\tappendTo=\"body\"\n></ng-select>", styles: [":host{min-width:0;width:100%;display:block}:host .multiple-select{width:100%}\n"], dependencies: [{ kind: "directive", type: i2.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i2.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "component", type: i3.NgSelectComponent, selector: "ng-select", inputs: ["ariaLabelDropdown", "ariaLabel", "markFirst", "placeholder", "fixedPlaceholder", "notFoundText", "typeToSearchText", "preventToggleOnRightClick", "addTagText", "loadingText", "clearAllText", "dropdownPosition", "appendTo", "outsideClickEvent", "loading", "closeOnSelect", "hideSelected", "selectOnTab", "openOnEnter", "maxSelectedItems", "groupBy", "groupValue", "bufferAmount", "virtualScroll", "selectableGroup", "tabFocusOnClearButton", "selectableGroupAsModel", "searchFn", "trackByFn", "clearOnBackspace", "labelForId", "inputAttrs", "tabIndex", "readonly", "searchWhileComposing", "minTermLength", "editableSearchTerm", "ngClass", "typeahead", "multiple", "addTag", "searchable", "clearable", "clearKeepsDisabledOptions", "deselectOnClick", "clearSearchOnAdd", "compareWith", "keyDownFn", "bindLabel", "bindValue", "appearance", "isOpen", "items"], outputs: ["bindLabelChange", "bindValueChange", "appearanceChange", "isOpenChange", "itemsChange", "blur", "focus", "change", "open", "close", "search", "clear", "add", "remove", "scroll", "scrollToEnd"], exportAs: ["ngSelect"] }, { kind: "pipe", type: i4.TranslatePipe, name: "translate" }] }); }
};
ExpenseCategorySelectComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [Store,
        ToastrService,
        ErrorHandlingService,
        OrganizationExpenseCategoriesService])
], ExpenseCategorySelectComponent);
export { ExpenseCategorySelectComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ExpenseCategorySelectComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-expense-category-select', providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => ExpenseCategorySelectComponent),
                            multi: true
                        }
                    ], standalone: false, template: "<ng-select\n\t[addTag]=\"(addTag) ? addCategory : null\"\n\t[clearable]=\"clearable\"\n\t[disabled]=\"disabled\"\n\t[searchable]=\"searchable\"\n\t[items]=\"categories\"\n\t(change)=\"selectCategory($event)\"\n\t[(ngModel)]=\"category\"\n\t[placeholder]=\"placeholder || 'POP_UPS.ALL_VENDORS' | translate\"\n\tbindLabel=\"name\"\n\tappendTo=\"body\"\n></ng-select>", styles: [":host{min-width:0;width:100%;display:block}:host .multiple-select{width:100%}\n"] }]
        }], ctorParameters: () => [{ type: i1.Store }, { type: i1.ToastrService }, { type: i1.ErrorHandlingService }, { type: i1.OrganizationExpenseCategoriesService }], propDecorators: { disabled: [{
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
//# sourceMappingURL=expense-category-select.component.js.map