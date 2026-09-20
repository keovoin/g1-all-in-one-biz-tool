"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeSlotBulkDeleteHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const chalk = require("chalk");
const utils_1 = require("@gauzy/utils");
const time_slot_bulk_delete_command_1 = require("../time-slot-bulk-delete.command");
const context_1 = require("../../../../core/context");
const utils_2 = require("./../../../../core/utils");
const database_helper_1 = require("./../../../../database/database.helper");
const type_orm_time_slot_repository_1 = require("../../repository/type-orm-time-slot.repository");
const mikro_orm_time_slot_repository_1 = require("../../repository/mikro-orm-time-slot.repository");
let TimeSlotBulkDeleteHandler = class TimeSlotBulkDeleteHandler {
    constructor(typeOrmTimeSlotRepository, mikroOrmTimeSlotRepository) {
        this.typeOrmTimeSlotRepository = typeOrmTimeSlotRepository;
        this.mikroOrmTimeSlotRepository = mikroOrmTimeSlotRepository;
        this.ormType = (0, utils_2.getORMType)();
    }
    /**
     * Execute bulk deletion of time slots
     *
     * @param command - The command containing input and deletion options
     * @returns Promise<boolean> - Returns true if deletion was successful, otherwise false
     */
    async execute(command) {
        const { input, forceDelete, entireSlots } = command;
        // Extract organizationId, employeeId, timeLog, and timeSlotsIds from the input
        const { organizationId, employeeId, timeLog, timeSlotsIds = [] } = input;
        // Retrieve the tenant ID from the current request context or the provided input
        const tenantId = context_1.RequestContext.currentTenantId() ?? input.tenantId;
        // Step 1: Fetch time slots based on input parameters
        const timeSlots = await this.fetchTimeSlots({ organizationId, employeeId, tenantId, timeSlotsIds });
        console.log(`fetched time slots for soft delete or hard delete:`, timeSlots);
        // If timeSlots is empty, return an empty array
        if ((0, utils_1.isEmpty)(timeSlots)) {
            return [];
        }
        // Step 2: Handle deletion based on the entireSlots flag
        if (entireSlots) {
            return await this.bulkDeleteTimeSlots(timeSlots, forceDelete);
        }
        else {
            return await this.conditionalDeleteTimeSlots(timeSlots, timeLog, forceDelete);
        }
    }
    /**
     * Fetches time slots based on the provided parameters.
     *
     * @param params - The parameters for querying time slots.
     * @returns A promise that resolves to an array of time slots.
     */
    async fetchTimeSlots({ organizationId, employeeId, tenantId, timeSlotsIds = [] }) {
        switch (this.ormType) {
            case utils_2.MultiORMEnum.MikroORM: {
                const em = this.mikroOrmTimeSlotRepository.getEntityManager();
                const where = { employeeId, organizationId, tenantId };
                if ((0, utils_1.isNotEmpty)(timeSlotsIds)) {
                    where.id = { $in: timeSlotsIds };
                }
                return await em.find('TimeSlot', where, {
                    populate: ['timeLogs', 'screenshots', 'activities', 'timeSlotMinutes']
                });
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
                query
                    .where((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."employeeId" = :employeeId`), { employeeId })
                    .andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."organizationId" = :organizationId`), { organizationId })
                    .andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."tenantId" = :tenantId`), { tenantId });
                // If timeSlotsIds is not empty, add a WHERE clause to the query
                if ((0, utils_1.isNotEmpty)(timeSlotsIds)) {
                    query.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."id" IN (:...timeSlotsIds)`), { timeSlotsIds });
                }
                console.log('fetched time slots by parameters:', query.getParameters());
                return await query.getMany();
            }
        }
    }
    /**
     * Handles bulk deletion of time slots, either soft or hard delete based on the `forceDelete` flag.
     *
     * @param timeSlots - The time slots to delete.
     * @param forceDelete - A boolean flag to indicate whether to hard delete or soft delete.
     * @returns A promise that resolves to the deleted time slots.
     */
    bulkDeleteTimeSlots(timeSlots, forceDelete) {
        console.log(`bulk ${forceDelete ? 'hard' : 'soft'} deleting time slots:`, timeSlots);
        switch (this.ormType) {
            case utils_2.MultiORMEnum.MikroORM: {
                const em = this.mikroOrmTimeSlotRepository.getEntityManager();
                if (forceDelete) {
                    return em.removeAndFlush(timeSlots).then(() => timeSlots);
                }
                // For soft delete with MikroORM, set deletedAt field
                for (const slot of timeSlots) {
                    slot.deletedAt = new Date();
                }
                return em.persistAndFlush(timeSlots).then(() => timeSlots);
            }
            case utils_2.MultiORMEnum.TypeORM:
            default:
                return forceDelete
                    ? this.typeOrmTimeSlotRepository.remove(timeSlots)
                    : this.typeOrmTimeSlotRepository.softRemove(timeSlots);
        }
    }
    /**
     * Conditionally deletes time slots based on associated time logs.
     *
     * If a time slot only has one time log and that time log matches the provided one, the time slot is deleted.
     *
     * @param timeSlots - The time slots to conditionally delete.
     * @param timeLog - The specific time log to check for deletion.
     * @param forceDelete - A boolean flag to indicate whether to hard delete or soft delete.
     * @returns A promise that resolves to true after deletion.
     */
    async conditionalDeleteTimeSlots(timeSlots, timeLog, forceDelete) {
        console.log(`conditional ${forceDelete ? 'hard' : 'soft'} deleting time slots:`, timeSlots);
        // Loop through each time slot
        for await (const timeSlot of timeSlots) {
            const { timeLogs = [] } = timeSlot;
            const [firstTimeLog] = timeLogs;
            console.log('Matching TimeLog ID:', firstTimeLog.id === timeLog.id);
            console.log('TimeSlots Ids Will Be Deleted:', timeSlot.id);
            if (timeLogs.length === 1) {
                const [firstTimeLog] = timeLogs;
                if (firstTimeLog.id === timeLog.id) {
                    // If the time slot has only one time log and it matches the provided time log, delete the time slot
                    switch (this.ormType) {
                        case utils_2.MultiORMEnum.MikroORM: {
                            const em = this.mikroOrmTimeSlotRepository.getEntityManager();
                            if (forceDelete) {
                                console.log(chalk.red('--------------------hard removing time slot--------------------'), timeSlot.id);
                                await em.removeAndFlush(timeSlot);
                                return timeSlot;
                            }
                            else {
                                console.log(chalk.yellow('--------------------soft removing time slot--------------------'), timeSlot.id);
                                timeSlot.deletedAt = new Date();
                                await em.persistAndFlush(timeSlot);
                                return timeSlot;
                            }
                        }
                        case utils_2.MultiORMEnum.TypeORM:
                        default:
                            if (forceDelete) {
                                console.log(chalk.red('--------------------hard removing time slot--------------------'), timeSlot.id);
                                return await this.typeOrmTimeSlotRepository.remove(timeSlot);
                            }
                            else {
                                console.log(chalk.yellow('--------------------soft removing time slot--------------------'), timeSlot.id);
                                return await this.typeOrmTimeSlotRepository.softRemove(timeSlot);
                            }
                    }
                }
            }
        }
    }
};
exports.TimeSlotBulkDeleteHandler = TimeSlotBulkDeleteHandler;
exports.TimeSlotBulkDeleteHandler = TimeSlotBulkDeleteHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(time_slot_bulk_delete_command_1.TimeSlotBulkDeleteCommand),
    tslib_1.__metadata("design:paramtypes", [type_orm_time_slot_repository_1.TypeOrmTimeSlotRepository,
        mikro_orm_time_slot_repository_1.MikroOrmTimeSlotRepository])
], TimeSlotBulkDeleteHandler);
//# sourceMappingURL=time-slot-bulk-delete.handler.js.map