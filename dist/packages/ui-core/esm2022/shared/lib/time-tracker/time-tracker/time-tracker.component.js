import { __decorate, __metadata } from "tslib";
import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NbThemeService } from '@nebular/theme';
import moment from 'moment';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter, tap } from 'rxjs/operators';
import { NgxPermissionsService } from 'ngx-permissions';
import { faStopwatch, faPlay, faPause } from '@fortawesome/free-solid-svg-icons';
import { environment } from '@gauzy/ui-config';
import { TimeLogType, PermissionsEnum, TimeLogSourceEnum } from '@gauzy/contracts';
import { distinctUntilChange, toLocal, toUTC } from '@gauzy/ui-core/common';
import { ErrorHandlingService, Store, TimeTrackerService, TimesheetService, ToastrService } from '@gauzy/ui-core/core';
import { TimeTrackerStatusService } from '../components/time-tracker-status/time-tracker-status.service';
import * as i0 from "@angular/core";
import * as i1 from "@gauzy/ui-core/core";
import * as i2 from "@nebular/theme";
import * as i3 from "ngx-permissions";
import * as i4 from "../components/time-tracker-status/time-tracker-status.service";
import * as i5 from "@angular/common";
import * as i6 from "@angular/forms";
import * as i7 from "@angular/router";
import * as i8 from "@fortawesome/angular-fontawesome";
import * as i9 from "ngx-draggable-dom";
import * as i10 from "../../directives/time-tracking-authorized-directive";
import * as i11 from "../../timer-picker/timer-range-picker/timer-range-picker.component";
import * as i12 from "../../tasks/task-select/task/task.component";
import * as i13 from "../../selectors/project/project/project.component";
import * as i14 from "../../selectors/team/team/team.component";
import * as i15 from "../../contact-selector/contact-selector.component";
import * as i16 from "../components/time-tracker-status/time-tracker-status.component";
import * as i17 from "@ngx-translate/core";
let TimeTrackerComponent = class TimeTrackerComponent {
    constructor(timeTrackerService, timesheetService, toastrService, store, _errorHandlingService, themeService, ngxPermissionsService, _timeTrackerStatusService) {
        this.timeTrackerService = timeTrackerService;
        this.timesheetService = timesheetService;
        this.toastrService = toastrService;
        this.store = store;
        this._errorHandlingService = _errorHandlingService;
        this.themeService = themeService;
        this.ngxPermissionsService = ngxPermissionsService;
        this._timeTrackerStatusService = _timeTrackerStatusService;
        // This constant holds the URL for downloading content from the platform's website.
        this.PLATFORM_WEBSITE_DOWNLOAD_URL = environment.PLATFORM_WEBSITE_DOWNLOAD_URL;
        this.play = faPlay;
        this.pause = faPause;
        this.stopwatch = faStopwatch;
        this.isDisable = false;
        this.isOpen = false;
        this.isExpanded = true;
        this.futureDateAllowed = false;
        this.todaySessionTime = moment().set({ hour: 0, minute: 0, second: 0 }).format('HH:mm:ss');
        this.currentSessionTime = moment().set({ hour: 0, minute: 0, second: 0 }).format('HH:mm:ss');
        this.today = new Date();
        this.selectedRange = { start: null, end: null };
        this.PermissionsEnum = PermissionsEnum;
        this.timeLogType = TimeLogType;
        this.hideAlert = false;
        this.trackType$ = this.timeTrackerService.trackType$;
        this._timeTrackerStatusService.external$
            .pipe(filter((timerSynced) => this.xor(this.running, timerSynced.running)), tap(async (timerSynced) => {
            this.timeTrackerService.currentSessionDuration = moment().diff(toLocal(timerSynced.startedAt), 'seconds');
            await this.toggleTimer(false);
        }), untilDestroyed(this))
            .subscribe();
    }
    /**
     * Gets the value indicating whether the task is billable.
     *
     * @returns A boolean indicating if the task is billable.
     */
    get isBillable() {
        return this.timeTrackerService.timerConfig.isBillable;
    }
    /**
     * Sets the value indicating whether the task is billable.
     *
     * @param value - A boolean indicating if the task should be billable.
     */
    set isBillable(value) {
        this.updateTimerConfig({ isBillable: value });
    }
    /**
     * Gets the current task ID associated with the timer configuration.
     *
     * @returns The task ID if it exists and is a string; otherwise, null.
     */
    get taskId() {
        return this.getStringConfigValue('taskId');
    }
    /**
     * Sets the task ID for the timer configuration.
     *
     * @param value - The task ID to set.
     */
    set taskId(value) {
        this.updateTimerConfig({ taskId: value });
    }
    /**
     * Gets the organization contact ID from the timer configuration.
     *
     * @returns The organization contact ID if it exists and is a string; otherwise, null.
     */
    get organizationContactId() {
        return this.getStringConfigValue('organizationContactId');
    }
    /**
     * Sets the organization contact ID for the timer configuration.
     *
     * @param value - The organization contact ID to set.
     */
    set organizationContactId(value) {
        this.updateTimerConfig({ organizationContactId: value });
    }
    /**
     * Gets the project ID associated with the timer configuration.
     *
     * @returns The project ID if it exists and is a string; otherwise, null.
     */
    get projectId() {
        return this.getStringConfigValue('projectId');
    }
    /**
     * Sets the project ID for the timer configuration.
     *
     * @param value - The project ID to set.
     */
    set projectId(value) {
        this.updateTimerConfig({ projectId: value });
    }
    /**
     * Gets the organization team ID associated with the timer configuration.
     *
     * @returns The organization team ID if it exists and is a string; otherwise, null.
     */
    get organizationTeamId() {
        return this.getStringConfigValue('organizationTeamId');
    }
    /**
     * Sets the organization team ID for the timer configuration.
     *
     * @param value - The organization team ID to set.
     */
    set organizationTeamId(value) {
        this.updateTimerConfig({ organizationTeamId: value });
    }
    /**
     * Gets the description from the timer configuration.
     *
     * @returns The description if it exists and is a string; otherwise, null.
     */
    get description() {
        return this.getStringConfigValue('description');
    }
    /**
     * Sets the description for the timer configuration.
     *
     * @param value - The description to set.
     */
    set description(value) {
        this.updateTimerConfig({ description: value });
    }
    /**
     * Updates the timer configuration with new values.
     *
     * @param updates - An object containing the properties to update in the timer configuration.
     */
    updateTimerConfig(updates) {
        this.timeTrackerService.timerConfig = {
            ...this.timeTrackerService.timerConfig,
            ...updates
        };
    }
    /**
     * Retrieves the value of a specified string property from the timer configuration.
     *
     * @param key - The name of the property to retrieve.
     * @returns The value of the property if it exists and is a string; otherwise, null.
     */
    getStringConfigValue(key) {
        const value = this.timeTrackerService.timerConfig[key];
        return typeof value === 'string' ? value : null;
    }
    /**
     * Gets the current position of the timer.
     *
     * @returns The current position or offset of the timer.
     */
    get position() {
        return this.timeTrackerService.position;
    }
    /**
     * Sets the position of the timer.
     *
     * @param offSet - The offset value to set for the timer's position.
     */
    set position(offSet) {
        this.timeTrackerService.position = offSet;
    }
    ngOnInit() {
        this.store.selectedOrganization$
            .pipe(distinctUntilChange(), filter((organization) => !!organization), tap((organization) => {
            this.organization = organization;
            this.futureDateAllowed = organization.futureDateAllowed;
        }), untilDestroyed(this))
            .subscribe();
        this.store.user$
            .pipe(filter((user) => !!user), tap((user) => (this.user = user)), tap((user) => (this.employee = user?.employee)), untilDestroyed(this))
            .subscribe();
        this.timeTrackerService.duration$
            .pipe(tap((time) => (this.todaySessionTime = moment.utc(time * 1000).format('HH:mm:ss'))), untilDestroyed(this))
            .subscribe();
        this.timeTrackerService.showTimerWindow$
            .pipe(tap((isOpen) => (this.isOpen = isOpen)), untilDestroyed(this))
            .subscribe();
        this.timeTrackerService.currentSessionDuration$
            .pipe(tap((time) => (this.currentSessionTime = moment.utc(time * 1000).format('HH:mm:ss'))), untilDestroyed(this))
            .subscribe();
        this.timeTrackerService.$running
            .pipe(tap((isRunning) => (this.running = isRunning)), untilDestroyed(this))
            .subscribe();
        this.themeService
            .onThemeChange()
            .pipe(tap((theme) => (this.theme = theme.name)), untilDestroyed(this))
            .subscribe();
    }
    toggleWindow() {
        if (!this.isOpen) {
            this.show();
        }
        else {
            this.hide();
        }
    }
    show() {
        this.timeTrackerService.showTimerWindow = true;
    }
    hide() {
        this.timeTrackerService.showTimerWindow = false;
    }
    async toggleTimer(onClick) {
        try {
            if (!this.running && this.form.invalid) {
                this.form.resetForm();
                return;
            }
        }
        catch (error) {
            this.toggleWindow();
            this.isExpanded = false;
        }
        try {
            this.isDisable = true;
            this.timeTrackerService.timerSynced &&
                this.xor(this.running, this.timeTrackerService.timerSynced.running) &&
                !onClick &&
                this.timeTrackerService.timerSynced.isExternalSource
                ? this.timeTrackerService.remoteToggle()
                : await this.timeTrackerService.toggle();
        }
        catch (error) {
            if (this.timeTrackerService.interval) {
                this.timeTrackerService.turnOffTimer();
            }
            else {
                this.timeTrackerService.turnOnTimer();
            }
            this._errorHandlingService.handleError(error);
        }
        this.isDisable = false;
    }
    async addTime() {
        if (!this.organization || this.form.invalid) {
            return;
        }
        const { allowManualTime, id: organizationId } = this.organization;
        const { tenantId } = this.store.user;
        if (!(allowManualTime && (await this.ngxPermissionsService.hasPermission(PermissionsEnum.ALLOW_MANUAL_TIME)))) {
            return;
        }
        const startedAt = toUTC(this.selectedRange.start).toDate();
        const stoppedAt = toUTC(this.selectedRange.end).toDate();
        const payload = Object.assign({
            startedAt,
            stoppedAt,
            organizationId,
            tenantId
        }, this.timeTrackerService.timerConfig);
        this.timesheetService
            .addTime(payload)
            .then((timeLog) => {
            this.timesheetService.updateLogs(true);
            this.timeTrackerService.checkTimerStatus({
                organizationId,
                tenantId,
                source: TimeLogSourceEnum.WEB_TIMER
            });
            if (moment.utc(timeLog.startedAt).local().isSame(new Date(), 'day')) {
                this.timeTrackerService.duration = this.timeTrackerService.duration + timeLog.duration;
            }
            this.form.resetForm();
            this.selectedRange = { start: null, end: null };
            this.toastrService.success('TIMER_TRACKER.ADD_TIME_SUCCESS');
        })
            .catch((error) => {
            this.toastrService.danger(error);
        });
    }
    setTimeType(type) {
        this.timeTrackerService.setTimeLogType(type);
    }
    /**
     * Draggable Web Timer Position
     *
     * @param event
     */
    draggablePosition(event) {
        this.position = event.position;
    }
    xor(a, b) {
        return (!a && b) || (a && !b);
    }
    ngOnDestroy() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TimeTrackerComponent, deps: [{ token: i1.TimeTrackerService }, { token: i1.TimesheetService }, { token: i1.ToastrService }, { token: i1.Store }, { token: i1.ErrorHandlingService }, { token: i2.NbThemeService }, { token: i3.NgxPermissionsService }, { token: i4.TimeTrackerStatusService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: TimeTrackerComponent, isStandalone: false, selector: "ngx-web-time-tracker", viewQueries: [{ propertyName: "form", first: true, predicate: NgForm, descendants: true }], ngImport: i0, template: "@if (isOpen) {\n<nb-card\n\tclass=\"timer-card card\"\n\t[class.collapsed]=\"!isExpanded\"\n\t[style.padding-bottom]=\"isExpanded ? '' : '0px'\"\n\t[class.background-basic-color-1]=\"theme === 'default' || theme === 'corporate' || theme === 'gauzy-light'\"\n\t[class.background-basic-color-2]=\"!(theme === 'default' || theme === 'corporate' || theme === 'gauzy-light')\"\n\t[style.transform]=\"'matrix(1, 0, 0, 1,' + this.position.x + ', ' + this.position.y + ')'\"\n\tngxDraggableDom=\"true\"\n\t(stopped)=\"draggablePosition($event)\"\n>\n\t<nb-card-body>\n\t\t<div class=\"header\">\n\t\t\t@if (!isExpanded) {\n\t\t\t<button nbButton ghost size=\"small\" (click)=\"isExpanded = true\">\n\t\t\t\t<nb-icon icon=\"expand-outline\"></nb-icon>\n\t\t\t</button>\n\t\t\t} @if (isExpanded) {\n\t\t\t<button\n\t\t\t\tnbButton\n\t\t\t\tghost\n\t\t\t\tsize=\"small\"\n\t\t\t\t(click)=\"$event.stopPropagation(); setTimeType(timeLogType.TRACKED); isExpanded = false\"\n\t\t\t>\n\t\t\t\t<nb-icon icon=\"minus-outline\"></nb-icon>\n\t\t\t</button>\n\t\t\t}\n\t\t\t<button class=\"btn-close\" size=\"small\" nbButton ghost (click)=\"toggleWindow()\">\n\t\t\t\t<nb-icon icon=\"close-outline\"></nb-icon>\n\t\t\t</button>\n\t\t</div>\n\t\t<form #form=\"ngForm\">\n\t\t\t<!--\n\t\t\t\tTitle and mode switch share one row. The switch used to be a third column of\n\t\t\t\t`.timer-container`, stacked vertically and pushed down by a `margin-top: 3.4rem`\n\t\t\t\tthat had to be re-guessed whenever the body beside it changed height \u2014 which is\n\t\t\t\twhat left it floating next to the heading instead of sitting on its baseline.\n\t\t\t-->\n\t\t\t@if (isExpanded) {\n\t\t\t<div class=\"panel-header\">\n\t\t\t\t<h6 class=\"panel-title\">\n\t\t\t\t\t{{\n\t\t\t\t\t\t((trackType$ | async) == timeLogType.MANUAL ? 'TIMER_TRACKER.ADD_TIME' : 'TIMER_TRACKER.TIMER')\n\t\t\t\t\t\t\t| translate\n\t\t\t\t\t}}\n\t\t\t\t</h6>\n\t\t\t\t<ng-container [ngTemplateOutlet]=\"modeSwitch\"></ng-container>\n\t\t\t</div>\n\t\t\t}\n\t\t\t<!--\n\t\t\t\tOnly the fields scroll. The window controls and the title row stay\n\t\t\t\toutside this box so they hold still, and the manual view \u2014 which adds\n\t\t\t\tthe date and start/end rows \u2014 scrolls inside it rather than making the\n\t\t\t\twhole card taller than the timer view.\n\t\t\t-->\n\t\t\t<div class=\"panel-scroll\">\n\t\t\t\t<div [style.margin]=\"isExpanded ? '' : '0px'\" class=\"timer-container form-group\">\n\t\t\t\t@if ((trackType$ | async) == timeLogType.TRACKED) {\n\t\t\t\t<div class=\"timer\">\n\t\t\t\t\t<div class=\"time-tracker\">\n\t\t\t\t\t\t<div class=\"is_billable\">\n\t\t\t\t\t\t\t<button\n\t\t\t\t\t\t\t\tnbButton\n\t\t\t\t\t\t\t\ttype=\"button\"\n\t\t\t\t\t\t\t\t(click)=\"$event.stopPropagation(); isBillable = !isBillable\"\n\t\t\t\t\t\t\t\tsize=\"small\"\n\t\t\t\t\t\t\t\t[status]=\"isBillable ? 'primary' : 'basic'\"\n\t\t\t\t\t\t\t\t[nbTooltip]=\"'TIMER_TRACKER.IS_BILLABLE' | translate\"\n\t\t\t\t\t\t\t\t[disabled]=\"running\"\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t$\n\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"time-count\">\n\t\t\t\t\t\t\t<div class=\"session\">\n\t\t\t\t\t\t\t\t<span class=\"current-session\">\n\t\t\t\t\t\t\t\t\t{{ currentSessionTime }}\n\t\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t\t<ga-time-tracker-status class=\"status\"></ga-time-tracker-status>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<span class=\"today-time\">\n\t\t\t\t\t\t\t\t{{ 'TIMER_TRACKER.TODAY' | translate }}\n\t\t\t\t\t\t\t\t{{ todaySessionTime }}\n\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"actions\">\n\t\t\t\t\t\t\t<div class=\"toggle\">\n\t\t\t\t\t\t\t\t<button\n\t\t\t\t\t\t\t\t\tnbButton\n\t\t\t\t\t\t\t\t\ttype=\"submit\"\n\t\t\t\t\t\t\t\t\t[status]=\"running ? 'danger' : 'success'\"\n\t\t\t\t\t\t\t\t\t[class.button]=\"!running\"\n\t\t\t\t\t\t\t\t\t[class.success]=\"!running\"\n\t\t\t\t\t\t\t\t\tshape=\"round\"\n\t\t\t\t\t\t\t\t\t[nbTooltip]=\"\n\t\t\t\t\t\t\t\t\t\t(running ? 'TIMER_TRACKER.STOP_TIMER' : 'TIMER_TRACKER.START_TIMER') | translate\n\t\t\t\t\t\t\t\t\t\"\n\t\t\t\t\t\t\t\t\t(click)=\"toggleTimer(true)\"\n\t\t\t\t\t\t\t\t\t[disabled]=\"isDisable\"\n\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t<fa-icon [icon]=\"!running ? play : pause\"></fa-icon>\n\t\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t} @if ((trackType$ | async) == timeLogType.MANUAL) {\n\t\t\t\t<div class=\"time-manual\">\n\t\t\t\t\t<ngx-timer-range-picker\n\t\t\t\t\t\tclass=\"custom-range-picker\"\n\t\t\t\t\t\tname=\"selectedRange\"\n\t\t\t\t\t\t[maxDate]=\"allowFutureDate ? null : today\"\n\t\t\t\t\t\t[(ngModel)]=\"selectedRange\"\n\t\t\t\t\t></ngx-timer-range-picker>\n\t\t\t\t\t<nb-checkbox class=\"billable-check\" [(ngModel)]=\"isBillable\" name=\"isBillable\" status=\"primary\">\n\t\t\t\t\t\t<span [class.primary]=\"isBillable\">\n\t\t\t\t\t\t\t{{ 'TIMER_TRACKER.IS_BILLABLE' | translate }}\n\t\t\t\t\t\t</span>\n\t\t\t\t\t</nb-checkbox>\n\t\t\t\t</div>\n\t\t\t\t}\n\t\t\t\t<!-- Collapsed has no title row to hang the switch off, so it sits beside the timer. -->\n\t\t\t\t@if (!isExpanded) {\n\t\t\t\t<ng-container [ngTemplateOutlet]=\"modeSwitch\"></ng-container>\n\t\t\t\t}\n\t\t\t</div>\n\t\t\t@if (isExpanded) {\n\t\t\t<div>\n\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t<label>\n\t\t\t\t\t\t{{ 'TIMER_TRACKER.SELECT_CLIENT' | translate }}\n\t\t\t\t\t</label>\n\t\t\t\t\t<ga-contact-selector\n\t\t\t\t\t\tname=\"organizationContactId\"\n\t\t\t\t\t\t[employeeId]=\"employee?.id\"\n\t\t\t\t\t\t[disabled]=\"running\"\n\t\t\t\t\t\t[placeholder]=\"'TIMER_TRACKER.PLACEHOLDERS.SELECT_CLIENT' | translate\"\n\t\t\t\t\t\t[(ngModel)]=\"organizationContactId\"\n\t\t\t\t\t\t#clientInput=\"ngModel\"\n\t\t\t\t\t\t[required]=\"organization?.requireClient\"\n\t\t\t\t\t></ga-contact-selector>\n\t\t\t\t\t@if (clientInput.invalid && form.submitted) {\n\t\t\t\t\t<div class=\"invalid-feedback d-block\">\n\t\t\t\t\t\t@if (clientInput.errors.required) {\n\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t{{ 'TIMER_TRACKER.VALIDATION.CLIENT_REQUIRED' | translate }}\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t}\n\t\t\t\t\t</div>\n\t\t\t\t\t}\n\t\t\t\t</div>\n\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t<label>\n\t\t\t\t\t\t{{ 'TIMER_TRACKER.SELECT_PROJECT' | translate }}\n\t\t\t\t\t</label>\n\t\t\t\t\t<ga-project-selector\n\t\t\t\t\t\tname=\"projectId\"\n\t\t\t\t\t\t[skipGlobalChange]=\"true\"\n\t\t\t\t\t\t[showAllOption]=\"false\"\n\t\t\t\t\t\t[placeholder]=\"'TIMER_TRACKER.PLACEHOLDERS.SELECT_PROJECT' | translate\"\n\t\t\t\t\t\t[defaultSelected]=\"false\"\n\t\t\t\t\t\t[organizationContactId]=\"organizationContactId\"\n\t\t\t\t\t\t[employeeId]=\"employee?.id\"\n\t\t\t\t\t\t[disabled]=\"running\"\n\t\t\t\t\t\t[(ngModel)]=\"projectId\"\n\t\t\t\t\t\t#projectInput=\"ngModel\"\n\t\t\t\t\t\t[required]=\"organization?.requireProject\"\n\t\t\t\t\t></ga-project-selector>\n\t\t\t\t\t@if (projectInput.invalid && form.submitted) {\n\t\t\t\t\t<div class=\"invalid-feedback d-block\">\n\t\t\t\t\t\t@if (projectInput.errors.required) {\n\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t{{ 'TIMER_TRACKER.VALIDATION.PROJECT_REQUIRED' | translate }}\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t}\n\t\t\t\t\t</div>\n\t\t\t\t\t}\n\t\t\t\t</div>\n\t\t\t\t<!-- Team Selector Start -->\n\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t<label>\n\t\t\t\t\t\t{{ 'TIMER_TRACKER.SELECT_TEAM' | translate }}\n\t\t\t\t\t</label>\n\t\t\t\t\t<ga-team-selector\n\t\t\t\t\t\tname=\"organizationTeamId\"\n\t\t\t\t\t\t[skipGlobalChange]=\"true\"\n\t\t\t\t\t\t[showAllOption]=\"false\"\n\t\t\t\t\t\t[defaultSelected]=\"false\"\n\t\t\t\t\t\t[placeholder]=\"'TIMER_TRACKER.PLACEHOLDERS.SELECT_TEAM' | translate\"\n\t\t\t\t\t\t[employeeId]=\"employee?.id\"\n\t\t\t\t\t\t[projectId]=\"projectId\"\n\t\t\t\t\t\t[(ngModel)]=\"organizationTeamId\"\n\t\t\t\t\t\t[required]=\"false\"\n\t\t\t\t\t></ga-team-selector>\n\t\t\t\t</div>\n\t\t\t\t<!-- Team Selector Emd -->\n\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t<label>\n\t\t\t\t\t\t{{ 'TIMER_TRACKER.SELECT_TASK' | translate }}\n\t\t\t\t\t</label>\n\t\t\t\t\t<ga-task-selector\n\t\t\t\t\t\tname=\"taskId\"\n\t\t\t\t\t\t[projectId]=\"projectId\"\n\t\t\t\t\t\t[employeeId]=\"employee?.id\"\n\t\t\t\t\t\t[disabled]=\"running\"\n\t\t\t\t\t\t[placeholder]=\"'TIMER_TRACKER.PLACEHOLDERS.SELECT_TASK' | translate\"\n\t\t\t\t\t\t[(ngModel)]=\"taskId\"\n\t\t\t\t\t\t#taskInput=\"ngModel\"\n\t\t\t\t\t\t[required]=\"organization?.requireTask\"\n\t\t\t\t\t></ga-task-selector>\n\t\t\t\t\t@if (taskInput.invalid && form.submitted) {\n\t\t\t\t\t<div class=\"invalid-feedback d-block\">\n\t\t\t\t\t\t@if (taskInput.errors.required) {\n\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t{{ 'TIMER_TRACKER.VALIDATION.TASK_REQUIRED' | translate }}\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t}\n\t\t\t\t\t</div>\n\t\t\t\t\t}\n\t\t\t\t</div>\n\t\t\t\t<div class=\"form-group custom\">\n\t\t\t\t\t<label>\n\t\t\t\t\t\t{{ 'TIMER_TRACKER.DESCRIPTION' | translate }}\n\t\t\t\t\t</label>\n\t\t\t\t\t<textarea\n\t\t\t\t\t\tclass=\"form-control\"\n\t\t\t\t\t\trows=\"2\"\n\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t[placeholder]=\"'TIMER_TRACKER.PLACEHOLDERS.DESCRIPTION' | translate\"\n\t\t\t\t\t\tname=\"description\"\n\t\t\t\t\t\t[disabled]=\"running\"\n\t\t\t\t\t\t[(ngModel)]=\"description\"\n\t\t\t\t\t\t#descriptionInput=\"ngModel\"\n\t\t\t\t\t\t[required]=\"organization?.requireDescription\"\n\t\t\t\t\t></textarea>\n\t\t\t\t\t@if (descriptionInput.invalid && form.submitted) {\n\t\t\t\t\t<div class=\"invalid-feedback d-block\">\n\t\t\t\t\t\t@if (descriptionInput.errors.required) {\n\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t{{ 'TIMER_TRACKER.VALIDATION.DESCRIPTION_REQUIRED' | translate }}\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t}\n\t\t\t\t\t</div>\n\t\t\t\t\t}\n\t\t\t\t</div>\n\t\t\t\t@if (user?.employee?.id) {\n\t\t\t\t<div class=\"view-log-button\">\n\t\t\t\t\t<ng-template [ngxPermissionsOnly]=\"PermissionsEnum.ALLOW_MANUAL_TIME\">\n\t\t\t\t\t\t<ng-template ngxTimeTrackingAuthorized [permission]=\"PermissionsEnum.ALLOW_MANUAL_TIME\">\n\t\t\t\t\t\t\t@if ((trackType$ | async) == timeLogType.MANUAL) {\n\t\t\t\t\t\t\t<div class=\"time-manual\">\n\t\t\t\t\t\t\t\t<button\n\t\t\t\t\t\t\t\t\tnbButton\n\t\t\t\t\t\t\t\t\tstatus=\"success\"\n\t\t\t\t\t\t\t\t\tclass=\"button success add\"\n\t\t\t\t\t\t\t\t\tsize=\"medium\"\n\t\t\t\t\t\t\t\t\t(click)=\"addTime()\"\n\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t{{ 'TIMER_TRACKER.ADD_TIME' | translate }}\n\t\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t</ng-template>\n\t\t\t\t\t</ng-template>\n\t\t\t\t\t<!--\n\t\t\t\t\t\tThe tracked-mode \"Start timer\" button that sat here is gone: it did\n\t\t\t\t\t\tthe same `toggleTimer(true)` as the round play control in the timer\n\t\t\t\t\t\trow above, so the panel was spending a full button row on a second\n\t\t\t\t\t\tcopy of a control it already shows.\n\t\t\t\t\t-->\n\t\t\t\t\t<a class=\"timesheet-link\" [routerLink]=\"['/pages/employees/timesheets']\">\n\t\t\t\t\t\t{{ 'TIMER_TRACKER.VIEW_TIMESHEET' | translate }}\n\t\t\t\t\t</a>\n\t\t\t\t</div>\n\t\t\t\t}\n\t\t\t</div>\n\t\t\t}\n\t\t\t</div>\n\t\t</form>\n\t</nb-card-body>\n\t<nb-card-footer [style.visibility]=\"hideAlert ? 'hidden' : 'visible'\">\n\t\t<nb-alert (close)=\"hideAlert = true\" status=\"primary\" class=\"alert\" closable>\n\t\t\t<nb-icon size=\"tiny\" icon=\"info-outline\"></nb-icon>\n\t\t\t<div\n\t\t\t\t[innerHTML]=\"\n\t\t\t\t\t'TIMER_TRACKER.ALERT_DESKTOP_DOWNLOAD' | translate : { downloadURL: PLATFORM_WEBSITE_DOWNLOAD_URL }\n\t\t\t\t\"\n\t\t\t></div>\n\t\t</nb-alert>\n\t</nb-card-footer>\n</nb-card>\n}\n\n<!--\n\tDeclared at the top level of the template so both call sites above can reach it:\n\ta reference is visible to the views nested inside the one that declares it, and\n\tthe expanded / collapsed branches are two such nested views.\n-->\n<ng-template #modeSwitch>\n\t<div class=\"mode-switch\">\n\t\t<button\n\t\t\tnbButton\n\t\t\ttype=\"button\"\n\t\t\t(click)=\"$event.stopPropagation(); setTimeType(timeLogType.TRACKED)\"\n\t\t\tsize=\"tiny\"\n\t\t\t[status]=\"(trackType$ | async) == timeLogType.TRACKED ? 'primary' : 'basic'\"\n\t\t\tclass=\"switch\"\n\t\t\t[nbTooltip]=\"'TIMER_TRACKER.TIMER' | translate\"\n\t\t\t[disabled]=\"running\"\n\t\t>\n\t\t\t<fa-icon [icon]=\"stopwatch\"></fa-icon>\n\t\t</button>\n\t\t<span\n\t\t\t[nbTooltip]=\"\n\t\t\t\t(organization?.allowManualTime ? 'TIMER_TRACKER.MANUAL' : 'TIMER_TRACKER.MANUAL_NOT_ALLOW') | translate\n\t\t\t\"\n\t\t>\n\t\t\t<button\n\t\t\t\tnbButton\n\t\t\t\ttype=\"button\"\n\t\t\t\t(click)=\"$event.stopPropagation(); setTimeType(timeLogType.MANUAL); isExpanded = true\"\n\t\t\t\tsize=\"tiny\"\n\t\t\t\t[status]=\"(trackType$ | async) == timeLogType.MANUAL ? 'primary' : 'basic'\"\n\t\t\t\tclass=\"switch\"\n\t\t\t\t[disabled]=\"running || !organization?.allowManualTime\"\n\t\t\t>\n\t\t\t\t<nb-icon icon=\"menu-outline\"></nb-icon>\n\t\t\t</button>\n\t\t</span>\n\t</div>\n</ng-template>\n", styles: ["@charset \"UTF-8\";:host{position:fixed;height:0;z-index:999;right:20px;top:80px}:host nb-card{border:none}:host .timer-card{display:block;padding:20px 20px 0;width:328px;font-size:14px;position:relative;box-shadow:0 6px 30px #0003;border-radius:var(--border-radius)}:host .background-basic-color-1{background-color:var(--background-basic-color-1)}:host .background-basic-color-2{background-color:var(--background-basic-color-2)}:host .header{position:absolute;display:flex;justify-content:flex-end;width:300px;top:0}:host .header nb-icon{width:.875rem;height:.875rem;font-size:.875rem}:host .panel-header{display:flex;align-items:center;justify-content:space-between;gap:.75rem;margin:0 0 1rem}:host .panel-header .panel-title{color:var(--text-primary-color);margin:0}:host [nbButton].appearance-filled.status-primary[disabled]{background-color:var(--text-primary-active-color);border-color:var(--text-primary-active-color);color:#fff;opacity:.4}:host .mode-switch{display:flex;flex-direction:row;align-items:center;gap:2px;flex:0 0 auto;padding:2px;border-radius:var(--border-radius);background-color:var(--gauzy-sidebar-background-4);box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18))}:host .mode-switch>span{display:inline-flex}:host .mode-switch button.switch{width:1.5rem;height:1.5rem;min-width:0;margin:0;padding:0;display:inline-flex;align-items:center;justify-content:center;border:none;border-radius:calc(var(--border-radius) - 2px);box-shadow:none}:host .mode-switch button.switch.status-basic{background-color:transparent;color:var(--gauzy-text-color-2)}:host .mode-switch button.switch.status-basic nb-icon,:host .mode-switch button.switch.status-basic svg{color:inherit;fill:currentColor}:host .mode-switch button.switch.status-basic:hover:not([disabled]){background-color:var(--background-basic-color-3);color:var(--text-basic-color)}:host .mode-switch button.switch svg{width:11px;margin:0}:host .mode-switch button.switch nb-icon{height:13px;width:13px}:host .mode-switch button.switch.status-primary nb-icon{color:#fff}:host .timer-container{display:flex;align-items:center}:host .timer-container .mode-switch{margin-left:.625rem}:host .timer-container .time-tracker{width:100%;display:flex;align-items:center}:host .timer-container .is_billable{align-self:flex-start;display:flex;align-items:center;height:1.625rem}:host .timer-container .is_billable button{font-size:12px;padding:0 9px;height:100%;display:inline-flex;align-items:center;justify-content:center}:host .timer-container .actions{display:flex;align-items:center;padding-left:14px}:host .timer-container .time-count{font-size:22px;width:100%;padding:0 10px;text-align:left;display:flex;flex-direction:column}:host .timer-container .time-count .session{display:flex;align-items:center;gap:.5rem;min-height:1.625rem}:host .timer-container .time-count .status{display:inline-flex;align-items:center;font-size:1rem;line-height:1}:host .timer-container .time-count .today-time{font-size:.6em;line-height:1;margin-top:.5rem;color:var(--gauzy-text-color-2)}:host .timer-container .time-count .current-session{font-weight:400;line-height:1.625rem}:host .timer-container .toggle [nbButton].appearance-filled.size-medium,:host .timer-container .toggle [nbButton].appearance-filled.status-danger{width:2.5rem;height:2.5rem;padding:0;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto}:host .timer-container .toggle fa-icon{margin:0;padding:0;display:inline-flex;line-height:1}:host .timer-container .timer,:host .timer-container .time-manual{display:flex;flex-direction:column;width:100%;gap:1rem}:host ::ng-deep ng-select .ng-select-container{width:100%}:host .form-group{margin-bottom:calc(1rem - 5px)}:host .panel-scroll{max-height:min(32rem,100vh - 100px);overflow-y:auto;overflow-x:hidden;margin-right:-16px;padding-right:16px}:host .panel-scroll::-webkit-scrollbar{width:6px}:host .panel-scroll::-webkit-scrollbar-track{background:transparent}:host .panel-scroll::-webkit-scrollbar-thumb{background:var(--gauzy-scrollbar);border-radius:1rem}:host .panel-scroll{scrollbar-width:thin}:host .timer-card.collapsed .panel-scroll{max-height:none;overflow:visible;margin-right:0;padding-right:0}.custom textarea{color:var(--text-basic-color);box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));resize:none;width:100%;height:84px;border-radius:var(--border-radius);font-size:var(--select-medium-text-font-size);line-height:1.5;font-family:inherit}.custom textarea:hover,.custom textarea:focus{box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));color:var(--text-basic-color)}.primary{color:var(--text-primary-color)}.custom-range-picker{display:block}.custom-range-picker ::ng-deep .row{margin-left:0;margin-right:0}.custom-range-picker ::ng-deep .row.range{display:flex;gap:.5rem}.custom-range-picker ::ng-deep .col-12,.custom-range-picker ::ng-deep .col-6{flex:1;max-width:none;padding-left:0;padding-right:0}.custom-range-picker ::ng-deep .form-group{margin-bottom:0}.custom-range-picker ::ng-deep .row+.row{margin-top:calc(1rem - 5px)}:host .custom-range-picker ::ng-deep label,:host .custom-range-picker ::ng-deep .label{font-size:.625rem}:host .custom-range-picker ::ng-deep .row.range .ng-select .ng-select-container .ng-value-container{padding-inline-start:.5rem!important}:host .custom-range-picker ::ng-deep .input{width:100%;height:calc(var(--select-medium-text-line-height) + .4375rem * 2);box-shadow:none}:host .custom-range-picker ::ng-deep input{width:100%;height:100%;padding:0 2rem 0 1rem;font-size:var(--select-medium-text-font-size);font-family:inherit;border-radius:var(--border-radius);box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18))}.billable-check ::ng-deep .text{font-size:var(--select-medium-text-font-size)}.view-log-button{display:flex;justify-content:space-between;align-items:center;gap:.75rem;margin-top:1rem}.view-log-button .button.success.add{height:36px;display:inline-flex;align-items:center;justify-content:center;padding:0 20px;font-size:14px;flex:0 0 auto;width:120px}.timesheet-link{color:var(--text-primary-color);font-size:var(--select-medium-text-font-size);font-weight:600;text-decoration:underline;white-space:nowrap;cursor:pointer}.timesheet-link:hover,.timesheet-link:focus-visible{color:var(--text-primary-hover-color);text-decoration:underline}.button{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.button,h6{text-transform:lowercase}.button:first-letter,h6:first-letter{text-transform:uppercase}:host ::ng-deep input,:host ::ng-deep nb-select.appearance-outline.status-basic .select-button,:host ::ng-deep .ng-select .ng-select-container{background-color:var(--gauzy-sidebar-background-4)!important;border:none;min-height:calc(var(--select-medium-text-line-height) + .4375rem * 2)!important}:host ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-placeholder,:host ::ng-deep .ng-select.ng-select-single .ng-select-container .ng-value-container .ng-input{top:unset!important}:host ::ng-deep label,:host ::ng-deep .label{font-size:var(--text-label-font-size);font-weight:600;line-height:.8125rem;letter-spacing:-.01em;color:var(--gauzy-text-color-2)}:host ::ng-deep textarea{background-color:var(--gauzy-sidebar-background-4)!important;border:none}:host ::ng-deep .ng-select .ng-select-container input,:host ::ng-deep nb-tag-list input{background-color:unset!important}:host nb-card{background-color:var(--gauzy-card-1)}nb-card-footer{position:absolute;width:calc(100% + 48px);left:-24px;bottom:-128px}nb-card-footer .alert{width:100%;display:flex;flex-direction:row;align-items:flex-start;gap:.25rem;font-size:12px;border-radius:var(--border-radius)}nb-card-footer .alert nb-icon{width:30px;height:18px}nb-card-footer .alert div{line-height:1.5em}nb-card-footer .alert ::ng-deep .close{padding:4px 8px;font-size:1rem}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "directive", type: i5.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i6.ɵNgNoValidate, selector: "form:not([ngNoForm]):not([ngNativeValidate])" }, { kind: "directive", type: i6.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i6.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i6.NgControlStatusGroup, selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],[formArray],form:not([ngNoForm]),[ngForm]" }, { kind: "directive", type: i6.RequiredValidator, selector: ":not([type=checkbox])[required][formControlName],:not([type=checkbox])[required][formControl],:not([type=checkbox])[required][ngModel]", inputs: ["required"] }, { kind: "directive", type: i6.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "directive", type: i6.NgForm, selector: "form:not([ngNoForm]):not([formGroup]):not([formArray]),ng-form,[ngForm]", inputs: ["ngFormOptions"], outputs: ["ngSubmit"], exportAs: ["ngForm"] }, { kind: "directive", type: i7.RouterLink, selector: "[routerLink]", inputs: ["target", "queryParams", "fragment", "queryParamsHandling", "state", "info", "relativeTo", "preserveFragment", "skipLocationChange", "replaceUrl", "routerLink"] }, { kind: "component", type: i8.FaIconComponent, selector: "fa-icon", inputs: ["icon", "title", "animation", "mask", "flip", "size", "pull", "border", "inverse", "symbol", "rotate", "fixedWidth", "transform", "a11yRole"], outputs: ["iconChange", "titleChange", "animationChange", "maskChange", "flipChange", "sizeChange", "pullChange", "borderChange", "inverseChange", "symbolChange", "rotateChange", "fixedWidthChange", "transformChange", "a11yRoleChange"] }, { kind: "component", type: i2.NbAlertComponent, selector: "nb-alert", inputs: ["size", "status", "accent", "outline", "closable"], outputs: ["close"] }, { kind: "component", type: i2.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "component", type: i2.NbCheckboxComponent, selector: "nb-checkbox", inputs: ["checked", "disabled", "status", "indeterminate"], outputs: ["checkedChange"] }, { kind: "component", type: i2.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "directive", type: i2.NbTooltipDirective, selector: "[nbTooltip]", inputs: ["nbTooltip", "nbTooltipPlacement", "nbTooltipAdjustment", "nbTooltipClass", "nbTooltipIcon", "nbTooltipStatus", "nbTooltipTrigger", "nbTooltipOffset", "nbTooltipDisabled"], outputs: ["nbTooltipShowStateChange"], exportAs: ["nbTooltip"] }, { kind: "directive", type: i9.NgxDraggableDomDirective, selector: "[ngxDraggableDom]", inputs: ["bounds", "constrainByBounds", "handle", "requireMouseOver", "requireMouseOverBounds", "ignoreMultiTouchEvents", "ngxDraggableDom"], outputs: ["started", "stopped", "moved", "edge"] }, { kind: "directive", type: i3.NgxPermissionsDirective, selector: "[ngxPermissionsOnly],[ngxPermissionsExcept]", inputs: ["ngxPermissionsOnly", "ngxPermissionsOnlyThen", "ngxPermissionsOnlyElse", "ngxPermissionsExcept", "ngxPermissionsExceptElse", "ngxPermissionsExceptThen", "ngxPermissionsThen", "ngxPermissionsElse", "ngxPermissionsOnlyAuthorisedStrategy", "ngxPermissionsOnlyUnauthorisedStrategy", "ngxPermissionsExceptUnauthorisedStrategy", "ngxPermissionsExceptAuthorisedStrategy", "ngxPermissionsUnauthorisedStrategy", "ngxPermissionsAuthorisedStrategy"], outputs: ["permissionsAuthorized", "permissionsUnauthorized"] }, { kind: "directive", type: i10.TimeTrackingAuthorizedDirective, selector: "[ngxTimeTrackingAuthorized]", inputs: ["permission", "permissionElse"] }, { kind: "component", type: i11.TimerRangePickerComponent, selector: "ngx-timer-range-picker", inputs: ["slotStartTime", "slotEndTime", "allowedDuration", "disableEndPicker", "disableDatePicker", "fromEmployeeAppointment", "timezoneOffset", "maxDate", "minDate", "disabledDates"] }, { kind: "component", type: i12.TaskSelectorComponent, selector: "ga-task-selector", inputs: ["placeholder", "multiple", "disabled", "addTag", "projectId", "employeeId"] }, { kind: "component", type: i13.ProjectSelectorComponent, selector: "ga-project-selector", inputs: ["shortened", "dropdownClass", "disabled", "multiple", "label", "placeholder", "skipGlobalChange", "defaultSelected", "showAllOption", "projectId", "employeeId", "organizationContactId"], outputs: ["onChanged"] }, { kind: "component", type: i14.TeamSelectorComponent, selector: "ga-team-selector", inputs: ["shortened", "dropdownClass", "disabled", "multiple", "label", "placeholder", "skipGlobalChange", "defaultSelected", "showAllOption", "organizationTeamId", "employeeId", "projectId"], outputs: ["onChanged"] }, { kind: "component", type: i15.ContactSelectorComponent, selector: "ga-contact-selector", inputs: ["disabled", "multiple", "placeholder", "employeeId", "contactId"] }, { kind: "component", type: i16.TimeTrackerStatusComponent, selector: "ga-time-tracker-status" }, { kind: "pipe", type: i5.AsyncPipe, name: "async" }, { kind: "pipe", type: i17.TranslatePipe, name: "translate" }] }); }
};
TimeTrackerComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [TimeTrackerService,
        TimesheetService,
        ToastrService,
        Store,
        ErrorHandlingService,
        NbThemeService,
        NgxPermissionsService,
        TimeTrackerStatusService])
], TimeTrackerComponent);
export { TimeTrackerComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TimeTrackerComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-web-time-tracker', standalone: false, template: "@if (isOpen) {\n<nb-card\n\tclass=\"timer-card card\"\n\t[class.collapsed]=\"!isExpanded\"\n\t[style.padding-bottom]=\"isExpanded ? '' : '0px'\"\n\t[class.background-basic-color-1]=\"theme === 'default' || theme === 'corporate' || theme === 'gauzy-light'\"\n\t[class.background-basic-color-2]=\"!(theme === 'default' || theme === 'corporate' || theme === 'gauzy-light')\"\n\t[style.transform]=\"'matrix(1, 0, 0, 1,' + this.position.x + ', ' + this.position.y + ')'\"\n\tngxDraggableDom=\"true\"\n\t(stopped)=\"draggablePosition($event)\"\n>\n\t<nb-card-body>\n\t\t<div class=\"header\">\n\t\t\t@if (!isExpanded) {\n\t\t\t<button nbButton ghost size=\"small\" (click)=\"isExpanded = true\">\n\t\t\t\t<nb-icon icon=\"expand-outline\"></nb-icon>\n\t\t\t</button>\n\t\t\t} @if (isExpanded) {\n\t\t\t<button\n\t\t\t\tnbButton\n\t\t\t\tghost\n\t\t\t\tsize=\"small\"\n\t\t\t\t(click)=\"$event.stopPropagation(); setTimeType(timeLogType.TRACKED); isExpanded = false\"\n\t\t\t>\n\t\t\t\t<nb-icon icon=\"minus-outline\"></nb-icon>\n\t\t\t</button>\n\t\t\t}\n\t\t\t<button class=\"btn-close\" size=\"small\" nbButton ghost (click)=\"toggleWindow()\">\n\t\t\t\t<nb-icon icon=\"close-outline\"></nb-icon>\n\t\t\t</button>\n\t\t</div>\n\t\t<form #form=\"ngForm\">\n\t\t\t<!--\n\t\t\t\tTitle and mode switch share one row. The switch used to be a third column of\n\t\t\t\t`.timer-container`, stacked vertically and pushed down by a `margin-top: 3.4rem`\n\t\t\t\tthat had to be re-guessed whenever the body beside it changed height \u2014 which is\n\t\t\t\twhat left it floating next to the heading instead of sitting on its baseline.\n\t\t\t-->\n\t\t\t@if (isExpanded) {\n\t\t\t<div class=\"panel-header\">\n\t\t\t\t<h6 class=\"panel-title\">\n\t\t\t\t\t{{\n\t\t\t\t\t\t((trackType$ | async) == timeLogType.MANUAL ? 'TIMER_TRACKER.ADD_TIME' : 'TIMER_TRACKER.TIMER')\n\t\t\t\t\t\t\t| translate\n\t\t\t\t\t}}\n\t\t\t\t</h6>\n\t\t\t\t<ng-container [ngTemplateOutlet]=\"modeSwitch\"></ng-container>\n\t\t\t</div>\n\t\t\t}\n\t\t\t<!--\n\t\t\t\tOnly the fields scroll. The window controls and the title row stay\n\t\t\t\toutside this box so they hold still, and the manual view \u2014 which adds\n\t\t\t\tthe date and start/end rows \u2014 scrolls inside it rather than making the\n\t\t\t\twhole card taller than the timer view.\n\t\t\t-->\n\t\t\t<div class=\"panel-scroll\">\n\t\t\t\t<div [style.margin]=\"isExpanded ? '' : '0px'\" class=\"timer-container form-group\">\n\t\t\t\t@if ((trackType$ | async) == timeLogType.TRACKED) {\n\t\t\t\t<div class=\"timer\">\n\t\t\t\t\t<div class=\"time-tracker\">\n\t\t\t\t\t\t<div class=\"is_billable\">\n\t\t\t\t\t\t\t<button\n\t\t\t\t\t\t\t\tnbButton\n\t\t\t\t\t\t\t\ttype=\"button\"\n\t\t\t\t\t\t\t\t(click)=\"$event.stopPropagation(); isBillable = !isBillable\"\n\t\t\t\t\t\t\t\tsize=\"small\"\n\t\t\t\t\t\t\t\t[status]=\"isBillable ? 'primary' : 'basic'\"\n\t\t\t\t\t\t\t\t[nbTooltip]=\"'TIMER_TRACKER.IS_BILLABLE' | translate\"\n\t\t\t\t\t\t\t\t[disabled]=\"running\"\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t$\n\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"time-count\">\n\t\t\t\t\t\t\t<div class=\"session\">\n\t\t\t\t\t\t\t\t<span class=\"current-session\">\n\t\t\t\t\t\t\t\t\t{{ currentSessionTime }}\n\t\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t\t<ga-time-tracker-status class=\"status\"></ga-time-tracker-status>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<span class=\"today-time\">\n\t\t\t\t\t\t\t\t{{ 'TIMER_TRACKER.TODAY' | translate }}\n\t\t\t\t\t\t\t\t{{ todaySessionTime }}\n\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"actions\">\n\t\t\t\t\t\t\t<div class=\"toggle\">\n\t\t\t\t\t\t\t\t<button\n\t\t\t\t\t\t\t\t\tnbButton\n\t\t\t\t\t\t\t\t\ttype=\"submit\"\n\t\t\t\t\t\t\t\t\t[status]=\"running ? 'danger' : 'success'\"\n\t\t\t\t\t\t\t\t\t[class.button]=\"!running\"\n\t\t\t\t\t\t\t\t\t[class.success]=\"!running\"\n\t\t\t\t\t\t\t\t\tshape=\"round\"\n\t\t\t\t\t\t\t\t\t[nbTooltip]=\"\n\t\t\t\t\t\t\t\t\t\t(running ? 'TIMER_TRACKER.STOP_TIMER' : 'TIMER_TRACKER.START_TIMER') | translate\n\t\t\t\t\t\t\t\t\t\"\n\t\t\t\t\t\t\t\t\t(click)=\"toggleTimer(true)\"\n\t\t\t\t\t\t\t\t\t[disabled]=\"isDisable\"\n\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t<fa-icon [icon]=\"!running ? play : pause\"></fa-icon>\n\t\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t} @if ((trackType$ | async) == timeLogType.MANUAL) {\n\t\t\t\t<div class=\"time-manual\">\n\t\t\t\t\t<ngx-timer-range-picker\n\t\t\t\t\t\tclass=\"custom-range-picker\"\n\t\t\t\t\t\tname=\"selectedRange\"\n\t\t\t\t\t\t[maxDate]=\"allowFutureDate ? null : today\"\n\t\t\t\t\t\t[(ngModel)]=\"selectedRange\"\n\t\t\t\t\t></ngx-timer-range-picker>\n\t\t\t\t\t<nb-checkbox class=\"billable-check\" [(ngModel)]=\"isBillable\" name=\"isBillable\" status=\"primary\">\n\t\t\t\t\t\t<span [class.primary]=\"isBillable\">\n\t\t\t\t\t\t\t{{ 'TIMER_TRACKER.IS_BILLABLE' | translate }}\n\t\t\t\t\t\t</span>\n\t\t\t\t\t</nb-checkbox>\n\t\t\t\t</div>\n\t\t\t\t}\n\t\t\t\t<!-- Collapsed has no title row to hang the switch off, so it sits beside the timer. -->\n\t\t\t\t@if (!isExpanded) {\n\t\t\t\t<ng-container [ngTemplateOutlet]=\"modeSwitch\"></ng-container>\n\t\t\t\t}\n\t\t\t</div>\n\t\t\t@if (isExpanded) {\n\t\t\t<div>\n\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t<label>\n\t\t\t\t\t\t{{ 'TIMER_TRACKER.SELECT_CLIENT' | translate }}\n\t\t\t\t\t</label>\n\t\t\t\t\t<ga-contact-selector\n\t\t\t\t\t\tname=\"organizationContactId\"\n\t\t\t\t\t\t[employeeId]=\"employee?.id\"\n\t\t\t\t\t\t[disabled]=\"running\"\n\t\t\t\t\t\t[placeholder]=\"'TIMER_TRACKER.PLACEHOLDERS.SELECT_CLIENT' | translate\"\n\t\t\t\t\t\t[(ngModel)]=\"organizationContactId\"\n\t\t\t\t\t\t#clientInput=\"ngModel\"\n\t\t\t\t\t\t[required]=\"organization?.requireClient\"\n\t\t\t\t\t></ga-contact-selector>\n\t\t\t\t\t@if (clientInput.invalid && form.submitted) {\n\t\t\t\t\t<div class=\"invalid-feedback d-block\">\n\t\t\t\t\t\t@if (clientInput.errors.required) {\n\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t{{ 'TIMER_TRACKER.VALIDATION.CLIENT_REQUIRED' | translate }}\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t}\n\t\t\t\t\t</div>\n\t\t\t\t\t}\n\t\t\t\t</div>\n\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t<label>\n\t\t\t\t\t\t{{ 'TIMER_TRACKER.SELECT_PROJECT' | translate }}\n\t\t\t\t\t</label>\n\t\t\t\t\t<ga-project-selector\n\t\t\t\t\t\tname=\"projectId\"\n\t\t\t\t\t\t[skipGlobalChange]=\"true\"\n\t\t\t\t\t\t[showAllOption]=\"false\"\n\t\t\t\t\t\t[placeholder]=\"'TIMER_TRACKER.PLACEHOLDERS.SELECT_PROJECT' | translate\"\n\t\t\t\t\t\t[defaultSelected]=\"false\"\n\t\t\t\t\t\t[organizationContactId]=\"organizationContactId\"\n\t\t\t\t\t\t[employeeId]=\"employee?.id\"\n\t\t\t\t\t\t[disabled]=\"running\"\n\t\t\t\t\t\t[(ngModel)]=\"projectId\"\n\t\t\t\t\t\t#projectInput=\"ngModel\"\n\t\t\t\t\t\t[required]=\"organization?.requireProject\"\n\t\t\t\t\t></ga-project-selector>\n\t\t\t\t\t@if (projectInput.invalid && form.submitted) {\n\t\t\t\t\t<div class=\"invalid-feedback d-block\">\n\t\t\t\t\t\t@if (projectInput.errors.required) {\n\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t{{ 'TIMER_TRACKER.VALIDATION.PROJECT_REQUIRED' | translate }}\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t}\n\t\t\t\t\t</div>\n\t\t\t\t\t}\n\t\t\t\t</div>\n\t\t\t\t<!-- Team Selector Start -->\n\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t<label>\n\t\t\t\t\t\t{{ 'TIMER_TRACKER.SELECT_TEAM' | translate }}\n\t\t\t\t\t</label>\n\t\t\t\t\t<ga-team-selector\n\t\t\t\t\t\tname=\"organizationTeamId\"\n\t\t\t\t\t\t[skipGlobalChange]=\"true\"\n\t\t\t\t\t\t[showAllOption]=\"false\"\n\t\t\t\t\t\t[defaultSelected]=\"false\"\n\t\t\t\t\t\t[placeholder]=\"'TIMER_TRACKER.PLACEHOLDERS.SELECT_TEAM' | translate\"\n\t\t\t\t\t\t[employeeId]=\"employee?.id\"\n\t\t\t\t\t\t[projectId]=\"projectId\"\n\t\t\t\t\t\t[(ngModel)]=\"organizationTeamId\"\n\t\t\t\t\t\t[required]=\"false\"\n\t\t\t\t\t></ga-team-selector>\n\t\t\t\t</div>\n\t\t\t\t<!-- Team Selector Emd -->\n\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t<label>\n\t\t\t\t\t\t{{ 'TIMER_TRACKER.SELECT_TASK' | translate }}\n\t\t\t\t\t</label>\n\t\t\t\t\t<ga-task-selector\n\t\t\t\t\t\tname=\"taskId\"\n\t\t\t\t\t\t[projectId]=\"projectId\"\n\t\t\t\t\t\t[employeeId]=\"employee?.id\"\n\t\t\t\t\t\t[disabled]=\"running\"\n\t\t\t\t\t\t[placeholder]=\"'TIMER_TRACKER.PLACEHOLDERS.SELECT_TASK' | translate\"\n\t\t\t\t\t\t[(ngModel)]=\"taskId\"\n\t\t\t\t\t\t#taskInput=\"ngModel\"\n\t\t\t\t\t\t[required]=\"organization?.requireTask\"\n\t\t\t\t\t></ga-task-selector>\n\t\t\t\t\t@if (taskInput.invalid && form.submitted) {\n\t\t\t\t\t<div class=\"invalid-feedback d-block\">\n\t\t\t\t\t\t@if (taskInput.errors.required) {\n\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t{{ 'TIMER_TRACKER.VALIDATION.TASK_REQUIRED' | translate }}\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t}\n\t\t\t\t\t</div>\n\t\t\t\t\t}\n\t\t\t\t</div>\n\t\t\t\t<div class=\"form-group custom\">\n\t\t\t\t\t<label>\n\t\t\t\t\t\t{{ 'TIMER_TRACKER.DESCRIPTION' | translate }}\n\t\t\t\t\t</label>\n\t\t\t\t\t<textarea\n\t\t\t\t\t\tclass=\"form-control\"\n\t\t\t\t\t\trows=\"2\"\n\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t[placeholder]=\"'TIMER_TRACKER.PLACEHOLDERS.DESCRIPTION' | translate\"\n\t\t\t\t\t\tname=\"description\"\n\t\t\t\t\t\t[disabled]=\"running\"\n\t\t\t\t\t\t[(ngModel)]=\"description\"\n\t\t\t\t\t\t#descriptionInput=\"ngModel\"\n\t\t\t\t\t\t[required]=\"organization?.requireDescription\"\n\t\t\t\t\t></textarea>\n\t\t\t\t\t@if (descriptionInput.invalid && form.submitted) {\n\t\t\t\t\t<div class=\"invalid-feedback d-block\">\n\t\t\t\t\t\t@if (descriptionInput.errors.required) {\n\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t{{ 'TIMER_TRACKER.VALIDATION.DESCRIPTION_REQUIRED' | translate }}\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t}\n\t\t\t\t\t</div>\n\t\t\t\t\t}\n\t\t\t\t</div>\n\t\t\t\t@if (user?.employee?.id) {\n\t\t\t\t<div class=\"view-log-button\">\n\t\t\t\t\t<ng-template [ngxPermissionsOnly]=\"PermissionsEnum.ALLOW_MANUAL_TIME\">\n\t\t\t\t\t\t<ng-template ngxTimeTrackingAuthorized [permission]=\"PermissionsEnum.ALLOW_MANUAL_TIME\">\n\t\t\t\t\t\t\t@if ((trackType$ | async) == timeLogType.MANUAL) {\n\t\t\t\t\t\t\t<div class=\"time-manual\">\n\t\t\t\t\t\t\t\t<button\n\t\t\t\t\t\t\t\t\tnbButton\n\t\t\t\t\t\t\t\t\tstatus=\"success\"\n\t\t\t\t\t\t\t\t\tclass=\"button success add\"\n\t\t\t\t\t\t\t\t\tsize=\"medium\"\n\t\t\t\t\t\t\t\t\t(click)=\"addTime()\"\n\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t{{ 'TIMER_TRACKER.ADD_TIME' | translate }}\n\t\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t</ng-template>\n\t\t\t\t\t</ng-template>\n\t\t\t\t\t<!--\n\t\t\t\t\t\tThe tracked-mode \"Start timer\" button that sat here is gone: it did\n\t\t\t\t\t\tthe same `toggleTimer(true)` as the round play control in the timer\n\t\t\t\t\t\trow above, so the panel was spending a full button row on a second\n\t\t\t\t\t\tcopy of a control it already shows.\n\t\t\t\t\t-->\n\t\t\t\t\t<a class=\"timesheet-link\" [routerLink]=\"['/pages/employees/timesheets']\">\n\t\t\t\t\t\t{{ 'TIMER_TRACKER.VIEW_TIMESHEET' | translate }}\n\t\t\t\t\t</a>\n\t\t\t\t</div>\n\t\t\t\t}\n\t\t\t</div>\n\t\t\t}\n\t\t\t</div>\n\t\t</form>\n\t</nb-card-body>\n\t<nb-card-footer [style.visibility]=\"hideAlert ? 'hidden' : 'visible'\">\n\t\t<nb-alert (close)=\"hideAlert = true\" status=\"primary\" class=\"alert\" closable>\n\t\t\t<nb-icon size=\"tiny\" icon=\"info-outline\"></nb-icon>\n\t\t\t<div\n\t\t\t\t[innerHTML]=\"\n\t\t\t\t\t'TIMER_TRACKER.ALERT_DESKTOP_DOWNLOAD' | translate : { downloadURL: PLATFORM_WEBSITE_DOWNLOAD_URL }\n\t\t\t\t\"\n\t\t\t></div>\n\t\t</nb-alert>\n\t</nb-card-footer>\n</nb-card>\n}\n\n<!--\n\tDeclared at the top level of the template so both call sites above can reach it:\n\ta reference is visible to the views nested inside the one that declares it, and\n\tthe expanded / collapsed branches are two such nested views.\n-->\n<ng-template #modeSwitch>\n\t<div class=\"mode-switch\">\n\t\t<button\n\t\t\tnbButton\n\t\t\ttype=\"button\"\n\t\t\t(click)=\"$event.stopPropagation(); setTimeType(timeLogType.TRACKED)\"\n\t\t\tsize=\"tiny\"\n\t\t\t[status]=\"(trackType$ | async) == timeLogType.TRACKED ? 'primary' : 'basic'\"\n\t\t\tclass=\"switch\"\n\t\t\t[nbTooltip]=\"'TIMER_TRACKER.TIMER' | translate\"\n\t\t\t[disabled]=\"running\"\n\t\t>\n\t\t\t<fa-icon [icon]=\"stopwatch\"></fa-icon>\n\t\t</button>\n\t\t<span\n\t\t\t[nbTooltip]=\"\n\t\t\t\t(organization?.allowManualTime ? 'TIMER_TRACKER.MANUAL' : 'TIMER_TRACKER.MANUAL_NOT_ALLOW') | translate\n\t\t\t\"\n\t\t>\n\t\t\t<button\n\t\t\t\tnbButton\n\t\t\t\ttype=\"button\"\n\t\t\t\t(click)=\"$event.stopPropagation(); setTimeType(timeLogType.MANUAL); isExpanded = true\"\n\t\t\t\tsize=\"tiny\"\n\t\t\t\t[status]=\"(trackType$ | async) == timeLogType.MANUAL ? 'primary' : 'basic'\"\n\t\t\t\tclass=\"switch\"\n\t\t\t\t[disabled]=\"running || !organization?.allowManualTime\"\n\t\t\t>\n\t\t\t\t<nb-icon icon=\"menu-outline\"></nb-icon>\n\t\t\t</button>\n\t\t</span>\n\t</div>\n</ng-template>\n", styles: ["@charset \"UTF-8\";:host{position:fixed;height:0;z-index:999;right:20px;top:80px}:host nb-card{border:none}:host .timer-card{display:block;padding:20px 20px 0;width:328px;font-size:14px;position:relative;box-shadow:0 6px 30px #0003;border-radius:var(--border-radius)}:host .background-basic-color-1{background-color:var(--background-basic-color-1)}:host .background-basic-color-2{background-color:var(--background-basic-color-2)}:host .header{position:absolute;display:flex;justify-content:flex-end;width:300px;top:0}:host .header nb-icon{width:.875rem;height:.875rem;font-size:.875rem}:host .panel-header{display:flex;align-items:center;justify-content:space-between;gap:.75rem;margin:0 0 1rem}:host .panel-header .panel-title{color:var(--text-primary-color);margin:0}:host [nbButton].appearance-filled.status-primary[disabled]{background-color:var(--text-primary-active-color);border-color:var(--text-primary-active-color);color:#fff;opacity:.4}:host .mode-switch{display:flex;flex-direction:row;align-items:center;gap:2px;flex:0 0 auto;padding:2px;border-radius:var(--border-radius);background-color:var(--gauzy-sidebar-background-4);box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18))}:host .mode-switch>span{display:inline-flex}:host .mode-switch button.switch{width:1.5rem;height:1.5rem;min-width:0;margin:0;padding:0;display:inline-flex;align-items:center;justify-content:center;border:none;border-radius:calc(var(--border-radius) - 2px);box-shadow:none}:host .mode-switch button.switch.status-basic{background-color:transparent;color:var(--gauzy-text-color-2)}:host .mode-switch button.switch.status-basic nb-icon,:host .mode-switch button.switch.status-basic svg{color:inherit;fill:currentColor}:host .mode-switch button.switch.status-basic:hover:not([disabled]){background-color:var(--background-basic-color-3);color:var(--text-basic-color)}:host .mode-switch button.switch svg{width:11px;margin:0}:host .mode-switch button.switch nb-icon{height:13px;width:13px}:host .mode-switch button.switch.status-primary nb-icon{color:#fff}:host .timer-container{display:flex;align-items:center}:host .timer-container .mode-switch{margin-left:.625rem}:host .timer-container .time-tracker{width:100%;display:flex;align-items:center}:host .timer-container .is_billable{align-self:flex-start;display:flex;align-items:center;height:1.625rem}:host .timer-container .is_billable button{font-size:12px;padding:0 9px;height:100%;display:inline-flex;align-items:center;justify-content:center}:host .timer-container .actions{display:flex;align-items:center;padding-left:14px}:host .timer-container .time-count{font-size:22px;width:100%;padding:0 10px;text-align:left;display:flex;flex-direction:column}:host .timer-container .time-count .session{display:flex;align-items:center;gap:.5rem;min-height:1.625rem}:host .timer-container .time-count .status{display:inline-flex;align-items:center;font-size:1rem;line-height:1}:host .timer-container .time-count .today-time{font-size:.6em;line-height:1;margin-top:.5rem;color:var(--gauzy-text-color-2)}:host .timer-container .time-count .current-session{font-weight:400;line-height:1.625rem}:host .timer-container .toggle [nbButton].appearance-filled.size-medium,:host .timer-container .toggle [nbButton].appearance-filled.status-danger{width:2.5rem;height:2.5rem;padding:0;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto}:host .timer-container .toggle fa-icon{margin:0;padding:0;display:inline-flex;line-height:1}:host .timer-container .timer,:host .timer-container .time-manual{display:flex;flex-direction:column;width:100%;gap:1rem}:host ::ng-deep ng-select .ng-select-container{width:100%}:host .form-group{margin-bottom:calc(1rem - 5px)}:host .panel-scroll{max-height:min(32rem,100vh - 100px);overflow-y:auto;overflow-x:hidden;margin-right:-16px;padding-right:16px}:host .panel-scroll::-webkit-scrollbar{width:6px}:host .panel-scroll::-webkit-scrollbar-track{background:transparent}:host .panel-scroll::-webkit-scrollbar-thumb{background:var(--gauzy-scrollbar);border-radius:1rem}:host .panel-scroll{scrollbar-width:thin}:host .timer-card.collapsed .panel-scroll{max-height:none;overflow:visible;margin-right:0;padding-right:0}.custom textarea{color:var(--text-basic-color);box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));resize:none;width:100%;height:84px;border-radius:var(--border-radius);font-size:var(--select-medium-text-font-size);line-height:1.5;font-family:inherit}.custom textarea:hover,.custom textarea:focus{box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));color:var(--text-basic-color)}.primary{color:var(--text-primary-color)}.custom-range-picker{display:block}.custom-range-picker ::ng-deep .row{margin-left:0;margin-right:0}.custom-range-picker ::ng-deep .row.range{display:flex;gap:.5rem}.custom-range-picker ::ng-deep .col-12,.custom-range-picker ::ng-deep .col-6{flex:1;max-width:none;padding-left:0;padding-right:0}.custom-range-picker ::ng-deep .form-group{margin-bottom:0}.custom-range-picker ::ng-deep .row+.row{margin-top:calc(1rem - 5px)}:host .custom-range-picker ::ng-deep label,:host .custom-range-picker ::ng-deep .label{font-size:.625rem}:host .custom-range-picker ::ng-deep .row.range .ng-select .ng-select-container .ng-value-container{padding-inline-start:.5rem!important}:host .custom-range-picker ::ng-deep .input{width:100%;height:calc(var(--select-medium-text-line-height) + .4375rem * 2);box-shadow:none}:host .custom-range-picker ::ng-deep input{width:100%;height:100%;padding:0 2rem 0 1rem;font-size:var(--select-medium-text-font-size);font-family:inherit;border-radius:var(--border-radius);box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18))}.billable-check ::ng-deep .text{font-size:var(--select-medium-text-font-size)}.view-log-button{display:flex;justify-content:space-between;align-items:center;gap:.75rem;margin-top:1rem}.view-log-button .button.success.add{height:36px;display:inline-flex;align-items:center;justify-content:center;padding:0 20px;font-size:14px;flex:0 0 auto;width:120px}.timesheet-link{color:var(--text-primary-color);font-size:var(--select-medium-text-font-size);font-weight:600;text-decoration:underline;white-space:nowrap;cursor:pointer}.timesheet-link:hover,.timesheet-link:focus-visible{color:var(--text-primary-hover-color);text-decoration:underline}.button{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.button,h6{text-transform:lowercase}.button:first-letter,h6:first-letter{text-transform:uppercase}:host ::ng-deep input,:host ::ng-deep nb-select.appearance-outline.status-basic .select-button,:host ::ng-deep .ng-select .ng-select-container{background-color:var(--gauzy-sidebar-background-4)!important;border:none;min-height:calc(var(--select-medium-text-line-height) + .4375rem * 2)!important}:host ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-placeholder,:host ::ng-deep .ng-select.ng-select-single .ng-select-container .ng-value-container .ng-input{top:unset!important}:host ::ng-deep label,:host ::ng-deep .label{font-size:var(--text-label-font-size);font-weight:600;line-height:.8125rem;letter-spacing:-.01em;color:var(--gauzy-text-color-2)}:host ::ng-deep textarea{background-color:var(--gauzy-sidebar-background-4)!important;border:none}:host ::ng-deep .ng-select .ng-select-container input,:host ::ng-deep nb-tag-list input{background-color:unset!important}:host nb-card{background-color:var(--gauzy-card-1)}nb-card-footer{position:absolute;width:calc(100% + 48px);left:-24px;bottom:-128px}nb-card-footer .alert{width:100%;display:flex;flex-direction:row;align-items:flex-start;gap:.25rem;font-size:12px;border-radius:var(--border-radius)}nb-card-footer .alert nb-icon{width:30px;height:18px}nb-card-footer .alert div{line-height:1.5em}nb-card-footer .alert ::ng-deep .close{padding:4px 8px;font-size:1rem}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [{ type: i1.TimeTrackerService }, { type: i1.TimesheetService }, { type: i1.ToastrService }, { type: i1.Store }, { type: i1.ErrorHandlingService }, { type: i2.NbThemeService }, { type: i3.NgxPermissionsService }, { type: i4.TimeTrackerStatusService }], propDecorators: { form: [{
                type: ViewChild,
                args: [NgForm]
            }] } });
//# sourceMappingURL=time-tracker.component.js.map