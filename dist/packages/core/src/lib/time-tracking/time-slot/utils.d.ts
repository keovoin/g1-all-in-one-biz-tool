import * as moment from 'moment';
/**
 * Generates time slots in 10-minute intervals between a start and end time.
 *
 * - If the start time is aligned with a 10-minute boundary (e.g., 10:20), a full 10-minute slot is created.
 * - If not, it adjusts the current slot to end at the next 10-minute boundary.
 * - The function handles partial slots if the end time falls within a slot.
 *
 * @param start The start time of the range
 * @param end The end time of the range
 * @returns An array of time slots with { startedAt, stoppedAt, duration }
 */
export declare function generateTimeSlots(start: Date, end: Date): any[];
/**
 * GET start and end point of 10 minutes interval
 *
 * @param start
 * @param end
 * @returns
 */
export declare function getStartEndIntervals(start: moment.Moment, end: moment.Moment): {
    start: string | Date;
    end: string | Date;
};
