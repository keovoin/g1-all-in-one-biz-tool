import moment from 'moment-timezone';
import { IActivitiesStatistics, IDateRangePicker, IMembersStatistics, IOrganization, ITimeLogFilters, ITimeLogTodayFilters } from '@gauzy/contracts';
/** The Angular-side selection state the statistics payload is derived from. */
export interface TimeTrackingContext {
    organization: IOrganization;
    dateRange: IDateRangePicker;
    employeeIds: string[];
    projectIds: string[];
    teamIds: string[];
    /** IANA zone from `TimeZoneService.currentTimeZone`. */
    timeZone: string;
}
/** The request every statistics endpoint receives (`ITimeLogFilters & ITimeLogTodayFilters`). */
export type StatisticsPayload = ITimeLogFilters & ITimeLogTodayFilters;
/**
 * Builds the statistics request EXACTLY like Angular's `preparePayloads()`: today's bounds and
 * the (future-clamped) selected range are shifted by the selected zone's UTC offset
 * (`toUtcOffset`) and serialised as `YYYY-MM-DD HH:mm:ss`; `employeeIds` / `projectIds` /
 * `teamIds` are only attached when non-empty.
 *
 * @param context Selection state.
 * @param now Injectable "now" (defaults to `moment()`), for deterministic tests.
 */
export declare function buildStatisticsPayload(context: TimeTrackingContext, now?: moment.Moment): StatisticsPayload;
/**
 * Adds `durationPercentage` (share of the summed duration) to each activity — Angular
 * `getActivities()`.
 *
 * @param activities Raw activities from the API.
 */
export declare function withDurationPercentage(activities: IActivitiesStatistics[] | null | undefined): IActivitiesStatistics[];
/**
 * Normalises `weekHours` into exactly seven bars (day 0–6) whose `duration` is the share of the
 * member's weekly total — Angular `getMembers()`.
 *
 * @param members Raw members from the API.
 */
export declare function normalizeMemberWeekHours(members: IMembersStatistics[] | null | undefined): IMembersStatistics[];
