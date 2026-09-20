import { IDateRangePicker, ISelectedDateRange, ITimeLogFilters, WeekDaysEnum } from '@gauzy/contracts';
import { TimePeriod } from './date-picker.interface';
/**
 * We are having issue, when organization not allowed future date
 * When someone run timer for today, all statistic not displaying correctly
 *
 * @returns
 */
export declare function getAdjustDateRangeFutureAllowed(request: ITimeLogFilters | IDateRangePicker): ISelectedDateRange;
/**
 * Shifts a given time range from UTC to the local time zone.
 *
 * @param range The time range to be shifted.
 * @returns The shifted time range in the local time zone.
 */
export declare function shiftUTCtoLocal(range: TimePeriod): TimePeriod;
/**
 * Converts a day string to a day number.
 *
 * @param {String} weekDay
 * @return {Number} Returns day index as number
 */
export declare function dayOfWeekAsString(weekDay: WeekDaysEnum): number;
