import { __decorate, __metadata } from "tslib";
import { Component } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { RequestApprovalStatusTypesEnum, RequestApprovalStatus, EquipmentSharingParticipantEnum } from '@gauzy/contracts';
import { NbDialogRef } from '@nebular/theme';
import { distinctUntilChange, isNotEmpty } from '@gauzy/ui-core/common';
import { filter } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { EmployeesService, EquipmentService, EquipmentSharingPolicyService, EquipmentSharingService, OrganizationTeamsService, Store } from '@gauzy/ui-core/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "@gauzy/ui-core/core";
import * as i3 from "@angular/forms";
import * as i4 from "@ngx-translate/core";
import * as i5 from "../../employee/employee-multi-select/employee-multi-select.component";
let EquipmentSharingMutationComponent = class EquipmentSharingMutationComponent extends TranslationBaseComponent {
    constructor(dialogRef, equipmentSharingService, equipmentService, store, fb, translationService, employeesService, organizationTeamsService, equipmentSharingPolicyService) {
        super(translationService);
        this.dialogRef = dialogRef;
        this.equipmentSharingService = equipmentSharingService;
        this.equipmentService = equipmentService;
        this.store = store;
        this.fb = fb;
        this.translationService = translationService;
        this.employeesService = employeesService;
        this.organizationTeamsService = organizationTeamsService;
        this.equipmentSharingPolicyService = equipmentSharingPolicyService;
        this.employees = [];
        this.participants = EquipmentSharingParticipantEnum.EMPLOYEE;
        this.selectedEmployees = [];
        this.selectedTeams = [];
        this.equipmentSharingPolicies = [];
        this.requestStatuses = Object.values(RequestApprovalStatus);
        this.equipmentSharingParticipantEnum = EquipmentSharingParticipantEnum;
        this.date1 = new Date();
        this.date2 = new Date();
        this.filter = this.datePickerFilterPredicate.bind(this);
        this.periodsUnderUse = [];
    }
    ngOnInit() {
        this.store.selectedOrganization$
            .pipe(filter((organization) => !!organization), distinctUntilChange(), untilDestroyed(this))
            .subscribe((organization) => {
            if (organization) {
                this.selectedOrganization = organization;
                this.initializeForm();
                this.loadEquipmentItems();
                this.loadEmployees();
                this.loadTeams();
                this.loadEquipmentSharingPolicy();
                this.loadRequestStatus();
                this.validateForm();
            }
        });
    }
    parseInt(value) {
        return parseInt(value, 10);
    }
    ngOnDestroy() { }
    async initializeForm() {
        this.form = this.fb.group({
            equipment: [this.equipmentSharing ? this.equipmentSharing.equipmentId : '', Validators.required],
            equipmentSharingPolicyId: [
                this.equipmentSharing && this.equipmentSharing.equipmentSharingPolicyId
                    ? this.equipmentSharing.equipmentSharingPolicyId
                    : '',
                Validators.required
            ],
            employees: [this.equipmentSharing ? this.equipmentSharing.employees.map((emp) => emp.id) : []],
            teams: [this.equipmentSharing ? this.equipmentSharing.teams.map((team) => team.id) : []],
            shareRequestDay: [
                this.equipmentSharing ? new Date(this.equipmentSharing.shareRequestDay) : new Date(Date.now())
            ],
            shareStartDay: [this.equipmentSharing ? new Date(this.equipmentSharing.shareStartDay) : null],
            shareEndDay: [this.equipmentSharing ? new Date(this.equipmentSharing.shareEndDay) : null],
            status: [this.requestStatus],
            name: [
                this.equipmentSharing && this.equipmentSharing.name ? this.equipmentSharing.name : '',
                Validators.required
            ]
        });
        /**
         * Auto select participants (TEAM/EMPLOYEE)
         */
        const { teams } = this.form.getRawValue();
        if (isNotEmpty(teams)) {
            this.participants = EquipmentSharingParticipantEnum.TEAM;
        }
        else {
            this.participants = EquipmentSharingParticipantEnum.EMPLOYEE;
        }
    }
    /**
     * Load equipment sharing policies for the selected organization.
     */
    async loadEquipmentSharingPolicy() {
        const { id: organizationId, tenantId } = this.selectedOrganization;
        this.equipmentSharingPolicies = (await this.equipmentSharingPolicyService.getAll({
            organizationId,
            tenantId
        }, [])).items;
    }
    onEquipmentSharingPolicySelected(equipmentSharingPolicy) {
        this.selectedEquipmentSharingPolicy = equipmentSharingPolicy;
    }
    async onSaveRequest() {
        const shareRequest = {
            equipmentId: this.form.value['equipment'],
            equipment: this.equipmentItems.find((eq) => eq.id === this.form.value['equipment']),
            equipmentSharingPolicyId: this.form.value['equipmentSharingPolicyId'],
            employees: this.employees.filter((emp) => {
                return this.selectedEmployees.includes(emp.id);
            }),
            teams: this.teams.filter((team) => {
                return this.selectedTeams.includes(team.id);
            }),
            shareRequestDay: this.form.value['shareRequestDay'],
            shareStartDay: this.form.value['shareStartDay'],
            shareEndDay: this.form.value['shareEndDay'],
            status: this.requestStatus,
            name: this.form.value['name'],
            organizationId: this.selectedOrganization.id,
            tenantId: this.selectedOrganization.tenantId
        };
        let equipmentSharing;
        if (this.equipmentSharing) {
            equipmentSharing = await this.equipmentSharingService.update(this.equipmentSharing.id, shareRequest);
        }
        else {
            equipmentSharing = await this.equipmentSharingService.create(shareRequest, this.selectedOrganization.id);
        }
        this.closeDialog(equipmentSharing);
    }
    async closeDialog(equipmentSharing) {
        this.dialogRef.close(equipmentSharing);
    }
    async loadEquipmentItems() {
        const { id, tenantId } = this.selectedOrganization;
        this.equipmentItems = (await this.equipmentService.getAll(['equipmentSharings'], {
            organizationId: id,
            tenantId
        })).items;
    }
    async loadEmployees() {
        const { id, tenantId } = this.selectedOrganization;
        this.employeesService
            .getAll(['user'], {
            organizationId: id,
            tenantId
        })
            .pipe(untilDestroyed(this))
            .subscribe(({ items }) => {
            this.employees = items;
        });
    }
    async loadTeams() {
        const { id, tenantId } = this.selectedOrganization;
        this.teams = (await this.organizationTeamsService.getAll(['members'], {
            organizationId: id,
            tenantId
        })).items;
    }
    loadRequestStatus() {
        this.requestStatus = this.equipmentSharing
            ? this.equipmentSharing.status
            : RequestApprovalStatusTypesEnum.REQUESTED;
    }
    setRequestStatus(statusValue) {
        const selectedItem = this.equipmentItems.find((item) => {
            return item.id === statusValue;
        });
        if (this.equipmentSharing && this.equipmentSharing.status === RequestApprovalStatusTypesEnum.REFUSED) {
            this.requestStatus = RequestApprovalStatusTypesEnum.REFUSED;
            return;
        }
        if (selectedItem.autoApproveShare) {
            this.requestStatus = RequestApprovalStatusTypesEnum.APPROVED;
        }
        else {
            this.requestStatus = RequestApprovalStatusTypesEnum.REQUESTED;
        }
    }
    onEmployeesSelected(employees) {
        this.selectedEmployees = employees;
        this.form.get('employees').setValue(employees);
        this.form.get('employees').updateValueAndValidity();
    }
    onTeamsSelected(teamsSelection) {
        this.selectedTeams = teamsSelection;
    }
    onParticipantsChange(participants) {
        this.participants = participants;
    }
    validateForm() {
        if (this.equipmentSharing) {
            this.selectedItem = this.equipmentSharing.equipment;
        }
        this.shareRequestDay = this.form.get('shareRequestDay');
        this.shareStartDay = this.form.get('shareStartDay');
        this.shareEndDay = this.form.get('shareEndDay');
        // hours * minutes * seconds * milliseconds
        const oneDay = 24 * 60 * 60 * 1000;
        this.form
            .get('equipment')
            .valueChanges.pipe(untilDestroyed(this))
            .subscribe((valueId) => {
            this.selectedItem = this.equipmentItems.find((item) => {
                return item.id === valueId;
            });
            this.periodsUnderUse = [];
            if (this.selectedItem.equipmentSharings.length > 0) {
                this.selectedItem.equipmentSharings.forEach((equipmentSharing) => {
                    this.periodsUnderUse.push({
                        startDate: new Date(equipmentSharing.shareStartDay),
                        endDate: new Date(equipmentSharing.shareEndDay)
                    });
                });
            }
        });
        this.form.valueChanges.pipe(untilDestroyed(this)).subscribe((form) => {
            //check if start day is after share request day
            if (this.shareStartDay.value <= this.shareRequestDay.value) {
                this.shareStartDay.setErrors({
                    invalid: true,
                    beforeRequestDay: true,
                    beforeRequestDayMsg: this.getTranslation('EQUIPMENT_SHARING_PAGE.MESSAGES.BEFORE_REQUEST_DAY_ERR')
                });
            }
            //check if user selects longer period than allowed
            const diffDays = Math.ceil(Math.abs((this.shareEndDay.value - this.shareStartDay.value) / oneDay));
            if (this.selectedItem &&
                this.selectedItem.maxSharePeriod &&
                diffDays + 1 > this.selectedItem.maxSharePeriod) {
                this.shareEndDay.setErrors({
                    invalid: true,
                    exceedAllowedDays: true,
                    exceedAllowedDaysMsg: this.getTranslation('EQUIPMENT_SHARING_PAGE.MESSAGES.EXCEED_PERIOD_ERR') +
                        this.selectedItem.maxSharePeriod
                });
            }
            // check of share end date after share start date
            if (this.shareEndDay.value < this.shareStartDay.value) {
                this.shareEndDay.setErrors({
                    invalid: true,
                    beforeStartDate: true,
                    beforeStartDateMsg: this.getTranslation('EQUIPMENT_SHARING_PAGE.MESSAGES.BEFORE_START_DATE_ERR')
                });
            }
            //check if end date is after period in use
            //
            //find nearest period in use and get start date
            const followingPeriods = [...this.periodsUnderUse]
                .sort((a, b) => a.startDate - b.startDate)
                .filter((period) => {
                return period.startDate > this.shareStartDay.value;
            });
            const dateItemToBeReturned = followingPeriods.length > 0 ? followingPeriods[0].startDate : null;
            if (dateItemToBeReturned && this.shareEndDay.value > dateItemToBeReturned) {
                this.shareEndDay.setErrors({
                    invalid: true,
                    itemInUse: true,
                    itemInUseMsg: this.getTranslation('EQUIPMENT_SHARING_PAGE.MESSAGES.ITEM_RETURNED_BEFORE_ERR') +
                        dateItemToBeReturned.toLocaleString().split(',')[0]
                });
            }
        });
    }
    checkIfDateBetweenPeriods(periods, dateForCheck) {
        let dateIsInGivenPeriods = false;
        periods.forEach((period) => {
            if (dateForCheck >= period.startDate && dateForCheck <= period.endDate) {
                dateIsInGivenPeriods = true;
            }
        });
        return dateIsInGivenPeriods;
    }
    datePickerFilterPredicate(date) {
        if (!this.selectedItem) {
            return true;
        }
        return !this.checkIfDateBetweenPeriods(this.periodsUnderUse, date);
    }
    getStatus(id) {
        switch (id) {
            case RequestApprovalStatusTypesEnum.REQUESTED:
                return this.getTranslation('APPROVAL_REQUEST_PAGE.REQUESTED');
            case RequestApprovalStatusTypesEnum.REFUSED:
                return this.getTranslation('APPROVAL_REQUEST_PAGE.REFUSED');
            case RequestApprovalStatusTypesEnum.APPROVED:
                return this.getTranslation('APPROVAL_REQUEST_PAGE.APPROVED');
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EquipmentSharingMutationComponent, deps: [{ token: i1.NbDialogRef }, { token: i2.EquipmentSharingService }, { token: i2.EquipmentService }, { token: i2.Store }, { token: i3.UntypedFormBuilder }, { token: i4.TranslateService }, { token: i2.EmployeesService }, { token: i2.OrganizationTeamsService }, { token: i2.EquipmentSharingPolicyService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: EquipmentSharingMutationComponent, isStandalone: false, selector: "ngx-equipment-sharing-mutation", usesInheritance: true, ngImport: i0, template: "<nb-card class=\"main\">\n\t<nb-card-header class=\"d-flex flex-column\">\n\t\t<span class=\"cancel\"><i class=\"fas fa-times\" (click)=\"closeDialog()\"></i></span>\n\t\t<h5 class=\"title\">\n\t\t\t{{\n\t\t\t\t(equipmentSharing\n\t\t\t\t\t? 'EQUIPMENT_SHARING_PAGE.EDIT_EQUIPMENT_REQUEST'\n\t\t\t\t\t: 'EQUIPMENT_SHARING_PAGE.ADD_EQUIPMENT_REQUEST'\n\t\t\t\t) | translate\n\t\t\t}}\n\t\t</h5>\n\t</nb-card-header>\n\t<nb-card-body>\n\t\t@if (form) {\n\t\t<form [formGroup]=\"form\">\n\t\t\t<div class=\"row\">\n\t\t\t\t<div class=\"col-sm-5 mb-4\">\n\t\t\t\t\t<input\n\t\t\t\t\t\tclass=\"d-block\"\n\t\t\t\t\t\tnbInput\n\t\t\t\t\t\ttype=\"text\"\n\t\t\t\t\t\tformControlName=\"name\"\n\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t[placeholder]=\"'FORM.PLACEHOLDERS.NAME' | translate\"\n\t\t\t\t\t/>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"col-sm-5 mb-4\">\n\t\t\t\t\t<nb-select\n\t\t\t\t\t\tclass=\"d-block\"\n\t\t\t\t\t\tformControlName=\"equipment\"\n\t\t\t\t\t\t(selectedChange)=\"setRequestStatus($event)\"\n\t\t\t\t\t\t[placeholder]=\"'FORM.LABELS.SELECT_EQUIPMENT' | translate\"\n\t\t\t\t\t>\n\t\t\t\t\t\t@for (item of equipmentItems; track item) {\n\t\t\t\t\t\t<nb-option [value]=\"item.id\">\n\t\t\t\t\t\t\t{{ item.name }}\n\t\t\t\t\t\t</nb-option>\n\t\t\t\t\t\t}\n\t\t\t\t\t</nb-select>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"col-sm-2 mb-4\">\n\t\t\t\t\t<div\n\t\t\t\t\t\tclass=\"status-label\"\n\t\t\t\t\t\t[class.active]=\"requestStatus === requestStatuses[2]\"\n\t\t\t\t\t\t[class.requested]=\"requestStatus === requestStatuses[0]\"\n\t\t\t\t\t\t[class.approved]=\"requestStatus === requestStatuses[1]\"\n\t\t\t\t\t>\n\t\t\t\t\t\t<h4>{{ getStatus(requestStatus) }}</h4>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class=\"row\">\n\t\t\t\t<div class=\"col-sm-12 mb-3\">\n\t\t\t\t\t<nb-select\n\t\t\t\t\t\tformControlName=\"equipmentSharingPolicyId\"\n\t\t\t\t\t\t[selected]=\"selectedEquipmentSharingPolicy\"\n\t\t\t\t\t\t(selectedChange)=\"onEquipmentSharingPolicySelected($event)\"\n\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\tplaceholder=\"{{ 'FORM.PLACEHOLDERS.CHOOSE_APPROVAL_POLICY' | translate }}\"\n\t\t\t\t\t>\n\t\t\t\t\t\t@for (policy of equipmentSharingPolicies; track policy) {\n\t\t\t\t\t\t<nb-option [value]=\"policy.id\"> {{ policy.name }}</nb-option>\n\t\t\t\t\t\t}\n\t\t\t\t\t</nb-select>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class=\"row\">\n\t\t\t\t<div class=\"col-sm-12 mb-3\">\n\t\t\t\t\t<nb-radio-group (valueChange)=\"onParticipantsChange($event)\" [value]=\"participants\">\n\t\t\t\t\t\t<nb-radio [value]=\"equipmentSharingParticipantEnum.EMPLOYEE\"\n\t\t\t\t\t\t\t>{{ 'APPROVAL_REQUEST_PAGE.EMPLOYEES' | translate }}\n\t\t\t\t\t\t</nb-radio>\n\t\t\t\t\t\t<nb-radio [value]=\"equipmentSharingParticipantEnum.TEAM\"\n\t\t\t\t\t\t\t>{{ 'APPROVAL_REQUEST_PAGE.TEAMS' | translate }}\n\t\t\t\t\t\t</nb-radio>\n\t\t\t\t\t</nb-radio-group>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class=\"row\">\n\t\t\t\t@if ( participants === equipmentSharingParticipantEnum.EMPLOYEE ) {\n\t\t\t\t<div class=\"col-sm-12 mb-3\">\n\t\t\t\t\t<ga-employee-multi-select\n\t\t\t\t\t\t[selectedEmployeeIds]=\"form.get('employees').value\"\n\t\t\t\t\t\t[placeholder]=\"'FORM.PLACEHOLDERS.CHOOSE_EMPLOYEES' | translate\"\n\t\t\t\t\t\t(selectedChange)=\"onEmployeesSelected($event)\"\n\t\t\t\t\t></ga-employee-multi-select>\n\t\t\t\t</div>\n\t\t\t\t} @if ( participants === equipmentSharingParticipantEnum.TEAM ) {\n\t\t\t\t<div class=\"col-sm-12 mb-3\">\n\t\t\t\t\t<nb-select\n\t\t\t\t\t\tformControlName=\"teams\"\n\t\t\t\t\t\tmultiple\n\t\t\t\t\t\t[selected]=\"selectedTeams\"\n\t\t\t\t\t\t(selectedChange)=\"onTeamsSelected($event)\"\n\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t[placeholder]=\"'FORM.PLACEHOLDERS.CHOOSE_TEAMS' | translate\"\n\t\t\t\t\t>\n\t\t\t\t\t\t@for (team of teams; track team) {\n\t\t\t\t\t\t<nb-option [value]=\"team.id\">\n\t\t\t\t\t\t\t{{ team.name }}\n\t\t\t\t\t\t</nb-option>\n\t\t\t\t\t\t}\n\t\t\t\t\t</nb-select>\n\t\t\t\t</div>\n\t\t\t\t}\n\t\t\t</div>\n\t\t\t<div class=\"row\">\n\t\t\t\t<div class=\"col-sm-6\">\n\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t<input\n\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\tformControlName=\"shareRequestDay\"\n\t\t\t\t\t\t\tnbInput\n\t\t\t\t\t\t\t[nbDatepicker]=\"shareRequestDatePicker\"\n\t\t\t\t\t\t\tplaceholder=\"{{ 'FORM.LABELS.SELECT_SHARE_REQUEST_DATE' | translate }}\"\n\t\t\t\t\t\t/>\n\t\t\t\t\t\t<nb-datepicker #shareRequestDatePicker></nb-datepicker>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"col-sm-6\">\n\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t<input\n\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\tformControlName=\"shareStartDay\"\n\t\t\t\t\t\t\tnbInput\n\t\t\t\t\t\t\t[nbDatepicker]=\"shareStartDatePicker\"\n\t\t\t\t\t\t\tplaceholder=\"{{ 'FORM.LABELS.SELECT_SHARE_START_DATE' | translate }}\"\n\t\t\t\t\t\t\t[class.status-danger]=\"shareStartDay.invalid && shareStartDay.touched\"\n\t\t\t\t\t\t/>\n\t\t\t\t\t\t<nb-datepicker #shareStartDatePicker [(date)]=\"date1\" [filter]=\"filter\"></nb-datepicker>\n\t\t\t\t\t\t@if ( shareStartDay.dirty && shareStartDay.errors && shareStartDay.errors.beforeRequestDay ) {\n\t\t\t\t\t\t<div class=\"text-danger\">\n\t\t\t\t\t\t\t{{ shareStartDay.errors.beforeRequestDayMsg }}\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t}\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class=\"row\">\n\t\t\t\t<div class=\"col-sm-6\">\n\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t<input\n\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\tformControlName=\"shareEndDay\"\n\t\t\t\t\t\t\tnbInput\n\t\t\t\t\t\t\t[nbDatepicker]=\"shareEndDatePicker\"\n\t\t\t\t\t\t\tplaceholder=\"{{ 'FORM.LABELS.SELECT_SHARE_END_DATE' | translate }}\"\n\t\t\t\t\t\t\t[class.status-danger]=\"shareEndDay.invalid && shareEndDay.touched\"\n\t\t\t\t\t\t/>\n\t\t\t\t\t\t<nb-datepicker #shareEndDatePicker [(date)]=\"date2\" [filter]=\"filter\"></nb-datepicker>\n\t\t\t\t\t\t@if (shareEndDay.dirty && shareEndDay.errors) {\n\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t@if (shareEndDay.errors.exceedAllowedDays) {\n\t\t\t\t\t\t\t<div class=\"text-danger\">\n\t\t\t\t\t\t\t\t{{ shareEndDay.errors.exceedAllowedDaysMsg }}\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t} @if (shareEndDay.errors.beforeStartDate) {\n\t\t\t\t\t\t\t<div class=\"text-danger\">\n\t\t\t\t\t\t\t\t{{ shareEndDay.errors.beforeStartDateMsg }}\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t} @if (shareEndDay.errors.itemInUse) {\n\t\t\t\t\t\t\t<div class=\"text-danger\">\n\t\t\t\t\t\t\t\t{{ shareEndDay.errors.itemInUseMsg }}\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t}\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</form>\n\t\t}\n\t</nb-card-body>\n\n\t<nb-card-footer class=\"text-left\">\n\t\t<button class=\"delete mr-3\" (click)=\"dialogRef.close()\" nbButton status=\"basic\" outline>\n\t\t\t{{ 'BUTTONS.CANCEL' | translate }}\n\t\t</button>\n\t\t<button [disabled]=\"form.invalid\" status=\"success\" nbButton (click)=\"onSaveRequest()\">\n\t\t\t{{ 'BUTTONS.SAVE' | translate }}\n\t\t</button>\n\t</nb-card-footer>\n</nb-card>\n", styles: ["@charset \"UTF-8\";:host i{cursor:pointer}:host .cancel{width:100%;display:flex}[dir=ltr] :host .cancel{justify-content:flex-end}[dir=rtl] :host .cancel{justify-content:flex-start}:host .cancel i{font-size:11px;color:var(--gauzy-text-color-1)}:host [nbButton].appearance-outline.status-basic{background-color:transparent;border-color:#f56d584d;border-width:2px;color:#f56d58}:host [nbButton].appearance-outline.status-basic:hover{border-color:#f56d58}:host [nbButton].appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #f56d580d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host .title{color:var(--text-primary-color);font-size:16px;font-weight:600;line-height:16px;letter-spacing:0em}:host [nbButton].gray.appearance-outline.status-basic{background-color:transparent;border-color:#7e7e8f4d;border-width:2px;color:#7e7e8f}:host [nbButton].gray.appearance-outline.status-basic:hover{border-color:#7e7e8f}:host [nbButton].gray.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #7e7e8f0d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].gray.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic{background-color:transparent;border-color:#25b8694d;border-width:2px;color:#25b869}:host [nbButton].green.appearance-outline.status-basic:hover{border-color:#25b869}:host [nbButton].green.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #25b8690d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].green.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic[disabled],:host [nbButton].green.appearance-outline.status-basic.btn-disabled{background-color:var(--button-outline-basic-disabled-background-color);border-color:var(--button-outline-basic-disabled-border-color);color:var(--button-outline-basic-disabled-text-color);box-shadow:unset}:host [nbButton].primary.appearance-filled.status-primary{color:var(--text-primary-color);border:unset;background-color:var(--color-primary-transparent-default);box-shadow:var(--gauzy-shadow)}[dir=ltr] :host ::ng-deep input,[dir=ltr] :host ::ng-deep textarea{text-align:start}[dir=rtl] :host ::ng-deep input,[dir=rtl] :host ::ng-deep textarea{text-align:end}:host ::ng-deep input,:host ::ng-deep nb-select.appearance-outline.status-basic .select-button,:host ::ng-deep .ng-select .ng-select-container{background-color:var(--gauzy-sidebar-background-4)!important;border:none;min-height:calc(var(--select-medium-text-line-height) + .4375rem * 2)!important}:host ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-placeholder,:host ::ng-deep .ng-select.ng-select-single .ng-select-container .ng-value-container .ng-input{top:unset!important}:host ::ng-deep label,:host ::ng-deep .label{font-size:var(--text-label-font-size);font-weight:600;line-height:.8125rem;letter-spacing:-.01em;color:var(--gauzy-text-color-2)}:host ::ng-deep textarea{background-color:var(--gauzy-sidebar-background-4)!important;border:none}:host ::ng-deep .ng-select .ng-select-container input,:host ::ng-deep nb-tag-list input{background-color:unset!important}:host nb-card{background-color:var(--gauzy-card-1)}[dir=ltr] :host .col-sm-3{padding-left:0}[dir=rtl] :host .col-sm-3{padding-right:0}.status-label{font-weight:700;display:flex;align-items:center;justify-content:center;border-radius:var(--border-radius)}.status-label h4{font-size:15px;padding:0;margin:0;text-transform:uppercase}.status-label.requested{background:#ffc94d}.status-label.approved{background:#03e88c}.status-label.active{background:#e45959}nb-radio-group{display:flex}.text-danger{max-width:100%;font-size:12px;margin-top:5px}.main{min-width:800px}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "directive", type: i3.ɵNgNoValidate, selector: "form:not([ngNoForm]):not([ngNativeValidate])" }, { kind: "directive", type: i3.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i3.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i3.NgControlStatusGroup, selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],[formArray],form:not([ngNoForm]),[ngForm]" }, { kind: "component", type: i1.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i1.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "component", type: i1.NbCardFooterComponent, selector: "nb-card-footer" }, { kind: "component", type: i1.NbCardHeaderComponent, selector: "nb-card-header" }, { kind: "directive", type: i3.FormGroupDirective, selector: "[formGroup]", inputs: ["formGroup"], outputs: ["ngSubmit"], exportAs: ["ngForm"] }, { kind: "directive", type: i3.FormControlName, selector: "[formControlName]", inputs: ["formControlName", "disabled", "ngModel"], outputs: ["ngModelChange"] }, { kind: "component", type: i1.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "directive", type: i1.NbInputDirective, selector: "input[nbInput],textarea[nbInput]", inputs: ["fieldSize", "status", "shape", "fullWidth"] }, { kind: "component", type: i1.NbSelectComponent, selector: "nb-select", inputs: ["size", "status", "shape", "appearance", "optionsListClass", "optionsPanelClass", "optionsWidth", "outline", "filled", "hero", "disabled", "fullWidth", "placeholder", "compareWith", "selected", "multiple", "optionsOverlayOffset", "scrollStrategy"], outputs: ["selectedChange"] }, { kind: "component", type: i1.NbOptionComponent, selector: "nb-option", inputs: ["value", "disabled"], outputs: ["selectionChange"] }, { kind: "directive", type: i1.NbDatepickerDirective, selector: "input[nbDatepicker]", inputs: ["nbDatepicker"] }, { kind: "component", type: i1.NbDatepickerComponent, selector: "nb-datepicker", inputs: ["date"], outputs: ["dateChange"] }, { kind: "component", type: i1.NbRadioComponent, selector: "nb-radio", inputs: ["name", "checked", "value", "disabled", "status"], outputs: ["valueChange", "blur"] }, { kind: "component", type: i1.NbRadioGroupComponent, selector: "nb-radio-group", inputs: ["value", "name", "disabled", "status"], outputs: ["valueChange"] }, { kind: "component", type: i5.EmployeeSelectComponent, selector: "ga-employee-multi-select", inputs: ["reset", "allEmployees", "selectedEmployeeIds", "multiple", "label", "disabled", "placeholder"], outputs: ["selectedChange", "onLoadEmployees"] }, { kind: "pipe", type: i4.TranslatePipe, name: "translate" }] }); }
};
EquipmentSharingMutationComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [NbDialogRef,
        EquipmentSharingService,
        EquipmentService,
        Store,
        UntypedFormBuilder,
        TranslateService,
        EmployeesService,
        OrganizationTeamsService,
        EquipmentSharingPolicyService])
], EquipmentSharingMutationComponent);
export { EquipmentSharingMutationComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EquipmentSharingMutationComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-equipment-sharing-mutation', standalone: false, template: "<nb-card class=\"main\">\n\t<nb-card-header class=\"d-flex flex-column\">\n\t\t<span class=\"cancel\"><i class=\"fas fa-times\" (click)=\"closeDialog()\"></i></span>\n\t\t<h5 class=\"title\">\n\t\t\t{{\n\t\t\t\t(equipmentSharing\n\t\t\t\t\t? 'EQUIPMENT_SHARING_PAGE.EDIT_EQUIPMENT_REQUEST'\n\t\t\t\t\t: 'EQUIPMENT_SHARING_PAGE.ADD_EQUIPMENT_REQUEST'\n\t\t\t\t) | translate\n\t\t\t}}\n\t\t</h5>\n\t</nb-card-header>\n\t<nb-card-body>\n\t\t@if (form) {\n\t\t<form [formGroup]=\"form\">\n\t\t\t<div class=\"row\">\n\t\t\t\t<div class=\"col-sm-5 mb-4\">\n\t\t\t\t\t<input\n\t\t\t\t\t\tclass=\"d-block\"\n\t\t\t\t\t\tnbInput\n\t\t\t\t\t\ttype=\"text\"\n\t\t\t\t\t\tformControlName=\"name\"\n\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t[placeholder]=\"'FORM.PLACEHOLDERS.NAME' | translate\"\n\t\t\t\t\t/>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"col-sm-5 mb-4\">\n\t\t\t\t\t<nb-select\n\t\t\t\t\t\tclass=\"d-block\"\n\t\t\t\t\t\tformControlName=\"equipment\"\n\t\t\t\t\t\t(selectedChange)=\"setRequestStatus($event)\"\n\t\t\t\t\t\t[placeholder]=\"'FORM.LABELS.SELECT_EQUIPMENT' | translate\"\n\t\t\t\t\t>\n\t\t\t\t\t\t@for (item of equipmentItems; track item) {\n\t\t\t\t\t\t<nb-option [value]=\"item.id\">\n\t\t\t\t\t\t\t{{ item.name }}\n\t\t\t\t\t\t</nb-option>\n\t\t\t\t\t\t}\n\t\t\t\t\t</nb-select>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"col-sm-2 mb-4\">\n\t\t\t\t\t<div\n\t\t\t\t\t\tclass=\"status-label\"\n\t\t\t\t\t\t[class.active]=\"requestStatus === requestStatuses[2]\"\n\t\t\t\t\t\t[class.requested]=\"requestStatus === requestStatuses[0]\"\n\t\t\t\t\t\t[class.approved]=\"requestStatus === requestStatuses[1]\"\n\t\t\t\t\t>\n\t\t\t\t\t\t<h4>{{ getStatus(requestStatus) }}</h4>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class=\"row\">\n\t\t\t\t<div class=\"col-sm-12 mb-3\">\n\t\t\t\t\t<nb-select\n\t\t\t\t\t\tformControlName=\"equipmentSharingPolicyId\"\n\t\t\t\t\t\t[selected]=\"selectedEquipmentSharingPolicy\"\n\t\t\t\t\t\t(selectedChange)=\"onEquipmentSharingPolicySelected($event)\"\n\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\tplaceholder=\"{{ 'FORM.PLACEHOLDERS.CHOOSE_APPROVAL_POLICY' | translate }}\"\n\t\t\t\t\t>\n\t\t\t\t\t\t@for (policy of equipmentSharingPolicies; track policy) {\n\t\t\t\t\t\t<nb-option [value]=\"policy.id\"> {{ policy.name }}</nb-option>\n\t\t\t\t\t\t}\n\t\t\t\t\t</nb-select>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class=\"row\">\n\t\t\t\t<div class=\"col-sm-12 mb-3\">\n\t\t\t\t\t<nb-radio-group (valueChange)=\"onParticipantsChange($event)\" [value]=\"participants\">\n\t\t\t\t\t\t<nb-radio [value]=\"equipmentSharingParticipantEnum.EMPLOYEE\"\n\t\t\t\t\t\t\t>{{ 'APPROVAL_REQUEST_PAGE.EMPLOYEES' | translate }}\n\t\t\t\t\t\t</nb-radio>\n\t\t\t\t\t\t<nb-radio [value]=\"equipmentSharingParticipantEnum.TEAM\"\n\t\t\t\t\t\t\t>{{ 'APPROVAL_REQUEST_PAGE.TEAMS' | translate }}\n\t\t\t\t\t\t</nb-radio>\n\t\t\t\t\t</nb-radio-group>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class=\"row\">\n\t\t\t\t@if ( participants === equipmentSharingParticipantEnum.EMPLOYEE ) {\n\t\t\t\t<div class=\"col-sm-12 mb-3\">\n\t\t\t\t\t<ga-employee-multi-select\n\t\t\t\t\t\t[selectedEmployeeIds]=\"form.get('employees').value\"\n\t\t\t\t\t\t[placeholder]=\"'FORM.PLACEHOLDERS.CHOOSE_EMPLOYEES' | translate\"\n\t\t\t\t\t\t(selectedChange)=\"onEmployeesSelected($event)\"\n\t\t\t\t\t></ga-employee-multi-select>\n\t\t\t\t</div>\n\t\t\t\t} @if ( participants === equipmentSharingParticipantEnum.TEAM ) {\n\t\t\t\t<div class=\"col-sm-12 mb-3\">\n\t\t\t\t\t<nb-select\n\t\t\t\t\t\tformControlName=\"teams\"\n\t\t\t\t\t\tmultiple\n\t\t\t\t\t\t[selected]=\"selectedTeams\"\n\t\t\t\t\t\t(selectedChange)=\"onTeamsSelected($event)\"\n\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t[placeholder]=\"'FORM.PLACEHOLDERS.CHOOSE_TEAMS' | translate\"\n\t\t\t\t\t>\n\t\t\t\t\t\t@for (team of teams; track team) {\n\t\t\t\t\t\t<nb-option [value]=\"team.id\">\n\t\t\t\t\t\t\t{{ team.name }}\n\t\t\t\t\t\t</nb-option>\n\t\t\t\t\t\t}\n\t\t\t\t\t</nb-select>\n\t\t\t\t</div>\n\t\t\t\t}\n\t\t\t</div>\n\t\t\t<div class=\"row\">\n\t\t\t\t<div class=\"col-sm-6\">\n\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t<input\n\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\tformControlName=\"shareRequestDay\"\n\t\t\t\t\t\t\tnbInput\n\t\t\t\t\t\t\t[nbDatepicker]=\"shareRequestDatePicker\"\n\t\t\t\t\t\t\tplaceholder=\"{{ 'FORM.LABELS.SELECT_SHARE_REQUEST_DATE' | translate }}\"\n\t\t\t\t\t\t/>\n\t\t\t\t\t\t<nb-datepicker #shareRequestDatePicker></nb-datepicker>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"col-sm-6\">\n\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t<input\n\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\tformControlName=\"shareStartDay\"\n\t\t\t\t\t\t\tnbInput\n\t\t\t\t\t\t\t[nbDatepicker]=\"shareStartDatePicker\"\n\t\t\t\t\t\t\tplaceholder=\"{{ 'FORM.LABELS.SELECT_SHARE_START_DATE' | translate }}\"\n\t\t\t\t\t\t\t[class.status-danger]=\"shareStartDay.invalid && shareStartDay.touched\"\n\t\t\t\t\t\t/>\n\t\t\t\t\t\t<nb-datepicker #shareStartDatePicker [(date)]=\"date1\" [filter]=\"filter\"></nb-datepicker>\n\t\t\t\t\t\t@if ( shareStartDay.dirty && shareStartDay.errors && shareStartDay.errors.beforeRequestDay ) {\n\t\t\t\t\t\t<div class=\"text-danger\">\n\t\t\t\t\t\t\t{{ shareStartDay.errors.beforeRequestDayMsg }}\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t}\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class=\"row\">\n\t\t\t\t<div class=\"col-sm-6\">\n\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t<input\n\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\tformControlName=\"shareEndDay\"\n\t\t\t\t\t\t\tnbInput\n\t\t\t\t\t\t\t[nbDatepicker]=\"shareEndDatePicker\"\n\t\t\t\t\t\t\tplaceholder=\"{{ 'FORM.LABELS.SELECT_SHARE_END_DATE' | translate }}\"\n\t\t\t\t\t\t\t[class.status-danger]=\"shareEndDay.invalid && shareEndDay.touched\"\n\t\t\t\t\t\t/>\n\t\t\t\t\t\t<nb-datepicker #shareEndDatePicker [(date)]=\"date2\" [filter]=\"filter\"></nb-datepicker>\n\t\t\t\t\t\t@if (shareEndDay.dirty && shareEndDay.errors) {\n\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t@if (shareEndDay.errors.exceedAllowedDays) {\n\t\t\t\t\t\t\t<div class=\"text-danger\">\n\t\t\t\t\t\t\t\t{{ shareEndDay.errors.exceedAllowedDaysMsg }}\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t} @if (shareEndDay.errors.beforeStartDate) {\n\t\t\t\t\t\t\t<div class=\"text-danger\">\n\t\t\t\t\t\t\t\t{{ shareEndDay.errors.beforeStartDateMsg }}\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t} @if (shareEndDay.errors.itemInUse) {\n\t\t\t\t\t\t\t<div class=\"text-danger\">\n\t\t\t\t\t\t\t\t{{ shareEndDay.errors.itemInUseMsg }}\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t}\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</form>\n\t\t}\n\t</nb-card-body>\n\n\t<nb-card-footer class=\"text-left\">\n\t\t<button class=\"delete mr-3\" (click)=\"dialogRef.close()\" nbButton status=\"basic\" outline>\n\t\t\t{{ 'BUTTONS.CANCEL' | translate }}\n\t\t</button>\n\t\t<button [disabled]=\"form.invalid\" status=\"success\" nbButton (click)=\"onSaveRequest()\">\n\t\t\t{{ 'BUTTONS.SAVE' | translate }}\n\t\t</button>\n\t</nb-card-footer>\n</nb-card>\n", styles: ["@charset \"UTF-8\";:host i{cursor:pointer}:host .cancel{width:100%;display:flex}[dir=ltr] :host .cancel{justify-content:flex-end}[dir=rtl] :host .cancel{justify-content:flex-start}:host .cancel i{font-size:11px;color:var(--gauzy-text-color-1)}:host [nbButton].appearance-outline.status-basic{background-color:transparent;border-color:#f56d584d;border-width:2px;color:#f56d58}:host [nbButton].appearance-outline.status-basic:hover{border-color:#f56d58}:host [nbButton].appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #f56d580d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host .title{color:var(--text-primary-color);font-size:16px;font-weight:600;line-height:16px;letter-spacing:0em}:host [nbButton].gray.appearance-outline.status-basic{background-color:transparent;border-color:#7e7e8f4d;border-width:2px;color:#7e7e8f}:host [nbButton].gray.appearance-outline.status-basic:hover{border-color:#7e7e8f}:host [nbButton].gray.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #7e7e8f0d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].gray.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic{background-color:transparent;border-color:#25b8694d;border-width:2px;color:#25b869}:host [nbButton].green.appearance-outline.status-basic:hover{border-color:#25b869}:host [nbButton].green.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #25b8690d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].green.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic[disabled],:host [nbButton].green.appearance-outline.status-basic.btn-disabled{background-color:var(--button-outline-basic-disabled-background-color);border-color:var(--button-outline-basic-disabled-border-color);color:var(--button-outline-basic-disabled-text-color);box-shadow:unset}:host [nbButton].primary.appearance-filled.status-primary{color:var(--text-primary-color);border:unset;background-color:var(--color-primary-transparent-default);box-shadow:var(--gauzy-shadow)}[dir=ltr] :host ::ng-deep input,[dir=ltr] :host ::ng-deep textarea{text-align:start}[dir=rtl] :host ::ng-deep input,[dir=rtl] :host ::ng-deep textarea{text-align:end}:host ::ng-deep input,:host ::ng-deep nb-select.appearance-outline.status-basic .select-button,:host ::ng-deep .ng-select .ng-select-container{background-color:var(--gauzy-sidebar-background-4)!important;border:none;min-height:calc(var(--select-medium-text-line-height) + .4375rem * 2)!important}:host ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-placeholder,:host ::ng-deep .ng-select.ng-select-single .ng-select-container .ng-value-container .ng-input{top:unset!important}:host ::ng-deep label,:host ::ng-deep .label{font-size:var(--text-label-font-size);font-weight:600;line-height:.8125rem;letter-spacing:-.01em;color:var(--gauzy-text-color-2)}:host ::ng-deep textarea{background-color:var(--gauzy-sidebar-background-4)!important;border:none}:host ::ng-deep .ng-select .ng-select-container input,:host ::ng-deep nb-tag-list input{background-color:unset!important}:host nb-card{background-color:var(--gauzy-card-1)}[dir=ltr] :host .col-sm-3{padding-left:0}[dir=rtl] :host .col-sm-3{padding-right:0}.status-label{font-weight:700;display:flex;align-items:center;justify-content:center;border-radius:var(--border-radius)}.status-label h4{font-size:15px;padding:0;margin:0;text-transform:uppercase}.status-label.requested{background:#ffc94d}.status-label.approved{background:#03e88c}.status-label.active{background:#e45959}nb-radio-group{display:flex}.text-danger{max-width:100%;font-size:12px;margin-top:5px}.main{min-width:800px}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [{ type: i1.NbDialogRef }, { type: i2.EquipmentSharingService }, { type: i2.EquipmentService }, { type: i2.Store }, { type: i3.UntypedFormBuilder }, { type: i4.TranslateService }, { type: i2.EmployeesService }, { type: i2.OrganizationTeamsService }, { type: i2.EquipmentSharingPolicyService }] });
//# sourceMappingURL=equipment-sharing-mutation.component.js.map