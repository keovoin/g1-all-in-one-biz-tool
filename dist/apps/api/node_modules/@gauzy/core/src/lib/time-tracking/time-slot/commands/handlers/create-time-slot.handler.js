"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTimeSlotHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const typeorm_1 = require("typeorm");
const moment = require("moment");
const underscore_1 = require("underscore");
const chalk = require("chalk");
const contracts_1 = require("@gauzy/contracts");
const utils_1 = require("@gauzy/utils");
const database_helper_1 = require("./../../../../database/database.helper");
const utils_2 = require("./../../../../core/utils");
const context_1 = require("../../../../core/context");
const create_time_slot_command_1 = require("../create-time-slot.command");
const commands_1 = require("../../../activity/commands");
const time_slot_merge_command_1 = require("./../time-slot-merge.command");
const type_orm_employee_repository_1 = require("../../../../employee/repository/type-orm-employee.repository");
const type_orm_time_log_repository_1 = require("../../../time-log/repository/type-orm-time-log.repository");
const mikro_orm_time_log_repository_1 = require("../../../time-log/repository/mikro-orm-time-log.repository");
const type_orm_time_slot_repository_1 = require("../../repository/type-orm-time-slot.repository");
const mikro_orm_time_slot_repository_1 = require("../../repository/mikro-orm-time-slot.repository");
const time_slot_entity_1 = require("./../../time-slot.entity");
let CreateTimeSlotHandler = class CreateTimeSlotHandler {
    constructor(typeOrmTimeSlotRepository, mikroOrmTimeSlotRepository, typeOrmTimeLogRepository, mikroOrmTimeLogRepository, typeOrmEmployeeRepository, _commandBus) {
        this.typeOrmTimeSlotRepository = typeOrmTimeSlotRepository;
        this.mikroOrmTimeSlotRepository = mikroOrmTimeSlotRepository;
        this.typeOrmTimeLogRepository = typeOrmTimeLogRepository;
        this.mikroOrmTimeLogRepository = mikroOrmTimeLogRepository;
        this.typeOrmEmployeeRepository = typeOrmEmployeeRepository;
        this._commandBus = _commandBus;
        this.ormType = (0, utils_2.getORMType)();
        this.logging = true;
    }
    /**
     * Executes the creation or retrieval of a time slot for the given command.
     * It manages the retrieval of existing time slots, time logs, and activities,
     * handles permissions, and ensures the time slot is created or updated appropriately.
     * Also, it merges the time slot into a 10-minute interval if applicable.
     *
     * @param {CreateTimeSlotCommand} command - The command containing the input parameters for the time slot creation.
     * @returns {Promise<TimeSlot>} - A promise that resolves to the created or updated TimeSlot instance.
     */
    async execute(command) {
        const { input, forceDelete } = command;
        let { organizationId, employeeId, projectId, activities = [], source = contracts_1.TimeLogSourceEnum.DESKTOP, logType = contracts_1.TimeLogType.TRACKED } = input;
        this.log(`Time Slot Request - Input: ${JSON.stringify(input)}`);
        const tenantId = context_1.RequestContext.currentTenantId() || input.tenantId; // Retrieve the current tenant ID
        const user = context_1.RequestContext.currentUser(); // Retrieve the current user
        const hasChangeEmployeePermission = context_1.RequestContext.hasPermission(contracts_1.PermissionsEnum.CHANGE_SELECTED_EMPLOYEE);
        // Check if the logged user does not have employee selection permission
        if (!hasChangeEmployeePermission || ((0, utils_1.isEmpty)(employeeId) && context_1.RequestContext.currentEmployeeId())) {
            // Assign current employeeId if not provided in the request payload
            employeeId = context_1.RequestContext.currentEmployeeId();
        }
        // A time slot always belongs to an employee (NOT NULL column). Fail here rather than later:
        // an empty id used to be dropped from the employee lookup below, which then resolved the
        // FIRST employee of the tenant and built the slot in that employee's organization.
        if ((0, utils_1.isEmpty)(employeeId)) {
            throw new common_1.BadRequestException('Employee context is required to create a time slot');
        }
        /*
         * If organization not found in request then assign current logged user organization
         */
        if ((0, utils_1.isEmpty)(organizationId)) {
            const employee = await this.typeOrmEmployeeRepository.findOneBy({ id: employeeId, tenantId });
            if (!employee) {
                throw new common_1.NotFoundException('Employee not found or not in tenant');
            }
            organizationId = employee.organizationId || context_1.RequestContext.currentOrganizationId();
        }
        // Input.startedAt is a string, so convert it to a Date object
        input.startedAt = moment(input.startedAt).utc().set('millisecond', 0).toDate();
        // Define the minimum and maximum dates for the time slot
        const minDate = input.startedAt;
        const maxDate = input.startedAt;
        let timeSlot;
        try {
            switch (this.ormType) {
                case utils_2.MultiORMEnum.MikroORM: {
                    const em = this.mikroOrmTimeSlotRepository.getEntityManager();
                    const found = await em.findOneOrFail('TimeSlot', {
                        tenantId,
                        organizationId,
                        employeeId,
                        startedAt: input.startedAt
                    }, {
                        populate: ['timeLogs']
                    });
                    timeSlot = found;
                    break;
                }
                case utils_2.MultiORMEnum.TypeORM:
                default: {
                    // Find TimeLog for TimeSlot Range
                    const query = this.typeOrmTimeSlotRepository.createQueryBuilder();
                    query.leftJoinAndSelect(`${query.alias}.timeLogs`, 'timeLogs');
                    // Add where clauses
                    query.where((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."tenantId" = :tenantId`), { tenantId });
                    query.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."organizationId" = :organizationId`), { organizationId });
                    query.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."employeeId" = :employeeId`), { employeeId });
                    query.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."startedAt" = :startedAt`), { startedAt: input.startedAt });
                    this.log(`Get Time Slot Query & Parameters For employee (${user.name}): ${query.getQueryAndParameters()}`);
                    // Get the last time slot
                    timeSlot = await query.getOneOrFail();
                    break;
                }
            }
        }
        catch (error) {
            // Create a new TimeSlot instance if not found
            timeSlot = new time_slot_entity_1.TimeSlot({
                ...(0, underscore_1.omit)(input, ['timeLogId']),
                tenantId,
                organizationId,
                employeeId,
                timeLogs: []
            });
        }
        try {
            switch (this.ormType) {
                case utils_2.MultiORMEnum.MikroORM: {
                    const em = this.mikroOrmTimeLogRepository.getEntityManager();
                    // Find TimeLog for TimeSlot Range
                    const timeLog = await em.findOneOrFail('TimeLog', {
                        tenantId,
                        organizationId,
                        employeeId,
                        source,
                        logType,
                        stoppedAt: { $ne: null }
                    }, {
                        orderBy: { createdAt: 'DESC' }
                    });
                    this.log(`Found timelog for specific timeLog: ${JSON.stringify(timeLog)}`);
                    timeSlot.timeLogs.push(timeLog);
                    break;
                }
                case utils_2.MultiORMEnum.TypeORM:
                default: {
                    // Find TimeLog for TimeSlot Range
                    const query = this.typeOrmTimeLogRepository.createQueryBuilder();
                    // Add where clauses
                    query.where((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."tenantId" = :tenantId`), { tenantId });
                    query.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."organizationId" = :organizationId`), { organizationId });
                    query.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."employeeId" = :employeeId`), { employeeId });
                    query.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."source" = :source`), { source });
                    query.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."logType" = :logType`), { logType });
                    query.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."stoppedAt" IS NOT NULL`));
                    // Add order by clause
                    query.addOrderBy((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."createdAt"`), 'DESC');
                    this.log(`Find timelog for specific query: ${query.getQueryAndParameters()}`);
                    // Get the last time log
                    const timeLog = await query.getOneOrFail();
                    this.log(`Found timelog for specific timeLog: ${JSON.stringify(timeLog)}`);
                    timeSlot.timeLogs.push(timeLog);
                    break;
                }
            }
        }
        catch (error) {
            if (input.timeLogId) {
                // Convert input.timeLogId to an array if it's not already
                const timeLogIds = [].concat(input.timeLogId);
                switch (this.ormType) {
                    case utils_2.MultiORMEnum.MikroORM: {
                        const em = this.mikroOrmTimeLogRepository.getEntityManager();
                        const timeLogs = await em.find('TimeLog', {
                            id: { $in: timeLogIds },
                            tenantId,
                            organizationId,
                            source,
                            logType,
                            employeeId,
                            stoppedAt: { $ne: null }
                        });
                        this.log(`Recent time logs using timelog ids for employee (${user.name}): ${JSON.stringify(timeLogs)}`);
                        timeSlot.timeLogs.push(...timeLogs);
                        break;
                    }
                    case utils_2.MultiORMEnum.TypeORM:
                    default: {
                        // Reuse the base query and add the condition for timeLogIds
                        const query = this.typeOrmTimeLogRepository.createQueryBuilder();
                        // Add where clauses
                        query.where((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."id" IN (:...timeLogIds)`), { timeLogIds });
                        query.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."tenantId" = :tenantId`), { tenantId });
                        query.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."organizationId" = :organizationId`), { organizationId });
                        query.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."source" = :source`), { source });
                        query.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."logType" = :logType`), { logType });
                        query.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."employeeId" = :employeeId`), { employeeId });
                        query.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."stoppedAt" IS NOT NULL`));
                        this.log(`Timelog query for timeLog IDs for employee (${user.name}): ${query.getQueryAndParameters()}`);
                        // Retrieve time logs
                        const timeLogs = await query.getMany();
                        this.log(`Recent time logs using timelog ids for employee (${user.name}): ${JSON.stringify(timeLogs)}`);
                        timeSlot.timeLogs.push(...timeLogs);
                        break;
                    }
                }
            }
        }
        // Map only running time logs to an array of IDs
        const ids = timeSlot.timeLogs.filter((log) => log.isRunning).map((log) => log.id);
        // Set stoppedAt to current time
        const stoppedAt = moment.utc().toDate();
        // Only update running timer
        if ((0, utils_1.isNotEmpty)(ids)) {
            switch (this.ormType) {
                case utils_2.MultiORMEnum.MikroORM: {
                    const knex = this.mikroOrmTimeLogRepository.getKnex();
                    await knex('time_log')
                        .withSchema(knex.userParams.schema)
                        .whereIn('id', ids)
                        .andWhere('isRunning', true)
                        .update({ stoppedAt });
                    break;
                }
                case utils_2.MultiORMEnum.TypeORM:
                default:
                    await this.typeOrmTimeLogRepository.update({
                        id: (0, typeorm_1.In)(ids),
                        isRunning: true
                    }, { stoppedAt });
                    break;
            }
        }
        this.log(`Bulk activities save parameters employee (${user.name}): ${JSON.stringify({ activities })}`);
        // Save bulk activities
        const bulkActivities = await this._commandBus.execute(new commands_1.BulkActivitiesSaveCommand({
            organizationId,
            employeeId,
            activities,
            projectId
        }));
        // Update the time slot's activities
        timeSlot.activities = bulkActivities || [];
        // Save the time slot
        switch (this.ormType) {
            case utils_2.MultiORMEnum.MikroORM: {
                const em = this.mikroOrmTimeSlotRepository.getEntityManager();
                await em.persistAndFlush(timeSlot);
                break;
            }
            case utils_2.MultiORMEnum.TypeORM:
            default:
                await this.typeOrmTimeSlotRepository.save(timeSlot);
                break;
        }
        // Merge timeSlots into 10 minutes slots
        let [mergedTimeSlot] = await this._commandBus.execute(new time_slot_merge_command_1.TimeSlotMergeCommand(organizationId, employeeId, minDate, maxDate, forceDelete));
        this.log(`Newly Created Merged Time Slots: ${JSON.stringify(mergedTimeSlot)}`);
        if (mergedTimeSlot) {
            timeSlot = mergedTimeSlot;
        }
        switch (this.ormType) {
            case utils_2.MultiORMEnum.MikroORM: {
                const em = this.mikroOrmTimeSlotRepository.getEntityManager();
                return await em.findOne('TimeSlot', { id: timeSlot.id }, {
                    populate: ['timeLogs', 'screenshots']
                });
            }
            case utils_2.MultiORMEnum.TypeORM:
            default:
                return await this.typeOrmTimeSlotRepository.findOne({
                    where: { id: timeSlot.id },
                    relations: { timeLogs: true, screenshots: true }
                });
        }
    }
    /**
     * Private method for logging messages.
     * @param message - The message to be logged.
     */
    log(message) {
        if (this.logging) {
            console.log(chalk.green(`${moment().format('DD.MM.YYYY HH:mm:ss')}`));
            console.log(chalk.green(message));
            console.log(chalk.white('--------------------------------------------------------'));
            console.log(); // Add an empty line as a divider
        }
    }
};
exports.CreateTimeSlotHandler = CreateTimeSlotHandler;
exports.CreateTimeSlotHandler = CreateTimeSlotHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(create_time_slot_command_1.CreateTimeSlotCommand),
    tslib_1.__metadata("design:paramtypes", [type_orm_time_slot_repository_1.TypeOrmTimeSlotRepository,
        mikro_orm_time_slot_repository_1.MikroOrmTimeSlotRepository,
        type_orm_time_log_repository_1.TypeOrmTimeLogRepository,
        mikro_orm_time_log_repository_1.MikroOrmTimeLogRepository,
        type_orm_employee_repository_1.TypeOrmEmployeeRepository,
        cqrs_1.CommandBus])
], CreateTimeSlotHandler);
//# sourceMappingURL=create-time-slot.handler.js.map