import { Component, Input, ViewChild } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { CandidateStatusEnum } from '@gauzy/contracts';
import { CandidateCriterionsRatingService, CandidateFeedbacksService, CandidatesService, ToastrService } from '@gauzy/ui-core/core';
import { Store } from '@gauzy/ui-core/core';
import { EmployeeSelectorComponent } from '../../selectors/employee';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "@angular/forms";
import * as i3 from "@gauzy/ui-core/core";
import * as i4 from "@ngx-translate/core";
import * as i5 from "../../star-rating/star-rating-input/star-rating-input.component";
import * as i6 from "../../star-rating/star-rating-output/star-rating-output.component";
import * as i7 from "../selectors/candidate-interviewer-select/candidate-interviewer-select.component";
export class CandidateInterviewFeedbackComponent extends TranslationBaseComponent {
    constructor(dialogRef, fb, toastrService, translateService, candidatesService, candidateFeedbacksService, candidateCriterionsRatingService, store) {
        super(translateService);
        this.dialogRef = dialogRef;
        this.fb = fb;
        this.toastrService = toastrService;
        this.translateService = translateService;
        this.candidatesService = candidatesService;
        this.candidateFeedbacksService = candidateFeedbacksService;
        this.candidateCriterionsRatingService = candidateCriterionsRatingService;
        this.store = store;
        this.feedbacks = null;
        this.statusHire = 0;
        this.disabledIds = [];
        this.averageRating = null;
        this.emptyFeedback = {
            description: '',
            rating: null,
            status: null,
            interviewer: null
        };
    }
    ngOnInit() {
        this.organization = this.store.selectedOrganization;
        this._initializeForm();
        this.loadCriterions();
        this.loadFeedbacks();
    }
    _initializeForm() {
        this.form = this.fb.group({
            description: ['', Validators.required],
            rating: [''],
            technologies: this.fb.array([]),
            personalQualities: this.fb.array([])
        });
        this.form.valueChanges.subscribe((item) => {
            this.averageRating = this.setRating(item.technologies, item.personalQualities);
        });
    }
    setRating(technologies, qualities) {
        this.technologiesList.forEach((tech, index) => (tech.rating = technologies[index]));
        this.personalQualitiesList.forEach((qual, index) => (qual.rating = qualities[index]));
        const techSum = technologies.length > 0 ? technologies.reduce((sum, current) => sum + current, 0) / technologies.length : 0;
        const qualSum = qualities.length > 0 ? qualities.reduce((sum, current) => sum + current, 0) / qualities.length : 0;
        const isSomeEmpty = (technologies.length > 0 ? 1 : 0) + (qualities.length > 0 ? 1 : 0);
        const res = techSum || qualSum ? (techSum + qualSum) / isSomeEmpty : 0;
        return res;
    }
    async loadFeedbacks() {
        const { id: organizationId, tenantId } = this.organization;
        const result = await this.candidateFeedbacksService.getAll(['interviewer'], {
            candidateId: this.candidateId,
            organizationId,
            tenantId
        });
        if (result) {
            for (const feedback of result.items) {
                if (feedback.interviewId === this.interviewId && feedback.interviewer) {
                    this.disabledIds.push(feedback.interviewer.employeeId);
                    if (feedback.status === CandidateStatusEnum.REJECTED) {
                        this.isRejected = true;
                    }
                    else {
                        this.isRejected = false;
                    }
                    this.statusHire =
                        feedback.status === CandidateStatusEnum.HIRED ? this.statusHire + 1 : this.statusHire;
                }
            }
        }
    }
    onMembersSelected(id) {
        this.selectedEmployeeId = id;
        for (const item of this.currentInterview.interviewers) {
            if (this.selectedEmployeeId === item.employeeId) {
                this.feedbackInterviewer = item;
            }
        }
    }
    async createFeedback() {
        const { id: organizationId, tenantId } = this.organization;
        const description = this.form.get('description').value;
        if (this.form.valid &&
            this.status &&
            this.form.get('technologies').value.every((el) => el) &&
            this.form.get('personalQualities').value.every((el) => el)) {
            try {
                const feedback = await this.candidateFeedbacksService.create({
                    ...this.emptyFeedback,
                    candidateId: this.candidateId,
                    interviewId: this.interviewId,
                    organizationId,
                    tenantId
                });
                if (this.technologiesList.length !== 0 || this.personalQualitiesList.length !== 0) {
                    await this.candidateCriterionsRatingService.createBulk(feedback.id, this.technologiesList, this.personalQualitiesList);
                }
                const updated = await this.candidateFeedbacksService.update(feedback.id, {
                    description: description,
                    rating: this.technologiesList.length === 0 && this.personalQualitiesList.length === 0
                        ? this.form.get('rating').value
                        : this.averageRating,
                    interviewer: this.feedbackInterviewer,
                    status: this.status,
                    organizationId,
                    tenantId
                });
                this.setStatus(this.status);
                this.technologiesList.forEach((tech) => (tech.rating = null));
                this.personalQualitiesList.forEach((qual) => (qual.rating = null));
                this.dialogRef.close(updated);
                this.form.reset();
            }
            catch (error) {
                this.toastrService.danger('NOTES.CANDIDATE.EXPERIENCE.ERROR', 'TOASTR.TITLE.ERROR', {
                    error: error.error ? error.error.message : error.message
                });
            }
        }
        else {
            this.toastrService.danger('NOTES.CANDIDATE.INVALID_FORM', 'TOASTR.MESSAGE.CANDIDATE_FEEDBACK_REQUIRED');
        }
    }
    async setStatus(status) {
        if (status === CandidateStatusEnum.REJECTED) {
            await this.candidatesService.setCandidateAsRejected(this.candidateId);
        }
        else if (this.statusHire + 1 === this.currentInterview.employees.length) {
            await this.candidatesService.setCandidateAsHired(this.candidateId);
        }
        else {
            await this.candidatesService.setCandidateAsApplied(this.candidateId);
        }
    }
    loadCriterions() {
        this.personalQualitiesList = this.currentInterview.personalQualities;
        this.technologiesList = this.currentInterview.technologies;
        const technologyRating = this.form.get('technologies');
        this.technologiesList.forEach((item) => {
            technologyRating.push(this.fb.control(item.rating));
        });
        const personalQualityRating = this.form.get('personalQualities');
        this.personalQualitiesList.forEach((item) => {
            personalQualityRating.push(this.fb.control(item.rating));
        });
    }
    closeDialog() {
        this.dialogRef.close();
        this.form.reset();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CandidateInterviewFeedbackComponent, deps: [{ token: i1.NbDialogRef }, { token: i2.UntypedFormBuilder }, { token: i3.ToastrService }, { token: i4.TranslateService }, { token: i3.CandidatesService }, { token: i3.CandidateFeedbacksService }, { token: i3.CandidateCriterionsRatingService }, { token: i3.Store }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: CandidateInterviewFeedbackComponent, isStandalone: false, selector: "ga-candidate-interview-feedback", inputs: { candidateId: "candidateId", interviewId: "interviewId", currentInterview: "currentInterview" }, viewQueries: [{ propertyName: "employeeSelector", first: true, predicate: ["employeeSelector"], descendants: true }], usesInheritance: true, ngImport: i0, template: "<nb-card class=\"card-wrap\">\n\t<nb-card-header class=\"d-flex flex-column\">\n\t\t<span class=\"cancel\"><i class=\"fas fa-times\" (click)=\"closeDialog()\"></i></span>\n\t\t<h5 class=\"title\">\n\t\t\t{{ 'CANDIDATES_PAGE.EDIT_CANDIDATE.LEAVE_FEEDBACK' | translate }}\n\t\t\t{{ currentInterview?.title }}\n\t\t</h5>\n\t</nb-card-header>\n\t<nb-card-body>\n\t\t@if (form) {\n\t\t\t<form class=\"form\" [formGroup]=\"form\">\n\t\t\t\t<ga-candidate-interviewer-select\n\t\t\t\t\tclass=\"select\"\n\t\t\t\t\t[interviewers]=\"currentInterview.employees\"\n\t\t\t\t\t[placeholder]=\"'FORM.PLACEHOLDERS.ADD_REMOVE_EMPLOYEE' | translate\"\n\t\t\t\t\t[disabledIds]=\"disabledIds\"\n\t\t\t\t\t(selectedChange)=\"onMembersSelected($event)\"\n\t\t\t\t></ga-candidate-interviewer-select>\n\t\t\t\t<div class=\"label-wrap\">\n\t\t\t\t\t@if (technologiesList[0] || personalQualitiesList[0]) {\n\t\t\t\t\t\t<ga-star-rating-output [rate]=\"averageRating\"></ga-star-rating-output>\n\t\t\t\t\t}\n\t\t\t\t\t@if (!(technologiesList[0] || personalQualitiesList[0])) {\n\t\t\t\t\t\t<ga-star-rating-input formControlName=\"rating\"></ga-star-rating-input>\n\t\t\t\t\t}\n\t\t\t\t\t<nb-radio-group [(ngModel)]=\"status\" [ngModelOptions]=\"{ standalone: true }\" class=\"radio-group\">\n\t\t\t\t\t\t<nb-radio [value]=\"'HIRED'\" [disabled]=\"isRejected\"\n\t\t\t\t\t\t\t>{{ 'CANDIDATES_PAGE.EDIT_CANDIDATE.INTERVIEW.HIRE' | translate }}\n\t\t\t\t\t\t\t@if (interviewers?.length > 1) {\n\t\t\t\t\t\t\t\t<span> ({{ statusHire }}/{{ interviewers?.length }}) </span>\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t<i class=\"fas fa-thumbs-up\" [class.success]=\"!isRejected\" [class.disabled]=\"isRejected\"></i>\n\t\t\t\t\t\t</nb-radio>\n\t\t\t\t\t\t<nb-radio [value]=\"'REJECTED'\"\n\t\t\t\t\t\t\t>{{ 'CANDIDATES_PAGE.EDIT_CANDIDATE.INTERVIEW.REJECT' | translate }}\n\t\t\t\t\t\t\t<i class=\"fas error fa-thumbs-down\"></i\n\t\t\t\t\t\t></nb-radio>\n\t\t\t\t\t</nb-radio-group>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t@if (technologiesList[0] || personalQualitiesList[0]) {\n\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t<div class=\"form-blocks mt-3\">\n\t\t\t\t\t\t\t\t@if (technologiesList.length > 0) {\n\t\t\t\t\t\t\t\t\t<div [style.width]=\"personalQualitiesList.length === 0 ? '100%' : '50%'\">\n\t\t\t\t\t\t\t\t\t\t<div class=\"label mb-2\">\n\t\t\t\t\t\t\t\t\t\t\t{{ 'CANDIDATES_PAGE.CRITERIONS.TECHNOLOGY_STACK' | translate }}\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t@for (\n\t\t\t\t\t\t\t\t\t\t\ttechnologyRating of form.get('technologies').controls;\n\t\t\t\t\t\t\t\t\t\t\ttrack technologyRating;\n\t\t\t\t\t\t\t\t\t\t\tlet i = $index\n\t\t\t\t\t\t\t\t\t\t) {\n\t\t\t\t\t\t\t\t\t\t\t<div class=\"criterion\">\n\t\t\t\t\t\t\t\t\t\t\t\t@if (technologiesList) {\n\t\t\t\t\t\t\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t{{ technologiesList[i]?.name }}\n\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t\t\t\t<ga-star-rating-input\n\t\t\t\t\t\t\t\t\t\t\t\t\t[formControl]=\"technologyRating\"\n\t\t\t\t\t\t\t\t\t\t\t\t></ga-star-rating-input>\n\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t@if (personalQualitiesList.length > 0) {\n\t\t\t\t\t\t\t\t\t<div [style.width]=\"technologiesList.length === 0 ? '100%' : '50%'\">\n\t\t\t\t\t\t\t\t\t\t<div class=\"label mb-2\">\n\t\t\t\t\t\t\t\t\t\t\t{{ 'CANDIDATES_PAGE.CRITERIONS.PERSONAL_QUALITIES' | translate }}\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t@for (\n\t\t\t\t\t\t\t\t\t\t\tpersonalQualityRating of form.get('personalQualities').controls;\n\t\t\t\t\t\t\t\t\t\t\ttrack personalQualityRating;\n\t\t\t\t\t\t\t\t\t\t\tlet i = $index\n\t\t\t\t\t\t\t\t\t\t) {\n\t\t\t\t\t\t\t\t\t\t\t<div class=\"criterion\">\n\t\t\t\t\t\t\t\t\t\t\t\t@if (personalQualitiesList) {\n\t\t\t\t\t\t\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t{{ personalQualitiesList[i]?.name }}\n\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t\t\t\t<ga-star-rating-input\n\t\t\t\t\t\t\t\t\t\t\t\t\t[formControl]=\"personalQualityRating\"\n\t\t\t\t\t\t\t\t\t\t\t\t></ga-star-rating-input>\n\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t}\n\t\t\t\t</div>\n\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t<label for=\"description\" class=\"label\">{{ 'FORM.LABELS.FEEDBACK_DESCRIPTION' | translate }}</label>\n\t\t\t\t\t<textarea\n\t\t\t\t\t\tid=\"description\"\n\t\t\t\t\t\tnbInput\n\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\tformControlName=\"description\"\n\t\t\t\t\t\t[placeholder]=\"'FORM.PLACEHOLDERS.FEEDBACK_DESCRIPTION' | translate\"\n\t\t\t\t\t></textarea>\n\t\t\t\t</div>\n\t\t\t</form>\n\t\t}\n\t</nb-card-body>\n\t<nb-card-footer>\n\t\t<button (click)=\"closeDialog()\" size=\"small\" nbButton status=\"basic\" outline>\n\t\t\t{{ 'BUTTONS.CANCEL' | translate }}\n\t\t</button>\n\t\t<button class=\"mr-3 ml-3\" (click)=\"createFeedback()\" nbButton status=\"success\" size=\"small\">\n\t\t\t{{ 'BUTTONS.SAVE' | translate }}\n\t\t</button>\n\t</nb-card-footer>\n</nb-card>\n", styles: ["@charset \"UTF-8\";:host i{cursor:pointer}:host .cancel{width:100%;display:flex}[dir=ltr] :host .cancel{justify-content:flex-end}[dir=rtl] :host .cancel{justify-content:flex-start}:host .cancel i{font-size:11px;color:var(--gauzy-text-color-1)}:host [nbButton].appearance-outline.status-basic{background-color:transparent;border-color:#f56d584d;border-width:2px;color:#f56d58}:host [nbButton].appearance-outline.status-basic:hover{border-color:#f56d58}:host [nbButton].appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #f56d580d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host .title{color:var(--text-primary-color);font-size:16px;font-weight:600;line-height:16px;letter-spacing:0em}:host [nbButton].gray.appearance-outline.status-basic{background-color:transparent;border-color:#7e7e8f4d;border-width:2px;color:#7e7e8f}:host [nbButton].gray.appearance-outline.status-basic:hover{border-color:#7e7e8f}:host [nbButton].gray.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #7e7e8f0d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].gray.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic{background-color:transparent;border-color:#25b8694d;border-width:2px;color:#25b869}:host [nbButton].green.appearance-outline.status-basic:hover{border-color:#25b869}:host [nbButton].green.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #25b8690d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].green.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic[disabled],:host [nbButton].green.appearance-outline.status-basic.btn-disabled{background-color:var(--button-outline-basic-disabled-background-color);border-color:var(--button-outline-basic-disabled-border-color);color:var(--button-outline-basic-disabled-text-color);box-shadow:unset}:host [nbButton].primary.appearance-filled.status-primary{color:var(--text-primary-color);border:unset;background-color:var(--color-primary-transparent-default);box-shadow:var(--gauzy-shadow)}[dir=ltr] :host ::ng-deep input,[dir=ltr] :host ::ng-deep textarea{text-align:start}[dir=rtl] :host ::ng-deep input,[dir=rtl] :host ::ng-deep textarea{text-align:end}:host ::ng-deep input,:host ::ng-deep nb-select.appearance-outline.status-basic .select-button,:host ::ng-deep .ng-select .ng-select-container{background-color:var(--gauzy-sidebar-background-4)!important;border:none;min-height:calc(var(--select-medium-text-line-height) + .4375rem * 2)!important}:host ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-placeholder,:host ::ng-deep .ng-select.ng-select-single .ng-select-container .ng-value-container .ng-input{top:unset!important}:host ::ng-deep label,:host ::ng-deep .label{font-size:var(--text-label-font-size);font-weight:600;line-height:.8125rem;letter-spacing:-.01em;color:var(--gauzy-text-color-2)}:host ::ng-deep textarea{background-color:var(--gauzy-sidebar-background-4)!important;border:none}:host ::ng-deep .ng-select .ng-select-container input,:host ::ng-deep nb-tag-list input{background-color:unset!important}:host nb-card{background-color:var(--gauzy-card-1)}.card-wrap{min-width:40rem;background-color:var(--gauzy-card-1)}.buttons{flex-direction:row;display:flex;justify-content:space-around;align-items:center}.form-btn{width:10rem}.form{flex-direction:column;display:flex;justify-content:space-around;align-items:flex-start;width:100%;padding-bottom:1rem}.label-wrap{flex-direction:row;display:flex;justify-content:space-between;align-items:center;width:100%;margin-top:.5rem}#description{min-height:10rem;margin-top:.5rem}.form-group{width:100%}.radio-group{flex-direction:row;display:flex;justify-content:space-around;align-items:center}[dir=ltr] :host .fas{padding-left:3px}[dir=rtl] :host .fas{padding-right:3px}:host .fas{font-size:15px}.success{color:#00d68f}.error{color:#ff3d71}.disabled{color:#8f9bb37a}.select{width:100%}.form-blocks{display:flex;flex-direction:row;justify-content:space-between;align-items:stretch;flex-wrap:wrap}:host .form-title{color:#8f9bb3;font-size:15px;padding:0 0 5px 5px}[dir=ltr] :host .form-title{padding:0 0 5px 5px}[dir=rtl] :host .form-title{padding:0 5px 5px 0}:host .criterion{border:1px #e4e9f2 solid}[dir=ltr] :host .criterion{margin:.25rem .25rem .25rem 0}[dir=rtl] :host .criterion{margin:.25rem 0 .25rem .25rem}:host .criterion{display:flex;flex-direction:row;justify-content:space-between;align-items:center;padding:.2rem .5rem;border-radius:.25rem}.accordion{min-width:47rem;margin-top:.75rem;box-shadow:none;border:1px #e4e9f2 solid}.accordion-title{background-color:#f7f9fc;border-color:#e4e9f2;color:#8f9bb3;font-weight:400;padding:7px 18px}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "directive", type: i2.ɵNgNoValidate, selector: "form:not([ngNoForm]):not([ngNativeValidate])" }, { kind: "directive", type: i2.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i2.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i2.NgControlStatusGroup, selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],[formArray],form:not([ngNoForm]),[ngForm]" }, { kind: "directive", type: i2.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "directive", type: i2.FormControlDirective, selector: "[formControl]", inputs: ["formControl", "disabled", "ngModel"], outputs: ["ngModelChange"], exportAs: ["ngForm"] }, { kind: "directive", type: i2.FormGroupDirective, selector: "[formGroup]", inputs: ["formGroup"], outputs: ["ngSubmit"], exportAs: ["ngForm"] }, { kind: "directive", type: i2.FormControlName, selector: "[formControlName]", inputs: ["formControlName", "disabled", "ngModel"], outputs: ["ngModelChange"] }, { kind: "directive", type: i1.NbInputDirective, selector: "input[nbInput],textarea[nbInput]", inputs: ["fieldSize", "status", "shape", "fullWidth"] }, { kind: "component", type: i1.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "component", type: i1.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i1.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "component", type: i1.NbCardFooterComponent, selector: "nb-card-footer" }, { kind: "component", type: i1.NbCardHeaderComponent, selector: "nb-card-header" }, { kind: "component", type: i1.NbRadioComponent, selector: "nb-radio", inputs: ["name", "checked", "value", "disabled", "status"], outputs: ["valueChange", "blur"] }, { kind: "component", type: i1.NbRadioGroupComponent, selector: "nb-radio-group", inputs: ["value", "name", "disabled", "status"], outputs: ["valueChange"] }, { kind: "component", type: i5.StarRatingInputComponent, selector: "ga-star-rating-input" }, { kind: "component", type: i6.StarRatingOutputComponent, selector: "ga-star-rating-output", inputs: ["isGridView", "rate"] }, { kind: "component", type: i7.CandidateInterviewerSelectComponent, selector: "ga-candidate-interviewer-select", inputs: ["placeholder", "disabledIds", "interviewers", "isAllMembers", "disabled", "isPlaceholderSelected", "reset"], outputs: ["selectedChange"] }, { kind: "pipe", type: i4.TranslatePipe, name: "translate" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CandidateInterviewFeedbackComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-candidate-interview-feedback', standalone: false, template: "<nb-card class=\"card-wrap\">\n\t<nb-card-header class=\"d-flex flex-column\">\n\t\t<span class=\"cancel\"><i class=\"fas fa-times\" (click)=\"closeDialog()\"></i></span>\n\t\t<h5 class=\"title\">\n\t\t\t{{ 'CANDIDATES_PAGE.EDIT_CANDIDATE.LEAVE_FEEDBACK' | translate }}\n\t\t\t{{ currentInterview?.title }}\n\t\t</h5>\n\t</nb-card-header>\n\t<nb-card-body>\n\t\t@if (form) {\n\t\t\t<form class=\"form\" [formGroup]=\"form\">\n\t\t\t\t<ga-candidate-interviewer-select\n\t\t\t\t\tclass=\"select\"\n\t\t\t\t\t[interviewers]=\"currentInterview.employees\"\n\t\t\t\t\t[placeholder]=\"'FORM.PLACEHOLDERS.ADD_REMOVE_EMPLOYEE' | translate\"\n\t\t\t\t\t[disabledIds]=\"disabledIds\"\n\t\t\t\t\t(selectedChange)=\"onMembersSelected($event)\"\n\t\t\t\t></ga-candidate-interviewer-select>\n\t\t\t\t<div class=\"label-wrap\">\n\t\t\t\t\t@if (technologiesList[0] || personalQualitiesList[0]) {\n\t\t\t\t\t\t<ga-star-rating-output [rate]=\"averageRating\"></ga-star-rating-output>\n\t\t\t\t\t}\n\t\t\t\t\t@if (!(technologiesList[0] || personalQualitiesList[0])) {\n\t\t\t\t\t\t<ga-star-rating-input formControlName=\"rating\"></ga-star-rating-input>\n\t\t\t\t\t}\n\t\t\t\t\t<nb-radio-group [(ngModel)]=\"status\" [ngModelOptions]=\"{ standalone: true }\" class=\"radio-group\">\n\t\t\t\t\t\t<nb-radio [value]=\"'HIRED'\" [disabled]=\"isRejected\"\n\t\t\t\t\t\t\t>{{ 'CANDIDATES_PAGE.EDIT_CANDIDATE.INTERVIEW.HIRE' | translate }}\n\t\t\t\t\t\t\t@if (interviewers?.length > 1) {\n\t\t\t\t\t\t\t\t<span> ({{ statusHire }}/{{ interviewers?.length }}) </span>\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t<i class=\"fas fa-thumbs-up\" [class.success]=\"!isRejected\" [class.disabled]=\"isRejected\"></i>\n\t\t\t\t\t\t</nb-radio>\n\t\t\t\t\t\t<nb-radio [value]=\"'REJECTED'\"\n\t\t\t\t\t\t\t>{{ 'CANDIDATES_PAGE.EDIT_CANDIDATE.INTERVIEW.REJECT' | translate }}\n\t\t\t\t\t\t\t<i class=\"fas error fa-thumbs-down\"></i\n\t\t\t\t\t\t></nb-radio>\n\t\t\t\t\t</nb-radio-group>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t@if (technologiesList[0] || personalQualitiesList[0]) {\n\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t<div class=\"form-blocks mt-3\">\n\t\t\t\t\t\t\t\t@if (technologiesList.length > 0) {\n\t\t\t\t\t\t\t\t\t<div [style.width]=\"personalQualitiesList.length === 0 ? '100%' : '50%'\">\n\t\t\t\t\t\t\t\t\t\t<div class=\"label mb-2\">\n\t\t\t\t\t\t\t\t\t\t\t{{ 'CANDIDATES_PAGE.CRITERIONS.TECHNOLOGY_STACK' | translate }}\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t@for (\n\t\t\t\t\t\t\t\t\t\t\ttechnologyRating of form.get('technologies').controls;\n\t\t\t\t\t\t\t\t\t\t\ttrack technologyRating;\n\t\t\t\t\t\t\t\t\t\t\tlet i = $index\n\t\t\t\t\t\t\t\t\t\t) {\n\t\t\t\t\t\t\t\t\t\t\t<div class=\"criterion\">\n\t\t\t\t\t\t\t\t\t\t\t\t@if (technologiesList) {\n\t\t\t\t\t\t\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t{{ technologiesList[i]?.name }}\n\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t\t\t\t<ga-star-rating-input\n\t\t\t\t\t\t\t\t\t\t\t\t\t[formControl]=\"technologyRating\"\n\t\t\t\t\t\t\t\t\t\t\t\t></ga-star-rating-input>\n\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t@if (personalQualitiesList.length > 0) {\n\t\t\t\t\t\t\t\t\t<div [style.width]=\"technologiesList.length === 0 ? '100%' : '50%'\">\n\t\t\t\t\t\t\t\t\t\t<div class=\"label mb-2\">\n\t\t\t\t\t\t\t\t\t\t\t{{ 'CANDIDATES_PAGE.CRITERIONS.PERSONAL_QUALITIES' | translate }}\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t@for (\n\t\t\t\t\t\t\t\t\t\t\tpersonalQualityRating of form.get('personalQualities').controls;\n\t\t\t\t\t\t\t\t\t\t\ttrack personalQualityRating;\n\t\t\t\t\t\t\t\t\t\t\tlet i = $index\n\t\t\t\t\t\t\t\t\t\t) {\n\t\t\t\t\t\t\t\t\t\t\t<div class=\"criterion\">\n\t\t\t\t\t\t\t\t\t\t\t\t@if (personalQualitiesList) {\n\t\t\t\t\t\t\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t{{ personalQualitiesList[i]?.name }}\n\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t\t\t\t<ga-star-rating-input\n\t\t\t\t\t\t\t\t\t\t\t\t\t[formControl]=\"personalQualityRating\"\n\t\t\t\t\t\t\t\t\t\t\t\t></ga-star-rating-input>\n\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t}\n\t\t\t\t</div>\n\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t<label for=\"description\" class=\"label\">{{ 'FORM.LABELS.FEEDBACK_DESCRIPTION' | translate }}</label>\n\t\t\t\t\t<textarea\n\t\t\t\t\t\tid=\"description\"\n\t\t\t\t\t\tnbInput\n\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\tformControlName=\"description\"\n\t\t\t\t\t\t[placeholder]=\"'FORM.PLACEHOLDERS.FEEDBACK_DESCRIPTION' | translate\"\n\t\t\t\t\t></textarea>\n\t\t\t\t</div>\n\t\t\t</form>\n\t\t}\n\t</nb-card-body>\n\t<nb-card-footer>\n\t\t<button (click)=\"closeDialog()\" size=\"small\" nbButton status=\"basic\" outline>\n\t\t\t{{ 'BUTTONS.CANCEL' | translate }}\n\t\t</button>\n\t\t<button class=\"mr-3 ml-3\" (click)=\"createFeedback()\" nbButton status=\"success\" size=\"small\">\n\t\t\t{{ 'BUTTONS.SAVE' | translate }}\n\t\t</button>\n\t</nb-card-footer>\n</nb-card>\n", styles: ["@charset \"UTF-8\";:host i{cursor:pointer}:host .cancel{width:100%;display:flex}[dir=ltr] :host .cancel{justify-content:flex-end}[dir=rtl] :host .cancel{justify-content:flex-start}:host .cancel i{font-size:11px;color:var(--gauzy-text-color-1)}:host [nbButton].appearance-outline.status-basic{background-color:transparent;border-color:#f56d584d;border-width:2px;color:#f56d58}:host [nbButton].appearance-outline.status-basic:hover{border-color:#f56d58}:host [nbButton].appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #f56d580d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host .title{color:var(--text-primary-color);font-size:16px;font-weight:600;line-height:16px;letter-spacing:0em}:host [nbButton].gray.appearance-outline.status-basic{background-color:transparent;border-color:#7e7e8f4d;border-width:2px;color:#7e7e8f}:host [nbButton].gray.appearance-outline.status-basic:hover{border-color:#7e7e8f}:host [nbButton].gray.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #7e7e8f0d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].gray.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic{background-color:transparent;border-color:#25b8694d;border-width:2px;color:#25b869}:host [nbButton].green.appearance-outline.status-basic:hover{border-color:#25b869}:host [nbButton].green.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #25b8690d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].green.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic[disabled],:host [nbButton].green.appearance-outline.status-basic.btn-disabled{background-color:var(--button-outline-basic-disabled-background-color);border-color:var(--button-outline-basic-disabled-border-color);color:var(--button-outline-basic-disabled-text-color);box-shadow:unset}:host [nbButton].primary.appearance-filled.status-primary{color:var(--text-primary-color);border:unset;background-color:var(--color-primary-transparent-default);box-shadow:var(--gauzy-shadow)}[dir=ltr] :host ::ng-deep input,[dir=ltr] :host ::ng-deep textarea{text-align:start}[dir=rtl] :host ::ng-deep input,[dir=rtl] :host ::ng-deep textarea{text-align:end}:host ::ng-deep input,:host ::ng-deep nb-select.appearance-outline.status-basic .select-button,:host ::ng-deep .ng-select .ng-select-container{background-color:var(--gauzy-sidebar-background-4)!important;border:none;min-height:calc(var(--select-medium-text-line-height) + .4375rem * 2)!important}:host ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-placeholder,:host ::ng-deep .ng-select.ng-select-single .ng-select-container .ng-value-container .ng-input{top:unset!important}:host ::ng-deep label,:host ::ng-deep .label{font-size:var(--text-label-font-size);font-weight:600;line-height:.8125rem;letter-spacing:-.01em;color:var(--gauzy-text-color-2)}:host ::ng-deep textarea{background-color:var(--gauzy-sidebar-background-4)!important;border:none}:host ::ng-deep .ng-select .ng-select-container input,:host ::ng-deep nb-tag-list input{background-color:unset!important}:host nb-card{background-color:var(--gauzy-card-1)}.card-wrap{min-width:40rem;background-color:var(--gauzy-card-1)}.buttons{flex-direction:row;display:flex;justify-content:space-around;align-items:center}.form-btn{width:10rem}.form{flex-direction:column;display:flex;justify-content:space-around;align-items:flex-start;width:100%;padding-bottom:1rem}.label-wrap{flex-direction:row;display:flex;justify-content:space-between;align-items:center;width:100%;margin-top:.5rem}#description{min-height:10rem;margin-top:.5rem}.form-group{width:100%}.radio-group{flex-direction:row;display:flex;justify-content:space-around;align-items:center}[dir=ltr] :host .fas{padding-left:3px}[dir=rtl] :host .fas{padding-right:3px}:host .fas{font-size:15px}.success{color:#00d68f}.error{color:#ff3d71}.disabled{color:#8f9bb37a}.select{width:100%}.form-blocks{display:flex;flex-direction:row;justify-content:space-between;align-items:stretch;flex-wrap:wrap}:host .form-title{color:#8f9bb3;font-size:15px;padding:0 0 5px 5px}[dir=ltr] :host .form-title{padding:0 0 5px 5px}[dir=rtl] :host .form-title{padding:0 5px 5px 0}:host .criterion{border:1px #e4e9f2 solid}[dir=ltr] :host .criterion{margin:.25rem .25rem .25rem 0}[dir=rtl] :host .criterion{margin:.25rem 0 .25rem .25rem}:host .criterion{display:flex;flex-direction:row;justify-content:space-between;align-items:center;padding:.2rem .5rem;border-radius:.25rem}.accordion{min-width:47rem;margin-top:.75rem;box-shadow:none;border:1px #e4e9f2 solid}.accordion-title{background-color:#f7f9fc;border-color:#e4e9f2;color:#8f9bb3;font-weight:400;padding:7px 18px}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [{ type: i1.NbDialogRef }, { type: i2.UntypedFormBuilder }, { type: i3.ToastrService }, { type: i4.TranslateService }, { type: i3.CandidatesService }, { type: i3.CandidateFeedbacksService }, { type: i3.CandidateCriterionsRatingService }, { type: i3.Store }], propDecorators: { candidateId: [{
                type: Input
            }], interviewId: [{
                type: Input
            }], currentInterview: [{
                type: Input
            }], employeeSelector: [{
                type: ViewChild,
                args: ['employeeSelector']
            }] } });
//# sourceMappingURL=candidate-interview-feedback.component.js.map