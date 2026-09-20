import { AfterViewInit, ChangeDetectorRef, OnInit } from '@angular/core';
import { ICountsStatistics, ITimeLogFilters, PermissionsEnum } from '@gauzy/contracts';
import { BehaviorSubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { DateRangePickerBuilderService, EmployeesService, OrganizationProjectsService, Store, TimesheetStatisticsService } from '@gauzy/ui-core/core';
import { BaseSelectorFilterComponent, TimeZoneService } from '../../../timesheet/gauzy-filters';
import * as i0 from "@angular/core";
export declare class DailyStatisticsComponent extends BaseSelectorFilterComponent implements OnInit, AfterViewInit {
    private readonly timesheetStatisticsService;
    protected readonly store: Store;
    protected readonly dateRangePickerBuilderService: DateRangePickerBuilderService;
    readonly translateService: TranslateService;
    private readonly cd;
    private readonly employeesService;
    private readonly projectService;
    protected readonly timeZoneService: TimeZoneService;
    payloads$: BehaviorSubject<ITimeLogFilters>;
    PermissionsEnum: typeof PermissionsEnum;
    counts: ICountsStatistics;
    loading: boolean;
    employeesCount: number;
    projectsCount: number;
    private _filters;
    get filters(): ITimeLogFilters;
    set filters(filters: ITimeLogFilters);
    constructor(timesheetStatisticsService: TimesheetStatisticsService, store: Store, dateRangePickerBuilderService: DateRangePickerBuilderService, translateService: TranslateService, cd: ChangeDetectorRef, employeesService: EmployeesService, projectService: OrganizationProjectsService, timeZoneService: TimeZoneService);
    ngOnInit(): void;
    prepareRequest(): void;
    ngAfterViewInit(): void;
    /**
     * Retrieves counts from the timesheet statistics service based on current filters and organization.
     * Loads employee and project counts if organization and filters are defined.
     */
    getCounts(): Promise<void>;
    /**
     * Loads the count of employees for the organization.
     */
    private loadEmployeesCount;
    /**
     * Loads the count of projects for the organization.
     */
    private loadProjectsCount;
    get period(): number;
    static ɵfac: i0.ɵɵFactoryDeclaration<DailyStatisticsComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DailyStatisticsComponent, "ga-daily-statistics", never, { "filters": { "alias": "filters"; "required": false; }; }, {}, never, never, false, never>;
}
