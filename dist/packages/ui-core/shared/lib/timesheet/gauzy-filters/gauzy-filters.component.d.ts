import { AfterViewInit, ChangeDetectorRef, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Options, ChangeContext } from '@angular-slider/ngx-slider';
import { ITimeLogFilters, PermissionsEnum, TimeFormatEnum, TimeLogSourceEnum, TimeLogType } from '@gauzy/contracts';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { TimesheetFilterService } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
export declare class GauzyFiltersComponent extends TranslationBaseComponent implements AfterViewInit, OnInit, OnDestroy {
    private readonly timesheetFilterService;
    private readonly cd;
    readonly translateService: TranslateService;
    PermissionsEnum: typeof PermissionsEnum;
    TimeLogType: typeof TimeLogType;
    TimeLogSourceEnum: typeof TimeLogSourceEnum;
    saveFilters: boolean;
    hasLogTypeFilter: boolean;
    hasSourceFilter: boolean;
    hasActivityLevelFilter: boolean;
    hasTimeZoneFilter: boolean;
    hasFilterApplies: boolean;
    activityLevel: {
        start: number;
        end: number;
    };
    sliderOptions: Partial<Options>;
    readonly timeLogSourceSelectors: {
        label: string;
        value: TimeLogSourceEnum;
    }[];
    private filters$;
    private _filters;
    get filters(): ITimeLogFilters;
    set filters(filters: ITimeLogFilters);
    isTimeFormat: boolean;
    filtersChange: EventEmitter<ITimeLogFilters>;
    /**
     * define constructor
     */
    constructor(timesheetFilterService: TimesheetFilterService, cd: ChangeDetectorRef, translateService: TranslateService);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    /**
     * Sets the activity level filter based on the provided ChangeContext.
     *
     * @param activity - The change context containing the new activity level values.
     */
    setActivityLevel(activity: ChangeContext): void;
    /**
     * Triggers the filter change event.
     */
    triggerFilterChange(): void;
    /**
     * Clears all filters and triggers a filter change.
     */
    clearFilters(): void;
    /**
     * Checks if any filters are currently applied.
     *
     * @returns True if any filters are applied, otherwise false.
     */
    hasFilter(): boolean;
    /**
     *
     * @returns
     */
    arrangedFilters(): ITimeLogFilters;
    /**
     * Handles the event when the time format is changed.
     *
     * @param timeFormat The new time format.
     */
    timeFormatChanged(timeFormat: TimeFormatEnum): void;
    /**
     * Handles the event when the time zone is changed.
     *
     * @param timezone The new time zone.
     */
    timeZoneChanged(timeZone: string): void;
    /**
     * Generate Dynamic Timelog Source Selector
     */
    getTimeLogSourceSelectors(): Array<{
        label: string;
        value: TimeLogSourceEnum;
    }>;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<GauzyFiltersComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<GauzyFiltersComponent, "ngx-gauzy-filters", never, { "saveFilters": { "alias": "saveFilters"; "required": false; }; "hasLogTypeFilter": { "alias": "hasLogTypeFilter"; "required": false; }; "hasSourceFilter": { "alias": "hasSourceFilter"; "required": false; }; "hasActivityLevelFilter": { "alias": "hasActivityLevelFilter"; "required": false; }; "hasTimeZoneFilter": { "alias": "hasTimeZoneFilter"; "required": false; }; "filters": { "alias": "filters"; "required": false; }; "isTimeFormat": { "alias": "isTimeFormat"; "required": false; }; }, { "filtersChange": "filtersChange"; }, never, ["*"], false, never>;
}
