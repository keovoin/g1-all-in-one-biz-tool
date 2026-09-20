import { Knex } from 'knex';
import { SelectQueryBuilder } from 'typeorm';
import { IGetActivitiesStatistics, IGetTimeSlotStatistics, IGetTasksStatistics, IGetProjectsStatistics, IGetMembersStatistics, IGetCountsStatistics, ICountsStatistics, IMembersStatistics, IActivitiesStatistics, ITimeSlotStatistics, IProjectsStatistics, IGetManualTimesStatistics, IManualTimesStatistics, ID, IGetProfileActivity, IProfileActivity, IWeeklyStatisticsActivities, ITodayStatisticsActivities } from '@gauzy/contracts';
import { ConfigService, MultiORM } from '@gauzy/config';
import { TimeLog } from './../../core/entities/internal';
import { MultiORMEnum } from './../../core/utils';
import { UserService } from '../../user/user.service';
import { TypeOrmTimeSlotRepository } from '../../time-tracking/time-slot/repository/type-orm-time-slot.repository';
import { TypeOrmEmployeeRepository } from '../../employee/repository/type-orm-employee.repository';
import { TypeOrmActivityRepository } from '../activity/repository/type-orm-activity.repository';
import { MikroOrmTimeLogRepository } from '../time-log/repository/mikro-orm-time-log.repository';
import { TypeOrmTimeLogRepository } from '../time-log/repository/type-orm-time-log.repository';
import { ManagedEmployeeService } from '../../employee/managed-employee.service';
import { ProfileActivityPeriod, ProfileActivityRawRow } from './profile-activity.helper';
type ProfileActivityRowsQuery = {
    ormType: MultiORMEnum.TypeORM;
    builder: SelectQueryBuilder<TimeLog>;
} | {
    ormType: MultiORMEnum.MikroORM;
    builder: Knex.QueryBuilder;
};
export declare class StatisticService {
    private readonly typeOrmTimeSlotRepository;
    private readonly typeOrmEmployeeRepository;
    private readonly typeOrmActivityRepository;
    private readonly typeOrmTimeLogRepository;
    private readonly mikroOrmTimeLogRepository;
    private readonly _userService;
    private readonly configService;
    private readonly _managedEmployeeService;
    private readonly logger;
    private readonly profileActivityPostgresTimeZoneSupport;
    protected ormType: MultiORM;
    constructor(typeOrmTimeSlotRepository: TypeOrmTimeSlotRepository, typeOrmEmployeeRepository: TypeOrmEmployeeRepository, typeOrmActivityRepository: TypeOrmActivityRepository, typeOrmTimeLogRepository: TypeOrmTimeLogRepository, mikroOrmTimeLogRepository: MikroOrmTimeLogRepository, _userService: UserService, configService: ConfigService, _managedEmployeeService: ManagedEmployeeService);
    /**
     * Verifies the profile activity target and request-scoped viewing policy before a time-log read.
     *
     * @param request - Employee, organization, and optional team access scope
     * @returns The tenant ID derived from the current request context
     * @throws ForbiddenException when the target or policy is not accessible
     */
    protected assertProfileActivityAccess(request: Pick<IGetProfileActivity, 'employeeId' | 'organizationId' | 'organizationTeamId'>): Promise<ID>;
    /**
     * Returns the lightweight activity summary for one authorized employee.
     */
    getProfileActivity(request: IGetProfileActivity): Promise<IProfileActivity>;
    /**
     * Returns the single instant used to calculate all running time logs in one profile request.
     */
    protected getProfileActivityNow(): Date;
    /**
     * Executes the single raw time-log read. The builder boundary remains available to focused
     * query-plan tests without exposing it as an application API.
     */
    protected getProfileActivityRows(request: IGetProfileActivity, tenantId: ID, period: ProfileActivityPeriod, now: Date): Promise<ProfileActivityRawRow[]>;
    /**
     * Builds, but does not execute, the one-select profile activity query.
     */
    protected buildProfileActivityRowsQuery(request: IGetProfileActivity, tenantId: ID, period: ProfileActivityPeriod, useSupportedPostgresTimeZone?: boolean, now?: Date): ProfileActivityRowsQuery;
    private supportsPostgresTimeZone;
    private queryPostgresTimeZoneSupport;
    private buildTypeOrmProfileActivityQuery;
    private buildKnexProfileActivityQuery;
    /**
     * Fetches the overall tracked time for time slots, aggregating data from related time logs.
     *
     * This function constructs a database query to join the `time_slot` and `time_log` entities,
     * calculating the overall duration. It returns the total aggregated duration in hours.
     *
     * @returns {Promise<number>} The overall tracked time as a summed duration value in hours.
     */
    getOverallTrackedTime(): Promise<number>;
    /**
     * Retrieves time tracking dashboard count statistics, including the total number of employees worked,
     * projects worked, weekly activities, and today's activities based on the given request.
     *
     * This function executes multiple asynchronous operations concurrently to fetch the necessary statistics
     * and constructs a comprehensive response object with aggregated data.
     *
     * @param {IGetCountsStatistics} request - The request object containing filters and parameters to fetch
     * the counts statistics, such as organizationId, date ranges, employeeIds, projectIds, and other filtering criteria.
     *
     * @returns {Promise<ICountsStatistics>} - Returns a promise that resolves with the counts statistics object,
     * containing total employees count, projects count, weekly activity, weekly duration, today's activity, and today's duration.
     */
    getCounts(request: IGetCountsStatistics): Promise<ICountsStatistics>;
    /**
     * Get average activity and total duration of the work for the week.
     *
     * @param request - The request object containing filters and parameters
     * @returns {Promise<IStatisticsActivities>} - The weekly activity statistics
     */
    getWeeklyStatisticsActivities(request: IGetCountsStatistics): Promise<IWeeklyStatisticsActivities>;
    /**
     * Get average activity and total duration of the work for today.
     *
     * @param request - The request object containing filters and parameters
     * @returns {Promise<IStatisticsActivities>} - Today's activity statistics
     */
    getTodayStatisticsActivities(request: IGetCountsStatistics): Promise<ITodayStatisticsActivities>;
    /**
     * Sums the rows of an activity query grouped by time_log.id in SQL, so only three totals leave
     * the database instead of one row per time log, then derives the activity percentage from them.
     * The grouped query is wrapped as a derived table and kept as is: its ROUND(SUM / COUNT) per
     * time_log undoes the time_slot/time_log fan-out, and summing after rounding is what the previous
     * in-memory loop did. The percentage stays in JavaScript: an SQL division would truncate on SQLite
     * and round differently on Postgres, changing the second decimal reported by getCounts.
     *
     * @param groupedQuery - The grouped query, per ORM
     * @param durationAlias - Alias of the per-log tracked duration column in that query
     * @returns The tracked duration and the activity percentage
     */
    private aggregateStatisticsActivities;
    /**
     * GET Time Tracking Dashboard Worked Members Statistics
     *
     * @param request
     * @returns
     */
    getMembers(request: IGetMembersStatistics): Promise<IMembersStatistics[]>;
    /**
     * GET Time Tracking Dashboard Projects Statistics
     *
     * @param request
     * @returns
     */
    getProjects(request: IGetProjectsStatistics): Promise<IProjectsStatistics[]>;
    /**
     * GET Time Tracking Dashboard Tasks Statistics
     *
     * @param request
     * @returns
     */
    getTasks(request: IGetTasksStatistics): Promise<{
        id: string;
        title: any;
        duration: any;
        todayDuration: any;
        updatedAt: any;
    }[]>;
    /**
     * GET Time Tracking Dashboard Manual Time Logs Statistics
     *
     * @param request
     * @returns
     */
    manualTimes(request: IGetManualTimesStatistics): Promise<IManualTimesStatistics[]>;
    /**
     * GET Time Tracking Dashboard Activities Statistics
     *
     * @param request
     * @returns
     */
    getActivities(request: IGetActivitiesStatistics): Promise<IActivitiesStatistics[]>;
    /**
     * Retrieves the top 3 most recently active employees with their latest time slots and screenshots.
     *
     * Filters time logs by tenant, organization, date range, and optionally by employee IDs, project IDs,
     * or team IDs. For each employee, batch-loads User entities via subscribers to resolve fresh presigned
     * S3 image URLs, then fetches up to 9 recent time slots with associated screenshots.
     *
     * @param request - The time slot statistics filter criteria (organization, date range, employees, projects, teams).
     * @returns An array of up to 3 employee time slot statistics, each containing user info and recent time slots.
     */
    getEmployeeTimeSlots(request: IGetTimeSlotStatistics): Promise<ITimeSlotStatistics[]>;
    /**
     * Get the count of employees who worked this week.
     *
     * @param request
     * @returns The count of unique employees
     */
    private getEmployeeWorkedCounts;
    /**
     * Get the count of projects worked on this week.
     *
     * @param request
     * @returns The count of unique projects
     */
    private getProjectWorkedCounts;
    /**
     * Applies filtering conditions to the given TypeORM query builder based on the provided request parameters.
     *
     * @param query The TypeORM query builder instance.
     * @param qb The TypeORM WhereExpressionBuilder instance.
     * @param request The request object containing filter parameters.
     * @returns The modified TypeORM WhereExpressionBuilder instance with applied filtering conditions.
     */
    private getFilterQuery;
}
export {};
