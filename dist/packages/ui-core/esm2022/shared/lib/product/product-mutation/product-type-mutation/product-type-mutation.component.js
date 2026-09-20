var ProductTypeMutationComponent_1;
import { __decorate, __metadata } from "tslib";
import { Component, Input } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { ProductTypesIconsEnum, LanguagesEnum } from '@gauzy/contracts';
import { TranslateService } from '@ngx-translate/core';
import { NbDialogRef } from '@nebular/theme';
import { combineLatest } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { distinctUntilChange } from '@gauzy/ui-core/common';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { ProductTypeService, Store, ToastrService } from '@gauzy/ui-core/core';
import { HttpErrorResponse } from '@angular/common/http';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "@ngx-translate/core";
import * as i3 from "@angular/forms";
import * as i4 from "@gauzy/ui-core/core";
import * as i5 from "../../../language/language-selector/language-selector.component";
import * as i6 from "@ng-select/ng-select";
let ProductTypeMutationComponent = class ProductTypeMutationComponent extends TranslationBaseComponent {
    static { ProductTypeMutationComponent_1 = this; }
    static buildForm(fb) {
        return fb.group({
            name: ['', Validators.required],
            icon: [ProductTypesIconsEnum.STAR],
            description: []
        });
    }
    constructor(dialogRef, translationService, fb, productTypeService, store, toastrService) {
        super(translationService);
        this.dialogRef = dialogRef;
        this.translationService = translationService;
        this.fb = fb;
        this.productTypeService = productTypeService;
        this.store = store;
        this.toastrService = toastrService;
        this.icons = Object.values(ProductTypesIconsEnum);
        this.translations = [];
        this.form = ProductTypeMutationComponent_1.buildForm(this.fb);
    }
    ngOnInit() {
        const storeOrganization$ = this.store.selectedOrganization$;
        const preferredLanguage$ = this.store.preferredLanguage$;
        combineLatest([storeOrganization$, preferredLanguage$])
            .pipe(distinctUntilChange(), filter(([organization, language]) => !!organization && !!language), tap(([organization, language]) => {
            this.selectedLanguage = language || LanguagesEnum.ENGLISH;
            this.organization = organization;
        }), tap(() => this._patchRawValue()), untilDestroyed(this))
            .subscribe();
    }
    ngOnDestroy() { }
    async onSubmit() {
        if (!this.organization || this.form.invalid) {
            return;
        }
        await this._setTranslationsRawValue();
        const { tenantId } = this.store.user;
        const { id: organizationId } = this.organization;
        const { translations = [] } = this;
        const { icon } = this.form.getRawValue();
        const payload = {
            organizationId,
            tenantId,
            translations,
            icon
        };
        let productType;
        try {
            if (!this.productType) {
                productType = await this.productTypeService.create(payload);
            }
            else {
                payload['id'] = this.productType.id;
                productType = await this.productTypeService.update(payload);
            }
        }
        catch (error) {
            if (error instanceof HttpErrorResponse) {
                const messages = error.error.message.join(' & ');
                this.toastrService.error(messages);
            }
        }
        this.closeDialog(productType);
    }
    async closeDialog(productType) {
        this.dialogRef.close(productType);
    }
    /**
     * PATCH product category old raw value
     *
     * @returns
     */
    _patchRawValue() {
        if (!this.productType) {
            return;
        }
        const { icon, translations = [] } = this.productType;
        this.translations = translations;
        this.form.patchValue({ icon });
        this._setActiveTranslation();
    }
    /**
     * SET selected language active translation
     *
     * @returns
     */
    _setActiveTranslation() {
        this.activeTranslation = this.translations.find(({ languageCode }) => {
            return languageCode === this.selectedLanguage;
        });
        this.form.patchValue({
            name: this.activeTranslation ? this.activeTranslation.name : '',
            description: this.activeTranslation ? this.activeTranslation.description : ''
        });
    }
    /**
     * SET product category all translations
     */
    async _setTranslationsRawValue() {
        if (!this.organization) {
            return;
        }
        const { name, description } = this.form.getRawValue();
        const { tenantId } = this.store.user;
        const { id: organizationId } = this.organization;
        // Remove old transaltions for language code
        const translations = this.translations.filter(({ languageCode }) => {
            return languageCode !== this.selectedLanguage;
        });
        // Added latest product category translations
        this.translations = [
            ...translations,
            {
                name,
                description,
                tenantId,
                organizationId,
                languageCode: this.selectedLanguage
            }
        ];
    }
    /**
     * On language change set active translation
     *
     * @param langCode
     */
    onLangChange(langCode) {
        this.selectedLanguage = langCode;
        this._setActiveTranslation();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProductTypeMutationComponent, deps: [{ token: i1.NbDialogRef }, { token: i2.TranslateService }, { token: i3.UntypedFormBuilder }, { token: i4.ProductTypeService }, { token: i4.Store }, { token: i4.ToastrService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: ProductTypeMutationComponent, isStandalone: false, selector: "ngx-product-type-mutation", inputs: { productType: "productType" }, usesInheritance: true, ngImport: i0, template: "<nb-card class=\"main\">\n\t<nb-card-header class=\"d-flex flex-column\">\n\t\t<span class=\"cancel\"\n\t\t\t><i class=\"fas fa-times\" (click)=\"dialogRef.close()\" s></i\n\t\t></span>\n\t\t<h5 class=\"title\">\n\t\t\t{{\n\t\t\t\t(productType\n\t\t\t\t\t? 'INVENTORY_PAGE.EDIT_PRODUCT_TYPE'\n\t\t\t\t\t: 'INVENTORY_PAGE.ADD_PRODUCT_TYPE'\n\t\t\t\t) | translate\n\t\t\t}}\n\t\t</h5>\n\t</nb-card-header>\n\t<nb-card-body>\n\t\t<form\n\t\t\t[formGroup]=\"form\"\n\t\t\t#productTypeForm=\"ngForm\"\n\t\t\t(ngSubmit)=\"onSubmit()\"\n\t\t>\n\t\t\t<div class=\"row\">\n\t\t\t\t<div class=\"col-12\">\n\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t<label class=\"label\" for=\"language\">\n\t\t\t\t\t\t\t{{ 'INVENTORY_PAGE.LANGUAGE' | translate }}\n\t\t\t\t\t\t</label>\n\t\t\t\t\t\t<ngx-language-selector\n\t\t\t\t\t\t\tid=\"language\"\n\t\t\t\t\t\t\t[placeholder]=\"\n\t\t\t\t\t\t\t\t'INVENTORY_PAGE.LANGUAGE' | translate\n\t\t\t\t\t\t\t\"\n\t\t\t\t\t\t\tclass=\"d-block\"\n\t\t\t\t\t\t\tsize=\"medium\"\n\t\t\t\t\t\t\t[template]=\"'ng-select'\"\n\t\t\t\t\t\t\t[selectedLanguageCode]=\"selectedLanguage\"\n\t\t\t\t\t\t\t(selectedLanguageEvent)=\"onLangChange($event)\"\n\t\t\t\t\t\t></ngx-language-selector>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class=\"row\">\n\t\t\t\t<div class=\"col-4\">\n\t\t\t\t\t<label class=\"label\" for=\"icon\">\n\t\t\t\t\t\t{{ 'INVENTORY_PAGE.ICON' | translate }}\n\t\t\t\t\t</label>\n\t\t\t\t\t<ng-select\n\t\t\t\t\t\tclass=\"icon-select\"\n\t\t\t\t\t\t[clearable]=\"false\"\n\t\t\t\t\t\t[items]=\"icons\"\n\t\t\t\t\t\tbindLabel=\"name\"\n\t\t\t\t\t\t[placeholder]=\"'INVENTORY_PAGE.ICON' | translate\"\n\t\t\t\t\t\tid=\"icon\"\n\t\t\t\t\t\tformControlName=\"icon\"\n\t\t\t\t\t\tappendTo=\"body\"\n\t\t\t\t\t>\n\t\t\t\t\t\t<ng-template\n\t\t\t\t\t\t\tng-option-tmp\n\t\t\t\t\t\t\tlet-item=\"item\"\n\t\t\t\t\t\t\tlet-index=\"index\"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t<nb-icon [icon]=\"item\"></nb-icon>\n\t\t\t\t\t\t</ng-template>\n\t\t\t\t\t\t<ng-template ng-label-tmp let-item=\"item\">\n\t\t\t\t\t\t\t<div class=\"selector-template\">\n\t\t\t\t\t\t\t\t<nb-icon [icon]=\"item\"></nb-icon>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</ng-template>\n\t\t\t\t\t</ng-select>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"col-8\">\n\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t<label class=\"label\" for=\"name\">\n\t\t\t\t\t\t\t{{ 'INVENTORY_PAGE.NAME' | translate }}\n\t\t\t\t\t\t</label>\n\t\t\t\t\t\t<input\n\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\tid=\"name\"\n\t\t\t\t\t\t\ttype=\"text\"\n\t\t\t\t\t\t\tnbInput\n\t\t\t\t\t\t\tformControlName=\"name\"\n\t\t\t\t\t\t\t[placeholder]=\"'INVENTORY_PAGE.NAME' | translate\"\n\t\t\t\t\t\t/>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class=\"row\">\n\t\t\t\t<div class=\"col-sm-12\">\n\t\t\t\t\t<label class=\"label\" for=\"description\">{{\n\t\t\t\t\t\t'INVENTORY_PAGE.DESCRIPTION' | translate\n\t\t\t\t\t}}</label>\n\t\t\t\t\t<textarea\n\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\tid=\"description\"\n\t\t\t\t\t\tnbInput\n\t\t\t\t\t\tformControlName=\"description\"\n\t\t\t\t\t\t[placeholder]=\"'INVENTORY_PAGE.DESCRIPTION' | translate\"\n\t\t\t\t\t></textarea>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</form>\n\t</nb-card-body>\n\t<nb-card-footer class=\"text-left\">\n\t\t<button\n\t\t\t(click)=\"dialogRef.close()\"\n\t\t\tstatus=\"basic\"\n\t\t\tclass=\"mr-2\"\n\t\t\toutline\n\t\t\tnbButton\n\t\t>\n\t\t\t{{ 'BUTTONS.CANCEL' | translate }}\n\t\t</button>\n\t\t<button\n\t\t\t[disabled]=\"form.invalid\"\n\t\t\t(click)=\"productTypeForm.ngSubmit.emit()\"\n\t\t\tstatus=\"success\"\n\t\t\tnbButton\n\t\t>\n\t\t\t{{ 'BUTTONS.SAVE' | translate }}\n\t\t</button>\n\t</nb-card-footer>\n</nb-card>\n", styles: ["@charset \"UTF-8\";:host i{cursor:pointer}:host .cancel{width:100%;display:flex}[dir=ltr] :host .cancel{justify-content:flex-end}[dir=rtl] :host .cancel{justify-content:flex-start}:host .cancel i{font-size:11px;color:var(--gauzy-text-color-1)}:host [nbButton].appearance-outline.status-basic{background-color:transparent;border-color:#f56d584d;border-width:2px;color:#f56d58}:host [nbButton].appearance-outline.status-basic:hover{border-color:#f56d58}:host [nbButton].appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #f56d580d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host .title{color:var(--text-primary-color);font-size:16px;font-weight:600;line-height:16px;letter-spacing:0em}:host [nbButton].gray.appearance-outline.status-basic{background-color:transparent;border-color:#7e7e8f4d;border-width:2px;color:#7e7e8f}:host [nbButton].gray.appearance-outline.status-basic:hover{border-color:#7e7e8f}:host [nbButton].gray.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #7e7e8f0d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].gray.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic{background-color:transparent;border-color:#25b8694d;border-width:2px;color:#25b869}:host [nbButton].green.appearance-outline.status-basic:hover{border-color:#25b869}:host [nbButton].green.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #25b8690d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].green.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic[disabled],:host [nbButton].green.appearance-outline.status-basic.btn-disabled{background-color:var(--button-outline-basic-disabled-background-color);border-color:var(--button-outline-basic-disabled-border-color);color:var(--button-outline-basic-disabled-text-color);box-shadow:unset}:host [nbButton].primary.appearance-filled.status-primary{color:var(--text-primary-color);border:unset;background-color:var(--color-primary-transparent-default);box-shadow:var(--gauzy-shadow)}[dir=ltr] :host ::ng-deep input,[dir=ltr] :host ::ng-deep textarea{text-align:start}[dir=rtl] :host ::ng-deep input,[dir=rtl] :host ::ng-deep textarea{text-align:end}:host ::ng-deep input,:host ::ng-deep nb-select.appearance-outline.status-basic .select-button,:host ::ng-deep .ng-select .ng-select-container{background-color:var(--gauzy-sidebar-background-4)!important;border:none;min-height:calc(var(--select-medium-text-line-height) + .4375rem * 2)!important}:host ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-placeholder,:host ::ng-deep .ng-select.ng-select-single .ng-select-container .ng-value-container .ng-input{top:unset!important}:host ::ng-deep label,:host ::ng-deep .label{font-size:var(--text-label-font-size);font-weight:600;line-height:.8125rem;letter-spacing:-.01em;color:var(--gauzy-text-color-2)}:host ::ng-deep textarea{background-color:var(--gauzy-sidebar-background-4)!important;border:none}:host ::ng-deep .ng-select .ng-select-container input,:host ::ng-deep nb-tag-list input{background-color:unset!important}.d-bottom{display:flex;align-items:flex-end;align-content:flex-end}.options-wrap{display:flex}.option{padding:5px 10px;font-size:12px;background:#36f;border-radius:7px;color:#fff;margin-right:10px}.flex-end{display:flex;align-items:flex-end}nb-card-body{overflow:visible}ng-select{border-radius:.25rem}:host nb-card{background-color:var(--gauzy-card-1)}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "component", type: i1.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "directive", type: i1.NbInputDirective, selector: "input[nbInput],textarea[nbInput]", inputs: ["fieldSize", "status", "shape", "fullWidth"] }, { kind: "component", type: i1.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i1.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "component", type: i1.NbCardFooterComponent, selector: "nb-card-footer" }, { kind: "component", type: i1.NbCardHeaderComponent, selector: "nb-card-header" }, { kind: "component", type: i1.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "component", type: i5.LanguageSelectorComponent, selector: "ngx-language-selector", inputs: ["placeholder", "clearable", "addTag", "selectedLanguageCode", "selectBy", "labelForId", "template", "size"], outputs: ["selectedLanguageEvent"] }, { kind: "directive", type: i3.ɵNgNoValidate, selector: "form:not([ngNoForm]):not([ngNativeValidate])" }, { kind: "directive", type: i3.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i3.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i3.NgControlStatusGroup, selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],[formArray],form:not([ngNoForm]),[ngForm]" }, { kind: "directive", type: i3.FormGroupDirective, selector: "[formGroup]", inputs: ["formGroup"], outputs: ["ngSubmit"], exportAs: ["ngForm"] }, { kind: "directive", type: i3.FormControlName, selector: "[formControlName]", inputs: ["formControlName", "disabled", "ngModel"], outputs: ["ngModelChange"] }, { kind: "component", type: i6.NgSelectComponent, selector: "ng-select", inputs: ["ariaLabelDropdown", "ariaLabel", "markFirst", "placeholder", "fixedPlaceholder", "notFoundText", "typeToSearchText", "preventToggleOnRightClick", "addTagText", "loadingText", "clearAllText", "dropdownPosition", "appendTo", "outsideClickEvent", "loading", "closeOnSelect", "hideSelected", "selectOnTab", "openOnEnter", "maxSelectedItems", "groupBy", "groupValue", "bufferAmount", "virtualScroll", "selectableGroup", "tabFocusOnClearButton", "selectableGroupAsModel", "searchFn", "trackByFn", "clearOnBackspace", "labelForId", "inputAttrs", "tabIndex", "readonly", "searchWhileComposing", "minTermLength", "editableSearchTerm", "ngClass", "typeahead", "multiple", "addTag", "searchable", "clearable", "clearKeepsDisabledOptions", "deselectOnClick", "clearSearchOnAdd", "compareWith", "keyDownFn", "bindLabel", "bindValue", "appearance", "isOpen", "items"], outputs: ["bindLabelChange", "bindValueChange", "appearanceChange", "isOpenChange", "itemsChange", "blur", "focus", "change", "open", "close", "search", "clear", "add", "remove", "scroll", "scrollToEnd"], exportAs: ["ngSelect"] }, { kind: "directive", type: i6.NgOptionTemplateDirective, selector: "[ng-option-tmp]" }, { kind: "directive", type: i6.NgLabelTemplateDirective, selector: "[ng-label-tmp]" }, { kind: "pipe", type: i2.TranslatePipe, name: "translate" }] }); }
};
ProductTypeMutationComponent = ProductTypeMutationComponent_1 = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [NbDialogRef,
        TranslateService,
        UntypedFormBuilder,
        ProductTypeService,
        Store,
        ToastrService])
], ProductTypeMutationComponent);
export { ProductTypeMutationComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProductTypeMutationComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-product-type-mutation', standalone: false, template: "<nb-card class=\"main\">\n\t<nb-card-header class=\"d-flex flex-column\">\n\t\t<span class=\"cancel\"\n\t\t\t><i class=\"fas fa-times\" (click)=\"dialogRef.close()\" s></i\n\t\t></span>\n\t\t<h5 class=\"title\">\n\t\t\t{{\n\t\t\t\t(productType\n\t\t\t\t\t? 'INVENTORY_PAGE.EDIT_PRODUCT_TYPE'\n\t\t\t\t\t: 'INVENTORY_PAGE.ADD_PRODUCT_TYPE'\n\t\t\t\t) | translate\n\t\t\t}}\n\t\t</h5>\n\t</nb-card-header>\n\t<nb-card-body>\n\t\t<form\n\t\t\t[formGroup]=\"form\"\n\t\t\t#productTypeForm=\"ngForm\"\n\t\t\t(ngSubmit)=\"onSubmit()\"\n\t\t>\n\t\t\t<div class=\"row\">\n\t\t\t\t<div class=\"col-12\">\n\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t<label class=\"label\" for=\"language\">\n\t\t\t\t\t\t\t{{ 'INVENTORY_PAGE.LANGUAGE' | translate }}\n\t\t\t\t\t\t</label>\n\t\t\t\t\t\t<ngx-language-selector\n\t\t\t\t\t\t\tid=\"language\"\n\t\t\t\t\t\t\t[placeholder]=\"\n\t\t\t\t\t\t\t\t'INVENTORY_PAGE.LANGUAGE' | translate\n\t\t\t\t\t\t\t\"\n\t\t\t\t\t\t\tclass=\"d-block\"\n\t\t\t\t\t\t\tsize=\"medium\"\n\t\t\t\t\t\t\t[template]=\"'ng-select'\"\n\t\t\t\t\t\t\t[selectedLanguageCode]=\"selectedLanguage\"\n\t\t\t\t\t\t\t(selectedLanguageEvent)=\"onLangChange($event)\"\n\t\t\t\t\t\t></ngx-language-selector>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class=\"row\">\n\t\t\t\t<div class=\"col-4\">\n\t\t\t\t\t<label class=\"label\" for=\"icon\">\n\t\t\t\t\t\t{{ 'INVENTORY_PAGE.ICON' | translate }}\n\t\t\t\t\t</label>\n\t\t\t\t\t<ng-select\n\t\t\t\t\t\tclass=\"icon-select\"\n\t\t\t\t\t\t[clearable]=\"false\"\n\t\t\t\t\t\t[items]=\"icons\"\n\t\t\t\t\t\tbindLabel=\"name\"\n\t\t\t\t\t\t[placeholder]=\"'INVENTORY_PAGE.ICON' | translate\"\n\t\t\t\t\t\tid=\"icon\"\n\t\t\t\t\t\tformControlName=\"icon\"\n\t\t\t\t\t\tappendTo=\"body\"\n\t\t\t\t\t>\n\t\t\t\t\t\t<ng-template\n\t\t\t\t\t\t\tng-option-tmp\n\t\t\t\t\t\t\tlet-item=\"item\"\n\t\t\t\t\t\t\tlet-index=\"index\"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t<nb-icon [icon]=\"item\"></nb-icon>\n\t\t\t\t\t\t</ng-template>\n\t\t\t\t\t\t<ng-template ng-label-tmp let-item=\"item\">\n\t\t\t\t\t\t\t<div class=\"selector-template\">\n\t\t\t\t\t\t\t\t<nb-icon [icon]=\"item\"></nb-icon>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</ng-template>\n\t\t\t\t\t</ng-select>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"col-8\">\n\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t<label class=\"label\" for=\"name\">\n\t\t\t\t\t\t\t{{ 'INVENTORY_PAGE.NAME' | translate }}\n\t\t\t\t\t\t</label>\n\t\t\t\t\t\t<input\n\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\tid=\"name\"\n\t\t\t\t\t\t\ttype=\"text\"\n\t\t\t\t\t\t\tnbInput\n\t\t\t\t\t\t\tformControlName=\"name\"\n\t\t\t\t\t\t\t[placeholder]=\"'INVENTORY_PAGE.NAME' | translate\"\n\t\t\t\t\t\t/>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class=\"row\">\n\t\t\t\t<div class=\"col-sm-12\">\n\t\t\t\t\t<label class=\"label\" for=\"description\">{{\n\t\t\t\t\t\t'INVENTORY_PAGE.DESCRIPTION' | translate\n\t\t\t\t\t}}</label>\n\t\t\t\t\t<textarea\n\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\tid=\"description\"\n\t\t\t\t\t\tnbInput\n\t\t\t\t\t\tformControlName=\"description\"\n\t\t\t\t\t\t[placeholder]=\"'INVENTORY_PAGE.DESCRIPTION' | translate\"\n\t\t\t\t\t></textarea>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</form>\n\t</nb-card-body>\n\t<nb-card-footer class=\"text-left\">\n\t\t<button\n\t\t\t(click)=\"dialogRef.close()\"\n\t\t\tstatus=\"basic\"\n\t\t\tclass=\"mr-2\"\n\t\t\toutline\n\t\t\tnbButton\n\t\t>\n\t\t\t{{ 'BUTTONS.CANCEL' | translate }}\n\t\t</button>\n\t\t<button\n\t\t\t[disabled]=\"form.invalid\"\n\t\t\t(click)=\"productTypeForm.ngSubmit.emit()\"\n\t\t\tstatus=\"success\"\n\t\t\tnbButton\n\t\t>\n\t\t\t{{ 'BUTTONS.SAVE' | translate }}\n\t\t</button>\n\t</nb-card-footer>\n</nb-card>\n", styles: ["@charset \"UTF-8\";:host i{cursor:pointer}:host .cancel{width:100%;display:flex}[dir=ltr] :host .cancel{justify-content:flex-end}[dir=rtl] :host .cancel{justify-content:flex-start}:host .cancel i{font-size:11px;color:var(--gauzy-text-color-1)}:host [nbButton].appearance-outline.status-basic{background-color:transparent;border-color:#f56d584d;border-width:2px;color:#f56d58}:host [nbButton].appearance-outline.status-basic:hover{border-color:#f56d58}:host [nbButton].appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #f56d580d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host .title{color:var(--text-primary-color);font-size:16px;font-weight:600;line-height:16px;letter-spacing:0em}:host [nbButton].gray.appearance-outline.status-basic{background-color:transparent;border-color:#7e7e8f4d;border-width:2px;color:#7e7e8f}:host [nbButton].gray.appearance-outline.status-basic:hover{border-color:#7e7e8f}:host [nbButton].gray.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #7e7e8f0d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].gray.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic{background-color:transparent;border-color:#25b8694d;border-width:2px;color:#25b869}:host [nbButton].green.appearance-outline.status-basic:hover{border-color:#25b869}:host [nbButton].green.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #25b8690d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].green.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic[disabled],:host [nbButton].green.appearance-outline.status-basic.btn-disabled{background-color:var(--button-outline-basic-disabled-background-color);border-color:var(--button-outline-basic-disabled-border-color);color:var(--button-outline-basic-disabled-text-color);box-shadow:unset}:host [nbButton].primary.appearance-filled.status-primary{color:var(--text-primary-color);border:unset;background-color:var(--color-primary-transparent-default);box-shadow:var(--gauzy-shadow)}[dir=ltr] :host ::ng-deep input,[dir=ltr] :host ::ng-deep textarea{text-align:start}[dir=rtl] :host ::ng-deep input,[dir=rtl] :host ::ng-deep textarea{text-align:end}:host ::ng-deep input,:host ::ng-deep nb-select.appearance-outline.status-basic .select-button,:host ::ng-deep .ng-select .ng-select-container{background-color:var(--gauzy-sidebar-background-4)!important;border:none;min-height:calc(var(--select-medium-text-line-height) + .4375rem * 2)!important}:host ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-placeholder,:host ::ng-deep .ng-select.ng-select-single .ng-select-container .ng-value-container .ng-input{top:unset!important}:host ::ng-deep label,:host ::ng-deep .label{font-size:var(--text-label-font-size);font-weight:600;line-height:.8125rem;letter-spacing:-.01em;color:var(--gauzy-text-color-2)}:host ::ng-deep textarea{background-color:var(--gauzy-sidebar-background-4)!important;border:none}:host ::ng-deep .ng-select .ng-select-container input,:host ::ng-deep nb-tag-list input{background-color:unset!important}.d-bottom{display:flex;align-items:flex-end;align-content:flex-end}.options-wrap{display:flex}.option{padding:5px 10px;font-size:12px;background:#36f;border-radius:7px;color:#fff;margin-right:10px}.flex-end{display:flex;align-items:flex-end}nb-card-body{overflow:visible}ng-select{border-radius:.25rem}:host nb-card{background-color:var(--gauzy-card-1)}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [{ type: i1.NbDialogRef }, { type: i2.TranslateService }, { type: i3.UntypedFormBuilder }, { type: i4.ProductTypeService }, { type: i4.Store }, { type: i4.ToastrService }], propDecorators: { productType: [{
                type: Input
            }] } });
//# sourceMappingURL=product-type-mutation.component.js.map