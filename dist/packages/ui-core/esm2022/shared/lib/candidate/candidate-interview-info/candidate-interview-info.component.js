import { __decorate, __metadata } from "tslib";
import { Component, Input } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { CandidateInterviewService, CandidateInterviewersService, CandidatesService, EmployeesService, ToastrService } from '@gauzy/ui-core/core';
import { Store } from '@gauzy/ui-core/core';
import { CandidateInterviewMutationComponent } from '../candidate-interview-mutation/candidate-interview-mutation.component';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "@gauzy/ui-core/core";
import * as i3 from "@ngx-translate/core";
import * as i4 from "@angular/common";
let CandidateInterviewInfoComponent = class CandidateInterviewInfoComponent extends TranslationBaseComponent {
    constructor(dialogRef, candidateInterviewersService, employeesService, candidatesService, dialogService, translateService, toastrService, candidateInterviewService, store) {
        super(translateService);
        this.dialogRef = dialogRef;
        this.candidateInterviewersService = candidateInterviewersService;
        this.employeesService = employeesService;
        this.candidatesService = candidatesService;
        this.dialogService = dialogService;
        this.translateService = translateService;
        this.toastrService = toastrService;
        this.candidateInterviewService = candidateInterviewService;
        this.store = store;
        this.interviews = [];
        this.isSlider = false;
        this.interviewerNames = [];
        this.isNextBtn = true;
        this.index = 1;
        this.isPreviousBtn = false;
        this.interviewers = [];
    }
    /**
     *
     */
    async ngOnInit() {
        this.organization = this.store.selectedOrganization;
        if (this.interviewId) {
            const { id: organizationId, tenantId } = this.organization;
            const interviews = await firstValueFrom(this.candidateInterviewService.getAll(['interviewers', 'technologies', 'personalQualities', 'feedbacks'], { organizationId, tenantId }));
            if (interviews) {
                this.interviews = interviews.items;
                this.currentInterview = this.interviews.find((item) => item.id === this.interviewId);
                const candidate = await this.candidatesService.getCandidateById(this.currentInterview.candidateId, ['user'], { organizationId, tenantId });
                if (candidate) {
                    this.selectedCandidate = candidate;
                }
            }
        }
        else {
            this.currentInterview = this.interviews[0];
        }
        this.loadData();
    }
    async edit() {
        this.currentInterview.interviewers = this.interviewers;
        const dialog = this.dialogService.open(CandidateInterviewMutationComponent, {
            context: {
                headerTitle: this.getTranslation('CANDIDATES_PAGE.EDIT_CANDIDATE.INTERVIEW.EDIT_INTERVIEW'),
                editData: this.currentInterview,
                selectedCandidate: this.selectedCandidate,
                interviewId: this.currentInterview.id,
                interviews: this.interviews
            }
        });
        const data = await firstValueFrom(dialog.onClose);
        if (data) {
            this.toastrSuccess('UPDATED');
            this.loadData();
        }
    }
    loadData() {
        this.getData(this.currentInterview.id);
        this.setTime(this.currentInterview.updatedAt);
    }
    async getData(id) {
        const { id: organizationId, tenantId } = this.organization;
        const { items } = await firstValueFrom(this.employeesService.getAll(['user'], { organizationId, tenantId }));
        const employeeList = items;
        this.interviewerNames = [];
        this.interviewers = await this.candidateInterviewersService.findByInterviewId(id);
        if (this.interviewers) {
            for (const interviewer of this.interviewers) {
                employeeList.forEach((employee) => {
                    if (interviewer.employeeId === employee.id) {
                        this.interviewerNames.push(employee.user.firstName + ' ' + employee.user.lastName);
                        this.nameList = this.interviewerNames.join(', ');
                    }
                });
            }
        }
    }
    previous() {
        --this.index;
        this.isNextBtn = true;
        const currentIndex = this.interviews.indexOf(this.currentInterview);
        const newIndex = currentIndex === 0 ? currentIndex : currentIndex - 1;
        this.currentInterview = this.interviews[newIndex];
        this.loadData();
        if (currentIndex === 1) {
            this.isPreviousBtn = false;
        }
    }
    next() {
        ++this.index;
        this.isPreviousBtn = true;
        const currentIndex = this.interviews.indexOf(this.currentInterview);
        const newIndex = currentIndex === this.interviews.length - 1 ? currentIndex : currentIndex + 1;
        this.currentInterview = this.interviews[newIndex];
        this.loadData();
        if (currentIndex === this.interviews.length - 2) {
            this.isNextBtn = false;
        }
    }
    setTime(time) {
        const now = new Date().getTime();
        const delta = (now - new Date(time).getTime()) / 1000;
        if (delta < 60) {
            this.timeUpdate = this.getTranslation('CANDIDATES_PAGE.INTERVIEW_INFO_MODAL.LESS_MINUTE');
        }
        else if (delta < 3600) {
            this.timeUpdate =
                Math.floor(delta / 60) + this.getTranslation('CANDIDATES_PAGE.INTERVIEW_INFO_MODAL.MINUTES_AGO');
        }
        else if (delta < 86400) {
            this.timeUpdate =
                Math.floor(delta / 3600) + this.getTranslation('CANDIDATES_PAGE.INTERVIEW_INFO_MODAL.HOURS_AGO');
        }
        else {
            this.timeUpdate =
                Math.floor(delta / 86400) + this.getTranslation('CANDIDATES_PAGE.INTERVIEW_INFO_MODAL.DAYS_AGO');
        }
    }
    isPastInterview(interview) {
        const now = new Date().getTime();
        if (interview && new Date(interview.startTime).getTime() > now) {
            return false;
        }
        else {
            return true;
        }
    }
    toastrSuccess(text) {
        this.toastrService.success(`TOASTR.MESSAGE.CANDIDATE_EDIT_${text}`);
    }
    closeDialog() {
        this.dialogRef.close();
    }
    ngOnDestroy() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CandidateInterviewInfoComponent, deps: [{ token: i1.NbDialogRef }, { token: i2.CandidateInterviewersService }, { token: i2.EmployeesService }, { token: i2.CandidatesService }, { token: i1.NbDialogService }, { token: i3.TranslateService }, { token: i2.ToastrService }, { token: i2.CandidateInterviewService }, { token: i2.Store }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: CandidateInterviewInfoComponent, isStandalone: false, selector: "ga-candidate-interview-info", inputs: { interviewId: "interviewId", interviews: "interviews", isSlider: "isSlider", selectedCandidate: "selectedCandidate" }, usesInheritance: true, ngImport: i0, template: "<nb-card class=\"card-wrap\">\n\t<div class=\"ml-auto mt-3 mr-3\">\n\t\t<nb-icon\n\t\t\ticon=\"edit-outline\"\n\t\t\tclass=\"mr-1\"\n\t\t\t(click)=\"edit()\"\n\t\t\t[class.icons]=\"!isPastInterview(currentInterview)\"\n\t\t\t[class.disabled]=\"isPastInterview(currentInterview)\"\n\t\t></nb-icon>\n\t\t<nb-icon icon=\"close-outline\" class=\"icons\" (click)=\"closeDialog()\"></nb-icon>\n\t</div>\n\n\t<div class=\"card\">\n\t\t@if (isSlider && interviews.length > 1) {\n\t\t<nb-icon\n\t\t\ticon=\"arrow-ios-back\"\n\t\t\tclass=\"arrow-icon\"\n\t\t\t(click)=\"previous()\"\n\t\t\t[class.show]=\"isPreviousBtn\"\n\t\t\t[class.disable]=\"!isPreviousBtn\"\n\t\t></nb-icon>\n\t\t}\n\n\t\t<div class=\"card-info\">\n\t\t\t<nb-card-header class=\"d-flex header\">\n\t\t\t\t<div>\n\t\t\t\t\t<h5>\n\t\t\t\t\t\t{{ currentInterview?.title }}\n\t\t\t\t\t</h5>\n\t\t\t\t\t<p class=\"interview-info\">\n\t\t\t\t\t\t{{ 'CANDIDATES_PAGE.INTERVIEW_INFO_MODAL.SCHEDULED' | translate }}\n\t\t\t\t\t\t{{ timeUpdate }}\n\t\t\t\t\t</p>\n\t\t\t\t</div>\n\t\t\t</nb-card-header>\n\t\t\t<nb-card-body>\n\t\t\t\t<div>\n\t\t\t\t\t<div class=\"interview-info\">\n\t\t\t\t\t\t<nb-icon icon=\"calendar-outline\" class=\"icons\"></nb-icon>\n\t\t\t\t\t\t<p class=\"interview-text\">\n\t\t\t\t\t\t\t{{ 'CANDIDATES_PAGE.INTERVIEW_INFO_MODAL.DATE' | translate }}\n\t\t\t\t\t\t</p>\n\t\t\t\t\t</div>\n\t\t\t\t\t<p class=\"interview-data\">\n\t\t\t\t\t\t{{ currentInterview?.startTime | date : 'fullDate' }}\n\t\t\t\t\t</p>\n\t\t\t\t</div>\n\t\t\t\t<div>\n\t\t\t\t\t<div class=\"interview-info\">\n\t\t\t\t\t\t<nb-icon icon=\"clock-outline\" class=\"icons\"></nb-icon>\n\t\t\t\t\t\t<p class=\"interview-text\">\n\t\t\t\t\t\t\t{{ 'CANDIDATES_PAGE.INTERVIEW_INFO_MODAL.TIME' | translate }}\n\t\t\t\t\t\t</p>\n\t\t\t\t\t</div>\n\t\t\t\t\t<p class=\"interview-data\">\n\t\t\t\t\t\t{{ currentInterview?.startTime | date : 'shortTime' }} -\n\t\t\t\t\t\t{{ currentInterview?.endTime | date : 'shortTime' }}\n\t\t\t\t\t</p>\n\t\t\t\t</div>\n\t\t\t\t<div>\n\t\t\t\t\t<div class=\"interview-info\">\n\t\t\t\t\t\t<nb-icon icon=\"person-outline\" class=\"icons\"></nb-icon>\n\t\t\t\t\t\t<p class=\"interview-text\">\n\t\t\t\t\t\t\t{{ 'CANDIDATES_PAGE.INTERVIEW_INFO_MODAL.CANDIDATE' | translate }}\n\t\t\t\t\t\t</p>\n\t\t\t\t\t</div>\n\t\t\t\t\t<p class=\"interview-data\">\n\t\t\t\t\t\t{{ selectedCandidate?.user?.firstName }}\n\t\t\t\t\t\t{{ selectedCandidate?.user?.lastName }}\n\t\t\t\t\t</p>\n\t\t\t\t</div>\n\t\t\t\t<div>\n\t\t\t\t\t<div class=\"interview-info\">\n\t\t\t\t\t\t<nb-icon icon=\"people-outline\" class=\"icons\"></nb-icon>\n\t\t\t\t\t\t<p class=\"interview-text\">\n\t\t\t\t\t\t\t{{ 'CANDIDATES_PAGE.INTERVIEW_INFO_MODAL.INTERVIEWERS' | translate }}\n\t\t\t\t\t\t</p>\n\t\t\t\t\t</div>\n\t\t\t\t\t<p class=\"interview-data\">\n\t\t\t\t\t\t{{ nameList }}\n\t\t\t\t\t</p>\n\t\t\t\t</div>\n\t\t\t\t@if (currentInterview?.location) {\n\t\t\t\t<div>\n\t\t\t\t\t<div class=\"interview-info\">\n\t\t\t\t\t\t<nb-icon icon=\"navigation-2-outline\" class=\"icons\"></nb-icon>\n\t\t\t\t\t\t<p class=\"interview-text\">\n\t\t\t\t\t\t\t{{ 'CANDIDATES_PAGE.INTERVIEW_INFO_MODAL.LOCATION' | translate }}\n\t\t\t\t\t\t</p>\n\t\t\t\t\t</div>\n\t\t\t\t\t<p class=\"interview-data\">\n\t\t\t\t\t\t{{ currentInterview?.location }}\n\t\t\t\t\t</p>\n\t\t\t\t</div>\n\t\t\t\t} @if (currentInterview?.note) {\n\t\t\t\t<div>\n\t\t\t\t\t<div class=\"interview-info\">\n\t\t\t\t\t\t<nb-icon icon=\"edit-outline\" class=\"icons\"></nb-icon>\n\t\t\t\t\t\t<p class=\"interview-text\">\n\t\t\t\t\t\t\t{{ 'CANDIDATES_PAGE.INTERVIEW_INFO_MODAL.NOTE' | translate }}\n\t\t\t\t\t\t</p>\n\t\t\t\t\t</div>\n\t\t\t\t\t<p class=\"interview-data\">{{ currentInterview?.note }}</p>\n\t\t\t\t</div>\n\t\t\t\t}\n\t\t\t</nb-card-body>\n\t\t</div>\n\n\t\t@if (isSlider && interviews.length > 1) {\n\t\t<nb-icon\n\t\t\ticon=\"arrow-ios-forward\"\n\t\t\tclass=\"arrow-icon\"\n\t\t\t(click)=\"next()\"\n\t\t\t[class.disable]=\"!isNextBtn\"\n\t\t\t[class.show]=\"isNextBtn\"\n\t\t></nb-icon>\n\t\t}\n\t</div>\n\t@if (isSlider && interviews.length > 1) {\n\t<div class=\"pages\">\n\t\t<div class=\"interview-text\">\n\t\t\t{{ index }}\n\t\t\t{{ 'CANDIDATES_PAGE.INTERVIEW_INFO_MODAL.OF' | translate }}\n\t\t\t{{ interviews.length }}\n\t\t\t{{ 'CANDIDATES_PAGE.INTERVIEW_INFO_MODAL.INTERVIEWS_LOWER_CASE' | translate }}\n\t\t</div>\n\t</div>\n\t}\n</nb-card>\n", styles: [".card-wrap{min-width:40rem}.card{display:flex;flex-direction:row;justify-content:space-between;align-items:center;padding:0 10px;border:none;background-color:var(--gauzy-card-1)}.card-info{margin:0 auto;width:34rem}.header{padding:0 5px}:host .pages{display:flex;flex-direction:row;justify-content:flex-end;align-items:center}[dir=ltr] :host .pages{padding:0 15px 10px 0}[dir=rtl] :host .pages{padding:0 0 10px 15px}.disable{pointer-events:none;color:#ededed!important}.show{pointer-events:visible;color:gray!important}.arrow-icon{font-size:24px}.arrow-icon:focus{font-size:28px}.icons{margin-right:10px;color:gray!important;pointer-events:visible}.disabled{color:#8f9bb37a!important;pointer-events:none}.interview-info{display:flex;flex-direction:row;min-width:500px}:host .interview-data{color:var(--gauzy-text-color-1)}[dir=ltr] :host .interview-data{padding-left:30px}[dir=rtl] :host .interview-data{padding-right:30px}:host .interview-data{margin-top:-15px;font-size:18px;font-weight:600}.interview-text{font-size:14px;color:gray!important}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "component", type: i1.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i1.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "component", type: i1.NbCardHeaderComponent, selector: "nb-card-header" }, { kind: "component", type: i1.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "pipe", type: i4.DatePipe, name: "date" }, { kind: "pipe", type: i3.TranslatePipe, name: "translate" }] }); }
};
CandidateInterviewInfoComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [NbDialogRef,
        CandidateInterviewersService,
        EmployeesService,
        CandidatesService,
        NbDialogService,
        TranslateService,
        ToastrService,
        CandidateInterviewService,
        Store])
], CandidateInterviewInfoComponent);
export { CandidateInterviewInfoComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CandidateInterviewInfoComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-candidate-interview-info', standalone: false, template: "<nb-card class=\"card-wrap\">\n\t<div class=\"ml-auto mt-3 mr-3\">\n\t\t<nb-icon\n\t\t\ticon=\"edit-outline\"\n\t\t\tclass=\"mr-1\"\n\t\t\t(click)=\"edit()\"\n\t\t\t[class.icons]=\"!isPastInterview(currentInterview)\"\n\t\t\t[class.disabled]=\"isPastInterview(currentInterview)\"\n\t\t></nb-icon>\n\t\t<nb-icon icon=\"close-outline\" class=\"icons\" (click)=\"closeDialog()\"></nb-icon>\n\t</div>\n\n\t<div class=\"card\">\n\t\t@if (isSlider && interviews.length > 1) {\n\t\t<nb-icon\n\t\t\ticon=\"arrow-ios-back\"\n\t\t\tclass=\"arrow-icon\"\n\t\t\t(click)=\"previous()\"\n\t\t\t[class.show]=\"isPreviousBtn\"\n\t\t\t[class.disable]=\"!isPreviousBtn\"\n\t\t></nb-icon>\n\t\t}\n\n\t\t<div class=\"card-info\">\n\t\t\t<nb-card-header class=\"d-flex header\">\n\t\t\t\t<div>\n\t\t\t\t\t<h5>\n\t\t\t\t\t\t{{ currentInterview?.title }}\n\t\t\t\t\t</h5>\n\t\t\t\t\t<p class=\"interview-info\">\n\t\t\t\t\t\t{{ 'CANDIDATES_PAGE.INTERVIEW_INFO_MODAL.SCHEDULED' | translate }}\n\t\t\t\t\t\t{{ timeUpdate }}\n\t\t\t\t\t</p>\n\t\t\t\t</div>\n\t\t\t</nb-card-header>\n\t\t\t<nb-card-body>\n\t\t\t\t<div>\n\t\t\t\t\t<div class=\"interview-info\">\n\t\t\t\t\t\t<nb-icon icon=\"calendar-outline\" class=\"icons\"></nb-icon>\n\t\t\t\t\t\t<p class=\"interview-text\">\n\t\t\t\t\t\t\t{{ 'CANDIDATES_PAGE.INTERVIEW_INFO_MODAL.DATE' | translate }}\n\t\t\t\t\t\t</p>\n\t\t\t\t\t</div>\n\t\t\t\t\t<p class=\"interview-data\">\n\t\t\t\t\t\t{{ currentInterview?.startTime | date : 'fullDate' }}\n\t\t\t\t\t</p>\n\t\t\t\t</div>\n\t\t\t\t<div>\n\t\t\t\t\t<div class=\"interview-info\">\n\t\t\t\t\t\t<nb-icon icon=\"clock-outline\" class=\"icons\"></nb-icon>\n\t\t\t\t\t\t<p class=\"interview-text\">\n\t\t\t\t\t\t\t{{ 'CANDIDATES_PAGE.INTERVIEW_INFO_MODAL.TIME' | translate }}\n\t\t\t\t\t\t</p>\n\t\t\t\t\t</div>\n\t\t\t\t\t<p class=\"interview-data\">\n\t\t\t\t\t\t{{ currentInterview?.startTime | date : 'shortTime' }} -\n\t\t\t\t\t\t{{ currentInterview?.endTime | date : 'shortTime' }}\n\t\t\t\t\t</p>\n\t\t\t\t</div>\n\t\t\t\t<div>\n\t\t\t\t\t<div class=\"interview-info\">\n\t\t\t\t\t\t<nb-icon icon=\"person-outline\" class=\"icons\"></nb-icon>\n\t\t\t\t\t\t<p class=\"interview-text\">\n\t\t\t\t\t\t\t{{ 'CANDIDATES_PAGE.INTERVIEW_INFO_MODAL.CANDIDATE' | translate }}\n\t\t\t\t\t\t</p>\n\t\t\t\t\t</div>\n\t\t\t\t\t<p class=\"interview-data\">\n\t\t\t\t\t\t{{ selectedCandidate?.user?.firstName }}\n\t\t\t\t\t\t{{ selectedCandidate?.user?.lastName }}\n\t\t\t\t\t</p>\n\t\t\t\t</div>\n\t\t\t\t<div>\n\t\t\t\t\t<div class=\"interview-info\">\n\t\t\t\t\t\t<nb-icon icon=\"people-outline\" class=\"icons\"></nb-icon>\n\t\t\t\t\t\t<p class=\"interview-text\">\n\t\t\t\t\t\t\t{{ 'CANDIDATES_PAGE.INTERVIEW_INFO_MODAL.INTERVIEWERS' | translate }}\n\t\t\t\t\t\t</p>\n\t\t\t\t\t</div>\n\t\t\t\t\t<p class=\"interview-data\">\n\t\t\t\t\t\t{{ nameList }}\n\t\t\t\t\t</p>\n\t\t\t\t</div>\n\t\t\t\t@if (currentInterview?.location) {\n\t\t\t\t<div>\n\t\t\t\t\t<div class=\"interview-info\">\n\t\t\t\t\t\t<nb-icon icon=\"navigation-2-outline\" class=\"icons\"></nb-icon>\n\t\t\t\t\t\t<p class=\"interview-text\">\n\t\t\t\t\t\t\t{{ 'CANDIDATES_PAGE.INTERVIEW_INFO_MODAL.LOCATION' | translate }}\n\t\t\t\t\t\t</p>\n\t\t\t\t\t</div>\n\t\t\t\t\t<p class=\"interview-data\">\n\t\t\t\t\t\t{{ currentInterview?.location }}\n\t\t\t\t\t</p>\n\t\t\t\t</div>\n\t\t\t\t} @if (currentInterview?.note) {\n\t\t\t\t<div>\n\t\t\t\t\t<div class=\"interview-info\">\n\t\t\t\t\t\t<nb-icon icon=\"edit-outline\" class=\"icons\"></nb-icon>\n\t\t\t\t\t\t<p class=\"interview-text\">\n\t\t\t\t\t\t\t{{ 'CANDIDATES_PAGE.INTERVIEW_INFO_MODAL.NOTE' | translate }}\n\t\t\t\t\t\t</p>\n\t\t\t\t\t</div>\n\t\t\t\t\t<p class=\"interview-data\">{{ currentInterview?.note }}</p>\n\t\t\t\t</div>\n\t\t\t\t}\n\t\t\t</nb-card-body>\n\t\t</div>\n\n\t\t@if (isSlider && interviews.length > 1) {\n\t\t<nb-icon\n\t\t\ticon=\"arrow-ios-forward\"\n\t\t\tclass=\"arrow-icon\"\n\t\t\t(click)=\"next()\"\n\t\t\t[class.disable]=\"!isNextBtn\"\n\t\t\t[class.show]=\"isNextBtn\"\n\t\t></nb-icon>\n\t\t}\n\t</div>\n\t@if (isSlider && interviews.length > 1) {\n\t<div class=\"pages\">\n\t\t<div class=\"interview-text\">\n\t\t\t{{ index }}\n\t\t\t{{ 'CANDIDATES_PAGE.INTERVIEW_INFO_MODAL.OF' | translate }}\n\t\t\t{{ interviews.length }}\n\t\t\t{{ 'CANDIDATES_PAGE.INTERVIEW_INFO_MODAL.INTERVIEWS_LOWER_CASE' | translate }}\n\t\t</div>\n\t</div>\n\t}\n</nb-card>\n", styles: [".card-wrap{min-width:40rem}.card{display:flex;flex-direction:row;justify-content:space-between;align-items:center;padding:0 10px;border:none;background-color:var(--gauzy-card-1)}.card-info{margin:0 auto;width:34rem}.header{padding:0 5px}:host .pages{display:flex;flex-direction:row;justify-content:flex-end;align-items:center}[dir=ltr] :host .pages{padding:0 15px 10px 0}[dir=rtl] :host .pages{padding:0 0 10px 15px}.disable{pointer-events:none;color:#ededed!important}.show{pointer-events:visible;color:gray!important}.arrow-icon{font-size:24px}.arrow-icon:focus{font-size:28px}.icons{margin-right:10px;color:gray!important;pointer-events:visible}.disabled{color:#8f9bb37a!important;pointer-events:none}.interview-info{display:flex;flex-direction:row;min-width:500px}:host .interview-data{color:var(--gauzy-text-color-1)}[dir=ltr] :host .interview-data{padding-left:30px}[dir=rtl] :host .interview-data{padding-right:30px}:host .interview-data{margin-top:-15px;font-size:18px;font-weight:600}.interview-text{font-size:14px;color:gray!important}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [{ type: i1.NbDialogRef }, { type: i2.CandidateInterviewersService }, { type: i2.EmployeesService }, { type: i2.CandidatesService }, { type: i1.NbDialogService }, { type: i3.TranslateService }, { type: i2.ToastrService }, { type: i2.CandidateInterviewService }, { type: i2.Store }], propDecorators: { interviewId: [{
                type: Input
            }], interviews: [{
                type: Input
            }], isSlider: [{
                type: Input
            }], selectedCandidate: [{
                type: Input
            }] } });
//# sourceMappingURL=candidate-interview-info.component.js.map