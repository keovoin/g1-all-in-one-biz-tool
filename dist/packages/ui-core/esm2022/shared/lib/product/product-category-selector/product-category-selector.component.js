import { __decorate, __metadata } from "tslib";
import { Component, Input, forwardRef, EventEmitter, Output } from '@angular/core';
import { PermissionsEnum } from '@gauzy/contracts';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { finalize, map, Subject } from 'rxjs';
import { debounceTime, filter, tap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { distinctUntilChange } from '@gauzy/ui-core/common';
import { ProductCategoryService, Store } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
import * as i1 from "@gauzy/ui-core/core";
import * as i2 from "@angular/forms";
import * as i3 from "@ng-select/ng-select";
import * as i4 from "@angular/common";
import * as i5 from "@ngx-translate/core";
let ProductCategorySelectorComponent = class ProductCategorySelectorComponent {
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
    get addTag() {
        return this._addTag;
    }
    set addTag(value) {
        this._addTag = value;
    }
    get label() {
        return this._label;
    }
    set label(value) {
        this._label = value;
    }
    set productCategoryId(val) {
        this._productCategoryId = val;
        this.onChange(val);
        this.onTouched(val);
    }
    get productCategoryId() {
        return this._productCategoryId;
    }
    set productCategory(val) {
        this._productCategory = val;
    }
    get productCategory() {
        return this._productCategory;
    }
    constructor(store, productCategoryService) {
        this.store = store;
        this.productCategoryService = productCategoryService;
        this.subject$ = new Subject();
        this.loading = false;
        /*
         * Getter & Setter for dynamic enabled/disabled element
         */
        this._disabled = false;
        /*
         * Getter & Setter for dynamic add tag option
         */
        this._addTag = false;
        this.onChange = () => { };
        this.onTouched = () => { };
        this.onChanged = new EventEmitter();
        this.onLoaded = new EventEmitter();
        /**
         * Add product type using add tag
         *
         * @param name
         * @returns
         */
        this.addProductCategory = async (name) => {
            if (!this.organization) {
                return;
            }
            this.loading = true;
            try {
                const { id: organizationId } = this.organization;
                const { tenantId } = this.store.user;
                const languageCode = this.store.preferredLanguage;
                // Added latest product category translations
                const translations = [
                    {
                        name,
                        tenantId,
                        organizationId,
                        languageCode
                    }
                ];
                const payload = {
                    organizationId,
                    tenantId,
                    translations
                };
                return await this.productCategoryService.create(payload).finally(() => {
                    this.loading = false;
                });
            }
            catch (error) {
                console.log('Error while creating product category', error);
            }
        };
    }
    ngOnInit() {
        this.hasEditProductCategory$ = this.store.userRolePermissions$.pipe(map(() => this.store.hasPermission(PermissionsEnum.ORG_PRODUCT_CATEGORIES_EDIT)));
        this.subject$
            .pipe(debounceTime(100), tap(() => this.getProductCategories()), untilDestroyed(this))
            .subscribe();
        this.store.selectedOrganization$
            .pipe(distinctUntilChange(), filter((organization) => !!organization), tap((organization) => (this.organization = organization)), tap(() => this.subject$.next(true)), untilDestroyed(this))
            .subscribe();
    }
    writeValue(value) {
        if (value) {
            this._productCategoryId = value;
        }
    }
    /**
     * Register a listener for change events.
     */
    registerOnChange(fn) {
        this.onChange = fn;
    }
    /**
     * Register a listener for touched events.
     */
    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    /**
     * Set disabled state for DOM element
     *
     * @param isDisabled
     */
    setDisabledState(isDisabled) {
        this.disabled = isDisabled;
    }
    /**
     * GET product categories
     *
     * @returns
     */
    async getProductCategories() {
        if (!this.organization) {
            return;
        }
        try {
            this.loading = true;
            const { id: organizationId } = this.organization;
            const { tenantId } = this.store.user;
            this.productCategories$ = this.productCategoryService
                .getAllTranslated({
                organizationId,
                tenantId
            })
                .pipe(map(({ items = [] }) => items), tap((items) => this.onLoaded.emit(items)), finalize(() => (this.loading = false)), untilDestroyed(this));
        }
        catch (error) {
            console.log('Error while retrieving product categories', error);
        }
    }
    /**
     * On Change Product Type
     *
     * @param productCategory
     */
    selectProductCategory(productCategory) {
        this.productCategoryId = productCategory ? productCategory.id : null;
        this.productCategory = productCategory ? productCategory : null;
        this.onChanged.emit(productCategory);
    }
    ngOnDestroy() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProductCategorySelectorComponent, deps: [{ token: i1.Store }, { token: i1.ProductCategoryService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: ProductCategorySelectorComponent, isStandalone: false, selector: "ngx-product-category-selector", inputs: { disabled: "disabled", placeholder: "placeholder", addTag: "addTag", label: "label" }, outputs: { onChanged: "onChanged", onLoaded: "onLoaded" }, providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => ProductCategorySelectorComponent),
                multi: true
            }
        ], ngImport: i0, template: "\n@if (label !== '') {\n  <label class=\"label\">\n    {{ label || 'INVENTORY_PAGE.PRODUCT_CATEGORY' | translate }}\n  </label>\n}\n<ng-select\n  [addTag]=\"((hasEditProductCategory$ | async) && addTag) ? addProductCategory : null\"\n  [loading]=\"loading\"\n  [placeholder]=\"placeholder || 'INVENTORY_PAGE.PRODUCT_CATEGORY' | translate\"\n  [readonly]=\"disabled\"\n  [virtualScroll]=\"true\"\n  [items]=\"(productCategories$ | async)\"\n  [(ngModel)]=\"productCategoryId\"\n  (change)=\"selectProductCategory($event)\"\n  bindLabel=\"name\"\n  bindValue=\"id\"\n  appendTo=\"body\"\n></ng-select>\n", styles: [""], dependencies: [{ kind: "directive", type: i2.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i2.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "component", type: i3.NgSelectComponent, selector: "ng-select", inputs: ["ariaLabelDropdown", "ariaLabel", "markFirst", "placeholder", "fixedPlaceholder", "notFoundText", "typeToSearchText", "preventToggleOnRightClick", "addTagText", "loadingText", "clearAllText", "dropdownPosition", "appendTo", "outsideClickEvent", "loading", "closeOnSelect", "hideSelected", "selectOnTab", "openOnEnter", "maxSelectedItems", "groupBy", "groupValue", "bufferAmount", "virtualScroll", "selectableGroup", "tabFocusOnClearButton", "selectableGroupAsModel", "searchFn", "trackByFn", "clearOnBackspace", "labelForId", "inputAttrs", "tabIndex", "readonly", "searchWhileComposing", "minTermLength", "editableSearchTerm", "ngClass", "typeahead", "multiple", "addTag", "searchable", "clearable", "clearKeepsDisabledOptions", "deselectOnClick", "clearSearchOnAdd", "compareWith", "keyDownFn", "bindLabel", "bindValue", "appearance", "isOpen", "items"], outputs: ["bindLabelChange", "bindValueChange", "appearanceChange", "isOpenChange", "itemsChange", "blur", "focus", "change", "open", "close", "search", "clear", "add", "remove", "scroll", "scrollToEnd"], exportAs: ["ngSelect"] }, { kind: "pipe", type: i4.AsyncPipe, name: "async" }, { kind: "pipe", type: i5.TranslatePipe, name: "translate" }] }); }
};
ProductCategorySelectorComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [Store, ProductCategoryService])
], ProductCategorySelectorComponent);
export { ProductCategorySelectorComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProductCategorySelectorComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-product-category-selector', providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => ProductCategorySelectorComponent),
                            multi: true
                        }
                    ], standalone: false, template: "\n@if (label !== '') {\n  <label class=\"label\">\n    {{ label || 'INVENTORY_PAGE.PRODUCT_CATEGORY' | translate }}\n  </label>\n}\n<ng-select\n  [addTag]=\"((hasEditProductCategory$ | async) && addTag) ? addProductCategory : null\"\n  [loading]=\"loading\"\n  [placeholder]=\"placeholder || 'INVENTORY_PAGE.PRODUCT_CATEGORY' | translate\"\n  [readonly]=\"disabled\"\n  [virtualScroll]=\"true\"\n  [items]=\"(productCategories$ | async)\"\n  [(ngModel)]=\"productCategoryId\"\n  (change)=\"selectProductCategory($event)\"\n  bindLabel=\"name\"\n  bindValue=\"id\"\n  appendTo=\"body\"\n></ng-select>\n" }]
        }], ctorParameters: () => [{ type: i1.Store }, { type: i1.ProductCategoryService }], propDecorators: { disabled: [{
                type: Input
            }], placeholder: [{
                type: Input
            }], addTag: [{
                type: Input
            }], label: [{
                type: Input
            }], onChanged: [{
                type: Output
            }], onLoaded: [{
                type: Output
            }] } });
//# sourceMappingURL=product-category-selector.component.js.map