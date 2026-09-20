import { __decorate, __metadata } from "tslib";
import { Component } from '@angular/core';
import { Subject, combineLatest, debounceTime } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslateService } from '@ngx-translate/core';
import { pick } from 'underscore';
import { toUtcOffset } from '@gauzy/ui-core/common';
import { DateRangePickerBuilderService, Store } from '@gauzy/ui-core/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { TimeZoneService } from '../timezone-filter';
import { getAdjustDateRangeFutureAllowed } from '../../../selectors/date-range-picker/date-picker.utils';
import * as i0 from "@angular/core";
import * as i1 from "@gauzy/ui-core/core";
import * as i2 from "@ngx-translate/core";
import * as i3 from "../timezone-filter";
let BaseSelectorFilterComponent = class BaseSelectorFilterComponent extends TranslationBaseComponent {
    constructor(store, translateService, dateRangePickerBuilderService, timeZoneService) {
        super(translateService);
        this.store = store;
        this.translateService = translateService;
        this.dateRangePickerBuilderService = dateRangePickerBuilderService;
        this.timeZoneService = timeZoneService;
        this.request = {
            employeeIds: [],
            projectIds: [],
            teamIds: []
        };
        this.subject$ = new Subject();
        this.onInit();
    }
    /**
     * Subscribes to multiple observables representing selected values, combines them, and reacts to changes.
     * Adjusts the 'organization', 'request.employeeIds', 'request.projectIds', 'request.teamIds',
     * and 'request' properties based on the emitted values.
     * Emits a value to the 'subject$' subject and ensures the subscription is unsubscribed onDestroy.
     */
    onInit() {
        const storeOrganization$ = this.store.selectedOrganization$;
        const storeDateRange$ = this.dateRangePickerBuilderService.selectedDateRange$;
        const storeProject$ = this.store.selectedProject$;
        const storeEmployee$ = this.store.selectedEmployee$;
        const storeTeam$ = this.store.selectedTeam$;
        combineLatest([storeOrganization$, storeDateRange$, storeEmployee$, storeProject$, storeTeam$])
            .pipe(debounceTime(300), filter(([organization, dateRange]) => !!organization && !!dateRange), tap(([organization, dateRange, employee, project, team]) => {
            if (organization) {
                this.organization = organization;
                this.request.employeeIds = employee?.id ? [employee.id] : [];
                this.request.projectIds = project?.id ? [project.id] : [];
                this.request.teamIds = team?.id ? [team.id] : [];
                if (dateRange) {
                    this.request = { ...this.request, ...dateRange };
                }
            }
        }), tap(() => this.subject$.next(true)), untilDestroyed(this))
            .subscribe();
    }
    /**
     * Transforms a given ITimeLogFilters object by adjusting date range, extracting organizationId and tenantId,
     * and formatting dates to UTC.
     * @param request - The original ITimeLogFilters object to be transformed.
     * @returns The modified ITimeLogFilters object.
     */
    getFilterRequest(request) {
        // Retrieve adjusted start and end dates using getAdjustDateRangeFutureAllowed
        const { startDate, endDate } = getAdjustDateRangeFutureAllowed(request);
        // Extract organizationId and tenantId from the organization object
        const { id: organizationId, tenantId } = this.organization;
        const timeZone = this.timeZoneService.currentTimeZone;
        // Create a selectorFilters object containing projectIds, employeeIds, and teamIds
        const selectorFilters = pick(this.request, 'projectIds', 'employeeIds', 'teamIds');
        // Build the final ITimeLogFilters object
        const filterRequest = {
            ...selectorFilters,
            organizationId,
            tenantId,
            startDate: toUtcOffset(startDate, timeZone).format('YYYY-MM-DD HH:mm:ss'),
            endDate: toUtcOffset(endDate, timeZone).format('YYYY-MM-DD HH:mm:ss'),
            // Set the 'timezone' property to the determined timezone
            timeZone
        };
        // Return the modified ITimeLogFilters object
        return filterRequest;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: BaseSelectorFilterComponent, deps: [{ token: i1.Store }, { token: i2.TranslateService }, { token: i1.DateRangePickerBuilderService }, { token: i3.TimeZoneService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: BaseSelectorFilterComponent, isStandalone: false, selector: "ng-component", usesInheritance: true, ngImport: i0, template: '', isInline: true }); }
};
BaseSelectorFilterComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [Store,
        TranslateService,
        DateRangePickerBuilderService,
        TimeZoneService])
], BaseSelectorFilterComponent);
export { BaseSelectorFilterComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: BaseSelectorFilterComponent, decorators: [{
            type: Component,
            args: [{
                    template: '',
                    standalone: false
                }]
        }], ctorParameters: () => [{ type: i1.Store }, { type: i2.TranslateService }, { type: i1.DateRangePickerBuilderService }, { type: i3.TimeZoneService }] });
//# sourceMappingURL=base-selector-filter.component.js.map