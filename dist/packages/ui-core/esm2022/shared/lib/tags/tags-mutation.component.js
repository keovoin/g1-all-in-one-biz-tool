import { Component, Input } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { NbDialogRef, NbThemeService } from '@nebular/theme';
import { firstValueFrom } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Store, TagTypesService, ToastrService } from '@gauzy/ui-core/core';
import { TagsService } from '@gauzy/ui-core/core';
import { NotesWithTagsComponent } from '../table-components';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "@gauzy/ui-core/core";
import * as i3 from "@angular/forms";
import * as i4 from "@ngx-translate/core";
import * as i5 from "ngx-color-picker";
export class TagsMutationComponent extends NotesWithTagsComponent {
    static buildForm(fb) {
        return fb.group({
            name: [null, Validators.required],
            color: [null, Validators.required],
            isTenantLevel: [false],
            description: [],
            tagTypeId: []
        });
    }
    get tag() {
        return this._tag;
    }
    set tag(tag) {
        this._tag = tag;
        this._patchFormValue();
    }
    /**
     * Getter fr
     * or color form control
     */
    get color() {
        return this.form.get('color').value || '';
    }
    constructor(dialogRef, tagsService, tagTypeService, fb, translateService, themeService, store, toastrService) {
        super(themeService, translateService);
        this.dialogRef = dialogRef;
        this.tagsService = tagsService;
        this.tagTypeService = tagTypeService;
        this.fb = fb;
        this.translateService = translateService;
        this.themeService = themeService;
        this.store = store;
        this.toastrService = toastrService;
        /**
         * Tag mutation form
         */
        this.form = TagsMutationComponent.buildForm(this.fb);
        /**
         * List of tag types
         */
        this.tagTypes = [];
    }
    ngOnInit() {
        this._loadTagTypes();
    }
    /**
     * Fetch all tag types from the TagTypeService
     */
    async _loadTagTypes() {
        const { tenantId } = this.store.user;
        const { id: organizationId } = this.store.selectedOrganization;
        try {
            const { items } = await this.tagTypeService.getTagTypes({
                tenantId,
                organizationId
            });
            this.tagTypes = items;
        }
        catch (error) {
            console.log(error);
            this.toastrService.danger('TAGS_PAGE.TAGS_FETCH_FAILED', 'Error fetching tag types');
        }
    }
    async addTag() {
        if (!this.store.selectedOrganization) {
            return;
        }
        const { tenantId } = this.store.user;
        const { id: organizationId } = this.store.selectedOrganization;
        const { name, description, color, isTenantLevel, tagTypeId } = this.form.getRawValue();
        const tag = await firstValueFrom(this.tagsService.create({
            name,
            description,
            color,
            tenantId,
            tagTypeId,
            ...(isTenantLevel
                ? {
                    organizationId: null
                }
                : {
                    organizationId
                })
        }));
        this.closeDialog(tag);
    }
    async editTag() {
        if (!this.store.selectedOrganization) {
            return;
        }
        const { tenantId } = this.store.user;
        const { id: organizationId } = this.store.selectedOrganization;
        const { name, description, color, isTenantLevel, tagTypeId } = this.form.getRawValue();
        const tag = await firstValueFrom(this.tagsService.update(this.tag.id, {
            name,
            description,
            color,
            tenantId,
            tagTypeId,
            ...(isTenantLevel
                ? {
                    organizationId: null
                }
                : {
                    organizationId
                })
        }));
        this.closeDialog(tag);
    }
    async closeDialog(tag) {
        this.dialogRef.close(tag);
    }
    _patchFormValue() {
        if (this.tag) {
            const { name, color, description, organizationId, tagTypeId } = this.tag;
            this.form.patchValue({
                name,
                color,
                description,
                isTenantLevel: organizationId ? false : true,
                tagTypeId
            });
        }
    }
    /**
     * On changed color input
     *
     * @param color
     */
    onChangeColor(color) {
        this.form.get('color').setValue(color);
        this.form.get('color').updateValueAndValidity();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TagsMutationComponent, deps: [{ token: i1.NbDialogRef }, { token: i2.TagsService }, { token: i2.TagTypesService }, { token: i3.UntypedFormBuilder }, { token: i4.TranslateService }, { token: i1.NbThemeService }, { token: i2.Store }, { token: i2.ToastrService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: TagsMutationComponent, isStandalone: false, selector: "ngx-tags-mutation", inputs: { tag: "tag" }, usesInheritance: true, ngImport: i0, template: "<nb-card class=\"main\">\n  <nb-card-header class=\"d-flex flex-column\">\n    <span class=\"cancel\">\n      <i class=\"fas fa-times\" (click)=\"closeDialog()\"></i>\n    </span>\n    <h5 class=\"title\">\n      {{ (tag ? 'TAGS_PAGE.EDIT_TAGS' : 'TAGS_PAGE.ADD_TAGS') | translate }}\n    </h5>\n  </nb-card-header>\n  <nb-card-body class=\"body\">\n    <form [formGroup]=\"form\">\n      <div class=\"row\">\n        <div class=\"col-sm-6\">\n          <div class=\"form-group\">\n            <label for=\"inputName\" class=\"label\">\n              {{ 'TAGS_PAGE.TAGS_SELECT_NAME' | translate }}\n            </label>\n            <input\n              formControlName=\"name\"\n              class=\"select-name\"\n              type=\"text\"\n              nbInput\n              [placeholder]=\"'TAGS_PAGE.TAGS_SELECT_NAME' | translate\"\n              id=\"inputName\"\n              fullWidth\n              />\n            </div>\n          </div>\n          <div class=\"col-sm-6\">\n            <div class=\"form-group\">\n              <label for=\"inputColor\" class=\"label\">\n                {{ 'TAGS_PAGE.TAGS_SELECT_COLOR' | translate }}\n              </label>\n              <input\n                class=\"select-color\"\n                nbInput\n                [placeholder]=\"'TAGS_PAGE.TAGS_SELECT_COLOR' | translate\"\n                formControlName=\"color\"\n                [colorPicker]=\"color\"\n                [value]=\"color\"\n                [style.background]=\"color + ' !important'\"\n                [style.color]=\"backgroundContrast(color)\"\n                (colorPickerChange)=\"onChangeColor($event)\"\n                id=\"inputColor\"\n                fullWidth\n                />\n              </div>\n            </div>\n          </div>\n          <div class=\"row\">\n            <div class=\"col\">\n              <div class=\"form-group\">\n                <nb-checkbox formControlName=\"isTenantLevel\">\n                  {{ 'TAGS_PAGE.TENANT_LEVEL' | translate }}\n                </nb-checkbox>\n              </div>\n            </div>\n          </div>\n          <div class=\"row\">\n            <div class=\"col-sm-12\">\n              <div class=\"form-group\">\n                <label for=\"inputDescription\" class=\"label\">\n                  {{ 'TAGS_PAGE.TAGS_SELECT_DESCRIPTION' | translate }}\n                </label>\n                <textarea\n                  formControlName=\"description\"\n                  nbInput\n                  fullWidth\n                  class=\"description\"\n                  [placeholder]=\"'TAGS_PAGE.TAGS_SELECT_DESCRIPTION' | translate\"\n                  id=\"inputDescription\"\n                  fullWidth\n                ></textarea>\n              </div>\n            </div>\n          </div>\n          <div class=\"row\">\n            <div class=\"col-sm-12\">\n              <div class=\"form-group\">\n                <label for=\"tagTypeId\" class=\"label\">\n                  {{ 'TAGS_PAGE.TAGS_SELECT_TYPE' | translate }}\n                </label>\n                <nb-select\n                  formControlName=\"tagTypeId\"\n                  fullWidth\n                  id=\"tagTypeId\"\n                  [placeholder]=\"'TAGS_PAGE.TAGS_SELECT_TYPE' | translate\"\n                  >\n                  @for (tagType of tagTypes; track tagType) {\n                    <nb-option [value]=\"tagType.id\">\n                      {{ tagType.type }}\n                    </nb-option>\n                  }\n                </nb-select>\n              </div>\n            </div>\n          </div>\n        </form>\n      </nb-card-body>\n      <nb-card-footer class=\"text-left\">\n        <button (click)=\"closeDialog()\" status=\"basic\" class=\"mr-3\" outline nbButton>\n          {{ 'BUTTONS.CANCEL' | translate }}\n        </button>\n        <button [disabled]=\"form.invalid\" (click)=\"tag ? editTag() : addTag()\" status=\"success\" nbButton>\n          {{ 'BUTTONS.SAVE' | translate }}\n        </button>\n      </nb-card-footer>\n    </nb-card>\n", styles: ["@charset \"UTF-8\";:host i{cursor:pointer}:host .cancel{width:100%;display:flex}[dir=ltr] :host .cancel{justify-content:flex-end}[dir=rtl] :host .cancel{justify-content:flex-start}:host .cancel i{font-size:11px;color:var(--gauzy-text-color-1)}:host [nbButton].appearance-outline.status-basic{background-color:transparent;border-color:#f56d584d;border-width:2px;color:#f56d58}:host [nbButton].appearance-outline.status-basic:hover{border-color:#f56d58}:host [nbButton].appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #f56d580d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host .title{color:var(--text-primary-color);font-size:16px;font-weight:600;line-height:16px;letter-spacing:0em}:host [nbButton].gray.appearance-outline.status-basic{background-color:transparent;border-color:#7e7e8f4d;border-width:2px;color:#7e7e8f}:host [nbButton].gray.appearance-outline.status-basic:hover{border-color:#7e7e8f}:host [nbButton].gray.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #7e7e8f0d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].gray.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic{background-color:transparent;border-color:#25b8694d;border-width:2px;color:#25b869}:host [nbButton].green.appearance-outline.status-basic:hover{border-color:#25b869}:host [nbButton].green.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #25b8690d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].green.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic[disabled],:host [nbButton].green.appearance-outline.status-basic.btn-disabled{background-color:var(--button-outline-basic-disabled-background-color);border-color:var(--button-outline-basic-disabled-border-color);color:var(--button-outline-basic-disabled-text-color);box-shadow:unset}:host [nbButton].primary.appearance-filled.status-primary{color:var(--text-primary-color);border:unset;background-color:var(--color-primary-transparent-default);box-shadow:var(--gauzy-shadow)}[dir=ltr] :host ::ng-deep input,[dir=ltr] :host ::ng-deep textarea{text-align:start}[dir=rtl] :host ::ng-deep input,[dir=rtl] :host ::ng-deep textarea{text-align:end}:host ::ng-deep input,:host ::ng-deep nb-select.appearance-outline.status-basic .select-button,:host ::ng-deep .ng-select .ng-select-container{background-color:var(--gauzy-sidebar-background-4)!important;border:none;min-height:calc(var(--select-medium-text-line-height) + .4375rem * 2)!important}:host ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-placeholder,:host ::ng-deep .ng-select.ng-select-single .ng-select-container .ng-value-container .ng-input{top:unset!important}:host ::ng-deep label,:host ::ng-deep .label{font-size:var(--text-label-font-size);font-weight:600;line-height:.8125rem;letter-spacing:-.01em;color:var(--gauzy-text-color-2)}:host ::ng-deep textarea{background-color:var(--gauzy-sidebar-background-4)!important;border:none}:host ::ng-deep .ng-select .ng-select-container input,:host ::ng-deep nb-tag-list input{background-color:unset!important}:host nb-card{background-color:var(--gauzy-card-1)}.description{height:198px}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "directive", type: i3.ɵNgNoValidate, selector: "form:not([ngNoForm]):not([ngNativeValidate])" }, { kind: "directive", type: i3.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i3.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i3.NgControlStatusGroup, selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],[formArray],form:not([ngNoForm]),[ngForm]" }, { kind: "directive", type: i3.FormGroupDirective, selector: "[formGroup]", inputs: ["formGroup"], outputs: ["ngSubmit"], exportAs: ["ngForm"] }, { kind: "directive", type: i3.FormControlName, selector: "[formControlName]", inputs: ["formControlName", "disabled", "ngModel"], outputs: ["ngModelChange"] }, { kind: "component", type: i1.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "component", type: i1.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i1.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "component", type: i1.NbCardFooterComponent, selector: "nb-card-footer" }, { kind: "component", type: i1.NbCardHeaderComponent, selector: "nb-card-header" }, { kind: "component", type: i1.NbCheckboxComponent, selector: "nb-checkbox", inputs: ["checked", "disabled", "status", "indeterminate"], outputs: ["checkedChange"] }, { kind: "directive", type: i1.NbInputDirective, selector: "input[nbInput],textarea[nbInput]", inputs: ["fieldSize", "status", "shape", "fullWidth"] }, { kind: "component", type: i1.NbSelectComponent, selector: "nb-select", inputs: ["size", "status", "shape", "appearance", "optionsListClass", "optionsPanelClass", "optionsWidth", "outline", "filled", "hero", "disabled", "fullWidth", "placeholder", "compareWith", "selected", "multiple", "optionsOverlayOffset", "scrollStrategy"], outputs: ["selectedChange"] }, { kind: "component", type: i1.NbOptionComponent, selector: "nb-option", inputs: ["value", "disabled"], outputs: ["selectionChange"] }, { kind: "directive", type: i5.ColorPickerDirective, selector: "[colorPicker]", inputs: ["colorPicker", "cpWidth", "cpHeight", "cpToggle", "cpDisabled", "cpIgnoredElements", "cpFallbackColor", "cpColorMode", "cpCmykEnabled", "cpOutputFormat", "cpAlphaChannel", "cpDisableInput", "cpDialogDisplay", "cpSaveClickOutside", "cpCloseClickOutside", "cpUseRootViewContainer", "cpPosition", "cpPositionOffset", "cpPositionRelativeToArrow", "cpOKButton", "cpOKButtonText", "cpOKButtonClass", "cpCancelButton", "cpCancelButtonText", "cpCancelButtonClass", "cpEyeDropper", "cpPresetLabel", "cpPresetColors", "cpPresetColorsClass", "cpMaxPresetColorsLength", "cpPresetEmptyMessage", "cpPresetEmptyMessageClass", "cpAddColorButton", "cpAddColorButtonText", "cpAddColorButtonClass", "cpRemoveColorButtonClass", "cpArrowPosition", "cpExtraTemplate"], outputs: ["cpInputChange", "cpToggleChange", "cpSliderChange", "cpSliderDragEnd", "cpSliderDragStart", "colorPickerOpen", "colorPickerClose", "colorPickerCancel", "colorPickerSelect", "colorPickerChange", "cpCmykColorChange", "cpPresetColorsChange"], exportAs: ["ngxColorPicker"] }, { kind: "pipe", type: i4.TranslatePipe, name: "translate" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TagsMutationComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-tags-mutation', standalone: false, template: "<nb-card class=\"main\">\n  <nb-card-header class=\"d-flex flex-column\">\n    <span class=\"cancel\">\n      <i class=\"fas fa-times\" (click)=\"closeDialog()\"></i>\n    </span>\n    <h5 class=\"title\">\n      {{ (tag ? 'TAGS_PAGE.EDIT_TAGS' : 'TAGS_PAGE.ADD_TAGS') | translate }}\n    </h5>\n  </nb-card-header>\n  <nb-card-body class=\"body\">\n    <form [formGroup]=\"form\">\n      <div class=\"row\">\n        <div class=\"col-sm-6\">\n          <div class=\"form-group\">\n            <label for=\"inputName\" class=\"label\">\n              {{ 'TAGS_PAGE.TAGS_SELECT_NAME' | translate }}\n            </label>\n            <input\n              formControlName=\"name\"\n              class=\"select-name\"\n              type=\"text\"\n              nbInput\n              [placeholder]=\"'TAGS_PAGE.TAGS_SELECT_NAME' | translate\"\n              id=\"inputName\"\n              fullWidth\n              />\n            </div>\n          </div>\n          <div class=\"col-sm-6\">\n            <div class=\"form-group\">\n              <label for=\"inputColor\" class=\"label\">\n                {{ 'TAGS_PAGE.TAGS_SELECT_COLOR' | translate }}\n              </label>\n              <input\n                class=\"select-color\"\n                nbInput\n                [placeholder]=\"'TAGS_PAGE.TAGS_SELECT_COLOR' | translate\"\n                formControlName=\"color\"\n                [colorPicker]=\"color\"\n                [value]=\"color\"\n                [style.background]=\"color + ' !important'\"\n                [style.color]=\"backgroundContrast(color)\"\n                (colorPickerChange)=\"onChangeColor($event)\"\n                id=\"inputColor\"\n                fullWidth\n                />\n              </div>\n            </div>\n          </div>\n          <div class=\"row\">\n            <div class=\"col\">\n              <div class=\"form-group\">\n                <nb-checkbox formControlName=\"isTenantLevel\">\n                  {{ 'TAGS_PAGE.TENANT_LEVEL' | translate }}\n                </nb-checkbox>\n              </div>\n            </div>\n          </div>\n          <div class=\"row\">\n            <div class=\"col-sm-12\">\n              <div class=\"form-group\">\n                <label for=\"inputDescription\" class=\"label\">\n                  {{ 'TAGS_PAGE.TAGS_SELECT_DESCRIPTION' | translate }}\n                </label>\n                <textarea\n                  formControlName=\"description\"\n                  nbInput\n                  fullWidth\n                  class=\"description\"\n                  [placeholder]=\"'TAGS_PAGE.TAGS_SELECT_DESCRIPTION' | translate\"\n                  id=\"inputDescription\"\n                  fullWidth\n                ></textarea>\n              </div>\n            </div>\n          </div>\n          <div class=\"row\">\n            <div class=\"col-sm-12\">\n              <div class=\"form-group\">\n                <label for=\"tagTypeId\" class=\"label\">\n                  {{ 'TAGS_PAGE.TAGS_SELECT_TYPE' | translate }}\n                </label>\n                <nb-select\n                  formControlName=\"tagTypeId\"\n                  fullWidth\n                  id=\"tagTypeId\"\n                  [placeholder]=\"'TAGS_PAGE.TAGS_SELECT_TYPE' | translate\"\n                  >\n                  @for (tagType of tagTypes; track tagType) {\n                    <nb-option [value]=\"tagType.id\">\n                      {{ tagType.type }}\n                    </nb-option>\n                  }\n                </nb-select>\n              </div>\n            </div>\n          </div>\n        </form>\n      </nb-card-body>\n      <nb-card-footer class=\"text-left\">\n        <button (click)=\"closeDialog()\" status=\"basic\" class=\"mr-3\" outline nbButton>\n          {{ 'BUTTONS.CANCEL' | translate }}\n        </button>\n        <button [disabled]=\"form.invalid\" (click)=\"tag ? editTag() : addTag()\" status=\"success\" nbButton>\n          {{ 'BUTTONS.SAVE' | translate }}\n        </button>\n      </nb-card-footer>\n    </nb-card>\n", styles: ["@charset \"UTF-8\";:host i{cursor:pointer}:host .cancel{width:100%;display:flex}[dir=ltr] :host .cancel{justify-content:flex-end}[dir=rtl] :host .cancel{justify-content:flex-start}:host .cancel i{font-size:11px;color:var(--gauzy-text-color-1)}:host [nbButton].appearance-outline.status-basic{background-color:transparent;border-color:#f56d584d;border-width:2px;color:#f56d58}:host [nbButton].appearance-outline.status-basic:hover{border-color:#f56d58}:host [nbButton].appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #f56d580d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host .title{color:var(--text-primary-color);font-size:16px;font-weight:600;line-height:16px;letter-spacing:0em}:host [nbButton].gray.appearance-outline.status-basic{background-color:transparent;border-color:#7e7e8f4d;border-width:2px;color:#7e7e8f}:host [nbButton].gray.appearance-outline.status-basic:hover{border-color:#7e7e8f}:host [nbButton].gray.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #7e7e8f0d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].gray.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic{background-color:transparent;border-color:#25b8694d;border-width:2px;color:#25b869}:host [nbButton].green.appearance-outline.status-basic:hover{border-color:#25b869}:host [nbButton].green.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #25b8690d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].green.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic[disabled],:host [nbButton].green.appearance-outline.status-basic.btn-disabled{background-color:var(--button-outline-basic-disabled-background-color);border-color:var(--button-outline-basic-disabled-border-color);color:var(--button-outline-basic-disabled-text-color);box-shadow:unset}:host [nbButton].primary.appearance-filled.status-primary{color:var(--text-primary-color);border:unset;background-color:var(--color-primary-transparent-default);box-shadow:var(--gauzy-shadow)}[dir=ltr] :host ::ng-deep input,[dir=ltr] :host ::ng-deep textarea{text-align:start}[dir=rtl] :host ::ng-deep input,[dir=rtl] :host ::ng-deep textarea{text-align:end}:host ::ng-deep input,:host ::ng-deep nb-select.appearance-outline.status-basic .select-button,:host ::ng-deep .ng-select .ng-select-container{background-color:var(--gauzy-sidebar-background-4)!important;border:none;min-height:calc(var(--select-medium-text-line-height) + .4375rem * 2)!important}:host ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-placeholder,:host ::ng-deep .ng-select.ng-select-single .ng-select-container .ng-value-container .ng-input{top:unset!important}:host ::ng-deep label,:host ::ng-deep .label{font-size:var(--text-label-font-size);font-weight:600;line-height:.8125rem;letter-spacing:-.01em;color:var(--gauzy-text-color-2)}:host ::ng-deep textarea{background-color:var(--gauzy-sidebar-background-4)!important;border:none}:host ::ng-deep .ng-select .ng-select-container input,:host ::ng-deep nb-tag-list input{background-color:unset!important}:host nb-card{background-color:var(--gauzy-card-1)}.description{height:198px}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [{ type: i1.NbDialogRef }, { type: i2.TagsService }, { type: i2.TagTypesService }, { type: i3.UntypedFormBuilder }, { type: i4.TranslateService }, { type: i1.NbThemeService }, { type: i2.Store }, { type: i2.ToastrService }], propDecorators: { tag: [{
                type: Input
            }] } });
//# sourceMappingURL=tags-mutation.component.js.map