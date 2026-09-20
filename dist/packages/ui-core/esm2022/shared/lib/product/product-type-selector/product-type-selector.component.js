import { __decorate, __metadata } from "tslib";
import { Component, Input, forwardRef, EventEmitter, Output } from '@angular/core';
import { PermissionsEnum, ProductTypesIconsEnum } from '@gauzy/contracts';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { finalize, map, Subject } from 'rxjs';
import { debounceTime, filter, tap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { distinctUntilChange } from '@gauzy/ui-core/common';
import { ErrorHandlingService, ProductTypeService, Store } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
import * as i1 from "@gauzy/ui-core/core";
import * as i2 from "@angular/forms";
import * as i3 from "@ng-select/ng-select";
import * as i4 from "@angular/common";
import * as i5 from "@ngx-translate/core";
let ProductTypeSelectorComponent = class ProductTypeSelectorComponent {
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
    get label() {
        return this._label;
    }
    set label(value) {
        this._label = value;
    }
    get addTag() {
        return this._addTag;
    }
    set addTag(value) {
        this._addTag = value;
    }
    set productTypeId(val) {
        this._productTypeId = val;
        this.onChange(val);
        this.onTouched(val);
    }
    get productTypeId() {
        return this._productTypeId;
    }
    set productType(val) {
        this._productType = val;
    }
    get productType() {
        return this._productType;
    }
    constructor(store, errorHandler, productTypeService) {
        this.store = store;
        this.errorHandler = errorHandler;
        this.productTypeService = productTypeService;
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
        this.addProductType = async (name) => {
            if (!this.organization) {
                return;
            }
            this.loading = true;
            try {
                const { id: organizationId } = this.organization;
                const { tenantId } = this.store.user;
                const languageCode = this.store.preferredLanguage;
                const description = name;
                const icons = Object.values(ProductTypesIconsEnum);
                // Added latest product category translations
                const translations = [
                    {
                        name,
                        description,
                        languageCode,
                        tenantId,
                        organizationId
                    }
                ];
                const payload = {
                    organizationId,
                    tenantId,
                    translations,
                    icon: icons[Math.floor(Math.random() * icons.length)]
                };
                return await this.productTypeService.create(payload).finally(() => {
                    this.loading = false;
                });
            }
            catch (error) {
                this.errorHandler.handleError(error);
            }
        };
    }
    ngOnInit() {
        this.hasEditProductType$ = this.store.userRolePermissions$.pipe(map(() => this.store.hasPermission(PermissionsEnum.ORG_PRODUCT_TYPES_EDIT)));
        this.subject$
            .pipe(debounceTime(100), tap(() => this.getProductTypes()), untilDestroyed(this))
            .subscribe();
        this.store.selectedOrganization$
            .pipe(distinctUntilChange(), filter((organization) => !!organization), tap((organization) => (this.organization = organization)), tap(() => this.subject$.next(true)), untilDestroyed(this))
            .subscribe();
    }
    writeValue(value) {
        if (value) {
            this._productTypeId = value;
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
     * GET product types
     *
     * @returns
     */
    async getProductTypes() {
        if (!this.organization) {
            return;
        }
        try {
            this.loading = true;
            const { id: organizationId } = this.organization;
            const { tenantId } = this.store.user;
            this.productTypes$ = this.productTypeService
                .getAllTranslated({
                organizationId,
                tenantId
            })
                .pipe(tap(({ items = [] }) => this.onLoaded.emit(items)), map(({ items }) => items), finalize(() => (this.loading = false)), untilDestroyed(this));
        }
        catch (error) {
            console.log('Error while retrieving product types', error);
        }
    }
    /**
     * On Change Product Type
     *
     * @param productType
     */
    selectProductType(productType) {
        this.productTypeId = productType ? productType.id : null;
        this.productType = productType ? productType : null;
        this.onChanged.emit(productType);
    }
    ngOnDestroy() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProductTypeSelectorComponent, deps: [{ token: i1.Store }, { token: i1.ErrorHandlingService }, { token: i1.ProductTypeService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: ProductTypeSelectorComponent, isStandalone: false, selector: "ngx-product-type-selector", inputs: { disabled: "disabled", placeholder: "placeholder", label: "label", addTag: "addTag" }, outputs: { onChanged: "onChanged", onLoaded: "onLoaded" }, providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => ProductTypeSelectorComponent),
                multi: true
            }
        ], ngImport: i0, template: "\n@if (label !== '') {\n  <label class=\"label\">\n    {{ label || 'INVENTORY_PAGE.PRODUCT_TYPE' | translate }}\n  </label>\n}\n<ng-select\n  [addTag]=\"((hasEditProductType$ | async) && addTag) ? addProductType : null\"\n  [loading]=\"loading\"\n  [placeholder]=\"placeholder || 'INVENTORY_PAGE.PRODUCT_TYPE' | translate\"\n  [items]=\"(productTypes$ | async)\"\n  [readonly]=\"disabled\"\n  [virtualScroll]=\"true\"\n  [(ngModel)]=\"productTypeId\"\n  (change)=\"selectProductType($event)\"\n  bindLabel=\"name\"\n  bindValue=\"id\"\n  appendTo=\"body\"\n></ng-select>\n", styles: [""], dependencies: [{ kind: "directive", type: i2.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i2.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "component", type: i3.NgSelectComponent, selector: "ng-select", inputs: ["ariaLabelDropdown", "ariaLabel", "markFirst", "placeholder", "fixedPlaceholder", "notFoundText", "typeToSearchText", "preventToggleOnRightClick", "addTagText", "loadingText", "clearAllText", "dropdownPosition", "appendTo", "outsideClickEvent", "loading", "closeOnSelect", "hideSelected", "selectOnTab", "openOnEnter", "maxSelectedItems", "groupBy", "groupValue", "bufferAmount", "virtualScroll", "selectableGroup", "tabFocusOnClearButton", "selectableGroupAsModel", "searchFn", "trackByFn", "clearOnBackspace", "labelForId", "inputAttrs", "tabIndex", "readonly", "searchWhileComposing", "minTermLength", "editableSearchTerm", "ngClass", "typeahead", "multiple", "addTag", "searchable", "clearable", "clearKeepsDisabledOptions", "deselectOnClick", "clearSearchOnAdd", "compareWith", "keyDownFn", "bindLabel", "bindValue", "appearance", "isOpen", "items"], outputs: ["bindLabelChange", "bindValueChange", "appearanceChange", "isOpenChange", "itemsChange", "blur", "focus", "change", "open", "close", "search", "clear", "add", "remove", "scroll", "scrollToEnd"], exportAs: ["ngSelect"] }, { kind: "pipe", type: i4.AsyncPipe, name: "async" }, { kind: "pipe", type: i5.TranslatePipe, name: "translate" }] }); }
};
ProductTypeSelectorComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [Store,
        ErrorHandlingService,
        ProductTypeService])
], ProductTypeSelectorComponent);
export { ProductTypeSelectorComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProductTypeSelectorComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-product-type-selector', providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => ProductTypeSelectorComponent),
                            multi: true
                        }
                    ], standalone: false, template: "\n@if (label !== '') {\n  <label class=\"label\">\n    {{ label || 'INVENTORY_PAGE.PRODUCT_TYPE' | translate }}\n  </label>\n}\n<ng-select\n  [addTag]=\"((hasEditProductType$ | async) && addTag) ? addProductType : null\"\n  [loading]=\"loading\"\n  [placeholder]=\"placeholder || 'INVENTORY_PAGE.PRODUCT_TYPE' | translate\"\n  [items]=\"(productTypes$ | async)\"\n  [readonly]=\"disabled\"\n  [virtualScroll]=\"true\"\n  [(ngModel)]=\"productTypeId\"\n  (change)=\"selectProductType($event)\"\n  bindLabel=\"name\"\n  bindValue=\"id\"\n  appendTo=\"body\"\n></ng-select>\n" }]
        }], ctorParameters: () => [{ type: i1.Store }, { type: i1.ErrorHandlingService }, { type: i1.ProductTypeService }], propDecorators: { disabled: [{
                type: Input
            }], placeholder: [{
                type: Input
            }], label: [{
                type: Input
            }], addTag: [{
                type: Input
            }], onChanged: [{
                type: Output
            }], onLoaded: [{
                type: Output
            }] } });
//# sourceMappingURL=product-type-selector.component.js.map