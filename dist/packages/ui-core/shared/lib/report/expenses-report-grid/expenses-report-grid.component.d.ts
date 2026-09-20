import { AfterViewInit, ChangeDetectorRef, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { IExpenseReportData, ITimeLogFilters, ReportGroupByFilter } from '@gauzy/contracts';
import { DateRangePickerBuilderService, ExpensesService, Store } from '@gauzy/ui-core/core';
import { BaseSelectorFilterComponent, TimeZoneService } from '../../timesheet/gauzy-filters';
import * as i0 from "@angular/core";
export declare class ExpensesReportGridComponent extends BaseSelectorFilterComponent implements OnInit, AfterViewInit {
    readonly translateService: TranslateService;
    private readonly cd;
    private readonly expensesService;
    protected readonly store: Store;
    protected readonly dateRangePickerBuilderService: DateRangePickerBuilderService;
    protected readonly timeZoneService: TimeZoneService;
    dailyData: IExpenseReportData[];
    loading: boolean;
    groupBy: ReportGroupByFilter;
    private _filters;
    get filters(): ITimeLogFilters;
    set filters(value: ITimeLogFilters);
    payloads$: BehaviorSubject<ITimeLogFilters>;
    constructor(translateService: TranslateService, cd: ChangeDetectorRef, expensesService: ExpensesService, store: Store, dateRangePickerBuilderService: DateRangePickerBuilderService, timeZoneService: TimeZoneService);
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
     * Change by group filter
     */
    groupByChange(): void;
    /**
     * Asynchronously fetches the daily expense report.
     *
     * @returns {Promise<void>}
     */
    getExpensesReport(): Promise<void>;
    static ɵfac: i0.ɵɵFactoryDeclaration<ExpensesReportGridComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ExpensesReportGridComponent, "ga-expenses-report-grid", never, { "filters": { "alias": "filters"; "required": false; }; }, {}, never, never, false, never>;
}
