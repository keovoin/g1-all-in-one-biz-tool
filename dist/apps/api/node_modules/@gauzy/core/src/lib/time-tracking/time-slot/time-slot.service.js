"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeSlotService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const contracts_1 = require("@gauzy/contracts");
const utils_1 = require("@gauzy/utils");
const context_1 = require("../../core/context");
const crud_1 = require("./../../core/crud");
const moment_extend_1 = require("../../core/moment-extend");
const utils_2 = require("./../../core/utils");
const utils_3 = require("./utils");
const commands_1 = require("./commands");
const database_helper_1 = require("./../../database/database.helper");
const type_orm_time_slot_repository_1 = require("./repository/type-orm-time-slot.repository");
const mikro_orm_time_slot_repository_1 = require("./repository/mikro-orm-time-slot.repository");
let TimeSlotService = class TimeSlotService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmTimeSlotRepository, mikroOrmTimeSlotRepository, _commandBus) {
        super(typeOrmTimeSlotRepository, mikroOrmTimeSlotRepository);
        this.typeOrmTimeSlotRepository = typeOrmTimeSlotRepository;
        this.mikroOrmTimeSlotRepository = mikroOrmTimeSlotRepository;
        this._commandBus = _commandBus;
    }
    /**
     * Retrieves time slots based on the provided input parameters.
     *
     * @param request - Input parameters for querying time slots.
     * @returns A list of time slots matching the specified criteria.
     */
    async getTimeSlots(request) {
        // Builds its own query, so the check in the CRUD read methods never runs: assert the
        // sensitive-relation table on the client-supplied relations before anything is loaded.
        this.assertRelationsPermitted(request);
        // Extract parameters from the request object with default values
        let { organizationId, startDate, endDate, syncSlots = false, employeeIds = [], projectIds = [], activityLevel, source, logType, onlyMe: isOnlyMeSelected // Indicates whether to retrieve data for the current user only
         } = request;
        const tenantId = context_1.RequestContext.currentTenantId() ?? request.tenantId; // Retrieve the tenant ID from the request context or the provided input
        const user = context_1.RequestContext.currentUser(); // Retrieve the current user from the request context
        // Check if the current user has the permission to change the selected employee
        const hasChangeSelectedEmployeePermission = context_1.RequestContext.hasPermission(contracts_1.PermissionsEnum.CHANGE_SELECTED_EMPLOYEE);
        // Set employeeIds based on permissions and request
        if (user.employeeId && (isOnlyMeSelected || !hasChangeSelectedEmployeePermission)) {
            employeeIds = [user.employeeId];
        }
        // Calculate start and end dates using a utility function
        const { start, end } = (0, utils_2.getDateRangeFormat)(moment_extend_1.moment.utc(startDate || (0, moment_extend_1.moment)().startOf('day')), moment_extend_1.moment.utc(endDate || (0, moment_extend_1.moment)().endOf('day')));
        switch (this.ormType) {
            case utils_2.MultiORMEnum.MikroORM: {
                const where = {
                    tenantId,
                    organizationId,
                    startedAt: { $gte: start, $lte: end },
                    timeLogs: {
                        tenantId,
                        organizationId
                    }
                };
                if (!syncSlots) {
                    where.timeLogs.startedAt = { $gte: start, $lte: end };
                }
                if ((0, utils_1.isNotEmpty)(employeeIds)) {
                    where.employeeId = { $in: employeeIds };
                    where.timeLogs.employeeId = { $in: employeeIds };
                }
                if ((0, utils_1.isNotEmpty)(projectIds)) {
                    where.timeLogs.projectId = { $in: projectIds };
                }
                if ((0, utils_1.isNotEmpty)(activityLevel)) {
                    where.overall = { $gte: activityLevel.start * 6, $lte: activityLevel.end * 6 };
                }
                if ((0, utils_1.isNotEmpty)(source)) {
                    where.timeLogs.source = source instanceof Array ? { $in: source } : source;
                }
                if ((0, utils_1.isNotEmpty)(logType)) {
                    where.timeLogs.logType = logType instanceof Array ? { $in: logType } : logType;
                }
                const items = await this.mikroOrmRepository.find(where, {
                    populate: (request.relations || []),
                    orderBy: { createdAt: 'ASC' }
                });
                return items.map((e) => this.serialize(e));
            }
            case utils_2.MultiORMEnum.TypeORM:
            default: {
                // Create a query builder for the TimeSlot entity
                const query = this.typeOrmRepository.createQueryBuilder('time_slot');
                query.leftJoin(`${query.alias}.employee`, 'employee', `"employee"."tenantId" = :tenantId AND "employee"."organizationId" = :organizationId`, { tenantId, organizationId });
                query.innerJoin(`${query.alias}.timeLogs`, 'time_log');
                // Set find options for the query
                query.setFindOptions({
                    // Define selected fields for the result
                    select: {
                        organization: {
                            id: true,
                            name: true
                        },
                        employee: {
                            id: true,
                            user: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                imageUrl: true
                            }
                        }
                    },
                    // Spread relations if provided, otherwise an empty array
                    relations: (0, utils_2.parseFindOptionsRelations)(request.relations || [])
                });
                // Add where conditions to the query
                query.where((qb) => {
                    // Filter by time range for both time_slot and time_log
                    qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${qb.alias}"."startedAt" BETWEEN :startDate AND :endDate`), {
                        startDate: start,
                        endDate: end
                    });
                    // If syncSlots is true, filter by time_log.startedAt
                    if ((0, utils_1.isEmpty)(syncSlots)) {
                        qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"time_log"."startedAt" BETWEEN :startDate AND :endDate`), {
                            startDate: start,
                            endDate: end
                        });
                    }
                    // Filter by employeeIds and projectIds if provided
                    if ((0, utils_1.isNotEmpty)(employeeIds)) {
                        qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${qb.alias}"."employeeId" IN (:...employeeIds)`), { employeeIds });
                        qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"time_log"."employeeId" IN (:...employeeIds)`), { employeeIds });
                    }
                    if ((0, utils_1.isNotEmpty)(projectIds)) {
                        qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"time_log"."projectId" IN (:...projectIds)`), { projectIds });
                    }
                    // Filter by activity level if provided
                    if ((0, utils_1.isNotEmpty)(activityLevel)) {
                        /**
                         * Activity Level should be 0-100%
                         * Convert it into a 10-minute time slot by multiplying by 6
                         */
                        // Filters records based on the overall column, representing the activity level.
                        qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${qb.alias}"."overall" BETWEEN :start AND :end`), {
                            start: activityLevel.start * 6,
                            end: activityLevel.end * 6
                        });
                    }
                    // Filters records based on the source column.
                    if ((0, utils_1.isNotEmpty)(source)) {
                        const whereClause = source instanceof Array
                            ? (0, database_helper_1.prepareSQLQuery)(`"time_log"."source" IN (:...source)`)
                            : (0, database_helper_1.prepareSQLQuery)(`"time_log"."source" = :source`);
                        qb.andWhere(whereClause, { source });
                    }
                    // Filter by logType if provided
                    if ((0, utils_1.isNotEmpty)(logType)) {
                        const whereClause = logType instanceof Array
                            ? (0, database_helper_1.prepareSQLQuery)(`"time_log"."logType" IN (:...logType)`)
                            : (0, database_helper_1.prepareSQLQuery)(`"time_log"."logType" = :logType`);
                        qb.andWhere(whereClause, { logType });
                    }
                    // Filter by tenantId and organizationId for both time_slot and time_log in a single AND condition
                    qb.andWhere(`"${qb.alias}"."tenantId" = :tenantId AND "${qb.alias}"."organizationId" = :organizationId AND
						"time_log"."tenantId" = :tenantId AND "time_log"."organizationId" = :organizationId`, { tenantId, organizationId });
                    // Sort by createdAt
                    qb.addOrderBy(`"${qb.alias}"."createdAt"`, 'ASC');
                });
                const slots = await query.getMany();
                return slots;
            }
        }
    }
    /**
     * Bulk creates or updates time slots for a given employee within an organization.
     *
     * This method will either create new time slots or update existing ones based on
     * the provided slots, employeeId, and organizationId. The actual logic for bulk
     * creation or updating is delegated to a command handler (`TimeSlotBulkCreateOrUpdateCommand`).
     *
     * @param slots - An array of time slots to be created or updated.
     * @param employeeId - The ID of the employee for whom the time slots belong.
     * @param organizationId - The ID of the organization associated with the time slots.
     * @returns A promise that resolves when the command is executed, performing bulk creation or update.
     */
    async bulkCreateOrUpdate(slots, employeeId, organizationId) {
        const tenantId = context_1.RequestContext.currentTenantId();
        return await this._commandBus.execute(new commands_1.TimeSlotBulkCreateOrUpdateCommand(slots, employeeId, organizationId, tenantId));
    }
    /**
     * Bulk create time slots for a given employee and organization
     *
     * @param slots The array of time slots to be created
     * @param employeeId The ID of the employee
     * @param organizationId The ID of the organization
     * @returns The result of the bulk creation command
     */
    async bulkCreate(slots, employeeId, organizationId) {
        const tenantId = context_1.RequestContext.currentTenantId();
        return await this._commandBus.execute(new commands_1.TimeSlotBulkCreateCommand(slots, employeeId, organizationId, tenantId));
    }
    /**
     * Generates time slots between the start and end times at a given interval.
     * @param start The start time of the range
     * @param end The end time of the range
     * @returns An array of generated time slots
     */
    generateTimeSlots(start, end) {
        return (0, utils_3.generateTimeSlots)(start, end);
    }
    /*
     *create time slot minute activity for specific TimeSlot
     */
    async createTimeSlotMinute(request) {
        // const { keyboard, mouse, datetime, timeSlot } = request;
        return await this._commandBus.execute(new commands_1.CreateTimeSlotMinutesCommand(request));
    }
    /*
     * Update TimeSlot minute activity for specific TimeSlot
     */
    async updateTimeSlotMinute(id, request) {
        return await this._commandBus.execute(new commands_1.UpdateTimeSlotMinutesCommand(id, request));
    }
};
exports.TimeSlotService = TimeSlotService;
exports.TimeSlotService = TimeSlotService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_time_slot_repository_1.TypeOrmTimeSlotRepository,
        mikro_orm_time_slot_repository_1.MikroOrmTimeSlotRepository,
        cqrs_1.CommandBus])
], TimeSlotService);
//# sourceMappingURL=time-slot.service.js.map