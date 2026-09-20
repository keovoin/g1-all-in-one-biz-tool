var TimeOffRequestMutationComponent_1;
import { __decorate, __metadata } from "tslib";
import { Component, ViewChild, Input } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { NbDateService, NbDialogRef } from '@nebular/theme';
import { StatusTypesEnum } from '@gauzy/contracts';
import { debounceTime, filter, first, tap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CompareDateValidator, OrganizationDocumentsService, Store } from '@gauzy/ui-core/core';
import { distinctUntilChange, isNotEmpty } from '@gauzy/ui-core/common';
import { EmployeeSelectorComponent } from '../../selectors/employee/employee.component';
import { FormHelpers } from '../../forms/helpers';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "@angular/forms";
import * as i3 from "@gauzy/ui-core/core";
import * as i4 from "../../selectors/employee/employee.component";
import * as i5 from "../../file-uploader-input/file-uploader-input.component";
import * as i6 from "../time-off-policy-select/time-off-policy-select.component";
import * as i7 from "@ngx-translate/core";
let TimeOffRequestMutationComponent = class TimeOffRequestMutationComponent {
    static { TimeOffRequestMutationComponent_1 = this; }
    set content(component) {
        if (component) {
            this.employeeSelector = component;
        }
    }
    get timeOff() {
        return this._timeOff;
    }
    set timeOff(value) {
        this._timeOff = value;
    }
    static buildForm(fb) {
        const form = fb.group({
            start: [null, Validators.required],
            end: [null, Validators.required],
            policy: [null, Validators.required],
            policyId: [null, Validators.required],
            documentUrl: [{ value: null, disabled: true }],
            documentId: [],
            status: [],
            description: []
        }, {
            validators: [CompareDateValidator.validateDate('start', 'end')]
        });
        return form;
    }
    constructor(dialogRef, fb, documentsService, store, dateService) {
        this.dialogRef = dialogRef;
        this.fb = fb;
        this.documentsService = documentsService;
        this.store = store;
        this.dateService = dateService;
        this.FormHelpers = FormHelpers;
        this.employeesArr = [];
        this.isEditMode = false;
        /*
         * Time Off Request Mutation Form
         */
        this.form = TimeOffRequestMutationComponent_1.buildForm(this.fb);
        this.minDate = this.dateService.addMonth(this.dateService.today(), 0);
    }
    ngOnInit() {
        this.store.selectedOrganization$
            .pipe(debounceTime(200), distinctUntilChange(), filter((organization) => !!organization), tap((organization) => (this.organization = organization)), tap(() => this.patchFormValue()), untilDestroyed(this))
            .subscribe();
    }
    /**
     * Upload document asset
     *
     * @param image
     */
    uploadDocumentAsset(document) {
        try {
            this.form.get('documentId').setValue(document.id);
            this.form.get('documentUrl').setValue(document.fullUrl);
            this.form.updateValueAndValidity();
        }
        catch (error) {
            console.log('Error while uploading document asset', error);
        }
    }
    /**
     * Upload document asset URL
     *
     * @param image
     */
    uploadDocumentAssetUrl(documentUrl) {
        try {
            const documentUrlControl = this.form.get('documentUrl');
            if (documentUrl) {
                documentUrlControl.enable();
                documentUrlControl.setValue(documentUrl);
            }
            else {
                documentUrlControl.setValue(null);
                documentUrlControl.disable();
            }
        }
        catch (error) {
            console.log('Error while uploading document asset', error);
        }
    }
    /**
     * Patch form value on edit section
     */
    patchFormValue() {
        // patch form value
        if (this.timeOff) {
            this.form.patchValue({
                start: this.timeOff.start,
                end: this.timeOff.end,
                description: this.timeOff.description,
                policy: this.timeOff.policy,
                policyId: this.timeOff.policyId,
                status: this.timeOff.status,
                documentUrl: this.timeOff.documentUrl,
                documentId: this.timeOff.documentId
            });
            this.selectedEmployee = this.timeOff['employees'][0];
            this.employeesArr = this.timeOff['employees'];
        }
    }
    saveRequest() {
        this.selectedEmployee = this.employeeSelector.selectedEmployee;
        if (this.selectedEmployee.id) {
            this.employeesArr.push(this.selectedEmployee);
            this._createNewRecord();
        }
    }
    getRequestForm(reqType) {
        const { tenantId } = this.store.user;
        const { id: organizationId } = this.organization;
        this.documentsService
            .getAll({ tenantId, organizationId })
            .pipe(first())
            .subscribe(({ items }) => {
            if (isNotEmpty(items)) {
                let downloadDocUrl;
                if (reqType === 'paid') {
                    downloadDocUrl = items[0].documentUrl;
                }
                else {
                    downloadDocUrl = items[1].documentUrl;
                }
                window.open(`${downloadDocUrl}`);
            }
        });
    }
    _createNewRecord() {
        if (this.form.invalid) {
            return;
        }
        const { tenantId } = this.store.user;
        const { id: organizationId } = this.organization;
        this.dialogRef.close(Object.assign({
            employees: this.employeesArr,
            organizationId,
            tenantId,
            isHoliday: false,
            requestDate: new Date()
        }, this.form.value));
    }
    /**
     * On Policy Selection
     *
     * @param policy
     */
    onPolicySelected(policy) {
        this.form.get('policy').setValue(policy);
        if (policy.requiresApproval) {
            this.form.get('status').setValue(StatusTypesEnum.REQUESTED);
        }
        else {
            this.form.get('status').setValue(StatusTypesEnum.APPROVED);
        }
        this.form.updateValueAndValidity();
    }
    close() {
        this.dialogRef.close();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TimeOffRequestMutationComponent, deps: [{ token: i1.NbDialogRef }, { token: i2.UntypedFormBuilder }, { token: i3.OrganizationDocumentsService }, { token: i3.Store }, { token: i1.NbDateService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: TimeOffRequestMutationComponent, isStandalone: false, selector: "ngx-time-off-request-mutation", inputs: { type: "type", timeOff: "timeOff" }, viewQueries: [{ propertyName: "content", first: true, predicate: ["employeeSelector"], descendants: true }], ngImport: i0, template: "<nb-card class=\"main\">\n\t<nb-card-header class=\"d-flex flex-column\">\n    <span class=\"cancel\"\n\t\t\t><i class=\"fas fa-times\" (click)=\"close()\"></i\n\t\t></span>\n\t\t<h5 class=\"title\">\n\t\t\t{{\n\t\t\t\t(!isEditMode\n\t\t\t\t\t? 'TIME_OFF_PAGE.REQUEST_TIME_OFF'\n\t\t\t\t\t: 'TIME_OFF_PAGE.ACTIONS.EDIT'\n\t\t\t\t) | translate\n\t\t\t}}\n\t\t</h5>\n\t</nb-card-header>\n\t<nb-card-body>\n\t\t<form [formGroup]=\"form\">\n\t\t\t<div class=\"row\">\n\t\t\t\t<div class=\"col-6\">\n\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t<label class=\"label\">{{\n\t\t\t\t\t\t\t'FORM.LABELS.EMPLOYEE' | translate\n\t\t\t\t\t\t}}</label>\n\t\t\t\t\t\t<ga-employee-selector\n\t\t\t\t\t\t\t#employeeSelector\n\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\trequired\n\t\t\t\t\t\t\t[skipGlobalChange]=\"true\"\n\t\t\t\t\t\t\tclass=\"employees\"\n\t\t\t\t\t\t></ga-employee-selector>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"col-6\">\n\t\t\t\t\t<ga-time-off-policy-select\n\t\t\t\t\t\t[id]=\"'policy'\"\n\t\t\t\t\t\t[ctrl]=\"form.get('policyId')\"\n\t\t\t\t\t\t[placeholder]=\"'TIME_OFF_PAGE.SELECT_TIME_OFF_POLICY' | translate\"\n\t\t\t\t\t\t(selectedChange)=\"onPolicySelected($event)\"\n\t\t\t\t\t\tformControlName=\"policyId\"\n\t\t\t\t\t></ga-time-off-policy-select>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class=\"row\">\n\t\t\t\t<div class=\"col-6\">\n\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t<label class=\"label\" for=\"start\">{{\n\t\t\t\t\t\t\t'FORM.LABELS.FROM' | translate\n\t\t\t\t\t\t}}</label>\n\t\t\t\t\t\t<input\n\t\t\t\t\t\t\tformControlName=\"start\"\n\t\t\t\t\t\t\tnbInput\n\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\trequired\n\t\t\t\t\t\t\t[placeholder]=\"'POP_UPS.PICK_DATE' | translate\"\n\t\t\t\t\t\t\t[nbDatepicker]=\"startDatePicker\"\n\t\t\t\t\t\t\t[status]=\"\n\t\t\t\t\t\t\t\tFormHelpers.isInvalidControl(form, 'start')\n\t\t\t\t\t\t\t\t\t? 'danger'\n\t\t\t\t\t\t\t\t\t: 'basic'\n\t\t\t\t\t\t\t\"\n\t\t\t\t\t\t/>\n\t\t\t\t\t\t<nb-datepicker [min]=\"minDate\" #startDatePicker></nb-datepicker>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"col-6\">\n\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t<label class=\"label\" for=\"end\">{{\n\t\t\t\t\t\t\t'FORM.LABELS.TO' | translate\n\t\t\t\t\t\t}}</label>\n\t\t\t\t\t\t<input\n\t\t\t\t\t\t\tformControlName=\"end\"\n\t\t\t\t\t\t\tnbInput\n\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\t[placeholder]=\"'POP_UPS.PICK_DATE' | translate\"\n\t\t\t\t\t\t\t[nbDatepicker]=\"endDatePicker\"\n\t\t\t\t\t\t\t[status]=\"\n\t\t\t\t\t\t\t\tFormHelpers.isInvalidControl(form, 'end')\n\t\t\t\t\t\t\t\t\t? 'danger'\n\t\t\t\t\t\t\t\t\t: 'basic'\n\t\t\t\t\t\t\t\"\n\t\t\t\t\t\t/>\n\t\t\t\t\t\t<nb-datepicker [min]=\"minDate\" #endDatePicker></nb-datepicker>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class=\"row\">\n\t\t\t\t<div class=\"col-6\">\n\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t<label class=\"label\" for=\"end\">\n\t\t\t\t\t\t\t\t{{ 'FORM.LABELS.DOWNLOAD_REQUEST_FORM' | translate }}\n\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<button\n\t\t\t\t\t\t\tnbButton\n\t\t\t\t\t\t\tstatus=\"basic\"\n\t\t\t\t\t\t\tclass=\"download-btn mr-4\"\n\t\t\t\t\t\t\t(click)=\"getRequestForm('paid')\"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t{{ 'BUTTONS.PAID_DAYS_OFF' | translate }}\n\t\t\t\t\t\t</button>\n\t\t\t\t\t\t<button\n\t\t\t\t\t\t\tnbButton\n\t\t\t\t\t\t\tstatus=\"basic\"\n\t\t\t\t\t\t\tclass=\"download-btn\"\n\t\t\t\t\t\t\t(click)=\"getRequestForm('unpaid')\"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t{{ 'BUTTONS.UNPAID_DAYS_OFF' | translate }}\n\t\t\t\t\t\t</button>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"col-6\">\n\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t<div class=\"label\">\n\t\t\t\t\t\t\t{{ 'TIME_OFF_PAGE.UPLOAD_REQUEST_DOCUMENT' | translate }}\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<ngx-file-uploader-input\n\t\t\t\t\t\t\t[placeholder]=\" 'FORM.PLACEHOLDERS.UPLOADER_DOCUMENT_PLACEHOLDER' | translate \"\n\t\t\t\t\t\t\t[fileUrl]=\"form.get('documentUrl').value\"\n\t\t\t\t\t\t\t(uploadedImgUrl)=\"form.get('documentUrl').setValue($event)\"\n\t\t\t\t\t\t\t(uploadedImageAsset)=\"uploadDocumentAsset($event)\"\n\t\t\t\t\t\t\t(uploadedImgUrl)=\"uploadDocumentAssetUrl($event)\"\n\t\t\t\t\t\t></ngx-file-uploader-input>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class=\"row\">\n\t\t\t\t<div class=\"col-12\">\n\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t\t<label class=\"label\" for=\"description\">{{\n\t\t\t\t\t\t\t\t'FORM.LABELS.DESCRIPTION' | translate\n\t\t\t\t\t\t\t}}</label>\n\t\t\t\t\t\t\t<textarea\n\t\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\t\tnbInput\n\t\t\t\t\t\t\t\tformControlName=\"description\"\n\t\t\t\t\t\t\t\t[placeholder]=\"'TIME_OFF_PAGE.ADD_A_DESCRIPTION' | translate\"\n\t\t\t\t\t\t\t></textarea>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</form>\n\t</nb-card-body>\n\t<nb-card-footer class=\"text-left\">\n\t\t<button\n\t\t\t(click)=\"close()\"\n\t\t\tstatus=\"basic\"\n      outline\n\t\t\tclass=\"mr-3\"\n\t\t\tnbButton\n\t\t>\n\t\t\t{{ 'BUTTONS.CANCEL' | translate }}\n\t\t</button>\n\t\t<button\n\t\t\t(click)=\"saveRequest()\"\n\t\t\tstatus=\"success\"\n\t\t\tnbButton\n\t\t\t[disabled]=\"form.invalid\"\n\t\t>\n\t\t\t{{ 'BUTTONS.SAVE' | translate }}\n\t\t</button>\n\t</nb-card-footer>\n</nb-card>\n", styles: ["@charset \"UTF-8\";:host i{cursor:pointer}:host .cancel{width:100%;display:flex}[dir=ltr] :host .cancel{justify-content:flex-end}[dir=rtl] :host .cancel{justify-content:flex-start}:host .cancel i{font-size:11px;color:var(--gauzy-text-color-1)}:host [nbButton].appearance-outline.status-basic{background-color:transparent;border-color:#f56d584d;border-width:2px;color:#f56d58}:host [nbButton].appearance-outline.status-basic:hover{border-color:#f56d58}:host [nbButton].appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #f56d580d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host .title{color:var(--text-primary-color);font-size:16px;font-weight:600;line-height:16px;letter-spacing:0em}:host [nbButton].gray.appearance-outline.status-basic{background-color:transparent;border-color:#7e7e8f4d;border-width:2px;color:#7e7e8f}:host [nbButton].gray.appearance-outline.status-basic:hover{border-color:#7e7e8f}:host [nbButton].gray.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #7e7e8f0d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].gray.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic{background-color:transparent;border-color:#25b8694d;border-width:2px;color:#25b869}:host [nbButton].green.appearance-outline.status-basic:hover{border-color:#25b869}:host [nbButton].green.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #25b8690d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].green.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic[disabled],:host [nbButton].green.appearance-outline.status-basic.btn-disabled{background-color:var(--button-outline-basic-disabled-background-color);border-color:var(--button-outline-basic-disabled-border-color);color:var(--button-outline-basic-disabled-text-color);box-shadow:unset}:host [nbButton].primary.appearance-filled.status-primary{color:var(--text-primary-color);border:unset;background-color:var(--color-primary-transparent-default);box-shadow:var(--gauzy-shadow)}[dir=ltr] :host ::ng-deep input,[dir=ltr] :host ::ng-deep textarea{text-align:start}[dir=rtl] :host ::ng-deep input,[dir=rtl] :host ::ng-deep textarea{text-align:end}:host ::ng-deep input,:host ::ng-deep nb-select.appearance-outline.status-basic .select-button,:host ::ng-deep .ng-select .ng-select-container{background-color:var(--gauzy-sidebar-background-4)!important;border:none;min-height:calc(var(--select-medium-text-line-height) + .4375rem * 2)!important}:host ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-placeholder,:host ::ng-deep .ng-select.ng-select-single .ng-select-container .ng-value-container .ng-input{top:unset!important}:host ::ng-deep label,:host ::ng-deep .label{font-size:var(--text-label-font-size);font-weight:600;line-height:.8125rem;letter-spacing:-.01em;color:var(--gauzy-text-color-2)}:host ::ng-deep textarea{background-color:var(--gauzy-sidebar-background-4)!important;border:none}:host ::ng-deep .ng-select .ng-select-container input,:host ::ng-deep nb-tag-list input{background-color:unset!important}:host nb-card{background-color:var(--gauzy-card-1)}.main{width:645px}.main nb-card-header{display:flex;justify-content:space-between}.main nb-card-header nb-icon{cursor:pointer}.main .checkboxes>:first-child{padding-right:15px}img{width:40px;height:40px;margin-right:10px}.label{margin-bottom:.5rem}.download-btn{height:2rem;font-weight:400}nb-card{background-color:var(--gauzy-card-1)}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "directive", type: i2.ɵNgNoValidate, selector: "form:not([ngNoForm]):not([ngNativeValidate])" }, { kind: "directive", type: i2.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i2.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i2.NgControlStatusGroup, selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],[formArray],form:not([ngNoForm]),[ngForm]" }, { kind: "directive", type: i2.RequiredValidator, selector: ":not([type=checkbox])[required][formControlName],:not([type=checkbox])[required][formControl],:not([type=checkbox])[required][ngModel]", inputs: ["required"] }, { kind: "directive", type: i2.FormGroupDirective, selector: "[formGroup]", inputs: ["formGroup"], outputs: ["ngSubmit"], exportAs: ["ngForm"] }, { kind: "directive", type: i2.FormControlName, selector: "[formControlName]", inputs: ["formControlName", "disabled", "ngModel"], outputs: ["ngModelChange"] }, { kind: "component", type: i1.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i1.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "component", type: i1.NbCardFooterComponent, selector: "nb-card-footer" }, { kind: "component", type: i1.NbCardHeaderComponent, selector: "nb-card-header" }, { kind: "component", type: i1.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "directive", type: i1.NbDatepickerDirective, selector: "input[nbDatepicker]", inputs: ["nbDatepicker"] }, { kind: "component", type: i1.NbDatepickerComponent, selector: "nb-datepicker", inputs: ["date"], outputs: ["dateChange"] }, { kind: "directive", type: i1.NbInputDirective, selector: "input[nbInput],textarea[nbInput]", inputs: ["fieldSize", "status", "shape", "fullWidth"] }, { kind: "component", type: i4.EmployeeSelectorComponent, selector: "ga-employee-selector", inputs: ["clearable", "addTag", "skipGlobalChange", "disabled", "placeholder", "defaultSelected", "showAllEmployeesOption", "dropdownClass", "selectedDateRange", "selectedEmployee"], outputs: ["selectionChanged"] }, { kind: "component", type: i5.FileUploaderInputComponent, selector: "ngx-file-uploader-input", inputs: ["placeholder", "locale", "fileUrl"], outputs: ["uploadedImageAsset", "uploadedImgUrl", "uploadedImgData"] }, { kind: "component", type: i6.TimeOffPolicySelectComponent, selector: "ga-time-off-policy-select", inputs: ["policyId", "policy", "ctrl", "placeholder", "id"], outputs: ["selectedChange"] }, { kind: "pipe", type: i7.TranslatePipe, name: "translate" }] }); }
};
TimeOffRequestMutationComponent = TimeOffRequestMutationComponent_1 = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [NbDialogRef,
        UntypedFormBuilder,
        OrganizationDocumentsService,
        Store,
        NbDateService])
], TimeOffRequestMutationComponent);
export { TimeOffRequestMutationComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TimeOffRequestMutationComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-time-off-request-mutation', standalone: false, template: "<nb-card class=\"main\">\n\t<nb-card-header class=\"d-flex flex-column\">\n    <span class=\"cancel\"\n\t\t\t><i class=\"fas fa-times\" (click)=\"close()\"></i\n\t\t></span>\n\t\t<h5 class=\"title\">\n\t\t\t{{\n\t\t\t\t(!isEditMode\n\t\t\t\t\t? 'TIME_OFF_PAGE.REQUEST_TIME_OFF'\n\t\t\t\t\t: 'TIME_OFF_PAGE.ACTIONS.EDIT'\n\t\t\t\t) | translate\n\t\t\t}}\n\t\t</h5>\n\t</nb-card-header>\n\t<nb-card-body>\n\t\t<form [formGroup]=\"form\">\n\t\t\t<div class=\"row\">\n\t\t\t\t<div class=\"col-6\">\n\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t<label class=\"label\">{{\n\t\t\t\t\t\t\t'FORM.LABELS.EMPLOYEE' | translate\n\t\t\t\t\t\t}}</label>\n\t\t\t\t\t\t<ga-employee-selector\n\t\t\t\t\t\t\t#employeeSelector\n\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\trequired\n\t\t\t\t\t\t\t[skipGlobalChange]=\"true\"\n\t\t\t\t\t\t\tclass=\"employees\"\n\t\t\t\t\t\t></ga-employee-selector>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"col-6\">\n\t\t\t\t\t<ga-time-off-policy-select\n\t\t\t\t\t\t[id]=\"'policy'\"\n\t\t\t\t\t\t[ctrl]=\"form.get('policyId')\"\n\t\t\t\t\t\t[placeholder]=\"'TIME_OFF_PAGE.SELECT_TIME_OFF_POLICY' | translate\"\n\t\t\t\t\t\t(selectedChange)=\"onPolicySelected($event)\"\n\t\t\t\t\t\tformControlName=\"policyId\"\n\t\t\t\t\t></ga-time-off-policy-select>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class=\"row\">\n\t\t\t\t<div class=\"col-6\">\n\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t<label class=\"label\" for=\"start\">{{\n\t\t\t\t\t\t\t'FORM.LABELS.FROM' | translate\n\t\t\t\t\t\t}}</label>\n\t\t\t\t\t\t<input\n\t\t\t\t\t\t\tformControlName=\"start\"\n\t\t\t\t\t\t\tnbInput\n\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\trequired\n\t\t\t\t\t\t\t[placeholder]=\"'POP_UPS.PICK_DATE' | translate\"\n\t\t\t\t\t\t\t[nbDatepicker]=\"startDatePicker\"\n\t\t\t\t\t\t\t[status]=\"\n\t\t\t\t\t\t\t\tFormHelpers.isInvalidControl(form, 'start')\n\t\t\t\t\t\t\t\t\t? 'danger'\n\t\t\t\t\t\t\t\t\t: 'basic'\n\t\t\t\t\t\t\t\"\n\t\t\t\t\t\t/>\n\t\t\t\t\t\t<nb-datepicker [min]=\"minDate\" #startDatePicker></nb-datepicker>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"col-6\">\n\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t<label class=\"label\" for=\"end\">{{\n\t\t\t\t\t\t\t'FORM.LABELS.TO' | translate\n\t\t\t\t\t\t}}</label>\n\t\t\t\t\t\t<input\n\t\t\t\t\t\t\tformControlName=\"end\"\n\t\t\t\t\t\t\tnbInput\n\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\t[placeholder]=\"'POP_UPS.PICK_DATE' | translate\"\n\t\t\t\t\t\t\t[nbDatepicker]=\"endDatePicker\"\n\t\t\t\t\t\t\t[status]=\"\n\t\t\t\t\t\t\t\tFormHelpers.isInvalidControl(form, 'end')\n\t\t\t\t\t\t\t\t\t? 'danger'\n\t\t\t\t\t\t\t\t\t: 'basic'\n\t\t\t\t\t\t\t\"\n\t\t\t\t\t\t/>\n\t\t\t\t\t\t<nb-datepicker [min]=\"minDate\" #endDatePicker></nb-datepicker>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class=\"row\">\n\t\t\t\t<div class=\"col-6\">\n\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t<label class=\"label\" for=\"end\">\n\t\t\t\t\t\t\t\t{{ 'FORM.LABELS.DOWNLOAD_REQUEST_FORM' | translate }}\n\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<button\n\t\t\t\t\t\t\tnbButton\n\t\t\t\t\t\t\tstatus=\"basic\"\n\t\t\t\t\t\t\tclass=\"download-btn mr-4\"\n\t\t\t\t\t\t\t(click)=\"getRequestForm('paid')\"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t{{ 'BUTTONS.PAID_DAYS_OFF' | translate }}\n\t\t\t\t\t\t</button>\n\t\t\t\t\t\t<button\n\t\t\t\t\t\t\tnbButton\n\t\t\t\t\t\t\tstatus=\"basic\"\n\t\t\t\t\t\t\tclass=\"download-btn\"\n\t\t\t\t\t\t\t(click)=\"getRequestForm('unpaid')\"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t{{ 'BUTTONS.UNPAID_DAYS_OFF' | translate }}\n\t\t\t\t\t\t</button>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"col-6\">\n\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t<div class=\"label\">\n\t\t\t\t\t\t\t{{ 'TIME_OFF_PAGE.UPLOAD_REQUEST_DOCUMENT' | translate }}\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<ngx-file-uploader-input\n\t\t\t\t\t\t\t[placeholder]=\" 'FORM.PLACEHOLDERS.UPLOADER_DOCUMENT_PLACEHOLDER' | translate \"\n\t\t\t\t\t\t\t[fileUrl]=\"form.get('documentUrl').value\"\n\t\t\t\t\t\t\t(uploadedImgUrl)=\"form.get('documentUrl').setValue($event)\"\n\t\t\t\t\t\t\t(uploadedImageAsset)=\"uploadDocumentAsset($event)\"\n\t\t\t\t\t\t\t(uploadedImgUrl)=\"uploadDocumentAssetUrl($event)\"\n\t\t\t\t\t\t></ngx-file-uploader-input>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class=\"row\">\n\t\t\t\t<div class=\"col-12\">\n\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t\t<label class=\"label\" for=\"description\">{{\n\t\t\t\t\t\t\t\t'FORM.LABELS.DESCRIPTION' | translate\n\t\t\t\t\t\t\t}}</label>\n\t\t\t\t\t\t\t<textarea\n\t\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\t\tnbInput\n\t\t\t\t\t\t\t\tformControlName=\"description\"\n\t\t\t\t\t\t\t\t[placeholder]=\"'TIME_OFF_PAGE.ADD_A_DESCRIPTION' | translate\"\n\t\t\t\t\t\t\t></textarea>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</form>\n\t</nb-card-body>\n\t<nb-card-footer class=\"text-left\">\n\t\t<button\n\t\t\t(click)=\"close()\"\n\t\t\tstatus=\"basic\"\n      outline\n\t\t\tclass=\"mr-3\"\n\t\t\tnbButton\n\t\t>\n\t\t\t{{ 'BUTTONS.CANCEL' | translate }}\n\t\t</button>\n\t\t<button\n\t\t\t(click)=\"saveRequest()\"\n\t\t\tstatus=\"success\"\n\t\t\tnbButton\n\t\t\t[disabled]=\"form.invalid\"\n\t\t>\n\t\t\t{{ 'BUTTONS.SAVE' | translate }}\n\t\t</button>\n\t</nb-card-footer>\n</nb-card>\n", styles: ["@charset \"UTF-8\";:host i{cursor:pointer}:host .cancel{width:100%;display:flex}[dir=ltr] :host .cancel{justify-content:flex-end}[dir=rtl] :host .cancel{justify-content:flex-start}:host .cancel i{font-size:11px;color:var(--gauzy-text-color-1)}:host [nbButton].appearance-outline.status-basic{background-color:transparent;border-color:#f56d584d;border-width:2px;color:#f56d58}:host [nbButton].appearance-outline.status-basic:hover{border-color:#f56d58}:host [nbButton].appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #f56d580d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host .title{color:var(--text-primary-color);font-size:16px;font-weight:600;line-height:16px;letter-spacing:0em}:host [nbButton].gray.appearance-outline.status-basic{background-color:transparent;border-color:#7e7e8f4d;border-width:2px;color:#7e7e8f}:host [nbButton].gray.appearance-outline.status-basic:hover{border-color:#7e7e8f}:host [nbButton].gray.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #7e7e8f0d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].gray.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic{background-color:transparent;border-color:#25b8694d;border-width:2px;color:#25b869}:host [nbButton].green.appearance-outline.status-basic:hover{border-color:#25b869}:host [nbButton].green.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #25b8690d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].green.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic[disabled],:host [nbButton].green.appearance-outline.status-basic.btn-disabled{background-color:var(--button-outline-basic-disabled-background-color);border-color:var(--button-outline-basic-disabled-border-color);color:var(--button-outline-basic-disabled-text-color);box-shadow:unset}:host [nbButton].primary.appearance-filled.status-primary{color:var(--text-primary-color);border:unset;background-color:var(--color-primary-transparent-default);box-shadow:var(--gauzy-shadow)}[dir=ltr] :host ::ng-deep input,[dir=ltr] :host ::ng-deep textarea{text-align:start}[dir=rtl] :host ::ng-deep input,[dir=rtl] :host ::ng-deep textarea{text-align:end}:host ::ng-deep input,:host ::ng-deep nb-select.appearance-outline.status-basic .select-button,:host ::ng-deep .ng-select .ng-select-container{background-color:var(--gauzy-sidebar-background-4)!important;border:none;min-height:calc(var(--select-medium-text-line-height) + .4375rem * 2)!important}:host ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-placeholder,:host ::ng-deep .ng-select.ng-select-single .ng-select-container .ng-value-container .ng-input{top:unset!important}:host ::ng-deep label,:host ::ng-deep .label{font-size:var(--text-label-font-size);font-weight:600;line-height:.8125rem;letter-spacing:-.01em;color:var(--gauzy-text-color-2)}:host ::ng-deep textarea{background-color:var(--gauzy-sidebar-background-4)!important;border:none}:host ::ng-deep .ng-select .ng-select-container input,:host ::ng-deep nb-tag-list input{background-color:unset!important}:host nb-card{background-color:var(--gauzy-card-1)}.main{width:645px}.main nb-card-header{display:flex;justify-content:space-between}.main nb-card-header nb-icon{cursor:pointer}.main .checkboxes>:first-child{padding-right:15px}img{width:40px;height:40px;margin-right:10px}.label{margin-bottom:.5rem}.download-btn{height:2rem;font-weight:400}nb-card{background-color:var(--gauzy-card-1)}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [{ type: i1.NbDialogRef }, { type: i2.UntypedFormBuilder }, { type: i3.OrganizationDocumentsService }, { type: i3.Store }, { type: i1.NbDateService }], propDecorators: { content: [{
                type: ViewChild,
                args: ['employeeSelector', { static: false }]
            }], type: [{
                type: Input
            }], timeOff: [{
                type: Input
            }] } });
//# sourceMappingURL=time-off-request-mutation.component.js.map