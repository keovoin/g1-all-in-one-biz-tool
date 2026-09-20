import { Component, Input } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { HelpCenterActionEnum, HelpCenterFlagEnum } from '@gauzy/contracts';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { Store } from '@gauzy/ui-core/core';
import { HelpCenterService } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "@ngx-translate/core";
import * as i3 from "@gauzy/ui-core/core";
import * as i4 from "@angular/forms";
import * as i5 from "ngx-color-picker";
import * as i6 from "../../language/language-selector/language-selector.component";
export class KnowledgeBaseComponent extends TranslationBaseComponent {
    get flag() {
        return this._flag;
    }
    set flag(value) {
        this._flag = value;
    }
    get parentId() {
        return this._parentId;
    }
    set parentId(value) {
        this._parentId = value;
    }
    static buildForm(formBuilder) {
        const form = formBuilder.group({
            name: ['', Validators.compose([Validators.required, Validators.maxLength(255)])],
            color: ['#d53636'],
            description: ['', Validators.maxLength(255)],
            language: ['', Validators.required],
            icon: ['', Validators.required],
            privacy: [false]
        });
        return form;
    }
    constructor(dialogRef, translateService, helpCenterService, formBuilder, store) {
        super(translateService);
        this.dialogRef = dialogRef;
        this.translateService = translateService;
        this.helpCenterService = helpCenterService;
        this.formBuilder = formBuilder;
        this.store = store;
        this.flagEnum = HelpCenterFlagEnum;
        this.actionEnum = HelpCenterActionEnum;
        this.form = KnowledgeBaseComponent.buildForm(this.formBuilder);
        this.icons = [
            {
                label: 'Book Open',
                value: 'book-open-outline'
            },
            {
                label: 'Archive',
                value: 'archive-outline'
            },
            {
                label: 'Alert Circle',
                value: 'alert-circle-outline'
            },
            {
                label: 'Attach',
                value: 'attach-outline'
            }
        ];
    }
    ngOnInit() {
        if (this.editType === HelpCenterActionEnum.EDIT) {
            this.patchValue(this.base);
        }
    }
    togglePrivacy(event) {
        this.form.patchValue({
            privacy: event
        });
    }
    selectedLanguage(event) {
        this.form.patchValue({
            language: event.code
        });
    }
    selectedColor(event) {
        this.form.patchValue({
            color: event
        });
    }
    patchValue(data) {
        const { name, description, color, language, icon, privacy } = data;
        const selectedIcon = this.icons.find((item) => item.value === icon);
        this.form.setValue({
            name,
            description,
            color,
            language,
            icon: selectedIcon,
            privacy: privacy === 'eye-outline' ? true : false
        });
        this.form.updateValueAndValidity();
    }
    async submit() {
        const { tenantId } = this.store.user;
        const { id: organizationId } = this.store.selectedOrganization;
        const { name, description, language, privacy, icon, color } = this.form.value;
        const contextRequest = {
            name,
            description,
            language,
            color,
            icon: icon.value,
            organizationId,
            tenantId,
            privacy: privacy === true ? 'eye-outline' : 'eye-off-outline'
        };
        if (this.editType === HelpCenterActionEnum.EDIT) {
            this.base = await this.helpCenterService.update(this.base.id, { ...contextRequest });
        }
        else {
            this.base = await this.helpCenterService.create({
                ...{ flag: this.flag, index: 0, children: [], parentId: this.parentId },
                ...contextRequest
            });
        }
        this.dialogRef.close(this.base);
    }
    closeDialog() {
        this.dialogRef.close();
    }
    /**
     * Getter for privacy form control value
     */
    get language() {
        return this.form.get('language').value;
    }
    /**
     * Getter for privacy form control value
     */
    get privacy() {
        return this.form.get('privacy').value;
    }
    /**
     * Getter for color form control value
     */
    get color() {
        return this.form.get('color').value;
    }
    /**
     * Getter for icon form control value
     */
    get icon() {
        return this.form.get('icon').value;
    }
    get name() {
        return this.form.get('name');
    }
    get description() {
        return this.form.get('description');
    }
    isInvalidControl(control) {
        if (!this.form.contains(control)) {
            return true;
        }
        return this.form.get(control).touched && this.form.get(control).invalid;
    }
    ngOnDestroy() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: KnowledgeBaseComponent, deps: [{ token: i1.NbDialogRef }, { token: i2.TranslateService }, { token: i3.HelpCenterService }, { token: i4.UntypedFormBuilder }, { token: i3.Store }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: KnowledgeBaseComponent, isStandalone: false, selector: "ga-knowledge-base-mutation", inputs: { base: "base", editType: "editType", flag: "flag", parentId: "parentId" }, usesInheritance: true, ngImport: i0, template: "<nb-card class=\"card\">\n\t<nb-card-header class=\"d-flex flex-column\">\n\t\t<span class=\"cancel\"><i class=\"fas fa-times\" (click)=\"closeDialog()\"></i></span>\n\t\t<h6 class=\"title\">\n\t\t\t@if (flag === flagEnum.BASE) {\n\t\t\t{{ (editType === actionEnum.EDIT ? 'HELP_PAGE.MANAGE_BASE' : 'HELP_PAGE.ADD_BASE') | translate }}\n\t\t\t} @else {\n\t\t\t{{ (editType === actionEnum.EDIT ? 'HELP_PAGE.MANAGE_CATEGORY' : 'HELP_PAGE.ADD_CATEGORY') | translate }}\n\t\t\t}\n\t\t</h6>\n\t</nb-card-header>\n\t<nb-card-body class=\"card-body\">\n\t\t<form [formGroup]=\"form\" (ngSubmit)=\"submit()\" #knowledgeBaseForm=\"ngForm\">\n\t\t\t<div class=\"row\">\n\t\t\t\t<div class=\"col-12\">\n\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t<label id=\"language\" class=\"label\">{{ 'HELP_PAGE.LANGUAGE' | translate }}</label>\n\t\t\t\t\t\t<ngx-language-selector\n\t\t\t\t\t\t\t[placeholder]=\"'FORM.PLACEHOLDERS.SELECT' | translate\"\n\t\t\t\t\t\t\t[clearable]=\"false\"\n\t\t\t\t\t\t\t[addTag]=\"false\"\n\t\t\t\t\t\t\t[selectedLanguageCode]=\"language\"\n\t\t\t\t\t\t\ttemplate=\"ng-select\"\n\t\t\t\t\t\t\tselectBy=\"object\"\n\t\t\t\t\t\t\t(selectedLanguageEvent)=\"selectedLanguage($event)\"\n\t\t\t\t\t\t></ngx-language-selector>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"col-12\">\n\t\t\t\t\t<div class=\"form-group mt-2 mb-2\">\n\t\t\t\t\t\t<nb-toggle\n\t\t\t\t\t\t\tstatus=\"primary\"\n\t\t\t\t\t\t\tlabelPosition=\"start\"\n\t\t\t\t\t\t\t[checked]=\"privacy\"\n\t\t\t\t\t\t\t(checkedChange)=\"togglePrivacy($event)\"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t<span>\n\t\t\t\t\t\t\t\t{{ 'HELP_PAGE.PUBLISH_STATUS' | translate }}\n\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t</nb-toggle>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"col-12\">\n\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t<label id=\"icon\" class=\"label\">{{ 'HELP_PAGE.CHOSE_ICON' | translate }}</label>\n\t\t\t\t\t\t<nb-select\n\t\t\t\t\t\t\t[placeholder]=\"'FORM.PLACEHOLDERS.SELECT_ICON' | translate\"\n\t\t\t\t\t\t\tformControlName=\"icon\"\n\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\tid=\"icon\"\n\t\t\t\t\t\t\t[status]=\"isInvalidControl('icon') ? 'danger' : 'basic'\"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t@if (icon) {\n\t\t\t\t\t\t\t<nb-select-label>\n\t\t\t\t\t\t\t\t<nb-icon [style.color]=\"'inherit'\" class=\"mr-1\" [icon]=\"icon.value\"></nb-icon\n\t\t\t\t\t\t\t\t>{{ icon.label }}\n\t\t\t\t\t\t\t</nb-select-label>\n\t\t\t\t\t\t\t} @for (icon of icons; track icon) {\n\t\t\t\t\t\t\t<nb-option [value]=\"icon\">\n\t\t\t\t\t\t\t\t<nb-icon class=\"mr-1\" [icon]=\"icon.value\"></nb-icon>\n\t\t\t\t\t\t\t\t{{ icon.label }}\n\t\t\t\t\t\t\t</nb-option>\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t</nb-select>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"col-12\">\n\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t<label id=\"color\" class=\"label\">{{ 'HELP_PAGE.COLOR' | translate }}</label>\n\t\t\t\t\t\t<input\n\t\t\t\t\t\t\tformControlName=\"color\"\n\t\t\t\t\t\t\t[placeholder]=\"'HELP_PAGE.COLOR' | translate\"\n\t\t\t\t\t\t\t[colorPicker]=\"color\"\n\t\t\t\t\t\t\t[value]=\"color\"\n\t\t\t\t\t\t\t(colorPickerChange)=\"selectedColor($event)\"\n\t\t\t\t\t\t\t[style.background]=\"color + ' !important'\"\n\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\tnbInput\n\t\t\t\t\t\t\tid=\"color\"\n\t\t\t\t\t\t/>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"col-12\">\n\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t<label id=\"name\" class=\"label\">\n\t\t\t\t\t\t\t{{\n\t\t\t\t\t\t\t\t(flag === 'base' ? 'HELP_PAGE.NAME_OF_THE_BASE' : 'HELP_PAGE.NAME_CATEGORY') | translate\n\t\t\t\t\t\t\t}}\n\t\t\t\t\t\t</label>\n\t\t\t\t\t\t<input\n\t\t\t\t\t\t\tformControlName=\"name\"\n\t\t\t\t\t\t\t[placeholder]=\"\n\t\t\t\t\t\t\t\t(flag === 'base' ? 'HELP_PAGE.NAME_OF_THE_BASE' : 'HELP_PAGE.NAME_CATEGORY') | translate\n\t\t\t\t\t\t\t\"\n\t\t\t\t\t\t\ttype=\"text\"\n\t\t\t\t\t\t\tsize=\"24\"\n\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\tnbInput\n\t\t\t\t\t\t\tid=\"name\"\n\t\t\t\t\t\t\t[status]=\"isInvalidControl('name') ? 'danger' : 'basic'\"\n\t\t\t\t\t\t\tclass=\"mb-1\"\n\t\t\t\t\t\t/>\n\t\t\t\t\t\t@if (name.touched && name.hasError('required')) {\n\t\t\t\t\t\t<div class=\"caption status-danger\">\n\t\t\t\t\t\t\t{{ 'HELP_PAGE.ERRORS.NAME_REQUIRE' | translate }}\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t} @if (name.hasError('maxlength')) {\n\t\t\t\t\t\t<div class=\"caption status-danger\">\n\t\t\t\t\t\t\t{{ 'HELP_PAGE.ERRORS.MAXIMUM_LENGTH' | translate }}\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t}\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"col-12\">\n\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t<label id=\"description\" class=\"label\">\n\t\t\t\t\t\t\t{{ 'HELP_PAGE.DESCRIPTION' | translate }}\n\t\t\t\t\t\t</label>\n\t\t\t\t\t\t<input\n\t\t\t\t\t\t\tformControlName=\"description\"\n\t\t\t\t\t\t\t[placeholder]=\"'HELP_PAGE.DESCRIPTION' | translate\"\n\t\t\t\t\t\t\ttype=\"text\"\n\t\t\t\t\t\t\tsize=\"30\"\n\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\tnbInput\n\t\t\t\t\t\t\tid=\"description\"\n\t\t\t\t\t\t\tclass=\"mb-1\"\n\t\t\t\t\t\t/>\n\t\t\t\t\t\t@if (description.hasError('maxlength')) {\n\t\t\t\t\t\t<div class=\"caption status-danger\">\n\t\t\t\t\t\t\t{{ 'HELP_PAGE.ERRORS.MAXIMUM_LENGTH' | translate }}\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t}\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</form>\n\t</nb-card-body>\n\t<nb-card-footer class=\"text-left\">\n\t\t<button status=\"success\" (click)=\"knowledgeBaseForm.ngSubmit.emit()\" [disabled]=\"form.invalid\" nbButton>\n\t\t\t{{ 'BUTTONS.SAVE' | translate }}\n\t\t</button>\n\t</nb-card-footer>\n</nb-card>\n", styles: ["@charset \"UTF-8\";:host i{cursor:pointer}:host .cancel{width:100%;display:flex}[dir=ltr] :host .cancel{justify-content:flex-end}[dir=rtl] :host .cancel{justify-content:flex-start}:host .cancel i{font-size:11px;color:var(--gauzy-text-color-1)}:host [nbButton].appearance-outline.status-basic{background-color:transparent;border-color:#f56d584d;border-width:2px;color:#f56d58}:host [nbButton].appearance-outline.status-basic:hover{border-color:#f56d58}:host [nbButton].appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #f56d580d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host .title{color:var(--text-primary-color);font-size:16px;font-weight:600;line-height:16px;letter-spacing:0em}:host [nbButton].gray.appearance-outline.status-basic{background-color:transparent;border-color:#7e7e8f4d;border-width:2px;color:#7e7e8f}:host [nbButton].gray.appearance-outline.status-basic:hover{border-color:#7e7e8f}:host [nbButton].gray.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #7e7e8f0d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].gray.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic{background-color:transparent;border-color:#25b8694d;border-width:2px;color:#25b869}:host [nbButton].green.appearance-outline.status-basic:hover{border-color:#25b869}:host [nbButton].green.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #25b8690d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].green.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic[disabled],:host [nbButton].green.appearance-outline.status-basic.btn-disabled{background-color:var(--button-outline-basic-disabled-background-color);border-color:var(--button-outline-basic-disabled-border-color);color:var(--button-outline-basic-disabled-text-color);box-shadow:unset}:host [nbButton].primary.appearance-filled.status-primary{color:var(--text-primary-color);border:unset;background-color:var(--color-primary-transparent-default);box-shadow:var(--gauzy-shadow)}[dir=ltr] :host ::ng-deep input,[dir=ltr] :host ::ng-deep textarea{text-align:start}[dir=rtl] :host ::ng-deep input,[dir=rtl] :host ::ng-deep textarea{text-align:end}:host ::ng-deep input,:host ::ng-deep nb-select.appearance-outline.status-basic .select-button,:host ::ng-deep .ng-select .ng-select-container{background-color:var(--gauzy-sidebar-background-4)!important;border:none;min-height:calc(var(--select-medium-text-line-height) + .4375rem * 2)!important}:host ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-placeholder,:host ::ng-deep .ng-select.ng-select-single .ng-select-container .ng-value-container .ng-input{top:unset!important}:host ::ng-deep label,:host ::ng-deep .label{font-size:var(--text-label-font-size);font-weight:600;line-height:.8125rem;letter-spacing:-.01em;color:var(--gauzy-text-color-2)}:host ::ng-deep textarea{background-color:var(--gauzy-sidebar-background-4)!important;border:none}:host ::ng-deep .ng-select .ng-select-container input,:host ::ng-deep nb-tag-list input{background-color:unset!important}:host nb-card{background-color:var(--gauzy-card-1)}.card{display:flex;flex-direction:column;width:500px;background-color:var(--gauzy-card-1);border-radius:var(--border-radius)}.card nb-card-body.card-body nb-toggle span{font-size:.75rem;font-weight:700;line-height:1rem;margin:0}:host input,:host ::ng-deep nb-select.appearance-outline.status-basic .select-button,:host ::ng-deep .ng-select .ng-select-container{background-color:var(--gauzy-sidebar-background-4)!important;border:unset}:host ::ng-deep .ng-select .ng-select-container input{background-color:unset!important}:host ::ng-deep .toggle{border:1px solid #7E7E8F!important;background-color:#7e7e8f!important}:host ::ng-deep .toggle.checked{background-color:var(--text-primary-color)!important;border:1px solid var(--text-primary-color)!important}:host ::ng-deep .toggle.checked+span{color:var(--text-primary-color)}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "directive", type: i4.ɵNgNoValidate, selector: "form:not([ngNoForm]):not([ngNativeValidate])" }, { kind: "directive", type: i4.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i4.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i4.NgControlStatusGroup, selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],[formArray],form:not([ngNoForm]),[ngForm]" }, { kind: "directive", type: i4.FormGroupDirective, selector: "[formGroup]", inputs: ["formGroup"], outputs: ["ngSubmit"], exportAs: ["ngForm"] }, { kind: "directive", type: i4.FormControlName, selector: "[formControlName]", inputs: ["formControlName", "disabled", "ngModel"], outputs: ["ngModelChange"] }, { kind: "component", type: i1.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "component", type: i1.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i1.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "component", type: i1.NbCardFooterComponent, selector: "nb-card-footer" }, { kind: "component", type: i1.NbCardHeaderComponent, selector: "nb-card-header" }, { kind: "component", type: i1.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "directive", type: i1.NbInputDirective, selector: "input[nbInput],textarea[nbInput]", inputs: ["fieldSize", "status", "shape", "fullWidth"] }, { kind: "component", type: i1.NbSelectComponent, selector: "nb-select", inputs: ["size", "status", "shape", "appearance", "optionsListClass", "optionsPanelClass", "optionsWidth", "outline", "filled", "hero", "disabled", "fullWidth", "placeholder", "compareWith", "selected", "multiple", "optionsOverlayOffset", "scrollStrategy"], outputs: ["selectedChange"] }, { kind: "component", type: i1.NbSelectLabelComponent, selector: "nb-select-label" }, { kind: "component", type: i1.NbOptionComponent, selector: "nb-option", inputs: ["value", "disabled"], outputs: ["selectionChange"] }, { kind: "component", type: i1.NbToggleComponent, selector: "nb-toggle", inputs: ["checked", "disabled", "status", "labelPosition"], outputs: ["checkedChange"] }, { kind: "directive", type: i5.ColorPickerDirective, selector: "[colorPicker]", inputs: ["colorPicker", "cpWidth", "cpHeight", "cpToggle", "cpDisabled", "cpIgnoredElements", "cpFallbackColor", "cpColorMode", "cpCmykEnabled", "cpOutputFormat", "cpAlphaChannel", "cpDisableInput", "cpDialogDisplay", "cpSaveClickOutside", "cpCloseClickOutside", "cpUseRootViewContainer", "cpPosition", "cpPositionOffset", "cpPositionRelativeToArrow", "cpOKButton", "cpOKButtonText", "cpOKButtonClass", "cpCancelButton", "cpCancelButtonText", "cpCancelButtonClass", "cpEyeDropper", "cpPresetLabel", "cpPresetColors", "cpPresetColorsClass", "cpMaxPresetColorsLength", "cpPresetEmptyMessage", "cpPresetEmptyMessageClass", "cpAddColorButton", "cpAddColorButtonText", "cpAddColorButtonClass", "cpRemoveColorButtonClass", "cpArrowPosition", "cpExtraTemplate"], outputs: ["cpInputChange", "cpToggleChange", "cpSliderChange", "cpSliderDragEnd", "cpSliderDragStart", "colorPickerOpen", "colorPickerClose", "colorPickerCancel", "colorPickerSelect", "colorPickerChange", "cpCmykColorChange", "cpPresetColorsChange"], exportAs: ["ngxColorPicker"] }, { kind: "component", type: i6.LanguageSelectorComponent, selector: "ngx-language-selector", inputs: ["placeholder", "clearable", "addTag", "selectedLanguageCode", "selectBy", "labelForId", "template", "size"], outputs: ["selectedLanguageEvent"] }, { kind: "pipe", type: i2.TranslatePipe, name: "translate" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: KnowledgeBaseComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-knowledge-base-mutation', standalone: false, template: "<nb-card class=\"card\">\n\t<nb-card-header class=\"d-flex flex-column\">\n\t\t<span class=\"cancel\"><i class=\"fas fa-times\" (click)=\"closeDialog()\"></i></span>\n\t\t<h6 class=\"title\">\n\t\t\t@if (flag === flagEnum.BASE) {\n\t\t\t{{ (editType === actionEnum.EDIT ? 'HELP_PAGE.MANAGE_BASE' : 'HELP_PAGE.ADD_BASE') | translate }}\n\t\t\t} @else {\n\t\t\t{{ (editType === actionEnum.EDIT ? 'HELP_PAGE.MANAGE_CATEGORY' : 'HELP_PAGE.ADD_CATEGORY') | translate }}\n\t\t\t}\n\t\t</h6>\n\t</nb-card-header>\n\t<nb-card-body class=\"card-body\">\n\t\t<form [formGroup]=\"form\" (ngSubmit)=\"submit()\" #knowledgeBaseForm=\"ngForm\">\n\t\t\t<div class=\"row\">\n\t\t\t\t<div class=\"col-12\">\n\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t<label id=\"language\" class=\"label\">{{ 'HELP_PAGE.LANGUAGE' | translate }}</label>\n\t\t\t\t\t\t<ngx-language-selector\n\t\t\t\t\t\t\t[placeholder]=\"'FORM.PLACEHOLDERS.SELECT' | translate\"\n\t\t\t\t\t\t\t[clearable]=\"false\"\n\t\t\t\t\t\t\t[addTag]=\"false\"\n\t\t\t\t\t\t\t[selectedLanguageCode]=\"language\"\n\t\t\t\t\t\t\ttemplate=\"ng-select\"\n\t\t\t\t\t\t\tselectBy=\"object\"\n\t\t\t\t\t\t\t(selectedLanguageEvent)=\"selectedLanguage($event)\"\n\t\t\t\t\t\t></ngx-language-selector>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"col-12\">\n\t\t\t\t\t<div class=\"form-group mt-2 mb-2\">\n\t\t\t\t\t\t<nb-toggle\n\t\t\t\t\t\t\tstatus=\"primary\"\n\t\t\t\t\t\t\tlabelPosition=\"start\"\n\t\t\t\t\t\t\t[checked]=\"privacy\"\n\t\t\t\t\t\t\t(checkedChange)=\"togglePrivacy($event)\"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t<span>\n\t\t\t\t\t\t\t\t{{ 'HELP_PAGE.PUBLISH_STATUS' | translate }}\n\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t</nb-toggle>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"col-12\">\n\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t<label id=\"icon\" class=\"label\">{{ 'HELP_PAGE.CHOSE_ICON' | translate }}</label>\n\t\t\t\t\t\t<nb-select\n\t\t\t\t\t\t\t[placeholder]=\"'FORM.PLACEHOLDERS.SELECT_ICON' | translate\"\n\t\t\t\t\t\t\tformControlName=\"icon\"\n\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\tid=\"icon\"\n\t\t\t\t\t\t\t[status]=\"isInvalidControl('icon') ? 'danger' : 'basic'\"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t@if (icon) {\n\t\t\t\t\t\t\t<nb-select-label>\n\t\t\t\t\t\t\t\t<nb-icon [style.color]=\"'inherit'\" class=\"mr-1\" [icon]=\"icon.value\"></nb-icon\n\t\t\t\t\t\t\t\t>{{ icon.label }}\n\t\t\t\t\t\t\t</nb-select-label>\n\t\t\t\t\t\t\t} @for (icon of icons; track icon) {\n\t\t\t\t\t\t\t<nb-option [value]=\"icon\">\n\t\t\t\t\t\t\t\t<nb-icon class=\"mr-1\" [icon]=\"icon.value\"></nb-icon>\n\t\t\t\t\t\t\t\t{{ icon.label }}\n\t\t\t\t\t\t\t</nb-option>\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t</nb-select>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"col-12\">\n\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t<label id=\"color\" class=\"label\">{{ 'HELP_PAGE.COLOR' | translate }}</label>\n\t\t\t\t\t\t<input\n\t\t\t\t\t\t\tformControlName=\"color\"\n\t\t\t\t\t\t\t[placeholder]=\"'HELP_PAGE.COLOR' | translate\"\n\t\t\t\t\t\t\t[colorPicker]=\"color\"\n\t\t\t\t\t\t\t[value]=\"color\"\n\t\t\t\t\t\t\t(colorPickerChange)=\"selectedColor($event)\"\n\t\t\t\t\t\t\t[style.background]=\"color + ' !important'\"\n\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\tnbInput\n\t\t\t\t\t\t\tid=\"color\"\n\t\t\t\t\t\t/>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"col-12\">\n\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t<label id=\"name\" class=\"label\">\n\t\t\t\t\t\t\t{{\n\t\t\t\t\t\t\t\t(flag === 'base' ? 'HELP_PAGE.NAME_OF_THE_BASE' : 'HELP_PAGE.NAME_CATEGORY') | translate\n\t\t\t\t\t\t\t}}\n\t\t\t\t\t\t</label>\n\t\t\t\t\t\t<input\n\t\t\t\t\t\t\tformControlName=\"name\"\n\t\t\t\t\t\t\t[placeholder]=\"\n\t\t\t\t\t\t\t\t(flag === 'base' ? 'HELP_PAGE.NAME_OF_THE_BASE' : 'HELP_PAGE.NAME_CATEGORY') | translate\n\t\t\t\t\t\t\t\"\n\t\t\t\t\t\t\ttype=\"text\"\n\t\t\t\t\t\t\tsize=\"24\"\n\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\tnbInput\n\t\t\t\t\t\t\tid=\"name\"\n\t\t\t\t\t\t\t[status]=\"isInvalidControl('name') ? 'danger' : 'basic'\"\n\t\t\t\t\t\t\tclass=\"mb-1\"\n\t\t\t\t\t\t/>\n\t\t\t\t\t\t@if (name.touched && name.hasError('required')) {\n\t\t\t\t\t\t<div class=\"caption status-danger\">\n\t\t\t\t\t\t\t{{ 'HELP_PAGE.ERRORS.NAME_REQUIRE' | translate }}\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t} @if (name.hasError('maxlength')) {\n\t\t\t\t\t\t<div class=\"caption status-danger\">\n\t\t\t\t\t\t\t{{ 'HELP_PAGE.ERRORS.MAXIMUM_LENGTH' | translate }}\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t}\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"col-12\">\n\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t<label id=\"description\" class=\"label\">\n\t\t\t\t\t\t\t{{ 'HELP_PAGE.DESCRIPTION' | translate }}\n\t\t\t\t\t\t</label>\n\t\t\t\t\t\t<input\n\t\t\t\t\t\t\tformControlName=\"description\"\n\t\t\t\t\t\t\t[placeholder]=\"'HELP_PAGE.DESCRIPTION' | translate\"\n\t\t\t\t\t\t\ttype=\"text\"\n\t\t\t\t\t\t\tsize=\"30\"\n\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\tnbInput\n\t\t\t\t\t\t\tid=\"description\"\n\t\t\t\t\t\t\tclass=\"mb-1\"\n\t\t\t\t\t\t/>\n\t\t\t\t\t\t@if (description.hasError('maxlength')) {\n\t\t\t\t\t\t<div class=\"caption status-danger\">\n\t\t\t\t\t\t\t{{ 'HELP_PAGE.ERRORS.MAXIMUM_LENGTH' | translate }}\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t}\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</form>\n\t</nb-card-body>\n\t<nb-card-footer class=\"text-left\">\n\t\t<button status=\"success\" (click)=\"knowledgeBaseForm.ngSubmit.emit()\" [disabled]=\"form.invalid\" nbButton>\n\t\t\t{{ 'BUTTONS.SAVE' | translate }}\n\t\t</button>\n\t</nb-card-footer>\n</nb-card>\n", styles: ["@charset \"UTF-8\";:host i{cursor:pointer}:host .cancel{width:100%;display:flex}[dir=ltr] :host .cancel{justify-content:flex-end}[dir=rtl] :host .cancel{justify-content:flex-start}:host .cancel i{font-size:11px;color:var(--gauzy-text-color-1)}:host [nbButton].appearance-outline.status-basic{background-color:transparent;border-color:#f56d584d;border-width:2px;color:#f56d58}:host [nbButton].appearance-outline.status-basic:hover{border-color:#f56d58}:host [nbButton].appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #f56d580d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host .title{color:var(--text-primary-color);font-size:16px;font-weight:600;line-height:16px;letter-spacing:0em}:host [nbButton].gray.appearance-outline.status-basic{background-color:transparent;border-color:#7e7e8f4d;border-width:2px;color:#7e7e8f}:host [nbButton].gray.appearance-outline.status-basic:hover{border-color:#7e7e8f}:host [nbButton].gray.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #7e7e8f0d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].gray.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic{background-color:transparent;border-color:#25b8694d;border-width:2px;color:#25b869}:host [nbButton].green.appearance-outline.status-basic:hover{border-color:#25b869}:host [nbButton].green.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #25b8690d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].green.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic[disabled],:host [nbButton].green.appearance-outline.status-basic.btn-disabled{background-color:var(--button-outline-basic-disabled-background-color);border-color:var(--button-outline-basic-disabled-border-color);color:var(--button-outline-basic-disabled-text-color);box-shadow:unset}:host [nbButton].primary.appearance-filled.status-primary{color:var(--text-primary-color);border:unset;background-color:var(--color-primary-transparent-default);box-shadow:var(--gauzy-shadow)}[dir=ltr] :host ::ng-deep input,[dir=ltr] :host ::ng-deep textarea{text-align:start}[dir=rtl] :host ::ng-deep input,[dir=rtl] :host ::ng-deep textarea{text-align:end}:host ::ng-deep input,:host ::ng-deep nb-select.appearance-outline.status-basic .select-button,:host ::ng-deep .ng-select .ng-select-container{background-color:var(--gauzy-sidebar-background-4)!important;border:none;min-height:calc(var(--select-medium-text-line-height) + .4375rem * 2)!important}:host ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-placeholder,:host ::ng-deep .ng-select.ng-select-single .ng-select-container .ng-value-container .ng-input{top:unset!important}:host ::ng-deep label,:host ::ng-deep .label{font-size:var(--text-label-font-size);font-weight:600;line-height:.8125rem;letter-spacing:-.01em;color:var(--gauzy-text-color-2)}:host ::ng-deep textarea{background-color:var(--gauzy-sidebar-background-4)!important;border:none}:host ::ng-deep .ng-select .ng-select-container input,:host ::ng-deep nb-tag-list input{background-color:unset!important}:host nb-card{background-color:var(--gauzy-card-1)}.card{display:flex;flex-direction:column;width:500px;background-color:var(--gauzy-card-1);border-radius:var(--border-radius)}.card nb-card-body.card-body nb-toggle span{font-size:.75rem;font-weight:700;line-height:1rem;margin:0}:host input,:host ::ng-deep nb-select.appearance-outline.status-basic .select-button,:host ::ng-deep .ng-select .ng-select-container{background-color:var(--gauzy-sidebar-background-4)!important;border:unset}:host ::ng-deep .ng-select .ng-select-container input{background-color:unset!important}:host ::ng-deep .toggle{border:1px solid #7E7E8F!important;background-color:#7e7e8f!important}:host ::ng-deep .toggle.checked{background-color:var(--text-primary-color)!important;border:1px solid var(--text-primary-color)!important}:host ::ng-deep .toggle.checked+span{color:var(--text-primary-color)}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [{ type: i1.NbDialogRef }, { type: i2.TranslateService }, { type: i3.HelpCenterService }, { type: i4.UntypedFormBuilder }, { type: i3.Store }], propDecorators: { base: [{
                type: Input
            }], editType: [{
                type: Input
            }], flag: [{
                type: Input
            }], parentId: [{
                type: Input
            }] } });
//# sourceMappingURL=knowledge-base.component.js.map