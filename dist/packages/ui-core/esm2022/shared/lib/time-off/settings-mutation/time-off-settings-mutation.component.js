import { __decorate, __metadata } from "tslib";
import { Component, Input } from '@angular/core';
import { filter, firstValueFrom, tap } from 'rxjs';
import { NbDialogRef } from '@nebular/theme';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { EmployeesService, Store } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "@gauzy/ui-core/core";
import * as i3 from "@angular/forms";
import * as i4 from "@ngx-translate/core";
let TimeOffSettingsMutationComponent = class TimeOffSettingsMutationComponent {
    constructor(dialogRef, employeesService, store) {
        this.dialogRef = dialogRef;
        this.employeesService = employeesService;
        this.store = store;
        this.selectedEmployees = [];
        this.employees = [];
        this.showWarning = false;
    }
    ngOnInit() {
        this.store.selectedOrganization$
            .pipe(filter((organization) => !!organization), tap((organization) => {
            this.organization = organization;
            this.organizationId = organization.id;
        }), untilDestroyed(this))
            .subscribe();
        this.loadEmployees();
        this._initializeForm();
    }
    async loadEmployees() {
        if (!this.organizationId) {
            return;
        }
        const { items } = await firstValueFrom(this.employeesService.getAll(['user'], {
            organization: { id: this.organizationId },
            tenantId: this.organization.tenantId
        }));
        this.employees = items;
        if (this.policy) {
            this.policy.employees.forEach((employee) => {
                this.selectedEmployees.push(employee.id);
            });
        }
    }
    _initializeForm() {
        if (this.policy) {
            this.name = this.policy.name;
            this.paid = this.policy.paid;
            this.requiresApproval = this.policy.requiresApproval;
        }
        else {
            this.name = '';
            this.paid = true;
            this.requiresApproval = false;
        }
    }
    addOrEditPolicy() {
        if (this.name && this.selectedEmployees) {
            this.dialogRef.close({
                name: this.name,
                organizationId: this.organizationId,
                tenantId: this.organization.tenantId,
                employees: this.selectedEmployees,
                requiresApproval: this.requiresApproval,
                paid: this.paid
            });
        }
        else {
            this.showWarning = true;
            const timeoutId = setTimeout(() => {
                this.closeWarning();
            }, 3000); // 3000 milliseconds, adjust as needed
            // Later, if you want to cancel the timeout
            clearTimeout(timeoutId);
        }
    }
    onEmployeesSelected(employees) {
        this.selectedEmployees = employees;
    }
    changeRequiresApproval(checked) {
        this.requiresApproval = checked;
    }
    changePaidStatus(checked) {
        this.paid = checked;
    }
    closeWarning() {
        this.showWarning = !this.showWarning;
    }
    close() {
        this.dialogRef.close();
    }
    ngOnDestroy() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TimeOffSettingsMutationComponent, deps: [{ token: i1.NbDialogRef }, { token: i2.EmployeesService }, { token: i2.Store }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: TimeOffSettingsMutationComponent, isStandalone: false, selector: "ngx-time-off-settings-mutation", inputs: { team: "team" }, ngImport: i0, template: "<nb-card class=\"main\">\n\t<nb-card-header class=\"d-flex flex-column\">\n\t\t<span class=\"cancel\"><i class=\"fas fa-times\" (click)=\"close()\"></i></span>\n\t\t@if (!policy) {\n\t\t<h5 class=\"title\">\n\t\t\t{{ 'TIME_OFF_PAGE.POLICY.ADD_POLICY' | translate }}\n\t\t</h5>\n\t\t} @else {\n\t\t<h5 class=\"title\">\n\t\t\t{{ 'TIME_OFF_PAGE.POLICY.EDIT_POLICY' | translate }}\n\t\t</h5>\n\t\t}\n\t</nb-card-header>\n\t<nb-card-body class=\"pb-0\">\n\t\t<form class=\"row\">\n\t\t\t<div class=\"form-group col-6 mb-2\">\n\t\t\t\t<input\n\t\t\t\t\ttype=\"text\"\n\t\t\t\t\tname=\"name\"\n\t\t\t\t\t[(ngModel)]=\"name\"\n\t\t\t\t\tnbInput\n\t\t\t\t\tfullWidth\n\t\t\t\t\tplaceholder=\"{{ 'FORM.PLACEHOLDERS.POLICY_NAME' | translate }}\"\n\t\t\t\t/>\n\t\t\t</div>\n\t\t\t<div class=\"form-group col-6 mb-2\">\n\t\t\t\t<nb-select\n\t\t\t\t\tmultiple\n\t\t\t\t\t[selected]=\"selectedEmployees\"\n\t\t\t\t\t(selectedChange)=\"onEmployeesSelected($event)\"\n\t\t\t\t\tfullWidth\n\t\t\t\t\tplaceholder=\"{{ 'FORM.PLACEHOLDERS.ADD_REMOVE_EMPLOYEES' | translate }}\"\n\t\t\t\t>\n\t\t\t\t\t@for (employee of employees; track employee) {\n\t\t\t\t\t<nb-option [value]=\"employee.id\">\n\t\t\t\t\t\t<img src=\"{{ employee.user.imageUrl }}\" alt=\"Smiley face\" />\n\t\t\t\t\t\t{{ employee.user.firstName }}\n\t\t\t\t\t\t{{ employee.user.lastName }}</nb-option\n\t\t\t\t\t>\n\t\t\t\t\t}\n\t\t\t\t</nb-select>\n\t\t\t</div>\n\t\t\t<nb-card class=\"col-12 mb-2\" accent=\"warning\" [style.visibility]=\"showWarning ? 'visible' : 'hidden'\">\n\t\t\t\t<p style=\"color: red; font-size: 12px; margin: 0\">\n\t\t\t\t\t{{ 'TIME_OFF_PAGE.POLICY.NAME_IS_REQUIRED' | translate }}\n\t\t\t\t</p>\n\t\t\t</nb-card>\n\t\t\t<div class=\"form-group col-6 checkboxes\">\n\t\t\t\t<nb-checkbox\n\t\t\t\t\t(checkedChange)=\"changeRequiresApproval($event)\"\n\t\t\t\t\tclass=\"my-auto align-center\"\n\t\t\t\t\tstatus=\"primary\"\n\t\t\t\t\t[checked]=\"requiresApproval\"\n\t\t\t\t\t>{{ 'TIME_OFF_PAGE.POLICY.REQUIRES_APPROVAL' | translate }}\n\t\t\t\t</nb-checkbox>\n\t\t\t\t<nb-checkbox\n\t\t\t\t\t(checkedChange)=\"changePaidStatus($event)\"\n\t\t\t\t\tclass=\"my-auto align-center\"\n\t\t\t\t\tstatus=\"primary\"\n\t\t\t\t\t[checked]=\"paid\"\n\t\t\t\t\t>{{ 'TIME_OFF_PAGE.POLICY.PAID' | translate }}\n\t\t\t\t</nb-checkbox>\n\t\t\t</div>\n\t\t</form>\n\t</nb-card-body>\n\t<nb-card-footer class=\"text-left\">\n\t\t<button (click)=\"close()\" status=\"basic\" outline class=\"mr-3\" nbButton>\n\t\t\t{{ 'BUTTONS.CANCEL' | translate }}\n\t\t</button>\n\t\t<button (click)=\"addOrEditPolicy()\" status=\"success\" nbButton>\n\t\t\t{{ 'BUTTONS.SAVE' | translate }}\n\t\t</button>\n\t</nb-card-footer>\n</nb-card>\n", styles: ["@charset \"UTF-8\";:host i{cursor:pointer}:host .cancel{width:100%;display:flex}[dir=ltr] :host .cancel{justify-content:flex-end}[dir=rtl] :host .cancel{justify-content:flex-start}:host .cancel i{font-size:11px;color:var(--gauzy-text-color-1)}:host [nbButton].appearance-outline.status-basic{background-color:transparent;border-color:#f56d584d;border-width:2px;color:#f56d58}:host [nbButton].appearance-outline.status-basic:hover{border-color:#f56d58}:host [nbButton].appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #f56d580d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host .title{color:var(--text-primary-color);font-size:16px;font-weight:600;line-height:16px;letter-spacing:0em}:host [nbButton].gray.appearance-outline.status-basic{background-color:transparent;border-color:#7e7e8f4d;border-width:2px;color:#7e7e8f}:host [nbButton].gray.appearance-outline.status-basic:hover{border-color:#7e7e8f}:host [nbButton].gray.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #7e7e8f0d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].gray.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic{background-color:transparent;border-color:#25b8694d;border-width:2px;color:#25b869}:host [nbButton].green.appearance-outline.status-basic:hover{border-color:#25b869}:host [nbButton].green.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #25b8690d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].green.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic[disabled],:host [nbButton].green.appearance-outline.status-basic.btn-disabled{background-color:var(--button-outline-basic-disabled-background-color);border-color:var(--button-outline-basic-disabled-border-color);color:var(--button-outline-basic-disabled-text-color);box-shadow:unset}:host [nbButton].primary.appearance-filled.status-primary{color:var(--text-primary-color);border:unset;background-color:var(--color-primary-transparent-default);box-shadow:var(--gauzy-shadow)}[dir=ltr] :host ::ng-deep input,[dir=ltr] :host ::ng-deep textarea{text-align:start}[dir=rtl] :host ::ng-deep input,[dir=rtl] :host ::ng-deep textarea{text-align:end}:host ::ng-deep input,:host ::ng-deep nb-select.appearance-outline.status-basic .select-button,:host ::ng-deep .ng-select .ng-select-container{background-color:var(--gauzy-sidebar-background-4)!important;border:none;min-height:calc(var(--select-medium-text-line-height) + .4375rem * 2)!important}:host ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-placeholder,:host ::ng-deep .ng-select.ng-select-single .ng-select-container .ng-value-container .ng-input{top:unset!important}:host ::ng-deep label,:host ::ng-deep .label{font-size:var(--text-label-font-size);font-weight:600;line-height:.8125rem;letter-spacing:-.01em;color:var(--gauzy-text-color-2)}:host ::ng-deep textarea{background-color:var(--gauzy-sidebar-background-4)!important;border:none}:host ::ng-deep .ng-select .ng-select-container input,:host ::ng-deep nb-tag-list input{background-color:unset!important}:host nb-card{background-color:var(--gauzy-card-1)}.main{width:645px}.main nb-card-header{display:flex;justify-content:space-between}.main nb-card-header nb-icon{cursor:pointer}.main .checkboxes>:first-child{padding-right:15px}img{width:40px;height:40px;margin-right:10px}.label{margin-bottom:.5rem}.download-btn{height:2rem;font-weight:400}nb-card{background-color:var(--gauzy-card-1)}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "directive", type: i3.ɵNgNoValidate, selector: "form:not([ngNoForm]):not([ngNativeValidate])" }, { kind: "directive", type: i3.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i3.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i3.NgControlStatusGroup, selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],[formArray],form:not([ngNoForm]),[ngForm]" }, { kind: "directive", type: i3.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "directive", type: i3.NgForm, selector: "form:not([ngNoForm]):not([formGroup]):not([formArray]),ng-form,[ngForm]", inputs: ["ngFormOptions"], outputs: ["ngSubmit"], exportAs: ["ngForm"] }, { kind: "component", type: i1.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i1.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "component", type: i1.NbCardFooterComponent, selector: "nb-card-footer" }, { kind: "component", type: i1.NbCardHeaderComponent, selector: "nb-card-header" }, { kind: "component", type: i1.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "component", type: i1.NbSelectComponent, selector: "nb-select", inputs: ["size", "status", "shape", "appearance", "optionsListClass", "optionsPanelClass", "optionsWidth", "outline", "filled", "hero", "disabled", "fullWidth", "placeholder", "compareWith", "selected", "multiple", "optionsOverlayOffset", "scrollStrategy"], outputs: ["selectedChange"] }, { kind: "component", type: i1.NbOptionComponent, selector: "nb-option", inputs: ["value", "disabled"], outputs: ["selectionChange"] }, { kind: "directive", type: i1.NbInputDirective, selector: "input[nbInput],textarea[nbInput]", inputs: ["fieldSize", "status", "shape", "fullWidth"] }, { kind: "component", type: i1.NbCheckboxComponent, selector: "nb-checkbox", inputs: ["checked", "disabled", "status", "indeterminate"], outputs: ["checkedChange"] }, { kind: "pipe", type: i4.TranslatePipe, name: "translate" }] }); }
};
TimeOffSettingsMutationComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [NbDialogRef,
        EmployeesService,
        Store])
], TimeOffSettingsMutationComponent);
export { TimeOffSettingsMutationComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TimeOffSettingsMutationComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-time-off-settings-mutation', standalone: false, template: "<nb-card class=\"main\">\n\t<nb-card-header class=\"d-flex flex-column\">\n\t\t<span class=\"cancel\"><i class=\"fas fa-times\" (click)=\"close()\"></i></span>\n\t\t@if (!policy) {\n\t\t<h5 class=\"title\">\n\t\t\t{{ 'TIME_OFF_PAGE.POLICY.ADD_POLICY' | translate }}\n\t\t</h5>\n\t\t} @else {\n\t\t<h5 class=\"title\">\n\t\t\t{{ 'TIME_OFF_PAGE.POLICY.EDIT_POLICY' | translate }}\n\t\t</h5>\n\t\t}\n\t</nb-card-header>\n\t<nb-card-body class=\"pb-0\">\n\t\t<form class=\"row\">\n\t\t\t<div class=\"form-group col-6 mb-2\">\n\t\t\t\t<input\n\t\t\t\t\ttype=\"text\"\n\t\t\t\t\tname=\"name\"\n\t\t\t\t\t[(ngModel)]=\"name\"\n\t\t\t\t\tnbInput\n\t\t\t\t\tfullWidth\n\t\t\t\t\tplaceholder=\"{{ 'FORM.PLACEHOLDERS.POLICY_NAME' | translate }}\"\n\t\t\t\t/>\n\t\t\t</div>\n\t\t\t<div class=\"form-group col-6 mb-2\">\n\t\t\t\t<nb-select\n\t\t\t\t\tmultiple\n\t\t\t\t\t[selected]=\"selectedEmployees\"\n\t\t\t\t\t(selectedChange)=\"onEmployeesSelected($event)\"\n\t\t\t\t\tfullWidth\n\t\t\t\t\tplaceholder=\"{{ 'FORM.PLACEHOLDERS.ADD_REMOVE_EMPLOYEES' | translate }}\"\n\t\t\t\t>\n\t\t\t\t\t@for (employee of employees; track employee) {\n\t\t\t\t\t<nb-option [value]=\"employee.id\">\n\t\t\t\t\t\t<img src=\"{{ employee.user.imageUrl }}\" alt=\"Smiley face\" />\n\t\t\t\t\t\t{{ employee.user.firstName }}\n\t\t\t\t\t\t{{ employee.user.lastName }}</nb-option\n\t\t\t\t\t>\n\t\t\t\t\t}\n\t\t\t\t</nb-select>\n\t\t\t</div>\n\t\t\t<nb-card class=\"col-12 mb-2\" accent=\"warning\" [style.visibility]=\"showWarning ? 'visible' : 'hidden'\">\n\t\t\t\t<p style=\"color: red; font-size: 12px; margin: 0\">\n\t\t\t\t\t{{ 'TIME_OFF_PAGE.POLICY.NAME_IS_REQUIRED' | translate }}\n\t\t\t\t</p>\n\t\t\t</nb-card>\n\t\t\t<div class=\"form-group col-6 checkboxes\">\n\t\t\t\t<nb-checkbox\n\t\t\t\t\t(checkedChange)=\"changeRequiresApproval($event)\"\n\t\t\t\t\tclass=\"my-auto align-center\"\n\t\t\t\t\tstatus=\"primary\"\n\t\t\t\t\t[checked]=\"requiresApproval\"\n\t\t\t\t\t>{{ 'TIME_OFF_PAGE.POLICY.REQUIRES_APPROVAL' | translate }}\n\t\t\t\t</nb-checkbox>\n\t\t\t\t<nb-checkbox\n\t\t\t\t\t(checkedChange)=\"changePaidStatus($event)\"\n\t\t\t\t\tclass=\"my-auto align-center\"\n\t\t\t\t\tstatus=\"primary\"\n\t\t\t\t\t[checked]=\"paid\"\n\t\t\t\t\t>{{ 'TIME_OFF_PAGE.POLICY.PAID' | translate }}\n\t\t\t\t</nb-checkbox>\n\t\t\t</div>\n\t\t</form>\n\t</nb-card-body>\n\t<nb-card-footer class=\"text-left\">\n\t\t<button (click)=\"close()\" status=\"basic\" outline class=\"mr-3\" nbButton>\n\t\t\t{{ 'BUTTONS.CANCEL' | translate }}\n\t\t</button>\n\t\t<button (click)=\"addOrEditPolicy()\" status=\"success\" nbButton>\n\t\t\t{{ 'BUTTONS.SAVE' | translate }}\n\t\t</button>\n\t</nb-card-footer>\n</nb-card>\n", styles: ["@charset \"UTF-8\";:host i{cursor:pointer}:host .cancel{width:100%;display:flex}[dir=ltr] :host .cancel{justify-content:flex-end}[dir=rtl] :host .cancel{justify-content:flex-start}:host .cancel i{font-size:11px;color:var(--gauzy-text-color-1)}:host [nbButton].appearance-outline.status-basic{background-color:transparent;border-color:#f56d584d;border-width:2px;color:#f56d58}:host [nbButton].appearance-outline.status-basic:hover{border-color:#f56d58}:host [nbButton].appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #f56d580d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host .title{color:var(--text-primary-color);font-size:16px;font-weight:600;line-height:16px;letter-spacing:0em}:host [nbButton].gray.appearance-outline.status-basic{background-color:transparent;border-color:#7e7e8f4d;border-width:2px;color:#7e7e8f}:host [nbButton].gray.appearance-outline.status-basic:hover{border-color:#7e7e8f}:host [nbButton].gray.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #7e7e8f0d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].gray.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic{background-color:transparent;border-color:#25b8694d;border-width:2px;color:#25b869}:host [nbButton].green.appearance-outline.status-basic:hover{border-color:#25b869}:host [nbButton].green.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #25b8690d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].green.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic[disabled],:host [nbButton].green.appearance-outline.status-basic.btn-disabled{background-color:var(--button-outline-basic-disabled-background-color);border-color:var(--button-outline-basic-disabled-border-color);color:var(--button-outline-basic-disabled-text-color);box-shadow:unset}:host [nbButton].primary.appearance-filled.status-primary{color:var(--text-primary-color);border:unset;background-color:var(--color-primary-transparent-default);box-shadow:var(--gauzy-shadow)}[dir=ltr] :host ::ng-deep input,[dir=ltr] :host ::ng-deep textarea{text-align:start}[dir=rtl] :host ::ng-deep input,[dir=rtl] :host ::ng-deep textarea{text-align:end}:host ::ng-deep input,:host ::ng-deep nb-select.appearance-outline.status-basic .select-button,:host ::ng-deep .ng-select .ng-select-container{background-color:var(--gauzy-sidebar-background-4)!important;border:none;min-height:calc(var(--select-medium-text-line-height) + .4375rem * 2)!important}:host ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-placeholder,:host ::ng-deep .ng-select.ng-select-single .ng-select-container .ng-value-container .ng-input{top:unset!important}:host ::ng-deep label,:host ::ng-deep .label{font-size:var(--text-label-font-size);font-weight:600;line-height:.8125rem;letter-spacing:-.01em;color:var(--gauzy-text-color-2)}:host ::ng-deep textarea{background-color:var(--gauzy-sidebar-background-4)!important;border:none}:host ::ng-deep .ng-select .ng-select-container input,:host ::ng-deep nb-tag-list input{background-color:unset!important}:host nb-card{background-color:var(--gauzy-card-1)}.main{width:645px}.main nb-card-header{display:flex;justify-content:space-between}.main nb-card-header nb-icon{cursor:pointer}.main .checkboxes>:first-child{padding-right:15px}img{width:40px;height:40px;margin-right:10px}.label{margin-bottom:.5rem}.download-btn{height:2rem;font-weight:400}nb-card{background-color:var(--gauzy-card-1)}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [{ type: i1.NbDialogRef }, { type: i2.EmployeesService }, { type: i2.Store }], propDecorators: { team: [{
                type: Input
            }] } });
//# sourceMappingURL=time-off-settings-mutation.component.js.map