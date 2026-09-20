import { AfterViewInit, ChangeDetectorRef, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { IReportDayData, ITimeLogFilters, ReportGroupByFilter, ReportGroupFilterEnum } from '@gauzy/contracts';
import { Environment } from '@gauzy/ui-config';
import { DateRangePickerBuilderService, Store, TimesheetService } from '@gauzy/ui-core/core';
import { BaseSelectorFilterComponent, TimeZoneService } from '../../timesheet/gauzy-filters';
import * as i0 from "@angular/core";
export declare class DailyGridComponent extends BaseSelectorFilterComponent implements OnInit, AfterViewInit, OnDestroy {
    readonly translateService: TranslateService;
    private readonly cd;
    private readonly timesheetService;
    protected readonly store: Store;
    protected readonly dateRangePickerBuilderService: DateRangePickerBuilderService;
    protected readonly timeZoneService: TimeZoneService;
    readonly PLATFORM_WEBSITE_DOWNLOAD_URL: Environment['PLATFORM_WEBSITE_DOWNLOAD_URL'];
    payloads$: BehaviorSubject<ITimeLogFilters>;
    dailyLogs: IReportDayData[];
    loading: boolean;
    ReportGroupFilterEnum: typeof ReportGroupFilterEnum;
    showGroupBy: boolean;
    private _groupBy;
    get groupBy(): ReportGroupByFilter;
    set groupBy(groupBy: ReportGroupByFilter);
    private _filters;
    get filters(): ITimeLogFilters;
    set filters(filters: ITimeLogFilters);
    constructor(translateService: TranslateService, cd: ChangeDetectorRef, timesheetService: TimesheetService, store: Store, dateRangePickerBuilderService: DateRangePickerBuilderService, timeZoneService: TimeZoneService);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    /**
     * Get header selectors request
     * Get gauzy timesheet filters request
     *
     * @returns
     */
    prepareRequest(): void;
    /**
     * Retrieves daily logs if the organization and request are set.
     *
     * @returns {Promise<void>}
     */
    getLogs(): Promise<void>;
    getStatus(value: number): "success" | "warning" | "danger" | "info";
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DailyGridComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DailyGridComponent, "ga-daily-grid", never, { "showGroupBy": { "alias": "showGroupBy"; "required": false; }; "groupBy": { "alias": "groupBy"; "required": false; }; "filters": { "alias": "filters"; "required": false; }; }, {}, never, never, false, never>;
}
