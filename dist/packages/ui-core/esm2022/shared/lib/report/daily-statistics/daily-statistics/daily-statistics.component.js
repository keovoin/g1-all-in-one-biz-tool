import { __decorate, __metadata } from "tslib";
import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { PermissionsEnum } from '@gauzy/contracts';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { pick } from 'underscore';
import { debounceTime, filter, tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { distinctUntilChange, isEmpty } from '@gauzy/ui-core/common';
import { DateRangePickerBuilderService, EmployeesService, OrganizationProjectsService, Store, TimesheetStatisticsService } from '@gauzy/ui-core/core';
import { BaseSelectorFilterComponent, TimeZoneService } from '../../../timesheet/gauzy-filters';
import * as i0 from "@angular/core";
import * as i1 from "@gauzy/ui-core/core";
import * as i2 from "@ngx-translate/core";
import * as i3 from "../../../timesheet/gauzy-filters";
import * as i4 from "@nebular/theme";
import * as i5 from "ngx-permissions";
import * as i6 from "../../../counter-point/counter-point.component";
import * as i7 from "../../../pipes/duration-format.pipe";
let DailyStatisticsComponent = class DailyStatisticsComponent extends BaseSelectorFilterComponent {
    get filters() {
        return this._filters;
    }
    set filters(filters) {
        if (filters) {
            this._filters = filters;
            this.subject$.next(true);
        }
    }
    constructor(timesheetStatisticsService, store, dateRangePickerBuilderService, translateService, cd, employeesService, projectService, timeZoneService) {
        super(store, translateService, dateRangePickerBuilderService, timeZoneService);
        this.timesheetStatisticsService = timesheetStatisticsService;
        this.store = store;
        this.dateRangePickerBuilderService = dateRangePickerBuilderService;
        this.translateService = translateService;
        this.cd = cd;
        this.employeesService = employeesService;
        this.projectService = projectService;
        this.timeZoneService = timeZoneService;
        this.payloads$ = new BehaviorSubject(null);
        this.PermissionsEnum = PermissionsEnum;
        /*
         * Getter & Setter for dynamic filters
         */
        this._filters = this.request;
    }
    ngOnInit() {
        this.subject$
            .pipe(debounceTime(200), tap(() => this.prepareRequest()), untilDestroyed(this))
            .subscribe();
        this.payloads$
            .pipe(debounceTime(200), distinctUntilChange(), filter((payloads) => !!payloads), tap(() => this.getCounts()), untilDestroyed(this))
            .subscribe();
    }
    prepareRequest() {
        if (!this.organization || isEmpty(this.filters)) {
            return;
        }
        const appliedFilter = pick(this.filters, 'source', 'activityLevel', 'logType');
        const request = {
            ...appliedFilter,
            ...this.getFilterRequest(this.request)
        };
        this.payloads$.next(request);
    }
    ngAfterViewInit() {
        this.cd.detectChanges();
    }
    /**
     * Retrieves counts from the timesheet statistics service based on current filters and organization.
     * Loads employee and project counts if organization and filters are defined.
     */
    async getCounts() {
        try {
            // Check if organization or filters are not defined, return if so
            if (!this.organization || isEmpty(this.filters)) {
                return;
            }
            // Extract payloads from BehaviorSubject
            const payloads = this.payloads$.getValue();
            // Set loading state to true
            this.loading = true;
            // Retrieve counts from timesheet statistics service
            const counts = await this.timesheetStatisticsService.getCounts(payloads);
            // Update counts
            this.counts = counts;
            // Load employee and project counts
            await Promise.all([this.loadEmployeesCount(), this.loadProjectsCount()]);
        }
        catch (error) {
            // Log error if any
            console.error('Error while retrieving daily statistics', error);
        }
        finally {
            // Set loading state to false
            this.loading = false;
        }
    }
    /**
     * Loads the count of employees for the organization.
     */
    async loadEmployeesCount() {
        // Check if the user already has an associated employee
        if (this.store.user.employee) {
            // If the user has an employee, no need to load the count
            return;
        }
        // Extract organization and tenant IDs
        const { id: organizationId, tenantId } = this.organization;
        // Retrieve the count of employees for the organization
        this.employeesService
            .getCount({ organizationId, tenantId })
            .pipe(
        // Update employees count when count is received
        tap((count) => (this.employeesCount = count)), 
        // Unsubscribe from the observable when component is destroyed
        untilDestroyed(this))
            .subscribe();
    }
    /**
     * Loads the count of projects for the organization.
     */
    async loadProjectsCount() {
        // Extract organization and tenant IDs
        const { id: organizationId, tenantId } = this.organization;
        // Retrieve the count of projects for the organization
        this.projectsCount = await this.projectService.getCount({
            organizationId,
            tenantId
        });
    }
    get period() {
        if (this.request && this.organization) {
            const { startDate, endDate } = this.request;
            const endWork = moment(this.organization.defaultEndTime, 'HH:mm');
            const startWork = moment(this.organization.defaultStartTime, 'HH:mm');
            const duration = endWork.diff(startWork) / 1000;
            if (startDate && endDate && this.counts) {
                const start = moment(startDate);
                const end = moment(endDate);
                const dayCount = end.diff(start, 'days') + 1;
                return dayCount * (isNaN(duration) ? 86400 : duration) * this.counts.employeesCount;
            }
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DailyStatisticsComponent, deps: [{ token: i1.TimesheetStatisticsService }, { token: i1.Store }, { token: i1.DateRangePickerBuilderService }, { token: i2.TranslateService }, { token: i0.ChangeDetectorRef }, { token: i1.EmployeesService }, { token: i1.OrganizationProjectsService }, { token: i3.TimeZoneService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: DailyStatisticsComponent, isStandalone: false, selector: "ga-daily-statistics", inputs: { filters: "filters" }, usesInheritance: true, ngImport: i0, template: "<div class=\"main-wrapper\">\n  @if (!request.employeeIds) {\n    <div\n      class=\"daily-item\"\n      *ngxPermissionsOnly=\"PermissionsEnum.CHANGE_SELECTED_EMPLOYEE\">\n      <nb-card\n        [nbSpinner]=\"loading\"\n        nbSpinnerSize=\"giant\"\n        nbSpinnerStatus=\"primary\"\n        class=\"mb-0\">\n        <nb-card-body>\n          <p>\n            {{ 'REPORT_PAGE.MEMBERS_WORKED' | translate }}\n          </p>\n          <div class=\"h1\">\n            {{ counts?.employeesCount || 0 }}\n          </div>\n          <div class=\"progress-container\">\n            <gauzy-counter-point\n              [total]=\"employeesCount\"\n              [value]=\"counts?.employeesCount || 0\"\n              [color]=\"'#0088FE'\"\n            ></gauzy-counter-point>\n          </div>\n        </nb-card-body>\n      </nb-card>\n    </div>\n  }\n  @if (!request.projectIds) {\n    <div class=\"daily-item\">\n      <nb-card\n        [nbSpinner]=\"loading\"\n        nbSpinnerSize=\"giant\"\n        nbSpinnerStatus=\"primary\"\n        class=\"mb-0\"\n        >\n        <nb-card-body>\n          <p>\n            {{ 'REPORT_PAGE.PROJECTS_WORKED' | translate }}\n          </p>\n          <div class=\"h1\">\n            {{ counts?.projectsCount || 0 }}\n          </div>\n          <div class=\"progress-container\">\n            <gauzy-counter-point\n              [total]=\"projectsCount\"\n              [value]=\"counts?.projectsCount || 0\"\n              [color]=\"'#00D68F'\"\n            ></gauzy-counter-point>\n          </div>\n        </nb-card-body>\n      </nb-card>\n    </div>\n  }\n  <div class=\"daily-item\">\n    <nb-card\n      [nbSpinner]=\"loading\"\n      nbSpinnerSize=\"giant\"\n      nbSpinnerStatus=\"primary\"\n      class=\"mb-0\"\n      >\n      <nb-card-body>\n        <p>\n          {{ 'REPORT_PAGE.ACTIVITY' | translate }}\n        </p>\n        <div class=\"h1\">{{ counts?.weekActivities || 0 }}%</div>\n        <div class=\"progress-container\">\n          <gauzy-counter-point\n            [progress]=\"true\"\n            [value]=\"counts?.weekActivities || 0\"\n          ></gauzy-counter-point>\n        </div>\n      </nb-card-body>\n    </nb-card>\n  </div>\n  <div class=\"daily-item\">\n    <nb-card\n      [nbSpinner]=\"loading\"\n      nbSpinnerSize=\"giant\"\n      nbSpinnerStatus=\"primary\"\n      class=\"mb-0\"\n      >\n      <nb-card-body>\n        <p>\n          {{ 'REPORT_PAGE.TOTAL_HOURS' | translate }}\n        </p>\n        <div class=\"h1\">\n          {{ counts?.weekDuration || 0 | durationFormat }}\n        </div>\n        <div class=\"progress-container\">\n          <gauzy-counter-point\n            [total]=\"period\"\n            [value]=\"counts?.weekDuration || 0\"\n            [color]=\"'#00D68F'\"\n          ></gauzy-counter-point>\n        </div>\n      </nb-card-body>\n    </nb-card>\n  </div>\n</div>\n", styles: [":host{display:block}.main-wrapper{width:100%;display:grid;grid-template-columns:repeat(auto-fit,calc(25% - .75rem));column-gap:1rem}nb-card{background-color:var(--gauzy-card-1);box-shadow:0 6px 20px #0000000d}.progress-container{width:71%}@media only screen and (max-width:1199px){.main-wrapper{grid-template-columns:repeat(auto-fit,calc(50% - 8px));grid-gap:1rem}}@media only screen and (max-width:767px){.main-wrapper{grid-template-columns:100%;row-gap:10px}}@media only screen and (max-width:480px){.progress-container{width:100%}.h1{font-size:var(--text-heading-1-font-size)}}p{font-size:16px;font-weight:400;line-height:16px;letter-spacing:-.009em;color:var(--gauzy-text-color-2)}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "component", type: i4.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i4.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "directive", type: i4.NbSpinnerDirective, selector: "[nbSpinner]", inputs: ["nbSpinnerMessage", "nbSpinnerStatus", "nbSpinnerSize", "nbSpinner"] }, { kind: "directive", type: i5.NgxPermissionsDirective, selector: "[ngxPermissionsOnly],[ngxPermissionsExcept]", inputs: ["ngxPermissionsOnly", "ngxPermissionsOnlyThen", "ngxPermissionsOnlyElse", "ngxPermissionsExcept", "ngxPermissionsExceptElse", "ngxPermissionsExceptThen", "ngxPermissionsThen", "ngxPermissionsElse", "ngxPermissionsOnlyAuthorisedStrategy", "ngxPermissionsOnlyUnauthorisedStrategy", "ngxPermissionsExceptUnauthorisedStrategy", "ngxPermissionsExceptAuthorisedStrategy", "ngxPermissionsUnauthorisedStrategy", "ngxPermissionsAuthorisedStrategy"], outputs: ["permissionsAuthorized", "permissionsUnauthorized"] }, { kind: "component", type: i6.CounterPointComponent, selector: "gauzy-counter-point", inputs: ["total", "value", "color", "progress"] }, { kind: "pipe", type: i2.TranslatePipe, name: "translate" }, { kind: "pipe", type: i7.DurationFormatPipe, name: "durationFormat" }] }); }
};
DailyStatisticsComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [TimesheetStatisticsService,
        Store,
        DateRangePickerBuilderService,
        TranslateService,
        ChangeDetectorRef,
        EmployeesService,
        OrganizationProjectsService,
        TimeZoneService])
], DailyStatisticsComponent);
export { DailyStatisticsComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DailyStatisticsComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-daily-statistics', standalone: false, template: "<div class=\"main-wrapper\">\n  @if (!request.employeeIds) {\n    <div\n      class=\"daily-item\"\n      *ngxPermissionsOnly=\"PermissionsEnum.CHANGE_SELECTED_EMPLOYEE\">\n      <nb-card\n        [nbSpinner]=\"loading\"\n        nbSpinnerSize=\"giant\"\n        nbSpinnerStatus=\"primary\"\n        class=\"mb-0\">\n        <nb-card-body>\n          <p>\n            {{ 'REPORT_PAGE.MEMBERS_WORKED' | translate }}\n          </p>\n          <div class=\"h1\">\n            {{ counts?.employeesCount || 0 }}\n          </div>\n          <div class=\"progress-container\">\n            <gauzy-counter-point\n              [total]=\"employeesCount\"\n              [value]=\"counts?.employeesCount || 0\"\n              [color]=\"'#0088FE'\"\n            ></gauzy-counter-point>\n          </div>\n        </nb-card-body>\n      </nb-card>\n    </div>\n  }\n  @if (!request.projectIds) {\n    <div class=\"daily-item\">\n      <nb-card\n        [nbSpinner]=\"loading\"\n        nbSpinnerSize=\"giant\"\n        nbSpinnerStatus=\"primary\"\n        class=\"mb-0\"\n        >\n        <nb-card-body>\n          <p>\n            {{ 'REPORT_PAGE.PROJECTS_WORKED' | translate }}\n          </p>\n          <div class=\"h1\">\n            {{ counts?.projectsCount || 0 }}\n          </div>\n          <div class=\"progress-container\">\n            <gauzy-counter-point\n              [total]=\"projectsCount\"\n              [value]=\"counts?.projectsCount || 0\"\n              [color]=\"'#00D68F'\"\n            ></gauzy-counter-point>\n          </div>\n        </nb-card-body>\n      </nb-card>\n    </div>\n  }\n  <div class=\"daily-item\">\n    <nb-card\n      [nbSpinner]=\"loading\"\n      nbSpinnerSize=\"giant\"\n      nbSpinnerStatus=\"primary\"\n      class=\"mb-0\"\n      >\n      <nb-card-body>\n        <p>\n          {{ 'REPORT_PAGE.ACTIVITY' | translate }}\n        </p>\n        <div class=\"h1\">{{ counts?.weekActivities || 0 }}%</div>\n        <div class=\"progress-container\">\n          <gauzy-counter-point\n            [progress]=\"true\"\n            [value]=\"counts?.weekActivities || 0\"\n          ></gauzy-counter-point>\n        </div>\n      </nb-card-body>\n    </nb-card>\n  </div>\n  <div class=\"daily-item\">\n    <nb-card\n      [nbSpinner]=\"loading\"\n      nbSpinnerSize=\"giant\"\n      nbSpinnerStatus=\"primary\"\n      class=\"mb-0\"\n      >\n      <nb-card-body>\n        <p>\n          {{ 'REPORT_PAGE.TOTAL_HOURS' | translate }}\n        </p>\n        <div class=\"h1\">\n          {{ counts?.weekDuration || 0 | durationFormat }}\n        </div>\n        <div class=\"progress-container\">\n          <gauzy-counter-point\n            [total]=\"period\"\n            [value]=\"counts?.weekDuration || 0\"\n            [color]=\"'#00D68F'\"\n          ></gauzy-counter-point>\n        </div>\n      </nb-card-body>\n    </nb-card>\n  </div>\n</div>\n", styles: [":host{display:block}.main-wrapper{width:100%;display:grid;grid-template-columns:repeat(auto-fit,calc(25% - .75rem));column-gap:1rem}nb-card{background-color:var(--gauzy-card-1);box-shadow:0 6px 20px #0000000d}.progress-container{width:71%}@media only screen and (max-width:1199px){.main-wrapper{grid-template-columns:repeat(auto-fit,calc(50% - 8px));grid-gap:1rem}}@media only screen and (max-width:767px){.main-wrapper{grid-template-columns:100%;row-gap:10px}}@media only screen and (max-width:480px){.progress-container{width:100%}.h1{font-size:var(--text-heading-1-font-size)}}p{font-size:16px;font-weight:400;line-height:16px;letter-spacing:-.009em;color:var(--gauzy-text-color-2)}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [{ type: i1.TimesheetStatisticsService }, { type: i1.Store }, { type: i1.DateRangePickerBuilderService }, { type: i2.TranslateService }, { type: i0.ChangeDetectorRef }, { type: i1.EmployeesService }, { type: i1.OrganizationProjectsService }, { type: i3.TimeZoneService }], propDecorators: { filters: [{
                type: Input
            }] } });
//# sourceMappingURL=daily-statistics.component.js.map