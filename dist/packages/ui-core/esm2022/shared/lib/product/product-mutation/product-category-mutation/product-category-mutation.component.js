var ProductCategoryMutationComponent_1;
import { __decorate, __metadata } from "tslib";
import { Component, Input } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { LanguagesEnum } from '@gauzy/contracts';
import { TranslateService } from '@ngx-translate/core';
import { NbDialogRef } from '@nebular/theme';
import { combineLatest } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { ProductCategoryService, Store, ToastrService } from '@gauzy/ui-core/core';
import { distinctUntilChange } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "@ngx-translate/core";
import * as i3 from "@angular/forms";
import * as i4 from "@gauzy/ui-core/core";
import * as i5 from "../../../language/language-selector/language-selector.component";
import * as i6 from "../../../image-uploader/image-uploader.component";
let ProductCategoryMutationComponent = class ProductCategoryMutationComponent extends TranslationBaseComponent {
    static { ProductCategoryMutationComponent_1 = this; }
    static buildForm(fb) {
        return fb.group({
            name: [null, Validators.required],
            imageUrl: [{ value: null, disabled: true }],
            imageId: [],
            description: []
        });
    }
    constructor(dialogRef, translationService, fb, productCategoryService, store, toastrService) {
        super(translationService);
        this.dialogRef = dialogRef;
        this.translationService = translationService;
        this.fb = fb;
        this.productCategoryService = productCategoryService;
        this.store = store;
        this.toastrService = toastrService;
        this.translations = [];
        this.form = ProductCategoryMutationComponent_1.buildForm(this.fb);
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
    async onSubmit() {
        if (!this.organization || this.form.invalid) {
            return;
        }
        await this._setTranslationsRawValue();
        const { tenantId } = this.store.user;
        const { id: organizationId } = this.organization;
        const { translations = [] } = this;
        const { imageId } = this.form.value;
        const payload = {
            organizationId,
            tenantId,
            imageId,
            translations
        };
        let productCategory;
        try {
            if (!this.productCategory) {
                productCategory = await this.productCategoryService.create(payload);
            }
            else {
                payload['id'] = this.productCategory.id;
                productCategory = await this.productCategoryService.update(payload);
            }
        }
        catch (error) {
            if (error instanceof HttpErrorResponse) {
                const messages = error.error.message.join(' & ');
                this.toastrService.error(messages);
            }
        }
        this.closeDialog(productCategory);
    }
    async closeDialog(productCategory) {
        this.dialogRef.close(productCategory);
    }
    /**
     * PATCH product category old raw value
     *
     * @returns
     */
    _patchRawValue() {
        if (!this.productCategory) {
            return;
        }
        const { imageUrl, translations = [] } = this.productCategory;
        this.translations = translations;
        this.form.patchValue({ imageUrl });
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
        // Remove old translations for language code
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
    /**
     * Upload product category image
     *
     * @param image
     */
    updateImageAsset(image) {
        try {
            if (image && image.id) {
                this.form.get('imageId').setValue(image.id);
                this.form.get('imageUrl').setValue(image.fullUrl);
                this.form.updateValueAndValidity();
            }
        }
        catch (error) {
            console.log('Error while updating product category pictures');
            this.handleImageUploadError(error);
        }
    }
    handleImageUploadError(error) {
        this.toastrService.danger(error.error.message || error.message, 'TOASTR.TITLE.ERROR');
    }
    ngOnDestroy() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProductCategoryMutationComponent, deps: [{ token: i1.NbDialogRef }, { token: i2.TranslateService }, { token: i3.UntypedFormBuilder }, { token: i4.ProductCategoryService }, { token: i4.Store }, { token: i4.ToastrService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: ProductCategoryMutationComponent, isStandalone: false, selector: "ngx-product-category-mutation", inputs: { productCategory: "productCategory" }, usesInheritance: true, ngImport: i0, template: "<nb-card class=\"main\">\n\t<nb-card-header class=\"d-flex flex-column\">\n\t\t<span class=\"cancel\"><i class=\"fas fa-times\" (click)=\"dialogRef.close()\" s></i></span>\n\t\t<h5 class=\"title\">\n\t\t\t{{\n\t\t\t\t(productCategory ? 'INVENTORY_PAGE.EDIT_PRODUCT_CATEGORY' : 'INVENTORY_PAGE.ADD_PRODUCT_CATEGORY')\n\t\t\t\t\t| translate\n\t\t\t}}\n\t\t</h5>\n\t</nb-card-header>\n\t<nb-card-body>\n\t\t<form [formGroup]=\"form\" #productCategoryForm=\"ngForm\" (ngSubmit)=\"onSubmit()\">\n\t\t\t<div class=\"row mb-2\">\n\t\t\t\t<div class=\"col-md-4\">\n\t\t\t\t\t<div class=\"category-img\">\n\t\t\t\t\t\t<ngx-image-uploader\n\t\t\t\t\t\t\t[folder]=\"'inventory_product_category_pictures'\"\n\t\t\t\t\t\t\t(changeHoverState)=\"hoverState = $event\"\n\t\t\t\t\t\t\t(uploadedImageAsset)=\"updateImageAsset($event)\"\n\t\t\t\t\t\t\t(uploadImageAssetError)=\"handleImageUploadError($event)\"\n\t\t\t\t\t\t></ngx-image-uploader>\n\t\t\t\t\t\t<svg\n\t\t\t\t\t\t\txmlns=\"http://www.w3.org/2000/svg\"\n\t\t\t\t\t\t\txmlns:xlink=\"http://www.w3.org/1999/xlink\"\n\t\t\t\t\t\t\twidth=\"68\"\n\t\t\t\t\t\t\theight=\"68\"\n\t\t\t\t\t\t\tviewBox=\"0 0 68 68\"\n\t\t\t\t\t\t\t[style.opacity]=\"hoverState ? '1' : '0.3'\"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t<defs>\n\t\t\t\t\t\t\t\t<path\n\t\t\t\t\t\t\t\t\tid=\"a\"\n\t\t\t\t\t\t\t\t\td=\"M28.667 31.333a2 2 0 1 0-.002-4.001 2 2 0 0 0 .002 4.001m13.333 12H26.748l9.34-7.793c.328-.279.923-.277 1.244-.001l6.001 5.12V42c0 .736-.597 1.333-1.333 1.333M26 24.667h16c.736 0 1.333.597 1.333 1.333v11.152l-4.27-3.643c-1.32-1.122-3.386-1.122-4.694-.008l-9.702 8.096V26c0-.736.597-1.333 1.333-1.333M42 22H26c-2.205 0-4 1.795-4 4v16c0 2.205 1.795 4 4 4h16c2.205 0 4-1.795 4-4V26c0-2.205-1.795-4-4-4\"\n\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t</defs>\n\t\t\t\t\t\t\t<g fill=\"none\" fill-rule=\"evenodd\">\n\t\t\t\t\t\t\t\t<circle cx=\"34\" cy=\"34\" r=\"34\" fill=\"#0091FF\" opacity=\".3\" />\n\t\t\t\t\t\t\t\t<circle cx=\"34\" cy=\"34\" r=\"26\" fill=\"#0091FF\" opacity=\".9\" />\n\t\t\t\t\t\t\t\t<use fill=\"#FFF\" fill-rule=\"nonzero\" xlink:href=\"#a\" />\n\t\t\t\t\t\t\t</g>\n\t\t\t\t\t\t</svg>\n\t\t\t\t\t\t<div class=\"image-overlay\" [style.opacity]=\"hoverState ? '0.2' : '0'\"></div>\n\t\t\t\t\t\t@if (form.get('imageUrl').value) {\n\t\t\t\t\t\t<img\n\t\t\t\t\t\t\t[src]=\"form.get('imageUrl').value\"\n\t\t\t\t\t\t\talt=\"Category Image\"\n\t\t\t\t\t\t\tclass=\"uploadimage\"\n\t\t\t\t\t\t\t(mouseenter)=\"hoverState = true\"\n\t\t\t\t\t\t\t(mouseleave)=\"hoverState = false\"\n\t\t\t\t\t\t/>\n\t\t\t\t\t\t}\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"col-sm-8 mb-2 pr-4 col-left\">\n\t\t\t\t\t<div class=\"form-group mb-3\">\n\t\t\t\t\t\t<label class=\"label\" for=\"lang\">\n\t\t\t\t\t\t\t{{ 'INVENTORY_PAGE.LANGUAGE' | translate }}\n\t\t\t\t\t\t</label>\n\t\t\t\t\t\t<ngx-language-selector\n\t\t\t\t\t\t\t[placeholder]=\"'INVENTORY_PAGE.LANGUAGE' | translate\"\n\t\t\t\t\t\t\tclass=\"d-block\"\n\t\t\t\t\t\t\tsize=\"medium\"\n\t\t\t\t\t\t\t[template]=\"'ng-select'\"\n\t\t\t\t\t\t\t[selectedLanguageCode]=\"selectedLanguage\"\n\t\t\t\t\t\t\t(selectedLanguageEvent)=\"onLangChange($event)\"\n\t\t\t\t\t\t></ngx-language-selector>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t<label class=\"label\" for=\"name\">\n\t\t\t\t\t\t\t{{ 'INVENTORY_PAGE.NAME' | translate }}\n\t\t\t\t\t\t</label>\n\t\t\t\t\t\t<input\n\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\tid=\"name\"\n\t\t\t\t\t\t\ttype=\"text\"\n\t\t\t\t\t\t\tnbInput\n\t\t\t\t\t\t\tformControlName=\"name\"\n\t\t\t\t\t\t\t[placeholder]=\"'INVENTORY_PAGE.NAME' | translate\"\n\t\t\t\t\t\t/>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class=\"row\">\n\t\t\t\t<div class=\"col-sm-12\">\n\t\t\t\t\t<label class=\"label\" for=\"description\">{{ 'INVENTORY_PAGE.DESCRIPTION' | translate }}</label>\n\t\t\t\t\t<textarea\n\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\tid=\"description\"\n\t\t\t\t\t\tnbInput\n\t\t\t\t\t\tformControlName=\"description\"\n\t\t\t\t\t\t[placeholder]=\"'INVENTORY_PAGE.DESCRIPTION' | translate\"\n\t\t\t\t\t></textarea>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</form>\n\t</nb-card-body>\n\t<nb-card-footer class=\"text-left\">\n\t\t<button (click)=\"dialogRef.close()\" status=\"basic\" class=\"mr-2\" outline nbButton>\n\t\t\t{{ 'BUTTONS.CANCEL' | translate }}\n\t\t</button>\n\t\t<button [disabled]=\"form.invalid\" (click)=\"productCategoryForm.ngSubmit.emit()\" status=\"success\" nbButton>\n\t\t\t{{ 'BUTTONS.SAVE' | translate }}\n\t\t</button>\n\t</nb-card-footer>\n</nb-card>\n", styles: ["@charset \"UTF-8\";:host i{cursor:pointer}:host .cancel{width:100%;display:flex}[dir=ltr] :host .cancel{justify-content:flex-end}[dir=rtl] :host .cancel{justify-content:flex-start}:host .cancel i{font-size:11px;color:var(--gauzy-text-color-1)}:host [nbButton].appearance-outline.status-basic{background-color:transparent;border-color:#f56d584d;border-width:2px;color:#f56d58}:host [nbButton].appearance-outline.status-basic:hover{border-color:#f56d58}:host [nbButton].appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #f56d580d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host .title{color:var(--text-primary-color);font-size:16px;font-weight:600;line-height:16px;letter-spacing:0em}:host [nbButton].gray.appearance-outline.status-basic{background-color:transparent;border-color:#7e7e8f4d;border-width:2px;color:#7e7e8f}:host [nbButton].gray.appearance-outline.status-basic:hover{border-color:#7e7e8f}:host [nbButton].gray.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #7e7e8f0d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].gray.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic{background-color:transparent;border-color:#25b8694d;border-width:2px;color:#25b869}:host [nbButton].green.appearance-outline.status-basic:hover{border-color:#25b869}:host [nbButton].green.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #25b8690d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].green.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic[disabled],:host [nbButton].green.appearance-outline.status-basic.btn-disabled{background-color:var(--button-outline-basic-disabled-background-color);border-color:var(--button-outline-basic-disabled-border-color);color:var(--button-outline-basic-disabled-text-color);box-shadow:unset}:host [nbButton].primary.appearance-filled.status-primary{color:var(--text-primary-color);border:unset;background-color:var(--color-primary-transparent-default);box-shadow:var(--gauzy-shadow)}[dir=ltr] :host ::ng-deep input,[dir=ltr] :host ::ng-deep textarea{text-align:start}[dir=rtl] :host ::ng-deep input,[dir=rtl] :host ::ng-deep textarea{text-align:end}:host ::ng-deep input,:host ::ng-deep nb-select.appearance-outline.status-basic .select-button,:host ::ng-deep .ng-select .ng-select-container{background-color:var(--gauzy-sidebar-background-4)!important;border:none;min-height:calc(var(--select-medium-text-line-height) + .4375rem * 2)!important}:host ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-placeholder,:host ::ng-deep .ng-select.ng-select-single .ng-select-container .ng-value-container .ng-input{top:unset!important}:host ::ng-deep label,:host ::ng-deep .label{font-size:var(--text-label-font-size);font-weight:600;line-height:.8125rem;letter-spacing:-.01em;color:var(--gauzy-text-color-2)}:host ::ng-deep textarea{background-color:var(--gauzy-sidebar-background-4)!important;border:none}:host ::ng-deep .ng-select .ng-select-container input,:host ::ng-deep nb-tag-list input{background-color:unset!important}.d-bottom{display:flex;align-items:flex-end;align-content:flex-end}.options-wrap{display:flex}.option{padding:5px 10px;font-size:12px;background:#36f;border-radius:7px;color:#fff;margin-right:10px}form{max-width:500px}.category-img{width:fit-content;height:fit-content;position:relative;margin-top:20px;margin-right:30px;min-width:150px;min-height:150px;background:#e2e0e0;border-radius:13px}.category-img div{pointer-events:none;background:#000;position:absolute;height:100%;width:100%;border-radius:13px}.category-img img{height:auto;border-radius:13px;width:100%}.category-img input{width:100%;height:100%;opacity:0;position:absolute;z-index:3;cursor:pointer}.category-img svg{z-index:2;transition:opacity .2s ease-in;opacity:.3;position:absolute;top:calc(50% - 34px);left:calc(50% - 34px)}.category-img svg g circle{fill:var(--text-primary-color)}.category-img .uploadimage{min-width:150px;min-height:150px}:host nb-card{background-color:var(--gauzy-card-1)}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "component", type: i1.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "directive", type: i1.NbInputDirective, selector: "input[nbInput],textarea[nbInput]", inputs: ["fieldSize", "status", "shape", "fullWidth"] }, { kind: "component", type: i1.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i1.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "component", type: i1.NbCardFooterComponent, selector: "nb-card-footer" }, { kind: "component", type: i1.NbCardHeaderComponent, selector: "nb-card-header" }, { kind: "component", type: i5.LanguageSelectorComponent, selector: "ngx-language-selector", inputs: ["placeholder", "clearable", "addTag", "selectedLanguageCode", "selectBy", "labelForId", "template", "size"], outputs: ["selectedLanguageEvent"] }, { kind: "component", type: i6.ImageUploaderComponent, selector: "ngx-image-uploader", inputs: ["styles", "folder"], outputs: ["changeHoverState", "uploadedImageAsset", "uploadImageAssetError"] }, { kind: "directive", type: i3.ɵNgNoValidate, selector: "form:not([ngNoForm]):not([ngNativeValidate])" }, { kind: "directive", type: i3.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i3.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i3.NgControlStatusGroup, selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],[formArray],form:not([ngNoForm]),[ngForm]" }, { kind: "directive", type: i3.FormGroupDirective, selector: "[formGroup]", inputs: ["formGroup"], outputs: ["ngSubmit"], exportAs: ["ngForm"] }, { kind: "directive", type: i3.FormControlName, selector: "[formControlName]", inputs: ["formControlName", "disabled", "ngModel"], outputs: ["ngModelChange"] }, { kind: "pipe", type: i2.TranslatePipe, name: "translate" }] }); }
};
ProductCategoryMutationComponent = ProductCategoryMutationComponent_1 = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [NbDialogRef,
        TranslateService,
        UntypedFormBuilder,
        ProductCategoryService,
        Store,
        ToastrService])
], ProductCategoryMutationComponent);
export { ProductCategoryMutationComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProductCategoryMutationComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-product-category-mutation', standalone: false, template: "<nb-card class=\"main\">\n\t<nb-card-header class=\"d-flex flex-column\">\n\t\t<span class=\"cancel\"><i class=\"fas fa-times\" (click)=\"dialogRef.close()\" s></i></span>\n\t\t<h5 class=\"title\">\n\t\t\t{{\n\t\t\t\t(productCategory ? 'INVENTORY_PAGE.EDIT_PRODUCT_CATEGORY' : 'INVENTORY_PAGE.ADD_PRODUCT_CATEGORY')\n\t\t\t\t\t| translate\n\t\t\t}}\n\t\t</h5>\n\t</nb-card-header>\n\t<nb-card-body>\n\t\t<form [formGroup]=\"form\" #productCategoryForm=\"ngForm\" (ngSubmit)=\"onSubmit()\">\n\t\t\t<div class=\"row mb-2\">\n\t\t\t\t<div class=\"col-md-4\">\n\t\t\t\t\t<div class=\"category-img\">\n\t\t\t\t\t\t<ngx-image-uploader\n\t\t\t\t\t\t\t[folder]=\"'inventory_product_category_pictures'\"\n\t\t\t\t\t\t\t(changeHoverState)=\"hoverState = $event\"\n\t\t\t\t\t\t\t(uploadedImageAsset)=\"updateImageAsset($event)\"\n\t\t\t\t\t\t\t(uploadImageAssetError)=\"handleImageUploadError($event)\"\n\t\t\t\t\t\t></ngx-image-uploader>\n\t\t\t\t\t\t<svg\n\t\t\t\t\t\t\txmlns=\"http://www.w3.org/2000/svg\"\n\t\t\t\t\t\t\txmlns:xlink=\"http://www.w3.org/1999/xlink\"\n\t\t\t\t\t\t\twidth=\"68\"\n\t\t\t\t\t\t\theight=\"68\"\n\t\t\t\t\t\t\tviewBox=\"0 0 68 68\"\n\t\t\t\t\t\t\t[style.opacity]=\"hoverState ? '1' : '0.3'\"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t<defs>\n\t\t\t\t\t\t\t\t<path\n\t\t\t\t\t\t\t\t\tid=\"a\"\n\t\t\t\t\t\t\t\t\td=\"M28.667 31.333a2 2 0 1 0-.002-4.001 2 2 0 0 0 .002 4.001m13.333 12H26.748l9.34-7.793c.328-.279.923-.277 1.244-.001l6.001 5.12V42c0 .736-.597 1.333-1.333 1.333M26 24.667h16c.736 0 1.333.597 1.333 1.333v11.152l-4.27-3.643c-1.32-1.122-3.386-1.122-4.694-.008l-9.702 8.096V26c0-.736.597-1.333 1.333-1.333M42 22H26c-2.205 0-4 1.795-4 4v16c0 2.205 1.795 4 4 4h16c2.205 0 4-1.795 4-4V26c0-2.205-1.795-4-4-4\"\n\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t</defs>\n\t\t\t\t\t\t\t<g fill=\"none\" fill-rule=\"evenodd\">\n\t\t\t\t\t\t\t\t<circle cx=\"34\" cy=\"34\" r=\"34\" fill=\"#0091FF\" opacity=\".3\" />\n\t\t\t\t\t\t\t\t<circle cx=\"34\" cy=\"34\" r=\"26\" fill=\"#0091FF\" opacity=\".9\" />\n\t\t\t\t\t\t\t\t<use fill=\"#FFF\" fill-rule=\"nonzero\" xlink:href=\"#a\" />\n\t\t\t\t\t\t\t</g>\n\t\t\t\t\t\t</svg>\n\t\t\t\t\t\t<div class=\"image-overlay\" [style.opacity]=\"hoverState ? '0.2' : '0'\"></div>\n\t\t\t\t\t\t@if (form.get('imageUrl').value) {\n\t\t\t\t\t\t<img\n\t\t\t\t\t\t\t[src]=\"form.get('imageUrl').value\"\n\t\t\t\t\t\t\talt=\"Category Image\"\n\t\t\t\t\t\t\tclass=\"uploadimage\"\n\t\t\t\t\t\t\t(mouseenter)=\"hoverState = true\"\n\t\t\t\t\t\t\t(mouseleave)=\"hoverState = false\"\n\t\t\t\t\t\t/>\n\t\t\t\t\t\t}\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"col-sm-8 mb-2 pr-4 col-left\">\n\t\t\t\t\t<div class=\"form-group mb-3\">\n\t\t\t\t\t\t<label class=\"label\" for=\"lang\">\n\t\t\t\t\t\t\t{{ 'INVENTORY_PAGE.LANGUAGE' | translate }}\n\t\t\t\t\t\t</label>\n\t\t\t\t\t\t<ngx-language-selector\n\t\t\t\t\t\t\t[placeholder]=\"'INVENTORY_PAGE.LANGUAGE' | translate\"\n\t\t\t\t\t\t\tclass=\"d-block\"\n\t\t\t\t\t\t\tsize=\"medium\"\n\t\t\t\t\t\t\t[template]=\"'ng-select'\"\n\t\t\t\t\t\t\t[selectedLanguageCode]=\"selectedLanguage\"\n\t\t\t\t\t\t\t(selectedLanguageEvent)=\"onLangChange($event)\"\n\t\t\t\t\t\t></ngx-language-selector>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t<label class=\"label\" for=\"name\">\n\t\t\t\t\t\t\t{{ 'INVENTORY_PAGE.NAME' | translate }}\n\t\t\t\t\t\t</label>\n\t\t\t\t\t\t<input\n\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\tid=\"name\"\n\t\t\t\t\t\t\ttype=\"text\"\n\t\t\t\t\t\t\tnbInput\n\t\t\t\t\t\t\tformControlName=\"name\"\n\t\t\t\t\t\t\t[placeholder]=\"'INVENTORY_PAGE.NAME' | translate\"\n\t\t\t\t\t\t/>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class=\"row\">\n\t\t\t\t<div class=\"col-sm-12\">\n\t\t\t\t\t<label class=\"label\" for=\"description\">{{ 'INVENTORY_PAGE.DESCRIPTION' | translate }}</label>\n\t\t\t\t\t<textarea\n\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\tid=\"description\"\n\t\t\t\t\t\tnbInput\n\t\t\t\t\t\tformControlName=\"description\"\n\t\t\t\t\t\t[placeholder]=\"'INVENTORY_PAGE.DESCRIPTION' | translate\"\n\t\t\t\t\t></textarea>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</form>\n\t</nb-card-body>\n\t<nb-card-footer class=\"text-left\">\n\t\t<button (click)=\"dialogRef.close()\" status=\"basic\" class=\"mr-2\" outline nbButton>\n\t\t\t{{ 'BUTTONS.CANCEL' | translate }}\n\t\t</button>\n\t\t<button [disabled]=\"form.invalid\" (click)=\"productCategoryForm.ngSubmit.emit()\" status=\"success\" nbButton>\n\t\t\t{{ 'BUTTONS.SAVE' | translate }}\n\t\t</button>\n\t</nb-card-footer>\n</nb-card>\n", styles: ["@charset \"UTF-8\";:host i{cursor:pointer}:host .cancel{width:100%;display:flex}[dir=ltr] :host .cancel{justify-content:flex-end}[dir=rtl] :host .cancel{justify-content:flex-start}:host .cancel i{font-size:11px;color:var(--gauzy-text-color-1)}:host [nbButton].appearance-outline.status-basic{background-color:transparent;border-color:#f56d584d;border-width:2px;color:#f56d58}:host [nbButton].appearance-outline.status-basic:hover{border-color:#f56d58}:host [nbButton].appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #f56d580d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host .title{color:var(--text-primary-color);font-size:16px;font-weight:600;line-height:16px;letter-spacing:0em}:host [nbButton].gray.appearance-outline.status-basic{background-color:transparent;border-color:#7e7e8f4d;border-width:2px;color:#7e7e8f}:host [nbButton].gray.appearance-outline.status-basic:hover{border-color:#7e7e8f}:host [nbButton].gray.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #7e7e8f0d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].gray.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic{background-color:transparent;border-color:#25b8694d;border-width:2px;color:#25b869}:host [nbButton].green.appearance-outline.status-basic:hover{border-color:#25b869}:host [nbButton].green.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #25b8690d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].green.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic[disabled],:host [nbButton].green.appearance-outline.status-basic.btn-disabled{background-color:var(--button-outline-basic-disabled-background-color);border-color:var(--button-outline-basic-disabled-border-color);color:var(--button-outline-basic-disabled-text-color);box-shadow:unset}:host [nbButton].primary.appearance-filled.status-primary{color:var(--text-primary-color);border:unset;background-color:var(--color-primary-transparent-default);box-shadow:var(--gauzy-shadow)}[dir=ltr] :host ::ng-deep input,[dir=ltr] :host ::ng-deep textarea{text-align:start}[dir=rtl] :host ::ng-deep input,[dir=rtl] :host ::ng-deep textarea{text-align:end}:host ::ng-deep input,:host ::ng-deep nb-select.appearance-outline.status-basic .select-button,:host ::ng-deep .ng-select .ng-select-container{background-color:var(--gauzy-sidebar-background-4)!important;border:none;min-height:calc(var(--select-medium-text-line-height) + .4375rem * 2)!important}:host ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-placeholder,:host ::ng-deep .ng-select.ng-select-single .ng-select-container .ng-value-container .ng-input{top:unset!important}:host ::ng-deep label,:host ::ng-deep .label{font-size:var(--text-label-font-size);font-weight:600;line-height:.8125rem;letter-spacing:-.01em;color:var(--gauzy-text-color-2)}:host ::ng-deep textarea{background-color:var(--gauzy-sidebar-background-4)!important;border:none}:host ::ng-deep .ng-select .ng-select-container input,:host ::ng-deep nb-tag-list input{background-color:unset!important}.d-bottom{display:flex;align-items:flex-end;align-content:flex-end}.options-wrap{display:flex}.option{padding:5px 10px;font-size:12px;background:#36f;border-radius:7px;color:#fff;margin-right:10px}form{max-width:500px}.category-img{width:fit-content;height:fit-content;position:relative;margin-top:20px;margin-right:30px;min-width:150px;min-height:150px;background:#e2e0e0;border-radius:13px}.category-img div{pointer-events:none;background:#000;position:absolute;height:100%;width:100%;border-radius:13px}.category-img img{height:auto;border-radius:13px;width:100%}.category-img input{width:100%;height:100%;opacity:0;position:absolute;z-index:3;cursor:pointer}.category-img svg{z-index:2;transition:opacity .2s ease-in;opacity:.3;position:absolute;top:calc(50% - 34px);left:calc(50% - 34px)}.category-img svg g circle{fill:var(--text-primary-color)}.category-img .uploadimage{min-width:150px;min-height:150px}:host nb-card{background-color:var(--gauzy-card-1)}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [{ type: i1.NbDialogRef }, { type: i2.TranslateService }, { type: i3.UntypedFormBuilder }, { type: i4.ProductCategoryService }, { type: i4.Store }, { type: i4.ToastrService }], propDecorators: { productCategory: [{
                type: Input
            }] } });
//# sourceMappingURL=product-category-mutation.component.js.map