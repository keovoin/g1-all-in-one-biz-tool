import { AfterViewInit, ChangeDetectorRef, OnInit } from '@angular/core';
import { IAmountOwedReport, ITimeLogFilters, ReportGroupByFilter } from '@gauzy/contracts';
import { TranslateService } from '@ngx-translate/core';
import { DateRangePickerBuilderService, Store, TimesheetService } from '@gauzy/ui-core/core';
import { BaseSelectorFilterComponent, TimeZoneService } from '../../timesheet/gauzy-filters';
import * as i0 from "@angular/core";
export declare class AmountsOwedGridComponent extends BaseSelectorFilterComponent implements OnInit, AfterViewInit {
    private readonly cd;
    private readonly timesheetService;
    readonly translateService: TranslateService;
    protected readonly store: Store;
    protected readonly dateRangePickerBuilderService: DateRangePickerBuilderService;
    protected readonly timeZoneService: TimeZoneService;
    loading: boolean;
    groupBy: ReportGroupByFilter;
    dailyData: IAmountOwedReport[];
    /**
     *
     */
    private _filters;
    get filters(): ITimeLogFilters;
    set filters(value: ITimeLogFilters);
    private payloads$;
    constructor(cd: ChangeDetectorRef, timesheetService: TimesheetService, translateService: TranslateService, store: Store, dateRangePickerBuilderService: DateRangePickerBuilderService, timeZoneService: TimeZoneService);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    /**
     * Get header selectors request and Gauzy timesheet filters request.
     */
    prepareRequest(): void;
    /**
     * Updates Gauzy timesheet default filters and notifies subscribers about the change.
     *
     * @param filters - An object representing time log filters (ITimeLogFilters).
     */
    filtersChange(filters: ITimeLogFilters): void;
    /**
     * Asynchronously retrieves amounts owed reports, updates the 'dailyData' property, and handles the loading state.
     *
     * @returns {Promise<void>}
     */
    getAmountsOwed(): Promise<void>;
    static ɵfac: i0.ɵɵFactoryDeclaration<AmountsOwedGridComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<AmountsOwedGridComponent, "ga-amounts-owed-grid", never, { "filters": { "alias": "filters"; "required": false; }; }, {}, never, never, false, never>;
}
