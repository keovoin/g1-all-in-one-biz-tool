var ProposalTemplateFormComponent_1;
import { __decorate, __metadata } from "tslib";
import { Component, Input } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslateService } from '@ngx-translate/core';
import { filter, tap } from 'rxjs/operators';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { distinctUntilChange } from '@gauzy/ui-core/common';
import { ErrorHandlingService, ProposalTemplateService, Store, ToastrService } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
import * as i2 from "@nebular/theme";
import * as i3 from "@angular/forms";
import * as i4 from "@gauzy/ui-core/core";
import * as i5 from "@gauzy/ui-core/shared";
let ProposalTemplateFormComponent = class ProposalTemplateFormComponent extends TranslationBaseComponent {
    static { ProposalTemplateFormComponent_1 = this; }
    static buildForm(fb) {
        return fb.group({
            employeeId: [null, Validators.required],
            name: [null, Validators.required],
            content: []
        });
    }
    get selectedEmployee() {
        return this._selectedEmployee;
    }
    set selectedEmployee(employee) {
        this._selectedEmployee = employee;
        /**
         * Set default select employee
         */
        if (employee?.id && this.form.get('employeeId')) {
            this.form.get('employeeId').setValue(employee.id);
            this.form.get('employeeId').updateValueAndValidity();
        }
    }
    get proposalTemplate() {
        return this._proposalTemplate;
    }
    set proposalTemplate(value) {
        this._proposalTemplate = value;
    }
    constructor(translateService, _dialogRef, _fb, _proposalTemplateService, _toastrService, _store, _errorHandlingService) {
        super(translateService);
        this._dialogRef = _dialogRef;
        this._fb = _fb;
        this._proposalTemplateService = _proposalTemplateService;
        this._toastrService = _toastrService;
        this._store = _store;
        this._errorHandlingService = _errorHandlingService;
        this.form = ProposalTemplateFormComponent_1.buildForm(this._fb);
    }
    ngOnInit() {
        this._store.selectedOrganization$
            .pipe(distinctUntilChange(), filter((organization) => !!organization), tap((organization) => (this.organization = organization)), tap(() => this._setFormValues()), untilDestroyed(this))
            .subscribe();
    }
    /**
     * Set form values based on the selected proposal template.
     */
    _setFormValues() {
        if (!this.proposalTemplate)
            return;
        const { employeeId, name, content } = this.proposalTemplate;
        this.form.patchValue({ employeeId, name, content });
        this.form.updateValueAndValidity();
    }
    /**
     * Close the dialog.
     */
    close() {
        this._dialogRef.close();
    }
    /**
     * Saves the proposal template.
     * @returns {Promise<void>}
     */
    async onSave() {
        if (!this.organization || this.form.invalid)
            return;
        // Get the organization and tenant ID
        const { id: organizationId, tenantId } = this.organization;
        // Create a new object with the form values
        const request = {
            organizationId,
            tenantId,
            // Only include employeeId if creating a new proposal template
            ...(this.proposalTemplate ? {} : { employeeId: this.selectedEmployee?.id ?? this.form.value.employeeId }),
            ...this.form.value
        };
        try {
            // Call the create or update method of the proposalTemplateService
            const data = !this.proposalTemplate
                ? await this._proposalTemplateService.create(request)
                : await this._proposalTemplateService.update(this.proposalTemplate.id, request);
            this._dialogRef.close(data);
            const messageKey = !this.proposalTemplate
                ? 'PROPOSAL_TEMPLATE.PROPOSAL_CREATE_MESSAGE'
                : 'PROPOSAL_TEMPLATE.PROPOSAL_EDIT_MESSAGE';
            this._toastrService.success(messageKey, { name: request.name });
        }
        catch (error) {
            console.log('Error while saving proposal template', error);
            this._errorHandlingService.handleError(error);
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProposalTemplateFormComponent, deps: [{ token: i1.TranslateService }, { token: i2.NbDialogRef }, { token: i3.UntypedFormBuilder }, { token: i4.ProposalTemplateService }, { token: i4.ToastrService }, { token: i4.Store }, { token: i4.ErrorHandlingService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: ProposalTemplateFormComponent, isStandalone: false, selector: "ga-proposal-template-form", inputs: { selectedEmployee: "selectedEmployee", proposalTemplate: "proposalTemplate" }, usesInheritance: true, ngImport: i0, template: "<nb-card class=\"main\">\n\t<nb-card-header class=\"d-flex flex-column\">\n\t\t<span class=\"cancel\"><i class=\"fas fa-times\" (click)=\"close()\"></i></span>\n\t\t<h5 class=\"title\">\n\t\t\t{{\n\t\t\t\t(proposalTemplate\n\t\t\t\t\t? 'PROPOSAL_TEMPLATE.EDIT_PROPOSAL_TEMPLATE'\n\t\t\t\t\t: 'PROPOSAL_TEMPLATE.ADD_PROPOSAL_TEMPLATE'\n\t\t\t\t) | translate\n\t\t\t}}\n\t\t</h5>\n\t</nb-card-header>\n\t<nb-card-body class=\"body\">\n\t\t<form [formGroup]=\"form\">\n\t\t\t@if (!selectedEmployee && !proposalTemplate) {\n\t\t\t<div class=\"form-group\">\n\t\t\t\t<ga-employee-multi-select\n\t\t\t\t\t[label]=\"'PROPOSAL_TEMPLATE.SELECT_EMPLOYEE' | translate\"\n\t\t\t\t\t[placeholder]=\"'PROPOSAL_TEMPLATE.SELECT_EMPLOYEE' | translate\"\n\t\t\t\t\t[multiple]=\"false\"\n\t\t\t\t\tformControlName=\"employeeId\"\n\t\t\t\t></ga-employee-multi-select>\n\t\t\t</div>\n\t\t\t} @else {\n\t\t\t<div class=\"mb-2\">\n\t\t\t\t<label>\n\t\t\t\t\t{{ 'PROPOSAL_TEMPLATE.EMPLOYEE' | translate }}\n\t\t\t\t</label>\n\t\t\t\t@if (proposalTemplate) {\n\t\t\t\t<ngx-avatar\n\t\t\t\t\t[name]=\"proposalTemplate?.employee?.user?.name\"\n\t\t\t\t\t[src]=\"proposalTemplate?.employee?.user?.imageUrl\"\n\t\t\t\t></ngx-avatar>\n\t\t\t\t} @else {\n\t\t\t\t<ngx-avatar [name]=\"selectedEmployee?.fullName\" [src]=\"selectedEmployee?.imageUrl\"></ngx-avatar>\n\t\t\t\t}\n\t\t\t</div>\n\t\t\t}\n\t\t\t<div class=\"form-group\">\n\t\t\t\t<label class=\"d-block\">\n\t\t\t\t\t{{ 'PROPOSAL_TEMPLATE.NAME' | translate }}\n\t\t\t\t</label>\n\t\t\t\t<input\n\t\t\t\t\tfullWidth\n\t\t\t\t\tformControlName=\"name\"\n\t\t\t\t\ttype=\"text\"\n\t\t\t\t\tnbInput\n\t\t\t\t\t[placeholder]=\"'PROPOSAL_TEMPLATE.NAME' | translate\"\n\t\t\t\t/>\n\t\t\t</div>\n\t\t\t<div class=\"form-group\">\n\t\t\t\t<label class=\"d-block\">\n\t\t\t\t\t{{ 'PROPOSAL_TEMPLATE.CONTENT' | translate }}\n\t\t\t\t</label>\n\t\t\t\t<ga-rich-text-editor\n\t\t\t\t\tformControlName=\"content\"\n\t\t\t\t\tpreset=\"standard\"\n\t\t\t\t\toutputFormat=\"html\"\n\t\t\t\t\tminHeight=\"320px\"\n\t\t\t\t></ga-rich-text-editor>\n\t\t\t</div>\n\t\t</form>\n\t</nb-card-body>\n\t<nb-card-footer class=\"text-left\">\n\t\t<button (click)=\"close()\" status=\"basic\" outline class=\"mr-3\" nbButton>\n\t\t\t{{ 'BUTTONS.CANCEL' | translate }}\n\t\t</button>\n\t\t<button (click)=\"onSave()\" [disabled]=\"form.invalid\" status=\"success\" nbButton>\n\t\t\t{{ 'BUTTONS.SAVE' | translate }}\n\t\t</button>\n\t</nb-card-footer>\n</nb-card>\n", styles: ["@charset \"UTF-8\";:host i{cursor:pointer}:host .cancel{width:100%;display:flex}[dir=ltr] :host .cancel{justify-content:flex-end}[dir=rtl] :host .cancel{justify-content:flex-start}:host .cancel i{font-size:11px;color:var(--gauzy-text-color-1)}:host [nbButton].appearance-outline.status-basic{background-color:transparent;border-color:#f56d584d;border-width:2px;color:#f56d58}:host [nbButton].appearance-outline.status-basic:hover{border-color:#f56d58}:host [nbButton].appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #f56d580d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host .title{color:var(--text-primary-color);font-size:16px;font-weight:600;line-height:16px;letter-spacing:0em}:host [nbButton].gray.appearance-outline.status-basic{background-color:transparent;border-color:#7e7e8f4d;border-width:2px;color:#7e7e8f}:host [nbButton].gray.appearance-outline.status-basic:hover{border-color:#7e7e8f}:host [nbButton].gray.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #7e7e8f0d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].gray.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic{background-color:transparent;border-color:#25b8694d;border-width:2px;color:#25b869}:host [nbButton].green.appearance-outline.status-basic:hover{border-color:#25b869}:host [nbButton].green.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #25b8690d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].green.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic[disabled],:host [nbButton].green.appearance-outline.status-basic.btn-disabled{background-color:var(--button-outline-basic-disabled-background-color);border-color:var(--button-outline-basic-disabled-border-color);color:var(--button-outline-basic-disabled-text-color);box-shadow:unset}:host [nbButton].primary.appearance-filled.status-primary{color:var(--text-primary-color);border:unset;background-color:var(--color-primary-transparent-default);box-shadow:var(--gauzy-shadow)}[dir=ltr] :host ::ng-deep input,[dir=ltr] :host ::ng-deep textarea{text-align:start}[dir=rtl] :host ::ng-deep input,[dir=rtl] :host ::ng-deep textarea{text-align:end}:host ::ng-deep input,:host ::ng-deep nb-select.appearance-outline.status-basic .select-button,:host ::ng-deep .ng-select .ng-select-container{background-color:var(--gauzy-sidebar-background-4)!important;border:none;min-height:calc(var(--select-medium-text-line-height) + .4375rem * 2)!important}:host ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-placeholder,:host ::ng-deep .ng-select.ng-select-single .ng-select-container .ng-value-container .ng-input{top:unset!important}:host ::ng-deep label,:host ::ng-deep .label{font-size:var(--text-label-font-size);font-weight:600;line-height:.8125rem;letter-spacing:-.01em;color:var(--gauzy-text-color-2)}:host ::ng-deep textarea{background-color:var(--gauzy-sidebar-background-4)!important;border:none}:host ::ng-deep .ng-select .ng-select-container input,:host ::ng-deep nb-tag-list input{background-color:unset!important}:host nb-card{background-color:var(--gauzy-card-1)}:host{display:block;width:550px}:host nb-card{background-color:var(--background-basic-color-1)}[dir=rtl] :host ::ng-deep .cancel{justify-content:flex-start}[dir=rtl] :host ::ng-deep .title{text-align:right}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "component", type: i2.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "component", type: i2.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i2.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "component", type: i2.NbCardFooterComponent, selector: "nb-card-footer" }, { kind: "component", type: i2.NbCardHeaderComponent, selector: "nb-card-header" }, { kind: "directive", type: i2.NbInputDirective, selector: "input[nbInput],textarea[nbInput]", inputs: ["fieldSize", "status", "shape", "fullWidth"] }, { kind: "component", type: i5.RichTextEditorComponent, selector: "ga-rich-text-editor", inputs: ["preset", "placeholder", "outputFormat", "minHeight", "maxHeight", "characterLimit", "showCharacterCount", "editorClass", "disabled"], outputs: ["created", "changed", "focused", "blurred"] }, { kind: "directive", type: i3.ɵNgNoValidate, selector: "form:not([ngNoForm]):not([ngNativeValidate])" }, { kind: "directive", type: i3.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i3.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i3.NgControlStatusGroup, selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],[formArray],form:not([ngNoForm]),[ngForm]" }, { kind: "directive", type: i3.FormGroupDirective, selector: "[formGroup]", inputs: ["formGroup"], outputs: ["ngSubmit"], exportAs: ["ngForm"] }, { kind: "directive", type: i3.FormControlName, selector: "[formControlName]", inputs: ["formControlName", "disabled", "ngModel"], outputs: ["ngModelChange"] }, { kind: "component", type: i5.AvatarComponent, selector: "ngx-avatar", inputs: ["size", "src", "appendCaption", "caption", "id", "isOption", "employee", "value", "name"] }, { kind: "component", type: i5.EmployeeSelectComponent, selector: "ga-employee-multi-select", inputs: ["reset", "allEmployees", "selectedEmployeeIds", "multiple", "label", "disabled", "placeholder"], outputs: ["selectedChange", "onLoadEmployees"] }, { kind: "pipe", type: i1.TranslatePipe, name: "translate" }] }); }
};
ProposalTemplateFormComponent = ProposalTemplateFormComponent_1 = __decorate([
    UntilDestroy(),
    __metadata("design:paramtypes", [TranslateService,
        NbDialogRef,
        UntypedFormBuilder,
        ProposalTemplateService,
        ToastrService,
        Store,
        ErrorHandlingService])
], ProposalTemplateFormComponent);
export { ProposalTemplateFormComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProposalTemplateFormComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-proposal-template-form', standalone: false, template: "<nb-card class=\"main\">\n\t<nb-card-header class=\"d-flex flex-column\">\n\t\t<span class=\"cancel\"><i class=\"fas fa-times\" (click)=\"close()\"></i></span>\n\t\t<h5 class=\"title\">\n\t\t\t{{\n\t\t\t\t(proposalTemplate\n\t\t\t\t\t? 'PROPOSAL_TEMPLATE.EDIT_PROPOSAL_TEMPLATE'\n\t\t\t\t\t: 'PROPOSAL_TEMPLATE.ADD_PROPOSAL_TEMPLATE'\n\t\t\t\t) | translate\n\t\t\t}}\n\t\t</h5>\n\t</nb-card-header>\n\t<nb-card-body class=\"body\">\n\t\t<form [formGroup]=\"form\">\n\t\t\t@if (!selectedEmployee && !proposalTemplate) {\n\t\t\t<div class=\"form-group\">\n\t\t\t\t<ga-employee-multi-select\n\t\t\t\t\t[label]=\"'PROPOSAL_TEMPLATE.SELECT_EMPLOYEE' | translate\"\n\t\t\t\t\t[placeholder]=\"'PROPOSAL_TEMPLATE.SELECT_EMPLOYEE' | translate\"\n\t\t\t\t\t[multiple]=\"false\"\n\t\t\t\t\tformControlName=\"employeeId\"\n\t\t\t\t></ga-employee-multi-select>\n\t\t\t</div>\n\t\t\t} @else {\n\t\t\t<div class=\"mb-2\">\n\t\t\t\t<label>\n\t\t\t\t\t{{ 'PROPOSAL_TEMPLATE.EMPLOYEE' | translate }}\n\t\t\t\t</label>\n\t\t\t\t@if (proposalTemplate) {\n\t\t\t\t<ngx-avatar\n\t\t\t\t\t[name]=\"proposalTemplate?.employee?.user?.name\"\n\t\t\t\t\t[src]=\"proposalTemplate?.employee?.user?.imageUrl\"\n\t\t\t\t></ngx-avatar>\n\t\t\t\t} @else {\n\t\t\t\t<ngx-avatar [name]=\"selectedEmployee?.fullName\" [src]=\"selectedEmployee?.imageUrl\"></ngx-avatar>\n\t\t\t\t}\n\t\t\t</div>\n\t\t\t}\n\t\t\t<div class=\"form-group\">\n\t\t\t\t<label class=\"d-block\">\n\t\t\t\t\t{{ 'PROPOSAL_TEMPLATE.NAME' | translate }}\n\t\t\t\t</label>\n\t\t\t\t<input\n\t\t\t\t\tfullWidth\n\t\t\t\t\tformControlName=\"name\"\n\t\t\t\t\ttype=\"text\"\n\t\t\t\t\tnbInput\n\t\t\t\t\t[placeholder]=\"'PROPOSAL_TEMPLATE.NAME' | translate\"\n\t\t\t\t/>\n\t\t\t</div>\n\t\t\t<div class=\"form-group\">\n\t\t\t\t<label class=\"d-block\">\n\t\t\t\t\t{{ 'PROPOSAL_TEMPLATE.CONTENT' | translate }}\n\t\t\t\t</label>\n\t\t\t\t<ga-rich-text-editor\n\t\t\t\t\tformControlName=\"content\"\n\t\t\t\t\tpreset=\"standard\"\n\t\t\t\t\toutputFormat=\"html\"\n\t\t\t\t\tminHeight=\"320px\"\n\t\t\t\t></ga-rich-text-editor>\n\t\t\t</div>\n\t\t</form>\n\t</nb-card-body>\n\t<nb-card-footer class=\"text-left\">\n\t\t<button (click)=\"close()\" status=\"basic\" outline class=\"mr-3\" nbButton>\n\t\t\t{{ 'BUTTONS.CANCEL' | translate }}\n\t\t</button>\n\t\t<button (click)=\"onSave()\" [disabled]=\"form.invalid\" status=\"success\" nbButton>\n\t\t\t{{ 'BUTTONS.SAVE' | translate }}\n\t\t</button>\n\t</nb-card-footer>\n</nb-card>\n", styles: ["@charset \"UTF-8\";:host i{cursor:pointer}:host .cancel{width:100%;display:flex}[dir=ltr] :host .cancel{justify-content:flex-end}[dir=rtl] :host .cancel{justify-content:flex-start}:host .cancel i{font-size:11px;color:var(--gauzy-text-color-1)}:host [nbButton].appearance-outline.status-basic{background-color:transparent;border-color:#f56d584d;border-width:2px;color:#f56d58}:host [nbButton].appearance-outline.status-basic:hover{border-color:#f56d58}:host [nbButton].appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #f56d580d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host .title{color:var(--text-primary-color);font-size:16px;font-weight:600;line-height:16px;letter-spacing:0em}:host [nbButton].gray.appearance-outline.status-basic{background-color:transparent;border-color:#7e7e8f4d;border-width:2px;color:#7e7e8f}:host [nbButton].gray.appearance-outline.status-basic:hover{border-color:#7e7e8f}:host [nbButton].gray.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #7e7e8f0d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].gray.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic{background-color:transparent;border-color:#25b8694d;border-width:2px;color:#25b869}:host [nbButton].green.appearance-outline.status-basic:hover{border-color:#25b869}:host [nbButton].green.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #25b8690d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].green.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic[disabled],:host [nbButton].green.appearance-outline.status-basic.btn-disabled{background-color:var(--button-outline-basic-disabled-background-color);border-color:var(--button-outline-basic-disabled-border-color);color:var(--button-outline-basic-disabled-text-color);box-shadow:unset}:host [nbButton].primary.appearance-filled.status-primary{color:var(--text-primary-color);border:unset;background-color:var(--color-primary-transparent-default);box-shadow:var(--gauzy-shadow)}[dir=ltr] :host ::ng-deep input,[dir=ltr] :host ::ng-deep textarea{text-align:start}[dir=rtl] :host ::ng-deep input,[dir=rtl] :host ::ng-deep textarea{text-align:end}:host ::ng-deep input,:host ::ng-deep nb-select.appearance-outline.status-basic .select-button,:host ::ng-deep .ng-select .ng-select-container{background-color:var(--gauzy-sidebar-background-4)!important;border:none;min-height:calc(var(--select-medium-text-line-height) + .4375rem * 2)!important}:host ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-placeholder,:host ::ng-deep .ng-select.ng-select-single .ng-select-container .ng-value-container .ng-input{top:unset!important}:host ::ng-deep label,:host ::ng-deep .label{font-size:var(--text-label-font-size);font-weight:600;line-height:.8125rem;letter-spacing:-.01em;color:var(--gauzy-text-color-2)}:host ::ng-deep textarea{background-color:var(--gauzy-sidebar-background-4)!important;border:none}:host ::ng-deep .ng-select .ng-select-container input,:host ::ng-deep nb-tag-list input{background-color:unset!important}:host nb-card{background-color:var(--gauzy-card-1)}:host{display:block;width:550px}:host nb-card{background-color:var(--background-basic-color-1)}[dir=rtl] :host ::ng-deep .cancel{justify-content:flex-start}[dir=rtl] :host ::ng-deep .title{text-align:right}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [{ type: i1.TranslateService }, { type: i2.NbDialogRef }, { type: i3.UntypedFormBuilder }, { type: i4.ProposalTemplateService }, { type: i4.ToastrService }, { type: i4.Store }, { type: i4.ErrorHandlingService }], propDecorators: { selectedEmployee: [{
                type: Input
            }], proposalTemplate: [{
                type: Input
            }] } });
//# sourceMappingURL=proposal-template-form.component.js.map