import { __decorate, __metadata } from "tslib";
import { Component, ViewChild, Input, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogRef, NbStepperComponent } from '@nebular/theme';
import { filter, tap } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CandidateInterviewersService, CandidateInterviewService, CandidatePersonalQualitiesService, CandidatesService, CandidateStore, CandidateTechnologiesService, EmployeesService, ErrorHandlingService } from '@gauzy/ui-core/core';
import { Store } from '@gauzy/ui-core/core';
import { CandidateCriterionsFormComponent } from './candidate-criterions-form/candidate-criterions-form.component';
import { CandidateInterviewFormComponent } from './candidate-interview-form/candidate-interview-form.component';
import { CandidateNotificationFormComponent } from './candidate-notification-form/candidate-notification-form.component';
import { CommunicationService } from './communication.service';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "@gauzy/ui-core/core";
import * as i3 from "@angular/router";
import * as i4 from "./communication.service";
import * as i5 from "../selectors/candidate-select/candidate-select.component";
import * as i6 from "./candidate-interview-form/candidate-interview-form.component";
import * as i7 from "./candidate-criterions-form/candidate-criterions-form.component";
import * as i8 from "./candidate-notification-form/candidate-notification-form.component";
import * as i9 from "./interview-criterions/candidate-technologies/candidate-technologies.component";
import * as i10 from "./interview-criterions/candidate-personal-qualities/candidate-personal-qualities.component";
import * as i11 from "@ngx-translate/core";
let CandidateInterviewMutationComponent = class CandidateInterviewMutationComponent {
    get selectedRangeCalendar() {
        return this._selectedRangeCalendar;
    }
    set selectedRangeCalendar(value) {
        this._selectedRangeCalendar = value;
    }
    get headerTitle() {
        return this._headerTitle;
    }
    set headerTitle(value) {
        this._headerTitle = value;
    }
    get interviews() {
        return this._interviews;
    }
    set interviews(value) {
        this._interviews = value;
    }
    constructor(dialogRef, employeesService, store, cdRef, candidateInterviewService, candidatesService, errorHandler, candidateInterviewersService, candidateTechnologiesService, candidatePersonalQualitiesService, router, candidateStore, communicationService) {
        this.dialogRef = dialogRef;
        this.employeesService = employeesService;
        this.store = store;
        this.cdRef = cdRef;
        this.candidateInterviewService = candidateInterviewService;
        this.candidatesService = candidatesService;
        this.errorHandler = errorHandler;
        this.candidateInterviewersService = candidateInterviewersService;
        this.candidateTechnologiesService = candidateTechnologiesService;
        this.candidatePersonalQualitiesService = candidatePersonalQualitiesService;
        this.router = router;
        this.candidateStore = candidateStore;
        this.communicationService = communicationService;
        this.selectedCandidate = null;
        this.interviewId = null;
        /*
         * Getter & Setter for interviews
         */
        this._interviews = [];
        this.employees = [];
        this.selectedInterviewers = [];
        this.criterionsId = null;
        this.isTitleExist = false;
        this.personalQualities = null;
        this.isCriterionsVisible = false;
    }
    async ngOnInit() {
        this.store.selectedOrganization$
            .pipe(filter((organization) => !!organization), tap((organization) => (this.organization = organization)), untilDestroyed(this))
            .subscribe();
        this.communicationService.technologyAdded$.subscribe((technology) => {
            this.updateTechnologiesList(technology);
        });
        this.communicationService.technologyRemoved$.subscribe((technologyId) => {
            this.removeTechnologyFromList(technologyId);
        });
        // Subscribe to quality additions and removals
        this.communicationService.qualityAdded$.subscribe((quality) => {
            this.updatePersonalQualitiesList(quality);
        });
        this.communicationService.qualityRemoved$.subscribe((qualityId) => {
            this.removePersonalQualityFromList(qualityId);
        });
    }
    titleExist(value) {
        this.isTitleExist = value;
    }
    async ngAfterViewInit() {
        this.form = this.candidateInterviewForm.form;
        //if editing
        if (this.editData) {
            this.form.patchValue(this.editData);
            this.form.patchValue({ valid: true });
            this.cdRef.detectChanges();
            this.candidateInterviewForm.selectedRange.end = this.editData.endTime;
            this.candidateInterviewForm.selectedRange.start = this.editData.startTime;
        }
        if (this.selectedRangeCalendar) {
            this.candidateInterviewForm.selectedRange.end = this.selectedRangeCalendar.end;
            this.candidateInterviewForm.selectedRange.start = this.selectedRangeCalendar.start;
        }
    }
    next() {
        this.candidateInterviewForm.loadFormData();
        const interviewForm = this.candidateInterviewForm.form.value;
        this.selectedInterviewers = interviewForm.interviewers;
        this.interview = {
            title: this.form.get('title').value,
            interviewers: interviewForm.interviewers,
            location: this.form.get('location').value,
            startTime: interviewForm.startTime,
            endTime: interviewForm.endTime,
            note: this.form.get('note').value
        };
        //	if editing
        if (interviewForm.interviewers === null) {
            interviewForm.interviewers = this.candidateInterviewForm.employeeIds;
        }
        this.getEmployees(interviewForm.interviewers);
    }
    /**
     *
     * @param employeeIds
     */
    async getEmployees(employeeIds) {
        const { tenantId } = this.store.user;
        const { id: organizationId } = this.organization;
        const { items } = await firstValueFrom(this.employeesService.getAll(['user'], { organizationId, tenantId }));
        const employeeList = items;
        employeeIds.forEach((id) => {
            employeeList.forEach((item) => {
                if (id === item.id) {
                    this.employees.push(item);
                }
            });
        });
    }
    async save() {
        this.employees = [];
        const interview = null;
        let createdInterview = null;
        if (this.interviewId !== null) {
            createdInterview = this.editInterview();
        }
        else {
            createdInterview = await this.createInterview(interview);
            this.candidateStore.loadInterviews(createdInterview);
        }
        this.closeDialog(createdInterview);
    }
    async createInterview(interview) {
        const { tenantId } = this.store.user;
        const { id: organizationId } = this.organization;
        const emptyInterview = {
            title: '',
            interviewers: null,
            startTime: null,
            endTime: null,
            criterions: null,
            note: ''
        };
        interview = await this.candidateInterviewService.create({
            ...emptyInterview,
            candidateId: this.selectedCandidate.id,
            organizationId,
            tenantId
        });
        this.addInterviewers(interview.id, this.selectedInterviewers);
        this.candidateCriterionsForm.loadFormData();
        const criterionsForm = this.candidateCriterionsForm.form.value;
        this.addCriterions(interview.id, criterionsForm.selectedTechnologies, criterionsForm.selectedQualities);
        try {
            await this.candidateInterviewService.update(interview.id, {
                title: this.interview.title,
                location: this.interview.location,
                startTime: this.interview.startTime,
                endTime: this.interview.endTime,
                note: this.interview.note
            });
            return { ...interview, ...this.interview };
        }
        catch (error) {
            this.errorHandler.handleError(error);
        }
    }
    async addInterviewers(interviewId, employeeIds) {
        try {
            const { tenantId } = this.store.user;
            const { id: organizationId } = this.organization;
            await this.candidateInterviewersService.createBulk({
                interviewId,
                employeeIds,
                organizationId,
                tenantId
            });
        }
        catch (error) {
            this.errorHandler.handleError(error);
        }
    }
    async addCriterions(interviewId, tech, qual) {
        try {
            this.technologies = await this.candidateTechnologiesService.createBulk(interviewId, tech);
            this.personalQualities = await this.candidatePersonalQualitiesService.createBulk(interviewId, qual);
        }
        catch (error) {
            this.errorHandler.handleError(error);
        }
    }
    async editInterview() {
        let deletedIds = [];
        let newIds = [];
        let updatedInterview;
        const oldIds = this.editData.interviewers.map((item) => item.employeeId);
        if (this.interview.interviewers) {
            deletedIds = oldIds.filter((item) => !this.interview.interviewers.includes(item));
            newIds = this.interview.interviewers.filter((item) => !oldIds.includes(item));
        }
        try {
            this.updateCriterions(this.editData.personalQualities, this.editData.technologies);
            updatedInterview = await this.candidateInterviewService.update(this.interviewId, {
                title: this.interview.title,
                location: this.interview.location,
                startTime: this.interview.startTime,
                endTime: this.interview.endTime,
                note: this.interview.note
            });
        }
        catch (error) {
            this.errorHandler.handleError(error);
        }
        await this.candidateInterviewersService.deleteBulkByEmployeeId(deletedIds);
        this.addInterviewers(this.interviewId, newIds);
        this.interviewId = null;
        return updatedInterview;
    }
    async updateCriterions(qual, tech) {
        this.candidateCriterionsForm.loadFormData();
        const criterionsForm = this.candidateCriterionsForm.form.value;
        const techCriterions = this.setCriterions(tech, criterionsForm.selectedTechnologies);
        const qualCriterions = this.setCriterions(qual, criterionsForm.selectedQualities);
        //CREATE NEW
        if (techCriterions.createInput) {
            try {
                await this.candidateTechnologiesService.createBulk(this.editData.id, techCriterions.createInput);
            }
            catch (error) {
                this.errorHandler.handleError(error);
            }
        }
        if (qualCriterions.createInput) {
            try {
                await this.candidatePersonalQualitiesService.createBulk(this.editData.id, qualCriterions.createInput);
            }
            catch (error) {
                this.errorHandler.handleError(error);
            }
        }
        //DELETE OLD
        if (techCriterions.deleteInput.length > 0) {
            try {
                await this.candidateTechnologiesService.deleteBulkByInterviewId(this.editData.id, techCriterions.deleteInput);
            }
            catch (error) {
                this.errorHandler.handleError(error);
            }
        }
        if (qualCriterions.deleteInput.length > 0) {
            try {
                await this.candidatePersonalQualitiesService.deleteBulkByInterviewId(this.editData.id, qualCriterions.deleteInput);
            }
            catch (error) {
                this.errorHandler.handleError(error);
            }
        }
    }
    setCriterions(data, selectedItems) {
        const createInput = [];
        const deleteInput = [];
        const dataName = [];
        if (selectedItems) {
            data.forEach((item) => dataName.push(item.name));
            selectedItems.forEach((item) => (dataName.includes(item) ? item : createInput.push(item)));
            data.forEach((item) => (!selectedItems.includes(item.name) ? item : deleteInput.push(item)));
            return { createInput: createInput, deleteInput: deleteInput };
        }
    }
    /**
     *
     * @param id
     * @returns
     */
    async onCandidateSelected(id) {
        if (!this.organization) {
            return;
        }
        const { id: organizationId, tenantId } = this.organization;
        const candidate = await this.candidatesService.getCandidateById(id, ['user'], {
            organizationId,
            tenantId
        });
        this.selectedCandidate = candidate;
    }
    closeDialog(interview = null) {
        this.dialogRef.close(interview);
    }
    previous() {
        this.candidateInterviewForm.form.patchValue(this.interview);
        this.candidateInterviewForm.form.patchValue({ valid: true });
        this.employees = [];
    }
    route() {
        this.dialogRef.close();
        this.router.navigate(['/pages/employees/candidates/interviews/criterion']);
    }
    showCriterions() {
        this.isCriterionsVisible = !this.isCriterionsVisible;
    }
    updateTechnologiesList(newTechnology) {
        this.candidateCriterionsForm.technologiesList.push(newTechnology);
    }
    removeTechnologyFromList(removedTechId) {
        this.candidateCriterionsForm.technologiesList = this.candidateCriterionsForm.technologiesList.filter((tech) => tech.id !== removedTechId);
    }
    updatePersonalQualitiesList(newPersonalQuality) {
        this.candidateCriterionsForm.personalQualitiesList.push(newPersonalQuality);
    }
    removePersonalQualityFromList(removedQualityId) {
        this.candidateCriterionsForm.personalQualitiesList = this.candidateCriterionsForm.personalQualitiesList.filter((quality) => quality.id !== removedQualityId);
    }
    ngOnDestroy() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CandidateInterviewMutationComponent, deps: [{ token: i1.NbDialogRef }, { token: i2.EmployeesService }, { token: i2.Store }, { token: i0.ChangeDetectorRef }, { token: i2.CandidateInterviewService }, { token: i2.CandidatesService }, { token: i2.ErrorHandlingService }, { token: i2.CandidateInterviewersService }, { token: i2.CandidateTechnologiesService }, { token: i2.CandidatePersonalQualitiesService }, { token: i3.Router }, { token: i2.CandidateStore }, { token: i4.CommunicationService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: CandidateInterviewMutationComponent, isStandalone: false, selector: "ga-candidate-interview-mutation", inputs: { editData: "editData", selectedCandidate: "selectedCandidate", interviewId: "interviewId", isCalendar: "isCalendar", selectedRangeCalendar: "selectedRangeCalendar", headerTitle: "headerTitle", interviews: "interviews" }, viewQueries: [{ propertyName: "stepper", first: true, predicate: ["stepper"], descendants: true }, { propertyName: "candidateCriterionsForm", first: true, predicate: ["candidateCriterionsForm"], descendants: true }, { propertyName: "candidateInterviewForm", first: true, predicate: ["candidateInterviewForm"], descendants: true }, { propertyName: "candidateNotificationForm", first: true, predicate: ["candidateNotificationForm"], descendants: true }], ngImport: i0, template: "<nb-card>\n  <nb-card-header class=\"d-flex flex-column\">\n    <span class=\"cancel\"><i class=\"fas fa-times\" (click)=\"closeDialog()\"></i></span>\n    <div class=\"d-flex flex-row p-0\">\n      @if (!isCalendar) {\n        <img\n          class=\"candidate-image\"\n          [src]=\"selectedCandidate?.user.imageUrl\"\n          alt=\"Candidate Avatar\"\n          />\n      }\n      <div class=\"d-flex flex-column mr-3 ml-3\">\n        <h5 class=\"title\" [innerText]=\"headerTitle\"></h5>\n        @if (!isCalendar) {\n          <span class=\"sub-title\">\n            {{ selectedCandidate?.user?.name }}\n          </span>\n        }\n      </div>\n    </div>\n  </nb-card-header>\n  <nb-card-body class=\"stepper\">\n    <nb-stepper #stepper disableStepNavigation>\n      <nb-step [label]=\"step1\">\n        <ng-template #step1>\n          {{ 'CANDIDATES_PAGE.EDIT_CANDIDATE.INTERVIEW.STEP_1' | translate }}\n        </ng-template>\n        @if (isCalendar) {\n          <div class=\"form-group\">\n            <label for=\"note\" class=\"label\">\n              {{ 'FORM.LABELS.CANDIDATE' | translate }}\n            </label>\n            <ga-candidate-select\n              [placeholder]=\"'FORM.PLACEHOLDERS.ADD_REMOVE_CANDIDATE' | translate\"\n              (selectedChange)=\"onCandidateSelected($event)\"\n              [selectedCandidateId]=\"selectedCandidateId\"\n            ></ga-candidate-select>\n          </div>\n        }\n        <ga-candidate-interview-form\n          [interviews]=\"interviews\"\n          #candidateInterviewForm\n          (titleExist)=\"titleExist($event)\"\n          [isCalendar]=\"isCalendar\"\n          [editData]=\"editData\"\n        ></ga-candidate-interview-form>\n        <div class=\"text-left\">\n          <button\n            status=\"basic\"\n            outline\n            class=\"green\"\n            size=\"small\"\n            [disabled]=\"candidateInterviewForm.form.invalid || isTitleExist\"\n            nbButton\n            nbStepperNext\n            (click)=\"next()\"\n            >\n            {{ 'CANDIDATES_PAGE.EDIT_CANDIDATE.INTERVIEW.NEXT' | translate }}\n          </button>\n        </div>\n      </nb-step>\n      <nb-step [label]=\"step2\">\n        <ng-template #step2>\n          {{ 'CANDIDATES_PAGE.EDIT_CANDIDATE.INTERVIEW.STEP_2' | translate }}\n        </ng-template>\n        <ga-candidate-criterions-form\n          #candidateCriterionsForm\n          [editSelectedTechnologies]=\"editData?.technologies\"\n          [editSelectedQualities]=\"editData?.personalQualities\"\n        ></ga-candidate-criterions-form>\n\n        @if (isCriterionsVisible) {\n          <div class=\"add-criterion\">\n            <ga-candidate-technologies class=\"add-criterion-card\"></ga-candidate-technologies>\n            <ga-candidate-personal-qualities class=\"add-criterion-card\"></ga-candidate-personal-qualities>\n          </div>\n        }\n\n        <div class=\"text-left\">\n          <button\n            class=\"gray\"\n            status=\"basic\"\n            size=\"small\"\n            outline\n            (click)=\"previous()\"\n            nbButton\n            nbStepperPrevious\n            >\n            {{ 'CANDIDATES_PAGE.EDIT_CANDIDATE.INTERVIEW.PREVIOUS' | translate }}\n          </button>\n\n          <button status=\"warning\" size=\"small\" class=\"mr-3 ml-2\" (click)=\"showCriterions()\" nbButton>\n            {{\n            isCriterionsVisible\n            ? ('CANDIDATES_PAGE.EDIT_CANDIDATE.INTERVIEW.CLOSE_CRITERIONS' | translate)\n            : ('CANDIDATES_PAGE.EDIT_CANDIDATE.INTERVIEW.CREATE_CRITERIONS' | translate)\n            }}\n          </button>\n          <button class=\"green\" status=\"basic\" size=\"small\" outline nbButton nbStepperNext>\n            {{ 'CANDIDATES_PAGE.EDIT_CANDIDATE.INTERVIEW.NEXT' | translate }}\n          </button>\n        </div>\n      </nb-step>\n      <nb-step [label]=\"step3\">\n        <ng-template #step3>\n          {{ 'CANDIDATES_PAGE.EDIT_CANDIDATE.INTERVIEW.STEP_3' | translate }}\n        </ng-template>\n        <ga-candidate-notification-form\n          #candidateNotificationForm\n          [interview]=\"interview\"\n          [employees]=\"employees\"\n          [selectedCandidate]=\"selectedCandidate\"\n        ></ga-candidate-notification-form>\n        <div class=\"text-left\">\n          <button class=\"btn gray\" status=\"basic\" outline=\"\" (click)=\"previous()\" nbButton nbStepperPrevious>\n            {{ 'CANDIDATES_PAGE.EDIT_CANDIDATE.INTERVIEW.PREVIOUS' | translate }}\n          </button>\n          <button class=\"btn mr-3 ml-3\" status=\"success\" nbButton nbStepperSave (click)=\"save()\">\n            {{ 'CANDIDATES_PAGE.EDIT_CANDIDATE.INTERVIEW.SAVE' | translate }}\n          </button>\n        </div>\n      </nb-step>\n    </nb-stepper>\n  </nb-card-body>\n</nb-card>\n", styles: ["@charset \"UTF-8\";:host i{cursor:pointer}:host .cancel{width:100%;display:flex}[dir=ltr] :host .cancel{justify-content:flex-end}[dir=rtl] :host .cancel{justify-content:flex-start}:host .cancel i{font-size:11px;color:var(--gauzy-text-color-1)}:host [nbButton].appearance-outline.status-basic{background-color:transparent;border-color:#f56d584d;border-width:2px;color:#f56d58}:host [nbButton].appearance-outline.status-basic:hover{border-color:#f56d58}:host [nbButton].appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #f56d580d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host .title{color:var(--text-primary-color);font-size:16px;font-weight:600;line-height:16px;letter-spacing:0em}:host [nbButton].gray.appearance-outline.status-basic{background-color:transparent;border-color:#7e7e8f4d;border-width:2px;color:#7e7e8f}:host [nbButton].gray.appearance-outline.status-basic:hover{border-color:#7e7e8f}:host [nbButton].gray.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #7e7e8f0d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].gray.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic{background-color:transparent;border-color:#25b8694d;border-width:2px;color:#25b869}:host [nbButton].green.appearance-outline.status-basic:hover{border-color:#25b869}:host [nbButton].green.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #25b8690d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].green.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic[disabled],:host [nbButton].green.appearance-outline.status-basic.btn-disabled{background-color:var(--button-outline-basic-disabled-background-color);border-color:var(--button-outline-basic-disabled-border-color);color:var(--button-outline-basic-disabled-text-color);box-shadow:unset}:host [nbButton].primary.appearance-filled.status-primary{color:var(--text-primary-color);border:unset;background-color:var(--color-primary-transparent-default);box-shadow:var(--gauzy-shadow)}[dir=ltr] :host ::ng-deep input,[dir=ltr] :host ::ng-deep textarea{text-align:start}[dir=rtl] :host ::ng-deep input,[dir=rtl] :host ::ng-deep textarea{text-align:end}:host ::ng-deep input,:host ::ng-deep nb-select.appearance-outline.status-basic .select-button,:host ::ng-deep .ng-select .ng-select-container{background-color:var(--gauzy-sidebar-background-4)!important;border:none;min-height:calc(var(--select-medium-text-line-height) + .4375rem * 2)!important}:host ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-placeholder,:host ::ng-deep .ng-select.ng-select-single .ng-select-container .ng-value-container .ng-input{top:unset!important}:host ::ng-deep label,:host ::ng-deep .label{font-size:var(--text-label-font-size);font-weight:600;line-height:.8125rem;letter-spacing:-.01em;color:var(--gauzy-text-color-2)}:host ::ng-deep textarea{background-color:var(--gauzy-sidebar-background-4)!important;border:none}:host ::ng-deep .ng-select .ng-select-container input,:host ::ng-deep nb-tag-list input{background-color:unset!important}.candidate-image{width:70px;height:70px;border-radius:var(--border-radius);object-fit:cover}.candidate-image-small{max-width:35px;max-height:35px;border-radius:13px;margin-right:4px;margin-left:4px}.button-container{justify-content:space-between;flex-direction:row;display:flex}.summary{min-width:45rem}.employee-name{display:flex;flex-direction:row;justify-content:center;align-items:center}.title-icon{color:#8f9bb3!important;font-size:16px}.stepper{max-height:46rem}.btn{width:6rem}:host nb-card{background-color:var(--gauzy-card-1)}:host ::ng-deep ngx-timer-range-picker input.form-control{background:var(--input-basic-background-color)!important}.sub-title{margin-top:4px;font-size:12px;font-weight:600;line-height:13px;letter-spacing:0em}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "component", type: i1.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i1.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "component", type: i1.NbCardHeaderComponent, selector: "nb-card-header" }, { kind: "component", type: i1.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "component", type: i1.NbStepperComponent, selector: "nb-stepper", inputs: ["selectedIndex", "disableStepNavigation", "selected", "orientation", "linear"], outputs: ["stepChange"] }, { kind: "component", type: i1.NbStepComponent, selector: "nb-step", inputs: ["stepControl", "label", "hidden", "completed"] }, { kind: "directive", type: i1.NbStepperNextDirective, selector: "button[nbStepperNext]", inputs: ["type"] }, { kind: "directive", type: i1.NbStepperPreviousDirective, selector: "button[nbStepperPrevious]", inputs: ["type"] }, { kind: "component", type: i5.CandidateSelectComponent, selector: "ga-candidate-select", inputs: ["placeholder", "disabled", "reset"], outputs: ["selectedChange"] }, { kind: "component", type: i6.CandidateInterviewFormComponent, selector: "ga-candidate-interview-form", inputs: ["editData", "isCalendar", "interviews"], outputs: ["titleExist"] }, { kind: "component", type: i7.CandidateCriterionsFormComponent, selector: "ga-candidate-criterions-form", inputs: ["editSelectedTechnologies", "editSelectedQualities"] }, { kind: "component", type: i8.CandidateNotificationFormComponent, selector: "ga-candidate-notification-form", inputs: ["interview", "selectedCandidate", "employees"] }, { kind: "component", type: i9.CandidateTechnologiesComponent, selector: "ga-candidate-technologies" }, { kind: "component", type: i10.CandidatePersonalQualitiesComponent, selector: "ga-candidate-personal-qualities" }, { kind: "pipe", type: i11.TranslatePipe, name: "translate" }] }); }
};
CandidateInterviewMutationComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [NbDialogRef,
        EmployeesService,
        Store,
        ChangeDetectorRef,
        CandidateInterviewService,
        CandidatesService,
        ErrorHandlingService,
        CandidateInterviewersService,
        CandidateTechnologiesService,
        CandidatePersonalQualitiesService,
        Router,
        CandidateStore,
        CommunicationService])
], CandidateInterviewMutationComponent);
export { CandidateInterviewMutationComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CandidateInterviewMutationComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-candidate-interview-mutation', standalone: false, template: "<nb-card>\n  <nb-card-header class=\"d-flex flex-column\">\n    <span class=\"cancel\"><i class=\"fas fa-times\" (click)=\"closeDialog()\"></i></span>\n    <div class=\"d-flex flex-row p-0\">\n      @if (!isCalendar) {\n        <img\n          class=\"candidate-image\"\n          [src]=\"selectedCandidate?.user.imageUrl\"\n          alt=\"Candidate Avatar\"\n          />\n      }\n      <div class=\"d-flex flex-column mr-3 ml-3\">\n        <h5 class=\"title\" [innerText]=\"headerTitle\"></h5>\n        @if (!isCalendar) {\n          <span class=\"sub-title\">\n            {{ selectedCandidate?.user?.name }}\n          </span>\n        }\n      </div>\n    </div>\n  </nb-card-header>\n  <nb-card-body class=\"stepper\">\n    <nb-stepper #stepper disableStepNavigation>\n      <nb-step [label]=\"step1\">\n        <ng-template #step1>\n          {{ 'CANDIDATES_PAGE.EDIT_CANDIDATE.INTERVIEW.STEP_1' | translate }}\n        </ng-template>\n        @if (isCalendar) {\n          <div class=\"form-group\">\n            <label for=\"note\" class=\"label\">\n              {{ 'FORM.LABELS.CANDIDATE' | translate }}\n            </label>\n            <ga-candidate-select\n              [placeholder]=\"'FORM.PLACEHOLDERS.ADD_REMOVE_CANDIDATE' | translate\"\n              (selectedChange)=\"onCandidateSelected($event)\"\n              [selectedCandidateId]=\"selectedCandidateId\"\n            ></ga-candidate-select>\n          </div>\n        }\n        <ga-candidate-interview-form\n          [interviews]=\"interviews\"\n          #candidateInterviewForm\n          (titleExist)=\"titleExist($event)\"\n          [isCalendar]=\"isCalendar\"\n          [editData]=\"editData\"\n        ></ga-candidate-interview-form>\n        <div class=\"text-left\">\n          <button\n            status=\"basic\"\n            outline\n            class=\"green\"\n            size=\"small\"\n            [disabled]=\"candidateInterviewForm.form.invalid || isTitleExist\"\n            nbButton\n            nbStepperNext\n            (click)=\"next()\"\n            >\n            {{ 'CANDIDATES_PAGE.EDIT_CANDIDATE.INTERVIEW.NEXT' | translate }}\n          </button>\n        </div>\n      </nb-step>\n      <nb-step [label]=\"step2\">\n        <ng-template #step2>\n          {{ 'CANDIDATES_PAGE.EDIT_CANDIDATE.INTERVIEW.STEP_2' | translate }}\n        </ng-template>\n        <ga-candidate-criterions-form\n          #candidateCriterionsForm\n          [editSelectedTechnologies]=\"editData?.technologies\"\n          [editSelectedQualities]=\"editData?.personalQualities\"\n        ></ga-candidate-criterions-form>\n\n        @if (isCriterionsVisible) {\n          <div class=\"add-criterion\">\n            <ga-candidate-technologies class=\"add-criterion-card\"></ga-candidate-technologies>\n            <ga-candidate-personal-qualities class=\"add-criterion-card\"></ga-candidate-personal-qualities>\n          </div>\n        }\n\n        <div class=\"text-left\">\n          <button\n            class=\"gray\"\n            status=\"basic\"\n            size=\"small\"\n            outline\n            (click)=\"previous()\"\n            nbButton\n            nbStepperPrevious\n            >\n            {{ 'CANDIDATES_PAGE.EDIT_CANDIDATE.INTERVIEW.PREVIOUS' | translate }}\n          </button>\n\n          <button status=\"warning\" size=\"small\" class=\"mr-3 ml-2\" (click)=\"showCriterions()\" nbButton>\n            {{\n            isCriterionsVisible\n            ? ('CANDIDATES_PAGE.EDIT_CANDIDATE.INTERVIEW.CLOSE_CRITERIONS' | translate)\n            : ('CANDIDATES_PAGE.EDIT_CANDIDATE.INTERVIEW.CREATE_CRITERIONS' | translate)\n            }}\n          </button>\n          <button class=\"green\" status=\"basic\" size=\"small\" outline nbButton nbStepperNext>\n            {{ 'CANDIDATES_PAGE.EDIT_CANDIDATE.INTERVIEW.NEXT' | translate }}\n          </button>\n        </div>\n      </nb-step>\n      <nb-step [label]=\"step3\">\n        <ng-template #step3>\n          {{ 'CANDIDATES_PAGE.EDIT_CANDIDATE.INTERVIEW.STEP_3' | translate }}\n        </ng-template>\n        <ga-candidate-notification-form\n          #candidateNotificationForm\n          [interview]=\"interview\"\n          [employees]=\"employees\"\n          [selectedCandidate]=\"selectedCandidate\"\n        ></ga-candidate-notification-form>\n        <div class=\"text-left\">\n          <button class=\"btn gray\" status=\"basic\" outline=\"\" (click)=\"previous()\" nbButton nbStepperPrevious>\n            {{ 'CANDIDATES_PAGE.EDIT_CANDIDATE.INTERVIEW.PREVIOUS' | translate }}\n          </button>\n          <button class=\"btn mr-3 ml-3\" status=\"success\" nbButton nbStepperSave (click)=\"save()\">\n            {{ 'CANDIDATES_PAGE.EDIT_CANDIDATE.INTERVIEW.SAVE' | translate }}\n          </button>\n        </div>\n      </nb-step>\n    </nb-stepper>\n  </nb-card-body>\n</nb-card>\n", styles: ["@charset \"UTF-8\";:host i{cursor:pointer}:host .cancel{width:100%;display:flex}[dir=ltr] :host .cancel{justify-content:flex-end}[dir=rtl] :host .cancel{justify-content:flex-start}:host .cancel i{font-size:11px;color:var(--gauzy-text-color-1)}:host [nbButton].appearance-outline.status-basic{background-color:transparent;border-color:#f56d584d;border-width:2px;color:#f56d58}:host [nbButton].appearance-outline.status-basic:hover{border-color:#f56d58}:host [nbButton].appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #f56d580d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host .title{color:var(--text-primary-color);font-size:16px;font-weight:600;line-height:16px;letter-spacing:0em}:host [nbButton].gray.appearance-outline.status-basic{background-color:transparent;border-color:#7e7e8f4d;border-width:2px;color:#7e7e8f}:host [nbButton].gray.appearance-outline.status-basic:hover{border-color:#7e7e8f}:host [nbButton].gray.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #7e7e8f0d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].gray.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic{background-color:transparent;border-color:#25b8694d;border-width:2px;color:#25b869}:host [nbButton].green.appearance-outline.status-basic:hover{border-color:#25b869}:host [nbButton].green.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #25b8690d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].green.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic[disabled],:host [nbButton].green.appearance-outline.status-basic.btn-disabled{background-color:var(--button-outline-basic-disabled-background-color);border-color:var(--button-outline-basic-disabled-border-color);color:var(--button-outline-basic-disabled-text-color);box-shadow:unset}:host [nbButton].primary.appearance-filled.status-primary{color:var(--text-primary-color);border:unset;background-color:var(--color-primary-transparent-default);box-shadow:var(--gauzy-shadow)}[dir=ltr] :host ::ng-deep input,[dir=ltr] :host ::ng-deep textarea{text-align:start}[dir=rtl] :host ::ng-deep input,[dir=rtl] :host ::ng-deep textarea{text-align:end}:host ::ng-deep input,:host ::ng-deep nb-select.appearance-outline.status-basic .select-button,:host ::ng-deep .ng-select .ng-select-container{background-color:var(--gauzy-sidebar-background-4)!important;border:none;min-height:calc(var(--select-medium-text-line-height) + .4375rem * 2)!important}:host ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-placeholder,:host ::ng-deep .ng-select.ng-select-single .ng-select-container .ng-value-container .ng-input{top:unset!important}:host ::ng-deep label,:host ::ng-deep .label{font-size:var(--text-label-font-size);font-weight:600;line-height:.8125rem;letter-spacing:-.01em;color:var(--gauzy-text-color-2)}:host ::ng-deep textarea{background-color:var(--gauzy-sidebar-background-4)!important;border:none}:host ::ng-deep .ng-select .ng-select-container input,:host ::ng-deep nb-tag-list input{background-color:unset!important}.candidate-image{width:70px;height:70px;border-radius:var(--border-radius);object-fit:cover}.candidate-image-small{max-width:35px;max-height:35px;border-radius:13px;margin-right:4px;margin-left:4px}.button-container{justify-content:space-between;flex-direction:row;display:flex}.summary{min-width:45rem}.employee-name{display:flex;flex-direction:row;justify-content:center;align-items:center}.title-icon{color:#8f9bb3!important;font-size:16px}.stepper{max-height:46rem}.btn{width:6rem}:host nb-card{background-color:var(--gauzy-card-1)}:host ::ng-deep ngx-timer-range-picker input.form-control{background:var(--input-basic-background-color)!important}.sub-title{margin-top:4px;font-size:12px;font-weight:600;line-height:13px;letter-spacing:0em}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [{ type: i1.NbDialogRef }, { type: i2.EmployeesService }, { type: i2.Store }, { type: i0.ChangeDetectorRef }, { type: i2.CandidateInterviewService }, { type: i2.CandidatesService }, { type: i2.ErrorHandlingService }, { type: i2.CandidateInterviewersService }, { type: i2.CandidateTechnologiesService }, { type: i2.CandidatePersonalQualitiesService }, { type: i3.Router }, { type: i2.CandidateStore }, { type: i4.CommunicationService }], propDecorators: { editData: [{
                type: Input
            }], selectedCandidate: [{
                type: Input
            }], interviewId: [{
                type: Input
            }], isCalendar: [{
                type: Input
            }], selectedRangeCalendar: [{
                type: Input
            }], headerTitle: [{
                type: Input
            }], interviews: [{
                type: Input
            }], stepper: [{
                type: ViewChild,
                args: ['stepper']
            }], candidateCriterionsForm: [{
                type: ViewChild,
                args: ['candidateCriterionsForm']
            }], candidateInterviewForm: [{
                type: ViewChild,
                args: ['candidateInterviewForm']
            }], candidateNotificationForm: [{
                type: ViewChild,
                args: ['candidateNotificationForm']
            }] } });
//# sourceMappingURL=candidate-interview-mutation.component.js.map