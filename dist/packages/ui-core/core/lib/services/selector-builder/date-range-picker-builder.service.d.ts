import moment from 'moment';
import { BehaviorSubject, Observable } from 'rxjs';
import { IDateRangePicker } from '@gauzy/contracts';
import { IDatePickerConfig } from './selector-builder-types';
import * as i0 from "@angular/core";
export declare const DEFAULT_DATE_PICKER_CONFIG: IDatePickerConfig;
export declare const DEFAULT_DATE_RANGE: IDateRangePicker;
export declare class DateRangePickerBuilderService {
    dates$: BehaviorSubject<IDateRangePicker>;
    private _datePickerConfig$;
    datePickerConfig$: Observable<IDatePickerConfig | null>;
    private _selectedDateRange$;
    selectedDateRange$: Observable<IDateRangePicker | null>;
    /**
     * Sets a new selected date range.
     *
     * @param range - The new date range to set.
     */
    set selectedDateRange(range: IDateRangePicker);
    /**
     * Gets the currently selected date range.
     */
    get selectedDateRange(): IDateRangePicker;
    /**
     * Gets the current date picker configuration.
     */
    get datePickerConfig(): IDatePickerConfig;
    /**
     * Sets a new date picker configuration.
     *
     * @param config - The new configuration to set.
     */
    setDatePickerConfig(config: IDatePickerConfig): void;
    /**
     * Updates the date range picker with new start and end dates.
     *
     * @param dates - An object containing the start date and end date.
     */
    setDateRangePicker(dates: IDateRangePicker): void;
    /**
     * Refresh the date range picker so it shows the day/week containing `date`.
     *
     * @param date  The date used to refresh the picker. Callers pass an INSTANT (e.g. a time log's
     *              `startedAt`), not a wall-clock day.
     * @param timeZone Organization timezone (IANA). Pass it whenever `date` is an instant that belongs
     *              to an organization-local day — see below for why omitting it can select the wrong day.
     */
    refreshDateRangePicker(date: moment.Moment, timeZone?: string): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DateRangePickerBuilderService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<DateRangePickerBuilderService>;
}
