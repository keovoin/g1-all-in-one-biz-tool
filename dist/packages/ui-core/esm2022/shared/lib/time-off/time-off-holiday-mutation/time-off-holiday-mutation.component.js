var TimeOffHolidayMutationComponent_1;
import { __decorate, __metadata } from "tslib";
import { Component } from '@angular/core';
import { NbDateService, NbDialogRef } from '@nebular/theme';
import { StatusTypesEnum } from '@gauzy/contracts';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { debounceTime, filter, first, tap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import moment from 'moment';
import Holidays from 'date-holidays';
import { CompareDateValidator, EmployeesService, Store, ToastrService } from '@gauzy/ui-core/core';
import { distinctUntilChange } from '@gauzy/ui-core/common';
import { environment as ENV } from '@gauzy/ui-config';
import { FormHelpers } from '../../forms/helpers';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "@angular/forms";
import * as i3 from "@gauzy/ui-core/core";
import * as i4 from "../time-off-policy-select/time-off-policy-select.component";
import * as i5 from "@ngx-translate/core";
let TimeOffHolidayMutationComponent = class TimeOffHolidayMutationComponent {
    static { TimeOffHolidayMutationComponent_1 = this; }
    constructor(dialogRef, fb, toastrService, employeesService, store, dateService) {
        this.dialogRef = dialogRef;
        this.fb = fb;
        this.toastrService = toastrService;
        this.employeesService = employeesService;
        this.store = store;
        this.dateService = dateService;
        this.FormHelpers = FormHelpers;
        this.orgEmployees = [];
        this.employeesArr = [];
        this.holidays = [];
        this.employeeIds = [];
        /*
         * Time Off Holiday Mutation Form
         */
        this.form = TimeOffHolidayMutationComponent_1.buildForm(this.fb);
        this.minDate = this.dateService.addMonth(this.dateService.today(), 0);
    }
    static buildForm(fb) {
        const form = fb.group({
            start: ['', Validators.required],
            end: ['', Validators.required],
            policy: ['', Validators.required],
            policyId: ['', Validators.required],
            status: [],
            description: []
        }, {
            validators: [CompareDateValidator.validateDate('start', 'end')]
        });
        return form;
    }
    ngOnInit() {
        this.store.user$
            .pipe(filter((user) => !!user.employee), tap(({ employee: { contact } }) => {
            if (contact && contact.country) {
                this.countryCode = contact.country;
            }
        }), untilDestroyed(this))
            .subscribe();
        this.store.selectedOrganization$
            .pipe(debounceTime(200), distinctUntilChange(), filter((organization) => !!organization), tap((organization) => (this.organization = organization)), tap(({ contact }) => {
            if (contact && contact.country) {
                this.countryCode = contact.country;
            }
        }), tap(() => this._getFormData()), tap(() => this._getOrganizationEmployees()), untilDestroyed(this))
            .subscribe();
    }
    async _getAllHolidays() {
        const holidays = new Holidays();
        const countryCode = this.countryCode || ENV.DEFAULT_COUNTRY;
        if (countryCode) {
            holidays.init(countryCode);
            this.holidays = holidays.getHolidays(moment().year()).filter((holiday) => holiday.type === 'public');
        }
        else {
            this.toastrService.danger('TOASTR.MESSAGE.HOLIDAY_ERROR');
        }
    }
    saveHoliday() {
        this.employeeIds.forEach((element) => {
            const employee = this.orgEmployees.find((e) => e.id === element);
            this.employeesArr.push(employee);
        });
        this._createNewRecord();
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
            isHoliday: true,
            requestDate: new Date()
        }, this.form.getRawValue()));
    }
    async _getFormData() {
        this._getAllHolidays();
    }
    _getOrganizationEmployees() {
        if (!this.organization) {
            return;
        }
        const { tenantId } = this.store.user;
        const { id: organizationId } = this.organization;
        this.employeesService
            .getAll(['user', 'tags'], {
            organizationId,
            tenantId
        })
            .pipe(first(), tap(({ items }) => (this.orgEmployees = items)))
            .subscribe();
    }
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
    onEmployeesSelected(employees) {
        this.employeeIds = employees;
    }
    /**
     * Patch value on holiday selected
     *
     * @param holiday
     */
    onHolidaySelected(holiday) {
        this.form.patchValue({
            start: holiday.start,
            end: holiday.end || null,
            description: holiday.name
        });
    }
    close() {
        this.dialogRef.close();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TimeOffHolidayMutationComponent, deps: [{ token: i1.NbDialogRef }, { token: i2.UntypedFormBuilder }, { token: i3.ToastrService }, { token: i3.EmployeesService }, { token: i3.Store }, { token: i1.NbDateService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: TimeOffHolidayMutationComponent, isStandalone: false, selector: "ngx-time-off-holiday-mutation", ngImport: i0, template: "<nb-card class=\"main\">\n  <nb-card-header class=\"dflex flex-column\">\n    <span class=\"cancel\"\n      ><i class=\"fas fa-times\" (click)=\"close()\"></i\n    ></span>\n    <h5 class=\"title\">\n      {{ 'TIME_OFF_PAGE.ADD_HOLIDAYS' | translate }}\n    </h5>\n  </nb-card-header>\n  <nb-card-body>\n    <form [formGroup]=\"form\">\n      <div class=\"row\">\n        <div class=\"col-6\">\n          <div class=\"form-group\">\n            <label class=\"label\">\n              {{ 'TIME_OFF_PAGE.HOLIDAY_NAME' | translate }}\n            </label>\n            <nb-select\n              (selectedChange)=\"onHolidaySelected($event)\"\n              fullWidth\n\t\t\t\t\t\t\t[placeholder]=\"\n\t\t\t\t\t\t\t\t'TIME_OFF_PAGE.SELECT_HOLIDAY_NAME' | translate\n\t\t\t\t\t\t\t\"\n              >\n              @for (holiday of holidays; track holiday) {\n                <nb-option\n                  [value]=\"holiday\"\n                  >\n                  {{ holiday.name }}\n                </nb-option>\n              }\n            </nb-select>\n          </div>\n        </div>\n        <div class=\"col-6\">\n          <div class=\"form-group\">\n            <label class=\"label\">{{\n              'TIME_OFF_PAGE.SELECT_EMPLOYEES' | translate\n            }}</label>\n            <nb-select\n              multiple\n              [selected]=\"employeesArr\"\n              (selectedChange)=\"onEmployeesSelected($event)\"\n              fullWidth\n              required\n\t\t\t\t\t\t\t[placeholder]=\"\n\t\t\t\t\t\t\t\t'TIME_OFF_PAGE.ADD_OR_REMOVE_EMPLOYEES'\n\t\t\t\t\t\t\t\t\t| translate\n\t\t\t\t\t\t\t\"\n              >\n              @for (employee of orgEmployees; track employee) {\n                <nb-option\n                  [value]=\"employee.id\"\n                  >\n                  <img\n                    [src]=\"employee.user.imageUrl\"\n                    alt=\"Smiley face\"\n                    height=\"40\"\n                    width=\"40\"\n                    style=\"margin-right: 10px\"\n                    />\n                    {{ employee.fullName }}\n                  </nb-option>\n                }\n              </nb-select>\n            </div>\n          </div>\n        </div>\n        <div class=\"row\">\n          <div class=\"col-12\">\n            <ga-time-off-policy-select\n              [id]=\"'policy'\"\n              [ctrl]=\"form.get('policyId')\"\n              [placeholder]=\"'TIME_OFF_PAGE.SELECT_TIME_OFF_POLICY' | translate\"\n              (selectedChange)=\"onPolicySelected($event)\"\n              formControlName=\"policyId\"\n            ></ga-time-off-policy-select>\n          </div>\n        </div>\n        <div class=\"row\">\n          <div class=\"col-6\">\n            <div class=\"form-group\">\n              <label class=\"label\" for=\"start\">{{\n                'FORM.LABELS.FROM' | translate\n              }}</label>\n              <input\n                formControlName=\"start\"\n                nbInput\n                fullWidth\n                required\n                [placeholder]=\"'POP_UPS.PICK_DATE' | translate\"\n                [nbDatepicker]=\"startDatePicker\"\n\t\t\t\t\t\t\t[status]=\"\n\t\t\t\t\t\t\t\tFormHelpers.isInvalidControl(form, 'start')\n\t\t\t\t\t\t\t\t\t? 'danger'\n\t\t\t\t\t\t\t\t\t: 'basic'\n\t\t\t\t\t\t\t\"\n                />\n                <nb-datepicker\n                  [min]=\"minDate\"\n                  #startDatePicker\n                ></nb-datepicker>\n              </div>\n            </div>\n            <div class=\"col-6\">\n              <div class=\"form-group\">\n                <label class=\"label\" for=\"end\">{{\n                  'FORM.LABELS.TO' | translate\n                }}</label>\n                <input\n                  formControlName=\"end\"\n                  nbInput\n                  fullWidth\n                  [placeholder]=\"'POP_UPS.PICK_DATE' | translate\"\n                  [nbDatepicker]=\"endDatePicker\"\n\t\t\t\t\t\t\t[status]=\"\n\t\t\t\t\t\t\t\tFormHelpers.isInvalidControl(form, 'end')\n\t\t\t\t\t\t\t\t\t? 'danger'\n\t\t\t\t\t\t\t\t\t: 'basic'\n\t\t\t\t\t\t\t\"\n                  />\n                  <nb-datepicker\n                    [min]=\"minDate\"\n                    #endDatePicker\n                  ></nb-datepicker>\n                </div>\n              </div>\n            </div>\n          </form>\n        </nb-card-body>\n        <nb-card-footer class=\"text-left\">\n          <button\n            (click)=\"close()\"\n            status=\"basic\"\n            outline\n            class=\"mr-3\"\n            nbButton\n            size=\"small\"\n            >\n            {{ 'BUTTONS.CANCEL' | translate }}\n          </button>\n          <button\n            (click)=\"saveHoliday()\"\n            status=\"success\"\n            nbButton\n            [disabled]=\"form.invalid\"\n            size=\"small\"\n            >\n            {{ 'BUTTONS.SAVE' | translate }}\n          </button>\n        </nb-card-footer>\n      </nb-card>\n", styles: ["@charset \"UTF-8\";:host i{cursor:pointer}:host .cancel{width:100%;display:flex}[dir=ltr] :host .cancel{justify-content:flex-end}[dir=rtl] :host .cancel{justify-content:flex-start}:host .cancel i{font-size:11px;color:var(--gauzy-text-color-1)}:host [nbButton].appearance-outline.status-basic{background-color:transparent;border-color:#f56d584d;border-width:2px;color:#f56d58}:host [nbButton].appearance-outline.status-basic:hover{border-color:#f56d58}:host [nbButton].appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #f56d580d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host .title{color:var(--text-primary-color);font-size:16px;font-weight:600;line-height:16px;letter-spacing:0em}:host [nbButton].gray.appearance-outline.status-basic{background-color:transparent;border-color:#7e7e8f4d;border-width:2px;color:#7e7e8f}:host [nbButton].gray.appearance-outline.status-basic:hover{border-color:#7e7e8f}:host [nbButton].gray.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #7e7e8f0d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].gray.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic{background-color:transparent;border-color:#25b8694d;border-width:2px;color:#25b869}:host [nbButton].green.appearance-outline.status-basic:hover{border-color:#25b869}:host [nbButton].green.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #25b8690d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].green.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic[disabled],:host [nbButton].green.appearance-outline.status-basic.btn-disabled{background-color:var(--button-outline-basic-disabled-background-color);border-color:var(--button-outline-basic-disabled-border-color);color:var(--button-outline-basic-disabled-text-color);box-shadow:unset}:host [nbButton].primary.appearance-filled.status-primary{color:var(--text-primary-color);border:unset;background-color:var(--color-primary-transparent-default);box-shadow:var(--gauzy-shadow)}[dir=ltr] :host ::ng-deep input,[dir=ltr] :host ::ng-deep textarea{text-align:start}[dir=rtl] :host ::ng-deep input,[dir=rtl] :host ::ng-deep textarea{text-align:end}:host ::ng-deep input,:host ::ng-deep nb-select.appearance-outline.status-basic .select-button,:host ::ng-deep .ng-select .ng-select-container{background-color:var(--gauzy-sidebar-background-4)!important;border:none;min-height:calc(var(--select-medium-text-line-height) + .4375rem * 2)!important}:host ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-placeholder,:host ::ng-deep .ng-select.ng-select-single .ng-select-container .ng-value-container .ng-input{top:unset!important}:host ::ng-deep label,:host ::ng-deep .label{font-size:var(--text-label-font-size);font-weight:600;line-height:.8125rem;letter-spacing:-.01em;color:var(--gauzy-text-color-2)}:host ::ng-deep textarea{background-color:var(--gauzy-sidebar-background-4)!important;border:none}:host ::ng-deep .ng-select .ng-select-container input,:host ::ng-deep nb-tag-list input{background-color:unset!important}:host nb-card{background-color:var(--gauzy-card-1)}.main{width:645px}.main nb-card-header{display:flex;justify-content:space-between}.main nb-card-header nb-icon{cursor:pointer}.main .checkboxes>:first-child{padding-right:15px}img{width:40px;height:40px;margin-right:10px}.label{margin-bottom:.5rem}.download-btn{height:2rem;font-weight:400}nb-card{background-color:var(--gauzy-card-1)}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "directive", type: i2.ɵNgNoValidate, selector: "form:not([ngNoForm]):not([ngNativeValidate])" }, { kind: "directive", type: i2.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i2.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i2.NgControlStatusGroup, selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],[formArray],form:not([ngNoForm]),[ngForm]" }, { kind: "directive", type: i2.RequiredValidator, selector: ":not([type=checkbox])[required][formControlName],:not([type=checkbox])[required][formControl],:not([type=checkbox])[required][ngModel]", inputs: ["required"] }, { kind: "directive", type: i2.FormGroupDirective, selector: "[formGroup]", inputs: ["formGroup"], outputs: ["ngSubmit"], exportAs: ["ngForm"] }, { kind: "directive", type: i2.FormControlName, selector: "[formControlName]", inputs: ["formControlName", "disabled", "ngModel"], outputs: ["ngModelChange"] }, { kind: "component", type: i1.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i1.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "component", type: i1.NbCardFooterComponent, selector: "nb-card-footer" }, { kind: "component", type: i1.NbCardHeaderComponent, selector: "nb-card-header" }, { kind: "component", type: i1.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "component", type: i1.NbSelectComponent, selector: "nb-select", inputs: ["size", "status", "shape", "appearance", "optionsListClass", "optionsPanelClass", "optionsWidth", "outline", "filled", "hero", "disabled", "fullWidth", "placeholder", "compareWith", "selected", "multiple", "optionsOverlayOffset", "scrollStrategy"], outputs: ["selectedChange"] }, { kind: "component", type: i1.NbOptionComponent, selector: "nb-option", inputs: ["value", "disabled"], outputs: ["selectionChange"] }, { kind: "directive", type: i1.NbDatepickerDirective, selector: "input[nbDatepicker]", inputs: ["nbDatepicker"] }, { kind: "component", type: i1.NbDatepickerComponent, selector: "nb-datepicker", inputs: ["date"], outputs: ["dateChange"] }, { kind: "directive", type: i1.NbInputDirective, selector: "input[nbInput],textarea[nbInput]", inputs: ["fieldSize", "status", "shape", "fullWidth"] }, { kind: "component", type: i4.TimeOffPolicySelectComponent, selector: "ga-time-off-policy-select", inputs: ["policyId", "policy", "ctrl", "placeholder", "id"], outputs: ["selectedChange"] }, { kind: "pipe", type: i5.TranslatePipe, name: "translate" }] }); }
};
TimeOffHolidayMutationComponent = TimeOffHolidayMutationComponent_1 = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [NbDialogRef,
        UntypedFormBuilder,
        ToastrService,
        EmployeesService,
        Store,
        NbDateService])
], TimeOffHolidayMutationComponent);
export { TimeOffHolidayMutationComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TimeOffHolidayMutationComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-time-off-holiday-mutation', standalone: false, template: "<nb-card class=\"main\">\n  <nb-card-header class=\"dflex flex-column\">\n    <span class=\"cancel\"\n      ><i class=\"fas fa-times\" (click)=\"close()\"></i\n    ></span>\n    <h5 class=\"title\">\n      {{ 'TIME_OFF_PAGE.ADD_HOLIDAYS' | translate }}\n    </h5>\n  </nb-card-header>\n  <nb-card-body>\n    <form [formGroup]=\"form\">\n      <div class=\"row\">\n        <div class=\"col-6\">\n          <div class=\"form-group\">\n            <label class=\"label\">\n              {{ 'TIME_OFF_PAGE.HOLIDAY_NAME' | translate }}\n            </label>\n            <nb-select\n              (selectedChange)=\"onHolidaySelected($event)\"\n              fullWidth\n\t\t\t\t\t\t\t[placeholder]=\"\n\t\t\t\t\t\t\t\t'TIME_OFF_PAGE.SELECT_HOLIDAY_NAME' | translate\n\t\t\t\t\t\t\t\"\n              >\n              @for (holiday of holidays; track holiday) {\n                <nb-option\n                  [value]=\"holiday\"\n                  >\n                  {{ holiday.name }}\n                </nb-option>\n              }\n            </nb-select>\n          </div>\n        </div>\n        <div class=\"col-6\">\n          <div class=\"form-group\">\n            <label class=\"label\">{{\n              'TIME_OFF_PAGE.SELECT_EMPLOYEES' | translate\n            }}</label>\n            <nb-select\n              multiple\n              [selected]=\"employeesArr\"\n              (selectedChange)=\"onEmployeesSelected($event)\"\n              fullWidth\n              required\n\t\t\t\t\t\t\t[placeholder]=\"\n\t\t\t\t\t\t\t\t'TIME_OFF_PAGE.ADD_OR_REMOVE_EMPLOYEES'\n\t\t\t\t\t\t\t\t\t| translate\n\t\t\t\t\t\t\t\"\n              >\n              @for (employee of orgEmployees; track employee) {\n                <nb-option\n                  [value]=\"employee.id\"\n                  >\n                  <img\n                    [src]=\"employee.user.imageUrl\"\n                    alt=\"Smiley face\"\n                    height=\"40\"\n                    width=\"40\"\n                    style=\"margin-right: 10px\"\n                    />\n                    {{ employee.fullName }}\n                  </nb-option>\n                }\n              </nb-select>\n            </div>\n          </div>\n        </div>\n        <div class=\"row\">\n          <div class=\"col-12\">\n            <ga-time-off-policy-select\n              [id]=\"'policy'\"\n              [ctrl]=\"form.get('policyId')\"\n              [placeholder]=\"'TIME_OFF_PAGE.SELECT_TIME_OFF_POLICY' | translate\"\n              (selectedChange)=\"onPolicySelected($event)\"\n              formControlName=\"policyId\"\n            ></ga-time-off-policy-select>\n          </div>\n        </div>\n        <div class=\"row\">\n          <div class=\"col-6\">\n            <div class=\"form-group\">\n              <label class=\"label\" for=\"start\">{{\n                'FORM.LABELS.FROM' | translate\n              }}</label>\n              <input\n                formControlName=\"start\"\n                nbInput\n                fullWidth\n                required\n                [placeholder]=\"'POP_UPS.PICK_DATE' | translate\"\n                [nbDatepicker]=\"startDatePicker\"\n\t\t\t\t\t\t\t[status]=\"\n\t\t\t\t\t\t\t\tFormHelpers.isInvalidControl(form, 'start')\n\t\t\t\t\t\t\t\t\t? 'danger'\n\t\t\t\t\t\t\t\t\t: 'basic'\n\t\t\t\t\t\t\t\"\n                />\n                <nb-datepicker\n                  [min]=\"minDate\"\n                  #startDatePicker\n                ></nb-datepicker>\n              </div>\n            </div>\n            <div class=\"col-6\">\n              <div class=\"form-group\">\n                <label class=\"label\" for=\"end\">{{\n                  'FORM.LABELS.TO' | translate\n                }}</label>\n                <input\n                  formControlName=\"end\"\n                  nbInput\n                  fullWidth\n                  [placeholder]=\"'POP_UPS.PICK_DATE' | translate\"\n                  [nbDatepicker]=\"endDatePicker\"\n\t\t\t\t\t\t\t[status]=\"\n\t\t\t\t\t\t\t\tFormHelpers.isInvalidControl(form, 'end')\n\t\t\t\t\t\t\t\t\t? 'danger'\n\t\t\t\t\t\t\t\t\t: 'basic'\n\t\t\t\t\t\t\t\"\n                  />\n                  <nb-datepicker\n                    [min]=\"minDate\"\n                    #endDatePicker\n                  ></nb-datepicker>\n                </div>\n              </div>\n            </div>\n          </form>\n        </nb-card-body>\n        <nb-card-footer class=\"text-left\">\n          <button\n            (click)=\"close()\"\n            status=\"basic\"\n            outline\n            class=\"mr-3\"\n            nbButton\n            size=\"small\"\n            >\n            {{ 'BUTTONS.CANCEL' | translate }}\n          </button>\n          <button\n            (click)=\"saveHoliday()\"\n            status=\"success\"\n            nbButton\n            [disabled]=\"form.invalid\"\n            size=\"small\"\n            >\n            {{ 'BUTTONS.SAVE' | translate }}\n          </button>\n        </nb-card-footer>\n      </nb-card>\n", styles: ["@charset \"UTF-8\";:host i{cursor:pointer}:host .cancel{width:100%;display:flex}[dir=ltr] :host .cancel{justify-content:flex-end}[dir=rtl] :host .cancel{justify-content:flex-start}:host .cancel i{font-size:11px;color:var(--gauzy-text-color-1)}:host [nbButton].appearance-outline.status-basic{background-color:transparent;border-color:#f56d584d;border-width:2px;color:#f56d58}:host [nbButton].appearance-outline.status-basic:hover{border-color:#f56d58}:host [nbButton].appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #f56d580d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host .title{color:var(--text-primary-color);font-size:16px;font-weight:600;line-height:16px;letter-spacing:0em}:host [nbButton].gray.appearance-outline.status-basic{background-color:transparent;border-color:#7e7e8f4d;border-width:2px;color:#7e7e8f}:host [nbButton].gray.appearance-outline.status-basic:hover{border-color:#7e7e8f}:host [nbButton].gray.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #7e7e8f0d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].gray.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic{background-color:transparent;border-color:#25b8694d;border-width:2px;color:#25b869}:host [nbButton].green.appearance-outline.status-basic:hover{border-color:#25b869}:host [nbButton].green.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #25b8690d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].green.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic[disabled],:host [nbButton].green.appearance-outline.status-basic.btn-disabled{background-color:var(--button-outline-basic-disabled-background-color);border-color:var(--button-outline-basic-disabled-border-color);color:var(--button-outline-basic-disabled-text-color);box-shadow:unset}:host [nbButton].primary.appearance-filled.status-primary{color:var(--text-primary-color);border:unset;background-color:var(--color-primary-transparent-default);box-shadow:var(--gauzy-shadow)}[dir=ltr] :host ::ng-deep input,[dir=ltr] :host ::ng-deep textarea{text-align:start}[dir=rtl] :host ::ng-deep input,[dir=rtl] :host ::ng-deep textarea{text-align:end}:host ::ng-deep input,:host ::ng-deep nb-select.appearance-outline.status-basic .select-button,:host ::ng-deep .ng-select .ng-select-container{background-color:var(--gauzy-sidebar-background-4)!important;border:none;min-height:calc(var(--select-medium-text-line-height) + .4375rem * 2)!important}:host ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-placeholder,:host ::ng-deep .ng-select.ng-select-single .ng-select-container .ng-value-container .ng-input{top:unset!important}:host ::ng-deep label,:host ::ng-deep .label{font-size:var(--text-label-font-size);font-weight:600;line-height:.8125rem;letter-spacing:-.01em;color:var(--gauzy-text-color-2)}:host ::ng-deep textarea{background-color:var(--gauzy-sidebar-background-4)!important;border:none}:host ::ng-deep .ng-select .ng-select-container input,:host ::ng-deep nb-tag-list input{background-color:unset!important}:host nb-card{background-color:var(--gauzy-card-1)}.main{width:645px}.main nb-card-header{display:flex;justify-content:space-between}.main nb-card-header nb-icon{cursor:pointer}.main .checkboxes>:first-child{padding-right:15px}img{width:40px;height:40px;margin-right:10px}.label{margin-bottom:.5rem}.download-btn{height:2rem;font-weight:400}nb-card{background-color:var(--gauzy-card-1)}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [{ type: i1.NbDialogRef }, { type: i2.UntypedFormBuilder }, { type: i3.ToastrService }, { type: i3.EmployeesService }, { type: i3.Store }, { type: i1.NbDateService }] });
//# sourceMappingURL=time-off-holiday-mutation.component.js.map