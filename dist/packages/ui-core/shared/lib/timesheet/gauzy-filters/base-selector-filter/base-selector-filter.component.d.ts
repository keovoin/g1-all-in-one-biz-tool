import { Subject } from 'rxjs';
import { IOrganization, ITimeLogFilters } from '@gauzy/contracts';
import { TranslateService } from '@ngx-translate/core';
import { DateRangePickerBuilderService, Store } from '@gauzy/ui-core/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { TimeZoneService } from '../timezone-filter';
import * as i0 from "@angular/core";
export declare class BaseSelectorFilterComponent extends TranslationBaseComponent {
    protected readonly store: Store;
    protected readonly translateService: TranslateService;
    protected readonly dateRangePickerBuilderService: DateRangePickerBuilderService;
    protected readonly timeZoneService: TimeZoneService;
    request: ITimeLogFilters;
    organization: IOrganization;
    subject$: Subject<boolean>;
    constructor(store: Store, translateService: TranslateService, dateRangePickerBuilderService: DateRangePickerBuilderService, timeZoneService: TimeZoneService);
    /**
     * Subscribes to multiple observables representing selected values, combines them, and reacts to changes.
     * Adjusts the 'organization', 'request.employeeIds', 'request.projectIds', 'request.teamIds',
     * and 'request' properties based on the emitted values.
     * Emits a value to the 'subject$' subject and ensures the subscription is unsubscribed onDestroy.
     */
    onInit(): void;
    /**
     * Transforms a given ITimeLogFilters object by adjusting date range, extracting organizationId and tenantId,
     * and formatting dates to UTC.
     * @param request - The original ITimeLogFilters object to be transformed.
     * @returns The modified ITimeLogFilters object.
     */
    getFilterRequest(request: ITimeLogFilters): ITimeLogFilters;
    static ɵfac: i0.ɵɵFactoryDeclaration<BaseSelectorFilterComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<BaseSelectorFilterComponent, "ng-component", never, {}, {}, never, never, false, never>;
}
