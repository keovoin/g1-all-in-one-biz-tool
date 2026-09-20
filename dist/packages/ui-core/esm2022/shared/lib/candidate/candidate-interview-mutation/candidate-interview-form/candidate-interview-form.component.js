import { __decorate, __metadata } from "tslib";
import { Component, ChangeDetectorRef, Input, Output, EventEmitter } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { filter, tap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import moment from 'moment';
import { EmployeesService } from '@gauzy/ui-core/core';
import { NbDialogService } from '@nebular/theme';
import { CandidateCalendarInfoComponent } from '../../candidate-calendar-info/candidate-calendar-info.component';
import { firstValueFrom } from 'rxjs';
import { Store } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
import * as i2 from "@nebular/theme";
import * as i3 from "@gauzy/ui-core/core";
import * as i4 from "../../../timer-picker/timer-range-picker/timer-range-picker.component";
import * as i5 from "../../../employee/employee-multi-select/employee-multi-select.component";
import * as i6 from "@ngx-translate/core";
let CandidateInterviewFormComponent = class CandidateInterviewFormComponent {
    get interviews() {
        return this._interviews;
    }
    set interviews(value) {
        this._interviews = value;
    }
    constructor(fb, dialogService, employeeService, cdRef, store) {
        this.fb = fb;
        this.dialogService = dialogService;
        this.employeeService = employeeService;
        this.cdRef = cdRef;
        this.store = store;
        this.titleExist = new EventEmitter();
        /*
         * Getter & Setter for interviews
         */
        this._interviews = [];
        this.yesterday = moment().subtract(1, 'days').toDate();
        this.employees = [];
        this.employeeIds = [];
        this.interviewNames = [];
        this.selectedEmployeeIds = null;
        this.selectedRange = { start: null, end: null };
    }
    ngOnInit() {
        this.store.selectedOrganization$
            .pipe(filter((organization) => !!organization), tap((organization) => (this.organization = organization)), tap(() => this.loadEmployees()), tap(() => this.loadInterviewNames()), untilDestroyed(this))
            .subscribe();
        this.loadFormData();
        //if editing
        if (this.editData) {
            this.employeeIds = this.editData.interviewers
                ? this.editData.interviewers.map((item) => item.employeeId)
                : [];
        }
    }
    ngAfterViewInit() {
        this.form.get('title').valueChanges.subscribe((title) => {
            for (let i = 0; i < this.interviewNames.length; i++) {
                if (this.interviewNames[i] === title.toLocaleLowerCase()) {
                    if (this.editData && this.editData.title === this.form.get('title').value) {
                        this.isTitleExisted = false;
                        this.titleExist.emit(false);
                        break;
                    }
                    this.isTitleExisted = true;
                    this.titleExist.emit(true);
                    break;
                }
                else {
                    this.isTitleExisted = false;
                    this.titleExist.emit(false);
                }
            }
        });
    }
    async loadEmployees() {
        const { tenantId } = this.store.user;
        const { id: organizationId } = this.organization;
        this.employeeService
            .getAll(['user'], { organizationId, tenantId })
            .pipe(tap(({ items }) => (this.employees = items)), untilDestroyed(this))
            .subscribe();
    }
    loadInterviewNames() {
        this.interviewNames = [];
        this.interviews.forEach((interview) => {
            this.interviewNames.push(interview.title.toLocaleLowerCase());
        });
    }
    async findTime() {
        const dialog = this.dialogService.open(CandidateCalendarInfoComponent);
        const data = await firstValueFrom(dialog.onClose);
        if (data) {
            this.selectedRange = { start: data.startTime, end: data.endTime };
        }
    }
    onMembersSelected(event) {
        this.selectedEmployeeIds = event;
        const value = this.selectedEmployeeIds[0] ? true : null;
        this.form.patchValue({
            valid: value
        });
    }
    loadFormData() {
        this.form = this.fb.group({
            title: ['', Validators.required],
            startTime: [this.selectedRange.start],
            interviewers: [this.selectedEmployeeIds],
            endTime: [this.selectedRange.end],
            location: [''],
            note: [''],
            valid: [null, Validators.required]
        });
    }
    detectChanges(value) {
        if (value) {
            this.form.controls['location'].setValidators(Validators.required);
            this.cdRef.detectChanges();
        }
        else {
            this.form.controls['location'].clearValidators();
            this.form.patchValue({ location: '' });
        }
    }
    ngOnDestroy() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CandidateInterviewFormComponent, deps: [{ token: i1.UntypedFormBuilder }, { token: i2.NbDialogService }, { token: i3.EmployeesService }, { token: i0.ChangeDetectorRef }, { token: i3.Store }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: CandidateInterviewFormComponent, isStandalone: false, selector: "ga-candidate-interview-form", inputs: { editData: "editData", isCalendar: "isCalendar", interviews: "interviews" }, outputs: { titleExist: "titleExist" }, ngImport: i0, template: "<form class=\"form\" [formGroup]=\"form\">\n\t<div class=\"form-group title-wrap\">\n\t\t<div [class.title-width]=\"isCalendar\" [class.title-width-small]=\"!isCalendar\" class=\"name-valid-parent\">\n\t\t\t<label for=\"inputTitle\" class=\"label\">{{ 'FORM.LABELS.TITLE' | translate }}</label>\n\t\t\t<input\n\t\t\t\tnbInput\n\t\t\t\ttype=\"text\"\n\t\t\t\tid=\"inputTitle\"\n\t\t\t\t[class.title-width]=\"!isCalendar\"\n\t\t\t\t[class.title-width-small]=\"isCalendar\"\n\t\t\t\tfullWidth\n\t\t\t\tplaceholder=\"{{ 'FORM.PLACEHOLDERS.ADD_INTERVIEW.TITLE' | translate }}\"\n\t\t\t\tformControlName=\"title\"\n\t\t\t/>\n\t\t\t@if (isTitleExisted) {\n\t\t\t<div class=\"name-valid\">\n\t\t\t\t{{ 'CANDIDATES_PAGE.EDIT_CANDIDATE.INTERVIEW.INTERVIEW_TITLE_EXIST' | translate }}\n\t\t\t</div>\n\t\t\t}\n\t\t</div>\n\t\t@if (!isCalendar) {\n\t\t<button status=\"success\" class=\"button\" nbButton nbStepperSave (click)=\"findTime()\">\n\t\t\t{{ 'BUTTONS.FIND_TIME' | translate }}\n\t\t</button>\n\t\t}\n\t</div>\n\n\t<ngx-timer-range-picker\n\t\tname=\"selectedRange\"\n\t\t[minDate]=\"yesterday\"\n\t\t[ngModelOptions]=\"{ standalone: true }\"\n\t\t[(ngModel)]=\"selectedRange\"\n\t>\n\t</ngx-timer-range-picker>\n\t<div class=\"form-group\">\n\t\t<ga-employee-multi-select\n\t\t\t[allEmployees]=\"employees\"\n\t\t\t(selectedChange)=\"onMembersSelected($event)\"\n\t\t\t[selectedEmployeeIds]=\"employeeIds\"\n\t\t>\n\t\t</ga-employee-multi-select>\n\t</div>\n\t<div class=\"form-group checkbox-wrap\">\n\t\t<label class=\"label radio-label\">\n\t\t\t{{ 'FORM.PLACEHOLDERS.ADD_INTERVIEW.TYPE' | translate }}\n\t\t</label>\n\t\t<nb-radio-group\n\t\t\t[(ngModel)]=\"isMeeting\"\n\t\t\t(ngModelChange)=\"detectChanges($event)\"\n\t\t\t[ngModelOptions]=\"{ standalone: true }\"\n\t\t\tclass=\"radio-group\"\n\t\t>\n\t\t\t<nb-radio [value]=\"false\" [checked]=\"true\">{{\n\t\t\t\t'FORM.PLACEHOLDERS.ADD_INTERVIEW.CALL' | translate\n\t\t\t}}</nb-radio>\n\t\t\t<nb-radio [value]=\"true\">{{ 'FORM.PLACEHOLDERS.ADD_INTERVIEW.MEETING' | translate }}</nb-radio>\n\t\t</nb-radio-group>\n\t\t@if (isMeeting) {\n\t\t<div class=\"location\">\n\t\t\t<label for=\"location\" class=\"label\">{{ 'FORM.LABELS.LOCATION' | translate }}</label>\n\t\t\t<input\n\t\t\t\tfullWidth\n\t\t\t\tid=\"location\"\n\t\t\t\ttype=\"text\"\n\t\t\t\tnbInput\n\t\t\t\tformControlName=\"location\"\n\t\t\t\tplaceholder=\"{{ 'FORM.PLACEHOLDERS.ADD_INTERVIEW.LOCATION' | translate }}\"\n\t\t\t/>\n\t\t</div>\n\t\t}\n\t</div>\n\n\t<div class=\"form-group\">\n\t\t<label for=\"note\" class=\"label\">{{ 'FORM.LABELS.NOTE' | translate }}</label>\n\t\t<input\n\t\t\tfullWidth\n\t\t\tid=\"note\"\n\t\t\ttype=\"text\"\n\t\t\tnbInput\n\t\t\tformControlName=\"note\"\n\t\t\tplaceholder=\"{{ 'FORM.PLACEHOLDERS.ADD_INTERVIEW.NOTE' | translate }}\"\n\t\t/>\n\t</div>\n</form>\n", styles: [".form{width:35rem}.radio-label{margin-bottom:0;display:block}.checkbox{margin:0 10px}.checkbox-wrap{display:flex;flex-direction:row;justify-content:flex-start;align-items:center;min-height:68px;margin-bottom:0}:host .radio-group{display:flex;flex-direction:row;align-items:center;justify-content:space-around}[dir=ltr] :host .radio-group{margin-left:1rem}[dir=rtl] :host .radio-group{margin-right:1rem}.location{width:278px}.title-wrap{flex-direction:row;display:flex;justify-content:space-between;align-items:flex-end}.input-title,.title-width-small{width:78%}.title-width{width:100%}.button{height:40px}.name-valid-parent{position:relative;display:flex;flex-direction:column}.name-valid-parent .name-valid{position:absolute;bottom:-1.25rem;left:0;font-size:11px;color:#ff3d71}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "directive", type: i1.ɵNgNoValidate, selector: "form:not([ngNoForm]):not([ngNativeValidate])" }, { kind: "directive", type: i1.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i1.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i1.NgControlStatusGroup, selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],[formArray],form:not([ngNoForm]),[ngForm]" }, { kind: "directive", type: i1.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "directive", type: i1.FormGroupDirective, selector: "[formGroup]", inputs: ["formGroup"], outputs: ["ngSubmit"], exportAs: ["ngForm"] }, { kind: "directive", type: i1.FormControlName, selector: "[formControlName]", inputs: ["formControlName", "disabled", "ngModel"], outputs: ["ngModelChange"] }, { kind: "directive", type: i2.NbInputDirective, selector: "input[nbInput],textarea[nbInput]", inputs: ["fieldSize", "status", "shape", "fullWidth"] }, { kind: "component", type: i2.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "component", type: i2.NbRadioComponent, selector: "nb-radio", inputs: ["name", "checked", "value", "disabled", "status"], outputs: ["valueChange", "blur"] }, { kind: "component", type: i2.NbRadioGroupComponent, selector: "nb-radio-group", inputs: ["value", "name", "disabled", "status"], outputs: ["valueChange"] }, { kind: "component", type: i4.TimerRangePickerComponent, selector: "ngx-timer-range-picker", inputs: ["slotStartTime", "slotEndTime", "allowedDuration", "disableEndPicker", "disableDatePicker", "fromEmployeeAppointment", "timezoneOffset", "maxDate", "minDate", "disabledDates"] }, { kind: "component", type: i5.EmployeeSelectComponent, selector: "ga-employee-multi-select", inputs: ["reset", "allEmployees", "selectedEmployeeIds", "multiple", "label", "disabled", "placeholder"], outputs: ["selectedChange", "onLoadEmployees"] }, { kind: "pipe", type: i6.TranslatePipe, name: "translate" }] }); }
};
CandidateInterviewFormComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [UntypedFormBuilder,
        NbDialogService,
        EmployeesService,
        ChangeDetectorRef,
        Store])
], CandidateInterviewFormComponent);
export { CandidateInterviewFormComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CandidateInterviewFormComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-candidate-interview-form', standalone: false, template: "<form class=\"form\" [formGroup]=\"form\">\n\t<div class=\"form-group title-wrap\">\n\t\t<div [class.title-width]=\"isCalendar\" [class.title-width-small]=\"!isCalendar\" class=\"name-valid-parent\">\n\t\t\t<label for=\"inputTitle\" class=\"label\">{{ 'FORM.LABELS.TITLE' | translate }}</label>\n\t\t\t<input\n\t\t\t\tnbInput\n\t\t\t\ttype=\"text\"\n\t\t\t\tid=\"inputTitle\"\n\t\t\t\t[class.title-width]=\"!isCalendar\"\n\t\t\t\t[class.title-width-small]=\"isCalendar\"\n\t\t\t\tfullWidth\n\t\t\t\tplaceholder=\"{{ 'FORM.PLACEHOLDERS.ADD_INTERVIEW.TITLE' | translate }}\"\n\t\t\t\tformControlName=\"title\"\n\t\t\t/>\n\t\t\t@if (isTitleExisted) {\n\t\t\t<div class=\"name-valid\">\n\t\t\t\t{{ 'CANDIDATES_PAGE.EDIT_CANDIDATE.INTERVIEW.INTERVIEW_TITLE_EXIST' | translate }}\n\t\t\t</div>\n\t\t\t}\n\t\t</div>\n\t\t@if (!isCalendar) {\n\t\t<button status=\"success\" class=\"button\" nbButton nbStepperSave (click)=\"findTime()\">\n\t\t\t{{ 'BUTTONS.FIND_TIME' | translate }}\n\t\t</button>\n\t\t}\n\t</div>\n\n\t<ngx-timer-range-picker\n\t\tname=\"selectedRange\"\n\t\t[minDate]=\"yesterday\"\n\t\t[ngModelOptions]=\"{ standalone: true }\"\n\t\t[(ngModel)]=\"selectedRange\"\n\t>\n\t</ngx-timer-range-picker>\n\t<div class=\"form-group\">\n\t\t<ga-employee-multi-select\n\t\t\t[allEmployees]=\"employees\"\n\t\t\t(selectedChange)=\"onMembersSelected($event)\"\n\t\t\t[selectedEmployeeIds]=\"employeeIds\"\n\t\t>\n\t\t</ga-employee-multi-select>\n\t</div>\n\t<div class=\"form-group checkbox-wrap\">\n\t\t<label class=\"label radio-label\">\n\t\t\t{{ 'FORM.PLACEHOLDERS.ADD_INTERVIEW.TYPE' | translate }}\n\t\t</label>\n\t\t<nb-radio-group\n\t\t\t[(ngModel)]=\"isMeeting\"\n\t\t\t(ngModelChange)=\"detectChanges($event)\"\n\t\t\t[ngModelOptions]=\"{ standalone: true }\"\n\t\t\tclass=\"radio-group\"\n\t\t>\n\t\t\t<nb-radio [value]=\"false\" [checked]=\"true\">{{\n\t\t\t\t'FORM.PLACEHOLDERS.ADD_INTERVIEW.CALL' | translate\n\t\t\t}}</nb-radio>\n\t\t\t<nb-radio [value]=\"true\">{{ 'FORM.PLACEHOLDERS.ADD_INTERVIEW.MEETING' | translate }}</nb-radio>\n\t\t</nb-radio-group>\n\t\t@if (isMeeting) {\n\t\t<div class=\"location\">\n\t\t\t<label for=\"location\" class=\"label\">{{ 'FORM.LABELS.LOCATION' | translate }}</label>\n\t\t\t<input\n\t\t\t\tfullWidth\n\t\t\t\tid=\"location\"\n\t\t\t\ttype=\"text\"\n\t\t\t\tnbInput\n\t\t\t\tformControlName=\"location\"\n\t\t\t\tplaceholder=\"{{ 'FORM.PLACEHOLDERS.ADD_INTERVIEW.LOCATION' | translate }}\"\n\t\t\t/>\n\t\t</div>\n\t\t}\n\t</div>\n\n\t<div class=\"form-group\">\n\t\t<label for=\"note\" class=\"label\">{{ 'FORM.LABELS.NOTE' | translate }}</label>\n\t\t<input\n\t\t\tfullWidth\n\t\t\tid=\"note\"\n\t\t\ttype=\"text\"\n\t\t\tnbInput\n\t\t\tformControlName=\"note\"\n\t\t\tplaceholder=\"{{ 'FORM.PLACEHOLDERS.ADD_INTERVIEW.NOTE' | translate }}\"\n\t\t/>\n\t</div>\n</form>\n", styles: [".form{width:35rem}.radio-label{margin-bottom:0;display:block}.checkbox{margin:0 10px}.checkbox-wrap{display:flex;flex-direction:row;justify-content:flex-start;align-items:center;min-height:68px;margin-bottom:0}:host .radio-group{display:flex;flex-direction:row;align-items:center;justify-content:space-around}[dir=ltr] :host .radio-group{margin-left:1rem}[dir=rtl] :host .radio-group{margin-right:1rem}.location{width:278px}.title-wrap{flex-direction:row;display:flex;justify-content:space-between;align-items:flex-end}.input-title,.title-width-small{width:78%}.title-width{width:100%}.button{height:40px}.name-valid-parent{position:relative;display:flex;flex-direction:column}.name-valid-parent .name-valid{position:absolute;bottom:-1.25rem;left:0;font-size:11px;color:#ff3d71}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [{ type: i1.UntypedFormBuilder }, { type: i2.NbDialogService }, { type: i3.EmployeesService }, { type: i0.ChangeDetectorRef }, { type: i3.Store }], propDecorators: { editData: [{
                type: Input
            }], isCalendar: [{
                type: Input
            }], titleExist: [{
                type: Output
            }], interviews: [{
                type: Input
            }] } });
//# sourceMappingURL=candidate-interview-form.component.js.map