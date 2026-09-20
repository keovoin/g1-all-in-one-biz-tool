import { __decorate, __metadata } from "tslib";
import { Component, ViewChild } from '@angular/core';
import { NbDialogRef, NbStepperComponent } from '@nebular/theme';
import { filter, firstValueFrom, tap } from 'rxjs';
import { CrudActionEnum } from '@gauzy/contracts';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { distinctUntilChange } from '@gauzy/ui-core/common';
import { EmployeeStore, EmployeesService, ErrorHandlingService, OrganizationsService, Store } from '@gauzy/ui-core/core';
import { BasicInfoFormComponent } from '../../user/forms';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "@gauzy/ui-core/core";
import * as i3 from "../../user/forms/basic-info/basic-info-form.component";
import * as i4 from "@ngx-translate/core";
let EmployeeMutationComponent = class EmployeeMutationComponent {
    constructor(dialogRef, organizationsService, employeesService, store, errorHandler, _employeeStore) {
        this.dialogRef = dialogRef;
        this.organizationsService = organizationsService;
        this.employeesService = employeesService;
        this.store = store;
        this.errorHandler = errorHandler;
        this._employeeStore = _employeeStore;
        this.loading = false;
        this.linear = true;
        this.employees = [];
    }
    ngOnInit() {
        this.store.selectedOrganization$
            .pipe(distinctUntilChange(), filter((organization) => !!organization), tap((organization) => (this.organization = organization)), untilDestroyed(this))
            .subscribe();
    }
    ngAfterViewInit() {
        this.form = this.userBasicInfo.form;
    }
    /**
     * Closes the dialog window.
     *
     * @param employee An optional array of employees to pass back to the caller.
     */
    closeDialog(employee = null) {
        this.dialogRef.close(employee);
    }
    /**
     * Adds an employee to the employees array based on form input.
     * Resets the form and stepper after adding the employee.
     */
    addEmployee() {
        // Ensure organization is defined
        if (!this.organization) {
            return;
        }
        // Extract necessary data from organization and user store
        const { id: organizationId, tenantId } = this.organization;
        // Retrieve form values
        const { firstName, lastName, email, username, password, tags, imageUrl, imageId } = this.form.value;
        const { offerDate = null, acceptDate = null, rejectDate = null, startedWorkOn = null } = this.form.value;
        // Prepare user object
        const user = {
            firstName,
            lastName,
            username,
            email,
            imageUrl,
            imageId,
            tenantId,
            tags
        };
        // Prepare employee input object
        const employee = {
            user,
            startedWorkOn,
            password,
            organizationId,
            organization: { id: organizationId },
            offerDate,
            acceptDate,
            rejectDate,
            tags
        };
        // Add employee to the array if form is valid
        if (this.form.valid) {
            this.employees.push(employee);
        }
        // Reset form and stepper after adding employee
        this.form.reset();
        this.stepper.reset();
    }
    /**
     * Adds multiple employees and handles the process of creation.
     * Closes the dialog upon successful creation or handles errors.
     */
    async add() {
        // Check if organization is defined
        if (!this.organization) {
            return;
        }
        // Add employee based on form input
        this.addEmployee();
        try {
            // Set loading state to true
            this.loading = true;
            // Create employees in bulk using service
            const employees = await firstValueFrom(this.employeesService.createBulk(this.employees));
            this.loading = false; // Set loading state to false regardless of success or failure
            // Update employee action in store
            this._employeeStore.employeeAction = {
                action: CrudActionEnum.CREATED,
                employees
            };
            // Close dialog with created employees
            this.closeDialog(employees);
        }
        catch (error) {
            // Handle errors using error handler service
            this.errorHandler.handleError(error);
        }
    }
    /**
     * Removed one employee in the array of employees.
     * @param tag
     */
    onEmployeeRemove(tag) {
        this.employees = this.employees.filter((t) => t.user.email !== tag.text);
    }
    /**
     * Go to the next step without saving the data even if the form is valid.
     */
    nextStep() {
        this.form.reset();
        this.stepper.next();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EmployeeMutationComponent, deps: [{ token: i1.NbDialogRef }, { token: i2.OrganizationsService }, { token: i2.EmployeesService }, { token: i2.Store }, { token: i2.ErrorHandlingService }, { token: i2.EmployeeStore }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: EmployeeMutationComponent, isStandalone: false, selector: "ga-employee-mutation", viewQueries: [{ propertyName: "userBasicInfo", first: true, predicate: ["userBasicInfo"], descendants: true }, { propertyName: "stepper", first: true, predicate: ["stepper"], descendants: true }], ngImport: i0, template: "<nb-card\n  [nbSpinner]=\"loading\"\n  nbSpinnerStatus=\"primary\"\n  nbSpinnerSize=\"large\"\n  >\n  <nb-card-header class=\"d-flex flex-column\">\n    <span class=\"cancel\"\n      ><i class=\"fas fa-times\" (click)=\"closeDialog()\"></i\n    ></span>\n    <h5 class=\"title\">\n      {{ 'EMPLOYEES_PAGE.ADD_EMPLOYEE' | translate }}\n    </h5>\n  </nb-card-header>\n  <nb-card-body>\n    <nb-stepper\n      [linear]=\"linear\"\n      orientation=\"horizontal\"\n      disableStepNavigation\n      #stepper\n      >\n      <nb-step [label]=\"step1\">\n        <ng-template #step1>\n          {{ 'EMPLOYEES_PAGE.ADD_EMPLOYEES.STEP_1' | translate }}\n        </ng-template>\n        @if (employees.length > 0) {\n          <div class=\"row\">\n            <div class=\"col m-2 p-0\">\n              <nb-tag-list (tagRemove)=\"onEmployeeRemove($event)\">\n                @for (employee of employees; track employee) {\n                  <nb-tag\n                    removable\n                    [text]=\"employee?.user?.email\"\n                  ></nb-tag>\n                }\n              </nb-tag-list>\n            </div>\n          </div>\n        }\n        <ga-user-basic-info-form\n          #userBasicInfo\n          [isShowRole]=\"false\"\n          [isEmployee]=\"true\"\n        ></ga-user-basic-info-form>\n        <div class=\"text-left\">\n          @if (employees.length) {\n            <button\n              class=\"mr-2\"\n              status=\"basic\"\n              outline\n              (click)=\"nextStep()\"\n              size=\"small\"\n              nbButton\n              >\n              {{ 'BUTTONS.CANCEL' | translate }}\n            </button>\n          }\n          <button\n            status=\"basic\"\n            [disabled]=\"userBasicInfo.form.invalid\"\n            outline\n            class=\"green\"\n            nbButton\n            size=\"small\"\n            nbStepperNext\n            >\n            {{ 'EMPLOYEES_PAGE.ADD_EMPLOYEES.NEXT' | translate }}\n          </button>\n        </div>\n      </nb-step>\n      <nb-step [label]=\"step2\">\n        <ng-template #step2>\n          {{ 'EMPLOYEES_PAGE.ADD_EMPLOYEES.STEP_2' | translate }}\n        </ng-template>\n        <div class=\"text-left\">\n          <button\n            status=\"basic\"\n            size=\"small\"\n            class=\"gray\"\n            outline\n            nbButton\n            nbStepperPrevious\n            >\n            {{\n            'EMPLOYEES_PAGE.ADD_EMPLOYEES.PREVIOUS' | translate\n            }}\n          </button>\n          <button\n            nbButton\n            status=\"success\"\n            size=\"small\"\n            class=\"mr-3 ml-3\"\n            (click)=\"addEmployee()\"\n            >\n            {{\n            'EMPLOYEES_PAGE.ADD_EMPLOYEES.ADD_ANOTHER_EMPLOYEE'\n            | translate\n            }}\n          </button>\n          <button\n            status=\"basic\"\n            class=\"green\"\n            size=\"small\"\n            outline\n            nbButton\n            nbStepperNext\n            >\n            {{ 'EMPLOYEES_PAGE.ADD_EMPLOYEES.NEXT' | translate }}\n          </button>\n        </div>\n      </nb-step>\n      <nb-step [label]=\"step3\">\n        <ng-template #step3>\n          {{ 'EMPLOYEES_PAGE.ADD_EMPLOYEES.STEP_3' | translate }}\n        </ng-template>\n        <div class=\"text-left\">\n          <button\n            class=\"gray\"\n            status=\"basic\"\n            outline\n            size=\"small\"\n            nbButton\n            nbStepperPrevious\n            >\n            {{\n            'EMPLOYEES_PAGE.ADD_EMPLOYEES.PREVIOUS' | translate\n            }}\n          </button>\n          <button\n            size=\"small\"\n            status=\"success\"\n            class=\"mr-3 ml-3\"\n            (click)=\"add()\"\n            nbButton\n            >\n            {{\n            'EMPLOYEES_PAGE.ADD_EMPLOYEES.FINISHED_ADDING'\n            | translate\n            }}\n          </button>\n        </div>\n      </nb-step>\n    </nb-stepper>\n  </nb-card-body>\n</nb-card>\n", styles: ["@charset \"UTF-8\";:host i{cursor:pointer}:host .cancel{width:100%;display:flex}[dir=ltr] :host .cancel{justify-content:flex-end}[dir=rtl] :host .cancel{justify-content:flex-start}:host .cancel i{font-size:11px;color:var(--gauzy-text-color-1)}:host [nbButton].appearance-outline.status-basic{background-color:transparent;border-color:#f56d584d;border-width:2px;color:#f56d58}:host [nbButton].appearance-outline.status-basic:hover{border-color:#f56d58}:host [nbButton].appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #f56d580d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host .title{color:var(--text-primary-color);font-size:16px;font-weight:600;line-height:16px;letter-spacing:0em}:host [nbButton].gray.appearance-outline.status-basic{background-color:transparent;border-color:#7e7e8f4d;border-width:2px;color:#7e7e8f}:host [nbButton].gray.appearance-outline.status-basic:hover{border-color:#7e7e8f}:host [nbButton].gray.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #7e7e8f0d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].gray.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic{background-color:transparent;border-color:#25b8694d;border-width:2px;color:#25b869}:host [nbButton].green.appearance-outline.status-basic:hover{border-color:#25b869}:host [nbButton].green.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #25b8690d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].green.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic[disabled],:host [nbButton].green.appearance-outline.status-basic.btn-disabled{background-color:var(--button-outline-basic-disabled-background-color);border-color:var(--button-outline-basic-disabled-border-color);color:var(--button-outline-basic-disabled-text-color);box-shadow:unset}:host [nbButton].primary.appearance-filled.status-primary{color:var(--text-primary-color);border:unset;background-color:var(--color-primary-transparent-default);box-shadow:var(--gauzy-shadow)}[dir=ltr] :host ::ng-deep input,[dir=ltr] :host ::ng-deep textarea{text-align:start}[dir=rtl] :host ::ng-deep input,[dir=rtl] :host ::ng-deep textarea{text-align:end}:host ::ng-deep input,:host ::ng-deep nb-select.appearance-outline.status-basic .select-button,:host ::ng-deep .ng-select .ng-select-container{background-color:var(--gauzy-sidebar-background-4)!important;border:none;min-height:calc(var(--select-medium-text-line-height) + .4375rem * 2)!important}:host ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-placeholder,:host ::ng-deep .ng-select.ng-select-single .ng-select-container .ng-value-container .ng-input{top:unset!important}:host ::ng-deep label,:host ::ng-deep .label{font-size:var(--text-label-font-size);font-weight:600;line-height:.8125rem;letter-spacing:-.01em;color:var(--gauzy-text-color-2)}:host ::ng-deep textarea{background-color:var(--gauzy-sidebar-background-4)!important;border:none}:host ::ng-deep .ng-select .ng-select-container input,:host ::ng-deep nb-tag-list input{background-color:unset!important}:host nb-card{background-color:var(--gauzy-card-1)}:host nb-card{background-color:var(--gauzy-card-1);width:645px}:host nb-card nb-card-header nb-icon.close{cursor:pointer}:host nb-card nb-tag-list nb-tag::ng-deep{text-transform:initial}:host ::ng-deep div.step-content{padding:20px 0}:host .button-container{display:flex;justify-content:flex-start}[dir=ltr] :host .button-container button{margin:0 0 0 1rem}[dir=rtl] :host .button-container button{margin-left:0 1rem 0 0}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "component", type: i1.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i1.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "component", type: i1.NbCardHeaderComponent, selector: "nb-card-header" }, { kind: "component", type: i1.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "component", type: i1.NbStepperComponent, selector: "nb-stepper", inputs: ["selectedIndex", "disableStepNavigation", "selected", "orientation", "linear"], outputs: ["stepChange"] }, { kind: "component", type: i1.NbStepComponent, selector: "nb-step", inputs: ["stepControl", "label", "hidden", "completed"] }, { kind: "directive", type: i1.NbStepperNextDirective, selector: "button[nbStepperNext]", inputs: ["type"] }, { kind: "directive", type: i1.NbStepperPreviousDirective, selector: "button[nbStepperPrevious]", inputs: ["type"] }, { kind: "component", type: i1.NbTagComponent, selector: "nb-tag", inputs: ["text", "selected", "removable", "appearance", "status", "size", "role"], outputs: ["remove", "selectedChange"], exportAs: ["nbTag"] }, { kind: "component", type: i1.NbTagListComponent, selector: "nb-tag-list", inputs: ["size", "tabIndex", "role", "multiple"], outputs: ["tagRemove"], exportAs: ["nbTagList"] }, { kind: "directive", type: i1.NbSpinnerDirective, selector: "[nbSpinner]", inputs: ["nbSpinnerMessage", "nbSpinnerStatus", "nbSpinnerSize", "nbSpinner"] }, { kind: "component", type: i3.BasicInfoFormComponent, selector: "ga-user-basic-info-form", inputs: ["selectedTags", "isCandidate", "isEmployee", "isShowRole"] }, { kind: "pipe", type: i4.TranslatePipe, name: "translate" }] }); }
};
EmployeeMutationComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [NbDialogRef,
        OrganizationsService,
        EmployeesService,
        Store,
        ErrorHandlingService,
        EmployeeStore])
], EmployeeMutationComponent);
export { EmployeeMutationComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EmployeeMutationComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-employee-mutation', standalone: false, template: "<nb-card\n  [nbSpinner]=\"loading\"\n  nbSpinnerStatus=\"primary\"\n  nbSpinnerSize=\"large\"\n  >\n  <nb-card-header class=\"d-flex flex-column\">\n    <span class=\"cancel\"\n      ><i class=\"fas fa-times\" (click)=\"closeDialog()\"></i\n    ></span>\n    <h5 class=\"title\">\n      {{ 'EMPLOYEES_PAGE.ADD_EMPLOYEE' | translate }}\n    </h5>\n  </nb-card-header>\n  <nb-card-body>\n    <nb-stepper\n      [linear]=\"linear\"\n      orientation=\"horizontal\"\n      disableStepNavigation\n      #stepper\n      >\n      <nb-step [label]=\"step1\">\n        <ng-template #step1>\n          {{ 'EMPLOYEES_PAGE.ADD_EMPLOYEES.STEP_1' | translate }}\n        </ng-template>\n        @if (employees.length > 0) {\n          <div class=\"row\">\n            <div class=\"col m-2 p-0\">\n              <nb-tag-list (tagRemove)=\"onEmployeeRemove($event)\">\n                @for (employee of employees; track employee) {\n                  <nb-tag\n                    removable\n                    [text]=\"employee?.user?.email\"\n                  ></nb-tag>\n                }\n              </nb-tag-list>\n            </div>\n          </div>\n        }\n        <ga-user-basic-info-form\n          #userBasicInfo\n          [isShowRole]=\"false\"\n          [isEmployee]=\"true\"\n        ></ga-user-basic-info-form>\n        <div class=\"text-left\">\n          @if (employees.length) {\n            <button\n              class=\"mr-2\"\n              status=\"basic\"\n              outline\n              (click)=\"nextStep()\"\n              size=\"small\"\n              nbButton\n              >\n              {{ 'BUTTONS.CANCEL' | translate }}\n            </button>\n          }\n          <button\n            status=\"basic\"\n            [disabled]=\"userBasicInfo.form.invalid\"\n            outline\n            class=\"green\"\n            nbButton\n            size=\"small\"\n            nbStepperNext\n            >\n            {{ 'EMPLOYEES_PAGE.ADD_EMPLOYEES.NEXT' | translate }}\n          </button>\n        </div>\n      </nb-step>\n      <nb-step [label]=\"step2\">\n        <ng-template #step2>\n          {{ 'EMPLOYEES_PAGE.ADD_EMPLOYEES.STEP_2' | translate }}\n        </ng-template>\n        <div class=\"text-left\">\n          <button\n            status=\"basic\"\n            size=\"small\"\n            class=\"gray\"\n            outline\n            nbButton\n            nbStepperPrevious\n            >\n            {{\n            'EMPLOYEES_PAGE.ADD_EMPLOYEES.PREVIOUS' | translate\n            }}\n          </button>\n          <button\n            nbButton\n            status=\"success\"\n            size=\"small\"\n            class=\"mr-3 ml-3\"\n            (click)=\"addEmployee()\"\n            >\n            {{\n            'EMPLOYEES_PAGE.ADD_EMPLOYEES.ADD_ANOTHER_EMPLOYEE'\n            | translate\n            }}\n          </button>\n          <button\n            status=\"basic\"\n            class=\"green\"\n            size=\"small\"\n            outline\n            nbButton\n            nbStepperNext\n            >\n            {{ 'EMPLOYEES_PAGE.ADD_EMPLOYEES.NEXT' | translate }}\n          </button>\n        </div>\n      </nb-step>\n      <nb-step [label]=\"step3\">\n        <ng-template #step3>\n          {{ 'EMPLOYEES_PAGE.ADD_EMPLOYEES.STEP_3' | translate }}\n        </ng-template>\n        <div class=\"text-left\">\n          <button\n            class=\"gray\"\n            status=\"basic\"\n            outline\n            size=\"small\"\n            nbButton\n            nbStepperPrevious\n            >\n            {{\n            'EMPLOYEES_PAGE.ADD_EMPLOYEES.PREVIOUS' | translate\n            }}\n          </button>\n          <button\n            size=\"small\"\n            status=\"success\"\n            class=\"mr-3 ml-3\"\n            (click)=\"add()\"\n            nbButton\n            >\n            {{\n            'EMPLOYEES_PAGE.ADD_EMPLOYEES.FINISHED_ADDING'\n            | translate\n            }}\n          </button>\n        </div>\n      </nb-step>\n    </nb-stepper>\n  </nb-card-body>\n</nb-card>\n", styles: ["@charset \"UTF-8\";:host i{cursor:pointer}:host .cancel{width:100%;display:flex}[dir=ltr] :host .cancel{justify-content:flex-end}[dir=rtl] :host .cancel{justify-content:flex-start}:host .cancel i{font-size:11px;color:var(--gauzy-text-color-1)}:host [nbButton].appearance-outline.status-basic{background-color:transparent;border-color:#f56d584d;border-width:2px;color:#f56d58}:host [nbButton].appearance-outline.status-basic:hover{border-color:#f56d58}:host [nbButton].appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #f56d580d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host .title{color:var(--text-primary-color);font-size:16px;font-weight:600;line-height:16px;letter-spacing:0em}:host [nbButton].gray.appearance-outline.status-basic{background-color:transparent;border-color:#7e7e8f4d;border-width:2px;color:#7e7e8f}:host [nbButton].gray.appearance-outline.status-basic:hover{border-color:#7e7e8f}:host [nbButton].gray.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #7e7e8f0d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].gray.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic{background-color:transparent;border-color:#25b8694d;border-width:2px;color:#25b869}:host [nbButton].green.appearance-outline.status-basic:hover{border-color:#25b869}:host [nbButton].green.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #25b8690d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].green.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic[disabled],:host [nbButton].green.appearance-outline.status-basic.btn-disabled{background-color:var(--button-outline-basic-disabled-background-color);border-color:var(--button-outline-basic-disabled-border-color);color:var(--button-outline-basic-disabled-text-color);box-shadow:unset}:host [nbButton].primary.appearance-filled.status-primary{color:var(--text-primary-color);border:unset;background-color:var(--color-primary-transparent-default);box-shadow:var(--gauzy-shadow)}[dir=ltr] :host ::ng-deep input,[dir=ltr] :host ::ng-deep textarea{text-align:start}[dir=rtl] :host ::ng-deep input,[dir=rtl] :host ::ng-deep textarea{text-align:end}:host ::ng-deep input,:host ::ng-deep nb-select.appearance-outline.status-basic .select-button,:host ::ng-deep .ng-select .ng-select-container{background-color:var(--gauzy-sidebar-background-4)!important;border:none;min-height:calc(var(--select-medium-text-line-height) + .4375rem * 2)!important}:host ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-placeholder,:host ::ng-deep .ng-select.ng-select-single .ng-select-container .ng-value-container .ng-input{top:unset!important}:host ::ng-deep label,:host ::ng-deep .label{font-size:var(--text-label-font-size);font-weight:600;line-height:.8125rem;letter-spacing:-.01em;color:var(--gauzy-text-color-2)}:host ::ng-deep textarea{background-color:var(--gauzy-sidebar-background-4)!important;border:none}:host ::ng-deep .ng-select .ng-select-container input,:host ::ng-deep nb-tag-list input{background-color:unset!important}:host nb-card{background-color:var(--gauzy-card-1)}:host nb-card{background-color:var(--gauzy-card-1);width:645px}:host nb-card nb-card-header nb-icon.close{cursor:pointer}:host nb-card nb-tag-list nb-tag::ng-deep{text-transform:initial}:host ::ng-deep div.step-content{padding:20px 0}:host .button-container{display:flex;justify-content:flex-start}[dir=ltr] :host .button-container button{margin:0 0 0 1rem}[dir=rtl] :host .button-container button{margin-left:0 1rem 0 0}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [{ type: i1.NbDialogRef }, { type: i2.OrganizationsService }, { type: i2.EmployeesService }, { type: i2.Store }, { type: i2.ErrorHandlingService }, { type: i2.EmployeeStore }], propDecorators: { userBasicInfo: [{
                type: ViewChild,
                args: ['userBasicInfo']
            }], stepper: [{
                type: ViewChild,
                args: ['stepper']
            }] } });
//# sourceMappingURL=employee-mutation.component.js.map