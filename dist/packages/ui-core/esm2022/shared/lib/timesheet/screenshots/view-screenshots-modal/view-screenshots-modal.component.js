import { __decorate, __metadata } from "tslib";
import { Component, Input } from '@angular/core';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { filter, tap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { sortBy } from 'underscore';
import { PermissionsEnum } from '@gauzy/contracts';
import { TimeLogsLabel, isNotEmpty, progressStatus } from '@gauzy/ui-core/common';
import { Store, TimesheetService, ToastrService } from '@gauzy/ui-core/core';
import { ViewTimeLogModalComponent } from '../../view-time-log-modal';
import { TimeZoneService } from '../../gauzy-filters/timezone-filter';
import * as i0 from "@angular/core";
import * as i1 from "@gauzy/ui-core/core";
import * as i2 from "@nebular/theme";
import * as i3 from "../../gauzy-filters/timezone-filter";
import * as i4 from "ngx-permissions";
import * as i5 from "../../../components/avatar/avatar.component";
import * as i6 from "../../../directives/img.directive";
import * as i7 from "../../../dialogs/directive/confirm.directive";
import * as i8 from "../../../gallery/gallery.directive";
import * as i9 from "../../../table-components/contact-links/contact-links.component";
import * as i10 from "../../../table-components/project/project.component";
import * as i11 from "@angular/common";
import * as i12 from "ngx-moment";
import * as i13 from "../../../pipes/date-format.pipe";
import * as i14 from "../../../pipes/duration-format.pipe";
import * as i15 from "../../../pipes/replace.pipe";
import * as i16 from "../../../pipes/time-format.pipe";
import * as i17 from "../../../pipes/utc-to-timezone.pipe";
import * as i18 from "@ngx-translate/core";
let ViewScreenshotsModalComponent = class ViewScreenshotsModalComponent {
    get timeSlot() {
        return this._timeSlot;
    }
    /**
     * Setter for the timeSlot property. Assigns the provided timeSlot value, processes
     * and formats the screenshots, and updates the local _timeSlot property accordingly.
     *
     * @param timeSlot - The TimeSlot object to be assigned.
     */
    set timeSlot(timeSlot) {
        if (timeSlot) {
            const screenshots = JSON.parse(JSON.stringify(timeSlot.screenshots));
            // Process and format the screenshots array
            this.screenshots = sortBy(screenshots, 'recordedAt').map((screenshot) => ({
                employee: timeSlot.employee,
                ...screenshot,
                // The slot fetched with relations returns its screenshots without
                // `employeeId`. The gallery filters by it, so without this the screenshot
                // clicked here was dropped from the viewer, which then had no active item.
                employeeId: screenshot.employeeId ?? timeSlot.employeeId
            }));
            // Update the _timeSlot object with formatted timestamps and other properties
            this._timeSlot = timeSlot;
        }
    }
    get screenshots() {
        return this._screenshots;
    }
    set screenshots(screenshots) {
        this._screenshots = screenshots;
    }
    get timeLogs() {
        return this._timeLogs;
    }
    set timeLogs(timeLogs) {
        this._timeLogs = sortBy(timeLogs, 'recordedAt');
    }
    constructor(_store, _dialogRef, _timesheetService, _nbDialogService, _toastrService, _timeZoneService) {
        this._store = _store;
        this._dialogRef = _dialogRef;
        this._timesheetService = _timesheetService;
        this._nbDialogService = _nbDialogService;
        this._toastrService = _toastrService;
        this._timeZoneService = _timeZoneService;
        this.progressStatus = progressStatus;
        this.TimeLogsLabel = TimeLogsLabel;
        this.PermissionsEnum = PermissionsEnum;
        /*
         * Getter & Setter for Screenshots
         */
        this._screenshots = [];
        /*
         * Getter & Setter for Screenshots
         */
        this._timeLogs = [];
        /**
         * Array to store unique application names associated with the current time slot.
         * Used in the context of time logs and screenshots.
         */
        this.apps = [];
        this.timeZone$ = this._timeZoneService.timeZone$.pipe(filter((timeZone) => !!timeZone));
        this.timeFormat$ = this._timeZoneService.timeFormat$.pipe(filter((timeFormat) => !!timeFormat));
    }
    ngOnInit() {
        // Subscribe to the timeZone$ observable
        this._store.selectedOrganization$
            .pipe(filter((organization) => !!organization), tap((organization) => (this.organization = organization)), tap(() => this.getTimeSlot()), untilDestroyed(this))
            .subscribe();
    }
    /**
     * Asynchronously retrieves and sets the time slot and associated time logs.
     *
     * @returns A Promise that resolves when the operation is complete.
     */
    async getTimeSlot() {
        try {
            // Check if organization and time slot are available
            if (!this.organization || !this.timeSlot) {
                return;
            }
            // Retrieve time slot with specified relations
            this.timeSlot = await this._timesheetService.getTimeSlot(this.timeSlot.id, {
                relations: [
                    'employee.user',
                    'screenshots',
                    'timeLogs.project',
                    'timeLogs.task',
                    'timeLogs.organizationContact',
                    'timeLogs.employee.user'
                ]
            });
            // Set the time logs property to the time logs of the retrieved time slot
            this.timeLogs = this.timeSlot.timeLogs;
            // Retrieve and set unique apps from the screenshots of the time slot
            this.apps = this.getScreenshotUniqueApps() || [];
        }
        catch (error) {
            // Handle errors by logging and displaying a toastr message
            console.error('Error while retrieving TimeSlot:', error);
            this._toastrService.danger(error);
        }
    }
    /**
     * Closes the current dialog.
     */
    close() {
        this._dialogRef.close();
    }
    /**
     * Opens a modal to view details of a time log.
     *
     * @param timeLog - The time log to be viewed.
     */
    viewTimeLog(timeLog) {
        this._nbDialogService.open(ViewTimeLogModalComponent, {
            context: { timeLog }
        });
    }
    /**
     * Deletes a specific screenshot associated with an employee.
     *
     * @param screenshot - The screenshot to be deleted.
     * @param employee - The employee associated with the screenshot.
     * @returns void
     */
    async deleteImage(screenshot, employee) {
        if (!screenshot || !this.organization) {
            return;
        }
        try {
            const { name } = this.organization;
            const { organizationId, tenantId } = screenshot;
            // Delete the specified screenshot
            await this._timesheetService.deleteScreenshot(screenshot.id, {
                organizationId,
                tenantId
            });
            // Remove the deleted screenshot from the local collection
            this.screenshots = this.screenshots.filter((item) => item.id !== screenshot.id);
            // Display success message
            this._toastrService.success('TOASTR.MESSAGE.SCREENSHOT_DELETED', {
                name: employee.fullName,
                organization: name
            });
        }
        catch (error) {
            // Handle errors by logging and displaying a toastr message
            console.error('Error while deleting screenshot:', error);
            this._toastrService.danger(error);
        }
    }
    /**
     * Deletes a specific time log associated with an employee.
     *
     * @param timeLog - The time log to be deleted.
     * @param employee - The employee associated with the time log.
     * @returns void
     */
    async deleteTimeLog(timeLog, employee) {
        if (timeLog.isRunning) {
            return;
        }
        try {
            const { id: organizationId, name: organizationName } = this.organization;
            const request = {
                logIds: [timeLog.id],
                organizationId
            };
            // Delete the specified time log
            await this._timesheetService.deleteLogs(request);
            // Display success message
            this._toastrService.success('TOASTR.MESSAGE.TIME_LOG_DELETED', {
                name: employee.fullName,
                organization: organizationName
            });
            // Close the dialog and emit an event indicating time log deletion
            this._dialogRef.close({
                timeLog: timeLog,
                isDelete: true
            });
        }
        catch (error) {
            // Handle errors by logging and displaying a toastr message
            console.error('Error while deleting TimeLog:', error);
            this._toastrService.danger(error);
        }
    }
    /**
     * Extracts unique applications from an array of screenshots,
     * handling the possibility of 'apps' being a string or an array.
     *
     * @returns An array containing unique application names.
     */
    getScreenshotUniqueApps() {
        // Use a Set to automatically handle uniqueness
        const uniqueAppsSet = new Set();
        if (isNotEmpty(this.screenshots)) {
            // Iterate through each screenshot to collect unique apps
            this.screenshots.forEach((screenshot) => {
                // Determine the format of 'apps' property and convert if needed
                const apps = screenshot.apps;
                const screenshotApps = Array.isArray(apps) ? apps : this.parseApps(apps);
                if (isNotEmpty(screenshotApps)) {
                    // Add each app to the Set to ensure uniqueness
                    screenshotApps.forEach((app) => {
                        uniqueAppsSet.add(app);
                    });
                }
            });
        }
        // Convert the Set back to an array for the final result
        return Array.from(uniqueAppsSet);
    }
    /**
     * Parses a string representation of applications as JSON,
     * returning the parsed array or an empty array if parsing fails.
     *
     * @param apps The string or array representation of applications.
     * @returns An array of application names.
     * @private
     */
    parseApps(apps) {
        if (typeof apps === 'string') {
            try {
                return JSON.parse(apps);
            }
            catch (error) {
                // Return an empty array if parsing fails
                return [];
            }
        }
        // If 'apps' is already an array, return it as is
        return apps;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ViewScreenshotsModalComponent, deps: [{ token: i1.Store }, { token: i2.NbDialogRef }, { token: i1.TimesheetService }, { token: i2.NbDialogService }, { token: i1.ToastrService }, { token: i3.TimeZoneService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: ViewScreenshotsModalComponent, isStandalone: false, selector: "ngx-view-screenshots-modal", inputs: { timeSlot: "timeSlot", timeLogs: "timeLogs" }, ngImport: i0, template: "<nb-card class=\"slot-card\">\n\t<nb-card-header class=\"slot-header\">\n\t\t<!-- The date is the title; the slot's time range reads under it. -->\n\t\t<div class=\"slot-heading\">\n\t\t\t@if (timeSlot) {\n\t\t\t<span class=\"slot-title\">\n\t\t\t\t{{ timeSlot?.startedAt | utcToTimezone : (timeZone$ | async) | dateFormat }}\n\t\t\t</span>\n\t\t\t<span class=\"slot-subtitle\">\n\t\t\t\t{{ timeSlot?.startedAt | utcToTimezone : (timeZone$ | async) | timeFormat : (timeFormat$ | async) : false }}\n\t\t\t\t\u2013\n\t\t\t\t{{ timeSlot?.stoppedAt | utcToTimezone : (timeZone$ | async) | timeFormat : (timeFormat$ | async) : false }}\n\t\t\t</span>\n\t\t\t}\n\t\t</div>\n\t\t<!-- Member, Activity and Duration ride in the header, beside the time they\n\t\t     describe, so the body is left for screenshots, apps and time logs. -->\n\t\t@if (timeSlot) {\n\t\t<div class=\"slot-summary\">\n\t\t\t<div class=\"summary-item\" *ngxPermissionsOnly=\"[PermissionsEnum.CHANGE_SELECTED_EMPLOYEE]\">\n\t\t\t\t<span class=\"summary-label\">{{ 'TIMESHEET.MEMBER' | translate }}</span>\n\t\t\t\t<ngx-avatar\n\t\t\t\t\tclass=\"report-table\"\n\t\t\t\t\t[id]=\"timeSlot?.employee?.id\"\n\t\t\t\t\t[employee]=\"timeSlot?.employee\"\n\t\t\t\t\t[name]=\"timeSlot?.employee?.user?.name\"\n\t\t\t\t\t[src]=\"timeSlot?.employee?.user?.imageUrl\"\n\t\t\t\t></ngx-avatar>\n\t\t\t</div>\n\t\t\t<div class=\"summary-item\">\n\t\t\t\t<span class=\"summary-label\">{{ 'REPORT_PAGE.ACTIVITY' | translate }}</span>\n\t\t\t\t<div class=\"activity-meter\">\n\t\t\t\t\t<span class=\"summary-value\">{{ timeSlot?.percentage || 0 }}%</span>\n\t\t\t\t\t<nb-progress-bar\n\t\t\t\t\t\t[value]=\"timeSlot?.percentage\"\n\t\t\t\t\t\t[status]=\"progressStatus(timeSlot?.percentage)\"\n\t\t\t\t\t\t[displayValue]=\"false\"\n\t\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\t></nb-progress-bar>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class=\"summary-item\">\n\t\t\t\t<span class=\"summary-label\">{{ 'TIMESHEET.DURATION' | translate }}</span>\n\t\t\t\t<span class=\"summary-value\">\n\t\t\t\t\t{{ timeSlot?.duration | amFromUnix | amFromUtc | amDateFormat : 'mm' }}\n\t\t\t\t\t{{ 'ACTIVITY.MINUTES' | translate }}\n\t\t\t\t</span>\n\t\t\t</div>\n\t\t</div>\n\t\t}\n\t\t<button\n\t\t\tnbButton\n\t\t\tghost\n\t\t\tstatus=\"basic\"\n\t\t\tsize=\"small\"\n\t\t\ttype=\"button\"\n\t\t\tclass=\"icon-button close-button\"\n\t\t\t[attr.aria-label]=\"'BUTTONS.CLOSE' | translate\"\n\t\t\t(click)=\"close()\"\n\t\t>\n\t\t\t<nb-icon icon=\"close-outline\"></nb-icon>\n\t\t</button>\n\t</nb-card-header>\n\n\t<nb-card-body class=\"slot-body custom-scroll\">\n\t\t@if (timeSlot) {\n\t\t@if (screenshots.length > 0) {\n\t\t<section class=\"slot-section\">\n\t\t\t<div class=\"section-header\">\n\t\t\t\t<h6 class=\"section-title\">{{ 'TIMESHEET.SCREENSHOTS.SCREENSHOTS' | translate }}</h6>\n\t\t\t\t<span class=\"section-count\">{{ screenshots.length }}</span>\n\t\t\t</div>\n\t\t\t<div class=\"screenshot-grid\">\n\t\t\t\t@for (image of screenshots; track image.id) {\n\t\t\t\t@let recordedTime = image?.recordedAt | utcToTimezone : (timeZone$ | async) | timeFormat : (timeFormat$ | async) : false;\n\t\t\t\t<figure class=\"screenshot\" [class.not-work-related]=\"image?.isWorkRelated === false\">\n\t\t\t\t\t<!-- The frame opens the full-size gallery; its buttons stop the click. -->\n\t\t\t\t\t<div\n\t\t\t\t\t\tclass=\"screenshot-frame\"\n\t\t\t\t\t\tngxGallery\n\t\t\t\t\t\t[items]=\"screenshots\"\n\t\t\t\t\t\t[item]=\"image\"\n\t\t\t\t\t\t[employeeId]=\"timeSlot?.employee?.id\"\n\t\t\t\t\t>\n\t\t\t\t\t\t<img\n\t\t\t\t\t\t\tdraggable=\"false\"\n\t\t\t\t\t\t\t[src]=\"image?.thumbUrl\"\n\t\t\t\t\t\t\t[alt]=\"image?.description || ('TIMESHEET.SCREENSHOTS.TAKEN_AT' | translate : { time: recordedTime })\"\n\t\t\t\t\t\t/>\n\t\t\t\t\t\t<div class=\"screenshot-actions\">\n\t\t\t\t\t\t\t@if (image?.description) {\n\t\t\t\t\t\t\t<button\n\t\t\t\t\t\t\t\tnbButton\n\t\t\t\t\t\t\t\tghost\n\t\t\t\t\t\t\t\tstatus=\"basic\"\n\t\t\t\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\t\t\t\ttype=\"button\"\n\t\t\t\t\t\t\t\tclass=\"icon-button\"\n\t\t\t\t\t\t\t\t[nbTooltip]=\"image?.description\"\n\t\t\t\t\t\t\t\t[attr.aria-label]=\"'REPORT_PAGE.DESCRIPTION' | translate\"\n\t\t\t\t\t\t\t\t(click)=\"$event.stopPropagation()\"\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t<nb-icon icon=\"info-outline\"></nb-icon>\n\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t<button\n\t\t\t\t\t\t\t\tnbButton\n\t\t\t\t\t\t\t\tghost\n\t\t\t\t\t\t\t\tstatus=\"basic\"\n\t\t\t\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\t\t\t\ttype=\"button\"\n\t\t\t\t\t\t\t\tclass=\"icon-button\"\n\t\t\t\t\t\t\t\t[nbTooltip]=\"'TIMESHEET.DELETE' | translate\"\n\t\t\t\t\t\t\t\t[attr.aria-label]=\"'TIMESHEET.DELETE' | translate\"\n\t\t\t\t\t\t\t\t(click)=\"$event.stopPropagation(); deleteImage(image, image?.employee)\"\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t<nb-icon status=\"danger\" icon=\"trash-2-outline\"></nb-icon>\n\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<figcaption class=\"screenshot-time\">{{ recordedTime }}</figcaption>\n\t\t\t\t</figure>\n\t\t\t\t}\n\t\t\t</div>\n\t\t</section>\n\t\t}\n\n\t\t@if (apps?.length > 0) {\n\t\t<!-- The chips sit on the title's line; a short list needs no row of its own. -->\n\t\t<section class=\"slot-section apps\">\n\t\t\t<div class=\"section-header\">\n\t\t\t\t<h6 class=\"section-title\">{{ 'TIMESHEET.APPS' | translate }}</h6>\n\t\t\t\t<span class=\"section-count\">{{ apps.length }}</span>\n\t\t\t</div>\n\t\t\t<div class=\"app-list\">\n\t\t\t\t@for (app of apps; track app) {\n\t\t\t\t<span class=\"app-chip\">{{ app }}</span>\n\t\t\t\t}\n\t\t\t</div>\n\t\t</section>\n\t\t}\n\n\t\t<section class=\"slot-section\">\n\t\t\t<div class=\"section-header\">\n\t\t\t\t<h6 class=\"section-title\">{{ 'TIMESHEET.SCREENSHOTS.TIME_LOG' | translate }}</h6>\n\t\t\t\t@if (timeLogs?.length > 0) {\n\t\t\t\t<span class=\"section-count\">{{ timeLogs.length }}</span>\n\t\t\t\t}\n\t\t\t</div>\n\t\t\t@for (timeLog of timeLogs; track timeLog.id) {\n\t\t\t<div class=\"time-log\">\n\t\t\t\t<div class=\"time-log-header\">\n\t\t\t\t\t<div class=\"time-log-heading\">\n\t\t\t\t\t\t<span class=\"time-log-range\">\n\t\t\t\t\t\t\t{{ timeLog?.startedAt | utcToTimezone : (timeZone$ | async) | timeFormat : (timeFormat$ | async) }}\n\t\t\t\t\t\t\t\u2013\n\t\t\t\t\t\t\t@if (!timeLog?.isRunning) {\n\t\t\t\t\t\t\t{{ timeLog?.stoppedAt | utcToTimezone : (timeZone$ | async) | timeFormat : (timeFormat$ | async) }}\n\t\t\t\t\t\t\t} @else {\n\t\t\t\t\t\t\t{{ 'TIMESHEET.TILL_NOW' | translate }}\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t</span>\n\t\t\t\t\t\t<span class=\"time-log-duration\">{{ timeLog?.duration | durationFormat }}</span>\n\t\t\t\t\t\t@if (TimeLogsLabel[timeLog?.logType]; as label) {\n\t\t\t\t\t\t<nb-badge class=\"time-log-type\" [status]=\"label.status\" [text]=\"label.text\"></nb-badge>\n\t\t\t\t\t\t}\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"time-log-actions\">\n\t\t\t\t\t\t<button\n\t\t\t\t\t\t\tnbButton\n\t\t\t\t\t\t\tghost\n\t\t\t\t\t\t\tstatus=\"basic\"\n\t\t\t\t\t\t\tsize=\"small\"\n\t\t\t\t\t\t\ttype=\"button\"\n\t\t\t\t\t\t\tclass=\"icon-button\"\n\t\t\t\t\t\t\t[nbTooltip]=\"'TIMESHEET.VIEW' | translate\"\n\t\t\t\t\t\t\t[attr.aria-label]=\"'TIMESHEET.VIEW' | translate\"\n\t\t\t\t\t\t\t(click)=\"viewTimeLog(timeLog)\"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t<nb-icon icon=\"eye-outline\"></nb-icon>\n\t\t\t\t\t\t</button>\n\t\t\t\t\t\t<button\n\t\t\t\t\t\t\tnbButton\n\t\t\t\t\t\t\tghost\n\t\t\t\t\t\t\tstatus=\"basic\"\n\t\t\t\t\t\t\tsize=\"small\"\n\t\t\t\t\t\t\ttype=\"button\"\n\t\t\t\t\t\t\tclass=\"icon-button\"\n\t\t\t\t\t\t\t[nbTooltip]=\"'TIMESHEET.DELETE' | translate\"\n\t\t\t\t\t\t\t[attr.aria-label]=\"'TIMESHEET.DELETE' | translate\"\n\t\t\t\t\t\t\t(click)=\"$event.stopPropagation()\"\n\t\t\t\t\t\t\tngxConfirmDialog\n\t\t\t\t\t\t\t[message]=\"'TIMESHEET.DELETE_CONFIRM' | translate\"\n\t\t\t\t\t\t\t(confirm)=\"deleteTimeLog(timeLog, timeSlot?.employee)\"\n\t\t\t\t\t\t\t[disabled]=\"timeLog.isRunning\"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t<nb-icon status=\"danger\" icon=\"trash-2-outline\"></nb-icon>\n\t\t\t\t\t\t</button>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\n\t\t\t\t<!-- Two label/value pairs to a row (Source | Client, Project | To-do); the\n\t\t\t\t     free text, Notes and Reason, takes a row of its own. -->\n\t\t\t\t<dl class=\"time-log-fields\">\n\t\t\t\t\t<dt>{{ 'TIMESHEET.SOURCE' | translate }}</dt>\n\t\t\t\t\t<dd class=\"source\">\n\t\t\t\t\t\t<span>{{ timeLog?.source | replace : '_' : ' ' | titlecase }}</span>\n\t\t\t\t\t\t@if (timeLog?.version) {\n\t\t\t\t\t\t<span class=\"version\">{{ timeLog?.version }}</span>\n\t\t\t\t\t\t}\n\t\t\t\t\t</dd>\n\n\t\t\t\t\t<dt>{{ 'TIMESHEET.ORGANIZATION_CONTACT' | translate }}</dt>\n\t\t\t\t\t<dd>\n\t\t\t\t\t\t@if (timeLog?.organizationContact) {\n\t\t\t\t\t\t<ngx-contact-links [value]=\"timeLog?.organizationContact\"></ngx-contact-links>\n\t\t\t\t\t\t} @else {\n\t\t\t\t\t\t<span class=\"empty\">{{ 'TIMESHEET.NO_ORGANIZATION_CONTACT' | translate }}</span>\n\t\t\t\t\t\t}\n\t\t\t\t\t</dd>\n\n\t\t\t\t\t<dt>{{ 'TIMESHEET.PROJECT' | translate }}</dt>\n\t\t\t\t\t<dd>\n\t\t\t\t\t\t@if (timeLog?.project) {\n\t\t\t\t\t\t<ngx-project [rowData]=\"timeLog\"></ngx-project>\n\t\t\t\t\t\t} @else {\n\t\t\t\t\t\t<span class=\"empty\">{{ 'TIMESHEET.NO_PROJECT' | translate }}</span>\n\t\t\t\t\t\t}\n\t\t\t\t\t</dd>\n\n\t\t\t\t\t<dt>{{ 'TIMESHEET.TODO' | translate }}</dt>\n\t\t\t\t\t<dd>\n\t\t\t\t\t\t@if (timeLog?.task) {\n\t\t\t\t\t\t{{ timeLog?.task?.title }}\n\t\t\t\t\t\t} @else {\n\t\t\t\t\t\t<span class=\"empty\">{{ 'TIMESHEET.NO_TODO' | translate }}</span>\n\t\t\t\t\t\t}\n\t\t\t\t\t</dd>\n\n\t\t\t\t\t@if (timeLog?.description) {\n\t\t\t\t\t<dt class=\"wide\">{{ 'TIMESHEET.NOTES' | translate }}</dt>\n\t\t\t\t\t<dd class=\"wide\">{{ timeLog?.description }}</dd>\n\t\t\t\t\t}\n\n\t\t\t\t\t@if (timeLog?.reason) {\n\t\t\t\t\t<dt class=\"wide\">{{ 'TIMESHEET.REASON' | translate }}</dt>\n\t\t\t\t\t<dd class=\"wide\">{{ timeLog?.reason }}</dd>\n\t\t\t\t\t}\n\t\t\t\t</dl>\n\n\t\t\t\t@if (timeLog?.isRunning) {\n\t\t\t\t<nb-alert status=\"warning\" size=\"tiny\" class=\"running-warning\">\n\t\t\t\t\t{{ 'TIMESHEET.RUNNING_TIMER_WARNING' | translate }}\n\t\t\t\t</nb-alert>\n\t\t\t\t}\n\t\t\t</div>\n\t\t\t}\n\t\t</section>\n\t\t}\n\t</nb-card-body>\n</nb-card>\n", styles: [":host{display:block;width:calc(50.875rem + 2px);max-width:calc(100vw - 2rem)}:host nb-card.slot-card{margin:0;border:1px solid var(--gauzy-border-default-color);background-color:var(--gauzy-card-1)}:host nb-card-header.slot-header{display:grid;grid-template-areas:\"heading summary close\";grid-template-columns:minmax(0,1fr) auto auto;align-items:center;column-gap:1rem;padding:.75rem .75rem .75rem 1.25rem;border-bottom:1px solid var(--gauzy-border-default-color)}@media(max-width:52.5rem){:host nb-card-header.slot-header{grid-template-areas:\"heading close\" \"summary summary\";grid-template-columns:minmax(0,1fr) auto;row-gap:.75rem}}:host .close-button{grid-area:close}:host .slot-heading{grid-area:heading;display:flex;flex-direction:column;gap:.25rem;min-width:0}:host .slot-title{font-size:14px;font-weight:600;line-height:1rem;letter-spacing:0;color:var(--gauzy-text-color-1);line-height:1.25rem}:host .slot-subtitle{font-size:12px;font-weight:400;line-height:1rem;letter-spacing:0;color:var(--gauzy-text-color-2);font-variant-numeric:tabular-nums}:host .icon-button[nbButton]{width:1.75rem;height:1.75rem;min-width:0;margin:0;padding:0!important}:host .icon-button[nbButton] nb-icon{width:1rem;height:1rem;margin:0;font-size:1rem}:host .icon-button[nbButton]:focus:not(:focus-visible):not(:hover){box-shadow:none}:host .icon-button[nbButton].appearance-ghost:focus:not(:focus-visible):not(:hover){border-color:transparent;background-color:transparent}:host nb-card-body.slot-body{display:flex;flex-direction:column;gap:1rem;padding:1rem 1.25rem}:host .slot-summary{grid-area:summary;display:flex;align-items:stretch}:host .summary-item{display:flex;flex-direction:column;justify-content:flex-start;gap:.25rem;min-width:0;padding-inline:1rem}:host .summary-item+.summary-item{border-inline-start:1px solid var(--gauzy-border-default-color)}:host .summary-item:first-child{padding-inline-start:0}:host .summary-item:last-child{padding-inline-end:.25rem}:host .summary-label{font-size:12px;font-weight:400;line-height:1rem;letter-spacing:0;color:var(--gauzy-text-color-2)}:host .summary-item>.summary-value,:host .summary-item>.activity-meter,:host .summary-item>ngx-avatar{display:flex;align-items:center;min-height:1.875rem}:host .summary-value{font-size:14px;font-weight:600;line-height:1rem;letter-spacing:0;color:var(--gauzy-text-color-1);line-height:1.25rem;white-space:nowrap;font-variant-numeric:tabular-nums}:host .activity-meter{display:flex;align-items:center;gap:.625rem}:host .activity-meter nb-progress-bar{flex:none;width:6rem}:host .activity-meter nb-progress-bar ::ng-deep .progress-container{height:5px;background-color:var(--gauzy-card-2)}:host .slot-section{display:flex;flex-direction:column;gap:.75rem}:host .section-header{display:flex;align-items:center;gap:.5rem}:host .section-title{font-size:12px;font-weight:600;line-height:1rem;letter-spacing:0;color:var(--gauzy-text-color-1);margin:0}:host .section-count{font-size:11px;font-weight:600;line-height:1rem;letter-spacing:0;color:var(--gauzy-text-color-2);min-width:1.25rem;padding:.125rem .375rem;border-radius:9999px;background:var(--gauzy-sidebar-background-3);text-align:center;font-variant-numeric:tabular-nums}:host .screenshot-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(15.625rem,100%),15.625rem));gap:.75rem}:host .screenshot{display:flex;flex-direction:column;gap:.375rem;min-width:0;margin:0}:host .screenshot-frame{position:relative;height:8.125rem;overflow:hidden;border:1px solid var(--gauzy-border-default-color);border-radius:var(--border-radius);background:var(--gauzy-hover-tint);cursor:zoom-in}:host .screenshot-frame img{display:block;width:100%;height:100%;object-fit:cover;transition:transform .2s ease}:host .screenshot-frame img.default-image{box-sizing:border-box;padding:2.5rem;object-fit:contain;opacity:.35!important}:host .screenshot-frame:hover img{transform:scale(1.03)}:host .screenshot-actions{position:absolute;top:.375rem;right:.375rem;display:flex;gap:.25rem;opacity:0;transition:opacity .15s ease}:host .screenshot-actions .icon-button[nbButton]{width:1.5rem;height:1.5rem;border:none;background-color:#0009;color:#fff}:host .screenshot-actions .icon-button[nbButton]:hover{background-color:#000c}:host .screenshot-actions .icon-button[nbButton] nb-icon{width:.875rem;height:.875rem;font-size:.875rem}:host .screenshot-actions .icon-button[nbButton] nb-icon:not(.status-danger){color:#fff}:host .screenshot-frame:hover .screenshot-actions,:host .screenshot-actions:focus-within{opacity:1}:host .screenshot.not-work-related .screenshot-frame{border:2px solid var(--color-danger-500)}:host .screenshot-time{font-size:12px;font-weight:400;line-height:1rem;letter-spacing:0;color:var(--gauzy-text-color-2);text-align:center;font-variant-numeric:tabular-nums}:host .slot-section.apps{flex-direction:row;align-items:center}:host .slot-section.apps .app-list{flex:1 1 0;min-width:0}:host .app-list{display:flex;flex-wrap:wrap;gap:.5rem}:host .app-chip{font-size:12px;font-weight:500;line-height:1rem;letter-spacing:0;color:var(--gauzy-text-color-1);padding:.25rem .625rem;border:1px solid var(--gauzy-border-default-color);border-radius:9999px;background:var(--gauzy-card-2)}:host .time-log{overflow:hidden;border:1px solid var(--gauzy-border-default-color);border-radius:var(--border-radius)}:host .time-log+.time-log{margin-top:.25rem}:host .time-log-header{display:flex;align-items:center;justify-content:space-between;gap:.75rem;padding:.5rem .5rem .5rem 1rem;border-bottom:1px solid var(--gauzy-border-default-color);background:var(--gauzy-card-2)}:host .time-log-heading{display:flex;flex-wrap:wrap;align-items:center;gap:.5rem;min-width:0}:host .time-log-range{font-size:12px;font-weight:600;line-height:1rem;letter-spacing:0;color:var(--gauzy-text-color-1);white-space:nowrap;font-variant-numeric:tabular-nums}:host .time-log-duration{font-size:12px;font-weight:600;line-height:1rem;letter-spacing:0;color:var(--gauzy-text-color-1);padding:.125rem .5rem;border-radius:var(--border-radius);background:var(--gauzy-sidebar-background-3);font-variant-numeric:tabular-nums}:host nb-badge.time-log-type{position:static;padding:.125rem .5rem;border-radius:9999px;font-size:11px;font-weight:600;line-height:1rem;letter-spacing:.02em}:host .time-log-actions{display:flex;flex:none;align-items:center;gap:.25rem}:host .time-log-fields{display:grid;grid-template-columns:5.5rem minmax(0,1fr) 5.5rem minmax(0,1fr);align-items:center;gap:.625rem .75rem;margin:0;padding:.75rem 1rem}:host .time-log-fields dt.wide{grid-column:1}:host .time-log-fields dd.wide{grid-column:2/-1}@media(max-width:52.5rem){:host .time-log-fields{grid-template-columns:5.5rem minmax(0,1fr)}:host .time-log-fields dd.wide{grid-column:2}}:host .time-log-fields dt{font-size:12px;font-weight:400;line-height:1rem;letter-spacing:0;color:var(--gauzy-text-color-2)}:host .time-log-fields dd{font-size:12px;font-weight:400;line-height:1rem;letter-spacing:0;color:var(--gauzy-text-color-1);margin:0;min-width:0;overflow-wrap:anywhere}:host .time-log-fields .source{display:flex;align-items:center;gap:.5rem}:host .time-log-fields .version{font-size:11px;font-weight:600;line-height:1rem;letter-spacing:0;color:var(--gauzy-text-color-2);padding:.0625rem .375rem;border:1px solid var(--gauzy-border-default-color);border-radius:9999px}:host .time-log-fields .empty{color:var(--gauzy-text-color-2)}:host ngx-contact-links ::ng-deep .names-wrapper{max-width:none!important}:host ngx-project ::ng-deep .project-render{align-items:center;gap:.5rem}:host ngx-project ::ng-deep .project-render img{width:1.25rem;height:1.25rem;box-shadow:none}:host ngx-project ::ng-deep .project-render .name{font-size:12px;font-weight:500;line-height:1rem}:host ngx-project ::ng-deep .project-render .member{display:none}:host nb-alert.running-warning{margin:0 1rem .875rem;padding:.5rem .75rem;font-size:12px;line-height:1rem}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "component", type: i2.NbAlertComponent, selector: "nb-alert", inputs: ["size", "status", "accent", "outline", "closable"], outputs: ["close"] }, { kind: "component", type: i2.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "component", type: i2.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i2.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "component", type: i2.NbCardHeaderComponent, selector: "nb-card-header" }, { kind: "component", type: i2.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "component", type: i2.NbProgressBarComponent, selector: "nb-progress-bar", inputs: ["value", "status", "size", "displayValue"] }, { kind: "directive", type: i2.NbTooltipDirective, selector: "[nbTooltip]", inputs: ["nbTooltip", "nbTooltipPlacement", "nbTooltipAdjustment", "nbTooltipClass", "nbTooltipIcon", "nbTooltipStatus", "nbTooltipTrigger", "nbTooltipOffset", "nbTooltipDisabled"], outputs: ["nbTooltipShowStateChange"], exportAs: ["nbTooltip"] }, { kind: "directive", type: i4.NgxPermissionsDirective, selector: "[ngxPermissionsOnly],[ngxPermissionsExcept]", inputs: ["ngxPermissionsOnly", "ngxPermissionsOnlyThen", "ngxPermissionsOnlyElse", "ngxPermissionsExcept", "ngxPermissionsExceptElse", "ngxPermissionsExceptThen", "ngxPermissionsThen", "ngxPermissionsElse", "ngxPermissionsOnlyAuthorisedStrategy", "ngxPermissionsOnlyUnauthorisedStrategy", "ngxPermissionsExceptUnauthorisedStrategy", "ngxPermissionsExceptAuthorisedStrategy", "ngxPermissionsUnauthorisedStrategy", "ngxPermissionsAuthorisedStrategy"], outputs: ["permissionsAuthorized", "permissionsUnauthorized"] }, { kind: "component", type: i5.AvatarComponent, selector: "ngx-avatar", inputs: ["size", "src", "appendCaption", "caption", "id", "isOption", "employee", "value", "name"] }, { kind: "directive", type: i6.ImgDirective, selector: "img", inputs: ["type", "skipDefaultImage", "enableFadeIn"] }, { kind: "component", type: i2.NbBadgeComponent, selector: "nb-badge", inputs: ["text", "position", "dotMode", "status"] }, { kind: "directive", type: i7.ConfirmDirective, selector: "[ngxConfirmDialog]", inputs: ["message", "title", "yesText", "noText"], outputs: ["confirm", "decline"] }, { kind: "directive", type: i8.GalleryDirective, selector: "[ngxGallery]", inputs: ["items", "item", "employeeId", "disabled"] }, { kind: "component", type: i9.ContactLinksComponent, selector: "ngx-contact-links", inputs: ["rowData", "value"] }, { kind: "component", type: i10.ProjectComponent, selector: "ngx-project", inputs: ["value", "rowData"] }, { kind: "pipe", type: i11.AsyncPipe, name: "async" }, { kind: "pipe", type: i11.TitleCasePipe, name: "titlecase" }, { kind: "pipe", type: i12.DateFormatPipe, name: "amDateFormat" }, { kind: "pipe", type: i12.FromUnixPipe, name: "amFromUnix" }, { kind: "pipe", type: i12.FromUtcPipe, name: "amFromUtc" }, { kind: "pipe", type: i13.DateFormatPipe, name: "dateFormat" }, { kind: "pipe", type: i14.DurationFormatPipe, name: "durationFormat" }, { kind: "pipe", type: i15.ReplacePipe, name: "replace" }, { kind: "pipe", type: i16.TimeFormatPipe, name: "timeFormat" }, { kind: "pipe", type: i17.UtcToTimezone, name: "utcToTimezone" }, { kind: "pipe", type: i18.TranslatePipe, name: "translate" }] }); }
};
ViewScreenshotsModalComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [Store,
        NbDialogRef,
        TimesheetService,
        NbDialogService,
        ToastrService,
        TimeZoneService])
], ViewScreenshotsModalComponent);
export { ViewScreenshotsModalComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ViewScreenshotsModalComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-view-screenshots-modal', standalone: false, template: "<nb-card class=\"slot-card\">\n\t<nb-card-header class=\"slot-header\">\n\t\t<!-- The date is the title; the slot's time range reads under it. -->\n\t\t<div class=\"slot-heading\">\n\t\t\t@if (timeSlot) {\n\t\t\t<span class=\"slot-title\">\n\t\t\t\t{{ timeSlot?.startedAt | utcToTimezone : (timeZone$ | async) | dateFormat }}\n\t\t\t</span>\n\t\t\t<span class=\"slot-subtitle\">\n\t\t\t\t{{ timeSlot?.startedAt | utcToTimezone : (timeZone$ | async) | timeFormat : (timeFormat$ | async) : false }}\n\t\t\t\t\u2013\n\t\t\t\t{{ timeSlot?.stoppedAt | utcToTimezone : (timeZone$ | async) | timeFormat : (timeFormat$ | async) : false }}\n\t\t\t</span>\n\t\t\t}\n\t\t</div>\n\t\t<!-- Member, Activity and Duration ride in the header, beside the time they\n\t\t     describe, so the body is left for screenshots, apps and time logs. -->\n\t\t@if (timeSlot) {\n\t\t<div class=\"slot-summary\">\n\t\t\t<div class=\"summary-item\" *ngxPermissionsOnly=\"[PermissionsEnum.CHANGE_SELECTED_EMPLOYEE]\">\n\t\t\t\t<span class=\"summary-label\">{{ 'TIMESHEET.MEMBER' | translate }}</span>\n\t\t\t\t<ngx-avatar\n\t\t\t\t\tclass=\"report-table\"\n\t\t\t\t\t[id]=\"timeSlot?.employee?.id\"\n\t\t\t\t\t[employee]=\"timeSlot?.employee\"\n\t\t\t\t\t[name]=\"timeSlot?.employee?.user?.name\"\n\t\t\t\t\t[src]=\"timeSlot?.employee?.user?.imageUrl\"\n\t\t\t\t></ngx-avatar>\n\t\t\t</div>\n\t\t\t<div class=\"summary-item\">\n\t\t\t\t<span class=\"summary-label\">{{ 'REPORT_PAGE.ACTIVITY' | translate }}</span>\n\t\t\t\t<div class=\"activity-meter\">\n\t\t\t\t\t<span class=\"summary-value\">{{ timeSlot?.percentage || 0 }}%</span>\n\t\t\t\t\t<nb-progress-bar\n\t\t\t\t\t\t[value]=\"timeSlot?.percentage\"\n\t\t\t\t\t\t[status]=\"progressStatus(timeSlot?.percentage)\"\n\t\t\t\t\t\t[displayValue]=\"false\"\n\t\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\t></nb-progress-bar>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class=\"summary-item\">\n\t\t\t\t<span class=\"summary-label\">{{ 'TIMESHEET.DURATION' | translate }}</span>\n\t\t\t\t<span class=\"summary-value\">\n\t\t\t\t\t{{ timeSlot?.duration | amFromUnix | amFromUtc | amDateFormat : 'mm' }}\n\t\t\t\t\t{{ 'ACTIVITY.MINUTES' | translate }}\n\t\t\t\t</span>\n\t\t\t</div>\n\t\t</div>\n\t\t}\n\t\t<button\n\t\t\tnbButton\n\t\t\tghost\n\t\t\tstatus=\"basic\"\n\t\t\tsize=\"small\"\n\t\t\ttype=\"button\"\n\t\t\tclass=\"icon-button close-button\"\n\t\t\t[attr.aria-label]=\"'BUTTONS.CLOSE' | translate\"\n\t\t\t(click)=\"close()\"\n\t\t>\n\t\t\t<nb-icon icon=\"close-outline\"></nb-icon>\n\t\t</button>\n\t</nb-card-header>\n\n\t<nb-card-body class=\"slot-body custom-scroll\">\n\t\t@if (timeSlot) {\n\t\t@if (screenshots.length > 0) {\n\t\t<section class=\"slot-section\">\n\t\t\t<div class=\"section-header\">\n\t\t\t\t<h6 class=\"section-title\">{{ 'TIMESHEET.SCREENSHOTS.SCREENSHOTS' | translate }}</h6>\n\t\t\t\t<span class=\"section-count\">{{ screenshots.length }}</span>\n\t\t\t</div>\n\t\t\t<div class=\"screenshot-grid\">\n\t\t\t\t@for (image of screenshots; track image.id) {\n\t\t\t\t@let recordedTime = image?.recordedAt | utcToTimezone : (timeZone$ | async) | timeFormat : (timeFormat$ | async) : false;\n\t\t\t\t<figure class=\"screenshot\" [class.not-work-related]=\"image?.isWorkRelated === false\">\n\t\t\t\t\t<!-- The frame opens the full-size gallery; its buttons stop the click. -->\n\t\t\t\t\t<div\n\t\t\t\t\t\tclass=\"screenshot-frame\"\n\t\t\t\t\t\tngxGallery\n\t\t\t\t\t\t[items]=\"screenshots\"\n\t\t\t\t\t\t[item]=\"image\"\n\t\t\t\t\t\t[employeeId]=\"timeSlot?.employee?.id\"\n\t\t\t\t\t>\n\t\t\t\t\t\t<img\n\t\t\t\t\t\t\tdraggable=\"false\"\n\t\t\t\t\t\t\t[src]=\"image?.thumbUrl\"\n\t\t\t\t\t\t\t[alt]=\"image?.description || ('TIMESHEET.SCREENSHOTS.TAKEN_AT' | translate : { time: recordedTime })\"\n\t\t\t\t\t\t/>\n\t\t\t\t\t\t<div class=\"screenshot-actions\">\n\t\t\t\t\t\t\t@if (image?.description) {\n\t\t\t\t\t\t\t<button\n\t\t\t\t\t\t\t\tnbButton\n\t\t\t\t\t\t\t\tghost\n\t\t\t\t\t\t\t\tstatus=\"basic\"\n\t\t\t\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\t\t\t\ttype=\"button\"\n\t\t\t\t\t\t\t\tclass=\"icon-button\"\n\t\t\t\t\t\t\t\t[nbTooltip]=\"image?.description\"\n\t\t\t\t\t\t\t\t[attr.aria-label]=\"'REPORT_PAGE.DESCRIPTION' | translate\"\n\t\t\t\t\t\t\t\t(click)=\"$event.stopPropagation()\"\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t<nb-icon icon=\"info-outline\"></nb-icon>\n\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t<button\n\t\t\t\t\t\t\t\tnbButton\n\t\t\t\t\t\t\t\tghost\n\t\t\t\t\t\t\t\tstatus=\"basic\"\n\t\t\t\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\t\t\t\ttype=\"button\"\n\t\t\t\t\t\t\t\tclass=\"icon-button\"\n\t\t\t\t\t\t\t\t[nbTooltip]=\"'TIMESHEET.DELETE' | translate\"\n\t\t\t\t\t\t\t\t[attr.aria-label]=\"'TIMESHEET.DELETE' | translate\"\n\t\t\t\t\t\t\t\t(click)=\"$event.stopPropagation(); deleteImage(image, image?.employee)\"\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t<nb-icon status=\"danger\" icon=\"trash-2-outline\"></nb-icon>\n\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<figcaption class=\"screenshot-time\">{{ recordedTime }}</figcaption>\n\t\t\t\t</figure>\n\t\t\t\t}\n\t\t\t</div>\n\t\t</section>\n\t\t}\n\n\t\t@if (apps?.length > 0) {\n\t\t<!-- The chips sit on the title's line; a short list needs no row of its own. -->\n\t\t<section class=\"slot-section apps\">\n\t\t\t<div class=\"section-header\">\n\t\t\t\t<h6 class=\"section-title\">{{ 'TIMESHEET.APPS' | translate }}</h6>\n\t\t\t\t<span class=\"section-count\">{{ apps.length }}</span>\n\t\t\t</div>\n\t\t\t<div class=\"app-list\">\n\t\t\t\t@for (app of apps; track app) {\n\t\t\t\t<span class=\"app-chip\">{{ app }}</span>\n\t\t\t\t}\n\t\t\t</div>\n\t\t</section>\n\t\t}\n\n\t\t<section class=\"slot-section\">\n\t\t\t<div class=\"section-header\">\n\t\t\t\t<h6 class=\"section-title\">{{ 'TIMESHEET.SCREENSHOTS.TIME_LOG' | translate }}</h6>\n\t\t\t\t@if (timeLogs?.length > 0) {\n\t\t\t\t<span class=\"section-count\">{{ timeLogs.length }}</span>\n\t\t\t\t}\n\t\t\t</div>\n\t\t\t@for (timeLog of timeLogs; track timeLog.id) {\n\t\t\t<div class=\"time-log\">\n\t\t\t\t<div class=\"time-log-header\">\n\t\t\t\t\t<div class=\"time-log-heading\">\n\t\t\t\t\t\t<span class=\"time-log-range\">\n\t\t\t\t\t\t\t{{ timeLog?.startedAt | utcToTimezone : (timeZone$ | async) | timeFormat : (timeFormat$ | async) }}\n\t\t\t\t\t\t\t\u2013\n\t\t\t\t\t\t\t@if (!timeLog?.isRunning) {\n\t\t\t\t\t\t\t{{ timeLog?.stoppedAt | utcToTimezone : (timeZone$ | async) | timeFormat : (timeFormat$ | async) }}\n\t\t\t\t\t\t\t} @else {\n\t\t\t\t\t\t\t{{ 'TIMESHEET.TILL_NOW' | translate }}\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t</span>\n\t\t\t\t\t\t<span class=\"time-log-duration\">{{ timeLog?.duration | durationFormat }}</span>\n\t\t\t\t\t\t@if (TimeLogsLabel[timeLog?.logType]; as label) {\n\t\t\t\t\t\t<nb-badge class=\"time-log-type\" [status]=\"label.status\" [text]=\"label.text\"></nb-badge>\n\t\t\t\t\t\t}\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"time-log-actions\">\n\t\t\t\t\t\t<button\n\t\t\t\t\t\t\tnbButton\n\t\t\t\t\t\t\tghost\n\t\t\t\t\t\t\tstatus=\"basic\"\n\t\t\t\t\t\t\tsize=\"small\"\n\t\t\t\t\t\t\ttype=\"button\"\n\t\t\t\t\t\t\tclass=\"icon-button\"\n\t\t\t\t\t\t\t[nbTooltip]=\"'TIMESHEET.VIEW' | translate\"\n\t\t\t\t\t\t\t[attr.aria-label]=\"'TIMESHEET.VIEW' | translate\"\n\t\t\t\t\t\t\t(click)=\"viewTimeLog(timeLog)\"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t<nb-icon icon=\"eye-outline\"></nb-icon>\n\t\t\t\t\t\t</button>\n\t\t\t\t\t\t<button\n\t\t\t\t\t\t\tnbButton\n\t\t\t\t\t\t\tghost\n\t\t\t\t\t\t\tstatus=\"basic\"\n\t\t\t\t\t\t\tsize=\"small\"\n\t\t\t\t\t\t\ttype=\"button\"\n\t\t\t\t\t\t\tclass=\"icon-button\"\n\t\t\t\t\t\t\t[nbTooltip]=\"'TIMESHEET.DELETE' | translate\"\n\t\t\t\t\t\t\t[attr.aria-label]=\"'TIMESHEET.DELETE' | translate\"\n\t\t\t\t\t\t\t(click)=\"$event.stopPropagation()\"\n\t\t\t\t\t\t\tngxConfirmDialog\n\t\t\t\t\t\t\t[message]=\"'TIMESHEET.DELETE_CONFIRM' | translate\"\n\t\t\t\t\t\t\t(confirm)=\"deleteTimeLog(timeLog, timeSlot?.employee)\"\n\t\t\t\t\t\t\t[disabled]=\"timeLog.isRunning\"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t<nb-icon status=\"danger\" icon=\"trash-2-outline\"></nb-icon>\n\t\t\t\t\t\t</button>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\n\t\t\t\t<!-- Two label/value pairs to a row (Source | Client, Project | To-do); the\n\t\t\t\t     free text, Notes and Reason, takes a row of its own. -->\n\t\t\t\t<dl class=\"time-log-fields\">\n\t\t\t\t\t<dt>{{ 'TIMESHEET.SOURCE' | translate }}</dt>\n\t\t\t\t\t<dd class=\"source\">\n\t\t\t\t\t\t<span>{{ timeLog?.source | replace : '_' : ' ' | titlecase }}</span>\n\t\t\t\t\t\t@if (timeLog?.version) {\n\t\t\t\t\t\t<span class=\"version\">{{ timeLog?.version }}</span>\n\t\t\t\t\t\t}\n\t\t\t\t\t</dd>\n\n\t\t\t\t\t<dt>{{ 'TIMESHEET.ORGANIZATION_CONTACT' | translate }}</dt>\n\t\t\t\t\t<dd>\n\t\t\t\t\t\t@if (timeLog?.organizationContact) {\n\t\t\t\t\t\t<ngx-contact-links [value]=\"timeLog?.organizationContact\"></ngx-contact-links>\n\t\t\t\t\t\t} @else {\n\t\t\t\t\t\t<span class=\"empty\">{{ 'TIMESHEET.NO_ORGANIZATION_CONTACT' | translate }}</span>\n\t\t\t\t\t\t}\n\t\t\t\t\t</dd>\n\n\t\t\t\t\t<dt>{{ 'TIMESHEET.PROJECT' | translate }}</dt>\n\t\t\t\t\t<dd>\n\t\t\t\t\t\t@if (timeLog?.project) {\n\t\t\t\t\t\t<ngx-project [rowData]=\"timeLog\"></ngx-project>\n\t\t\t\t\t\t} @else {\n\t\t\t\t\t\t<span class=\"empty\">{{ 'TIMESHEET.NO_PROJECT' | translate }}</span>\n\t\t\t\t\t\t}\n\t\t\t\t\t</dd>\n\n\t\t\t\t\t<dt>{{ 'TIMESHEET.TODO' | translate }}</dt>\n\t\t\t\t\t<dd>\n\t\t\t\t\t\t@if (timeLog?.task) {\n\t\t\t\t\t\t{{ timeLog?.task?.title }}\n\t\t\t\t\t\t} @else {\n\t\t\t\t\t\t<span class=\"empty\">{{ 'TIMESHEET.NO_TODO' | translate }}</span>\n\t\t\t\t\t\t}\n\t\t\t\t\t</dd>\n\n\t\t\t\t\t@if (timeLog?.description) {\n\t\t\t\t\t<dt class=\"wide\">{{ 'TIMESHEET.NOTES' | translate }}</dt>\n\t\t\t\t\t<dd class=\"wide\">{{ timeLog?.description }}</dd>\n\t\t\t\t\t}\n\n\t\t\t\t\t@if (timeLog?.reason) {\n\t\t\t\t\t<dt class=\"wide\">{{ 'TIMESHEET.REASON' | translate }}</dt>\n\t\t\t\t\t<dd class=\"wide\">{{ timeLog?.reason }}</dd>\n\t\t\t\t\t}\n\t\t\t\t</dl>\n\n\t\t\t\t@if (timeLog?.isRunning) {\n\t\t\t\t<nb-alert status=\"warning\" size=\"tiny\" class=\"running-warning\">\n\t\t\t\t\t{{ 'TIMESHEET.RUNNING_TIMER_WARNING' | translate }}\n\t\t\t\t</nb-alert>\n\t\t\t\t}\n\t\t\t</div>\n\t\t\t}\n\t\t</section>\n\t\t}\n\t</nb-card-body>\n</nb-card>\n", styles: [":host{display:block;width:calc(50.875rem + 2px);max-width:calc(100vw - 2rem)}:host nb-card.slot-card{margin:0;border:1px solid var(--gauzy-border-default-color);background-color:var(--gauzy-card-1)}:host nb-card-header.slot-header{display:grid;grid-template-areas:\"heading summary close\";grid-template-columns:minmax(0,1fr) auto auto;align-items:center;column-gap:1rem;padding:.75rem .75rem .75rem 1.25rem;border-bottom:1px solid var(--gauzy-border-default-color)}@media(max-width:52.5rem){:host nb-card-header.slot-header{grid-template-areas:\"heading close\" \"summary summary\";grid-template-columns:minmax(0,1fr) auto;row-gap:.75rem}}:host .close-button{grid-area:close}:host .slot-heading{grid-area:heading;display:flex;flex-direction:column;gap:.25rem;min-width:0}:host .slot-title{font-size:14px;font-weight:600;line-height:1rem;letter-spacing:0;color:var(--gauzy-text-color-1);line-height:1.25rem}:host .slot-subtitle{font-size:12px;font-weight:400;line-height:1rem;letter-spacing:0;color:var(--gauzy-text-color-2);font-variant-numeric:tabular-nums}:host .icon-button[nbButton]{width:1.75rem;height:1.75rem;min-width:0;margin:0;padding:0!important}:host .icon-button[nbButton] nb-icon{width:1rem;height:1rem;margin:0;font-size:1rem}:host .icon-button[nbButton]:focus:not(:focus-visible):not(:hover){box-shadow:none}:host .icon-button[nbButton].appearance-ghost:focus:not(:focus-visible):not(:hover){border-color:transparent;background-color:transparent}:host nb-card-body.slot-body{display:flex;flex-direction:column;gap:1rem;padding:1rem 1.25rem}:host .slot-summary{grid-area:summary;display:flex;align-items:stretch}:host .summary-item{display:flex;flex-direction:column;justify-content:flex-start;gap:.25rem;min-width:0;padding-inline:1rem}:host .summary-item+.summary-item{border-inline-start:1px solid var(--gauzy-border-default-color)}:host .summary-item:first-child{padding-inline-start:0}:host .summary-item:last-child{padding-inline-end:.25rem}:host .summary-label{font-size:12px;font-weight:400;line-height:1rem;letter-spacing:0;color:var(--gauzy-text-color-2)}:host .summary-item>.summary-value,:host .summary-item>.activity-meter,:host .summary-item>ngx-avatar{display:flex;align-items:center;min-height:1.875rem}:host .summary-value{font-size:14px;font-weight:600;line-height:1rem;letter-spacing:0;color:var(--gauzy-text-color-1);line-height:1.25rem;white-space:nowrap;font-variant-numeric:tabular-nums}:host .activity-meter{display:flex;align-items:center;gap:.625rem}:host .activity-meter nb-progress-bar{flex:none;width:6rem}:host .activity-meter nb-progress-bar ::ng-deep .progress-container{height:5px;background-color:var(--gauzy-card-2)}:host .slot-section{display:flex;flex-direction:column;gap:.75rem}:host .section-header{display:flex;align-items:center;gap:.5rem}:host .section-title{font-size:12px;font-weight:600;line-height:1rem;letter-spacing:0;color:var(--gauzy-text-color-1);margin:0}:host .section-count{font-size:11px;font-weight:600;line-height:1rem;letter-spacing:0;color:var(--gauzy-text-color-2);min-width:1.25rem;padding:.125rem .375rem;border-radius:9999px;background:var(--gauzy-sidebar-background-3);text-align:center;font-variant-numeric:tabular-nums}:host .screenshot-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(15.625rem,100%),15.625rem));gap:.75rem}:host .screenshot{display:flex;flex-direction:column;gap:.375rem;min-width:0;margin:0}:host .screenshot-frame{position:relative;height:8.125rem;overflow:hidden;border:1px solid var(--gauzy-border-default-color);border-radius:var(--border-radius);background:var(--gauzy-hover-tint);cursor:zoom-in}:host .screenshot-frame img{display:block;width:100%;height:100%;object-fit:cover;transition:transform .2s ease}:host .screenshot-frame img.default-image{box-sizing:border-box;padding:2.5rem;object-fit:contain;opacity:.35!important}:host .screenshot-frame:hover img{transform:scale(1.03)}:host .screenshot-actions{position:absolute;top:.375rem;right:.375rem;display:flex;gap:.25rem;opacity:0;transition:opacity .15s ease}:host .screenshot-actions .icon-button[nbButton]{width:1.5rem;height:1.5rem;border:none;background-color:#0009;color:#fff}:host .screenshot-actions .icon-button[nbButton]:hover{background-color:#000c}:host .screenshot-actions .icon-button[nbButton] nb-icon{width:.875rem;height:.875rem;font-size:.875rem}:host .screenshot-actions .icon-button[nbButton] nb-icon:not(.status-danger){color:#fff}:host .screenshot-frame:hover .screenshot-actions,:host .screenshot-actions:focus-within{opacity:1}:host .screenshot.not-work-related .screenshot-frame{border:2px solid var(--color-danger-500)}:host .screenshot-time{font-size:12px;font-weight:400;line-height:1rem;letter-spacing:0;color:var(--gauzy-text-color-2);text-align:center;font-variant-numeric:tabular-nums}:host .slot-section.apps{flex-direction:row;align-items:center}:host .slot-section.apps .app-list{flex:1 1 0;min-width:0}:host .app-list{display:flex;flex-wrap:wrap;gap:.5rem}:host .app-chip{font-size:12px;font-weight:500;line-height:1rem;letter-spacing:0;color:var(--gauzy-text-color-1);padding:.25rem .625rem;border:1px solid var(--gauzy-border-default-color);border-radius:9999px;background:var(--gauzy-card-2)}:host .time-log{overflow:hidden;border:1px solid var(--gauzy-border-default-color);border-radius:var(--border-radius)}:host .time-log+.time-log{margin-top:.25rem}:host .time-log-header{display:flex;align-items:center;justify-content:space-between;gap:.75rem;padding:.5rem .5rem .5rem 1rem;border-bottom:1px solid var(--gauzy-border-default-color);background:var(--gauzy-card-2)}:host .time-log-heading{display:flex;flex-wrap:wrap;align-items:center;gap:.5rem;min-width:0}:host .time-log-range{font-size:12px;font-weight:600;line-height:1rem;letter-spacing:0;color:var(--gauzy-text-color-1);white-space:nowrap;font-variant-numeric:tabular-nums}:host .time-log-duration{font-size:12px;font-weight:600;line-height:1rem;letter-spacing:0;color:var(--gauzy-text-color-1);padding:.125rem .5rem;border-radius:var(--border-radius);background:var(--gauzy-sidebar-background-3);font-variant-numeric:tabular-nums}:host nb-badge.time-log-type{position:static;padding:.125rem .5rem;border-radius:9999px;font-size:11px;font-weight:600;line-height:1rem;letter-spacing:.02em}:host .time-log-actions{display:flex;flex:none;align-items:center;gap:.25rem}:host .time-log-fields{display:grid;grid-template-columns:5.5rem minmax(0,1fr) 5.5rem minmax(0,1fr);align-items:center;gap:.625rem .75rem;margin:0;padding:.75rem 1rem}:host .time-log-fields dt.wide{grid-column:1}:host .time-log-fields dd.wide{grid-column:2/-1}@media(max-width:52.5rem){:host .time-log-fields{grid-template-columns:5.5rem minmax(0,1fr)}:host .time-log-fields dd.wide{grid-column:2}}:host .time-log-fields dt{font-size:12px;font-weight:400;line-height:1rem;letter-spacing:0;color:var(--gauzy-text-color-2)}:host .time-log-fields dd{font-size:12px;font-weight:400;line-height:1rem;letter-spacing:0;color:var(--gauzy-text-color-1);margin:0;min-width:0;overflow-wrap:anywhere}:host .time-log-fields .source{display:flex;align-items:center;gap:.5rem}:host .time-log-fields .version{font-size:11px;font-weight:600;line-height:1rem;letter-spacing:0;color:var(--gauzy-text-color-2);padding:.0625rem .375rem;border:1px solid var(--gauzy-border-default-color);border-radius:9999px}:host .time-log-fields .empty{color:var(--gauzy-text-color-2)}:host ngx-contact-links ::ng-deep .names-wrapper{max-width:none!important}:host ngx-project ::ng-deep .project-render{align-items:center;gap:.5rem}:host ngx-project ::ng-deep .project-render img{width:1.25rem;height:1.25rem;box-shadow:none}:host ngx-project ::ng-deep .project-render .name{font-size:12px;font-weight:500;line-height:1rem}:host ngx-project ::ng-deep .project-render .member{display:none}:host nb-alert.running-warning{margin:0 1rem .875rem;padding:.5rem .75rem;font-size:12px;line-height:1rem}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [{ type: i1.Store }, { type: i2.NbDialogRef }, { type: i1.TimesheetService }, { type: i2.NbDialogService }, { type: i1.ToastrService }, { type: i3.TimeZoneService }], propDecorators: { timeSlot: [{
                type: Input
            }], timeLogs: [{
                type: Input
            }] } });
//# sourceMappingURL=view-screenshots-modal.component.js.map