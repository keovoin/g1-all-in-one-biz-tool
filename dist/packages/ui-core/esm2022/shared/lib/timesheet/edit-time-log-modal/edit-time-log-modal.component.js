var EditTimeLogModalComponent_1;
import { __decorate, __metadata } from "tslib";
import { Component, Input, ChangeDetectorRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { combineLatest, debounceTime, filter, Subject, tap } from 'rxjs';
import moment from 'moment';
import { omit } from 'underscore';
import { PermissionsEnum, TimeLogType, TimeLogSourceEnum } from '@gauzy/contracts';
import { toUTC, toLocal, distinctUntilChange } from '@gauzy/ui-core/common';
import { Store, TimesheetService, ToastrService } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
import * as i2 from "@nebular/theme";
import * as i3 from "@gauzy/ui-core/core";
import * as i4 from "ngx-permissions";
import * as i5 from "../../components/avatar/avatar.component";
import * as i6 from "../../directives/time-tracking-authorized-directive";
import * as i7 from "../../dialogs/directive/confirm.directive";
import * as i8 from "../../timer-picker/timer-range-picker/timer-range-picker.component";
import * as i9 from "../../tasks/task-select/task/task.component";
import * as i10 from "../../selectors/project/project/project.component";
import * as i11 from "../../selectors/team/team/team.component";
import * as i12 from "../../employee/employee-multi-select/employee-multi-select.component";
import * as i13 from "../../contact-selector/contact-selector.component";
import * as i14 from "@ngx-translate/core";
import * as i15 from "../../pipes/duration-format.pipe";
let EditTimeLogModalComponent = class EditTimeLogModalComponent {
    static { EditTimeLogModalComponent_1 = this; }
    set timeLog(value) {
        this._timeLog = { ...value }; // Shallow copy to avoid mutation
        this.mode = this._timeLog?.id ? 'update' : 'create';
    }
    get timeLog() {
        return this._timeLog;
    }
    static buildForm(fb, self) {
        return fb.group({
            isBillable: [true],
            employeeId: [],
            projectId: [],
            organizationContactId: [],
            organizationTeamId: [],
            taskId: [],
            description: [],
            reason: [],
            selectedRange: [self.selectedRange]
        });
    }
    constructor(_fb, _cdr, _dialogRef, _store, _timesheetService, _toastrService) {
        this._fb = _fb;
        this._cdr = _cdr;
        this._dialogRef = _dialogRef;
        this._store = _store;
        this._timesheetService = _timesheetService;
        this._toastrService = _toastrService;
        // Permissions and basic state initialization
        this.PermissionsEnum = PermissionsEnum;
        this.today = new Date();
        this.mode = 'create';
        this.loading = false;
        this.overlaps = [];
        // Date range and time-related properties
        this.selectedRange = { start: null, end: null };
        this.timeDiff = null;
        this.futureDateAllowed = false;
        this.subject$ = new Subject();
        // Additional properties
        this.reasons = ['Worked offline', 'Internet issue', 'Forgot to track', 'Usability issue', 'App issue'];
        this.selectedReason = '';
        // Time log state management
        this._timeLog = {};
        /*
         * TimeLog Mutation Form
         */
        this.form = EditTimeLogModalComponent_1.buildForm(this._fb, this);
        const minutes = moment().get('minutes');
        const roundTime = moment().subtract(minutes - (minutes % 10));
        this.selectedRange = {
            end: roundTime.toDate(),
            start: roundTime.subtract(1, 'hour').toDate()
        };
    }
    ngOnInit() {
        // Subscribe to subject for overlap checks
        this.subject$
            .pipe(debounceTime(500), tap(() => this.checkOverlaps()), untilDestroyed(this))
            .subscribe();
        // Subscribe to selected organization
        this._store.selectedOrganization$
            .pipe(filter((organization) => !!organization), tap((organization) => {
            this.organization = organization;
            this.futureDateAllowed = organization.futureDateAllowed;
        }), untilDestroyed(this))
            .subscribe();
        const employeeId$ = this.form.get('employeeId').valueChanges;
        const selectedRange$ = this.form.get('selectedRange').valueChanges;
        // Combine employeeId and selectedRange value changes
        combineLatest([employeeId$, selectedRange$])
            .pipe(debounceTime(300), distinctUntilChange(), filter(([employeeId, selectedRange]) => !!employeeId && !!selectedRange), tap(([employeeId, selectedRange]) => {
            this.employee = employeeId;
            this.selectedRange = selectedRange;
            const { start, end } = selectedRange;
            const startMoment = moment(start);
            const endMoment = moment(end);
            if (startMoment.isValid() && endMoment.isValid()) {
                this.timeDiff = new Date(endMoment.diff(startMoment, 'seconds'));
            }
            else {
                this.timeDiff = null;
            }
            // Notify subject about changes
            this.subject$.next(true);
        }), untilDestroyed(this))
            .subscribe();
    }
    ngAfterViewInit() {
        if (!this._timeLog) {
            return;
        }
        // Initialize form with the time log values
        this.populateFormWithTimeLog(this._timeLog);
    }
    /**
     * Populates the form with time log data.
     *
     * @param {ITimeLog} timeLog - The time log object containing data to set in the form.
     * @returns {void}
     */
    populateFormWithTimeLog(timeLog) {
        this.form.setValue({
            isBillable: timeLog.isBillable ?? true,
            employeeId: timeLog.employeeId ?? this._store.selectedEmployee.id,
            projectId: timeLog.projectId ?? null,
            organizationContactId: timeLog.organizationContactId ?? null,
            organizationTeamId: timeLog.organizationTeamId ?? null,
            taskId: timeLog.taskId ?? null,
            description: timeLog.description ?? null,
            reason: timeLog.reason ?? null,
            selectedRange: {
                start: timeLog.startedAt,
                end: timeLog.stoppedAt
            }
        });
        // Trigger manual change detection
        this._cdr.detectChanges();
    }
    /**
     * Closes the dialog or modal window.
     *
     * - Closes the currently active dialog by passing a `null` result to indicate
     *   that no action or result needs to be returned.
     *
     * @returns {void}
     */
    close() {
        this._dialogRef.close(null);
    }
    /**
     * Checks for overlapping time logs for a selected employee and time range.
     *
     * - Retrieves the form data and organization details, then sends a request to check for overlaps.
     * - Calculates the overlap duration between time logs and maps the result.
     * - Displays any errors using the toastr service.
     *
     * @returns {Promise<void>} - Resolves when the overlaps are checked.
     */
    async checkOverlaps() {
        // Ensure the organization is available
        if (!this.organization) {
            return;
        }
        // Extract necessary values from form and store
        const { employeeId } = this.form.value;
        const { id: organizationId, tenantId } = this.organization;
        // Proceed only if a time range and employee ID are selected
        if (this.selectedRange && employeeId) {
            const { start, end } = this.selectedRange;
            const startDate = toUTC(start).toISOString();
            const endDate = toUTC(end).toISOString();
            // Exit if either start or end date is missing
            if (!startDate || !endDate) {
                return;
            }
            // Build the request payload
            const request = {
                ...(this.timeLog.id ? { ignoreId: [this.timeLog.id] } : {}),
                startDate,
                endDate,
                employeeId,
                tenantId,
                organizationId,
                relations: ['project', 'task']
            };
            try {
                // Call the service to check for overlapping time logs
                const timeLogs = await this._timesheetService.checkOverlaps(request);
                // If no overlaps found, return early
                if (!timeLogs) {
                    return;
                }
                // Calculate overlap duration and map the results
                this.overlaps = timeLogs.map((timeLog) => {
                    const timeLogStartedAt = toLocal(timeLog.startedAt);
                    const timeLogStoppedAt = toLocal(timeLog.stoppedAt);
                    // Calculate overlap duration
                    let overlapDuration = this.calculateOverlapDuration(timeLogStartedAt.toDate(), timeLogStoppedAt.toDate(), startDate, endDate);
                    // Assign overlap duration to timeLog
                    timeLog['overlapDuration'] = overlapDuration;
                    return timeLog;
                });
            }
            catch (error) {
                console.error('Error while checking overlapping time log entries for employee', error);
                this._toastrService.danger('Error checking overlapping time logs');
            }
        }
    }
    /**
     * Calculates the overlap duration between two date ranges.
     *
     * @param {Date} timeLogStart - Start date of the existing time log.
     * @param {Date} timeLogEnd - End date of the existing time log.
     * @param {string} selectedStart - Start date of the selected range.
     * @param {string} selectedEnd - End date of the selected range.
     * @returns {number} - Duration of the overlap in seconds.
     */
    calculateOverlapDuration(timeLogStart, timeLogEnd, selectedStart, selectedEnd) {
        const selectedStartMoment = moment(selectedStart);
        const selectedEndMoment = moment(selectedEnd);
        const timeLogStartMoment = moment(timeLogStart);
        const timeLogEndMoment = moment(timeLogEnd);
        // Calculate the overlap based on time boundaries
        if (timeLogStartMoment.isBetween(selectedStartMoment, selectedEndMoment)) {
            if (timeLogEndMoment.isBetween(selectedStartMoment, selectedEndMoment)) {
                return timeLogEndMoment.diff(timeLogStartMoment, 'seconds');
            }
            else {
                return selectedEndMoment.diff(timeLogStartMoment, 'seconds');
            }
        }
        else if (timeLogEndMoment.isBetween(selectedStartMoment, selectedEndMoment)) {
            return timeLogEndMoment.diff(selectedStartMoment, 'seconds');
        }
        else {
            return selectedEndMoment.diff(selectedStartMoment, 'seconds');
        }
    }
    /**
     * Adds or updates a time log based on the current mode ('create' or 'update').
     *
     * - Validates the form, constructs the payload with the necessary details, and
     *   interacts with the timesheet service to add or update the time log.
     * - Resets the form and displays appropriate success or error messages.
     *
     * @returns {Promise<void>} - Resolves after the time log is added or updated.
     */
    async addTime() {
        if (this.form.invalid) {
            return;
        }
        try {
            this.loading = true;
            // Extract necessary data from the store and the form
            const { employee } = this._store.user;
            const { id: organizationId, tenantId } = this.organization;
            const { start, end } = this.selectedRange;
            const startedAt = toUTC(start).toDate();
            const stoppedAt = toUTC(end).toDate();
            // Construct the payload for time log
            const payload = {
                ...omit(this.form.value, ['selectedRange']),
                startedAt,
                stoppedAt,
                organizationId,
                tenantId,
                logType: TimeLogType.MANUAL,
                source: TimeLogSourceEnum.WEB_TIMER,
                employeeId: this.form.value.employeeId || employee?.id // Fallback to current employee ID
            };
            // Create or update the time log based on the mode
            const timeLog = this.mode === 'create'
                ? await this._timesheetService.addTime(payload)
                : await this._timesheetService.updateTime(this.timeLog.id, payload);
            // Close the dialog and reset the form
            this._dialogRef.close(timeLog);
            this.form.reset();
            this.selectedRange = { start: null, end: null };
            // Show success notification
            this._toastrService.success('TIMER_TRACKER.ADD_TIME_SUCCESS');
        }
        catch (error) {
            // Handle errors and show error notification
            this._toastrService.error('Error: Unable to add time');
        }
        finally {
            // Reset the loading state
            this.loading = false;
        }
    }
    /**
     * Confirms and deletes a time log if it is not currently running.
     *
     * @param timeLog - The time log object that needs to be deleted.
     * @returns void - Exits early if the time log is still running.
     */
    async onDeleteConfirm(timeLog) {
        // Exit early if the user lacks delete permission or if the time log is running.
        if (!this._store.hasPermission(PermissionsEnum.ALLOW_DELETE_TIME) || timeLog.isRunning) {
            return;
        }
        // Extract employee from the time log and organization details.
        const employee = timeLog.employee;
        const { id: organizationId, name } = this.organization;
        // Prepare the request object for deleting logs.
        const request = {
            logIds: [timeLog.id],
            organizationId
        };
        try {
            // Await the service call to delete logs.
            const res = await this._timesheetService.deleteLogs(request);
            // Show a success message with employee name and organization.
            this._toastrService.success('TOASTR.MESSAGE.TIME_LOG_DELETED', {
                name: employee.fullName,
                organization: name
            });
            // Close the dialog after successful deletion.
            this._dialogRef.close(res);
        }
        catch (error) {
            // Optionally handle any errors (e.g., show an error message).
            console.error('Error deleting time log:', error);
            this._toastrService.error('TOASTR.MESSAGE.ERROR_DELETING_TIME_LOG');
        }
    }
    /**
     * Retrieves the value of a form control by its name.
     *
     * @param control - The name of the form control whose value is to be retrieved.
     * @returns string - The value of the form control. If the control is not found or the value is null, an empty string is returned.
     */
    getControlValue(control) {
        // Retrieve the form control using the given control name.
        const formControl = this.form.get(control);
        // If the control exists, return its value. Otherwise, return an empty string.
        return formControl ? formControl.value : '';
    }
    ngOnDestroy() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EditTimeLogModalComponent, deps: [{ token: i1.FormBuilder }, { token: i0.ChangeDetectorRef }, { token: i2.NbDialogRef }, { token: i3.Store }, { token: i3.TimesheetService }, { token: i3.ToastrService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: EditTimeLogModalComponent, isStandalone: false, selector: "ngx-edit-time-log-modal", inputs: { timeLog: "timeLog" }, ngImport: i0, template: "@if (form) {\n  <form #f=\"ngForm\" [formGroup]=\"form\" (submit)=\"addTime()\">\n    <nb-card>\n      <nb-card-header class=\"header\">\n        <div class=\"title\">\n          {{ (mode == 'update' ? 'TIMESHEET.EDIT_TIME_LOGS' : 'TIMESHEET.ADD_TIME_LOGS') | translate }}\n        </div>\n        <span class=\"cancel\"> <i class=\"fas fa-times\" (click)=\"close()\"></i></span>\n      </nb-card-header>\n      <nb-card-body>\n        <!-- One 4-column grid for the whole form, so every field starts and ends on\n             a shared line: quarters for the time row, halves for the selector pairs,\n             the full width for the free-text fields. -->\n        <div class=\"time-log-grid\">\n          <div class=\"field span-2\" *ngxPermissionsOnly=\"[PermissionsEnum.CHANGE_SELECTED_EMPLOYEE]\">\n            @if (mode == 'update') {\n              <div class=\"description\">\n                <ngx-avatar\n                  [id]=\"timeLog?.employee?.id\"\n                  [employee]=\"timeLog?.employee\"\n                  [name]=\"timeLog?.employee?.user?.name\"\n                  [src]=\"timeLog?.employee?.user?.imageUrl\"\n                  class=\"report-table\"\n                ></ngx-avatar>\n              </div>\n            } @else {\n              <ga-employee-multi-select\n                name=\"employeeId\"\n                [multiple]=\"false\"\n                label=\"TIMESHEET.SELECT_EMPLOYEE\"\n                [placeholder]=\"'TIMESHEET.SELECT_EMPLOYEE' | translate\"\n                formControlName=\"employeeId\"\n                required\n                >\n              </ga-employee-multi-select>\n              @if (form.get('employeeId')?.invalid && f.submitted) {\n                <div class=\"invalid-feedback d-block\">\n                  @if (form.get('employeeId')?.errors.required) {\n                    <div>\n                      {{ 'TIMESHEET.VALIDATION.EMPLOYEE' | translate }}\n                    </div>\n                  }\n                </div>\n              }\n            }\n          </div>\n          <!-- Date, Start Time and End Time: the picker lays its three fields out on\n               the first three columns (see the stylesheet). -->\n          <ngx-timer-range-picker\n            class=\"span-3\"\n            name=\"selectedRange\"\n            [maxDate]=\"futureDateAllowed ? null : today\"\n            formControlName=\"selectedRange\"\n            >\n          </ngx-timer-range-picker>\n          <div class=\"field period\">\n            @if (timeDiff) {\n              <label>{{ 'FORM.LABELS.PERIOD' | translate }}</label>\n              <div class=\"period-value\">{{ timeDiff | durationFormat }}</div>\n            }\n          </div>\n          @if (overlaps.length > 0) {\n            <nb-card class=\"span-4 custom-card\" status=\"danger\">\n              <nb-card-header>\n                <div class=\"d-flex align-items-center\">\n                  <nb-icon icon=\"alert-triangle-outline\" class=\"mr-3\"></nb-icon>\n                  {{ 'TIMESHEET.TIME_OVERLAPS' | translate }}\n                </div>\n              </nb-card-header>\n              <nb-card-body class=\"custom-card-body\">\n                <p>{{ 'TIMESHEET.OVERLAP_MESSAGE' | translate }}</p>\n                <div class=\"row align-items-center m-0 custom-header\">\n                  <div class=\"col\">\n                    {{ 'TIMESHEET.PROJECT' | translate }} /\n                    {{ 'TIMESHEET.TODO' | translate }}\n                  </div>\n                  <div class=\"col text-center\">\n                    {{ 'TIMESHEET.DURATION' | translate }}\n                  </div>\n                </div>\n                @for (overlapTimeLog of overlaps; track overlapTimeLog) {\n                  <div\n                    [class]=\"\n                      overlaps.at(-1) === overlapTimeLog\n                        ? 'row item m-0 py-3 align-items-center'\n                        : 'row item border-bottom m-0 py-3 align-items-center'\n                    \"\n                    >\n                    <div class=\"col\">\n                      @if (overlapTimeLog?.project) {\n                        <span>\n                          {{ overlapTimeLog?.project?.name }}\n                        </span>\n                      } @else {\n                        <span>{{ 'TIMESHEET.NO_PROJECT' | translate }}</span>\n                      }\n                      <div class=\"mt-2 small\">\n                        @if (overlapTimeLog?.task) {\n                          <span>\n                            <strong\n                              >{{ 'TIMESHEET.TODO' | translate }}\n                              :\n                            </strong>\n                            {{ overlapTimeLog?.task?.title }}\n                          </span>\n                        } @else {\n                          <span>{{ 'TIMESHEET.NO_TODO' | translate }}</span>\n                        }\n                      </div>\n                    </div>\n                    <div class=\"col text-center\">\n                      {{ overlapTimeLog.overlapDuration | durationFormat }}\n                    </div>\n                  </div>\n                }\n              </nb-card-body>\n            </nb-card>\n          }\n          <div class=\"field span-4\">\n            <nb-checkbox formControlName=\"isBillable\" name=\"isBillable\" status=\"primary\">\n              {{ 'TIMER_TRACKER.IS_BILLABLE' | translate }}\n            </nb-checkbox>\n          </div>\n          <div class=\"field span-2\">\n            <label>{{ 'TIMER_TRACKER.SELECT_CLIENT' | translate }}</label>\n            <ga-contact-selector\n              [employeeId]=\"form.get('employeeId')?.value\"\n              name=\"organizationContactId\"\n              formControlName=\"organizationContactId\"\n              [required]=\"organization?.requireClient\"\n            ></ga-contact-selector>\n            @if (form.get('organizationContactId')?.invalid && f.submitted) {\n              <div class=\"invalid-feedback d-block\">\n                @if (form.get('organizationContactId')?.errors.required) {\n                  <div>\n                    {{ 'TIMER_TRACKER.VALIDATION.CLIENT_REQUIRED' | translate }}\n                  </div>\n                }\n              </div>\n            }\n          </div>\n          <div class=\"field span-2\">\n            <label>{{ 'TIMER_TRACKER.SELECT_PROJECT' | translate }}</label>\n            <ga-project-selector\n              name=\"projectId\"\n              formControlName=\"projectId\"\n              [skipGlobalChange]=\"true\"\n              [showAllOption]=\"false\"\n              [placeholder]=\"'TIMER_TRACKER.SELECT_PROJECT' | translate\"\n              [defaultSelected]=\"false\"\n              [employeeId]=\"form.get('employeeId')?.value\"\n              [organizationContactId]=\"form.get('organizationContactId')?.value\"\n              [required]=\"organization?.requireProject\"\n            ></ga-project-selector>\n            @if (form.get('projectId')?.invalid && f.submitted) {\n              <div class=\"invalid-feedback d-block\">\n                @if (form.get('projectId')?.errors.required) {\n                  <div>\n                    {{ 'TIMESHEET.VALIDATION.PROJECT' | translate }}\n                  </div>\n                }\n              </div>\n            }\n          </div>\n          <div class=\"field span-2\">\n            <label>{{ 'TIMER_TRACKER.SELECT_TEAM' | translate }}</label>\n            <ga-team-selector\n              formControlName=\"organizationTeamId\"\n              [skipGlobalChange]=\"true\"\n              [showAllOption]=\"false\"\n              [defaultSelected]=\"false\"\n              [placeholder]=\"'TIMER_TRACKER.SELECT_TEAM' | translate\"\n              [employeeId]=\"getControlValue('employeeId')\"\n              [projectId]=\"getControlValue('projectId')\"\n            ></ga-team-selector>\n          </div>\n          <div class=\"field span-2\">\n            <label>{{ 'TIMER_TRACKER.SELECT_TASK' | translate }}</label>\n            <ga-task-selector\n              name=\"taskId\"\n              [employeeId]=\"getControlValue('employeeId')\"\n              [projectId]=\"getControlValue('projectId')\"\n              formControlName=\"taskId\"\n              [required]=\"organization?.requireTask\"\n            ></ga-task-selector>\n            @if (form.get('taskId')?.invalid && f.submitted) {\n              <div class=\"invalid-feedback d-block\">\n                @if (form.get('taskId').errors.required) {\n                  <div>\n                    {{ 'TIMESHEET.VALIDATION.TASK' | translate }}\n                  </div>\n                }\n              </div>\n            }\n          </div>\n          <div class=\"field span-4\">\n            <label>{{ 'TIMER_TRACKER.DESCRIPTION' | translate }}</label>\n            <textarea\n              nbInput\n              fullWidth\n              class=\"form-control\"\n              rows=\"2\"\n              [placeholder]=\"'TIMER_TRACKER.DESCRIPTION' | translate\"\n              name=\"description\"\n              formControlName=\"description\"\n              [required]=\"organization?.requireDescription\"\n            ></textarea>\n            @if (form.get('description')?.invalid && f.submitted) {\n              <div class=\"invalid-feedback d-block\">\n                @if (form.get('description')?.errors.required) {\n                  <div>\n                    {{ 'TIMESHEET.VALIDATION.DESCRIPTION' | translate }}\n                  </div>\n                }\n              </div>\n            }\n          </div>\n          <div class=\"field span-4\">\n            <label>{{ 'TIMESHEET.REASON' | translate }}</label>\n            <nb-form-field fullWidth>\n              <input\n                fullWidth\n                nbInput\n                placeholder=\"{{ 'TIMESHEET.REASON' | translate }}\"\n                name=\"reason\"\n                formControlName=\"reason\"\n                [nbAutocomplete]=\"auto\"\n                [required]=\"organization?.requireReason\"\n                />\n              <nb-autocomplete #auto fullWidth>\n                @for (reason of reasons; track reason) {\n                  <nb-option [value]=\"reason\">\n                    {{ reason }}\n                  </nb-option>\n                }\n              </nb-autocomplete>\n            </nb-form-field>\n            @if (form.get('reason')?.invalid && f.submitted) {\n              <div class=\"invalid-feedback d-block\">\n                @if (form.get('reason')?.errors.required) {\n                  <div>\n                    {{ 'TIMESHEET.VALIDATION.REASON' | translate }}\n                  </div>\n                }\n              </div>\n            }\n          </div>\n        </div>\n      </nb-card-body>\n      <nb-card-footer>\n        <button\n          nbButton\n          status=\"success\"\n          size=\"small\"\n          [nbSpinner]=\"loading\"\n          [disabled]=\"loading\"\n          nbSpinnerStatus=\"primary\"\n          >\n          <nb-icon icon=\"save-outline\"></nb-icon>\n          {{ (mode == 'create' ? 'TIMESHEET.ADD_TIME' : 'TIMESHEET.UPDATE_TIME') | translate }}\n        </button>\n        <ng-template [ngxPermissionsOnly]=\"PermissionsEnum.ALLOW_DELETE_TIME\">\n          <ng-template ngxTimeTrackingAuthorized [permission]=\"PermissionsEnum.ALLOW_DELETE_TIME\">\n            @if (mode === 'update') {\n              <button\n                type=\"button\"\n                class=\"action ml-3\"\n                nbButton\n                size=\"small\"\n                status=\"basic\"\n                outline\n                ngxConfirmDialog\n                [message]=\"'TIMESHEET.DELETE_TIMELOG' | translate\"\n                (confirm)=\"onDeleteConfirm(timeLog)\"\n                [nbTooltip]=\"'BUTTONS.DELETE' | translate\"\n                >\n                <nb-icon status=\"danger\" icon=\"trash-2-outline\"></nb-icon>\n              </button>\n            }\n          </ng-template>\n        </ng-template>\n      </nb-card-footer>\n    </nb-card>\n  </form>\n}\n", styles: ["@charset \"UTF-8\";:host i{cursor:pointer}:host .cancel{width:100%;display:flex}[dir=ltr] :host .cancel{justify-content:flex-end}[dir=rtl] :host .cancel{justify-content:flex-start}:host .cancel i{font-size:11px;color:var(--gauzy-text-color-1)}:host [nbButton].appearance-outline.status-basic{background-color:transparent;border-color:#f56d584d;border-width:2px;color:#f56d58}:host [nbButton].appearance-outline.status-basic:hover{border-color:#f56d58}:host [nbButton].appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #f56d580d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host .title{color:var(--text-primary-color);font-size:16px;font-weight:600;line-height:16px;letter-spacing:0em}:host [nbButton].gray.appearance-outline.status-basic{background-color:transparent;border-color:#7e7e8f4d;border-width:2px;color:#7e7e8f}:host [nbButton].gray.appearance-outline.status-basic:hover{border-color:#7e7e8f}:host [nbButton].gray.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #7e7e8f0d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].gray.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic{background-color:transparent;border-color:#25b8694d;border-width:2px;color:#25b869}:host [nbButton].green.appearance-outline.status-basic:hover{border-color:#25b869}:host [nbButton].green.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #25b8690d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].green.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic[disabled],:host [nbButton].green.appearance-outline.status-basic.btn-disabled{background-color:var(--button-outline-basic-disabled-background-color);border-color:var(--button-outline-basic-disabled-border-color);color:var(--button-outline-basic-disabled-text-color);box-shadow:unset}:host [nbButton].primary.appearance-filled.status-primary{color:var(--text-primary-color);border:unset;background-color:var(--color-primary-transparent-default);box-shadow:var(--gauzy-shadow)}[dir=ltr] :host ::ng-deep input,[dir=ltr] :host ::ng-deep textarea{text-align:start}[dir=rtl] :host ::ng-deep input,[dir=rtl] :host ::ng-deep textarea{text-align:end}:host ::ng-deep input,:host ::ng-deep nb-select.appearance-outline.status-basic .select-button,:host ::ng-deep .ng-select .ng-select-container{background-color:var(--gauzy-sidebar-background-4)!important;border:none;min-height:calc(var(--select-medium-text-line-height) + .4375rem * 2)!important}:host ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-placeholder,:host ::ng-deep .ng-select.ng-select-single .ng-select-container .ng-value-container .ng-input{top:unset!important}:host ::ng-deep label,:host ::ng-deep .label{font-size:var(--text-label-font-size);font-weight:600;line-height:.8125rem;letter-spacing:-.01em;color:var(--gauzy-text-color-2)}:host ::ng-deep textarea{background-color:var(--gauzy-sidebar-background-4)!important;border:none}:host ::ng-deep .ng-select .ng-select-container input,:host ::ng-deep nb-tag-list input{background-color:unset!important}:host nb-card{background-color:var(--gauzy-card-1)}.action{box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));border:none}.action[nbButton].appearance-filled.status-basic{background-color:var(--gauzy-card-2)}.action.info[nbButton].appearance-filled.status-basic,.action.info-text-1[nbButton].appearance-filled.status-basic{color:var(--gauzy-action-info-text)}.action.secondary{color:var(--text-hint-color)}.action.success{color:var(--gauzy-action-success-text)}.action.warning{color:var(--gauzy-action-warning-text)}.action.orange{color:#ffab2d}.action.primary{color:var(--text-primary-color)}.action.primary.soft[nbButton].appearance-filled.status-basic{background-color:#6e49e81a}.action.select-nb ::ng-deep{box-shadow:none}.action.select-nb ::ng-deep .select-button{box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));background:var(--gauzy-card-2)}button{margin:5px}.actions{background:var(--gauzy-card-2);border-radius:var(--button-rectangle-border-radius);padding:2px 4px!important}.gauzy-button-container{display:flex;justify-content:flex-end;width:100%;padding-bottom:0}.card-custom-header{display:flex;flex-direction:column;width:100%;padding-bottom:0}:host ::ng-deep input{border-radius:var(--border-radius);box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18))}:host nb-card{width:645px;background-color:var(--gauzy-card-1)}:host nb-card-header.header{display:flex;align-items:center;justify-content:space-between;gap:.75rem}:host nb-card-header.header .title{font-size:12px;line-height:1rem}:host nb-card-header.header .cancel{width:auto}:host ::ng-deep label{display:block;margin:0 0 .375rem;font-size:12px;font-weight:600;line-height:15px;letter-spacing:0em;color:var(--gauzy-text-color-2)}:host .time-log-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:.75rem;align-items:start}:host .span-2{grid-column:span 2}:host .span-3{grid-column:span 3}:host .span-4{grid-column:1/-1}:host .field{min-width:0}:host ngx-timer-range-picker ::ng-deep .label,:host ga-employee-multi-select ::ng-deep .label{line-height:15px}:host .time-log-grid ::ng-deep nb-select.appearance-outline.status-basic .select-button{height:2rem;min-height:2rem!important;padding-block:0;padding-inline-start:.75rem!important;font-size:12px;line-height:1rem}:host ngx-timer-range-picker{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));column-gap:.75rem;min-width:0}:host ngx-timer-range-picker ::ng-deep .row{display:contents}:host ngx-timer-range-picker ::ng-deep .col-12,:host ngx-timer-range-picker ::ng-deep .col-6{flex:none;max-width:none;width:auto;min-width:0;padding:0}:host ngx-timer-range-picker ::ng-deep .form-group{margin:0}:host ngx-timer-range-picker ::ng-deep .input{width:100%;height:2rem;box-shadow:none}:host ngx-timer-range-picker ::ng-deep .input input{height:100%;min-height:2rem!important;padding:0 2rem 0 .75rem;font-size:12px}:host ngx-timer-range-picker ::ng-deep .input .icon{width:1rem;height:1rem}:host .period-value{display:flex;align-items:center;width:fit-content;height:2rem;padding:0 .75rem;border-radius:var(--border-radius);background:var(--color-primary-transparent-100);font-size:12px;font-weight:600;color:var(--text-primary-color)}:host nb-checkbox ::ng-deep .text{font-size:12px}:host .time-log-grid ::ng-deep .ng-select{font-size:12px}:host .time-log-grid ::ng-deep .ng-select .ng-select-container{height:2rem!important;min-height:2rem!important}:host .time-log-grid ::ng-deep .ng-select .ng-select-container .ng-value-container{padding-inline-start:.75rem!important}:host .time-log-grid ::ng-deep .ng-select .ng-select-container .ng-value-container .ng-input{padding-inline-start:.75rem!important}:host .time-log-grid textarea{min-height:0;padding:.4375rem .75rem;font-size:12px;line-height:1.125rem;resize:vertical}:host .time-log-grid nb-form-field input{height:2rem;min-height:2rem!important;padding-block:0;padding-inline:.75rem;font-size:12px;line-height:1rem}:host nb-card-footer{display:flex;align-items:center}:host nb-card-footer button{margin:0;height:2rem}:host .custom-card{margin:0;background-color:var(--gauzy-card-2)}:host .custom-card .custom-card-body{max-height:unset;height:unset}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "directive", type: i1.ɵNgNoValidate, selector: "form:not([ngNoForm]):not([ngNativeValidate])" }, { kind: "directive", type: i1.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i1.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i1.NgControlStatusGroup, selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],[formArray],form:not([ngNoForm]),[ngForm]" }, { kind: "directive", type: i1.RequiredValidator, selector: ":not([type=checkbox])[required][formControlName],:not([type=checkbox])[required][formControl],:not([type=checkbox])[required][ngModel]", inputs: ["required"] }, { kind: "directive", type: i1.FormGroupDirective, selector: "[formGroup]", inputs: ["formGroup"], outputs: ["ngSubmit"], exportAs: ["ngForm"] }, { kind: "directive", type: i1.FormControlName, selector: "[formControlName]", inputs: ["formControlName", "disabled", "ngModel"], outputs: ["ngModelChange"] }, { kind: "component", type: i2.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "component", type: i2.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i2.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "component", type: i2.NbCardFooterComponent, selector: "nb-card-footer" }, { kind: "component", type: i2.NbCardHeaderComponent, selector: "nb-card-header" }, { kind: "component", type: i2.NbCheckboxComponent, selector: "nb-checkbox", inputs: ["checked", "disabled", "status", "indeterminate"], outputs: ["checkedChange"] }, { kind: "component", type: i2.NbAutocompleteComponent, selector: "nb-autocomplete", inputs: ["handleDisplayFn", "size", "activeFirst", "optionsListClass", "optionsPanelClass", "optionsWidth"], outputs: ["selectedChange"] }, { kind: "directive", type: i2.NbAutocompleteDirective, selector: "input[nbAutocomplete]", inputs: ["nbAutocomplete", "overlayOffset", "scrollStrategy", "customOverlayHost"] }, { kind: "component", type: i2.NbOptionComponent, selector: "nb-option", inputs: ["value", "disabled"], outputs: ["selectionChange"] }, { kind: "component", type: i2.NbFormFieldComponent, selector: "nb-form-field" }, { kind: "component", type: i2.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "directive", type: i2.NbInputDirective, selector: "input[nbInput],textarea[nbInput]", inputs: ["fieldSize", "status", "shape", "fullWidth"] }, { kind: "directive", type: i2.NbSpinnerDirective, selector: "[nbSpinner]", inputs: ["nbSpinnerMessage", "nbSpinnerStatus", "nbSpinnerSize", "nbSpinner"] }, { kind: "directive", type: i2.NbTooltipDirective, selector: "[nbTooltip]", inputs: ["nbTooltip", "nbTooltipPlacement", "nbTooltipAdjustment", "nbTooltipClass", "nbTooltipIcon", "nbTooltipStatus", "nbTooltipTrigger", "nbTooltipOffset", "nbTooltipDisabled"], outputs: ["nbTooltipShowStateChange"], exportAs: ["nbTooltip"] }, { kind: "directive", type: i4.NgxPermissionsDirective, selector: "[ngxPermissionsOnly],[ngxPermissionsExcept]", inputs: ["ngxPermissionsOnly", "ngxPermissionsOnlyThen", "ngxPermissionsOnlyElse", "ngxPermissionsExcept", "ngxPermissionsExceptElse", "ngxPermissionsExceptThen", "ngxPermissionsThen", "ngxPermissionsElse", "ngxPermissionsOnlyAuthorisedStrategy", "ngxPermissionsOnlyUnauthorisedStrategy", "ngxPermissionsExceptUnauthorisedStrategy", "ngxPermissionsExceptAuthorisedStrategy", "ngxPermissionsUnauthorisedStrategy", "ngxPermissionsAuthorisedStrategy"], outputs: ["permissionsAuthorized", "permissionsUnauthorized"] }, { kind: "component", type: i5.AvatarComponent, selector: "ngx-avatar", inputs: ["size", "src", "appendCaption", "caption", "id", "isOption", "employee", "value", "name"] }, { kind: "directive", type: i6.TimeTrackingAuthorizedDirective, selector: "[ngxTimeTrackingAuthorized]", inputs: ["permission", "permissionElse"] }, { kind: "directive", type: i7.ConfirmDirective, selector: "[ngxConfirmDialog]", inputs: ["message", "title", "yesText", "noText"], outputs: ["confirm", "decline"] }, { kind: "component", type: i8.TimerRangePickerComponent, selector: "ngx-timer-range-picker", inputs: ["slotStartTime", "slotEndTime", "allowedDuration", "disableEndPicker", "disableDatePicker", "fromEmployeeAppointment", "timezoneOffset", "maxDate", "minDate", "disabledDates"] }, { kind: "component", type: i9.TaskSelectorComponent, selector: "ga-task-selector", inputs: ["placeholder", "multiple", "disabled", "addTag", "projectId", "employeeId"] }, { kind: "component", type: i10.ProjectSelectorComponent, selector: "ga-project-selector", inputs: ["shortened", "dropdownClass", "disabled", "multiple", "label", "placeholder", "skipGlobalChange", "defaultSelected", "showAllOption", "projectId", "employeeId", "organizationContactId"], outputs: ["onChanged"] }, { kind: "component", type: i11.TeamSelectorComponent, selector: "ga-team-selector", inputs: ["shortened", "dropdownClass", "disabled", "multiple", "label", "placeholder", "skipGlobalChange", "defaultSelected", "showAllOption", "organizationTeamId", "employeeId", "projectId"], outputs: ["onChanged"] }, { kind: "component", type: i12.EmployeeSelectComponent, selector: "ga-employee-multi-select", inputs: ["reset", "allEmployees", "selectedEmployeeIds", "multiple", "label", "disabled", "placeholder"], outputs: ["selectedChange", "onLoadEmployees"] }, { kind: "component", type: i13.ContactSelectorComponent, selector: "ga-contact-selector", inputs: ["disabled", "multiple", "placeholder", "employeeId", "contactId"] }, { kind: "pipe", type: i14.TranslatePipe, name: "translate" }, { kind: "pipe", type: i15.DurationFormatPipe, name: "durationFormat" }] }); }
};
EditTimeLogModalComponent = EditTimeLogModalComponent_1 = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [FormBuilder,
        ChangeDetectorRef,
        NbDialogRef,
        Store,
        TimesheetService,
        ToastrService])
], EditTimeLogModalComponent);
export { EditTimeLogModalComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EditTimeLogModalComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-edit-time-log-modal', standalone: false, template: "@if (form) {\n  <form #f=\"ngForm\" [formGroup]=\"form\" (submit)=\"addTime()\">\n    <nb-card>\n      <nb-card-header class=\"header\">\n        <div class=\"title\">\n          {{ (mode == 'update' ? 'TIMESHEET.EDIT_TIME_LOGS' : 'TIMESHEET.ADD_TIME_LOGS') | translate }}\n        </div>\n        <span class=\"cancel\"> <i class=\"fas fa-times\" (click)=\"close()\"></i></span>\n      </nb-card-header>\n      <nb-card-body>\n        <!-- One 4-column grid for the whole form, so every field starts and ends on\n             a shared line: quarters for the time row, halves for the selector pairs,\n             the full width for the free-text fields. -->\n        <div class=\"time-log-grid\">\n          <div class=\"field span-2\" *ngxPermissionsOnly=\"[PermissionsEnum.CHANGE_SELECTED_EMPLOYEE]\">\n            @if (mode == 'update') {\n              <div class=\"description\">\n                <ngx-avatar\n                  [id]=\"timeLog?.employee?.id\"\n                  [employee]=\"timeLog?.employee\"\n                  [name]=\"timeLog?.employee?.user?.name\"\n                  [src]=\"timeLog?.employee?.user?.imageUrl\"\n                  class=\"report-table\"\n                ></ngx-avatar>\n              </div>\n            } @else {\n              <ga-employee-multi-select\n                name=\"employeeId\"\n                [multiple]=\"false\"\n                label=\"TIMESHEET.SELECT_EMPLOYEE\"\n                [placeholder]=\"'TIMESHEET.SELECT_EMPLOYEE' | translate\"\n                formControlName=\"employeeId\"\n                required\n                >\n              </ga-employee-multi-select>\n              @if (form.get('employeeId')?.invalid && f.submitted) {\n                <div class=\"invalid-feedback d-block\">\n                  @if (form.get('employeeId')?.errors.required) {\n                    <div>\n                      {{ 'TIMESHEET.VALIDATION.EMPLOYEE' | translate }}\n                    </div>\n                  }\n                </div>\n              }\n            }\n          </div>\n          <!-- Date, Start Time and End Time: the picker lays its three fields out on\n               the first three columns (see the stylesheet). -->\n          <ngx-timer-range-picker\n            class=\"span-3\"\n            name=\"selectedRange\"\n            [maxDate]=\"futureDateAllowed ? null : today\"\n            formControlName=\"selectedRange\"\n            >\n          </ngx-timer-range-picker>\n          <div class=\"field period\">\n            @if (timeDiff) {\n              <label>{{ 'FORM.LABELS.PERIOD' | translate }}</label>\n              <div class=\"period-value\">{{ timeDiff | durationFormat }}</div>\n            }\n          </div>\n          @if (overlaps.length > 0) {\n            <nb-card class=\"span-4 custom-card\" status=\"danger\">\n              <nb-card-header>\n                <div class=\"d-flex align-items-center\">\n                  <nb-icon icon=\"alert-triangle-outline\" class=\"mr-3\"></nb-icon>\n                  {{ 'TIMESHEET.TIME_OVERLAPS' | translate }}\n                </div>\n              </nb-card-header>\n              <nb-card-body class=\"custom-card-body\">\n                <p>{{ 'TIMESHEET.OVERLAP_MESSAGE' | translate }}</p>\n                <div class=\"row align-items-center m-0 custom-header\">\n                  <div class=\"col\">\n                    {{ 'TIMESHEET.PROJECT' | translate }} /\n                    {{ 'TIMESHEET.TODO' | translate }}\n                  </div>\n                  <div class=\"col text-center\">\n                    {{ 'TIMESHEET.DURATION' | translate }}\n                  </div>\n                </div>\n                @for (overlapTimeLog of overlaps; track overlapTimeLog) {\n                  <div\n                    [class]=\"\n                      overlaps.at(-1) === overlapTimeLog\n                        ? 'row item m-0 py-3 align-items-center'\n                        : 'row item border-bottom m-0 py-3 align-items-center'\n                    \"\n                    >\n                    <div class=\"col\">\n                      @if (overlapTimeLog?.project) {\n                        <span>\n                          {{ overlapTimeLog?.project?.name }}\n                        </span>\n                      } @else {\n                        <span>{{ 'TIMESHEET.NO_PROJECT' | translate }}</span>\n                      }\n                      <div class=\"mt-2 small\">\n                        @if (overlapTimeLog?.task) {\n                          <span>\n                            <strong\n                              >{{ 'TIMESHEET.TODO' | translate }}\n                              :\n                            </strong>\n                            {{ overlapTimeLog?.task?.title }}\n                          </span>\n                        } @else {\n                          <span>{{ 'TIMESHEET.NO_TODO' | translate }}</span>\n                        }\n                      </div>\n                    </div>\n                    <div class=\"col text-center\">\n                      {{ overlapTimeLog.overlapDuration | durationFormat }}\n                    </div>\n                  </div>\n                }\n              </nb-card-body>\n            </nb-card>\n          }\n          <div class=\"field span-4\">\n            <nb-checkbox formControlName=\"isBillable\" name=\"isBillable\" status=\"primary\">\n              {{ 'TIMER_TRACKER.IS_BILLABLE' | translate }}\n            </nb-checkbox>\n          </div>\n          <div class=\"field span-2\">\n            <label>{{ 'TIMER_TRACKER.SELECT_CLIENT' | translate }}</label>\n            <ga-contact-selector\n              [employeeId]=\"form.get('employeeId')?.value\"\n              name=\"organizationContactId\"\n              formControlName=\"organizationContactId\"\n              [required]=\"organization?.requireClient\"\n            ></ga-contact-selector>\n            @if (form.get('organizationContactId')?.invalid && f.submitted) {\n              <div class=\"invalid-feedback d-block\">\n                @if (form.get('organizationContactId')?.errors.required) {\n                  <div>\n                    {{ 'TIMER_TRACKER.VALIDATION.CLIENT_REQUIRED' | translate }}\n                  </div>\n                }\n              </div>\n            }\n          </div>\n          <div class=\"field span-2\">\n            <label>{{ 'TIMER_TRACKER.SELECT_PROJECT' | translate }}</label>\n            <ga-project-selector\n              name=\"projectId\"\n              formControlName=\"projectId\"\n              [skipGlobalChange]=\"true\"\n              [showAllOption]=\"false\"\n              [placeholder]=\"'TIMER_TRACKER.SELECT_PROJECT' | translate\"\n              [defaultSelected]=\"false\"\n              [employeeId]=\"form.get('employeeId')?.value\"\n              [organizationContactId]=\"form.get('organizationContactId')?.value\"\n              [required]=\"organization?.requireProject\"\n            ></ga-project-selector>\n            @if (form.get('projectId')?.invalid && f.submitted) {\n              <div class=\"invalid-feedback d-block\">\n                @if (form.get('projectId')?.errors.required) {\n                  <div>\n                    {{ 'TIMESHEET.VALIDATION.PROJECT' | translate }}\n                  </div>\n                }\n              </div>\n            }\n          </div>\n          <div class=\"field span-2\">\n            <label>{{ 'TIMER_TRACKER.SELECT_TEAM' | translate }}</label>\n            <ga-team-selector\n              formControlName=\"organizationTeamId\"\n              [skipGlobalChange]=\"true\"\n              [showAllOption]=\"false\"\n              [defaultSelected]=\"false\"\n              [placeholder]=\"'TIMER_TRACKER.SELECT_TEAM' | translate\"\n              [employeeId]=\"getControlValue('employeeId')\"\n              [projectId]=\"getControlValue('projectId')\"\n            ></ga-team-selector>\n          </div>\n          <div class=\"field span-2\">\n            <label>{{ 'TIMER_TRACKER.SELECT_TASK' | translate }}</label>\n            <ga-task-selector\n              name=\"taskId\"\n              [employeeId]=\"getControlValue('employeeId')\"\n              [projectId]=\"getControlValue('projectId')\"\n              formControlName=\"taskId\"\n              [required]=\"organization?.requireTask\"\n            ></ga-task-selector>\n            @if (form.get('taskId')?.invalid && f.submitted) {\n              <div class=\"invalid-feedback d-block\">\n                @if (form.get('taskId').errors.required) {\n                  <div>\n                    {{ 'TIMESHEET.VALIDATION.TASK' | translate }}\n                  </div>\n                }\n              </div>\n            }\n          </div>\n          <div class=\"field span-4\">\n            <label>{{ 'TIMER_TRACKER.DESCRIPTION' | translate }}</label>\n            <textarea\n              nbInput\n              fullWidth\n              class=\"form-control\"\n              rows=\"2\"\n              [placeholder]=\"'TIMER_TRACKER.DESCRIPTION' | translate\"\n              name=\"description\"\n              formControlName=\"description\"\n              [required]=\"organization?.requireDescription\"\n            ></textarea>\n            @if (form.get('description')?.invalid && f.submitted) {\n              <div class=\"invalid-feedback d-block\">\n                @if (form.get('description')?.errors.required) {\n                  <div>\n                    {{ 'TIMESHEET.VALIDATION.DESCRIPTION' | translate }}\n                  </div>\n                }\n              </div>\n            }\n          </div>\n          <div class=\"field span-4\">\n            <label>{{ 'TIMESHEET.REASON' | translate }}</label>\n            <nb-form-field fullWidth>\n              <input\n                fullWidth\n                nbInput\n                placeholder=\"{{ 'TIMESHEET.REASON' | translate }}\"\n                name=\"reason\"\n                formControlName=\"reason\"\n                [nbAutocomplete]=\"auto\"\n                [required]=\"organization?.requireReason\"\n                />\n              <nb-autocomplete #auto fullWidth>\n                @for (reason of reasons; track reason) {\n                  <nb-option [value]=\"reason\">\n                    {{ reason }}\n                  </nb-option>\n                }\n              </nb-autocomplete>\n            </nb-form-field>\n            @if (form.get('reason')?.invalid && f.submitted) {\n              <div class=\"invalid-feedback d-block\">\n                @if (form.get('reason')?.errors.required) {\n                  <div>\n                    {{ 'TIMESHEET.VALIDATION.REASON' | translate }}\n                  </div>\n                }\n              </div>\n            }\n          </div>\n        </div>\n      </nb-card-body>\n      <nb-card-footer>\n        <button\n          nbButton\n          status=\"success\"\n          size=\"small\"\n          [nbSpinner]=\"loading\"\n          [disabled]=\"loading\"\n          nbSpinnerStatus=\"primary\"\n          >\n          <nb-icon icon=\"save-outline\"></nb-icon>\n          {{ (mode == 'create' ? 'TIMESHEET.ADD_TIME' : 'TIMESHEET.UPDATE_TIME') | translate }}\n        </button>\n        <ng-template [ngxPermissionsOnly]=\"PermissionsEnum.ALLOW_DELETE_TIME\">\n          <ng-template ngxTimeTrackingAuthorized [permission]=\"PermissionsEnum.ALLOW_DELETE_TIME\">\n            @if (mode === 'update') {\n              <button\n                type=\"button\"\n                class=\"action ml-3\"\n                nbButton\n                size=\"small\"\n                status=\"basic\"\n                outline\n                ngxConfirmDialog\n                [message]=\"'TIMESHEET.DELETE_TIMELOG' | translate\"\n                (confirm)=\"onDeleteConfirm(timeLog)\"\n                [nbTooltip]=\"'BUTTONS.DELETE' | translate\"\n                >\n                <nb-icon status=\"danger\" icon=\"trash-2-outline\"></nb-icon>\n              </button>\n            }\n          </ng-template>\n        </ng-template>\n      </nb-card-footer>\n    </nb-card>\n  </form>\n}\n", styles: ["@charset \"UTF-8\";:host i{cursor:pointer}:host .cancel{width:100%;display:flex}[dir=ltr] :host .cancel{justify-content:flex-end}[dir=rtl] :host .cancel{justify-content:flex-start}:host .cancel i{font-size:11px;color:var(--gauzy-text-color-1)}:host [nbButton].appearance-outline.status-basic{background-color:transparent;border-color:#f56d584d;border-width:2px;color:#f56d58}:host [nbButton].appearance-outline.status-basic:hover{border-color:#f56d58}:host [nbButton].appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #f56d580d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host .title{color:var(--text-primary-color);font-size:16px;font-weight:600;line-height:16px;letter-spacing:0em}:host [nbButton].gray.appearance-outline.status-basic{background-color:transparent;border-color:#7e7e8f4d;border-width:2px;color:#7e7e8f}:host [nbButton].gray.appearance-outline.status-basic:hover{border-color:#7e7e8f}:host [nbButton].gray.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #7e7e8f0d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].gray.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic{background-color:transparent;border-color:#25b8694d;border-width:2px;color:#25b869}:host [nbButton].green.appearance-outline.status-basic:hover{border-color:#25b869}:host [nbButton].green.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #25b8690d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].green.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic[disabled],:host [nbButton].green.appearance-outline.status-basic.btn-disabled{background-color:var(--button-outline-basic-disabled-background-color);border-color:var(--button-outline-basic-disabled-border-color);color:var(--button-outline-basic-disabled-text-color);box-shadow:unset}:host [nbButton].primary.appearance-filled.status-primary{color:var(--text-primary-color);border:unset;background-color:var(--color-primary-transparent-default);box-shadow:var(--gauzy-shadow)}[dir=ltr] :host ::ng-deep input,[dir=ltr] :host ::ng-deep textarea{text-align:start}[dir=rtl] :host ::ng-deep input,[dir=rtl] :host ::ng-deep textarea{text-align:end}:host ::ng-deep input,:host ::ng-deep nb-select.appearance-outline.status-basic .select-button,:host ::ng-deep .ng-select .ng-select-container{background-color:var(--gauzy-sidebar-background-4)!important;border:none;min-height:calc(var(--select-medium-text-line-height) + .4375rem * 2)!important}:host ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-placeholder,:host ::ng-deep .ng-select.ng-select-single .ng-select-container .ng-value-container .ng-input{top:unset!important}:host ::ng-deep label,:host ::ng-deep .label{font-size:var(--text-label-font-size);font-weight:600;line-height:.8125rem;letter-spacing:-.01em;color:var(--gauzy-text-color-2)}:host ::ng-deep textarea{background-color:var(--gauzy-sidebar-background-4)!important;border:none}:host ::ng-deep .ng-select .ng-select-container input,:host ::ng-deep nb-tag-list input{background-color:unset!important}:host nb-card{background-color:var(--gauzy-card-1)}.action{box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));border:none}.action[nbButton].appearance-filled.status-basic{background-color:var(--gauzy-card-2)}.action.info[nbButton].appearance-filled.status-basic,.action.info-text-1[nbButton].appearance-filled.status-basic{color:var(--gauzy-action-info-text)}.action.secondary{color:var(--text-hint-color)}.action.success{color:var(--gauzy-action-success-text)}.action.warning{color:var(--gauzy-action-warning-text)}.action.orange{color:#ffab2d}.action.primary{color:var(--text-primary-color)}.action.primary.soft[nbButton].appearance-filled.status-basic{background-color:#6e49e81a}.action.select-nb ::ng-deep{box-shadow:none}.action.select-nb ::ng-deep .select-button{box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));background:var(--gauzy-card-2)}button{margin:5px}.actions{background:var(--gauzy-card-2);border-radius:var(--button-rectangle-border-radius);padding:2px 4px!important}.gauzy-button-container{display:flex;justify-content:flex-end;width:100%;padding-bottom:0}.card-custom-header{display:flex;flex-direction:column;width:100%;padding-bottom:0}:host ::ng-deep input{border-radius:var(--border-radius);box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18))}:host nb-card{width:645px;background-color:var(--gauzy-card-1)}:host nb-card-header.header{display:flex;align-items:center;justify-content:space-between;gap:.75rem}:host nb-card-header.header .title{font-size:12px;line-height:1rem}:host nb-card-header.header .cancel{width:auto}:host ::ng-deep label{display:block;margin:0 0 .375rem;font-size:12px;font-weight:600;line-height:15px;letter-spacing:0em;color:var(--gauzy-text-color-2)}:host .time-log-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:.75rem;align-items:start}:host .span-2{grid-column:span 2}:host .span-3{grid-column:span 3}:host .span-4{grid-column:1/-1}:host .field{min-width:0}:host ngx-timer-range-picker ::ng-deep .label,:host ga-employee-multi-select ::ng-deep .label{line-height:15px}:host .time-log-grid ::ng-deep nb-select.appearance-outline.status-basic .select-button{height:2rem;min-height:2rem!important;padding-block:0;padding-inline-start:.75rem!important;font-size:12px;line-height:1rem}:host ngx-timer-range-picker{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));column-gap:.75rem;min-width:0}:host ngx-timer-range-picker ::ng-deep .row{display:contents}:host ngx-timer-range-picker ::ng-deep .col-12,:host ngx-timer-range-picker ::ng-deep .col-6{flex:none;max-width:none;width:auto;min-width:0;padding:0}:host ngx-timer-range-picker ::ng-deep .form-group{margin:0}:host ngx-timer-range-picker ::ng-deep .input{width:100%;height:2rem;box-shadow:none}:host ngx-timer-range-picker ::ng-deep .input input{height:100%;min-height:2rem!important;padding:0 2rem 0 .75rem;font-size:12px}:host ngx-timer-range-picker ::ng-deep .input .icon{width:1rem;height:1rem}:host .period-value{display:flex;align-items:center;width:fit-content;height:2rem;padding:0 .75rem;border-radius:var(--border-radius);background:var(--color-primary-transparent-100);font-size:12px;font-weight:600;color:var(--text-primary-color)}:host nb-checkbox ::ng-deep .text{font-size:12px}:host .time-log-grid ::ng-deep .ng-select{font-size:12px}:host .time-log-grid ::ng-deep .ng-select .ng-select-container{height:2rem!important;min-height:2rem!important}:host .time-log-grid ::ng-deep .ng-select .ng-select-container .ng-value-container{padding-inline-start:.75rem!important}:host .time-log-grid ::ng-deep .ng-select .ng-select-container .ng-value-container .ng-input{padding-inline-start:.75rem!important}:host .time-log-grid textarea{min-height:0;padding:.4375rem .75rem;font-size:12px;line-height:1.125rem;resize:vertical}:host .time-log-grid nb-form-field input{height:2rem;min-height:2rem!important;padding-block:0;padding-inline:.75rem;font-size:12px;line-height:1rem}:host nb-card-footer{display:flex;align-items:center}:host nb-card-footer button{margin:0;height:2rem}:host .custom-card{margin:0;background-color:var(--gauzy-card-2)}:host .custom-card .custom-card-body{max-height:unset;height:unset}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [{ type: i1.FormBuilder }, { type: i0.ChangeDetectorRef }, { type: i2.NbDialogRef }, { type: i3.Store }, { type: i3.TimesheetService }, { type: i3.ToastrService }], propDecorators: { timeLog: [{
                type: Input
            }] } });
//# sourceMappingURL=edit-time-log-modal.component.js.map