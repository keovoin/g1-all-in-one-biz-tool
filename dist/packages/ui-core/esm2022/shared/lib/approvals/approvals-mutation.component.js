import { __decorate, __metadata } from "tslib";
import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UntypedFormBuilder, Validators, FormGroupDirective } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ApprovalPolicyTypesStringEnum } from '@gauzy/contracts';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { Store } from '@gauzy/ui-core/core';
import { ApprovalPolicyService, EmployeesService, OrganizationTeamsService, RequestApprovalService } from '@gauzy/ui-core/core';
import { FormHelpers } from '../forms/helpers';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "@gauzy/ui-core/core";
import * as i3 from "@angular/forms";
import * as i4 from "@ngx-translate/core";
import * as i5 from "@angular/router";
import * as i6 from "../employee/employee-multi-select/employee-multi-select.component";
import * as i7 from "../tags/tags-color-input/tags-color-input.component";
let RequestApprovalMutationComponent = class RequestApprovalMutationComponent extends TranslationBaseComponent {
    constructor(dialogRef, approvalPolicyService, requestApprovalService, employeesService, organizationTeamsService, fb, translationService, store, router) {
        super(translationService);
        this.dialogRef = dialogRef;
        this.approvalPolicyService = approvalPolicyService;
        this.requestApprovalService = requestApprovalService;
        this.employeesService = employeesService;
        this.organizationTeamsService = organizationTeamsService;
        this.fb = fb;
        this.translationService = translationService;
        this.store = store;
        this.router = router;
        this.FormHelpers = FormHelpers;
        this.participants = 'employees';
        this.employees = [];
        this.approvalPolicies = [];
        this.selectedEmployees = [];
        this.selectedApprovalPolicy = [];
        this.tags = [];
    }
    navigateToPolicy() {
        this.dialogRef.close();
        this.router.navigate(['/pages/organization/approval-policy']);
    }
    ngOnInit() {
        if (this.requestApproval) {
            this.selectedTeams = this.requestApproval.teamApprovals?.map((team) => team.teamId) ?? [];
            this.selectedEmployees = this.requestApproval.employeeApprovals?.map((emp) => emp.employeeId) ?? [];
        }
        this.initializeForm();
        this.loadSelectedOrganization();
        this.loadEmployees();
        this.loadTeams();
        this.loadApprovalPolicies();
    }
    ngOnDestroy() { }
    async loadEmployees() {
        this.employeesService
            .getAll(['user'], {
            organizationId: this.organizationId,
            tenantId: this.tenantId
        })
            .pipe(untilDestroyed(this))
            .subscribe((employees) => {
            const { items } = employees;
            this.employees = items;
        });
    }
    async loadApprovalPolicies() {
        this.approvalPolicies = (await this.approvalPolicyService.getForRequestApproval([], {
            organizationId: this.organizationId,
            tenantId: this.tenantId
        })).items;
        if (this.requestApproval) {
            if (this.requestApproval.approvalPolicy) {
                switch (this.requestApproval.approvalPolicy.approvalType) {
                    case ApprovalPolicyTypesStringEnum.TIME_OFF:
                    case ApprovalPolicyTypesStringEnum.EQUIPMENT_SHARING:
                        this.approvalPolicies.push(this.requestApproval.approvalPolicy);
                        break;
                }
            }
        }
        if (!this.requestApproval && this.approvalPolicies && this.approvalPolicies.length > 0) {
            this.approvalPolicies.filter((item) => {
                if (item.approvalType == 'DEFAULT_APPROVAL_POLICY') {
                    this.form.patchValue({
                        approvalPolicyId: item.id
                    });
                }
            });
        }
    }
    loadSelectedOrganization() {
        const { id: organizationId = null, tenantId = null } = this.store.selectedOrganization;
        this.organizationId = organizationId;
        this.tenantId = tenantId;
    }
    onApprovalPolicySelected(approvalPolicySelection) {
        this.selectedApprovalPolicy = approvalPolicySelection;
    }
    async loadTeams() {
        this.teams = (await this.organizationTeamsService.getAll(['members'], {
            organizationId: this.organizationId,
            tenantId: this.tenantId
        })).items;
    }
    async initializeForm() {
        this.form = this.fb.group({
            name: [this.requestApproval?.name ?? '', Validators.required],
            employees: [this.requestApproval?.employeeApprovals?.map((emp) => emp.id) ?? []],
            teams: [this.requestApproval?.teamApprovals?.map((team) => team.id) ?? []],
            min_count: [this.requestApproval?.min_count ?? 1, Validators.required],
            approvalPolicyId: [this.requestApproval?.approvalPolicyId ?? '', Validators.required],
            id: [this.requestApproval?.id ?? null],
            tags: [this.requestApproval?.tags ?? []]
        });
        this.participants = this.requestApproval?.teamApprovals?.length > 0 ? 'teams' : 'employees';
        this.tags = this.form.get('tags').value || [];
        if (this.requestApproval?.approvalPolicy) {
            switch (this.requestApproval.approvalPolicy.approvalType) {
                case ApprovalPolicyTypesStringEnum.TIME_OFF:
                case ApprovalPolicyTypesStringEnum.EQUIPMENT_SHARING:
                    this.form.get('approvalPolicyId').disable();
                    break;
            }
        }
    }
    closeDialog(requestApproval) {
        if (!requestApproval) {
            return this.dialogRef.close(requestApproval);
        }
        const teamMemberIds = new Set(requestApproval.teams
            ?.flatMap((reqTeam) => this.teams?.find((team) => team.id === reqTeam.id)?.members?.map((member) => member.employeeId))
            .filter(Boolean) ?? []);
        requestApproval.employees =
            requestApproval.employees?.filter((reqEmployee) => !teamMemberIds.has(reqEmployee.id)) ?? [];
        this.onReset();
        this.dialogRef.close(requestApproval);
    }
    async onSubmit() {
        if (this.form.invalid || !this.formDirective.submitted) {
            return;
        }
        this.setParticipantsValues(); // Ensure participants are set properly
        if (!this.form.get('id').value) {
            delete this.form.value['id'];
        }
        const requestApproval = {
            name: this.form.value['name'],
            approvalPolicyId: this.form.value['approvalPolicyId'],
            min_count: this.form.value['min_count'],
            employeeApprovals: this.form.value['employees'],
            teams: this.form.value['teams'],
            id: this.form.value['id'],
            tags: this.form.get('tags').value,
            organizationId: this.organizationId,
            tenantId: this.tenantId
        };
        let result;
        result = await this.requestApprovalService.save(requestApproval);
        this.closeDialog(result);
    }
    selectedTagsEvent(currentTagSelection) {
        this.form.get('tags').setValue(currentTagSelection);
        this.form.get('tags').updateValueAndValidity();
    }
    onMembersSelected(members) {
        this.selectedMembers = members;
    }
    onEmployeesSelected(employeeSelection) {
        this.selectedEmployees = employeeSelection;
    }
    onTeamsSelected(teamsSelection) {
        this.selectedTeams = teamsSelection;
    }
    onParticipantsChange(participants) {
        this.participants = participants;
        this.form.updateValueAndValidity();
    }
    /**
     * Handle setting the participant values based on type
     */
    setParticipantsValues() {
        if (this.participants === 'employees') {
            this.form.get('employees').setValue(this.selectedEmployees);
            this.form.get('teams').setValue([]); // Clear teams if employees are selected
        }
        else if (this.participants === 'teams') {
            this.form.get('employees').setValue([]); // Clear employees if teams are selected
        }
    }
    /**
     * Reset approval request mutation form after save
     */
    onReset() {
        this.formDirective.reset();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: RequestApprovalMutationComponent, deps: [{ token: i1.NbDialogRef }, { token: i2.ApprovalPolicyService }, { token: i2.RequestApprovalService }, { token: i2.EmployeesService }, { token: i2.OrganizationTeamsService }, { token: i3.UntypedFormBuilder }, { token: i4.TranslateService }, { token: i2.Store }, { token: i5.Router }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: RequestApprovalMutationComponent, isStandalone: false, selector: "ngx-approval-mutation", viewQueries: [{ propertyName: "formDirective", first: true, predicate: ["formDirective"], descendants: true }], usesInheritance: true, ngImport: i0, template: "<nb-card class=\"main\">\n\t<nb-card-header class=\"d-flex flex-column\">\n\t\t<span class=\"cancel\"><i class=\"fas fa-times\" (click)=\"closeDialog()\"></i></span>\n\t\t<h5 class=\"title\">\n\t\t\t{{\n\t\t\t\t(requestApproval\n\t\t\t\t\t? 'APPROVAL_REQUEST_PAGE.EDIT_APPROVAL_REQUEST'\n\t\t\t\t\t: 'APPROVAL_REQUEST_PAGE.ADD_APPROVAL_REQUEST'\n\t\t\t\t) | translate\n\t\t\t}}\n\t\t</h5>\n\t</nb-card-header>\n\t<nb-card-body class=\"body\">\n\t\t<form [formGroup]=\"form\" (ngSubmit)=\"onSubmit()\" #formDirective=\"ngForm\">\n\t\t\t<div class=\"row\">\n\t\t\t\t<div class=\"col-12 mb-3\">\n\t\t\t\t\t<label for=\"name\" class=\"label\">\n\t\t\t\t\t\t{{ 'APPROVAL_REQUEST_PAGE.APPROVAL_REQUEST_NAME' | translate }}\n\t\t\t\t\t</label>\n\t\t\t\t\t<input\n\t\t\t\t\t\tnbInput\n\t\t\t\t\t\ttype=\"text\"\n\t\t\t\t\t\tformControlName=\"name\"\n\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t[placeholder]=\"'APPROVAL_REQUEST_PAGE.APPROVAL_REQUEST_NAME' | translate\"\n\t\t\t\t\t\t[class.status-danger]=\"FormHelpers.isInvalidControl(form, 'name')\"\n\t\t\t\t\t\t[class.status-success]=\"FormHelpers.isValidControl(form, 'name')\"\n\t\t\t\t\t/>\n\t\t\t\t</div>\n\t\t\t</div>\n\n\t\t\t<div class=\"row\">\n\t\t\t\t<div class=\"col-sm-6 mb-3\">\n\t\t\t\t\t<label for=\"min_count\" class=\"label\">\n\t\t\t\t\t\t{{ 'APPROVAL_REQUEST_PAGE.APPROVAL_REQUEST_MIN_COUNT' | translate }}\n\t\t\t\t\t</label>\n\t\t\t\t\t<input\n\t\t\t\t\t\tnbInput\n\t\t\t\t\t\ttype=\"number\"\n\t\t\t\t\t\t[min]=\"0\"\n\t\t\t\t\t\tformControlName=\"min_count\"\n\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t[placeholder]=\"'APPROVAL_REQUEST_PAGE.APPROVAL_REQUEST_MIN_COUNT' | translate\"\n\t\t\t\t\t/>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"col-sm-6 mb-3\">\n\t\t\t\t\t<label for=\"Approval Policy\" class=\"label\">\n\t\t\t\t\t\t{{ 'APPROVAL_REQUEST_PAGE.APPROVAL_REQUEST_APPROVAL_POLICY' | translate }}\n\t\t\t\t\t</label>\n\t\t\t\t\t<nb-select\n\t\t\t\t\t\tformControlName=\"approvalPolicyId\"\n\t\t\t\t\t\t[selected]=\"selectedApprovalPolicy\"\n\t\t\t\t\t\t(selectedChange)=\"onApprovalPolicySelected($event)\"\n\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\tplaceholder=\"{{ 'APPROVAL_REQUEST_PAGE.CHOOSE_POLICIES' | translate }}\"\n\t\t\t\t\t>\n\t\t\t\t\t\t@for (approvalPolicy of approvalPolicies; track approvalPolicy) {\n\t\t\t\t\t\t<nb-option [value]=\"approvalPolicy.id\"> {{ approvalPolicy.name }}</nb-option>\n\t\t\t\t\t\t}\n\t\t\t\t\t</nb-select>\n\t\t\t\t\t@if (approvalPolicies?.length === 0) {\n\t\t\t\t\t<div class=\"caption-2 mt-1 status-danger\">\n\t\t\t\t\t\t{{ 'SM_TABLE.NO_DATA.APPROVAL_POLICY' | translate }}\n\t\t\t\t\t\t<a href=\"javascript:void(0)\" (click)=\"navigateToPolicy()\">{{ 'BUTTONS.CREATE' | translate }}</a>\n\t\t\t\t\t</div>\n\t\t\t\t\t}\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class=\"row\">\n\t\t\t\t<div class=\"col-sm-12 mb-3\">\n\t\t\t\t\t<nb-radio-group (valueChange)=\"onParticipantsChange($event)\" [value]=\"participants\">\n\t\t\t\t\t\t<nb-radio [value]=\"'employees'\">{{ 'APPROVAL_REQUEST_PAGE.EMPLOYEES' | translate }} </nb-radio>\n\t\t\t\t\t\t<nb-radio [value]=\"'teams'\">{{ 'APPROVAL_REQUEST_PAGE.TEAMS' | translate }} </nb-radio>\n\t\t\t\t\t</nb-radio-group>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class=\"row\">\n\t\t\t\t@if (participants === 'employees') {\n\t\t\t\t<div class=\"col-sm-12 mb-3\">\n\t\t\t\t\t<label for=\"employees\" class=\"label\">\n\t\t\t\t\t\t{{ 'APPROVAL_REQUEST_PAGE.EMPLOYEES' | translate }}\n\t\t\t\t\t</label>\n\t\t\t\t\t<ga-employee-multi-select\n\t\t\t\t\t\t[selectedEmployeeIds]=\"selectedEmployees\"\n\t\t\t\t\t\t[allEmployees]=\"employees\"\n\t\t\t\t\t\t[label]=\"''\"\n\t\t\t\t\t\t(selectedChange)=\"onEmployeesSelected($event)\"\n\t\t\t\t\t>\n\t\t\t\t\t</ga-employee-multi-select>\n\t\t\t\t</div>\n\t\t\t\t} @if (participants === 'teams') {\n\t\t\t\t<div class=\"col-sm-12 mb-3\">\n\t\t\t\t\t<label for=\"teams\" class=\"label\">\n\t\t\t\t\t\t{{ 'APPROVAL_REQUEST_PAGE.TEAMS' | translate }}\n\t\t\t\t\t</label>\n\t\t\t\t\t<nb-select\n\t\t\t\t\t\tformControlName=\"teams\"\n\t\t\t\t\t\tmultiple\n\t\t\t\t\t\t[selected]=\"selectedTeams\"\n\t\t\t\t\t\t[(ngModel)]=\"selectedTeams\"\n\t\t\t\t\t\t(selectedChange)=\"onTeamsSelected($event)\"\n\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\tplaceholder=\"{{ 'FORM.PLACEHOLDERS.CHOOSE_TEAMS' | translate }}\"\n\t\t\t\t\t>\n\t\t\t\t\t\t@for (team of teams; track team) {\n\t\t\t\t\t\t<nb-option [value]=\"team.id\"> {{ team.name }}</nb-option>\n\t\t\t\t\t\t}\n\t\t\t\t\t</nb-select>\n\t\t\t\t</div>\n\t\t\t\t}\n\t\t\t\t<div class=\"col-sm-12 mb-3\">\n\t\t\t\t\t<ga-tags-color-input\n\t\t\t\t\t\t[selectedTags]=\"tags\"\n\t\t\t\t\t\t(selectedTagsEvent)=\"selectedTagsEvent($event)\"\n\t\t\t\t\t\t[isOrgLevel]=\"true\"\n\t\t\t\t\t>\n\t\t\t\t\t</ga-tags-color-input>\n\t\t\t\t</div>\n\t\t\t</div>\n\n\t\t\t<input type=\"hidden\" formControlName=\"id\" />\n\t\t</form>\n\t</nb-card-body>\n\n\t<nb-card-footer class=\"text-left\">\n\t\t<button (click)=\"dialogRef.close()\" status=\"basic\" outline class=\"mr-3\" nbButton>\n\t\t\t{{ 'BUTTONS.CANCEL' | translate }}\n\t\t</button>\n\t\t<button\n\t\t\t[disabled]=\"form.invalid || formDirective.submitted\"\n\t\t\t(click)=\"formDirective.onSubmit()\"\n\t\t\tstatus=\"success\"\n\t\t\tnbButton\n\t\t>\n\t\t\t{{ 'BUTTONS.SAVE' | translate }}\n\t\t</button>\n\t</nb-card-footer>\n</nb-card>\n", styles: ["@charset \"UTF-8\";:host i{cursor:pointer}:host .cancel{width:100%;display:flex}[dir=ltr] :host .cancel{justify-content:flex-end}[dir=rtl] :host .cancel{justify-content:flex-start}:host .cancel i{font-size:11px;color:var(--gauzy-text-color-1)}:host [nbButton].appearance-outline.status-basic{background-color:transparent;border-color:#f56d584d;border-width:2px;color:#f56d58}:host [nbButton].appearance-outline.status-basic:hover{border-color:#f56d58}:host [nbButton].appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #f56d580d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host .title{color:var(--text-primary-color);font-size:16px;font-weight:600;line-height:16px;letter-spacing:0em}:host [nbButton].gray.appearance-outline.status-basic{background-color:transparent;border-color:#7e7e8f4d;border-width:2px;color:#7e7e8f}:host [nbButton].gray.appearance-outline.status-basic:hover{border-color:#7e7e8f}:host [nbButton].gray.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #7e7e8f0d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].gray.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic{background-color:transparent;border-color:#25b8694d;border-width:2px;color:#25b869}:host [nbButton].green.appearance-outline.status-basic:hover{border-color:#25b869}:host [nbButton].green.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #25b8690d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].green.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic[disabled],:host [nbButton].green.appearance-outline.status-basic.btn-disabled{background-color:var(--button-outline-basic-disabled-background-color);border-color:var(--button-outline-basic-disabled-border-color);color:var(--button-outline-basic-disabled-text-color);box-shadow:unset}:host [nbButton].primary.appearance-filled.status-primary{color:var(--text-primary-color);border:unset;background-color:var(--color-primary-transparent-default);box-shadow:var(--gauzy-shadow)}[dir=ltr] :host ::ng-deep input,[dir=ltr] :host ::ng-deep textarea{text-align:start}[dir=rtl] :host ::ng-deep input,[dir=rtl] :host ::ng-deep textarea{text-align:end}:host ::ng-deep input,:host ::ng-deep nb-select.appearance-outline.status-basic .select-button,:host ::ng-deep .ng-select .ng-select-container{background-color:var(--gauzy-sidebar-background-4)!important;border:none;min-height:calc(var(--select-medium-text-line-height) + .4375rem * 2)!important}:host ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-placeholder,:host ::ng-deep .ng-select.ng-select-single .ng-select-container .ng-value-container .ng-input{top:unset!important}:host ::ng-deep label,:host ::ng-deep .label{font-size:var(--text-label-font-size);font-weight:600;line-height:.8125rem;letter-spacing:-.01em;color:var(--gauzy-text-color-2)}:host ::ng-deep textarea{background-color:var(--gauzy-sidebar-background-4)!important;border:none}:host ::ng-deep .ng-select .ng-select-container input,:host ::ng-deep nb-tag-list input{background-color:unset!important}.main{width:645px;max-width:645px}nb-radio-group{display:flex}:host nb-card{background-color:var(--gauzy-card-1)}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "directive", type: i3.ɵNgNoValidate, selector: "form:not([ngNoForm]):not([ngNativeValidate])" }, { kind: "directive", type: i3.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i3.NumberValueAccessor, selector: "input[type=number][formControlName],input[type=number][formControl],input[type=number][ngModel]" }, { kind: "directive", type: i3.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i3.NgControlStatusGroup, selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],[formArray],form:not([ngNoForm]),[ngForm]" }, { kind: "directive", type: i3.MinValidator, selector: "input[type=number][min][formControlName],input[type=number][min][formControl],input[type=number][min][ngModel]", inputs: ["min"] }, { kind: "component", type: i1.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i1.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "component", type: i1.NbCardFooterComponent, selector: "nb-card-footer" }, { kind: "component", type: i1.NbCardHeaderComponent, selector: "nb-card-header" }, { kind: "directive", type: i3.FormGroupDirective, selector: "[formGroup]", inputs: ["formGroup"], outputs: ["ngSubmit"], exportAs: ["ngForm"] }, { kind: "directive", type: i3.FormControlName, selector: "[formControlName]", inputs: ["formControlName", "disabled", "ngModel"], outputs: ["ngModelChange"] }, { kind: "component", type: i1.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "directive", type: i1.NbInputDirective, selector: "input[nbInput],textarea[nbInput]", inputs: ["fieldSize", "status", "shape", "fullWidth"] }, { kind: "component", type: i1.NbSelectComponent, selector: "nb-select", inputs: ["size", "status", "shape", "appearance", "optionsListClass", "optionsPanelClass", "optionsWidth", "outline", "filled", "hero", "disabled", "fullWidth", "placeholder", "compareWith", "selected", "multiple", "optionsOverlayOffset", "scrollStrategy"], outputs: ["selectedChange"] }, { kind: "component", type: i1.NbOptionComponent, selector: "nb-option", inputs: ["value", "disabled"], outputs: ["selectionChange"] }, { kind: "component", type: i1.NbRadioComponent, selector: "nb-radio", inputs: ["name", "checked", "value", "disabled", "status"], outputs: ["valueChange", "blur"] }, { kind: "component", type: i1.NbRadioGroupComponent, selector: "nb-radio-group", inputs: ["value", "name", "disabled", "status"], outputs: ["valueChange"] }, { kind: "component", type: i6.EmployeeSelectComponent, selector: "ga-employee-multi-select", inputs: ["reset", "allEmployees", "selectedEmployeeIds", "multiple", "label", "disabled", "placeholder"], outputs: ["selectedChange", "onLoadEmployees"] }, { kind: "component", type: i7.TagsColorInputComponent, selector: "ga-tags-color-input", inputs: ["selectedTags", "isOrgLevel", "isTenantLevel", "multiple", "label", "addTag"], outputs: ["selectedTagsEvent"] }, { kind: "pipe", type: i4.TranslatePipe, name: "translate" }] }); }
};
RequestApprovalMutationComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [NbDialogRef,
        ApprovalPolicyService,
        RequestApprovalService,
        EmployeesService,
        OrganizationTeamsService,
        UntypedFormBuilder,
        TranslateService,
        Store,
        Router])
], RequestApprovalMutationComponent);
export { RequestApprovalMutationComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: RequestApprovalMutationComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-approval-mutation', standalone: false, template: "<nb-card class=\"main\">\n\t<nb-card-header class=\"d-flex flex-column\">\n\t\t<span class=\"cancel\"><i class=\"fas fa-times\" (click)=\"closeDialog()\"></i></span>\n\t\t<h5 class=\"title\">\n\t\t\t{{\n\t\t\t\t(requestApproval\n\t\t\t\t\t? 'APPROVAL_REQUEST_PAGE.EDIT_APPROVAL_REQUEST'\n\t\t\t\t\t: 'APPROVAL_REQUEST_PAGE.ADD_APPROVAL_REQUEST'\n\t\t\t\t) | translate\n\t\t\t}}\n\t\t</h5>\n\t</nb-card-header>\n\t<nb-card-body class=\"body\">\n\t\t<form [formGroup]=\"form\" (ngSubmit)=\"onSubmit()\" #formDirective=\"ngForm\">\n\t\t\t<div class=\"row\">\n\t\t\t\t<div class=\"col-12 mb-3\">\n\t\t\t\t\t<label for=\"name\" class=\"label\">\n\t\t\t\t\t\t{{ 'APPROVAL_REQUEST_PAGE.APPROVAL_REQUEST_NAME' | translate }}\n\t\t\t\t\t</label>\n\t\t\t\t\t<input\n\t\t\t\t\t\tnbInput\n\t\t\t\t\t\ttype=\"text\"\n\t\t\t\t\t\tformControlName=\"name\"\n\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t[placeholder]=\"'APPROVAL_REQUEST_PAGE.APPROVAL_REQUEST_NAME' | translate\"\n\t\t\t\t\t\t[class.status-danger]=\"FormHelpers.isInvalidControl(form, 'name')\"\n\t\t\t\t\t\t[class.status-success]=\"FormHelpers.isValidControl(form, 'name')\"\n\t\t\t\t\t/>\n\t\t\t\t</div>\n\t\t\t</div>\n\n\t\t\t<div class=\"row\">\n\t\t\t\t<div class=\"col-sm-6 mb-3\">\n\t\t\t\t\t<label for=\"min_count\" class=\"label\">\n\t\t\t\t\t\t{{ 'APPROVAL_REQUEST_PAGE.APPROVAL_REQUEST_MIN_COUNT' | translate }}\n\t\t\t\t\t</label>\n\t\t\t\t\t<input\n\t\t\t\t\t\tnbInput\n\t\t\t\t\t\ttype=\"number\"\n\t\t\t\t\t\t[min]=\"0\"\n\t\t\t\t\t\tformControlName=\"min_count\"\n\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t[placeholder]=\"'APPROVAL_REQUEST_PAGE.APPROVAL_REQUEST_MIN_COUNT' | translate\"\n\t\t\t\t\t/>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"col-sm-6 mb-3\">\n\t\t\t\t\t<label for=\"Approval Policy\" class=\"label\">\n\t\t\t\t\t\t{{ 'APPROVAL_REQUEST_PAGE.APPROVAL_REQUEST_APPROVAL_POLICY' | translate }}\n\t\t\t\t\t</label>\n\t\t\t\t\t<nb-select\n\t\t\t\t\t\tformControlName=\"approvalPolicyId\"\n\t\t\t\t\t\t[selected]=\"selectedApprovalPolicy\"\n\t\t\t\t\t\t(selectedChange)=\"onApprovalPolicySelected($event)\"\n\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\tplaceholder=\"{{ 'APPROVAL_REQUEST_PAGE.CHOOSE_POLICIES' | translate }}\"\n\t\t\t\t\t>\n\t\t\t\t\t\t@for (approvalPolicy of approvalPolicies; track approvalPolicy) {\n\t\t\t\t\t\t<nb-option [value]=\"approvalPolicy.id\"> {{ approvalPolicy.name }}</nb-option>\n\t\t\t\t\t\t}\n\t\t\t\t\t</nb-select>\n\t\t\t\t\t@if (approvalPolicies?.length === 0) {\n\t\t\t\t\t<div class=\"caption-2 mt-1 status-danger\">\n\t\t\t\t\t\t{{ 'SM_TABLE.NO_DATA.APPROVAL_POLICY' | translate }}\n\t\t\t\t\t\t<a href=\"javascript:void(0)\" (click)=\"navigateToPolicy()\">{{ 'BUTTONS.CREATE' | translate }}</a>\n\t\t\t\t\t</div>\n\t\t\t\t\t}\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class=\"row\">\n\t\t\t\t<div class=\"col-sm-12 mb-3\">\n\t\t\t\t\t<nb-radio-group (valueChange)=\"onParticipantsChange($event)\" [value]=\"participants\">\n\t\t\t\t\t\t<nb-radio [value]=\"'employees'\">{{ 'APPROVAL_REQUEST_PAGE.EMPLOYEES' | translate }} </nb-radio>\n\t\t\t\t\t\t<nb-radio [value]=\"'teams'\">{{ 'APPROVAL_REQUEST_PAGE.TEAMS' | translate }} </nb-radio>\n\t\t\t\t\t</nb-radio-group>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class=\"row\">\n\t\t\t\t@if (participants === 'employees') {\n\t\t\t\t<div class=\"col-sm-12 mb-3\">\n\t\t\t\t\t<label for=\"employees\" class=\"label\">\n\t\t\t\t\t\t{{ 'APPROVAL_REQUEST_PAGE.EMPLOYEES' | translate }}\n\t\t\t\t\t</label>\n\t\t\t\t\t<ga-employee-multi-select\n\t\t\t\t\t\t[selectedEmployeeIds]=\"selectedEmployees\"\n\t\t\t\t\t\t[allEmployees]=\"employees\"\n\t\t\t\t\t\t[label]=\"''\"\n\t\t\t\t\t\t(selectedChange)=\"onEmployeesSelected($event)\"\n\t\t\t\t\t>\n\t\t\t\t\t</ga-employee-multi-select>\n\t\t\t\t</div>\n\t\t\t\t} @if (participants === 'teams') {\n\t\t\t\t<div class=\"col-sm-12 mb-3\">\n\t\t\t\t\t<label for=\"teams\" class=\"label\">\n\t\t\t\t\t\t{{ 'APPROVAL_REQUEST_PAGE.TEAMS' | translate }}\n\t\t\t\t\t</label>\n\t\t\t\t\t<nb-select\n\t\t\t\t\t\tformControlName=\"teams\"\n\t\t\t\t\t\tmultiple\n\t\t\t\t\t\t[selected]=\"selectedTeams\"\n\t\t\t\t\t\t[(ngModel)]=\"selectedTeams\"\n\t\t\t\t\t\t(selectedChange)=\"onTeamsSelected($event)\"\n\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\tplaceholder=\"{{ 'FORM.PLACEHOLDERS.CHOOSE_TEAMS' | translate }}\"\n\t\t\t\t\t>\n\t\t\t\t\t\t@for (team of teams; track team) {\n\t\t\t\t\t\t<nb-option [value]=\"team.id\"> {{ team.name }}</nb-option>\n\t\t\t\t\t\t}\n\t\t\t\t\t</nb-select>\n\t\t\t\t</div>\n\t\t\t\t}\n\t\t\t\t<div class=\"col-sm-12 mb-3\">\n\t\t\t\t\t<ga-tags-color-input\n\t\t\t\t\t\t[selectedTags]=\"tags\"\n\t\t\t\t\t\t(selectedTagsEvent)=\"selectedTagsEvent($event)\"\n\t\t\t\t\t\t[isOrgLevel]=\"true\"\n\t\t\t\t\t>\n\t\t\t\t\t</ga-tags-color-input>\n\t\t\t\t</div>\n\t\t\t</div>\n\n\t\t\t<input type=\"hidden\" formControlName=\"id\" />\n\t\t</form>\n\t</nb-card-body>\n\n\t<nb-card-footer class=\"text-left\">\n\t\t<button (click)=\"dialogRef.close()\" status=\"basic\" outline class=\"mr-3\" nbButton>\n\t\t\t{{ 'BUTTONS.CANCEL' | translate }}\n\t\t</button>\n\t\t<button\n\t\t\t[disabled]=\"form.invalid || formDirective.submitted\"\n\t\t\t(click)=\"formDirective.onSubmit()\"\n\t\t\tstatus=\"success\"\n\t\t\tnbButton\n\t\t>\n\t\t\t{{ 'BUTTONS.SAVE' | translate }}\n\t\t</button>\n\t</nb-card-footer>\n</nb-card>\n", styles: ["@charset \"UTF-8\";:host i{cursor:pointer}:host .cancel{width:100%;display:flex}[dir=ltr] :host .cancel{justify-content:flex-end}[dir=rtl] :host .cancel{justify-content:flex-start}:host .cancel i{font-size:11px;color:var(--gauzy-text-color-1)}:host [nbButton].appearance-outline.status-basic{background-color:transparent;border-color:#f56d584d;border-width:2px;color:#f56d58}:host [nbButton].appearance-outline.status-basic:hover{border-color:#f56d58}:host [nbButton].appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #f56d580d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host .title{color:var(--text-primary-color);font-size:16px;font-weight:600;line-height:16px;letter-spacing:0em}:host [nbButton].gray.appearance-outline.status-basic{background-color:transparent;border-color:#7e7e8f4d;border-width:2px;color:#7e7e8f}:host [nbButton].gray.appearance-outline.status-basic:hover{border-color:#7e7e8f}:host [nbButton].gray.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #7e7e8f0d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].gray.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic{background-color:transparent;border-color:#25b8694d;border-width:2px;color:#25b869}:host [nbButton].green.appearance-outline.status-basic:hover{border-color:#25b869}:host [nbButton].green.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #25b8690d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].green.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic[disabled],:host [nbButton].green.appearance-outline.status-basic.btn-disabled{background-color:var(--button-outline-basic-disabled-background-color);border-color:var(--button-outline-basic-disabled-border-color);color:var(--button-outline-basic-disabled-text-color);box-shadow:unset}:host [nbButton].primary.appearance-filled.status-primary{color:var(--text-primary-color);border:unset;background-color:var(--color-primary-transparent-default);box-shadow:var(--gauzy-shadow)}[dir=ltr] :host ::ng-deep input,[dir=ltr] :host ::ng-deep textarea{text-align:start}[dir=rtl] :host ::ng-deep input,[dir=rtl] :host ::ng-deep textarea{text-align:end}:host ::ng-deep input,:host ::ng-deep nb-select.appearance-outline.status-basic .select-button,:host ::ng-deep .ng-select .ng-select-container{background-color:var(--gauzy-sidebar-background-4)!important;border:none;min-height:calc(var(--select-medium-text-line-height) + .4375rem * 2)!important}:host ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-placeholder,:host ::ng-deep .ng-select.ng-select-single .ng-select-container .ng-value-container .ng-input{top:unset!important}:host ::ng-deep label,:host ::ng-deep .label{font-size:var(--text-label-font-size);font-weight:600;line-height:.8125rem;letter-spacing:-.01em;color:var(--gauzy-text-color-2)}:host ::ng-deep textarea{background-color:var(--gauzy-sidebar-background-4)!important;border:none}:host ::ng-deep .ng-select .ng-select-container input,:host ::ng-deep nb-tag-list input{background-color:unset!important}.main{width:645px;max-width:645px}nb-radio-group{display:flex}:host nb-card{background-color:var(--gauzy-card-1)}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [{ type: i1.NbDialogRef }, { type: i2.ApprovalPolicyService }, { type: i2.RequestApprovalService }, { type: i2.EmployeesService }, { type: i2.OrganizationTeamsService }, { type: i3.UntypedFormBuilder }, { type: i4.TranslateService }, { type: i2.Store }, { type: i5.Router }], propDecorators: { formDirective: [{
                type: ViewChild,
                args: ['formDirective']
            }] } });
//# sourceMappingURL=approvals-mutation.component.js.map