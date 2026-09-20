import { __decorate, __metadata } from "tslib";
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { Component, Input } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NbDialogRef } from '@nebular/theme';
import { Store } from '@gauzy/ui-core/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "@ngx-translate/core";
import * as i3 from "@angular/forms";
import * as i4 from "@gauzy/ui-core/core";
let ProductOptionGroupTranslationsComponent = class ProductOptionGroupTranslationsComponent extends TranslationBaseComponent {
    constructor(dialogRef, translationService, fb, store) {
        super(translationService);
        this.dialogRef = dialogRef;
        this.translationService = translationService;
        this.fb = fb;
        this.store = store;
        this.languages = [];
        this.activeGroupValueLng = '';
        this.activeOptionValueLng = '';
        this.activeOption = null;
    }
    ngOnInit() {
        this.languages = this.store.systemLanguages.map((item) => {
            return {
                value: item.code,
                name: item.name
            };
        });
        let formControls = {};
        this.languages.forEach((ln) => {
            formControls[ln.value] = [''];
        });
        this.form = this.fb.group({
            ...formControls
        });
        this.languages.forEach((lg) => {
            this.form.controls[lg.value].valueChanges
                .pipe(untilDestroyed(this), debounceTime(100), distinctUntilChanged())
                .subscribe((value) => {
                let groupTranslation = this.productOptionGroup.translations.find((tr) => {
                    return tr.languageCode == lg.value;
                });
                let optionTranslation = this.activeOption
                    ? this.activeOption.translations.find((tr) => tr.languageCode == lg.value)
                    : '';
                if (groupTranslation && this.activeGroupValueLng) {
                    groupTranslation.name = value;
                }
                else if (optionTranslation && this.activeOptionValueLng) {
                    optionTranslation.name = value;
                }
            });
        });
    }
    getGroupTitleTranslation(languageCodeInput) {
        let translation = this.productOptionGroup.translations.find((tr) => tr.languageCode == languageCodeInput);
        if (translation) {
            return translation.name;
        }
        else {
            this.productOptionGroup.translations.push({
                languageCode: languageCodeInput,
                name: ''
            });
        }
    }
    getOptionNameTranslation(option, languageCodeInput) {
        let translation = option.translations.find((tr) => tr.languageCode == languageCodeInput);
        if (translation) {
            return translation.name;
        }
        else {
            option.translations.push({
                languageCode: languageCodeInput,
                name: ''
            });
        }
    }
    setActiveGroupValueLngCode(languageCode) {
        this.form.get(languageCode).setValue('');
        this.activeGroupValueLng = languageCode;
        this.activeOptionValueLng = '';
        let newTranslation = this.productOptionGroup.translations.find((tr) => tr.languageCode == languageCode);
        if (newTranslation && newTranslation.name) {
            this.form.get(languageCode).setValue(newTranslation.name);
        }
    }
    unSetActiveGroupValueLngCode() {
        this.activeGroupValueLng = '';
    }
    isOptionGroupValueActive(languageCode) {
        return languageCode == this.activeGroupValueLng;
    }
    setActiveOptionLngCode(option, languageCode) {
        this.form.get(languageCode).setValue('');
        this.activeOptionValueLng = languageCode;
        this.activeOption = option;
        this.activeGroupValueLng = '';
        let newTranslation = option.translations.find((tr) => tr.languageCode == languageCode);
        if (newTranslation && newTranslation.name) {
            this.form.get(languageCode).setValue(newTranslation.name);
        }
    }
    unSetActiveOptionLngCode() {
        this.activeOptionValueLng = '';
        this.activeOption = null;
    }
    isOptionActive(option, languageCode) {
        if (!option || !this.activeOption)
            return;
        return this.activeOption.formOptionId == option.formOptionId && this.activeOptionValueLng == languageCode;
    }
    async onSaveRequest() {
        this.dialogRef.close(this.productOptionGroup);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProductOptionGroupTranslationsComponent, deps: [{ token: i1.NbDialogRef }, { token: i2.TranslateService }, { token: i3.UntypedFormBuilder }, { token: i4.Store }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: ProductOptionGroupTranslationsComponent, isStandalone: false, selector: "ngx-product-option-group-translation", inputs: { productOptionGroup: "productOptionGroup" }, usesInheritance: true, ngImport: i0, template: "<nb-card class=\"main\">\n  <nb-card-header class=\"d-flex flex-column\">\n    <span class=\"cancel\"\n      ><i class=\"fas fa-times\" (click)=\"dialogRef.close()\"></i\n    ></span>\n    <h5 class=\"title\">\n      {{ 'INVENTORY_PAGE.OPTION_TRANSLATIONS' | translate }}\n    </h5>\n  </nb-card-header>\n  <nb-card-body>\n    @if (form) {\n      <form [formGroup]=\"form\">\n        <!-- group title -->\n        <div class=\"row option-row\">\n          @for (ln of languages; track ln) {\n            <div class=\"col-md-3 col-sm-12\">\n              @if (!isOptionGroupValueActive(ln.value)) {\n                <div\n                  (click)=\"setActiveGroupValueLngCode(ln.value)\"\n                  class=\"option-line\"\n                  >\n                  <span class=\"language-span\">{{ ln.value }}</span\n                    >{{ getGroupTitleTranslation(ln.value) || '' }}\n                  </div>\n                }\n                @if (isOptionGroupValueActive(ln.value)) {\n                  <div class=\"input-container\">\n                    <span class=\"language-label\">{{ ln.value }}</span>\n                    <input\n                      fullWidth\n                      id=\"groupNameInput_{{ln.value}}\"\n                      type=\"text\"\n                      nbInput\n                      [formControlName]=\"ln.value\"\n                      />\n                    </div>\n                  }\n                </div>\n              }\n            </div>\n            @for (option of productOptionGroup.options; track option) {\n              <div\n                class=\"row option-row\"\n                >\n                @for (ln of languages; track ln) {\n                  <div class=\"col-md-3 col-sm-12\">\n                    @if (!isOptionActive(option, ln.value)) {\n                      <div\n                        (click)=\"setActiveOptionLngCode(option, ln.value)\"\n                        class=\"option-line\"\n                        >\n                        <span class=\"language-span\">{{ ln.value }}</span\n                          >{{ getOptionNameTranslation(option, ln.value) || '' }}\n                        </div>\n                      }\n                      @if (isOptionActive(option, ln.value)) {\n                        <div class=\"input-container\">\n                          <span class=\"language-label\">{{ ln.value }}</span>\n                          <input\n                            fullWidth\n                            id=\"groupNameInput_{{ln.value}}\"\n                            type=\"text\"\n                            nbInput\n                            [formControlName]=\"ln.value\"\n                            />\n                          </div>\n                        }\n                      </div>\n                    }\n                  </div>\n                }\n              </form>\n            }\n          </nb-card-body>\n          <nb-card-footer class=\"text-left\">\n            <button\n              (click)=\"dialogRef.close()\"\n              status=\"basic\"\n              outline\n              class=\"mr-2\"\n              nbButton\n              >\n              {{ 'BUTTONS.CANCEL' | translate }}\n            </button>\n            <button status=\"success\" nbButton (click)=\"onSaveRequest()\">\n              {{ 'BUTTONS.SAVE' | translate }}\n            </button>\n          </nb-card-footer>\n        </nb-card>\n", styles: ["@charset \"UTF-8\";:host i{cursor:pointer}:host .cancel{width:100%;display:flex}[dir=ltr] :host .cancel{justify-content:flex-end}[dir=rtl] :host .cancel{justify-content:flex-start}:host .cancel i{font-size:11px;color:var(--gauzy-text-color-1)}:host [nbButton].appearance-outline.status-basic{background-color:transparent;border-color:#f56d584d;border-width:2px;color:#f56d58}:host [nbButton].appearance-outline.status-basic:hover{border-color:#f56d58}:host [nbButton].appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #f56d580d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host .title{color:var(--text-primary-color);font-size:16px;font-weight:600;line-height:16px;letter-spacing:0em}:host [nbButton].gray.appearance-outline.status-basic{background-color:transparent;border-color:#7e7e8f4d;border-width:2px;color:#7e7e8f}:host [nbButton].gray.appearance-outline.status-basic:hover{border-color:#7e7e8f}:host [nbButton].gray.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #7e7e8f0d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].gray.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic{background-color:transparent;border-color:#25b8694d;border-width:2px;color:#25b869}:host [nbButton].green.appearance-outline.status-basic:hover{border-color:#25b869}:host [nbButton].green.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #25b8690d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].green.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic[disabled],:host [nbButton].green.appearance-outline.status-basic.btn-disabled{background-color:var(--button-outline-basic-disabled-background-color);border-color:var(--button-outline-basic-disabled-border-color);color:var(--button-outline-basic-disabled-text-color);box-shadow:unset}:host [nbButton].primary.appearance-filled.status-primary{color:var(--text-primary-color);border:unset;background-color:var(--color-primary-transparent-default);box-shadow:var(--gauzy-shadow)}[dir=ltr] :host ::ng-deep input,[dir=ltr] :host ::ng-deep textarea{text-align:start}[dir=rtl] :host ::ng-deep input,[dir=rtl] :host ::ng-deep textarea{text-align:end}:host ::ng-deep input,:host ::ng-deep nb-select.appearance-outline.status-basic .select-button,:host ::ng-deep .ng-select .ng-select-container{background-color:var(--gauzy-sidebar-background-4)!important;border:none;min-height:calc(var(--select-medium-text-line-height) + .4375rem * 2)!important}:host ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-placeholder,:host ::ng-deep .ng-select.ng-select-single .ng-select-container .ng-value-container .ng-input{top:unset!important}:host ::ng-deep label,:host ::ng-deep .label{font-size:var(--text-label-font-size);font-weight:600;line-height:.8125rem;letter-spacing:-.01em;color:var(--gauzy-text-color-2)}:host ::ng-deep textarea{background-color:var(--gauzy-sidebar-background-4)!important;border:none}:host ::ng-deep .ng-select .ng-select-container input,:host ::ng-deep nb-tag-list input{background-color:unset!important}:host nb-card{background-color:var(--gauzy-card-1)}.main{box-shadow:0 4px 12px #0000001a;border-radius:6px;overflow:hidden}.main nb-card-header{padding:1.25rem 1.5rem;border-bottom:1px solid #e9ecef;position:relative}.main nb-card-header .cancel{position:absolute;top:1.25rem;right:1.5rem;cursor:pointer;transition:opacity .2s ease}.main nb-card-header .cancel:hover{opacity:.7}.main nb-card-header .title{margin:0;font-weight:500}.main nb-card-body{padding:1.5rem}.main nb-card-body .option-row{display:flex;flex-wrap:wrap;margin:0 -.75rem 1.5rem;align-items:center}.main nb-card-body .option-row:last-child{margin-bottom:0}.main nb-card-body .option-row .col-md-3{padding:.75rem}@media(max-width:768px){.main nb-card-body .option-row .col-md-3.col-sm-12{flex:0 0 100%;max-width:100%}}.main nb-card-body .option-line{display:flex;align-items:center;padding:.75rem;border-radius:4px;border:1px solid #e9ecef;cursor:pointer;transition:background-color .2s ease;overflow:hidden}.main nb-card-body .option-line:hover{background-color:#f8f9fa}.main nb-card-body .option-line .language-span{flex-shrink:0;font-weight:600;color:#495057;margin-right:.5rem;padding-right:.5rem;border-right:1px solid #e9ecef;display:inline-block}.main nb-card-body input{width:100%;border-radius:4px;padding-left:3.5rem}.main nb-card-body input[nbInput]{padding-left:.5rem}.main nb-card-body [formControlName]{position:relative;display:block}.main nb-card-body [formControlName]:before{content:attr(formcontrolname);position:absolute;left:.75rem;top:50%;transform:translateY(-50%);font-weight:600;color:#495057;z-index:2;padding-right:.5rem;border-right:1px solid #e9ecef;pointer-events:none}.main nb-card-footer{padding:1.25rem 1.5rem;border-top:1px solid #e9ecef}.main nb-card-footer button{font-weight:500;padding:.5rem 1.25rem}.main nb-card-footer button:first-child{margin-right:.75rem}.input-container{position:relative;display:flex;align-items:center;width:100%;border:1px solid #e9ecef;border-radius:4px;overflow:hidden}.input-container .language-label{flex-shrink:0;padding:.75rem;font-weight:600;color:#495057;border-right:1px solid #e9ecef;background-color:#f8f9fa}.input-container input{flex-grow:1;border:none!important;border-radius:0!important;box-shadow:none!important}:host ::ng-deep input.nb-input{padding-left:3.5rem!important}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "component", type: i1.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "directive", type: i1.NbInputDirective, selector: "input[nbInput],textarea[nbInput]", inputs: ["fieldSize", "status", "shape", "fullWidth"] }, { kind: "component", type: i1.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i1.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "component", type: i1.NbCardFooterComponent, selector: "nb-card-footer" }, { kind: "component", type: i1.NbCardHeaderComponent, selector: "nb-card-header" }, { kind: "directive", type: i3.ɵNgNoValidate, selector: "form:not([ngNoForm]):not([ngNativeValidate])" }, { kind: "directive", type: i3.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i3.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i3.NgControlStatusGroup, selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],[formArray],form:not([ngNoForm]),[ngForm]" }, { kind: "directive", type: i3.FormGroupDirective, selector: "[formGroup]", inputs: ["formGroup"], outputs: ["ngSubmit"], exportAs: ["ngForm"] }, { kind: "directive", type: i3.FormControlName, selector: "[formControlName]", inputs: ["formControlName", "disabled", "ngModel"], outputs: ["ngModelChange"] }, { kind: "pipe", type: i2.TranslatePipe, name: "translate" }] }); }
};
ProductOptionGroupTranslationsComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [NbDialogRef,
        TranslateService,
        UntypedFormBuilder,
        Store])
], ProductOptionGroupTranslationsComponent);
export { ProductOptionGroupTranslationsComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProductOptionGroupTranslationsComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-product-option-group-translation', standalone: false, template: "<nb-card class=\"main\">\n  <nb-card-header class=\"d-flex flex-column\">\n    <span class=\"cancel\"\n      ><i class=\"fas fa-times\" (click)=\"dialogRef.close()\"></i\n    ></span>\n    <h5 class=\"title\">\n      {{ 'INVENTORY_PAGE.OPTION_TRANSLATIONS' | translate }}\n    </h5>\n  </nb-card-header>\n  <nb-card-body>\n    @if (form) {\n      <form [formGroup]=\"form\">\n        <!-- group title -->\n        <div class=\"row option-row\">\n          @for (ln of languages; track ln) {\n            <div class=\"col-md-3 col-sm-12\">\n              @if (!isOptionGroupValueActive(ln.value)) {\n                <div\n                  (click)=\"setActiveGroupValueLngCode(ln.value)\"\n                  class=\"option-line\"\n                  >\n                  <span class=\"language-span\">{{ ln.value }}</span\n                    >{{ getGroupTitleTranslation(ln.value) || '' }}\n                  </div>\n                }\n                @if (isOptionGroupValueActive(ln.value)) {\n                  <div class=\"input-container\">\n                    <span class=\"language-label\">{{ ln.value }}</span>\n                    <input\n                      fullWidth\n                      id=\"groupNameInput_{{ln.value}}\"\n                      type=\"text\"\n                      nbInput\n                      [formControlName]=\"ln.value\"\n                      />\n                    </div>\n                  }\n                </div>\n              }\n            </div>\n            @for (option of productOptionGroup.options; track option) {\n              <div\n                class=\"row option-row\"\n                >\n                @for (ln of languages; track ln) {\n                  <div class=\"col-md-3 col-sm-12\">\n                    @if (!isOptionActive(option, ln.value)) {\n                      <div\n                        (click)=\"setActiveOptionLngCode(option, ln.value)\"\n                        class=\"option-line\"\n                        >\n                        <span class=\"language-span\">{{ ln.value }}</span\n                          >{{ getOptionNameTranslation(option, ln.value) || '' }}\n                        </div>\n                      }\n                      @if (isOptionActive(option, ln.value)) {\n                        <div class=\"input-container\">\n                          <span class=\"language-label\">{{ ln.value }}</span>\n                          <input\n                            fullWidth\n                            id=\"groupNameInput_{{ln.value}}\"\n                            type=\"text\"\n                            nbInput\n                            [formControlName]=\"ln.value\"\n                            />\n                          </div>\n                        }\n                      </div>\n                    }\n                  </div>\n                }\n              </form>\n            }\n          </nb-card-body>\n          <nb-card-footer class=\"text-left\">\n            <button\n              (click)=\"dialogRef.close()\"\n              status=\"basic\"\n              outline\n              class=\"mr-2\"\n              nbButton\n              >\n              {{ 'BUTTONS.CANCEL' | translate }}\n            </button>\n            <button status=\"success\" nbButton (click)=\"onSaveRequest()\">\n              {{ 'BUTTONS.SAVE' | translate }}\n            </button>\n          </nb-card-footer>\n        </nb-card>\n", styles: ["@charset \"UTF-8\";:host i{cursor:pointer}:host .cancel{width:100%;display:flex}[dir=ltr] :host .cancel{justify-content:flex-end}[dir=rtl] :host .cancel{justify-content:flex-start}:host .cancel i{font-size:11px;color:var(--gauzy-text-color-1)}:host [nbButton].appearance-outline.status-basic{background-color:transparent;border-color:#f56d584d;border-width:2px;color:#f56d58}:host [nbButton].appearance-outline.status-basic:hover{border-color:#f56d58}:host [nbButton].appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #f56d580d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host .title{color:var(--text-primary-color);font-size:16px;font-weight:600;line-height:16px;letter-spacing:0em}:host [nbButton].gray.appearance-outline.status-basic{background-color:transparent;border-color:#7e7e8f4d;border-width:2px;color:#7e7e8f}:host [nbButton].gray.appearance-outline.status-basic:hover{border-color:#7e7e8f}:host [nbButton].gray.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #7e7e8f0d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].gray.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic{background-color:transparent;border-color:#25b8694d;border-width:2px;color:#25b869}:host [nbButton].green.appearance-outline.status-basic:hover{border-color:#25b869}:host [nbButton].green.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #25b8690d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].green.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic[disabled],:host [nbButton].green.appearance-outline.status-basic.btn-disabled{background-color:var(--button-outline-basic-disabled-background-color);border-color:var(--button-outline-basic-disabled-border-color);color:var(--button-outline-basic-disabled-text-color);box-shadow:unset}:host [nbButton].primary.appearance-filled.status-primary{color:var(--text-primary-color);border:unset;background-color:var(--color-primary-transparent-default);box-shadow:var(--gauzy-shadow)}[dir=ltr] :host ::ng-deep input,[dir=ltr] :host ::ng-deep textarea{text-align:start}[dir=rtl] :host ::ng-deep input,[dir=rtl] :host ::ng-deep textarea{text-align:end}:host ::ng-deep input,:host ::ng-deep nb-select.appearance-outline.status-basic .select-button,:host ::ng-deep .ng-select .ng-select-container{background-color:var(--gauzy-sidebar-background-4)!important;border:none;min-height:calc(var(--select-medium-text-line-height) + .4375rem * 2)!important}:host ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-placeholder,:host ::ng-deep .ng-select.ng-select-single .ng-select-container .ng-value-container .ng-input{top:unset!important}:host ::ng-deep label,:host ::ng-deep .label{font-size:var(--text-label-font-size);font-weight:600;line-height:.8125rem;letter-spacing:-.01em;color:var(--gauzy-text-color-2)}:host ::ng-deep textarea{background-color:var(--gauzy-sidebar-background-4)!important;border:none}:host ::ng-deep .ng-select .ng-select-container input,:host ::ng-deep nb-tag-list input{background-color:unset!important}:host nb-card{background-color:var(--gauzy-card-1)}.main{box-shadow:0 4px 12px #0000001a;border-radius:6px;overflow:hidden}.main nb-card-header{padding:1.25rem 1.5rem;border-bottom:1px solid #e9ecef;position:relative}.main nb-card-header .cancel{position:absolute;top:1.25rem;right:1.5rem;cursor:pointer;transition:opacity .2s ease}.main nb-card-header .cancel:hover{opacity:.7}.main nb-card-header .title{margin:0;font-weight:500}.main nb-card-body{padding:1.5rem}.main nb-card-body .option-row{display:flex;flex-wrap:wrap;margin:0 -.75rem 1.5rem;align-items:center}.main nb-card-body .option-row:last-child{margin-bottom:0}.main nb-card-body .option-row .col-md-3{padding:.75rem}@media(max-width:768px){.main nb-card-body .option-row .col-md-3.col-sm-12{flex:0 0 100%;max-width:100%}}.main nb-card-body .option-line{display:flex;align-items:center;padding:.75rem;border-radius:4px;border:1px solid #e9ecef;cursor:pointer;transition:background-color .2s ease;overflow:hidden}.main nb-card-body .option-line:hover{background-color:#f8f9fa}.main nb-card-body .option-line .language-span{flex-shrink:0;font-weight:600;color:#495057;margin-right:.5rem;padding-right:.5rem;border-right:1px solid #e9ecef;display:inline-block}.main nb-card-body input{width:100%;border-radius:4px;padding-left:3.5rem}.main nb-card-body input[nbInput]{padding-left:.5rem}.main nb-card-body [formControlName]{position:relative;display:block}.main nb-card-body [formControlName]:before{content:attr(formcontrolname);position:absolute;left:.75rem;top:50%;transform:translateY(-50%);font-weight:600;color:#495057;z-index:2;padding-right:.5rem;border-right:1px solid #e9ecef;pointer-events:none}.main nb-card-footer{padding:1.25rem 1.5rem;border-top:1px solid #e9ecef}.main nb-card-footer button{font-weight:500;padding:.5rem 1.25rem}.main nb-card-footer button:first-child{margin-right:.75rem}.input-container{position:relative;display:flex;align-items:center;width:100%;border:1px solid #e9ecef;border-radius:4px;overflow:hidden}.input-container .language-label{flex-shrink:0;padding:.75rem;font-weight:600;color:#495057;border-right:1px solid #e9ecef;background-color:#f8f9fa}.input-container input{flex-grow:1;border:none!important;border-radius:0!important;box-shadow:none!important}:host ::ng-deep input.nb-input{padding-left:3.5rem!important}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [{ type: i1.NbDialogRef }, { type: i2.TranslateService }, { type: i3.UntypedFormBuilder }, { type: i4.Store }], propDecorators: { productOptionGroup: [{
                type: Input
            }] } });
//# sourceMappingURL=product-option-group-translation.component.js.map