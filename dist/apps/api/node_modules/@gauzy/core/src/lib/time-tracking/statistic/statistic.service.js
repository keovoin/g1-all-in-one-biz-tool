"use strict";
var StatisticService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatisticService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const underscore_1 = require("underscore");
const moment = require("moment");
const contracts_1 = require("@gauzy/contracts");
const utils_1 = require("@gauzy/utils");
const config_1 = require("@gauzy/config");
const statistic_helper_1 = require("./statistic.helper");
const database_helper_1 = require("./../../database/database.helper");
const context_1 = require("../../core/context");
const utils_2 = require("./../../core/utils");
const user_service_1 = require("../../user/user.service");
const type_orm_time_slot_repository_1 = require("../../time-tracking/time-slot/repository/type-orm-time-slot.repository");
const type_orm_employee_repository_1 = require("../../employee/repository/type-orm-employee.repository");
const type_orm_activity_repository_1 = require("../activity/repository/type-orm-activity.repository");
const mikro_orm_time_log_repository_1 = require("../time-log/repository/mikro-orm-time-log.repository");
const type_orm_time_log_repository_1 = require("../time-log/repository/type-orm-time-log.repository");
const managed_employee_service_1 = require("../../employee/managed-employee.service");
const logger_1 = require("../../logger");
const moment_extend_1 = require("../../core/moment-extend");
const profile_activity_helper_1 = require("./profile-activity.helper");
// Get the type of the Object-Relational Mapping (ORM) used in the application.
const ormType = (0, utils_2.getORMType)();
const PROFILE_ACTIVITY_DATABASE_TYPES = new Set([
    config_1.DatabaseTypeEnum.postgres,
    config_1.DatabaseTypeEnum.mysql,
    config_1.DatabaseTypeEnum.sqlite,
    config_1.DatabaseTypeEnum.betterSqlite3
]);
// Matches TimeLogService.getFilterTimeLogQuery: activityLevel percentages are stored as
// 10-minute slot interaction counts, so the legacy 0..100 request becomes inclusive 0..600.
const PROFILE_ACTIVITY_LEVEL_START = 0;
const PROFILE_ACTIVITY_LEVEL_END = 100;
const PROFILE_ACTIVITY_SLOT_ACTIVITY_MULTIPLIER = 6;
function isProfileActivityDatabaseType(value) {
    return PROFILE_ACTIVITY_DATABASE_TYPES.has(value);
}
function toUtcNaiveDateTime(value) {
    return value.toISOString().replace('T', ' ').replace('Z', '');
}
function toMikroOrmProfileDateTime(value, dbType) {
    return dbType === config_1.DatabaseTypeEnum.sqlite || dbType === config_1.DatabaseTypeEnum.betterSqlite3
        ? value.getTime()
        : toUtcNaiveDateTime(value);
}
let StatisticService = StatisticService_1 = class StatisticService {
    constructor(typeOrmTimeSlotRepository, typeOrmEmployeeRepository, typeOrmActivityRepository, typeOrmTimeLogRepository, mikroOrmTimeLogRepository, _userService, configService, _managedEmployeeService) {
        this.typeOrmTimeSlotRepository = typeOrmTimeSlotRepository;
        this.typeOrmEmployeeRepository = typeOrmEmployeeRepository;
        this.typeOrmActivityRepository = typeOrmActivityRepository;
        this.typeOrmTimeLogRepository = typeOrmTimeLogRepository;
        this.mikroOrmTimeLogRepository = mikroOrmTimeLogRepository;
        this._userService = _userService;
        this.configService = configService;
        this._managedEmployeeService = _managedEmployeeService;
        this.logger = new common_1.Logger(StatisticService_1.name);
        this.profileActivityPostgresTimeZoneSupport = new Map();
        this.ormType = ormType;
    }
    /**
     * Verifies the profile activity target and request-scoped viewing policy before a time-log read.
     *
     * @param request - Employee, organization, and optional team access scope
     * @returns The tenant ID derived from the current request context
     * @throws ForbiddenException when the target or policy is not accessible
     */
    async assertProfileActivityAccess(request) {
        const tenantId = context_1.RequestContext.currentTenantId();
        if (!tenantId) {
            throw new common_1.ForbiddenException();
        }
        const targetExists = await this.typeOrmEmployeeRepository.existsBy({
            id: request.employeeId,
            tenantId,
            organizationId: request.organizationId,
            isActive: true,
            isArchived: false,
            deletedAt: (0, typeorm_1.IsNull)()
        });
        if (!targetExists) {
            throw new common_1.ForbiddenException();
        }
        const canViewProfile = await this._managedEmployeeService.canViewEmployeeProfile(request.employeeId, request.organizationId, request.organizationTeamId);
        if (!canViewProfile) {
            throw new common_1.ForbiddenException();
        }
        return tenantId;
    }
    /**
     * Returns the lightweight activity summary for one authorized employee.
     */
    async getProfileActivity(request) {
        const tenantId = await this.assertProfileActivityAccess(request);
        const period = (0, profile_activity_helper_1.resolveProfileActivityPeriod)(request);
        const rows = await this.getProfileActivityRows(request, tenantId, period, this.getProfileActivityNow());
        return (0, profile_activity_helper_1.buildProfileActivityResponse)(request, period, rows);
    }
    /**
     * Returns the single instant used to calculate all running time logs in one profile request.
     */
    getProfileActivityNow() {
        return new Date();
    }
    /**
     * Executes the single raw time-log read. The builder boundary remains available to focused
     * query-plan tests without exposing it as an application API.
     */
    async getProfileActivityRows(request, tenantId, period, now) {
        if (period.endDate.getTime() <= period.startDate.getTime()) {
            return [];
        }
        const dbType = this.configService.dbConnectionOptions.type;
        const canonicalTimeZone = moment_extend_1.moment.tz.zone(request.timeZone)?.name;
        const usePostgresAggregate = dbType === config_1.DatabaseTypeEnum.postgres &&
            canonicalTimeZone !== undefined &&
            (await this.supportsPostgresTimeZone(canonicalTimeZone));
        const query = this.buildProfileActivityRowsQuery(request, tenantId, period, usePostgresAggregate, now);
        if (query.ormType === utils_2.MultiORMEnum.TypeORM) {
            return (await query.builder.getRawMany());
        }
        return (await query.builder);
    }
    /**
     * Builds, but does not execute, the one-select profile activity query.
     */
    buildProfileActivityRowsQuery(request, tenantId, period, useSupportedPostgresTimeZone = true, now = this.getProfileActivityNow()) {
        const dbType = this.configService.dbConnectionOptions.type;
        if (!isProfileActivityDatabaseType(dbType)) {
            throw new Error(`Unsupported profile activity database: ${String(dbType)}`);
        }
        if (this.ormType !== utils_2.MultiORMEnum.TypeORM && this.ormType !== utils_2.MultiORMEnum.MikroORM) {
            throw new Error(`Unsupported profile activity ORM: ${String(this.ormType)}`);
        }
        const canonicalTimeZone = moment_extend_1.moment.tz.zone(request.timeZone)?.name;
        if (!canonicalTimeZone) {
            throw new RangeError('Profile activity timezone is invalid');
        }
        const usePostgresAggregate = dbType === config_1.DatabaseTypeEnum.postgres && useSupportedPostgresTimeZone;
        if (this.ormType === utils_2.MultiORMEnum.TypeORM) {
            return {
                ormType: utils_2.MultiORMEnum.TypeORM,
                builder: this.buildTypeOrmProfileActivityQuery(request, tenantId, period, dbType, canonicalTimeZone, usePostgresAggregate, now)
            };
        }
        return {
            ormType: utils_2.MultiORMEnum.MikroORM,
            builder: this.buildKnexProfileActivityQuery(request, tenantId, period, dbType, canonicalTimeZone, usePostgresAggregate, now)
        };
    }
    async supportsPostgresTimeZone(canonicalTimeZone) {
        const cached = this.profileActivityPostgresTimeZoneSupport.get(canonicalTimeZone);
        if (cached !== undefined) {
            return cached;
        }
        let lookup;
        lookup = this.queryPostgresTimeZoneSupport(canonicalTimeZone).catch((error) => {
            if (this.profileActivityPostgresTimeZoneSupport.get(canonicalTimeZone) === lookup) {
                this.profileActivityPostgresTimeZoneSupport.delete(canonicalTimeZone);
            }
            this.logger.warn(`PostgreSQL timezone lookup failed for ${canonicalTimeZone}; using the portable profile aggregate`, error instanceof Error ? error.stack : undefined);
            return false;
        });
        this.profileActivityPostgresTimeZoneSupport.set(canonicalTimeZone, lookup);
        return lookup;
    }
    async queryPostgresTimeZoneSupport(canonicalTimeZone) {
        const sql = 'SELECT EXISTS (SELECT 1 FROM pg_timezone_names WHERE name = $1) AS "supported"';
        let result;
        if (this.ormType === utils_2.MultiORMEnum.TypeORM) {
            result = await this.typeOrmTimeLogRepository.query(sql, [canonicalTimeZone]);
        }
        else if (this.ormType === utils_2.MultiORMEnum.MikroORM) {
            const knex = this.mikroOrmTimeLogRepository.getKnex();
            result = await knex.raw(sql.replace('$1', '?'), [canonicalTimeZone]);
        }
        else {
            return false;
        }
        const row = Array.isArray(result) ? result[0] : result?.rows?.[0];
        const supported = row?.supported;
        return supported === true || supported === 1 || supported === '1' || supported === 't' || supported === 'true';
    }
    buildTypeOrmProfileActivityQuery(request, tenantId, period, dbType, canonicalTimeZone, usePostgresAggregate, now) {
        const query = this.typeOrmTimeLogRepository.createQueryBuilder('time_log');
        const currentTimeExpression = dbType === config_1.DatabaseTypeEnum.postgres
            ? "(CAST(:profileNow AS timestamptz) AT TIME ZONE 'UTC')"
            : ':profileNow';
        const stoppedAtExpression = `COALESCE(time_log.stoppedAt, ${currentTimeExpression})`;
        const profileNow = dbType === config_1.DatabaseTypeEnum.postgres ? now.toISOString() : toUtcNaiveDateTime(now);
        if (usePostgresAggregate) {
            const dateExpression = "TO_CHAR((time_log.startedAt AT TIME ZONE 'UTC') AT TIME ZONE :profileTimeZone, 'YYYY-MM-DD')";
            query
                .select(dateExpression, 'date')
                .addSelect(`SUM(EXTRACT(EPOCH FROM (${stoppedAtExpression} - time_log.startedAt)))`, 'duration')
                .setParameter('profileTimeZone', canonicalTimeZone)
                .groupBy(dateExpression);
        }
        else {
            const buckets = (0, profile_activity_helper_1.buildProfileActivityDayBuckets)(request);
            const dateExpression = buckets.length
                ? `CASE ${buckets
                    .map((_, index) => {
                    const boundary = dbType === config_1.DatabaseTypeEnum.postgres
                        ? `(CAST(:profileDayEnd${index} AS timestamptz) AT TIME ZONE 'UTC')`
                        : `:profileDayEnd${index}`;
                    return `WHEN time_log.startedAt < ${boundary} THEN :profileDayLabel${index}`;
                })
                    .join(' ')} END`
                : 'NULL';
            let durationExpression;
            if (dbType === config_1.DatabaseTypeEnum.postgres) {
                durationExpression = `SUM(EXTRACT(EPOCH FROM (${stoppedAtExpression} - time_log.startedAt)))`;
            }
            else if (dbType === config_1.DatabaseTypeEnum.mysql) {
                durationExpression = `SUM(TIMESTAMPDIFF(MICROSECOND, time_log.startedAt, ${stoppedAtExpression}) / 1000000.0)`;
            }
            else {
                durationExpression = `SUM((julianday(${stoppedAtExpression}) - julianday(time_log.startedAt)) * 86400.0)`;
            }
            query.select(dateExpression, 'date').addSelect(durationExpression, 'duration').groupBy('1');
            buckets.forEach((bucket, index) => {
                query
                    .setParameter(`profileDayEnd${index}`, dbType === config_1.DatabaseTypeEnum.postgres
                    ? bucket.endDate.toISOString()
                    : toUtcNaiveDateTime(bucket.endDate))
                    .setParameter(`profileDayLabel${index}`, bucket.date);
            });
        }
        query
            .setParameter('profileNow', profileNow)
            .where('time_log.tenantId = :profileTenantId', { profileTenantId: tenantId })
            .andWhere('time_log.organizationId = :profileOrganizationId', {
            profileOrganizationId: request.organizationId
        })
            .andWhere('time_log.employeeId = :profileEmployeeId', { profileEmployeeId: request.employeeId });
        if (dbType === config_1.DatabaseTypeEnum.postgres) {
            query
                .andWhere("time_log.startedAt >= (CAST(:profileStart AS timestamptz) AT TIME ZONE 'UTC')", {
                profileStart: period.startDate.toISOString()
            })
                .andWhere("time_log.startedAt < (CAST(:profileEnd AS timestamptz) AT TIME ZONE 'UTC')", {
                profileEnd: period.endDate.toISOString()
            });
        }
        else {
            query
                .andWhere('time_log.startedAt >= :profileStart', {
                profileStart: toUtcNaiveDateTime(period.startDate)
            })
                .andWhere('time_log.startedAt < :profileEnd', {
                profileEnd: toUtcNaiveDateTime(period.endDate)
            });
        }
        const quote = dbType === config_1.DatabaseTypeEnum.mysql ? '`' : '"';
        const column = (alias, name) => `${quote}${alias}${quote}.${quote}${name}${quote}`;
        const table = (name, alias) => `${quote}${name}${quote} ${quote}${alias}${quote}`;
        const matchingTimeSlot = `EXISTS (SELECT 1 FROM ${table('time_slot_time_logs', 'profile_slot_link')} INNER JOIN ${table('time_slot', 'profile_time_slot')} ON ${column('profile_time_slot', 'id')} = ${column('profile_slot_link', 'timeSlotId')} WHERE ${column('profile_slot_link', 'timeLogId')} = ${column('time_log', 'id')} AND ${column('profile_time_slot', 'tenantId')} = :profileTenantId AND ${column('profile_time_slot', 'organizationId')} = :profileOrganizationId AND ${column('profile_time_slot', 'overall')} BETWEEN :profileActivityStart AND :profileActivityEnd AND ${column('profile_time_slot', 'deletedAt')} IS NULL)`;
        return query
            .andWhere(matchingTimeSlot, {
            profileActivityStart: PROFILE_ACTIVITY_LEVEL_START * PROFILE_ACTIVITY_SLOT_ACTIVITY_MULTIPLIER,
            profileActivityEnd: PROFILE_ACTIVITY_LEVEL_END * PROFILE_ACTIVITY_SLOT_ACTIVITY_MULTIPLIER
        })
            .andWhere(`${stoppedAtExpression} > time_log.startedAt`);
    }
    buildKnexProfileActivityQuery(request, tenantId, period, dbType, canonicalTimeZone, usePostgresAggregate, now) {
        const knex = this.mikroOrmTimeLogRepository.getKnex();
        const query = knex('time_log');
        const profileNow = dbType === config_1.DatabaseTypeEnum.postgres ? now.toISOString() : toMikroOrmProfileDateTime(now, dbType);
        if (usePostgresAggregate) {
            const dateExpression = "TO_CHAR((?? AT TIME ZONE 'UTC') AT TIME ZONE ?, 'YYYY-MM-DD')";
            query
                .select([
                knex.raw(`${dateExpression} AS ??`, ['time_log.startedAt', canonicalTimeZone, 'date']),
                knex.raw("SUM(EXTRACT(EPOCH FROM (COALESCE(??, (CAST(? AS timestamptz) AT TIME ZONE 'UTC')) - ??))) AS ??", ['time_log.stoppedAt', profileNow, 'time_log.startedAt', 'duration'])
            ])
                .groupByRaw('1');
        }
        else {
            const buckets = (0, profile_activity_helper_1.buildProfileActivityDayBuckets)(request);
            const dateBindings = [];
            const cases = buckets.map((bucket) => {
                dateBindings.push('time_log.startedAt', dbType === config_1.DatabaseTypeEnum.postgres
                    ? bucket.endDate.toISOString()
                    : toMikroOrmProfileDateTime(bucket.endDate, dbType), bucket.date);
                return dbType === config_1.DatabaseTypeEnum.postgres
                    ? "WHEN ?? < (CAST(? AS timestamptz) AT TIME ZONE 'UTC') THEN ?"
                    : 'WHEN ?? < ? THEN ?';
            });
            const dateExpression = buckets.length ? `CASE ${cases.join(' ')} END` : 'NULL';
            let duration;
            if (dbType === config_1.DatabaseTypeEnum.postgres) {
                duration = knex.raw("SUM(EXTRACT(EPOCH FROM (COALESCE(??, (CAST(? AS timestamptz) AT TIME ZONE 'UTC')) - ??))) AS ??", ['time_log.stoppedAt', profileNow, 'time_log.startedAt', 'duration']);
            }
            else if (dbType === config_1.DatabaseTypeEnum.mysql) {
                duration = knex.raw('SUM(TIMESTAMPDIFF(MICROSECOND, ??, COALESCE(??, ?)) / 1000000.0) AS ??', [
                    'time_log.startedAt',
                    'time_log.stoppedAt',
                    profileNow,
                    'duration'
                ]);
            }
            else {
                duration = knex.raw('SUM((COALESCE(??, ?) - ??) / 1000.0) AS ??', [
                    'time_log.stoppedAt',
                    profileNow,
                    'time_log.startedAt',
                    'duration'
                ]);
            }
            query.select([knex.raw(`${dateExpression} AS ??`, [...dateBindings, 'date']), duration]).groupByRaw('1');
        }
        query
            .whereRaw('?? = ?', ['time_log.tenantId', tenantId])
            .whereRaw('?? = ?', ['time_log.organizationId', request.organizationId])
            .whereRaw('?? = ?', ['time_log.employeeId', request.employeeId]);
        if (dbType === config_1.DatabaseTypeEnum.postgres) {
            query
                .whereRaw("?? >= (CAST(? AS timestamptz) AT TIME ZONE 'UTC')", [
                'time_log.startedAt',
                period.startDate.toISOString()
            ])
                .whereRaw("?? < (CAST(? AS timestamptz) AT TIME ZONE 'UTC')", [
                'time_log.startedAt',
                period.endDate.toISOString()
            ]);
        }
        else {
            query
                .whereRaw('?? >= ?', ['time_log.startedAt', toMikroOrmProfileDateTime(period.startDate, dbType)])
                .whereRaw('?? < ?', ['time_log.startedAt', toMikroOrmProfileDateTime(period.endDate, dbType)]);
        }
        const matchingTimeSlot = 'EXISTS (SELECT 1 FROM ?? INNER JOIN ?? ON ?? = ?? WHERE ?? = ?? AND ?? = ? AND ?? = ? AND ?? BETWEEN ? AND ? AND ?? IS NULL)';
        query.whereRaw(matchingTimeSlot, [
            'time_slot_time_logs',
            'time_slot',
            'time_slot.id',
            'time_slot_time_logs.timeSlotId',
            'time_slot_time_logs.timeLogId',
            'time_log.id',
            'time_slot.tenantId',
            tenantId,
            'time_slot.organizationId',
            request.organizationId,
            'time_slot.overall',
            PROFILE_ACTIVITY_LEVEL_START * PROFILE_ACTIVITY_SLOT_ACTIVITY_MULTIPLIER,
            PROFILE_ACTIVITY_LEVEL_END * PROFILE_ACTIVITY_SLOT_ACTIVITY_MULTIPLIER,
            'time_slot.deletedAt'
        ]);
        return query
            .whereRaw(dbType === config_1.DatabaseTypeEnum.postgres
            ? "COALESCE(??, (CAST(? AS timestamptz) AT TIME ZONE 'UTC')) > ??"
            : 'COALESCE(??, ?) > ??', ['time_log.stoppedAt', profileNow, 'time_log.startedAt'])
            .whereRaw('?? IS NULL', ['time_log.deletedAt']);
    }
    /**
     * Fetches the overall tracked time for time slots, aggregating data from related time logs.
     *
     * This function constructs a database query to join the `time_slot` and `time_log` entities,
     * calculating the overall duration. It returns the total aggregated duration in hours.
     *
     * @returns {Promise<number>} The overall tracked time as a summed duration value in hours.
     */
    async getOverallTrackedTime() {
        // Retrieve the database type from the configuration service
        const dbType = this.configService.dbConnectionOptions.type;
        let overallDurationInSeconds = 0;
        switch (this.ormType) {
            case utils_2.MultiORMEnum.MikroORM: {
                // MikroORM: Use Knex for raw SQL aggregation
                const knex = this.mikroOrmTimeLogRepository.getKnex();
                const result = await knex('time_slot')
                    .innerJoin('time_slot_time_logs', 'time_slot.id', 'time_slot_time_logs.timeSlotId')
                    .innerJoin('time_log', 'time_slot_time_logs.timeLogId', 'time_log.id')
                    .select(knex.raw((0, statistic_helper_1.getTotalDurationQueryString)(dbType, 'time_log') + ' as overall_duration'))
                    .first();
                overallDurationInSeconds = result?.overall_duration ?? 0;
                break;
            }
            case utils_2.MultiORMEnum.TypeORM:
            default: {
                // Create a query builder for the TimeSlot entity
                const query = this.typeOrmTimeSlotRepository.createQueryBuilder('time_slot');
                // Join with the time_log table
                query.innerJoin('time_slot.timeLogs', 'time_log');
                // Select the sum of the overall duration, dynamically based on the DB type
                query.select((0, statistic_helper_1.getTotalDurationQueryString)(dbType, 'time_log'), 'overall_duration');
                // Execute the query and fetch the raw result from the database
                const overallDuration = await query.getRawOne();
                // Extract the overall duration in seconds
                overallDurationInSeconds = overallDuration?.overall_duration ?? 0;
                break;
            }
        }
        // Convert the overall duration in seconds to hours
        const overallDurationInHours = overallDurationInSeconds / 3600;
        (0, logger_1.debugInDevelopment)(this.logger, () => `Overall Tracked Time Duration: ${overallDurationInSeconds}s (${overallDurationInHours}h)`);
        return overallDurationInHours;
    }
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
    async getCounts(request) {
        // Retrieve statistics counts concurrently
        const [employeesCount, projectsCount, weekActivities, todayActivities] = await Promise.all([
            this.getEmployeeWorkedCounts(request),
            this.getProjectWorkedCounts(request),
            this.getWeeklyStatisticsActivities(request),
            this.getTodayStatisticsActivities(request)
        ]);
        // Construct and return the response object
        return {
            employeesCount,
            projectsCount,
            weekActivities: parseFloat(weekActivities.overall.toFixed(2)),
            weekDuration: weekActivities.duration,
            todayActivities: parseFloat(todayActivities.overall.toFixed(2)),
            todayDuration: todayActivities.duration
        };
    }
    /**
     * Get average activity and total duration of the work for the week.
     *
     * @param request - The request object containing filters and parameters
     * @returns {Promise<IStatisticsActivities>} - The weekly activity statistics
     */
    async getWeeklyStatisticsActivities(request) {
        let { organizationId, startDate, endDate, employeeIds = [], projectIds = [], teamIds = [], activityLevel, logType, source, onlyMe: isOnlyMeSelected // Determine if the request specifies to retrieve data for the current user only
         } = request;
        // Retrieves the database type from the configuration service.
        const dbType = this.configService.dbConnectionOptions.type;
        const tenantId = context_1.RequestContext.currentTenantId() ?? request.tenantId; // Retrieve the current tenant ID
        // Filter employeeIds based on permissions and manager access
        employeeIds = await this._managedEmployeeService.filterAccessibleEmployeeIds(employeeIds, teamIds, [], // projectIds
        isOnlyMeSelected);
        // Define the start and end dates
        const { start, end } = (0, utils_2.getDateRangeFormat)(moment.utc(startDate || moment().startOf('week')), moment.utc(endDate || moment().endOf('week')));
        let groupedQuery;
        switch (this.ormType) {
            case utils_2.MultiORMEnum.MikroORM: {
                // MikroORM: Use Knex for raw SQL aggregation
                const knex = this.mikroOrmTimeLogRepository.getKnex();
                let qb = knex('time_slot')
                    .innerJoin('time_slot_time_logs', 'time_slot.id', 'time_slot_time_logs.timeSlotId')
                    .innerJoin('time_log', 'time_slot_time_logs.timeLogId', 'time_log.id')
                    .select([
                    knex.raw((0, statistic_helper_1.getDurationQueryString)(dbType, 'time_log', 'time_slot') + ' AS week_duration'),
                    knex.raw('COALESCE(SUM(??), 0) AS overall', ['time_slot.overall']),
                    knex.raw('COALESCE(SUM(??), 0) AS duration', ['time_slot.duration']),
                    knex.raw('COUNT(??) AS time_slot_count', ['time_slot.id'])
                ])
                    .where('time_slot.tenantId', tenantId)
                    .andWhere('time_slot.organizationId', organizationId)
                    .andWhere('time_log.tenantId', tenantId)
                    .andWhere('time_log.organizationId', organizationId)
                    .whereBetween('time_slot.startedAt', [start, end])
                    .whereBetween('time_log.startedAt', [start, end])
                    .whereRaw('?? >= ??', ['time_log.stoppedAt', 'time_log.startedAt'])
                    // TypeORM adds these through @DeleteDateColumn; Knex has to spell them out.
                    .whereNull('time_slot.deletedAt')
                    .whereNull('time_log.deletedAt');
                if ((0, utils_1.isNotEmpty)(employeeIds)) {
                    qb = qb.whereIn('time_slot.employeeId', employeeIds).whereIn('time_log.employeeId', employeeIds);
                }
                if ((0, utils_1.isNotEmpty)(projectIds)) {
                    qb = qb.whereIn('time_log.projectId', projectIds);
                }
                if ((0, utils_1.isNotEmpty)(teamIds)) {
                    qb = qb.whereIn('time_log.organizationTeamId', teamIds);
                }
                if ((0, utils_1.isNotEmpty)(activityLevel)) {
                    const startLevel = activityLevel.start * 6;
                    const endLevel = activityLevel.end * 6;
                    qb = qb.whereBetween('time_slot.overall', [startLevel, endLevel]);
                }
                if ((0, utils_1.isNotEmpty)(logType)) {
                    qb = qb.whereIn('time_log.logType', logType);
                }
                if ((0, utils_1.isNotEmpty)(source)) {
                    qb = qb.whereIn('time_log.source', source);
                }
                qb.groupBy('time_log.id');
                groupedQuery = { ormType: utils_2.MultiORMEnum.MikroORM, knex, builder: qb };
                break;
            }
            case utils_2.MultiORMEnum.TypeORM:
            default: {
                const query = this.typeOrmTimeSlotRepository.createQueryBuilder();
                query
                    .innerJoin(`${query.alias}.timeLogs`, 'time_log')
                    .select([
                    (0, statistic_helper_1.getDurationQueryString)(dbType, 'time_log', query.alias) + ' AS week_duration',
                    (0, database_helper_1.prepareSQLQuery)(`COALESCE(SUM("${query.alias}"."overall"), 0)`) + ' AS overall',
                    (0, database_helper_1.prepareSQLQuery)(`COALESCE(SUM("${query.alias}"."duration"), 0)`) + ' AS duration',
                    (0, database_helper_1.prepareSQLQuery)(`COUNT("${query.alias}"."id")`) + ' AS time_slot_count'
                ]);
                // Base where conditions
                query
                    .where(`${query.alias}.tenantId = :tenantId`, { tenantId })
                    .andWhere(`${query.alias}.organizationId = :organizationId`, { organizationId })
                    .andWhere(`time_log.tenantId = :tenantId`, { tenantId })
                    .andWhere(`time_log.organizationId = :organizationId`, { organizationId });
                query
                    .andWhere(`${query.alias}.startedAt BETWEEN :startDate AND :endDate`, {
                    startDate: start,
                    endDate: end
                })
                    .andWhere(`time_log.startedAt BETWEEN :startDate AND :endDate`, { startDate: start, endDate: end })
                    .andWhere(`time_log.stoppedAt >= time_log.startedAt`);
                // Applying optional filters conditionally to avoid unnecessary execution
                if ((0, utils_1.isNotEmpty)(employeeIds)) {
                    query.andWhere(`${query.alias}.employeeId IN (:...employeeIds)`, { employeeIds });
                    query.andWhere(`time_log.employeeId IN (:...employeeIds)`, { employeeIds });
                }
                // Filter by project
                if ((0, utils_1.isNotEmpty)(projectIds)) {
                    query.andWhere(`time_log.projectId IN (:...projectIds)`, { projectIds });
                }
                // Filter by team
                if ((0, utils_1.isNotEmpty)(teamIds)) {
                    query.andWhere(`time_log.organizationTeamId IN (:...teamIds)`, { teamIds });
                }
                // Filter by activity level
                if ((0, utils_1.isNotEmpty)(activityLevel)) {
                    const startLevel = activityLevel.start * 6;
                    const endLevel = activityLevel.end * 6;
                    query.andWhere(`${query.alias}.overall BETWEEN :startLevel AND :endLevel`, {
                        startLevel,
                        endLevel
                    });
                }
                // Filter by log type
                if ((0, utils_1.isNotEmpty)(logType)) {
                    query.andWhere(`time_log.logType IN (:...logType)`, { logType });
                }
                // Filter by source
                if ((0, utils_1.isNotEmpty)(source)) {
                    query.andWhere(`time_log.source IN (:...source)`, { source });
                }
                // Group by time_log.id to get the total duration and overall for each time slot
                query.groupBy((0, database_helper_1.prepareSQLQuery)(`"time_log"."id"`));
                groupedQuery = { ormType: utils_2.MultiORMEnum.TypeORM, builder: query };
                break;
            }
        }
        return this.aggregateStatisticsActivities(groupedQuery, 'week_duration');
    }
    /**
     * Get average activity and total duration of the work for today.
     *
     * @param request - The request object containing filters and parameters
     * @returns {Promise<IStatisticsActivities>} - Today's activity statistics
     */
    async getTodayStatisticsActivities(request) {
        // Destructure the necessary properties from the request with default values
        let { organizationId, todayStart, todayEnd, employeeIds = [], projectIds = [], teamIds = [], activityLevel, onlyMe: isOnlyMeSelected, // Determine if the request specifies to retrieve data for the current user only
        logType, source } = request || {};
        // Retrieves the database type from the configuration service.
        const dbType = this.configService.dbConnectionOptions.type;
        const tenantId = context_1.RequestContext.currentTenantId() ?? request.tenantId; // Retrieve the current tenant ID
        // Filter employeeIds based on permissions and manager access
        employeeIds = await this._managedEmployeeService.filterAccessibleEmployeeIds(employeeIds, teamIds, [], // projectIds
        isOnlyMeSelected);
        // Get date range for today
        const { start: startToday, end: endToday } = (0, utils_2.getDateRangeFormat)(moment.utc(todayStart || moment().startOf('day')), moment.utc(todayEnd || moment().endOf('day')));
        let groupedQuery;
        switch (this.ormType) {
            case utils_2.MultiORMEnum.MikroORM: {
                // MikroORM: Use Knex for raw SQL aggregation
                const knex = this.mikroOrmTimeLogRepository.getKnex();
                let qb = knex('time_slot')
                    .innerJoin('time_slot_time_logs', 'time_slot.id', 'time_slot_time_logs.timeSlotId')
                    .innerJoin('time_log', 'time_slot_time_logs.timeLogId', 'time_log.id')
                    .select([
                    knex.raw((0, statistic_helper_1.getDurationQueryString)(dbType, 'time_log', 'time_slot') + ' AS today_duration'),
                    knex.raw('COALESCE(SUM(??), 0) AS overall', ['time_slot.overall']),
                    knex.raw('COALESCE(SUM(??), 0) AS duration', ['time_slot.duration']),
                    knex.raw('COUNT(??) AS time_slot_count', ['time_slot.id'])
                ])
                    .where('time_slot.tenantId', tenantId)
                    .andWhere('time_slot.organizationId', organizationId)
                    .andWhere('time_log.tenantId', tenantId)
                    .andWhere('time_log.organizationId', organizationId)
                    .whereBetween('time_slot.startedAt', [startToday, endToday])
                    .whereBetween('time_log.startedAt', [startToday, endToday])
                    .whereRaw('?? >= ??', ['time_log.stoppedAt', 'time_log.startedAt'])
                    // TypeORM adds these through @DeleteDateColumn; Knex has to spell them out.
                    .whereNull('time_slot.deletedAt')
                    .whereNull('time_log.deletedAt');
                if ((0, utils_1.isNotEmpty)(employeeIds)) {
                    qb = qb.whereIn('time_slot.employeeId', employeeIds).whereIn('time_log.employeeId', employeeIds);
                }
                if ((0, utils_1.isNotEmpty)(teamIds)) {
                    qb = qb.whereIn('time_log.organizationTeamId', teamIds);
                }
                if ((0, utils_1.isNotEmpty)(projectIds)) {
                    qb = qb.whereIn('time_log.projectId', projectIds);
                }
                if ((0, utils_1.isNotEmpty)(activityLevel)) {
                    const startLevel = activityLevel.start * 6;
                    const endLevel = activityLevel.end * 6;
                    qb = qb.whereBetween('time_slot.overall', [startLevel, endLevel]);
                }
                if ((0, utils_1.isNotEmpty)(logType)) {
                    qb = qb.whereIn('time_log.logType', logType);
                }
                if ((0, utils_1.isNotEmpty)(source)) {
                    qb = qb.whereIn('time_log.source', source);
                }
                qb.groupBy('time_log.id');
                groupedQuery = { ormType: utils_2.MultiORMEnum.MikroORM, knex, builder: qb };
                break;
            }
            case utils_2.MultiORMEnum.TypeORM:
            default: {
                const query = this.typeOrmTimeSlotRepository.createQueryBuilder();
                // Define the base select statements and joins
                query
                    .innerJoin(`${query.alias}.timeLogs`, 'time_log')
                    .select([
                    (0, statistic_helper_1.getDurationQueryString)(dbType, 'time_log', query.alias) + ' AS today_duration',
                    (0, database_helper_1.prepareSQLQuery)(`COALESCE(SUM("${query.alias}"."overall"), 0)`) + ' AS overall',
                    (0, database_helper_1.prepareSQLQuery)(`COALESCE(SUM("${query.alias}"."duration"), 0)`) + ' AS duration',
                    (0, database_helper_1.prepareSQLQuery)(`COUNT("${query.alias}"."id")`) + ' AS time_slot_count'
                ]);
                // Base where conditions
                query
                    .andWhere(`${query.alias}.tenantId = :tenantId`, { tenantId })
                    .andWhere(`${query.alias}.organizationId = :organizationId`, { organizationId })
                    .andWhere(`time_log.tenantId = :tenantId`, { tenantId })
                    .andWhere(`time_log.organizationId = :organizationId`, { organizationId });
                query
                    .andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."startedAt" BETWEEN :startDate AND :endDate`), {
                    startDate: startToday,
                    endDate: endToday
                })
                    .andWhere((0, database_helper_1.prepareSQLQuery)(`"time_log"."startedAt" BETWEEN :startDate AND :endDate`), {
                    startDate: startToday,
                    endDate: endToday
                })
                    .andWhere(`time_log.stoppedAt >= time_log.startedAt`);
                // Optional filters
                if ((0, utils_1.isNotEmpty)(employeeIds)) {
                    query
                        .andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."employeeId" IN (:...employeeIds)`), { employeeIds })
                        .andWhere((0, database_helper_1.prepareSQLQuery)(`"time_log"."employeeId" IN (:...employeeIds)`), { employeeIds });
                }
                if ((0, utils_1.isNotEmpty)(teamIds)) {
                    query.andWhere((0, database_helper_1.prepareSQLQuery)(`"time_log"."organizationTeamId" IN (:...teamIds)`), { teamIds });
                }
                if ((0, utils_1.isNotEmpty)(projectIds)) {
                    query.andWhere((0, database_helper_1.prepareSQLQuery)(`"time_log"."projectId" IN (:...projectIds)`), { projectIds });
                }
                if ((0, utils_1.isNotEmpty)(activityLevel)) {
                    /**
                     * Activity Level should be 0-100%
                     * So, we have to convert it into a 10-minute TimeSlot by multiplying by 6
                     */
                    const startLevel = activityLevel.start * 6;
                    const endLevel = activityLevel.end * 6;
                    query.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."overall" BETWEEN :startLevel AND :endLevel`), {
                        startLevel,
                        endLevel
                    });
                }
                if ((0, utils_1.isNotEmpty)(logType)) {
                    query.andWhere((0, database_helper_1.prepareSQLQuery)(`"time_log"."logType" IN (:...logType)`), { logType });
                }
                if ((0, utils_1.isNotEmpty)(source)) {
                    query.andWhere((0, database_helper_1.prepareSQLQuery)(`"time_log"."source" IN (:...source)`), { source });
                }
                query.groupBy((0, database_helper_1.prepareSQLQuery)(`"time_log"."id"`));
                groupedQuery = { ormType: utils_2.MultiORMEnum.TypeORM, builder: query };
                break;
            }
        }
        return this.aggregateStatisticsActivities(groupedQuery, 'today_duration');
    }
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
    async aggregateStatisticsActivities(groupedQuery, durationAlias) {
        let totals;
        switch (groupedQuery.ormType) {
            case utils_2.MultiORMEnum.MikroORM: {
                const { knex, builder } = groupedQuery;
                totals = await knex
                    .from(builder.as('t'))
                    .select([
                    knex.raw((0, database_helper_1.prepareSQLQuery)(`COALESCE(SUM("t"."${durationAlias}"), 0) AS tracked_duration`)),
                    knex.raw((0, database_helper_1.prepareSQLQuery)(`COALESCE(SUM("t"."overall"), 0) AS overall`)),
                    knex.raw((0, database_helper_1.prepareSQLQuery)(`COALESCE(SUM("t"."duration"), 0) AS duration`))
                ])
                    .first();
                break;
            }
            case utils_2.MultiORMEnum.TypeORM:
            default: {
                const { builder } = groupedQuery;
                totals = await this.typeOrmTimeSlotRepository.manager
                    .createQueryBuilder()
                    .select((0, database_helper_1.prepareSQLQuery)(`COALESCE(SUM("t"."${durationAlias}"), 0)`), 'tracked_duration')
                    .addSelect((0, database_helper_1.prepareSQLQuery)(`COALESCE(SUM("t"."overall"), 0)`), 'overall')
                    .addSelect((0, database_helper_1.prepareSQLQuery)(`COALESCE(SUM("t"."duration"), 0)`), 'duration')
                    .from(`(${builder.getQuery()})`, 't')
                    .setParameters(builder.getParameters())
                    .getRawOne();
                break;
            }
        }
        const trackedDuration = Number(totals?.tracked_duration) || 0;
        const overall = Number(totals?.overall) || 0;
        const duration = Number(totals?.duration) || 0;
        return {
            duration: trackedDuration,
            overall: duration > 0 ? (overall * 100) / duration : 0
        };
    }
    /**
     * GET Time Tracking Dashboard Worked Members Statistics
     *
     * @param request
     * @returns
     */
    async getMembers(request) {
        const { organizationId, startDate, endDate, todayStart, todayEnd } = request;
        let { employeeIds = [], projectIds = [], teamIds = [] } = request;
        const dbType = this.configService.dbConnectionOptions.type;
        const tenantId = context_1.RequestContext.currentTenantId() ?? request.tenantId;
        const { start: weeklyStart, end: weeklyEnd } = (0, utils_2.getDateRangeFormat)(moment.utc(startDate ?? moment().startOf('week')), moment.utc(endDate ?? moment().endOf('week')));
        // Filter employeeIds based on permissions and manager access
        // Note: getMembers() doesn't have onlyMe parameter, so we pass false
        employeeIds = await this._managedEmployeeService.filterAccessibleEmployeeIds(employeeIds, teamIds, projectIds, false // onlyMe
        );
        let employees = [];
        switch (this.ormType) {
            case utils_2.MultiORMEnum.MikroORM: {
                // MikroORM: Use Knex for all 4 complex queries
                const knex = this.mikroOrmTimeLogRepository.getKnex();
                const totalDurationExpr = (0, statistic_helper_1.getTotalDurationQueryString)(dbType, 'timeLogs');
                const durationQueryStr = (0, statistic_helper_1.getDurationQueryString)(dbType, 'timeLogs', 'time_slot');
                // Query 1: Employee list with aggregated duration
                let empQb = knex('employee')
                    .innerJoin('user', 'employee.userId', 'user.id')
                    .innerJoin('time_log as timeLogs', 'employee.id', 'timeLogs.employeeId')
                    .innerJoin('time_slot_time_logs', 'timeLogs.id', 'time_slot_time_logs.timeLogId')
                    .innerJoin('time_slot', 'time_slot_time_logs.timeSlotId', 'time_slot.id')
                    .select([
                    'employee.id as id',
                    'user.id as user_id',
                    knex.raw(`${totalDurationExpr} as duration`),
                    'employee.isOnline as isOnline',
                    'employee.isAway as isAway'
                ])
                    .where('employee.tenantId', tenantId)
                    .andWhere('employee.organizationId', organizationId)
                    .andWhere('timeLogs.tenantId', tenantId)
                    .andWhere('timeLogs.organizationId', organizationId)
                    .whereBetween('timeLogs.startedAt', [weeklyStart, weeklyEnd])
                    .whereBetween('time_slot.startedAt', [weeklyStart, weeklyEnd]);
                if ((0, utils_1.isNotEmpty)(employeeIds)) {
                    empQb = empQb.whereIn('employee.id', employeeIds).whereIn('timeLogs.employeeId', employeeIds);
                }
                if ((0, utils_1.isNotEmpty)(projectIds)) {
                    empQb = empQb.whereIn('timeLogs.projectId', projectIds);
                }
                if ((0, utils_1.isNotEmpty)(teamIds)) {
                    empQb = empQb.whereIn('timeLogs.organizationTeamId', teamIds);
                }
                employees = (await empQb
                    .groupBy('employee.id')
                    .groupBy('employee.isOnline')
                    .groupBy('employee.isAway')
                    .groupBy('user.id')
                    .orderBy('duration', 'DESC'));
                if (employees.length > 0) {
                    const memberIds = (0, underscore_1.pluck)(employees, 'id');
                    // Query 2: Weekly Member Activity
                    let weekQb = knex('time_slot')
                        .innerJoin('time_slot_time_logs', 'time_slot.id', 'time_slot_time_logs.timeSlotId')
                        .innerJoin('time_log as timeLogs', 'time_slot_time_logs.timeLogId', 'timeLogs.id')
                        .select([
                        knex.raw(`${durationQueryStr} as week_duration`),
                        knex.raw(`COALESCE(SUM("time_slot"."overall"), 0) as overall`),
                        knex.raw(`COALESCE(SUM("time_slot"."duration"), 0) as duration`),
                        knex.raw(`COUNT("time_slot"."id") as time_slot_count`),
                        'time_slot.employeeId as employeeId'
                    ])
                        .where('time_slot.tenantId', tenantId)
                        .andWhere('time_slot.organizationId', organizationId)
                        .andWhere('timeLogs.tenantId', tenantId)
                        .andWhere('timeLogs.organizationId', organizationId)
                        .whereBetween('timeLogs.startedAt', [weeklyStart, weeklyEnd])
                        .whereBetween('time_slot.startedAt', [weeklyStart, weeklyEnd]);
                    if ((0, utils_1.isNotEmpty)(memberIds)) {
                        weekQb = weekQb
                            .whereIn('time_slot.employeeId', memberIds)
                            .whereIn('timeLogs.employeeId', memberIds);
                    }
                    if ((0, utils_1.isNotEmpty)(projectIds)) {
                        weekQb = weekQb.whereIn('timeLogs.projectId', projectIds);
                    }
                    if ((0, utils_1.isNotEmpty)(teamIds)) {
                        weekQb = weekQb.whereIn('timeLogs.organizationTeamId', teamIds);
                    }
                    weekQb = weekQb.groupBy('timeLogs.id').groupBy('time_slot.employeeId');
                    let weekTimeSlots = await weekQb;
                    weekTimeSlots = (0, underscore_1.mapObject)((0, underscore_1.groupBy)(weekTimeSlots, 'employeeId'), (values, employeeId) => {
                        const weekDuration = (0, underscore_1.reduce)((0, underscore_1.pluck)(values, 'week_duration'), utils_1.ArraySum, 0);
                        const weekPercentage = ((0, underscore_1.reduce)((0, underscore_1.pluck)(values, 'overall'), utils_1.ArraySum, 0) * 100) /
                            (0, underscore_1.reduce)((0, underscore_1.pluck)(values, 'duration'), utils_1.ArraySum, 0);
                        return {
                            employeeId,
                            duration: weekDuration,
                            overall: weekPercentage
                        };
                    });
                    weekTimeSlots = (0, underscore_1.chain)(weekTimeSlots)
                        .map((weekTimeSlot) => {
                        if (weekTimeSlot && weekTimeSlot.overall) {
                            weekTimeSlot.overall = parseFloat(weekTimeSlot.overall).toFixed(1);
                        }
                        return weekTimeSlot;
                    })
                        .indexBy('employeeId')
                        .value();
                    // Query 3: Daily Member Activity
                    const { start: startToday, end: endToday } = (0, utils_2.getDateRangeFormat)(moment.utc(todayStart || moment().startOf('day')), moment.utc(todayEnd || moment().endOf('day')));
                    let dayQb = knex('time_slot')
                        .innerJoin('time_slot_time_logs', 'time_slot.id', 'time_slot_time_logs.timeSlotId')
                        .innerJoin('time_log as timeLogs', 'time_slot_time_logs.timeLogId', 'timeLogs.id')
                        .select([
                        knex.raw(`${durationQueryStr} as today_duration`),
                        knex.raw(`COALESCE(SUM("time_slot"."overall"), 0) as overall`),
                        knex.raw(`COALESCE(SUM("time_slot"."duration"), 0) as duration`),
                        knex.raw(`COUNT("time_slot"."id") as time_slot_count`),
                        'time_slot.employeeId as employeeId'
                    ])
                        .where('time_slot.tenantId', tenantId)
                        .andWhere('time_slot.organizationId', organizationId)
                        .andWhere('timeLogs.tenantId', tenantId)
                        .andWhere('timeLogs.organizationId', organizationId)
                        .whereBetween('timeLogs.startedAt', [startToday, endToday])
                        .whereBetween('time_slot.startedAt', [startToday, endToday]);
                    if ((0, utils_1.isNotEmpty)(memberIds)) {
                        dayQb = dayQb
                            .whereIn('time_slot.employeeId', memberIds)
                            .whereIn('timeLogs.employeeId', memberIds);
                    }
                    if ((0, utils_1.isNotEmpty)(projectIds)) {
                        dayQb = dayQb.whereIn('timeLogs.projectId', projectIds);
                    }
                    if ((0, utils_1.isNotEmpty)(teamIds)) {
                        dayQb = dayQb.whereIn('timeLogs.organizationTeamId', teamIds);
                    }
                    dayQb = dayQb.groupBy('timeLogs.id').groupBy('time_slot.employeeId');
                    let dayTimeSlots = await dayQb;
                    dayTimeSlots = (0, underscore_1.mapObject)((0, underscore_1.groupBy)(dayTimeSlots, 'employeeId'), (values, employeeId) => {
                        const todayDuration = (0, underscore_1.reduce)((0, underscore_1.pluck)(values, 'today_duration'), utils_1.ArraySum, 0);
                        const todayPercentage = ((0, underscore_1.reduce)((0, underscore_1.pluck)(values, 'overall'), utils_1.ArraySum, 0) * 100) /
                            (0, underscore_1.reduce)((0, underscore_1.pluck)(values, 'duration'), utils_1.ArraySum, 0);
                        return {
                            employeeId,
                            duration: todayDuration,
                            overall: todayPercentage
                        };
                    });
                    dayTimeSlots = (0, underscore_1.chain)(dayTimeSlots)
                        .map((dayTimeSlot) => {
                        if (dayTimeSlot && dayTimeSlot.overall) {
                            dayTimeSlot.overall = parseFloat(dayTimeSlot.overall).toFixed(1);
                        }
                        return dayTimeSlot;
                    })
                        .indexBy('employeeId')
                        .value();
                    // Query 4: Per-member weekly hours by day-of-week
                    const dowExpr = (0, config_1.isSqlite)() || (0, config_1.isBetterSqlite3)()
                        ? `(strftime('%w', timeLogs.startedAt))`
                        : (0, config_1.isPostgres)()
                            ? 'EXTRACT(DOW FROM "timeLogs"."startedAt")'
                            : (0, config_1.isMySQL)()
                                ? (0, database_helper_1.prepareSQLQuery)('DayOfWeek("timeLogs"."startedAt") - 1')
                                : '0';
                    // Batch-load User entities so subscribers resolve fresh presigned URLs
                    const memberUserIds = employees.map((e) => e.user_id).filter(Boolean);
                    const userMap = await this._userService.findUsersByIds(memberUserIds);
                    for (let index = 0; index < employees.length; index++) {
                        const member = employees[index];
                        member.weekTime = weekTimeSlots[member.id];
                        member.todayTime = dayTimeSlots[member.id];
                        const user = userMap.get(member.user_id);
                        if (!user) {
                            this.logger.warn(`User not found for member id=${member.id}, user_id=${member.user_id}. findUsersByIds returned no match.`);
                        }
                        member.user = {
                            name: user?.name ?? null,
                            imageUrl: user?.imageUrl ?? null
                        };
                        delete member.user_id;
                        let weekHoursQb = knex('employee as emp')
                            .innerJoin('time_log as timeLogs', 'emp.id', 'timeLogs.employeeId')
                            .innerJoin('time_slot_time_logs', 'timeLogs.id', 'time_slot_time_logs.timeLogId')
                            .innerJoin('time_slot', 'time_slot_time_logs.timeSlotId', 'time_slot.id')
                            .select([
                            knex.raw(`${(0, statistic_helper_1.getTotalDurationQueryString)(dbType, 'timeLogs')} as duration`),
                            knex.raw(`${dowExpr} as day`)
                        ])
                            .where('emp.id', member.id)
                            .andWhere('emp.tenantId', tenantId)
                            .andWhere('emp.organizationId', organizationId)
                            .andWhere('timeLogs.tenantId', tenantId)
                            .andWhere('timeLogs.organizationId', organizationId)
                            .whereBetween('timeLogs.startedAt', [weeklyStart, weeklyEnd])
                            .whereBetween('time_slot.startedAt', [weeklyStart, weeklyEnd]);
                        if ((0, utils_1.isNotEmpty)(employeeIds)) {
                            weekHoursQb = weekHoursQb.whereIn('timeLogs.employeeId', employeeIds);
                        }
                        if ((0, utils_1.isNotEmpty)(projectIds)) {
                            weekHoursQb = weekHoursQb.whereIn('timeLogs.projectId', projectIds);
                        }
                        if ((0, utils_1.isNotEmpty)(teamIds)) {
                            weekHoursQb = weekHoursQb.whereIn('timeLogs.organizationTeamId', teamIds);
                        }
                        weekHoursQb = weekHoursQb.groupByRaw(dowExpr);
                        member.weekHours = await weekHoursQb;
                    }
                }
                break;
            }
            case utils_2.MultiORMEnum.TypeORM:
            default: {
                // Create a query builder for the Employee entity
                const query = this.typeOrmEmployeeRepository.createQueryBuilder();
                employees = await query
                    .select((0, database_helper_1.prepareSQLQuery)(`"${query.alias}".id`))
                    .addSelect((0, database_helper_1.prepareSQLQuery)(`"user"."id"`), 'user_id')
                    .addSelect((0, statistic_helper_1.getTotalDurationQueryString)(dbType, 'timeLogs'), `duration`)
                    .addSelect((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."isOnline"`), 'isOnline')
                    .addSelect((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."isAway"`), 'isAway')
                    .innerJoin(`${query.alias}.user`, 'user')
                    .innerJoin(`${query.alias}.timeLogs`, 'timeLogs')
                    .innerJoin(`timeLogs.timeSlots`, 'time_slot')
                    .andWhere(new typeorm_1.Brackets((qb) => {
                    qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."tenantId" = :tenantId`), { tenantId });
                    qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."organizationId" = :organizationId`), { organizationId });
                }))
                    .andWhere(new typeorm_1.Brackets((qb) => {
                    qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"timeLogs"."tenantId" = :tenantId`), { tenantId });
                    qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"timeLogs"."organizationId" = :organizationId`), { organizationId });
                }))
                    .andWhere(new typeorm_1.Brackets((qb) => {
                    qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"timeLogs"."startedAt" BETWEEN :weeklyStart AND :weeklyEnd`), {
                        weeklyStart,
                        weeklyEnd
                    });
                    qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"time_slot"."startedAt" BETWEEN :weeklyStart AND :weeklyEnd`), {
                        weeklyStart,
                        weeklyEnd
                    });
                    /**
                     * If Employee Selected
                     */
                    if ((0, utils_1.isNotEmpty)(employeeIds)) {
                        qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."id" IN(:...employeeIds)`), { employeeIds });
                        qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"timeLogs"."employeeId" IN(:...employeeIds)`), { employeeIds });
                    }
                    /**
                     * If Project Selected
                     */
                    if ((0, utils_1.isNotEmpty)(projectIds)) {
                        qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"timeLogs"."projectId" IN (:...projectIds)`), { projectIds });
                    }
                    if ((0, utils_1.isNotEmpty)(teamIds)) {
                        qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"timeLogs"."organizationTeamId" IN (:...teamIds)`), { teamIds });
                    }
                }))
                    .groupBy((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."id"`))
                    .addGroupBy((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."isOnline"`))
                    .addGroupBy((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."isAway"`))
                    .addGroupBy((0, database_helper_1.prepareSQLQuery)(`"user"."id"`))
                    .orderBy('duration', 'DESC')
                    .getRawMany();
                if (employees.length > 0) {
                    const employeeIds = (0, underscore_1.pluck)(employees, 'id');
                    /**
                     * Weekly Member Activity
                     */
                    const weekTimeQuery = this.typeOrmTimeSlotRepository.createQueryBuilder('time_slot');
                    weekTimeQuery
                        .select((0, statistic_helper_1.getDurationQueryString)(dbType, 'timeLogs', weekTimeQuery.alias), `week_duration`)
                        .addSelect((0, database_helper_1.prepareSQLQuery)(`COALESCE(SUM("${weekTimeQuery.alias}"."overall"), 0)`), `overall`)
                        .addSelect((0, database_helper_1.prepareSQLQuery)(`COALESCE(SUM("${weekTimeQuery.alias}"."duration"), 0)`), `duration`)
                        .addSelect((0, database_helper_1.prepareSQLQuery)(`COUNT("${weekTimeQuery.alias}"."id")`), `time_slot_count`)
                        .addSelect(`${weekTimeQuery.alias}.employeeId`, 'employeeId')
                        .innerJoin(`${weekTimeQuery.alias}.timeLogs`, 'timeLogs')
                        .andWhere(new typeorm_1.Brackets((qb) => {
                        qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${weekTimeQuery.alias}"."tenantId" = :tenantId`), { tenantId });
                        qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${weekTimeQuery.alias}"."organizationId" = :organizationId`), {
                            organizationId
                        });
                    }))
                        .andWhere(new typeorm_1.Brackets((qb) => {
                        qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"timeLogs"."tenantId" = :tenantId`), { tenantId });
                        qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"timeLogs"."organizationId" = :organizationId`), { organizationId });
                    }))
                        .andWhere(new typeorm_1.Brackets((qb) => {
                        qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"timeLogs"."startedAt" BETWEEN :weeklyStart AND :weeklyEnd`), {
                            weeklyStart,
                            weeklyEnd
                        });
                        qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${weekTimeQuery.alias}"."startedAt" BETWEEN :weeklyStart AND :weeklyEnd`), { weeklyStart, weeklyEnd });
                        /**
                         * If Employee Selected
                         */
                        if ((0, utils_1.isNotEmpty)(employeeIds)) {
                            qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${weekTimeQuery.alias}"."employeeId" IN(:...employeeIds)`), {
                                employeeIds
                            });
                            qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"timeLogs"."employeeId" IN(:...employeeIds)`), { employeeIds });
                        }
                        /**
                         * If Project Selected
                         */
                        if ((0, utils_1.isNotEmpty)(projectIds)) {
                            qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"timeLogs"."projectId" IN(:...projectIds)`), { projectIds });
                        }
                        if ((0, utils_1.isNotEmpty)(teamIds)) {
                            qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"timeLogs"."organizationTeamId" IN (:...teamIds)`), { teamIds });
                        }
                    }))
                        .groupBy(`timeLogs.id`)
                        .addGroupBy(`${weekTimeQuery.alias}.employeeId`);
                    let weekTimeSlots = await weekTimeQuery.getRawMany();
                    weekTimeSlots = (0, underscore_1.mapObject)((0, underscore_1.groupBy)(weekTimeSlots, 'employeeId'), (values, employeeId) => {
                        const weekDuration = (0, underscore_1.reduce)((0, underscore_1.pluck)(values, 'week_duration'), utils_1.ArraySum, 0);
                        const weekPercentage = ((0, underscore_1.reduce)((0, underscore_1.pluck)(values, 'overall'), utils_1.ArraySum, 0) * 100) /
                            (0, underscore_1.reduce)((0, underscore_1.pluck)(values, 'duration'), utils_1.ArraySum, 0);
                        return {
                            employeeId,
                            duration: weekDuration,
                            overall: weekPercentage
                        };
                    });
                    weekTimeSlots = (0, underscore_1.chain)(weekTimeSlots)
                        .map((weekTimeSlot) => {
                        if (weekTimeSlot && weekTimeSlot.overall) {
                            weekTimeSlot.overall = parseFloat(weekTimeSlot.overall).toFixed(1);
                        }
                        return weekTimeSlot;
                    })
                        .indexBy('employeeId')
                        .value();
                    /**
                     * Daily Member Activity
                     */
                    let dayTimeQuery = this.typeOrmTimeSlotRepository.createQueryBuilder('time_slot');
                    dayTimeQuery
                        .select((0, statistic_helper_1.getDurationQueryString)(dbType, 'timeLogs', dayTimeQuery.alias), `today_duration`)
                        .addSelect((0, database_helper_1.prepareSQLQuery)(`COALESCE(SUM("${dayTimeQuery.alias}"."overall"), 0)`), `overall`)
                        .addSelect((0, database_helper_1.prepareSQLQuery)(`COALESCE(SUM("${dayTimeQuery.alias}"."duration"), 0)`), `duration`)
                        .addSelect((0, database_helper_1.prepareSQLQuery)(`COUNT("${dayTimeQuery.alias}"."id")`), `time_slot_count`)
                        .addSelect(`${dayTimeQuery.alias}.employeeId`, 'employeeId')
                        .innerJoin(`${dayTimeQuery.alias}.timeLogs`, 'timeLogs')
                        .andWhere(new typeorm_1.Brackets((qb) => {
                        qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${dayTimeQuery.alias}"."tenantId" = :tenantId`), { tenantId });
                        qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${dayTimeQuery.alias}"."organizationId" = :organizationId`), {
                            organizationId
                        });
                    }))
                        .andWhere(new typeorm_1.Brackets((qb) => {
                        qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"timeLogs"."tenantId" = :tenantId`), { tenantId });
                        qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"timeLogs"."organizationId" = :organizationId`), { organizationId });
                    }))
                        .andWhere(new typeorm_1.Brackets((qb) => {
                        const { start: startToday, end: endToday } = (0, utils_2.getDateRangeFormat)(moment.utc(todayStart || moment().startOf('day')), moment.utc(todayEnd || moment().endOf('day')));
                        qb.where((0, database_helper_1.prepareSQLQuery)(`"timeLogs"."startedAt" BETWEEN :startToday AND :endToday`), {
                            startToday,
                            endToday
                        });
                        qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${dayTimeQuery.alias}"."startedAt" BETWEEN :startToday AND :endToday`), {
                            startToday,
                            endToday
                        });
                        /**
                         * If Employee Selected
                         */
                        if ((0, utils_1.isNotEmpty)(employeeIds)) {
                            qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${dayTimeQuery.alias}"."employeeId" IN(:...employeeIds)`), {
                                employeeIds
                            });
                            qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"timeLogs"."employeeId" IN(:...employeeIds)`), { employeeIds });
                        }
                        /**
                         * If Project Selected
                         */
                        if ((0, utils_1.isNotEmpty)(projectIds)) {
                            qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"timeLogs"."projectId" IN(:...projectIds)`), { projectIds });
                        }
                        if ((0, utils_1.isNotEmpty)(teamIds)) {
                            qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"timeLogs"."organizationTeamId" IN (:...teamIds)`), { teamIds });
                        }
                    }))
                        .groupBy(`timeLogs.id`)
                        .addGroupBy(`${dayTimeQuery.alias}.employeeId`);
                    let dayTimeSlots = await dayTimeQuery.getRawMany();
                    dayTimeSlots = (0, underscore_1.mapObject)((0, underscore_1.groupBy)(dayTimeSlots, 'employeeId'), (values, employeeId) => {
                        const todayDuration = (0, underscore_1.reduce)((0, underscore_1.pluck)(values, 'today_duration'), utils_1.ArraySum, 0);
                        const todayPercentage = ((0, underscore_1.reduce)((0, underscore_1.pluck)(values, 'overall'), utils_1.ArraySum, 0) * 100) /
                            (0, underscore_1.reduce)((0, underscore_1.pluck)(values, 'duration'), utils_1.ArraySum, 0);
                        return {
                            employeeId,
                            duration: todayDuration,
                            overall: todayPercentage
                        };
                    });
                    dayTimeSlots = (0, underscore_1.chain)(dayTimeSlots)
                        .map((dayTimeSlot) => {
                        if (dayTimeSlot && dayTimeSlot.overall) {
                            dayTimeSlot.overall = parseFloat(dayTimeSlot.overall).toFixed(1);
                        }
                        return dayTimeSlot;
                    })
                        .indexBy('employeeId')
                        .value();
                    // Batch-load User entities so subscribers resolve fresh presigned URLs
                    const memberUserIds = employees.map((e) => e.user_id).filter(Boolean);
                    const userMap = await this._userService.findUsersByIds(memberUserIds);
                    for (let index = 0; index < employees.length; index++) {
                        const member = employees[index];
                        member.weekTime = weekTimeSlots[member.id];
                        member.todayTime = dayTimeSlots[member.id];
                        const user = userMap.get(member.user_id);
                        if (!user) {
                            this.logger.warn(`User not found for member id=${member.id}, user_id=${member.user_id}. findUsersByIds returned no match.`);
                        }
                        member.user = {
                            name: user?.name ?? null,
                            imageUrl: user?.imageUrl ?? null
                        };
                        delete member.user_id;
                        const weekHoursQuery = this.typeOrmEmployeeRepository.createQueryBuilder();
                        weekHoursQuery
                            .innerJoin(`${weekHoursQuery.alias}.timeLogs`, 'timeLogs')
                            .innerJoin(`timeLogs.timeSlots`, 'time_slot')
                            .select((0, statistic_helper_1.getTotalDurationQueryString)(dbType, 'timeLogs'), `duration`)
                            .addSelect(
                        // -- why we minus 1 if MySQL is selected, Sunday DOW in postgres is 0, in MySQL is 1
                        // -- in case no database type is selected we return "0" as the DOW
                        (0, config_1.isSqlite)() || (0, config_1.isBetterSqlite3)()
                            ? `(strftime('%w', timeLogs.startedAt))`
                            : (0, config_1.isPostgres)()
                                ? 'EXTRACT(DOW FROM "timeLogs"."startedAt")'
                                : (0, config_1.isMySQL)()
                                    ? (0, database_helper_1.prepareSQLQuery)('DayOfWeek("timeLogs"."startedAt") - 1')
                                    : '0', 'day')
                            .andWhere((0, database_helper_1.prepareSQLQuery)(`"${weekHoursQuery.alias}"."id" = :memberId`), { memberId: member.id })
                            .andWhere(new typeorm_1.Brackets((qb) => {
                            qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${weekHoursQuery.alias}"."tenantId" = :tenantId`), { tenantId });
                            qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${weekHoursQuery.alias}"."organizationId" = :organizationId`), {
                                organizationId
                            });
                        }))
                            .andWhere(new typeorm_1.Brackets((qb) => {
                            qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"timeLogs"."tenantId" = :tenantId`), { tenantId });
                            qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"timeLogs"."organizationId" = :organizationId`), { organizationId });
                        }))
                            .andWhere(new typeorm_1.Brackets((qb) => {
                            qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"timeLogs"."startedAt" BETWEEN :weeklyStart AND :weeklyEnd`), {
                                weeklyStart,
                                weeklyEnd
                            });
                            qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"time_slot"."startedAt" BETWEEN :weeklyStart AND :weeklyEnd`), {
                                weeklyStart,
                                weeklyEnd
                            });
                        }))
                            .andWhere(new typeorm_1.Brackets((qb) => {
                            if ((0, utils_1.isNotEmpty)(employeeIds)) {
                                qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"timeLogs"."employeeId" IN (:...employeeIds)`), { employeeIds });
                            }
                            if ((0, utils_1.isNotEmpty)(projectIds)) {
                                qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"timeLogs"."projectId" IN (:...projectIds)`), { projectIds });
                            }
                            if ((0, utils_1.isNotEmpty)(teamIds)) {
                                qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"timeLogs"."organizationTeamId" IN (:...teamIds)`), { teamIds });
                            }
                        }))
                            .addGroupBy((0, config_1.isSqlite)() || (0, config_1.isBetterSqlite3)()
                            ? `(strftime('%w', timeLogs.startedAt))`
                            : (0, config_1.isPostgres)()
                                ? 'EXTRACT(DOW FROM "timeLogs"."startedAt")'
                                : (0, config_1.isMySQL)()
                                    ? (0, database_helper_1.prepareSQLQuery)('DayOfWeek("timeLogs"."startedAt") - 1')
                                    : '0');
                        member.weekHours = await weekHoursQuery.getRawMany();
                    }
                }
                break;
            }
        }
        return employees;
    }
    /**
     * GET Time Tracking Dashboard Projects Statistics
     *
     * @param request
     * @returns
     */
    async getProjects(request) {
        const { organizationId, startDate, endDate } = request;
        let { employeeIds = [], projectIds = [], teamIds = [] } = request;
        const tenantId = context_1.RequestContext.currentTenantId() || request.tenantId;
        const { start, end } = (0, utils_2.getDateRangeFormat)(moment.utc(startDate || moment().startOf('week')), moment.utc(endDate || moment().endOf('week')));
        // Retrieves the database type from the configuration service.
        const dbType = this.configService.dbConnectionOptions.type;
        // Determine if the request specifies to retrieve data for the current user only
        const isOnlyMeSelected = request.onlyMe;
        // Filter employeeIds based on permissions and manager access
        employeeIds = await this._managedEmployeeService.filterAccessibleEmployeeIds(employeeIds, teamIds, projectIds, isOnlyMeSelected);
        let projects = [];
        switch (this.ormType) {
            case utils_2.MultiORMEnum.MikroORM: {
                // MikroORM: Use Knex for raw SQL aggregation with DB-type-specific duration calculation
                const knex = this.mikroOrmTimeLogRepository.getKnex();
                // Build DB-type-specific duration query string (with COUNT division)
                let durationExpr;
                switch (dbType) {
                    case config_1.DatabaseTypeEnum.sqlite:
                    case config_1.DatabaseTypeEnum.betterSqlite3:
                        durationExpr = `COALESCE(ROUND(SUM((julianday(COALESCE("time_log"."stoppedAt", datetime('now'))) - julianday("time_log"."startedAt")) * 86400) / COUNT("time_slot"."id")), 0)`;
                        break;
                    case config_1.DatabaseTypeEnum.postgres:
                        durationExpr = `COALESCE(ROUND(SUM(extract(epoch from (COALESCE("time_log"."stoppedAt", NOW()) - "time_log"."startedAt"))) / COUNT("time_slot"."id")), 0)`;
                        break;
                    case config_1.DatabaseTypeEnum.mysql:
                        durationExpr = (0, database_helper_1.prepareSQLQuery)(`COALESCE(ROUND(SUM(TIMESTAMPDIFF(SECOND, "time_log"."startedAt", COALESCE("time_log"."stoppedAt", NOW()))) / COUNT("time_slot"."id")), 0)`);
                        break;
                    default:
                        throw Error(`cannot create statistic query due to unsupported database type: ${dbType}`);
                }
                // Query 1: Duration per time_log grouped by time_log.id + project.id
                let qb = knex('time_log')
                    .innerJoin('organization_project as project', 'time_log.projectId', 'project.id')
                    .innerJoin('time_slot_time_logs', 'time_log.id', 'time_slot_time_logs.timeLogId')
                    .innerJoin('time_slot', 'time_slot_time_logs.timeSlotId', 'time_slot.id')
                    .select([
                    'project.name as name',
                    'project.id as projectId',
                    knex.raw(`${durationExpr} as duration`)
                ])
                    .whereBetween('time_log.startedAt', [start, end])
                    .whereBetween('time_slot.startedAt', [start, end])
                    .andWhere('time_log.tenantId', tenantId)
                    .andWhere('time_log.organizationId', organizationId)
                    .andWhere('time_slot.tenantId', tenantId)
                    .andWhere('time_slot.organizationId', organizationId)
                    .groupBy('time_log.id')
                    .groupBy('project.id')
                    .orderBy('duration', 'DESC');
                if ((0, utils_1.isNotEmpty)(employeeIds)) {
                    qb = qb.whereIn('time_log.employeeId', employeeIds).whereIn('time_slot.employeeId', employeeIds);
                }
                if ((0, utils_1.isNotEmpty)(projectIds)) {
                    qb = qb.whereIn('time_log.projectId', projectIds).whereIn('project.id', projectIds);
                }
                if ((0, utils_1.isNotEmpty)(teamIds)) {
                    qb = qb.whereIn('time_log.organizationTeamId', teamIds);
                }
                let statistics = await qb;
                // Post-process: group by projectId and sum durations, take top 5
                projects = (0, underscore_1.chain)(statistics)
                    .groupBy('projectId')
                    .map((projects, projectId) => {
                    const [project] = projects;
                    return {
                        name: project.name,
                        id: projectId,
                        duration: (0, underscore_1.reduce)((0, underscore_1.pluck)(projects, 'duration'), utils_1.ArraySum, 0)
                    };
                })
                    .value()
                    .splice(0, 5);
                // Query 2: Total duration (without COUNT division) for percentage calculation
                let totalDurationExpr;
                switch (dbType) {
                    case config_1.DatabaseTypeEnum.sqlite:
                    case config_1.DatabaseTypeEnum.betterSqlite3:
                        totalDurationExpr = `COALESCE(ROUND(SUM((julianday(COALESCE("time_log"."stoppedAt", datetime('now'))) - julianday("time_log"."startedAt")) * 86400)), 0)`;
                        break;
                    case config_1.DatabaseTypeEnum.postgres:
                        totalDurationExpr = `COALESCE(ROUND(SUM(extract(epoch from (COALESCE("time_log"."stoppedAt", NOW()) - "time_log"."startedAt")))), 0)`;
                        break;
                    case config_1.DatabaseTypeEnum.mysql:
                        totalDurationExpr = (0, database_helper_1.prepareSQLQuery)(`COALESCE(ROUND(SUM(TIMESTAMPDIFF(SECOND, "time_log"."startedAt", COALESCE("time_log"."stoppedAt", NOW())))), 0)`);
                        break;
                    default:
                        throw Error(`cannot create statistic query due to unsupported database type: ${dbType}`);
                }
                let totalQb = knex('time_log')
                    .innerJoin('organization_project as project', 'time_log.projectId', 'project.id')
                    .select(knex.raw(`${totalDurationExpr} as duration`))
                    .whereBetween('time_log.startedAt', [start, end])
                    .andWhere('time_log.tenantId', tenantId)
                    .andWhere('time_log.organizationId', organizationId);
                if ((0, utils_1.isNotEmpty)(employeeIds)) {
                    totalQb = totalQb.whereIn('time_log.employeeId', employeeIds);
                }
                if ((0, utils_1.isNotEmpty)(projectIds)) {
                    totalQb = totalQb.whereIn('time_log.projectId', projectIds).whereIn('project.id', projectIds);
                }
                if ((0, utils_1.isNotEmpty)(teamIds)) {
                    totalQb = totalQb.whereIn('time_log.organizationTeamId', teamIds);
                }
                const totalDuration = await totalQb.first();
                projects = projects.map((project) => {
                    project.durationPercentage = parseFloat(parseFloat((project.duration * 100) / totalDuration.duration + '').toFixed(2));
                    return project;
                });
                break;
            }
            case utils_2.MultiORMEnum.TypeORM:
            default: {
                const query = this.typeOrmTimeLogRepository.createQueryBuilder('time_log');
                let queryString;
                switch (dbType) {
                    case config_1.DatabaseTypeEnum.sqlite:
                    case config_1.DatabaseTypeEnum.betterSqlite3:
                        queryString = `COALESCE(ROUND(SUM((julianday(COALESCE("${query.alias}"."stoppedAt", datetime('now'))) - julianday("${query.alias}"."startedAt")) * 86400) / COUNT("time_slot"."id")), 0)`;
                        break;
                    case config_1.DatabaseTypeEnum.postgres:
                        queryString = `COALESCE(ROUND(SUM(extract(epoch from (COALESCE("${query.alias}"."stoppedAt", NOW()) - "${query.alias}"."startedAt"))) / COUNT("time_slot"."id")), 0)`;
                        break;
                    case config_1.DatabaseTypeEnum.mysql:
                        queryString = (0, database_helper_1.prepareSQLQuery)(`COALESCE(ROUND(SUM(TIMESTAMPDIFF(SECOND, "${query.alias}"."startedAt", COALESCE("${query.alias}"."stoppedAt", NOW()))) / COUNT("time_slot"."id")), 0)`);
                        break;
                    default:
                        throw Error(`cannot create statistic query due to unsupported database type: ${dbType}`);
                }
                query
                    .select((0, database_helper_1.prepareSQLQuery)(`"project"."name"`), 'name')
                    .addSelect((0, database_helper_1.prepareSQLQuery)(`"project"."id"`), 'projectId')
                    .addSelect(queryString, `duration`)
                    .innerJoin(`${query.alias}.project`, 'project')
                    .innerJoin(`${query.alias}.timeSlots`, 'time_slot')
                    .andWhere(new typeorm_1.Brackets((qb) => {
                    qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."startedAt" BETWEEN :start AND :end`), {
                        start,
                        end
                    });
                    qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"time_slot"."startedAt" BETWEEN :start AND :end`), {
                        start,
                        end
                    });
                }))
                    .andWhere(new typeorm_1.Brackets((qb) => {
                    qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."tenantId" = :tenantId`), { tenantId });
                    qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."organizationId" = :organizationId`), { organizationId });
                }))
                    .andWhere(new typeorm_1.Brackets((qb) => {
                    qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"time_slot"."tenantId" = :tenantId`), { tenantId });
                    qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"time_slot"."organizationId" = :organizationId`), { organizationId });
                }))
                    .andWhere(new typeorm_1.Brackets((qb) => {
                    if ((0, utils_1.isNotEmpty)(employeeIds)) {
                        qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."employeeId" IN (:...employeeIds)`), {
                            employeeIds
                        });
                        qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"time_slot"."employeeId" IN (:...employeeIds)`), {
                            employeeIds
                        });
                    }
                    if ((0, utils_1.isNotEmpty)(projectIds)) {
                        qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."projectId" IN (:...projectIds)`), {
                            projectIds
                        });
                        qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"project"."id" IN (:...projectIds)`), {
                            projectIds
                        });
                    }
                    if ((0, utils_1.isNotEmpty)(teamIds)) {
                        qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."organizationTeamId" IN (:...teamIds)`), { teamIds });
                    }
                }))
                    .groupBy((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."id"`))
                    .addGroupBy((0, database_helper_1.prepareSQLQuery)(`"project"."id"`))
                    .orderBy('duration', 'DESC');
                let statistics = await query.getRawMany();
                projects = (0, underscore_1.chain)(statistics)
                    .groupBy('projectId')
                    .map((projects, projectId) => {
                    const [project] = projects;
                    return {
                        name: project.name,
                        id: projectId,
                        duration: (0, underscore_1.reduce)((0, underscore_1.pluck)(projects, 'duration'), utils_1.ArraySum, 0)
                    };
                })
                    .value()
                    .splice(0, 5);
                const totalDurationQuery = this.typeOrmTimeLogRepository.createQueryBuilder('time_log');
                let totalDurationQueryString;
                switch (dbType) {
                    case config_1.DatabaseTypeEnum.sqlite:
                    case config_1.DatabaseTypeEnum.betterSqlite3:
                        totalDurationQueryString = `COALESCE(ROUND(SUM((julianday(COALESCE("${totalDurationQuery.alias}"."stoppedAt", datetime('now'))) - julianday("${totalDurationQuery.alias}"."startedAt")) * 86400)), 0)`;
                        break;
                    case config_1.DatabaseTypeEnum.postgres:
                        totalDurationQueryString = `COALESCE(ROUND(SUM(extract(epoch from (COALESCE("${totalDurationQuery.alias}"."stoppedAt", NOW()) - "${totalDurationQuery.alias}"."startedAt")))), 0)`;
                        break;
                    case config_1.DatabaseTypeEnum.mysql:
                        totalDurationQueryString = (0, database_helper_1.prepareSQLQuery)(`COALESCE(ROUND(SUM(TIMESTAMPDIFF(SECOND, "${totalDurationQuery.alias}"."startedAt", COALESCE("${totalDurationQuery.alias}"."stoppedAt", NOW())))), 0)`);
                        break;
                    default:
                        throw Error(`cannot create statistic query due to unsupported database type: ${dbType}`);
                }
                totalDurationQuery
                    .select(totalDurationQueryString, `duration`)
                    .innerJoin(`${totalDurationQuery.alias}.project`, 'project')
                    .andWhere(new typeorm_1.Brackets((qb) => {
                    qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${totalDurationQuery.alias}"."startedAt" BETWEEN :start AND :end`), {
                        start,
                        end
                    });
                }))
                    .andWhere(new typeorm_1.Brackets((qb) => {
                    qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${totalDurationQuery.alias}"."tenantId" = :tenantId`), { tenantId });
                    qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${totalDurationQuery.alias}"."organizationId" = :organizationId`), {
                        organizationId
                    });
                }))
                    .andWhere(new typeorm_1.Brackets((qb) => {
                    if ((0, utils_1.isNotEmpty)(employeeIds)) {
                        qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${totalDurationQuery.alias}"."employeeId" IN (:...employeeIds)`), {
                            employeeIds
                        });
                    }
                    if ((0, utils_1.isNotEmpty)(projectIds)) {
                        qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${totalDurationQuery.alias}"."projectId" IN (:...projectIds)`), {
                            projectIds
                        });
                        qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"project"."id" IN (:...projectIds)`), {
                            projectIds
                        });
                    }
                    if ((0, utils_1.isNotEmpty)(teamIds)) {
                        qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${totalDurationQuery.alias}"."organizationTeamId" IN (:...teamIds)`), {
                            teamIds
                        });
                    }
                }));
                const totalDuration = await totalDurationQuery.getRawOne();
                projects = projects.map((project) => {
                    project.durationPercentage = parseFloat(parseFloat((project.duration * 100) / totalDuration.duration + '').toFixed(2));
                    return project;
                });
                break;
            }
        }
        return projects || [];
    }
    /**
     * GET Time Tracking Dashboard Tasks Statistics
     *
     * @param request
     * @returns
     */
    async getTasks(request) {
        const { organizationId, startDate, endDate, take, onlyMe = false, organizationTeamId } = request;
        const { projectIds = [], taskIds = [], teamIds = [], defaultRange, unitOfTime } = request;
        let { employeeIds = [], todayEnd, todayStart } = request;
        const user = context_1.RequestContext.currentUser();
        const tenantId = context_1.RequestContext.currentTenantId() || request.tenantId;
        let start;
        let end;
        if (startDate && endDate) {
            const range = (0, utils_2.getDateRangeFormat)(moment.utc(startDate), moment.utc(endDate));
            start = range.start;
            end = range.end;
        }
        else if (defaultRange) {
            const unit = unitOfTime || 'week';
            const range = (0, utils_2.getDateRangeFormat)(moment().startOf(unit).utc(), moment().endOf(unit).utc());
            start = range.start;
            end = range.end;
        }
        // Set employeeIds based on permissions and request
        // Special handling for getTasks: if organizationTeamId or ORG_MEMBER_LAST_LOG_VIEW permission exists,
        // allow empty employeeIds to fetch all team members
        if (user &&
            user.employeeId &&
            !context_1.RequestContext.hasPermission(contracts_1.PermissionsEnum.CHANGE_SELECTED_EMPLOYEE) &&
            !onlyMe &&
            !(0, utils_1.isNotEmpty)(employeeIds) &&
            ((0, utils_1.isNotEmpty)(organizationTeamId) || context_1.RequestContext.hasPermission(contracts_1.PermissionsEnum.ORG_MEMBER_LAST_LOG_VIEW))) {
            // Special case: Keep empty employeeIds to fetch all team members
            // This will be filtered by organizationTeamId in the query
        }
        else {
            // Standard filtering using ManagedEmployeeService
            employeeIds = await this._managedEmployeeService.filterAccessibleEmployeeIds(employeeIds, teamIds, [], // projectIds
            onlyMe);
        }
        if (todayStart && todayEnd) {
            const range = (0, utils_2.getDateRangeFormat)(moment.utc(todayStart), moment.utc(todayEnd));
            todayStart = range.start;
            todayEnd = range.end;
        }
        else if (defaultRange) {
            const unit = unitOfTime || 'day';
            const range = (0, utils_2.getDateRangeFormat)(moment().startOf(unit).utc(), moment().endOf(unit).utc());
            todayStart = range.start;
            todayEnd = range.end;
        }
        // Retrieves the database type from the configuration service.
        const dbType = this.configService.dbConnectionOptions.type;
        let todayStatistics = [];
        /**
         * Get Today's Task Statistics
         */
        switch (this.ormType) {
            case utils_2.MultiORMEnum.MikroORM:
                {
                    // Start building the MikroORM query
                    const qb = this.mikroOrmTimeLogRepository.createQueryBuilder('time_log');
                    const knex = this.mikroOrmTimeLogRepository.getKnex();
                    // Add the raw SQL snippet to the select
                    const raw = (0, statistic_helper_1.getDurationQueryString)(dbType, qb.alias, 'time_slot');
                    // Constructs SQL query to fetch task title, ID, last updated timestamp, and today's duration.
                    let sq = knex(qb.alias).select([
                        `task.title AS title`,
                        `task.id AS taskId`,
                        `${qb.alias}.updatedAt AS updatedAt`,
                        knex.raw(`${raw} AS today_duration`)
                    ]);
                    // Add join clauses
                    sq.innerJoin('task', `${qb.alias}.taskId`, 'task.id');
                    sq.innerJoin('time_slot_time_logs', `${qb.alias}.id`, 'time_slot_time_logs.timeLogId');
                    sq.innerJoin('time_slot', 'time_slot_time_logs.timeSlotId', 'time_slot.id');
                    // Add where clauses
                    sq.andWhere({
                        [`${qb.alias}.tenantId`]: tenantId,
                        [`${qb.alias}.organizationId`]: organizationId,
                        [`time_slot.tenantId`]: tenantId,
                        [`time_slot.organizationId`]: organizationId
                    });
                    if (todayStart && todayEnd) {
                        sq.whereBetween(`${qb.alias}.startedAt`, [todayStart, todayEnd]);
                        sq.whereBetween(`time_slot.startedAt`, [todayStart, todayEnd]);
                    }
                    if ((0, utils_1.isNotEmpty)(employeeIds)) {
                        sq.whereIn(`${qb.alias}.employeeId`, employeeIds);
                        sq.whereIn(`time_slot.employeeId`, employeeIds);
                    }
                    if ((0, utils_1.isNotEmpty)(projectIds)) {
                        sq.whereIn(`${qb.alias}.projectId`, projectIds);
                    }
                    if ((0, utils_1.isNotEmpty)(taskIds)) {
                        sq.whereIn(`${qb.alias}.taskId`, taskIds);
                    }
                    if ((0, utils_1.isNotEmpty)(organizationTeamId) || (0, utils_1.isNotEmpty)(teamIds)) {
                        sq.andWhere(function () {
                            if ((0, utils_1.isNotEmpty)(organizationTeamId)) {
                                this.orWhere(`${qb.alias}.organizationTeamId`, '=', organizationTeamId);
                            }
                            if ((0, utils_1.isNotEmpty)(teamIds)) {
                                this.orWhereIn(`${qb.alias}.organizationTeamId`, teamIds);
                            }
                        });
                    }
                    sq.groupBy([`${qb.alias}.id`, 'task.id']); // Apply multiple group by clauses in a single statement
                    sq.orderBy(`${qb.alias}.updatedAt`, 'desc'); // Apply order by clause
                    (0, logger_1.debugInDevelopment)(this.logger, () => `${sq.toString()} || Get Today Statistics Query MikroORM`);
                    // Execute the raw SQL query and get the results
                    todayStatistics = (await knex.raw(sq.toString())).rows || [];
                }
                break;
            case utils_2.MultiORMEnum.TypeORM:
                {
                    const qb = this.typeOrmTimeLogRepository.createQueryBuilder('time_log');
                    qb.select((0, database_helper_1.prepareSQLQuery)(`"task"."title"`), 'title');
                    qb.addSelect((0, database_helper_1.prepareSQLQuery)(`"task"."id"`), 'taskId');
                    qb.addSelect((0, database_helper_1.prepareSQLQuery)(`"${qb.alias}"."updatedAt"`), 'updatedAt');
                    qb.addSelect((0, statistic_helper_1.getDurationQueryString)(dbType, qb.alias, 'time_slot'), `today_duration`);
                    // Add join clauses
                    qb.innerJoin(`${qb.alias}.task`, 'task');
                    qb.innerJoin(`${qb.alias}.timeSlots`, 'time_slot');
                    // Combine tenant and organization ID conditions
                    qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${qb.alias}"."tenantId" = :tenantId AND "${qb.alias}"."organizationId" = :organizationId`), { tenantId, organizationId });
                    qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"time_slot"."tenantId" = :tenantId AND "time_slot"."organizationId" = :organizationId`), { tenantId, organizationId });
                    // Add conditions based on today's start and end time
                    if (todayStart && todayEnd) {
                        qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${qb.alias}"."startedAt" BETWEEN :todayStart AND :todayEnd`), {
                            todayStart,
                            todayEnd
                        });
                        qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"time_slot"."startedAt" BETWEEN :todayStart AND :todayEnd`), {
                            todayStart,
                            todayEnd
                        });
                    }
                    if ((0, utils_1.isNotEmpty)(employeeIds)) {
                        qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${qb.alias}"."employeeId" IN (:...employeeIds)`), { employeeIds });
                        qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"time_slot"."employeeId" IN (:...employeeIds)`), { employeeIds });
                    }
                    if ((0, utils_1.isNotEmpty)(projectIds)) {
                        qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${qb.alias}"."projectId" IN (:...projectIds)`), { projectIds });
                    }
                    if ((0, utils_1.isNotEmpty)(taskIds)) {
                        qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${qb.alias}"."taskId" IN (:...taskIds)`), { taskIds });
                    }
                    if ((0, utils_1.isNotEmpty)(organizationTeamId) || (0, utils_1.isNotEmpty)(teamIds)) {
                        qb.andWhere(new typeorm_1.Brackets((web) => {
                            if ((0, utils_1.isNotEmpty)(organizationTeamId)) {
                                web.orWhere(`${qb.alias}.organizationTeamId = :organizationTeamId`, {
                                    organizationTeamId
                                });
                            }
                            if ((0, utils_1.isNotEmpty)(teamIds)) {
                                web.orWhere(`${qb.alias}.organizationTeamId IN (:...teamIds)`, { teamIds });
                            }
                        }));
                    }
                    qb.groupBy((0, database_helper_1.prepareSQLQuery)(`"${qb.alias}"."id"`));
                    qb.addGroupBy((0, database_helper_1.prepareSQLQuery)(`"task"."id"`));
                    qb.orderBy((0, database_helper_1.prepareSQLQuery)(`"${qb.alias}"."updatedAt"`), 'DESC');
                    (0, logger_1.debugInDevelopment)(this.logger, () => `${qb.getQuery()} || Get Today Statistics Query TypeORM`);
                    // Execute the SQL query and get the results
                    todayStatistics = await qb.getRawMany();
                }
                break;
            default:
                throw new Error(`Cannot create statistic query due to unsupported database type: ${dbType}`);
        }
        let statistics = [];
        /**
         * Get Given Time Frame Task Statistics
         */
        switch (this.ormType) {
            case utils_2.MultiORMEnum.MikroORM:
                {
                    // Start building the MikroORM query
                    const qb = this.mikroOrmTimeLogRepository.createQueryBuilder('time_log');
                    const knex = this.mikroOrmTimeLogRepository.getKnex();
                    // Add the raw SQL snippet to the select
                    const raw = (0, statistic_helper_1.getDurationQueryString)(dbType, qb.alias, 'time_slot');
                    // Constructs SQL query to fetch task title, ID, last updated timestamp, and today's duration.
                    let sq = knex(qb.alias).select([
                        `task.title AS title`,
                        `task.id AS taskId`,
                        `${qb.alias}.updatedAt AS updatedAt`,
                        knex.raw(`${raw} AS duration`)
                    ]);
                    // Add join clauses
                    sq.innerJoin('task', `${qb.alias}.taskId`, 'task.id');
                    sq.innerJoin('time_slot_time_logs', `${qb.alias}.id`, 'time_slot_time_logs.timeLogId');
                    sq.innerJoin('time_slot', 'time_slot_time_logs.timeSlotId', 'time_slot.id');
                    // Add where clauses
                    sq.andWhere({
                        [`${qb.alias}.tenantId`]: tenantId,
                        [`${qb.alias}.organizationId`]: organizationId,
                        [`time_slot.tenantId`]: tenantId,
                        [`time_slot.organizationId`]: organizationId
                    });
                    if (start && end) {
                        sq.whereBetween(`${qb.alias}.startedAt`, [start, end]);
                        sq.whereBetween(`time_slot.startedAt`, [start, end]);
                    }
                    if ((0, utils_1.isNotEmpty)(employeeIds)) {
                        sq.whereIn(`${qb.alias}.employeeId`, employeeIds);
                        sq.whereIn(`time_slot.employeeId`, employeeIds);
                    }
                    if ((0, utils_1.isNotEmpty)(projectIds)) {
                        sq.whereIn(`${qb.alias}.projectId`, projectIds);
                    }
                    if ((0, utils_1.isNotEmpty)(taskIds)) {
                        sq.whereIn(`${qb.alias}.taskId`, taskIds);
                    }
                    if ((0, utils_1.isNotEmpty)(organizationTeamId) || (0, utils_1.isNotEmpty)(teamIds)) {
                        sq.andWhere(function () {
                            if ((0, utils_1.isNotEmpty)(organizationTeamId)) {
                                this.orWhere(`${qb.alias}.organizationTeamId`, '=', organizationTeamId);
                            }
                            if ((0, utils_1.isNotEmpty)(teamIds)) {
                                this.orWhereIn(`${qb.alias}.organizationTeamId`, teamIds);
                            }
                        });
                    }
                    sq.groupBy([`${qb.alias}.id`, 'task.id']); // Apply multiple group by clauses in a single statement
                    sq.orderBy(`${qb.alias}.updatedAt`, 'desc'); // Apply order by clause
                    (0, logger_1.debugInDevelopment)(this.logger, () => `${sq.toString()} || Get Statistics Query MikroORM`);
                    // Execute the raw SQL query and get the results
                    statistics = (await knex.raw(sq.toString())).rows || [];
                }
                break;
            case utils_2.MultiORMEnum.TypeORM:
                {
                    /**
                     * Get Time Range Statistics
                     */
                    const qb = this.typeOrmTimeLogRepository.createQueryBuilder('time_log');
                    qb.select((0, database_helper_1.prepareSQLQuery)(`"task"."title"`), 'title');
                    qb.addSelect((0, database_helper_1.prepareSQLQuery)(`"task"."id"`), 'taskId');
                    qb.addSelect((0, database_helper_1.prepareSQLQuery)(`"${qb.alias}"."updatedAt"`), 'updatedAt');
                    qb.addSelect((0, statistic_helper_1.getDurationQueryString)(dbType, qb.alias, 'time_slot'), `duration`);
                    // Add join clauses
                    qb.innerJoin(`${qb.alias}.task`, 'task');
                    qb.innerJoin(`${qb.alias}.timeSlots`, 'time_slot');
                    // Add join clauses
                    // Combine tenant and organization ID conditions for qb.alias
                    qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${qb.alias}"."tenantId" = :tenantId AND "${qb.alias}"."organizationId" = :organizationId`), { tenantId, organizationId });
                    // Combine tenant and organization ID conditions for time_slot
                    qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"time_slot"."tenantId" = :tenantId AND "time_slot"."organizationId" = :organizationId`), { tenantId, organizationId });
                    // Add conditions based on start and end time
                    if (start && end) {
                        qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${qb.alias}"."startedAt" BETWEEN :start AND :end`), { start, end });
                        qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"time_slot"."startedAt" BETWEEN :start AND :end`), { start, end });
                    }
                    if ((0, utils_1.isNotEmpty)(employeeIds)) {
                        qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${qb.alias}"."employeeId" IN (:...employeeIds) AND "time_slot"."employeeId" IN (:...employeeIds)`), { employeeIds });
                    }
                    if ((0, utils_1.isNotEmpty)(projectIds)) {
                        qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${qb.alias}"."projectId" IN (:...projectIds)`), { projectIds });
                    }
                    if ((0, utils_1.isNotEmpty)(taskIds)) {
                        qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${qb.alias}"."taskId" IN (:...taskIds)`), { taskIds });
                    }
                    if ((0, utils_1.isNotEmpty)(organizationTeamId) || (0, utils_1.isNotEmpty)(teamIds)) {
                        qb.andWhere(new typeorm_1.Brackets((web) => {
                            if ((0, utils_1.isNotEmpty)(organizationTeamId)) {
                                web.orWhere(`${qb.alias}.organizationTeamId = :organizationTeamId`, {
                                    organizationTeamId
                                });
                            }
                            if ((0, utils_1.isNotEmpty)(teamIds)) {
                                web.orWhere(`${qb.alias}.organizationTeamId IN (:...teamIds)`, { teamIds });
                            }
                        }));
                    }
                    qb.groupBy((0, database_helper_1.prepareSQLQuery)(`"${qb.alias}"."id"`));
                    qb.addGroupBy((0, database_helper_1.prepareSQLQuery)(`"task"."id"`));
                    qb.orderBy((0, database_helper_1.prepareSQLQuery)(`"${qb.alias}"."updatedAt"`), 'DESC');
                    (0, logger_1.debugInDevelopment)(this.logger, () => `${JSON.stringify(qb.getQueryAndParameters())} || Get Statistics Query TypeORM`);
                    // Execute the raw SQL query and get the results
                    statistics = await qb.getRawMany();
                }
                break;
            default:
                throw new Error(`Cannot create statistic query due to unsupported database type: ${dbType}`);
        }
        let totalDuration;
        /**
         * Get Total Task Statistics
         */
        switch (this.ormType) {
            case utils_2.MultiORMEnum.MikroORM:
                {
                    const qb = this.mikroOrmTimeLogRepository.createQueryBuilder('time_log');
                    const knex = this.mikroOrmTimeLogRepository.getKnex();
                    // Add the raw SQL snippet to the select
                    const raw = (0, statistic_helper_1.getTotalDurationQueryString)(dbType, qb.alias);
                    // Construct your SQL query using knex
                    let sq = knex(qb.alias).select([knex.raw(`${raw} AS duration`)]);
                    // Add join clauses
                    sq.innerJoin('task', `${qb.alias}.taskId`, 'task.id');
                    sq.innerJoin('time_slot_time_logs', `${qb.alias}.id`, 'time_slot_time_logs.timeLogId');
                    sq.innerJoin('time_slot', 'time_slot_time_logs.timeSlotId', 'time_slot.id');
                    // Add where clauses
                    sq.andWhere({
                        [`${qb.alias}.tenantId`]: tenantId,
                        [`${qb.alias}.organizationId`]: organizationId
                    });
                    if (start && end) {
                        sq.whereBetween(`${qb.alias}.startedAt`, [start, end]);
                    }
                    if ((0, utils_1.isNotEmpty)(employeeIds)) {
                        sq.whereIn(`${qb.alias}.employeeId`, employeeIds);
                    }
                    if ((0, utils_1.isNotEmpty)(projectIds)) {
                        sq.whereIn(`${qb.alias}.projectId`, projectIds);
                    }
                    if ((0, utils_1.isNotEmpty)(organizationTeamId) || (0, utils_1.isNotEmpty)(teamIds)) {
                        sq.andWhere(function () {
                            if ((0, utils_1.isNotEmpty)(organizationTeamId)) {
                                this.orWhere(`${qb.alias}.organizationTeamId`, '=', organizationTeamId);
                            }
                            if ((0, utils_1.isNotEmpty)(teamIds)) {
                                this.orWhereIn(`${qb.alias}.organizationTeamId`, teamIds);
                            }
                        });
                    }
                    (0, logger_1.debugInDevelopment)(this.logger, () => `${sq.toString()} || Get Total Duration Query MikroORM`);
                    // Execute the raw SQL query and get the results
                    [totalDuration] = (await knex.raw(sq.toString())).rows || [];
                }
                break;
            case utils_2.MultiORMEnum.TypeORM:
                {
                    const qb = this.typeOrmTimeLogRepository.createQueryBuilder('time_log');
                    qb.select((0, statistic_helper_1.getTotalDurationQueryString)(dbType, qb.alias), 'duration');
                    // Add join clauses
                    qb.innerJoin(`${qb.alias}.task`, 'task');
                    // Add where clauses
                    qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${qb.alias}"."tenantId" = :tenantId`), { tenantId });
                    qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${qb.alias}"."organizationId" = :organizationId`), { organizationId });
                    if (start && end) {
                        qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${qb.alias}"."startedAt" BETWEEN :start AND :end`), { start, end });
                    }
                    if ((0, utils_1.isNotEmpty)(employeeIds)) {
                        qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${qb.alias}"."employeeId" IN (:...employeeIds)`), { employeeIds });
                    }
                    if ((0, utils_1.isNotEmpty)(projectIds)) {
                        qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${qb.alias}"."projectId" IN (:...projectIds)`), { projectIds });
                    }
                    if ((0, utils_1.isNotEmpty)(organizationTeamId) || (0, utils_1.isNotEmpty)(teamIds)) {
                        qb.andWhere(new typeorm_1.Brackets((web) => {
                            if ((0, utils_1.isNotEmpty)(organizationTeamId)) {
                                web.orWhere(`${qb.alias}.organizationTeamId = :organizationTeamId`, {
                                    organizationTeamId
                                });
                            }
                            if ((0, utils_1.isNotEmpty)(teamIds)) {
                                web.orWhere(`${qb.alias}.organizationTeamId IN (:...teamIds)`, { teamIds });
                            }
                        }));
                    }
                    (0, logger_1.debugInDevelopment)(this.logger, () => `${qb.getQuery()} || Get Total Duration Query TypeORM`);
                    // Execute the raw SQL query and get the results
                    totalDuration = await qb.getRawOne();
                }
                break;
            default:
                throw new Error(`Cannot create statistic query due to unsupported database type: ${dbType}`);
        }
        // ------------------------------------------------
        (0, logger_1.debugInDevelopment)(this.logger, () => `Find Statistics length: ${statistics.length}, Today Statistics length: ${todayStatistics.length}, Total Duration: ${totalDuration?.duration}`);
        /* Code that cause issues... We try to optimize it using "hashing" approach etc

        const mergedStatistics = _.map(statistics, (statistic) => {
            const updatedAt = String(statistic.updatedAt);
            return _.extend(
                {
                    today_duration: 0,
                    ...statistic,
                    updatedAt
                },
                _.findWhere(
                    todayStatistics.map((today) => ({
                        ...today,
                        updatedAt: String(today.updatedAt)
                    })),
                    {
                        taskId: statistic.taskId,
                        updatedAt
                    }
                )
            );
        });

        let tasks: ITask[] = chain(mergedStatistics)
            .groupBy('taskId')
            .map((tasks: ITask[], taskId) => {
                const [task] = tasks;
                return {
                    title: task.title,
                    id: taskId,
                    duration: reduce(pluck(tasks, 'duration'), ArraySum, 0),
                    todayDuration: reduce(pluck(tasks, 'today_duration'), ArraySum, 0),
                    updatedAt: task.updatedAt
                } as ITask;
            })
            .value();

        if (isNotEmpty(take)) {
            tasks = tasks.splice(0, take);
        }

        tasks = tasks.map((task: any) => {
            task.durationPercentage = parseFloat(
                parseFloat((task.duration * 100) / totalDuration.duration + '').toFixed(2)
            );
            return task;
        });

        */
        const totalDurationValue = statistics.reduce((total, stat) => total + (parseInt(stat.duration, 10) || 0), 0);
        (0, logger_1.debugInDevelopment)(this.logger, () => `Total Duration Value: ${totalDurationValue}`);
        const todayStatsLookup = todayStatistics.reduce((acc, stat) => {
            const taskId = stat.taskId;
            if (!acc[taskId]) {
                acc[taskId] = { todayDuration: 0 };
            }
            acc[taskId].todayDuration += parseInt(stat.today_duration, 10) || 0;
            return acc;
        }, {});
        const taskAggregates = statistics.reduce((acc, stat) => {
            const taskId = stat.taskId;
            if (!acc[taskId]) {
                acc[taskId] = { duration: 0, todayDuration: 0, title: stat.title, updatedAt: stat.updatedAt };
            }
            // Convert stat.duration to a number before adding
            const durationToAdd = Number(stat.duration) || 0;
            // Sum durations as numbers
            acc[taskId].duration += durationToAdd;
            if (todayStatsLookup[taskId]) {
                acc[taskId].todayDuration = todayStatsLookup[taskId].todayDuration;
            }
            return acc;
        }, {});
        let tasks = Object.entries(taskAggregates).map(([taskId, agg]) => ({
            id: taskId,
            title: agg.title,
            duration: agg.duration,
            todayDuration: agg.todayDuration,
            updatedAt: agg.updatedAt
        }));
        tasks = tasks.map((task) => {
            const duration = parseInt(task.duration, 10);
            const todayDuration = parseInt(task.todayDuration, 10);
            // Update task with parsed numeric values
            task.duration = isNaN(duration) ? null : duration;
            task.todayDuration = isNaN(todayDuration) ? null : todayDuration;
            if (!isNaN(task.duration) && totalDurationValue !== 0) {
                task.durationPercentage = parseFloat(((task.duration * 100) / totalDurationValue).toFixed(2));
            }
            else {
                task.durationPercentage = 0;
            }
            return task;
        });
        if ((0, utils_1.isNotEmpty)(take)) {
            tasks = tasks.splice(0, take);
        }
        return tasks;
    }
    /**
     * GET Time Tracking Dashboard Manual Time Logs Statistics
     *
     * @param request
     * @returns
     */
    async manualTimes(request) {
        const { organizationId, startDate, endDate } = request;
        let { employeeIds = [], projectIds = [], teamIds = [] } = request;
        const tenantId = context_1.RequestContext.currentTenantId() || request.tenantId;
        const { start, end } = (0, utils_2.getDateRangeFormat)(moment.utc(startDate || moment().startOf('week')), moment.utc(endDate || moment().endOf('week')));
        // Determine if the request specifies to retrieve data for the current user only
        const isOnlyMeSelected = request.onlyMe;
        // Filter employeeIds based on permissions and manager access
        employeeIds = await this._managedEmployeeService.filterAccessibleEmployeeIds(employeeIds, teamIds, projectIds, isOnlyMeSelected);
        let timeLogs = [];
        switch (this.ormType) {
            case utils_2.MultiORMEnum.MikroORM: {
                // MikroORM: Use Knex to fetch top 5 MANUAL time logs with joins
                const knex = this.mikroOrmTimeLogRepository.getKnex();
                let qb = knex('time_log')
                    .innerJoin('time_slot_time_logs', 'time_log.id', 'time_slot_time_logs.timeLogId')
                    .innerJoin('time_slot', 'time_slot_time_logs.timeSlotId', 'time_slot.id')
                    .leftJoin('organization_project', 'time_log.projectId', 'organization_project.id')
                    .leftJoin('employee', 'time_log.employeeId', 'employee.id')
                    .leftJoin('user', 'employee.userId', 'user.id')
                    .select([
                    'time_log.id as id',
                    'time_log.startedAt as startedAt',
                    'time_log.duration as duration',
                    'time_log.employeeId as employeeId',
                    'user.firstName as user_firstName',
                    'user.lastName as user_lastName',
                    'user.imageUrl as user_imageUrl',
                    'organization_project.name as project_name',
                    'organization_project.imageUrl as project_imageUrl',
                    'employee.id as employee_id'
                ])
                    .where('time_log.logType', contracts_1.TimeLogType.MANUAL)
                    .andWhere('time_log.tenantId', tenantId)
                    .andWhere('time_log.organizationId', organizationId)
                    .whereBetween('time_log.startedAt', [start, end])
                    .andWhere('time_slot.tenantId', tenantId)
                    .andWhere('time_slot.organizationId', organizationId)
                    .whereBetween('time_slot.startedAt', [start, end]);
                if ((0, utils_1.isNotEmpty)(employeeIds)) {
                    qb = qb.whereIn('time_log.employeeId', employeeIds);
                }
                if ((0, utils_1.isNotEmpty)(projectIds)) {
                    qb = qb.whereIn('time_log.projectId', projectIds);
                }
                if ((0, utils_1.isNotEmpty)(teamIds)) {
                    qb = qb.whereIn('time_log.organizationTeamId', teamIds);
                }
                const rows = await qb.orderBy('time_log.startedAt', 'DESC').limit(5);
                timeLogs = rows.map((row) => ({
                    id: row.id,
                    startedAt: row.startedAt,
                    duration: row.duration,
                    user: {
                        name: `${row.user_firstName || ''} ${row.user_lastName || ''}`.trim(),
                        imageUrl: row.user_imageUrl
                    },
                    project: { name: row.project_name, imageUrl: row.project_imageUrl },
                    employeeId: row.employee_id,
                    employee: { id: row.employee_id }
                }));
                break;
            }
            case utils_2.MultiORMEnum.TypeORM:
            default: {
                const query = this.typeOrmTimeLogRepository.createQueryBuilder('time_log');
                query.innerJoin(`${query.alias}.timeSlots`, 'timeSlots');
                query.leftJoinAndSelect(`${query.alias}.project`, 'project');
                query.leftJoinAndSelect(`${query.alias}.employee`, 'employee');
                query.leftJoinAndSelect(`employee.user`, 'user');
                query.setFindOptions({
                    take: 5,
                    order: {
                        startedAt: 'DESC'
                    }
                });
                query.where((qb) => {
                    qb.andWhere(new typeorm_1.Brackets((web) => {
                        web.andWhere((0, database_helper_1.prepareSQLQuery)(`"${qb.alias}"."logType" = :logType`), {
                            logType: contracts_1.TimeLogType.MANUAL
                        });
                    }));
                    qb.andWhere(new typeorm_1.Brackets((web) => {
                        web.andWhere((0, database_helper_1.prepareSQLQuery)(`"${qb.alias}"."startedAt" BETWEEN :start AND :end`), {
                            start,
                            end
                        });
                        web.andWhere((0, database_helper_1.prepareSQLQuery)(`"timeSlots"."startedAt" BETWEEN :start AND :end`), {
                            start,
                            end
                        });
                    }));
                    qb.andWhere(new typeorm_1.Brackets((web) => {
                        web.andWhere((0, database_helper_1.prepareSQLQuery)(`"${qb.alias}"."tenantId" = :tenantId`), { tenantId });
                        web.andWhere((0, database_helper_1.prepareSQLQuery)(`"${qb.alias}"."organizationId" = :organizationId`), { organizationId });
                    }));
                    qb.andWhere(new typeorm_1.Brackets((web) => {
                        web.andWhere((0, database_helper_1.prepareSQLQuery)(`"timeSlots"."tenantId" = :tenantId`), { tenantId });
                        web.andWhere((0, database_helper_1.prepareSQLQuery)(`"timeSlots"."organizationId" = :organizationId`), { organizationId });
                    }));
                    qb.andWhere(new typeorm_1.Brackets((web) => {
                        if ((0, utils_1.isNotEmpty)(employeeIds)) {
                            web.andWhere((0, database_helper_1.prepareSQLQuery)(`"${qb.alias}"."employeeId" IN (:...employeeIds)`), {
                                employeeIds
                            });
                        }
                        if ((0, utils_1.isNotEmpty)(projectIds)) {
                            web.andWhere((0, database_helper_1.prepareSQLQuery)(`"${qb.alias}"."projectId" IN (:...projectIds)`), {
                                projectIds
                            });
                        }
                        if ((0, utils_1.isNotEmpty)(teamIds)) {
                            web.andWhere((0, database_helper_1.prepareSQLQuery)(`"${qb.alias}"."organizationTeamId" IN (:...teamIds)`), { teamIds });
                        }
                    }));
                });
                const typeOrmTimeLogs = await query.getMany();
                timeLogs = typeOrmTimeLogs.map((timeLog) => ({
                    id: timeLog.id,
                    startedAt: timeLog.startedAt,
                    duration: timeLog.duration,
                    user: { ...(0, underscore_1.pick)(timeLog.employee.user, ['name', 'imageUrl']) },
                    project: { ...(0, underscore_1.pick)(timeLog.project, ['name', 'imageUrl']) },
                    employeeId: timeLog.employee.id,
                    employee: timeLog.employee
                }));
                break;
            }
        }
        return timeLogs || [];
    }
    /**
     * GET Time Tracking Dashboard Activities Statistics
     *
     * @param request
     * @returns
     */
    async getActivities(request) {
        const { organizationId, startDate, endDate } = request;
        let { employeeIds = [], projectIds = [], teamIds = [] } = request;
        const tenantId = context_1.RequestContext.currentTenantId() || request.tenantId;
        const { start, end } = (0, utils_2.getDateRangeFormat)(moment.utc(startDate || moment().startOf('week')), moment.utc(endDate || moment().endOf('week')));
        // Retrieves the database type from the configuration service.
        const dbType = this.configService.dbConnectionOptions.type;
        // Determine if the request specifies to retrieve data for the current user only
        const isOnlyMeSelected = request.onlyMe;
        // Filter employeeIds based on permissions and manager access
        employeeIds = await this._managedEmployeeService.filterAccessibleEmployeeIds(employeeIds, teamIds, projectIds, isOnlyMeSelected);
        let activities = [];
        switch (this.ormType) {
            case utils_2.MultiORMEnum.MikroORM: {
                // MikroORM: Use Knex for raw SQL aggregation with GROUP BY
                const knex = this.mikroOrmTimeLogRepository.getKnex();
                const activityDurationFilter = (0, statistic_helper_1.getActivityDurationQueryString)(dbType, 'activity');
                // Query 1: Top 5 activities grouped by title
                let qb = knex('activity')
                    .innerJoin('time_slot', 'activity.timeSlotId', 'time_slot.id')
                    .innerJoin('time_slot_time_logs', 'time_slot.id', 'time_slot_time_logs.timeSlotId')
                    .innerJoin('time_log', 'time_slot_time_logs.timeLogId', 'time_log.id')
                    .select([
                    knex.raw('COUNT("activity"."id") AS sessions'),
                    knex.raw('SUM("activity"."duration") AS duration'),
                    'activity.title as title'
                ])
                    .whereRaw(activityDurationFilter, { start, end })
                    .whereBetween('time_log.startedAt', [start, end])
                    .whereBetween('time_slot.startedAt', [start, end])
                    .andWhere('activity.tenantId', tenantId)
                    .andWhere('activity.organizationId', organizationId)
                    .andWhere('time_log.tenantId', tenantId)
                    .andWhere('time_log.organizationId', organizationId)
                    .groupBy('activity.title')
                    .orderBy('duration', 'DESC')
                    .limit(5);
                if ((0, utils_1.isNotEmpty)(employeeIds)) {
                    qb = qb.whereIn('activity.employeeId', employeeIds);
                }
                if ((0, utils_1.isNotEmpty)(projectIds)) {
                    qb = qb.whereIn('activity.projectId', projectIds);
                }
                if ((0, utils_1.isNotEmpty)(teamIds)) {
                    qb = qb.whereIn('time_log.organizationTeamId', teamIds);
                }
                activities = await qb;
                // Query 2: Total duration for percentage calculation
                let totalQb = knex('activity')
                    .innerJoin('time_slot', 'activity.timeSlotId', 'time_slot.id')
                    .innerJoin('time_slot_time_logs', 'time_slot.id', 'time_slot_time_logs.timeSlotId')
                    .innerJoin('time_log', 'time_slot_time_logs.timeLogId', 'time_log.id')
                    .select(knex.raw('SUM("activity"."duration") AS duration'))
                    .whereRaw(activityDurationFilter, { start, end })
                    .whereBetween('time_log.startedAt', [start, end])
                    .whereBetween('time_slot.startedAt', [start, end])
                    .andWhere('activity.tenantId', tenantId)
                    .andWhere('activity.organizationId', organizationId)
                    .andWhere('time_log.tenantId', tenantId)
                    .andWhere('time_log.organizationId', organizationId);
                if ((0, utils_1.isNotEmpty)(employeeIds)) {
                    totalQb = totalQb.whereIn('activity.employeeId', employeeIds);
                }
                if ((0, utils_1.isNotEmpty)(projectIds)) {
                    totalQb = totalQb.whereIn('activity.projectId', projectIds);
                }
                if ((0, utils_1.isNotEmpty)(teamIds)) {
                    totalQb = totalQb.whereIn('time_log.organizationTeamId', teamIds);
                }
                const totalDuration = await totalQb.first();
                activities = activities.map((activity) => {
                    activity.durationPercentage = (activity.duration * 100) / totalDuration.duration;
                    return activity;
                });
                break;
            }
            case utils_2.MultiORMEnum.TypeORM:
            default: {
                const query = this.typeOrmActivityRepository.createQueryBuilder();
                query
                    .select((0, database_helper_1.prepareSQLQuery)(`COUNT("${query.alias}"."id")`), `sessions`)
                    .addSelect((0, database_helper_1.prepareSQLQuery)(`SUM("${query.alias}"."duration")`), `duration`)
                    .addSelect((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."title"`), `title`)
                    .innerJoin(`${query.alias}.timeSlot`, 'time_slot')
                    .innerJoin(`time_slot.timeLogs`, 'time_log')
                    .addGroupBy((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."title"`));
                query
                    .andWhere((0, statistic_helper_1.getActivityDurationQueryString)(dbType, query.alias), { start, end })
                    .andWhere(new typeorm_1.Brackets((qb) => {
                    qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"time_log"."startedAt" BETWEEN :startDate AND :endDate`), {
                        startDate: start,
                        endDate: end
                    });
                    qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"time_slot"."startedAt" BETWEEN :startDate AND :endDate`), {
                        startDate: start,
                        endDate: end
                    });
                }))
                    .andWhere(new typeorm_1.Brackets((qb) => {
                    qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."tenantId" = :tenantId`), { tenantId });
                    qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."organizationId" = :organizationId`), { organizationId });
                }))
                    .andWhere(new typeorm_1.Brackets((qb) => {
                    qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"time_log"."tenantId" = :tenantId`), { tenantId });
                    qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"time_log"."organizationId" = :organizationId`), { organizationId });
                }))
                    .andWhere(new typeorm_1.Brackets((qb) => {
                    if ((0, utils_1.isNotEmpty)(employeeIds)) {
                        qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."employeeId" IN (:...employeeIds)`), { employeeIds });
                    }
                    if ((0, utils_1.isNotEmpty)(projectIds)) {
                        qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."projectId" IN (:...projectIds)`), { projectIds });
                    }
                    if ((0, utils_1.isNotEmpty)(teamIds)) {
                        qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"time_log"."organizationTeamId" IN (:...teamIds)`), { teamIds });
                    }
                }))
                    .orderBy((0, database_helper_1.prepareSQLQuery)(`"duration"`), 'DESC')
                    .limit(5);
                activities = await query.getRawMany();
                /*
                 * Fetch total duration of the week for calculate duration percentage
                 */
                const totalDurationQuery = this.typeOrmActivityRepository.createQueryBuilder();
                totalDurationQuery
                    .select((0, database_helper_1.prepareSQLQuery)(`SUM("${totalDurationQuery.alias}"."duration")`), `duration`)
                    .innerJoin(`${totalDurationQuery.alias}.timeSlot`, 'time_slot')
                    .innerJoin(`time_slot.timeLogs`, 'time_log');
                totalDurationQuery
                    .andWhere((0, statistic_helper_1.getActivityDurationQueryString)(dbType, totalDurationQuery.alias), { start, end })
                    .andWhere(new typeorm_1.Brackets((qb) => {
                    qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"time_log"."startedAt" BETWEEN :startDate AND :endDate`), {
                        startDate: start,
                        endDate: end
                    });
                    qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"time_slot"."startedAt" BETWEEN :startDate AND :endDate`), {
                        startDate: start,
                        endDate: end
                    });
                }))
                    .andWhere(new typeorm_1.Brackets((qb) => {
                    qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${totalDurationQuery.alias}"."tenantId" = :tenantId`), { tenantId });
                    qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${totalDurationQuery.alias}"."organizationId" = :organizationId`), {
                        organizationId
                    });
                }))
                    .andWhere(new typeorm_1.Brackets((qb) => {
                    qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"time_log"."tenantId" = :tenantId`), { tenantId });
                    qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"time_log"."organizationId" = :organizationId`), { organizationId });
                }))
                    .andWhere(new typeorm_1.Brackets((qb) => {
                    if ((0, utils_1.isNotEmpty)(employeeIds)) {
                        qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${totalDurationQuery.alias}"."employeeId" IN (:...employeeIds)`), {
                            employeeIds
                        });
                    }
                    if ((0, utils_1.isNotEmpty)(projectIds)) {
                        qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${totalDurationQuery.alias}"."projectId" IN (:...projectIds)`), {
                            projectIds
                        });
                    }
                    if ((0, utils_1.isNotEmpty)(teamIds)) {
                        qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"time_log"."organizationTeamId" IN (:...teamIds)`), { teamIds });
                    }
                }));
                const totalDuration = await totalDurationQuery.getRawOne();
                activities = activities.map((activity) => {
                    activity.durationPercentage = (activity.duration * 100) / totalDuration.duration;
                    return activity;
                });
                break;
            }
        }
        return activities || [];
    }
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
    async getEmployeeTimeSlots(request) {
        const { organizationId, startDate, endDate, onlyMe: isOnlyMeSelected } = request;
        let { employeeIds = [], projectIds = [], teamIds = [] } = request;
        const tenantId = context_1.RequestContext.currentTenantId() ?? request.tenantId;
        const { start, end } = (0, utils_2.getDateRangeFormat)(moment.utc(startDate ?? moment().startOf('week')), moment.utc(endDate ?? moment().endOf('week')));
        // Filter employeeIds based on permissions and manager access
        employeeIds = await this._managedEmployeeService.filterAccessibleEmployeeIds(employeeIds, teamIds, projectIds, isOnlyMeSelected);
        let employees = [];
        switch (this.ormType) {
            case utils_2.MultiORMEnum.MikroORM: {
                const knex = this.mikroOrmTimeLogRepository.getKnex();
                // Query 1: Top 3 employees by most recent time_log startedAt
                let qb = knex('time_log')
                    .innerJoin('employee', 'time_log.employeeId', 'employee.id')
                    .innerJoin('time_slot_time_logs', 'time_log.id', 'time_slot_time_logs.timeLogId')
                    .innerJoin('time_slot', 'time_slot_time_logs.timeSlotId', 'time_slot.id')
                    .innerJoin('user', 'employee.userId', 'user.id')
                    .select([
                    'time_log.employeeId as id',
                    'employee.isOnline as isOnline',
                    'employee.isAway as isAway',
                    knex.raw('MAX("time_log"."startedAt") as "startedAt"'),
                    'user.id as user_id'
                ])
                    .where('time_log.tenantId', tenantId)
                    .andWhere('time_log.organizationId', organizationId)
                    .andWhere('time_slot.tenantId', tenantId)
                    .andWhere('time_slot.organizationId', organizationId)
                    .whereBetween('time_log.startedAt', [start, end])
                    .whereBetween('time_slot.startedAt', [start, end]);
                if ((0, utils_1.isNotEmpty)(employeeIds)) {
                    qb = qb.whereIn('time_log.employeeId', employeeIds);
                }
                if ((0, utils_1.isNotEmpty)(projectIds)) {
                    qb = qb.whereIn('time_log.projectId', projectIds);
                }
                if ((0, utils_1.isNotEmpty)(teamIds)) {
                    qb = qb.whereIn('time_log.organizationTeamId', teamIds);
                }
                employees = (await qb
                    .groupBy('time_log.employeeId')
                    .groupBy('user.id')
                    .groupBy('employee.isOnline')
                    .groupBy('employee.isAway')
                    .orderBy('startedAt', 'DESC')
                    .limit(3));
                // Batch-load User entities with image relation so subscribers resolve fresh URLs
                const employeeUserIds = employees.map((e) => e.user_id).filter(Boolean);
                const userMap = await this._userService.findUsersByIds(employeeUserIds);
                // Reshape user data and fetch time slots for each employee
                for (const employee of employees) {
                    const user = userMap.get(employee.user_id);
                    if (!user) {
                        this.logger.warn(`User not found for employee id=${employee.id}, user_id=${employee.user_id}. findUsersByIds returned no match.`);
                    }
                    employee.user = {
                        name: user?.name ?? null,
                        imageUrl: user?.imageUrl ?? null
                    };
                    delete employee.user_id;
                    // Fetch up to 9 recent time slots per employee with screenshots
                    const timeSlotRows = await knex('time_slot')
                        .innerJoin('time_slot_time_logs', 'time_slot.id', 'time_slot_time_logs.timeSlotId')
                        .innerJoin('time_log', 'time_slot_time_logs.timeLogId', 'time_log.id')
                        .leftJoin('employee as emp', 'time_slot.employeeId', 'emp.id')
                        .leftJoin('screenshot', 'time_slot.id', 'screenshot.timeSlotId')
                        .select([
                        'time_slot.*',
                        'emp.id as emp_id',
                        'screenshot.id as screenshot_id',
                        'screenshot.file as screenshot_file',
                        'screenshot.thumb as screenshot_thumb',
                        'screenshot.thumbUrl as screenshot_thumbUrl'
                    ])
                        .where('time_slot.employeeId', employee.id)
                        .andWhere('time_slot.tenantId', tenantId)
                        .andWhere('time_slot.organizationId', organizationId)
                        .whereBetween('time_slot.startedAt', [start, end])
                        .whereBetween('time_log.startedAt', [start, end])
                        .modify((innerQb) => {
                        if ((0, utils_1.isNotEmpty)(projectIds)) {
                            innerQb.whereIn('time_log.projectId', projectIds);
                        }
                        if ((0, utils_1.isNotEmpty)(teamIds)) {
                            innerQb.whereIn('time_log.organizationTeamId', teamIds);
                        }
                    })
                        .orderBy('time_slot.startedAt', 'DESC')
                        .limit(9);
                    // Group screenshots by time slot
                    const slotMap = new Map();
                    for (const row of timeSlotRows) {
                        if (!slotMap.has(row.id)) {
                            slotMap.set(row.id, {
                                ...row,
                                employee: row.emp_id ? { id: row.emp_id } : null,
                                screenshots: []
                            });
                        }
                        if (row.screenshot_id) {
                            slotMap.get(row.id).screenshots.push({
                                id: row.screenshot_id,
                                file: row.screenshot_file,
                                thumb: row.screenshot_thumb,
                                thumbUrl: row.screenshot_thumbUrl
                            });
                        }
                    }
                    employee.timeSlots = Array.from(slotMap.values());
                }
                break;
            }
            case utils_2.MultiORMEnum.TypeORM:
            default: {
                const query = this.typeOrmTimeLogRepository.createQueryBuilder();
                query.innerJoin(`${query.alias}.employee`, 'employee');
                query.innerJoin(`${query.alias}.timeSlots`, 'time_slot');
                query.innerJoin(`employee.user`, 'user');
                query.select((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."employeeId"`), 'id');
                query.addSelect((0, database_helper_1.prepareSQLQuery)(`"employee"."isOnline"`), 'isOnline');
                query.addSelect((0, database_helper_1.prepareSQLQuery)(`"employee"."isAway"`), 'isAway');
                query.addSelect((0, database_helper_1.prepareSQLQuery)(`MAX("${query.alias}"."startedAt")`), 'startedAt');
                query.addSelect((0, database_helper_1.prepareSQLQuery)(`"user"."id"`), 'user_id');
                // Filter by time_log table
                query.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."tenantId" = :tenantId`), { tenantId });
                query.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."organizationId" = :organizationId`), { organizationId });
                query.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."startedAt" BETWEEN :start AND :end`), { start, end });
                query.andWhere((0, database_helper_1.prepareSQLQuery)(`"time_slot"."tenantId" = :tenantId`), { tenantId });
                query.andWhere((0, database_helper_1.prepareSQLQuery)(`"time_slot"."organizationId" = :organizationId`), { organizationId });
                query.andWhere((0, database_helper_1.prepareSQLQuery)(`"time_slot"."startedAt" BETWEEN :start AND :end`), { start, end });
                // Optional filters
                if ((0, utils_1.isNotEmpty)(employeeIds)) {
                    query.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."employeeId" IN (:...employeeIds)`), { employeeIds });
                }
                if ((0, utils_1.isNotEmpty)(projectIds)) {
                    query.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."projectId" IN (:...projectIds)`), { projectIds });
                }
                if ((0, utils_1.isNotEmpty)(teamIds)) {
                    query.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."organizationTeamId" IN (:...teamIds)`), { teamIds });
                }
                query.groupBy((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."employeeId"`));
                query.addGroupBy((0, database_helper_1.prepareSQLQuery)(`"user"."id"`));
                query.addGroupBy((0, database_helper_1.prepareSQLQuery)(`"employee"."isOnline"`));
                query.addGroupBy((0, database_helper_1.prepareSQLQuery)(`"employee"."isAway"`));
                query.addOrderBy((0, database_helper_1.prepareSQLQuery)(`"startedAt"`), 'DESC');
                query.limit(3);
                employees = await query.getRawMany();
                // Batch-load User entities with image relation so subscribers resolve fresh URLs
                const employeeUserIds = employees.map((e) => e.user_id).filter(Boolean);
                const userMap = await this._userService.findUsersByIds(employeeUserIds);
                // Reshape user data and fetch time slots for each employee
                for (const employee of employees) {
                    const { id: employeeId } = employee;
                    const user = userMap.get(employee.user_id);
                    if (!user) {
                        this.logger.warn(`User not found for employee id=${employee.id}, user_id=${employee.user_id}. findUsersByIds returned no match.`);
                    }
                    employee.user = {
                        name: user?.name ?? null,
                        imageUrl: user?.imageUrl ?? null
                    };
                    delete employee.user_id;
                    const query = this.typeOrmTimeSlotRepository.createQueryBuilder('time_slot');
                    query.innerJoinAndSelect(`${query.alias}.timeLogs`, 'timeLogs');
                    query.leftJoinAndSelect(`${query.alias}.employee`, 'employee');
                    query.leftJoinAndSelect(`${query.alias}.screenshots`, 'screenshots');
                    // Filter time_slot by employee, tenant, organization, and date range
                    query.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."employeeId" = :employeeId`), { employeeId });
                    query.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."tenantId" = :tenantId`), { tenantId });
                    query.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."organizationId" = :organizationId`), { organizationId });
                    query.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."startedAt" BETWEEN :start AND :end`), { start, end });
                    // Filter joined timeLogs by date range
                    query.andWhere((0, database_helper_1.prepareSQLQuery)(`"timeLogs"."tenantId" = :tenantId`), { tenantId });
                    query.andWhere((0, database_helper_1.prepareSQLQuery)(`"timeLogs"."organizationId" = :organizationId`), { organizationId });
                    query.andWhere((0, database_helper_1.prepareSQLQuery)(`"timeLogs"."startedAt" BETWEEN :start AND :end`), { start, end });
                    if ((0, utils_1.isNotEmpty)(projectIds)) {
                        query.andWhere((0, database_helper_1.prepareSQLQuery)(`"timeLogs"."projectId" IN (:...projectIds)`), { projectIds });
                    }
                    if ((0, utils_1.isNotEmpty)(teamIds)) {
                        query.andWhere((0, database_helper_1.prepareSQLQuery)(`"timeLogs"."organizationTeamId" IN (:...teamIds)`), { teamIds });
                    }
                    query.orderBy((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."startedAt"`), 'DESC');
                    query.limit(9);
                    employee.timeSlots = await query.getMany();
                }
                break;
            }
        }
        return employees;
    }
    /**
     * Get the count of employees who worked this week.
     *
     * @param request
     * @returns The count of unique employees
     */
    async getEmployeeWorkedCounts(request) {
        switch (this.ormType) {
            case utils_2.MultiORMEnum.MikroORM: {
                // MikroORM: Use Knex for COUNT(DISTINCT) aggregation
                const knex = this.mikroOrmTimeLogRepository.getKnex();
                const { organizationId, startDate, endDate } = request;
                let { employeeIds = [], projectIds = [], teamIds = [], activityLevel, logType, source } = request;
                const tenantId = context_1.RequestContext.currentTenantId() ?? request.tenantId;
                const user = context_1.RequestContext.currentUser();
                const isOnlyMeSelected = request.onlyMe;
                const hasChangeSelectedEmployeePermission = context_1.RequestContext.hasPermission(contracts_1.PermissionsEnum.CHANGE_SELECTED_EMPLOYEE);
                if (user.employeeId && (isOnlyMeSelected || !hasChangeSelectedEmployeePermission)) {
                    employeeIds = [user.employeeId];
                }
                const { start, end } = (0, utils_2.getDateRangeFormat)(moment.utc(startDate || moment().startOf('week')), moment.utc(endDate || moment().endOf('week')));
                let qb = knex('time_log')
                    .innerJoin('employee', 'time_log.employeeId', 'employee.id')
                    .innerJoin('time_slot_time_logs', 'time_log.id', 'time_slot_time_logs.timeLogId')
                    .innerJoin('time_slot', 'time_slot_time_logs.timeSlotId', 'time_slot.id')
                    .select(knex.raw('COUNT(DISTINCT "time_log"."employeeId") as count'))
                    .where('time_log.tenantId', tenantId)
                    .andWhere('time_log.organizationId', organizationId)
                    .whereBetween('time_log.startedAt', [start, end])
                    .whereBetween('time_slot.startedAt', [start, end]);
                if ((0, utils_1.isNotEmpty)(activityLevel)) {
                    qb = qb.whereBetween('time_slot.overall', [activityLevel.start * 6, activityLevel.end * 6]);
                }
                if ((0, utils_1.isNotEmpty)(logType))
                    qb = qb.whereIn('time_log.logType', logType);
                if ((0, utils_1.isNotEmpty)(source))
                    qb = qb.whereIn('time_log.source', source);
                if ((0, utils_1.isNotEmpty)(employeeIds))
                    qb = qb.whereIn('time_log.employeeId', employeeIds);
                if ((0, utils_1.isNotEmpty)(projectIds))
                    qb = qb.whereIn('time_log.projectId', projectIds);
                if ((0, utils_1.isNotEmpty)(teamIds))
                    qb = qb.whereIn('time_log.organizationTeamId', teamIds);
                const result = await qb.first();
                return parseInt(result?.count || '0', 10);
            }
            case utils_2.MultiORMEnum.TypeORM:
            default: {
                const query = this.typeOrmTimeLogRepository.createQueryBuilder('time_log');
                query
                    .select('COUNT(DISTINCT time_log.employeeId)', 'count')
                    .innerJoin('time_log.employee', 'employee')
                    .innerJoin('time_log.timeSlots', 'time_slot')
                    .andWhere(new typeorm_1.Brackets((where) => {
                    this.getFilterQuery(query, where, request);
                }));
                const result = await query.getRawOne();
                const count = parseInt(result.count, 10);
                return count;
            }
        }
    }
    /**
     * Get the count of projects worked on this week.
     *
     * @param request
     * @returns The count of unique projects
     */
    async getProjectWorkedCounts(request) {
        switch (this.ormType) {
            case utils_2.MultiORMEnum.MikroORM: {
                // MikroORM: Use Knex for COUNT(DISTINCT) aggregation
                const knex = this.mikroOrmTimeLogRepository.getKnex();
                const { organizationId, startDate, endDate } = request;
                let { employeeIds = [], projectIds = [], teamIds = [], activityLevel, logType, source } = request;
                const tenantId = context_1.RequestContext.currentTenantId() ?? request.tenantId;
                const user = context_1.RequestContext.currentUser();
                const isOnlyMeSelected = request.onlyMe;
                const hasChangeSelectedEmployeePermission = context_1.RequestContext.hasPermission(contracts_1.PermissionsEnum.CHANGE_SELECTED_EMPLOYEE);
                if (user.employeeId && (isOnlyMeSelected || !hasChangeSelectedEmployeePermission)) {
                    employeeIds = [user.employeeId];
                }
                const { start, end } = (0, utils_2.getDateRangeFormat)(moment.utc(startDate || moment().startOf('week')), moment.utc(endDate || moment().endOf('week')));
                let qb = knex('time_log')
                    .innerJoin('employee', 'time_log.employeeId', 'employee.id')
                    .innerJoin('organization_project', 'time_log.projectId', 'organization_project.id')
                    .innerJoin('time_slot_time_logs', 'time_log.id', 'time_slot_time_logs.timeLogId')
                    .innerJoin('time_slot', 'time_slot_time_logs.timeSlotId', 'time_slot.id')
                    .select(knex.raw('COUNT(DISTINCT "time_log"."projectId") as count'))
                    .where('time_log.tenantId', tenantId)
                    .andWhere('time_log.organizationId', organizationId)
                    .whereBetween('time_log.startedAt', [start, end])
                    .whereBetween('time_slot.startedAt', [start, end]);
                if ((0, utils_1.isNotEmpty)(activityLevel)) {
                    qb = qb.whereBetween('time_slot.overall', [activityLevel.start * 6, activityLevel.end * 6]);
                }
                if ((0, utils_1.isNotEmpty)(logType))
                    qb = qb.whereIn('time_log.logType', logType);
                if ((0, utils_1.isNotEmpty)(source))
                    qb = qb.whereIn('time_log.source', source);
                if ((0, utils_1.isNotEmpty)(employeeIds))
                    qb = qb.whereIn('time_log.employeeId', employeeIds);
                if ((0, utils_1.isNotEmpty)(projectIds))
                    qb = qb.whereIn('time_log.projectId', projectIds);
                if ((0, utils_1.isNotEmpty)(teamIds))
                    qb = qb.whereIn('time_log.organizationTeamId', teamIds);
                const result = await qb.first();
                return parseInt(result?.count || '0', 10);
            }
            case utils_2.MultiORMEnum.TypeORM:
            default: {
                const query = this.typeOrmTimeLogRepository.createQueryBuilder('time_log');
                query
                    .select('COUNT(DISTINCT time_log.projectId)', 'count')
                    .innerJoin('time_log.employee', 'employee')
                    .innerJoin('time_log.project', 'project')
                    .innerJoin('time_log.timeSlots', 'time_slot')
                    .andWhere(new typeorm_1.Brackets((where) => {
                    this.getFilterQuery(query, where, request);
                }));
                const result = await query.getRawOne();
                const count = parseInt(result.count, 10);
                return count;
            }
        }
    }
    /**
     * Applies filtering conditions to the given TypeORM query builder based on the provided request parameters.
     *
     * @param query The TypeORM query builder instance.
     * @param qb The TypeORM WhereExpressionBuilder instance.
     * @param request The request object containing filter parameters.
     * @returns The modified TypeORM WhereExpressionBuilder instance with applied filtering conditions.
     */
    getFilterQuery(query, qb, request) {
        let { organizationId, startDate, endDate, employeeIds = [], projectIds = [], teamIds = [], activityLevel, logType, source, onlyMe: isOnlyMeSelected // Determine if the request specifies to retrieve data for the current user only
         } = request;
        const user = context_1.RequestContext.currentUser(); // Retrieve the current user
        const tenantId = context_1.RequestContext.currentTenantId() ?? request.tenantId; // Retrieve the current tenant ID
        // Check if the current user has the permission to change the selected employee
        const hasChangeSelectedEmployeePermission = context_1.RequestContext.hasPermission(contracts_1.PermissionsEnum.CHANGE_SELECTED_EMPLOYEE);
        // Set employeeIds based on user conditions and permissions
        if (user.employeeId && (isOnlyMeSelected || !hasChangeSelectedEmployeePermission)) {
            employeeIds = [user.employeeId];
        }
        // Use consistent date range formatting
        const { start, end } = (0, utils_2.getDateRangeFormat)(moment.utc(startDate || moment().startOf('week')), moment.utc(endDate || moment().endOf('week')));
        qb.andWhere(`${query.alias}.tenantId = :tenantId`, { tenantId });
        qb.andWhere(`${query.alias}.organizationId = :organizationId`, { organizationId });
        qb.andWhere(`${query.alias}.startedAt BETWEEN :startDate AND :endDate`, { startDate: start, endDate: end });
        qb.andWhere(`time_slot.startedAt BETWEEN :startDate AND :endDate`, { startDate: start, endDate: end });
        // Apply activity level filter only if provided
        if ((0, utils_1.isNotEmpty)(activityLevel)) {
            const startLevel = activityLevel.start * 6; // Start level for activity level in seconds
            const endLevel = activityLevel.end * 6; // End level for activity level in seconds
            qb.andWhere((0, database_helper_1.prepareSQLQuery)(`time_slot.overall BETWEEN :startLevel AND :endLevel`), { startLevel, endLevel });
        }
        // Apply log type filter if present
        if ((0, utils_1.isNotEmpty)(logType)) {
            qb.andWhere(`${query.alias}.logType IN (:...logType)`, { logType });
        }
        // Apply source filter if present
        if ((0, utils_1.isNotEmpty)(source)) {
            qb.andWhere(`${query.alias}.source IN (:...source)`, { source });
        }
        // Apply employee filter, optimizing joins
        if ((0, utils_1.isNotEmpty)(employeeIds)) {
            qb.andWhere(`${query.alias}.employeeId IN (:...employeeIds)`, { employeeIds });
        }
        // Apply project filter
        if ((0, utils_1.isNotEmpty)(projectIds)) {
            qb.andWhere(`${query.alias}.projectId IN (:...projectIds)`, { projectIds });
        }
        // Apply team filter
        if ((0, utils_1.isNotEmpty)(teamIds)) {
            qb.andWhere(`${query.alias}.organizationTeamId IN (:...teamIds)`, { teamIds });
        }
        return qb;
    }
};
exports.StatisticService = StatisticService;
exports.StatisticService = StatisticService = StatisticService_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_time_slot_repository_1.TypeOrmTimeSlotRepository,
        type_orm_employee_repository_1.TypeOrmEmployeeRepository,
        type_orm_activity_repository_1.TypeOrmActivityRepository,
        type_orm_time_log_repository_1.TypeOrmTimeLogRepository,
        mikro_orm_time_log_repository_1.MikroOrmTimeLogRepository,
        user_service_1.UserService,
        config_1.ConfigService,
        managed_employee_service_1.ManagedEmployeeService])
], StatisticService);
//# sourceMappingURL=statistic.service.js.map