"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteTimeSlotHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const chalk = require("chalk");
const contracts_1 = require("@gauzy/contracts");
const utils_1 = require("@gauzy/utils");
const delete_time_span_command_1 = require("../../../time-log/commands/delete-time-span.command");
const delete_time_slot_command_1 = require("../delete-time-slot.command");
const context_1 = require("./../../../../core/context");
const utils_2 = require("./../../../../core/utils");
const database_helper_1 = require("./../../../../database/database.helper");
const type_orm_time_slot_repository_1 = require("../../repository/type-orm-time-slot.repository");
const mikro_orm_time_slot_repository_1 = require("../../repository/mikro-orm-time-slot.repository");
let DeleteTimeSlotHandler = class DeleteTimeSlotHandler {
    constructor(typeOrmTimeSlotRepository, mikroOrmTimeSlotRepository, commandBus) {
        this.typeOrmTimeSlotRepository = typeOrmTimeSlotRepository;
        this.mikroOrmTimeSlotRepository = mikroOrmTimeSlotRepository;
        this.commandBus = commandBus;
        this.ormType = (0, utils_2.getORMType)();
    }
    /**
     * Executes the command to delete time slots based on the provided query.
     *
     * This method processes the deletion of time slots based on the provided IDs in the query.
     * It checks for the current user's permission to change selected employees, and if not permitted,
     * restricts the deletion to the current user's time slots. The method handles deleting time spans
     * for each time slot, ensuring that only non-running time logs are deleted.
     *
     * @param command - The `DeleteTimeSlotCommand` containing the query with time slot IDs and organization data.
     * @returns A promise that resolves to `true` if the deletion process is successful, or throws an exception if no IDs are provided.
     * @throws NotAcceptableException if no time slot IDs are provided in the query.
     */
    async execute(command) {
        const { ids, organizationId, forceDelete } = command.options;
        // Throw an error if no IDs are provided
        if ((0, utils_1.isEmpty)(ids)) {
            throw new common_1.NotAcceptableException('You can not delete time slots');
        }
        // Retrieve the tenant ID from the current request context
        const tenantId = context_1.RequestContext.currentTenantId() || command.options.tenantId;
        // Check if the current user has the permission to change the selected employee
        const hasChangeSelectedEmployeePermission = context_1.RequestContext.hasPermission(contracts_1.PermissionsEnum.CHANGE_SELECTED_EMPLOYEE);
        const employeeIds = !hasChangeSelectedEmployeePermission ? [context_1.RequestContext.currentEmployeeId()] : [];
        for await (const id of Object.values(ids)) {
            let timeSlots = [];
            switch (this.ormType) {
                case utils_2.MultiORMEnum.MikroORM: {
                    const em = this.mikroOrmTimeSlotRepository.getEntityManager();
                    const qb = {};
                    qb.id = id;
                    qb.tenantId = tenantId;
                    qb.organizationId = organizationId;
                    if ((0, utils_1.isNotEmpty)(employeeIds)) {
                        qb.employeeId = { $in: employeeIds };
                    }
                    timeSlots = await em.find('TimeSlot', qb, {
                        populate: ['timeLogs', 'screenshots', 'activities', 'timeSlotMinutes'],
                        orderBy: { createdAt: 'ASC' }
                    });
                    break;
                }
                case utils_2.MultiORMEnum.TypeORM:
                default: {
                    // Create a query builder for the TimeSlot entity
                    const query = this.typeOrmTimeSlotRepository.createQueryBuilder();
                    query
                        .leftJoinAndSelect(`${query.alias}.timeLogs`, 'timeLogs')
                        .leftJoinAndSelect(`${query.alias}.screenshots`, 'screenshots')
                        .leftJoinAndSelect(`${query.alias}.activities`, 'activities')
                        .leftJoinAndSelect(`${query.alias}.timeSlotMinutes`, 'timeSlotMinutes');
                    // Add where clauses to the query
                    query.where((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."id" = :id`), { id });
                    query.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."tenantId" = :tenantId`), { tenantId });
                    query.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."organizationId" = :organizationId`), { organizationId });
                    // Restrict deletion based on employeeId if permission is not granted
                    if ((0, utils_1.isNotEmpty)(employeeIds)) {
                        query.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."employeeId" IN (:...employeeIds)`), { employeeIds });
                    }
                    // Order by creation date
                    query.orderBy((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."createdAt"`), 'ASC');
                    timeSlots = await query.getMany();
                    break;
                }
            }
            // If no time slots are found, stop processing
            if ((0, utils_1.isEmpty)(timeSlots)) {
                continue;
            }
            console.log(chalk.blue(`time slots for soft delete or hard delete:`), JSON.stringify(timeSlots));
            // Loop through each time slot
            for await (const timeSlot of timeSlots) {
                if ((0, utils_1.isNotEmpty)(timeSlot.timeLogs)) {
                    // Filter non-running time logs
                    const nonRunningTimeLogs = timeSlot.timeLogs.filter((timeLog) => !timeLog.isRunning);
                    // Delete non-running time logs
                    if ((0, utils_1.isNotEmpty)(nonRunningTimeLogs)) {
                        // Sequentially execute delete commands for non-running time logs
                        for await (const timeLog of nonRunningTimeLogs) {
                            // Delete time span for non-running time log
                            await this.commandBus.execute(new delete_time_span_command_1.DeleteTimeSpanCommand({
                                start: timeSlot.startedAt,
                                end: timeSlot.stoppedAt
                            }, timeLog, timeSlot, forceDelete));
                        }
                    }
                }
            }
        }
        return true;
    }
};
exports.DeleteTimeSlotHandler = DeleteTimeSlotHandler;
exports.DeleteTimeSlotHandler = DeleteTimeSlotHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(delete_time_slot_command_1.DeleteTimeSlotCommand),
    tslib_1.__metadata("design:paramtypes", [type_orm_time_slot_repository_1.TypeOrmTimeSlotRepository,
        mikro_orm_time_slot_repository_1.MikroOrmTimeSlotRepository,
        cqrs_1.CommandBus])
], DeleteTimeSlotHandler);
//# sourceMappingURL=delete-time-slot.handler.js.map