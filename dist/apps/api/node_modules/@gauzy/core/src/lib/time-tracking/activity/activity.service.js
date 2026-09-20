"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const crud_1 = require("./../../core/crud");
const utils_1 = require("./../../core/utils");
const context_1 = require("../../core/context");
const contracts_1 = require("@gauzy/contracts");
const cqrs_1 = require("@nestjs/cqrs");
const bulk_activities_save_command_1 = require("./commands/bulk-activities-save.command");
const underscore_1 = require("underscore");
const utils_2 = require("@gauzy/utils");
const config_1 = require("@gauzy/config");
const database_helper_1 = require("./../../database/database.helper");
const type_orm_activity_repository_1 = require("./repository/type-orm-activity.repository");
const mikro_orm_activity_repository_1 = require("./repository/mikro-orm-activity.repository");
const type_orm_employee_repository_1 = require("../../employee/repository/type-orm-employee.repository");
const type_orm_organization_project_repository_1 = require("../../organization-project/repository/type-orm-organization-project.repository");
const config = (0, config_1.getConfig)();
let ActivityService = class ActivityService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmActivityRepository, mikroOrmActivityRepository, typeOrmEmployeeRepository, typeOrmOrganizationProjectRepository, commandBus) {
        super(typeOrmActivityRepository, mikroOrmActivityRepository);
        this.typeOrmEmployeeRepository = typeOrmEmployeeRepository;
        this.typeOrmOrganizationProjectRepository = typeOrmOrganizationProjectRepository;
        this.commandBus = commandBus;
    }
    async getDailyActivities(request) {
        switch (this.ormType) {
            case utils_1.MultiORMEnum.MikroORM: {
                // MikroORM: Use Knex raw query for SQL aggregation (COUNT, SUM, GROUP BY)
                const knex = this.mikroOrmRepository.getKnex();
                const { organizationId, startDate, endDate } = request;
                const tenantId = context_1.RequestContext.currentTenantId();
                let employeeIds;
                if (context_1.RequestContext.hasPermission(contracts_1.PermissionsEnum.CHANGE_SELECTED_EMPLOYEE)) {
                    if (request.employeeIds) {
                        employeeIds = request.employeeIds;
                    }
                }
                else {
                    const user = context_1.RequestContext.currentUser();
                    employeeIds = [user.employeeId];
                }
                let qb = knex('activity')
                    .innerJoin('employee', 'activity.employeeId', 'employee.id')
                    .innerJoin('time_slot', 'activity.timeSlotId', 'time_slot.id')
                    .innerJoin('time_slot_time_logs', 'time_slot.id', 'time_slot_time_logs.timeSlotId')
                    .select([
                    knex.raw('COUNT("activity"."id") as sessions'),
                    knex.raw('SUM("activity"."duration") as duration'),
                    'activity.employeeId as employeeId',
                    'activity.date as date',
                    'activity.title as title'
                ])
                    .where('activity.tenantId', tenantId)
                    .andWhere('activity.organizationId', organizationId);
                if (startDate && endDate) {
                    qb = qb.whereBetween('activity.date', [startDate, endDate]);
                }
                if ((0, utils_2.isNotEmpty)(employeeIds)) {
                    qb = qb.whereIn('activity.employeeId', employeeIds);
                }
                qb = qb
                    .groupBy('activity.date')
                    .groupBy('activity.title')
                    .groupBy('activity.employeeId')
                    .orderBy('date', 'asc');
                const rawResults = await qb;
                return rawResults || [];
            }
            case utils_1.MultiORMEnum.TypeORM:
            default: {
                const query = this.filterQuery(request);
                query.select((0, database_helper_1.prepareSQLQuery)(`COUNT("${query.alias}"."id")`), `sessions`);
                query.addSelect((0, database_helper_1.prepareSQLQuery)(`SUM("${query.alias}"."duration")`), `duration`);
                query.addSelect((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."employeeId"`), `employeeId`);
                query.addSelect((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."date"`), `date`);
                switch (config.dbConnectionOptions.type) {
                    case config_1.DatabaseTypeEnum.sqlite:
                    case config_1.DatabaseTypeEnum.betterSqlite3:
                        query.addSelect(`time("${query.alias}"."time")`, `time`);
                        break;
                    case config_1.DatabaseTypeEnum.postgres:
                        query.addSelect(`(to_char("${query.alias}"."time", 'HH24') || ':00')::time`, 'time');
                        break;
                    case config_1.DatabaseTypeEnum.mysql:
                        query.addSelect((0, database_helper_1.prepareSQLQuery)(`CONCAT(DATE_FORMAT("${query.alias}"."time", '%H'), ':00')`), 'time');
                        break;
                    default:
                        throw Error(`cannot format daily activities time due to unsupported database type: ${config.dbConnectionOptions.type}`);
                }
                query.addSelect((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."title"`), `title`);
                query.groupBy((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."date"`));
                switch (config.dbConnectionOptions.type) {
                    case config_1.DatabaseTypeEnum.sqlite:
                    case config_1.DatabaseTypeEnum.betterSqlite3:
                        query.addGroupBy(`time("${query.alias}"."time")`);
                        break;
                    case config_1.DatabaseTypeEnum.postgres:
                        query.addGroupBy(`(to_char("${query.alias}"."time", 'HH24') || ':00')::time`);
                        break;
                    case config_1.DatabaseTypeEnum.mysql:
                        query.addGroupBy((0, database_helper_1.prepareSQLQuery)(`CONCAT(DATE_FORMAT("${query.alias}"."time", '%H'), ':00')`));
                        break;
                    default:
                        throw Error(`cannot group by daily activities time due to unsupported database type: ${config.dbConnectionOptions.type}`);
                }
                query.addGroupBy((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."title"`));
                query.addGroupBy((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."employeeId"`));
                query.orderBy(`time`, 'ASC');
                query.addOrderBy((0, database_helper_1.prepareSQLQuery)(`"duration"`), 'DESC');
                return await query.getRawMany();
            }
        }
    }
    async getDailyActivitiesReport(request) {
        switch (this.ormType) {
            case utils_1.MultiORMEnum.MikroORM: {
                // MikroORM: Use Knex raw query for SQL aggregation
                const knex = this.mikroOrmRepository.getKnex();
                const { organizationId, startDate, endDate } = request;
                const tenantId = context_1.RequestContext.currentTenantId();
                let employeeIds;
                if (context_1.RequestContext.hasPermission(contracts_1.PermissionsEnum.CHANGE_SELECTED_EMPLOYEE)) {
                    if (request.employeeIds)
                        employeeIds = request.employeeIds;
                }
                else {
                    const user = context_1.RequestContext.currentUser();
                    employeeIds = [user.employeeId];
                }
                let qb = knex('activity')
                    .innerJoin('employee', 'activity.employeeId', 'employee.id')
                    .innerJoin('time_slot', 'activity.timeSlotId', 'time_slot.id')
                    .innerJoin('time_slot_time_logs', 'time_slot.id', 'time_slot_time_logs.timeSlotId')
                    .select([
                    knex.raw('COUNT("activity"."id") as sessions'),
                    knex.raw('SUM("activity"."duration") as duration'),
                    'activity.employeeId as employeeId',
                    'activity.projectId as projectId',
                    'activity.date as date',
                    'activity.title as title'
                ])
                    .where('activity.tenantId', tenantId)
                    .andWhere('activity.organizationId', organizationId);
                if (startDate && endDate) {
                    qb = qb.whereBetween('activity.date', [startDate, endDate]);
                }
                if ((0, utils_2.isNotEmpty)(employeeIds)) {
                    qb = qb.whereIn('activity.employeeId', employeeIds);
                }
                let activities = await qb
                    .groupBy('activity.date')
                    .groupBy('activity.title')
                    .groupBy('activity.employeeId')
                    .groupBy('activity.projectId')
                    .orderByRaw('"duration" DESC')
                    .limit(200);
                const projectIds = (0, underscore_1.pluck)(activities, 'projectId');
                const empIds = (0, underscore_1.pluck)(activities, 'employeeId');
                let employeeById = {};
                if (empIds.length > 0) {
                    const employees = await this.typeOrmEmployeeRepository.find({
                        where: { id: (0, typeorm_1.In)(empIds), tenantId, organizationId },
                        relations: {
                            user: true
                        }
                    });
                    employeeById = (0, underscore_1.indexBy)(employees, 'id');
                }
                let projectById = {};
                if (projectIds.length > 0) {
                    const projects = await this.typeOrmOrganizationProjectRepository.find({
                        where: { id: (0, typeorm_1.In)(projectIds), tenantId, organizationId }
                    });
                    projectById = (0, underscore_1.indexBy)(projects, 'id');
                }
                activities = activities.map((activity) => {
                    activity.employee = employeeById[activity.employeeId];
                    activity.project = projectById[activity.projectId];
                    return activity;
                });
                return activities;
            }
            case utils_1.MultiORMEnum.TypeORM:
            default: {
                const { organizationId } = request;
                const query = this.filterQuery(request);
                query.select((0, database_helper_1.prepareSQLQuery)(`COUNT("${query.alias}"."id")`), `sessions`);
                query.addSelect((0, database_helper_1.prepareSQLQuery)(`SUM("${query.alias}"."duration")`), `duration`);
                query.addSelect((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."employeeId"`), `employeeId`);
                query.addSelect((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."projectId"`), `projectId`);
                query.addSelect((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."date"`), `date`);
                query.addSelect((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."title"`), `title`);
                query.groupBy((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."date"`));
                query.addGroupBy((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."title"`));
                query.addGroupBy((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."employeeId"`));
                query.addGroupBy((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."projectId"`));
                query.orderBy((0, database_helper_1.prepareSQLQuery)(`"duration"`), 'DESC');
                query.limit(200);
                let activities = await query.getRawMany();
                const projectIds = (0, underscore_1.pluck)(activities, 'projectId');
                const employeeIds = (0, underscore_1.pluck)(activities, 'employeeId');
                let employeeById = {};
                if (employeeIds.length > 0) {
                    const tenantId = context_1.RequestContext.currentTenantId();
                    const employees = await this.typeOrmEmployeeRepository.find({
                        where: {
                            id: (0, typeorm_1.In)(employeeIds),
                            tenantId,
                            organizationId
                        },
                        relations: {
                            user: true
                        }
                    });
                    employeeById = (0, underscore_1.indexBy)(employees, 'id');
                }
                let projectById = {};
                if (projectIds.length > 0) {
                    const tenantId = context_1.RequestContext.currentTenantId();
                    const projects = await this.typeOrmOrganizationProjectRepository.find({
                        where: {
                            id: (0, typeorm_1.In)(projectIds),
                            tenantId,
                            organizationId
                        }
                    });
                    projectById = (0, underscore_1.indexBy)(projects, 'id');
                }
                activities = activities.map((activity) => {
                    activity.employee = employeeById[activity.employeeId];
                    activity.project = projectById[activity.projectId];
                    return activity;
                });
                return activities;
            }
        }
    }
    async getActivities(request) {
        switch (this.ormType) {
            case utils_1.MultiORMEnum.MikroORM: {
                // MikroORM: Use find with relation population
                const { organizationId, startDate, endDate } = request;
                const tenantId = context_1.RequestContext.currentTenantId();
                let employeeIds;
                if (context_1.RequestContext.hasPermission(contracts_1.PermissionsEnum.CHANGE_SELECTED_EMPLOYEE)) {
                    if (request.employeeIds)
                        employeeIds = request.employeeIds;
                }
                else {
                    const user = context_1.RequestContext.currentUser();
                    employeeIds = [user.employeeId];
                }
                const where = {
                    tenantId,
                    organizationId
                };
                if ((0, utils_2.isNotEmpty)(employeeIds)) {
                    where.employeeId = { $in: employeeIds };
                }
                if ((0, utils_2.isNotEmpty)(request.titles)) {
                    where.title = { $in: request.titles };
                }
                if ((0, utils_2.isNotEmpty)(request.types)) {
                    where.type = { $in: request.types };
                }
                if ((0, utils_2.isNotEmpty)(request.projectIds)) {
                    where.projectId = { $in: request.projectIds };
                }
                const populate = [];
                if (context_1.RequestContext.hasPermission(contracts_1.PermissionsEnum.CHANGE_SELECTED_EMPLOYEE)) {
                    populate.push('employee', 'employee.user');
                }
                const items = await this.mikroOrmRepository.find(where, {
                    populate,
                    orderBy: { duration: 'DESC' },
                    ...(request.limit > 0 ? { limit: request.limit, offset: (request.page || 0) * request.limit } : {})
                });
                return items.map((e) => this.serialize(e));
            }
            case utils_1.MultiORMEnum.TypeORM:
            default: {
                const query = this.filterQuery(request);
                if (context_1.RequestContext.hasPermission(contracts_1.PermissionsEnum.CHANGE_SELECTED_EMPLOYEE)) {
                    query.leftJoinAndSelect(`${query.alias}.employee`, 'activityEmployee');
                    query.leftJoinAndSelect(`activityEmployee.user`, 'activityUser', (0, database_helper_1.prepareSQLQuery)('"employee"."userId" = activityUser.id'));
                }
                query.orderBy(`${query.alias}.duration`, 'DESC');
                return await query.getMany();
            }
        }
    }
    async bulkSave(input) {
        return await this.commandBus.execute(new bulk_activities_save_command_1.BulkActivitiesSaveCommand(input));
    }
    filterQuery(request) {
        const { organizationId, startDate, endDate } = request;
        const tenantId = context_1.RequestContext.currentTenantId();
        let employeeIds;
        if (context_1.RequestContext.hasPermission(contracts_1.PermissionsEnum.CHANGE_SELECTED_EMPLOYEE)) {
            if (request.employeeIds) {
                employeeIds = request.employeeIds;
            }
        }
        else {
            const user = context_1.RequestContext.currentUser();
            employeeIds = [user.employeeId];
        }
        const query = this.typeOrmRepository.createQueryBuilder();
        if (request.limit > 0) {
            query.take(request.limit);
            query.skip((request.page || 0) * request.limit);
        }
        query.innerJoin(`${query.alias}.employee`, 'employee');
        query.innerJoin(`${query.alias}.timeSlot`, 'time_slot');
        query.innerJoin(`time_slot.timeLogs`, 'time_log');
        query.andWhere(new typeorm_1.Brackets((qb) => {
            qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."tenantId" = :tenantId`), { tenantId });
            qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."organizationId" = :organizationId`), { organizationId });
            qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"time_slot"."tenantId" = :tenantId`), { tenantId });
            qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"time_slot"."organizationId" = :organizationId`), { organizationId });
            qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"time_log"."tenantId" = :tenantId`), { tenantId });
            qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"time_log"."organizationId" = :organizationId`), { organizationId });
        }));
        query.andWhere(new typeorm_1.Brackets((qb) => {
            const { titles, types } = request;
            if ((0, utils_2.isNotEmpty)(types)) {
                qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."type" IN (:...types)`), {
                    types
                });
            }
            if ((0, utils_2.isNotEmpty)(titles)) {
                qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."title" IN (:...titles)`), {
                    titles
                });
            }
        }));
        // Only apply the date-range filter when both bounds are provided, matching the MikroORM
        // branches. Applying it unconditionally would produce `recordedAt BETWEEN NULL AND NULL`
        // (which matches nothing) when a caller omits the range.
        if (startDate && endDate) {
            query.andWhere(new typeorm_1.Brackets((qb) => {
                // Filter on the indexed `recordedAt` timestamp column instead of a
                // non-sargable `concat(date, time)::timestamp` expression. The old form had
                // to compute the expression for every row, so it could not use any index and
                // forced a full scan of the (very large) activity table. `recordedAt` holds
                // the same instant (date + time) and is covered by the
                // (organizationId, employeeId, recordedAt) / (organizationId, recordedAt)
                // indexes, turning the range filter into an index range scan.
                qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."recordedAt" BETWEEN :startDate AND :endDate`), {
                    startDate,
                    endDate
                });
            }));
        }
        query.andWhere(new typeorm_1.Brackets((qb) => {
            const { projectIds = [] } = request;
            if ((0, utils_2.isNotEmpty)(employeeIds)) {
                qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."employeeId" IN (:...employeeIds)`), {
                    employeeIds
                });
            }
            if ((0, utils_2.isNotEmpty)(projectIds)) {
                qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."projectId" IN (:...projectIds)`), {
                    projectIds
                });
            }
        }));
        query.andWhere(new typeorm_1.Brackets((qb) => {
            const { activityLevel, source, logType } = request;
            if ((0, utils_2.isNotEmpty)(activityLevel)) {
                /**
                 * Activity Level should be 0-100%
                 * So, we have convert it into 10 minutes timeslot by multiply by 6
                 */
                const start = activityLevel.start * 6;
                const end = activityLevel.end * 6;
                qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"time_slot"."overall" BETWEEN :start AND :end`), {
                    start,
                    end
                });
            }
            if ((0, utils_2.isNotEmpty)(source)) {
                if (source instanceof Array) {
                    qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"time_log"."source" IN (:...source)`), {
                        source
                    });
                }
                else {
                    qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"time_log"."source" = :source`), {
                        source
                    });
                }
            }
            if ((0, utils_2.isNotEmpty)(logType)) {
                if (logType instanceof Array) {
                    qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"time_log"."logType" IN (:...logType)`), {
                        logType
                    });
                }
                else {
                    qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"time_log"."logType" = :logType`), {
                        logType
                    });
                }
            }
        }));
        return query;
    }
};
exports.ActivityService = ActivityService;
exports.ActivityService = ActivityService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_activity_repository_1.TypeOrmActivityRepository,
        mikro_orm_activity_repository_1.MikroOrmActivityRepository,
        type_orm_employee_repository_1.TypeOrmEmployeeRepository,
        type_orm_organization_project_repository_1.TypeOrmOrganizationProjectRepository,
        cqrs_1.CommandBus])
], ActivityService);
//# sourceMappingURL=activity.service.js.map