"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeLogCreateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const moment = require("moment");
const contracts_1 = require("@gauzy/contracts");
const time_slot_service_1 = require("../../../time-slot/time-slot.service");
const commands_1 = require("../../../timesheet/commands");
const update_employee_total_worked_hours_command_1 = require("../../commands/update-employee-total-worked-hours.command");
const context_1 = require("../../../../core/context");
const time_log_service_1 = require("../../time-log.service");
const time_log_entity_1 = require("../../time-log.entity");
const time_log_create_command_1 = require("../time-log-create.command");
const mikro_orm_time_log_repository_1 = require("../../repository/mikro-orm-time-log.repository");
const type_orm_time_log_repository_1 = require("../../repository/type-orm-time-log.repository");
let TimeLogCreateHandler = class TimeLogCreateHandler {
    constructor(typeOrmTimeLogRepository, mikroOrmTimeLogRepository, _commandBus, _timeSlotService, _timeLogService) {
        this.typeOrmTimeLogRepository = typeOrmTimeLogRepository;
        this.mikroOrmTimeLogRepository = mikroOrmTimeLogRepository;
        this._commandBus = _commandBus;
        this._timeSlotService = _timeSlotService;
        this._timeLogService = _timeLogService;
    }
    /**
     * Handles the execution of the TimeLogCreateCommand
     *
     * @param command TimeLogCreateCommand
     * @returns Promise<TimeLog>
     */
    async execute(command) {
        const { input } = command;
        const { startedAt, employeeId, organizationId, stoppedAt, timeSlots: inputTimeSlots } = input;
        // Retrieve the tenant ID from the current context or the provided one in the input
        const tenantId = context_1.RequestContext.currentTenantId() || input.tenantId;
        // Create timesheet if it doesn't exist
        const timesheet = await this._commandBus.execute(new commands_1.TimesheetFirstOrCreateCommand(startedAt, employeeId, organizationId));
        // Create time log entity
        const timeLog = this.createTimeLogEntity(input, tenantId, timesheet);
        // Generate blank time slots if stoppedAt is provided
        let generatedTimeSlots = stoppedAt ? this.generateBlankTimeSlots(input, tenantId) : [];
        // Merge input time slots with generated blank slots
        const mergeTimeSlots = this.mergeTimeSlots(generatedTimeSlots, inputTimeSlots, employeeId, organizationId, tenantId);
        // Bulk create time slots
        timeLog.timeSlots = await this._timeSlotService.bulkCreate(mergeTimeSlots, employeeId, organizationId);
        await this.typeOrmTimeLogRepository.save(timeLog);
        // Recalculate timesheet activity
        await this.recalculateTimesheet(timesheet);
        // Update total worked hours for the employee
        await this.updateEmployeeTotalWorkedHours(employeeId);
        // Return the newly created time log
        return await this._timeLogService.findOneByIdString(timeLog.id);
    }
    /**
     * Creates a new TimeLog entity based on the provided input
     *
     * @param input Partial<TimeLog>
     * @param tenantId ID
     * @param timesheet ITimesheet
     * @returns TimeLog
     */
    createTimeLogEntity(input, tenantId, timesheet) {
        const { startedAt, stoppedAt, employeeId, organizationId, projectId, taskId, organizationContactId, organizationTeamId, logType = contracts_1.TimeLogType.MANUAL, description = null, reason = null, isBillable = false, source = contracts_1.TimeLogSourceEnum.WEB_TIMER, version = null, isRunning = source === contracts_1.TimeLogSourceEnum.DESKTOP } = input;
        console.log('create new time log with', { input, tenantId, timesheet });
        return new time_log_entity_1.TimeLog({
            startedAt: moment.utc(startedAt).toDate(),
            stoppedAt: stoppedAt ? moment.utc(stoppedAt).toDate() : undefined,
            timesheet,
            organizationId,
            tenantId,
            employeeId,
            projectId,
            taskId,
            organizationContactId,
            organizationTeamId,
            logType,
            description,
            reason,
            isBillable,
            source,
            version,
            isRunning
        });
    }
    /**
     * Generates blank time slots between startedAt and stoppedAt
     * @param input Partial<TimeLog>
     * @param tenantId string
     * @returns ITimeSlot[]
     */
    generateBlankTimeSlots(input, tenantId) {
        const { startedAt, stoppedAt, employeeId, organizationId } = input;
        // Generate time slots between startedAt and stoppedAt
        return this._timeSlotService.generateTimeSlots(startedAt, stoppedAt).map((slot) => ({
            ...slot,
            employeeId,
            organizationId,
            tenantId,
            keyboard: 0,
            mouse: 0,
            overall: 0
        }));
    }
    /**
     * Merges input time slots with generated blank slots
     * @param generatedSlots ITimeSlot[]
     * @param inputSlots ITimeSlot[]
     * @param employeeId ID
     * @param organizationId ID
     * @param tenantId ID
     * @returns ITimeSlot[]
     */
    mergeTimeSlots(generatedSlots, inputSlots = [], employeeId, organizationId, tenantId) {
        const standardizedInputSlots = inputSlots.map((slot) => ({
            ...slot,
            employeeId,
            organizationId,
            tenantId
        }));
        return generatedSlots.map((blankSlot) => {
            const matchingSlot = standardizedInputSlots.find((slot) => moment(slot.startedAt).isSame(blankSlot.startedAt));
            return matchingSlot ? { ...matchingSlot } : blankSlot;
        });
    }
    /**
     * Recalculates the timesheet activity
     * @param timesheet ITimesheet
     */
    async recalculateTimesheet(timesheet) {
        if (timesheet?.id) {
            await this._commandBus.execute(new commands_1.TimesheetRecalculateCommand(timesheet.id));
        }
    }
    /**
     * Updates total worked hours for the employee
     *
     * @param employeeId ID
     */
    async updateEmployeeTotalWorkedHours(employeeId) {
        await this._commandBus.execute(new update_employee_total_worked_hours_command_1.UpdateEmployeeTotalWorkedHoursCommand(employeeId));
    }
};
exports.TimeLogCreateHandler = TimeLogCreateHandler;
exports.TimeLogCreateHandler = TimeLogCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(time_log_create_command_1.TimeLogCreateCommand),
    tslib_1.__metadata("design:paramtypes", [type_orm_time_log_repository_1.TypeOrmTimeLogRepository,
        mikro_orm_time_log_repository_1.MikroOrmTimeLogRepository,
        cqrs_1.CommandBus,
        time_slot_service_1.TimeSlotService,
        time_log_service_1.TimeLogService])
], TimeLogCreateHandler);
//# sourceMappingURL=time-log-create.handler.js.map