import { AfterViewInit, ChangeDetectorRef, OnInit } from '@angular/core';
import { IReportDayData, ITimeLogFilters, ReportGroupByFilter } from '@gauzy/contracts';
import { BehaviorSubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ActivityService, DateRangePickerBuilderService, Store } from '@gauzy/ui-core/core';
import { BaseSelectorFilterComponent, TimeZoneService } from '../../timesheet/gauzy-filters';
import * as i0 from "@angular/core";
export declare class ActivitiesReportGridComponent extends BaseSelectorFilterComponent implements OnInit, AfterViewInit {
    private readonly activityService;
    readonly store: Store;
    protected readonly dateRangePickerBuilderService: DateRangePickerBuilderService;
    private readonly cdr;
    readonly translateService: TranslateService;
    readonly timeZoneService: TimeZoneService;
    dailyData: IReportDayData[];
    loading: boolean;
    groupBy: ReportGroupByFilter;
    private _filters;
    get filters(): ITimeLogFilters;
    set filters(value: ITimeLogFilters);
    payloads$: BehaviorSubject<ITimeLogFilters>;
    constructor(activityService: ActivityService, store: Store, dateRangePickerBuilderService: DateRangePickerBuilderService, cdr: ChangeDetectorRef, translateService: TranslateService, timeZoneService: TimeZoneService);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    getDateRowProjects(dateRow: any): any[];
    getDateRowEmployees(dateRow: any): any[];
    /**
     * Get header selectors request
     * Get gauzy timesheet filters request
     *
     * @returns
     */
    prepareRequest(): void;
    /**
     * Change by group filter
     */
    groupByChange(): void;
    /**
     * Get activities report
     *
     * @returns {Promise<void>}
     */
    getActivitiesReport(): Promise<void>;
    static ɵfac: i0.ɵɵFactoryDeclaration<ActivitiesReportGridComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ActivitiesReportGridComponent, "ga-activities-report-grid", never, { "filters": { "alias": "filters"; "required": false; }; }, {}, never, never, false, never>;
}
