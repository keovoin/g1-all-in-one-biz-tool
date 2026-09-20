import { __decorate, __metadata } from "tslib";
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { combineLatest, filter } from 'rxjs';
import { tap } from 'rxjs/operators';
import { NbPopoverDirective } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import moment from 'moment-timezone';
import { DEFAULT_TIME_FORMATS } from '@gauzy/constants';
import { PermissionsEnum, TimeFormatEnum, TimeZoneEnum } from '@gauzy/contracts';
import { distinctUntilChange } from '@gauzy/ui-core/common';
import { NavigationService, Store } from '@gauzy/ui-core/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { TimeZoneService } from './time-zone.service';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
import * as i2 from "@angular/router";
import * as i3 from "@gauzy/ui-core/core";
import * as i4 from "./time-zone.service";
import * as i5 from "@nebular/theme";
let TimezoneFilterComponent = class TimezoneFilterComponent extends TranslationBaseComponent {
    constructor(translateService, _route, _store, _navigationService, _timeZoneService) {
        super(translateService);
        this.translateService = translateService;
        this._route = _route;
        this._store = _store;
        this._navigationService = _navigationService;
        this._timeZoneService = _timeZoneService;
        this.timeZoneOptions = [
            {
                value: TimeZoneEnum.UTC_TIMEZONE,
                label: this.getTranslation('TIMESHEET.TIME_ZONE_OPTION.UTC')
            },
            {
                value: TimeZoneEnum.ORG_TIMEZONE,
                label: this.getTranslation('TIMESHEET.TIME_ZONE_OPTION.ORG_TIMEZONE')
            },
            {
                value: TimeZoneEnum.MINE_TIMEZONE,
                label: this.getTranslation('TIMESHEET.TIME_ZONE_OPTION.MY_TIMEZONE')
            }
        ];
        this.timeFormatsOptions = DEFAULT_TIME_FORMATS;
        this.selectedTimeFormat = TimeFormatEnum.FORMAT_12_HOURS;
        this.selectedTimeZone = TimeZoneEnum.UTC_TIMEZONE;
        this.isTimezone = true;
        this.isTimeFormat = true;
        this.timeZoneChange = new EventEmitter();
        this.timeFormatChange = new EventEmitter();
    }
    ngOnInit() {
        // Extract query parameter
        const queryParams$ = this._route.queryParams.pipe(filter((params) => !!params), distinctUntilChange());
        const storeOrganization$ = this._store.selectedOrganization$.pipe(filter((organization) => !!organization), filter(() => this.hasChangeSelectedEmployeePermission()), distinctUntilChange());
        combineLatest([queryParams$, storeOrganization$])
            .pipe(tap(([queryParams, organization]) => {
            if (this.isTimeFormat)
                this.applyTimeFormat(queryParams, organization.timeFormat);
            if (this.isTimezone)
                this.applyTimeZone(queryParams, TimeZoneEnum.ORG_TIMEZONE);
        }), 
        // Handle component lifecycle to avoid memory leaks
        untilDestroyed(this))
            .subscribe();
    }
    ngAfterViewInit() {
        // Extract query parameter
        const queryParams$ = this._route.queryParams.pipe(filter((params) => !!params), distinctUntilChange());
        const storeUser$ = this._store.user$.pipe(filter((user) => !!user), filter(() => !this.hasChangeSelectedEmployeePermission()));
        combineLatest([queryParams$, storeUser$])
            .pipe(distinctUntilChange(), tap(([queryParams, user]) => {
            if (this.isTimeFormat)
                this.applyTimeFormat(queryParams, user.timeFormat);
            if (this.isTimezone)
                this.applyTimeZone(queryParams, TimeZoneEnum.MINE_TIMEZONE);
        }), 
        // Handle component lifecycle to avoid memory leaks
        untilDestroyed(this))
            .subscribe();
    }
    /**
     * Applies the appropriate time format based on query parameters, organization settings, and employee settings.
     *
     * @param queryParams The query parameters from the route.
     * @param organization The organization details.
     */
    applyTimeFormat(queryParams, timeFormat) {
        const { time_format } = queryParams;
        // Apply query parameters first
        if (time_format) {
            this.selectTimeFormat(parseInt(time_format, 10));
        }
        else {
            this.selectTimeFormat(timeFormat);
        }
    }
    /**
     * Applies the appropriate time zone based on query parameters and organization settings.
     * @param queryParams The query parameters from the route.
     * @param organization The organization details.
     */
    applyTimeZone(queryParams, timeZone) {
        const { time_zone } = queryParams;
        // Apply query parameters first
        if (time_zone) {
            this.selectTimeZone(time_zone);
        }
        else {
            this.selectTimeZone(timeZone);
        }
    }
    /**
     * Sets the selected time format based on the provided time format.
     *
     * @param timeFormat The time format to set.
     */
    selectTimeFormat(timeFormat) {
        const is24Hours = timeFormat == TimeFormatEnum.FORMAT_24_HOURS;
        this.selectedTimeFormat = is24Hours ? TimeFormatEnum.FORMAT_24_HOURS : TimeFormatEnum.FORMAT_12_HOURS;
        // Set the time format using the TimeZoneService
        this._timeZoneService.setTimeFormat(this.selectedTimeFormat);
        // Emit the timeFormatChange event with the new time format
        this.timeFormatChange.emit(this.selectedTimeFormat);
    }
    /**
     * Sets the selected timezone based on the provided timezone enum value.
     *
     * @param timeZone The timezone enum value to set.
     */
    selectTimeZone(timeZone) {
        switch (timeZone) {
            case TimeZoneEnum.ORG_TIMEZONE:
            case TimeZoneEnum.MINE_TIMEZONE:
                this.selectedTimeZone = timeZone;
                break;
            default:
                this.selectedTimeZone = TimeZoneEnum.UTC_TIMEZONE;
                break;
        }
        // Get the moment timezone string representation of the selected timezone
        const timezone = this.getMomentTimezone(this.selectedTimeZone);
        // Set the timezone using the TimeZoneService
        this._timeZoneService.setTimeZone(timezone);
        // Emit the timeZoneChange event with the new timezone
        this.timeZoneChange.emit(timezone);
    }
    /**
     * Updates the selected time format and updates the corresponding query parameter.
     *
     * @param timeFormat The time format to update.
     */
    async updateSelectedTimeFormat(timeFormat) {
        // Update the selected time format
        this.selectTimeFormat(timeFormat);
        // Updates the query parameters of the current route without navigating away.
        await this._navigationService.updateQueryParams({
            time_format: timeFormat.toString()
        });
    }
    /**
     * Updates the selected time zone and updates the corresponding query parameter.
     *
     * @param timeZone The time zone to update.
     */
    async updateSelectedTimeZone(timeZone) {
        // Update the selected time zone
        this.selectTimeZone(timeZone);
        // Updates the query parameters of the current route without navigating away.
        await this._navigationService.updateQueryParams({
            time_zone: timeZone.toString()
        });
    }
    /**
     * Retrieves the timezone abbreviation with the region and city for the given zone.
     *
     * @returns
     */
    getTimeZoneWithOffset() {
        const zone = this._timeZoneService.currentTimeZone;
        let region = '';
        let city = '';
        // Split the zone into region and city if it contains '/'
        if (zone.includes('/')) {
            [region, city] = zone.split('/');
            city = city.replace('_', ' '); // Replace underscores with spaces if any
        }
        else {
            city = zone;
        }
        // Get the timezone abbreviation
        const offset = moment.tz(zone).format('z');
        // Construct the return string
        return `${offset}: ${region} - ${city}`;
    }
    /**
     * Gets the time zone based on the selected time zone.
     *
     * @returns The time zone string.
     */
    getMomentTimezone(zone) {
        const defaultTimeZone = 'Etc/UTC';
        let timeZone;
        switch (zone) {
            case TimeZoneEnum.MINE_TIMEZONE:
                timeZone = this._store.user?.timeZone || moment.tz.guess();
                break;
            case TimeZoneEnum.ORG_TIMEZONE:
                timeZone = this._store.selectedOrganization?.timeZone || defaultTimeZone;
                break;
            case TimeZoneEnum.UTC_TIMEZONE:
            default:
                timeZone = defaultTimeZone;
                break;
        }
        return timeZone;
    }
    /**
     * Checks if the current user has the permission to change the selected employee.
     *
     * @returns A boolean indicating if the user has the CHANGE_SELECTED_EMPLOYEE permission.
     */
    hasChangeSelectedEmployeePermission() {
        return this._store.hasPermission(PermissionsEnum.CHANGE_SELECTED_EMPLOYEE);
    }
    /**
     * Closes the popover.
     * This method is triggered by a click event on the popover button
     * and hides the popover using the NbPopoverDirective's hide method.
     */
    closePopover() {
        this.popover.hide();
    }
    /**
     *
     */
    ngOnDestroy() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TimezoneFilterComponent, deps: [{ token: i1.TranslateService }, { token: i2.ActivatedRoute }, { token: i3.Store }, { token: i3.NavigationService }, { token: i4.TimeZoneService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: TimezoneFilterComponent, isStandalone: false, selector: "ga-timezone-filter", inputs: { isTimezone: "isTimezone", isTimeFormat: "isTimeFormat" }, outputs: { timeZoneChange: "timeZoneChange", timeFormatChange: "timeFormatChange" }, viewQueries: [{ propertyName: "popover", first: true, predicate: ["popover"], descendants: true, static: true }], usesInheritance: true, ngImport: i0, template: "<button\n\tclass=\"popover-button\"\n\tnbButton\n\tsize=\"small\"\n\tstatus=\"basic\"\n\tnbPopoverPlacement=\"bottom\"\n\t[nbPopover]=\"nbPopoverTemplate\"\n\tnbPopoverTrigger=\"click\"\n\t#popover=\"nbPopover\"\n>\n\t<div>\n\t\t@if (isTimezone) {\n\t\t{{ getTimeZoneWithOffset() }}\n\t\t} @if (isTimeFormat) { / {{ selectedTimeFormat }} hour }\n\t</div>\n\t<nb-icon icon=\"more-vertical-outline\"></nb-icon>\n</button>\n\n<ng-template #nbPopoverTemplate>\n\t<div class=\"popover-body\">\n\t\t@if (isTimezone) {\n\t\t<div class=\"category\">\n\t\t\t<div class=\"view\">{{ 'TIMESHEET.TIME_ZONE' | translate }}</div>\n\t\t\t@for (timeZoneOption of timeZoneOptions; track timeZoneOption) {\n\t\t\t<div class=\"title\" (click)=\"updateSelectedTimeZone(timeZoneOption.value); closePopover()\">\n\t\t\t\t<i\n\t\t\t\t\t[style.visibility]=\"selectedTimeZone === timeZoneOption.value ? 'visible' : 'hidden'\"\n\t\t\t\t\tclass=\"fas fa-check\"\n\t\t\t\t></i>\n\t\t\t\t<div>{{ timeZoneOption.label }}</div>\n\t\t\t</div>\n\t\t\t}\n\t\t</div>\n\t\t@if (isTimeFormat) {\n\t\t<div class=\"line\"></div>\n\t\t} } @if (isTimeFormat) {\n\t\t<div class=\"category\">\n\t\t\t<div class=\"view\">{{ 'TIMESHEET.TIME_FORMAT' | translate }}</div>\n\t\t\t@for (timeFormatsOption of timeFormatsOptions; track timeFormatsOption) {\n\t\t\t<div class=\"title\" (click)=\"updateSelectedTimeFormat(timeFormatsOption); closePopover()\">\n\t\t\t\t<i\n\t\t\t\t\t[style.visibility]=\"selectedTimeFormat === timeFormatsOption ? 'visible' : 'hidden'\"\n\t\t\t\t\tclass=\"fas fa-check\"\n\t\t\t\t></i>\n\t\t\t\t<div>{{ timeFormatsOption }} hour</div>\n\t\t\t</div>\n\t\t\t}\n\t\t</div>\n\t\t}\n\t</div>\n</ng-template>\n", styles: [":host .popover-button{font-size:var(--gauzy-table-header-font-size);line-height:var(--gauzy-table-header-line-height);font-weight:400}:host .popover-button[nbButton]{color:var(--gauzy-text-color-1);background-color:var(--gauzy-card-1)}:host .popover-button nb-icon{height:11px;width:11px}.popover-body{display:flex;flex-direction:column;align-items:flex-start;padding:10px;gap:10px;min-width:150px}.popover-body .category{display:flex;flex-direction:column;align-items:flex-start;gap:10px;width:100%}.popover-body .category .view{font-size:10px;font-weight:600;line-height:12px;letter-spacing:0em;color:#7e7e8f80;align-items:center;display:flex;justify-content:space-between;gap:1rem;width:100%}.popover-body .category .title{font-size:var(--gauzy-table-header-font-size);font-weight:400;line-height:var(--gauzy-table-header-line-height);letter-spacing:0em;color:var(--gauzy-text-color-2);display:flex;align-items:center;gap:10px;cursor:pointer;width:100%}.popover-body .line{border-bottom:.5px solid rgba(126,126,143,.25);width:100%}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "component", type: i5.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "component", type: i5.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "directive", type: i5.NbPopoverDirective, selector: "[nbPopover]", inputs: ["nbPopover", "nbPopoverContext", "nbPopoverPlacement", "nbPopoverAdjustment", "nbPopoverTrigger", "nbPopoverOffset", "nbTooltipDisabled", "nbPopoverClass"], outputs: ["nbPopoverShowStateChange"], exportAs: ["nbPopover"] }, { kind: "pipe", type: i1.TranslatePipe, name: "translate" }] }); }
};
TimezoneFilterComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [TranslateService,
        ActivatedRoute,
        Store,
        NavigationService,
        TimeZoneService])
], TimezoneFilterComponent);
export { TimezoneFilterComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TimezoneFilterComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-timezone-filter', standalone: false, template: "<button\n\tclass=\"popover-button\"\n\tnbButton\n\tsize=\"small\"\n\tstatus=\"basic\"\n\tnbPopoverPlacement=\"bottom\"\n\t[nbPopover]=\"nbPopoverTemplate\"\n\tnbPopoverTrigger=\"click\"\n\t#popover=\"nbPopover\"\n>\n\t<div>\n\t\t@if (isTimezone) {\n\t\t{{ getTimeZoneWithOffset() }}\n\t\t} @if (isTimeFormat) { / {{ selectedTimeFormat }} hour }\n\t</div>\n\t<nb-icon icon=\"more-vertical-outline\"></nb-icon>\n</button>\n\n<ng-template #nbPopoverTemplate>\n\t<div class=\"popover-body\">\n\t\t@if (isTimezone) {\n\t\t<div class=\"category\">\n\t\t\t<div class=\"view\">{{ 'TIMESHEET.TIME_ZONE' | translate }}</div>\n\t\t\t@for (timeZoneOption of timeZoneOptions; track timeZoneOption) {\n\t\t\t<div class=\"title\" (click)=\"updateSelectedTimeZone(timeZoneOption.value); closePopover()\">\n\t\t\t\t<i\n\t\t\t\t\t[style.visibility]=\"selectedTimeZone === timeZoneOption.value ? 'visible' : 'hidden'\"\n\t\t\t\t\tclass=\"fas fa-check\"\n\t\t\t\t></i>\n\t\t\t\t<div>{{ timeZoneOption.label }}</div>\n\t\t\t</div>\n\t\t\t}\n\t\t</div>\n\t\t@if (isTimeFormat) {\n\t\t<div class=\"line\"></div>\n\t\t} } @if (isTimeFormat) {\n\t\t<div class=\"category\">\n\t\t\t<div class=\"view\">{{ 'TIMESHEET.TIME_FORMAT' | translate }}</div>\n\t\t\t@for (timeFormatsOption of timeFormatsOptions; track timeFormatsOption) {\n\t\t\t<div class=\"title\" (click)=\"updateSelectedTimeFormat(timeFormatsOption); closePopover()\">\n\t\t\t\t<i\n\t\t\t\t\t[style.visibility]=\"selectedTimeFormat === timeFormatsOption ? 'visible' : 'hidden'\"\n\t\t\t\t\tclass=\"fas fa-check\"\n\t\t\t\t></i>\n\t\t\t\t<div>{{ timeFormatsOption }} hour</div>\n\t\t\t</div>\n\t\t\t}\n\t\t</div>\n\t\t}\n\t</div>\n</ng-template>\n", styles: [":host .popover-button{font-size:var(--gauzy-table-header-font-size);line-height:var(--gauzy-table-header-line-height);font-weight:400}:host .popover-button[nbButton]{color:var(--gauzy-text-color-1);background-color:var(--gauzy-card-1)}:host .popover-button nb-icon{height:11px;width:11px}.popover-body{display:flex;flex-direction:column;align-items:flex-start;padding:10px;gap:10px;min-width:150px}.popover-body .category{display:flex;flex-direction:column;align-items:flex-start;gap:10px;width:100%}.popover-body .category .view{font-size:10px;font-weight:600;line-height:12px;letter-spacing:0em;color:#7e7e8f80;align-items:center;display:flex;justify-content:space-between;gap:1rem;width:100%}.popover-body .category .title{font-size:var(--gauzy-table-header-font-size);font-weight:400;line-height:var(--gauzy-table-header-line-height);letter-spacing:0em;color:var(--gauzy-text-color-2);display:flex;align-items:center;gap:10px;cursor:pointer;width:100%}.popover-body .line{border-bottom:.5px solid rgba(126,126,143,.25);width:100%}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [{ type: i1.TranslateService }, { type: i2.ActivatedRoute }, { type: i3.Store }, { type: i3.NavigationService }, { type: i4.TimeZoneService }], propDecorators: { isTimezone: [{
                type: Input
            }], isTimeFormat: [{
                type: Input
            }], timeZoneChange: [{
                type: Output
            }], timeFormatChange: [{
                type: Output
            }], popover: [{
                type: ViewChild,
                args: ['popover', { static: true }]
            }] } });
//# sourceMappingURL=timezone-filter.component.js.map