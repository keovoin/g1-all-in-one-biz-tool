import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, ElementRef, OnDestroy, OnInit, QueryList, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { NgxPermissionsService } from 'ngx-permissions';
import { TranslateService } from '@ngx-translate/core';
import { IOrganization, PermissionsEnum, ICountsStatistics, IMembersStatistics, IActivitiesStatistics, ITimeSlotStatistics, IProjectsStatistics, ITasksStatistics, IManualTimesStatistics, IEmployee, IDateRangePicker, ITimeLogFilters, IUser, TimeFormatEnum } from '@gauzy/contracts';
import { GuiDrag, progressStatus } from '@gauzy/ui-core/common';
import { DateRangePickerBuilderService, EmployeesService, OrganizationProjectsService, Store, TimesheetStatisticsService, ToastrService } from '@gauzy/ui-core/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { GalleryService, TimeZoneService, WidgetService, WindowService } from '@gauzy/ui-core/shared';
import * as i0 from "@angular/core";
export declare enum RangePeriod {
    DAY = "DAY",
    WEEK = "WEEK",
    PERIOD = "PERIOD"
}
export declare class TimeTrackingComponent extends TranslationBaseComponent implements AfterViewInit, OnInit, OnDestroy, AfterViewChecked {
    readonly translateService: TranslateService;
    private readonly _timesheetStatisticsService;
    private readonly _store;
    private readonly _dateRangePickerBuilderService;
    private readonly _galleryService;
    private readonly _ngxPermissionsService;
    private readonly _changeRef;
    private readonly _router;
    private readonly _employeesService;
    private readonly _projectService;
    private readonly _toastrService;
    private readonly _widgetService;
    private readonly _windowService;
    private readonly _timeZoneService;
    user: IUser;
    employee: IEmployee;
    timeSlotEmployees: ITimeSlotStatistics[];
    activities: IActivitiesStatistics[];
    projects: IProjectsStatistics[];
    tasks: ITasksStatistics[];
    members: IMembersStatistics[];
    manualTimes: IManualTimesStatistics[];
    counts: ICountsStatistics;
    employeesCount: number;
    projectCount: number;
    organization: IOrganization;
    logs$: Subject<any>;
    timeSlotLoading: boolean;
    activitiesLoading: boolean;
    projectsLoading: boolean;
    tasksLoading: boolean;
    memberLoading: boolean;
    countsLoading: boolean;
    manualTimeLoading: boolean;
    progressStatus: typeof progressStatus;
    readonly PermissionsEnum: typeof PermissionsEnum;
    readonly RangePeriod: typeof RangePeriod;
    /**
     * Slides per view for the recent-activities carousel, by viewport width.
     *
     * The base `slides-per-view="3"` on the element is a desktop figure: at phone
     * width it cut each screenshot down to roughly 90px, which is not a legible
     * thumbnail. Swiper measures against the window, and the windows column is
     * already single-column below 1200px, so these thresholds track how much room
     * the card actually has.
     */
    employeeIds: string[];
    projectIds: string[];
    teamIds: string[];
    private autoRefresh$;
    autoRefresh: boolean;
    private _selectedDateRange;
    get selectedDateRange(): IDateRangePicker;
    set selectedDateRange(range: IDateRangePicker);
    filters: ITimeLogFilters;
    payloads$: BehaviorSubject<ITimeLogFilters>;
    listOfWidgets: QueryList<TemplateRef<any>>;
    listOfWindows: QueryList<TemplateRef<any>>;
    widgetsRef: TemplateRef<any>[];
    windowsRef: TemplateRef<any>[];
    widgets: GuiDrag[];
    windows: GuiDrag[];
    constructor(translateService: TranslateService, _timesheetStatisticsService: TimesheetStatisticsService, _store: Store, _dateRangePickerBuilderService: DateRangePickerBuilderService, _galleryService: GalleryService, _ngxPermissionsService: NgxPermissionsService, _changeRef: ChangeDetectorRef, _router: Router, _employeesService: EmployeesService, _projectService: OrganizationProjectsService, _toastrService: ToastrService, _widgetService: WidgetService, _windowService: WindowService, _timeZoneService: TimeZoneService);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    ngAfterViewChecked(): void;
    getStatistics(): Promise<void>;
    preparePayloads(): void;
    setAutoRefresh(value: boolean): void;
    getTimeSlots(): Promise<void>;
    getCounts(): Promise<void>;
    getActivities(): Promise<void>;
    getProjects(): Promise<void>;
    getTasks(): Promise<void>;
    getManualTimes(): Promise<void>;
    getMembers(): Promise<void>;
    onDelete(): void;
    ngOnDestroy(): void;
    get period(): number;
    get selectedPeriod(): RangePeriod;
    get headerTitle(): string;
    isCurrentWeek(): boolean;
    isMoreThanDays(): boolean;
    isMoreThanWeek(): boolean;
    redirectToScreenshots(employee: IEmployee): Promise<void>;
    redirectToTask(): void;
    redirectToManualTimeReport(): void;
    redirectToAppUrlReport(): void;
    private loadEmployeesCount;
    private loadProjectsCount;
    get hideProjectBlock(): number;
    get hideEmployeeBlock(): number;
    titleMapper(position: number, isWidget?: boolean): string;
    updateWindowVisibility(value: GuiDrag): Promise<void>;
    updateWidgetVisibility(value: GuiDrag): Promise<void>;
    undo(isWindow?: boolean): void;
    slideNext(swiperEl: ElementRef<HTMLElement> | HTMLElement): void;
    slidePrev(swiperEl: ElementRef<HTMLElement> | HTMLElement): void;
    recover(position: number): Promise<void>;
    private _isAllWidgetsHidden;
    private _isWindowHidden;
    timeFormatChanged(timeFormat: TimeFormatEnum): void;
    timeZoneChanged(timeZone: string): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<TimeTrackingComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<TimeTrackingComponent, "gz-time-tracking-dashboard", never, {}, {}, never, never, false, never>;
}
