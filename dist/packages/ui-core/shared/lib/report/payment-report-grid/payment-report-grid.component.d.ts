import { AfterViewInit, ChangeDetectorRef, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { IPaymentReportData, ITimeLogFilters, ReportGroupByFilter } from '@gauzy/contracts';
import { DateRangePickerBuilderService, PaymentService, Store } from '@gauzy/ui-core/core';
import { BaseSelectorFilterComponent, TimeZoneService } from '../../timesheet/gauzy-filters';
import * as i0 from "@angular/core";
export declare class PaymentReportGridComponent extends BaseSelectorFilterComponent implements OnInit, AfterViewInit {
    readonly translateService: TranslateService;
    private readonly paymentService;
    private readonly cd;
    protected readonly store: Store;
    protected readonly dateRangePickerBuilderService: DateRangePickerBuilderService;
    protected readonly timeZoneService: TimeZoneService;
    dailyData: IPaymentReportData[];
    loading: boolean;
    groupBy: ReportGroupByFilter;
    private _filters;
    get filters(): ITimeLogFilters;
    set filters(value: ITimeLogFilters);
    payloads$: BehaviorSubject<ITimeLogFilters>;
    constructor(translateService: TranslateService, paymentService: PaymentService, cd: ChangeDetectorRef, store: Store, dateRangePickerBuilderService: DateRangePickerBuilderService, timeZoneService: TimeZoneService);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    /**
     * Prepares the request by applying filters and updating the payloads observable.
     */
    prepareRequest(): void;
    /**
     * Gauzy timesheet default filters
     *
     * @param filters
     */
    filtersChange(filters: ITimeLogFilters): void;
    /**
     * Change by group filter
     */
    groupByChange(): void;
    /**
     * Asynchronously retrieves the payment report based on the provided request parameters.
     *
     * @returns {Promise<void>} A Promise that resolves to the payment report data.
     */
    getPaymentReport(): Promise<void>;
    static ɵfac: i0.ɵɵFactoryDeclaration<PaymentReportGridComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<PaymentReportGridComponent, "ga-payment-report-grid", never, { "filters": { "alias": "filters"; "required": false; }; }, {}, never, never, false, never>;
}
