import { OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DaterangepickerComponent as NgxDateRangePickerComponent, DaterangepickerDirective as DateRangePickerDirective, LocaleConfig } from 'ngx-daterangepicker-material';
import moment from 'moment';
import { NbLayoutDirectionService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { IDateRangePicker, IOrganization, WeekDaysEnum } from '@gauzy/contracts';
import { DateRangePickerBuilderService, NavigationService, OrganizationsService, SelectorBuilderService, Store, TimesheetFilterService } from '@gauzy/ui-core/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { DateRangeClicked, DateRanges, TimePeriod } from './date-picker.interface';
import { TimeZoneService } from '../../timesheet/gauzy-filters/timezone-filter';
import * as i0 from "@angular/core";
export declare class DateRangePickerComponent extends TranslationBaseComponent implements AfterViewInit, OnInit, OnDestroy {
    readonly translateService: TranslateService;
    private readonly _route;
    private readonly _store;
    private readonly _organizationService;
    private readonly _dateRangePickerBuilderService;
    private readonly _timesheetFilterService;
    private readonly _navigationService;
    private readonly _selectorBuilderService;
    private readonly _timeZoneService;
    private readonly _directionService;
    picker: NgxDateRangePickerComponent;
    organization: IOrganization;
    maxDate: string;
    minDate: string;
    futureDateAllowed: boolean;
    ranges: DateRanges;
    private readonly dates$;
    private readonly range$;
    private arrow;
    private next;
    private previous;
    /**
     * Which way the dropdown hangs off the input. The panel (~600px double
     * calendar) is wider than the space between the input and the trailing
     * viewport edge, so it must open TOWARD the canvas: the library aligns the
     * panel's trailing edge to the input for 'left', mirrored under RTL. (The
     * old -130%/-146% margin hack did the same job against a containing-block
     * layout that no longer exists.)
     */
    get opens(): 'left' | 'right';
    /**
     * Locale configuration for the component.
     * Defaults are:
     * - displayFormat: 'DD.MM.YYYY'
     * - format: 'DD.MM.YYYY'
     * - direction: 'ltr'
     */
    locale: LocaleConfig;
    /** ViewChild for the DateRangePickerDirective */
    dateRangePickerDirective: DateRangePickerDirective;
    /**
     * Determines whether to show or hide the arrows button.
     * Defaults to showing the arrows.
     */
    arrows: boolean;
    /**
     * Indicates whether the date picker is locked.
     */
    isLockDatePicker: boolean;
    /**
     * Indicates whether the date picker is in single date selection mode.
     */
    isSingleDatePicker: boolean;
    /**
     * Indicates whether future dates are disabled in the date picker.
     */
    isDisableFutureDatePicker: boolean;
    /**
     * Indicates whether past dates are disabled in the date picker.
     */
    isDisablePastDatePicker: boolean;
    /**
     * The first day of the week.
     */
    private _firstDayOfWeek;
    set firstDayOfWeek(value: WeekDaysEnum);
    get firstDayOfWeek(): number;
    /**
     * The time zone to be used.
     * Defaults to the user's local time zone.
     */
    private _timeZone;
    set timeZone(value: string | null | undefined);
    get timeZone(): string;
    /**
     * Dynamic unit of time for date operations.
     * Defaults to the configuration's unit of time if not provided.
     */
    private _unitOfTime;
    set unitOfTime(value: moment.unitOfTime.Base | null | undefined);
    get unitOfTime(): moment.unitOfTime.Base;
    /**
     * Getter and Setter for dynamic selected date range.
     */
    private _selectedDateRange;
    set selectedDateRange(range: IDateRangePicker);
    get selectedDateRange(): IDateRangePicker;
    /**
     * Getter and Setter for the dynamic selected internal date range.
     */
    private _rangePicker;
    get rangePicker(): IDateRangePicker;
    set rangePicker(range: IDateRangePicker);
    constructor(translateService: TranslateService, _route: ActivatedRoute, _store: Store, _organizationService: OrganizationsService, _dateRangePickerBuilderService: DateRangePickerBuilderService, _timesheetFilterService: TimesheetFilterService, _navigationService: NavigationService, _selectorBuilderService: SelectorBuilderService, _timeZoneService: TimeZoneService, _directionService: NbLayoutDirectionService);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    /**
     * Creates the date range translated menus based on the current configuration.
     */
    createDateRangeMenus(): void;
    /**
     * Updates the maximum selectable date based on the future date strategy.
     * If future dates are allowed, `maxDate` is set to `null` (no maximum limit).
     * If future dates are disallowed, `maxDate` is set to today.
     * Additionally, if the selected end date is in the future, it is adjusted to today.
     */
    private setFutureStrategy;
    /**
     * Updates the minimum selectable date based on the past date strategy.
     * If past dates are disallowed, `minDate` is set to today.
     * If past dates are allowed, `minDate` is set to `null` (no minimum limit).
     */
    private setPastStrategy;
    /**
     * Advances the selected date range to the next period if not disabled.
     * Updates the selected date range and synchronizes the range picker.
     * Also updates the query parameters without navigating away.
     */
    nextRange(): Promise<void>;
    /**
     * Moves the selected date range to the previous period.
     * Updates the selected date range and synchronizes the range picker.
     * Also updates the query parameters without navigating away.
     */
    previousRange(): void;
    /**
     * Determines whether the "Next" button should be disabled.
     * The "Next" button is disabled if:
     * - There is no selected date range.
     * - The selected date range lacks a start or end date.
     * - There is no future strategy available and the end date is today or in the past.
     *
     * @returns {boolean} True if the Next Button should be disabled, false otherwise.
     */
    isNextDisabled(): boolean;
    /**
     * Listens to the date update event from ngx-daterangepicker-material.
     * Updates the selected date range and synchronizes the range picker.
     * Also updates the query parameters without navigating away.
     *
     * @param event - The updated time period.
     */
    onDatesUpdated(event: TimePeriod): void;
    /**
     * Handles the range click event from ngx-daterangepicker-material.
     * Updates the `unitOfTime` based on the selected range label.
     *
     * @param {DateRangeClicked} range - The clicked range object.
     */
    rangeClicked(range: DateRangeClicked): void;
    /**
     * Determines if the provided date range is a custom date range,
     * meaning it does not match any predefined ranges.
     *
     * @param dateRange - The date range to check.
     * @returns True if the date range is custom, false otherwise.
     */
    isCustomDate(dateRange: {
        startDate: moment.Moment;
        endDate: moment.Moment;
    }): boolean;
    /**
     * Saves the selected date range to the timesheet filter service and updates the query parameters.
     *
     * @param range - The selected date range.
     */
    onSavingFilter(range: IDateRangePicker): void;
    /**
     * Checks if the provided date is the same as or after today.
     *
     * @param date - The date to compare.
     * @returns True if the date is today or in the future, false otherwise.
     */
    isSameOrAfterDay(date: string | Date): boolean;
    /**
     * Determines whether future dates are allowed based on the current strategy.
     *
     * @returns True if future dates are allowed, false otherwise.
     */
    private hasFutureStrategy;
    /**
     * Determines whether past dates are disallowed based on the current strategy.
     *
     * @returns True if past dates are disallowed, false otherwise.
     */
    private hasPastStrategy;
    /**
     * Opens the date picker when the calendar icon is clicked.
     *
     * @param event - The mouse event triggered by clicking the calendar icon.
     */
    openDatepicker(event: MouseEvent): void;
    /**
     * Retrieves the default date range picker configuration from the dates BehaviorSubject.
     *
     * @returns The default date range picker configuration.
     */
    private getSelectorDates;
    /**
     * Navigates to the current route with specified query parameters, while preserving existing ones.
     *
     * @param queryParams The query parameters to be attached.
     */
    navigateWithQueryParams(): Promise<void>;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DateRangePickerComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DateRangePickerComponent, "ngx-date-range-picker", never, { "arrows": { "alias": "arrows"; "required": false; }; "isLockDatePicker": { "alias": "isLockDatePicker"; "required": false; }; "isSingleDatePicker": { "alias": "isSingleDatePicker"; "required": false; }; "isDisableFutureDatePicker": { "alias": "isDisableFutureDatePicker"; "required": false; }; "isDisablePastDatePicker": { "alias": "isDisablePastDatePicker"; "required": false; }; "firstDayOfWeek": { "alias": "firstDayOfWeek"; "required": false; }; "timeZone": { "alias": "timeZone"; "required": false; }; "unitOfTime": { "alias": "unitOfTime"; "required": false; }; "selectedDateRange": { "alias": "selectedDateRange"; "required": false; }; }, {}, never, never, false, never>;
}
