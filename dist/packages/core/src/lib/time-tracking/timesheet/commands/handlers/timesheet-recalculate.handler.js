"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimesheetRecalculateHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const typeorm_1 = require("typeorm");
const moment = require("moment");
const timesheet_service_1 = require("../../timesheet.service");
const timesheet_recalculate_command_1 = require("../timesheet-recalculate.command");
const context_1 = require("./../../../../core/context");
const utils_1 = require("./../../../../core/utils");
const database_helper_1 = require("./../../../../database/database.helper");
const type_orm_time_slot_repository_1 = require("../../../time-slot/repository/type-orm-time-slot.repository");
const mikro_orm_time_slot_repository_1 = require("../../../time-slot/repository/mikro-orm-time-slot.repository");
let TimesheetRecalculateHandler = class TimesheetRecalculateHandler {
    constructor(timesheetService, typeOrmTimeSlotRepository, mikroOrmTimeSlotRepository) {
        this.timesheetService = timesheetService;
        this.typeOrmTimeSlotRepository = typeOrmTimeSlotRepository;
        this.mikroOrmTimeSlotRepository = mikroOrmTimeSlotRepository;
        this.ormType = (0, utils_1.getORMType)();
    }
    /**
     * Executes the `TimesheetRecalculateCommand` to recalculate timesheet data.
     *
     * @param {TimesheetRecalculateCommand} command - The command containing necessary parameters for recalculating a timesheet.
     * @returns {Promise<ITimesheet>} - A promise resolving to the updated timesheet after recalculations.
     *
     * @description
     * This method processes the given command to recalculate the timesheet based on updated time logs,
     * adjustments, or other relevant criteria. It ensures that the total worked hours, breaks,
     * and billable time are accurately computed.
     *
     * @example
     * ```ts
     * const command = new TimesheetRecalculateCommand(timesheetId);
     * const updatedTimesheet = await timesheetService.execute(command);
     * console.log(updatedTimesheet);
     * ```
     */
    async execute(command) {
        const { id } = command;
        // TimeLog.timesheetId is nullable: a log without a timesheet has nothing to recalculate. An
        // empty id used to be dropped from the lookup, so the FIRST timesheet of the tenant was loaded
        // and overwritten with totals computed for a different employee window.
        if (!id) {
            return null;
        }
        const timesheet = await this.timesheetService.findOneByIdString(id);
        const tenantId = context_1.RequestContext.currentTenantId();
        const { employeeId, organizationId } = timesheet;
        const { start: startedAt, end: stoppedAt } = (0, utils_1.getDateRangeFormat)(moment.utc(timesheet.startedAt), moment.utc(timesheet.stoppedAt));
        let timeSlot;
        switch (this.ormType) {
            case utils_1.MultiORMEnum.MikroORM: {
                const knex = this.mikroOrmTimeSlotRepository.getKnex();
                timeSlot = await knex('time_slot')
                    .withSchema(knex.userParams.schema)
                    .select(knex.raw('SUM(duration) as duration'))
                    .select(knex.raw('AVG(keyboard) as keyboard'))
                    .select(knex.raw('AVG(mouse) as mouse'))
                    .select(knex.raw('AVG(overall) as overall'))
                    .where({
                    employeeId,
                    organizationId,
                    tenantId
                })
                    .andWhere('startedAt', '>=', startedAt)
                    .andWhere('startedAt', '<', stoppedAt)
                    .first();
                break;
            }
            case utils_1.MultiORMEnum.TypeORM:
            default: {
                const query = this.typeOrmTimeSlotRepository.createQueryBuilder();
                timeSlot = await query
                    .select('SUM(duration)', 'duration')
                    .addSelect('AVG(keyboard)', 'keyboard')
                    .addSelect('AVG(mouse)', 'mouse')
                    .addSelect('AVG(overall)', 'overall')
                    .where(new typeorm_1.Brackets((qb) => {
                    qb.where((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."employeeId" = :employeeId
								   AND "${query.alias}"."organizationId" = :organizationId
								   AND "${query.alias}"."tenantId" = :tenantId
								   AND "${query.alias}"."startedAt" >= :startedAt
								   AND "${query.alias}"."startedAt" < :stoppedAt`), { employeeId, organizationId, tenantId, startedAt, stoppedAt });
                }))
                    .getRawOne();
                break;
            }
        }
        try {
            await this.timesheetService.update(id, {
                duration: Math.round(timeSlot.duration || 0),
                keyboard: Math.round(timeSlot.keyboard || 0),
                mouse: Math.round(timeSlot.mouse || 0),
                overall: Math.round(timeSlot.overall || 0)
            });
        }
        catch (error) {
            throw new common_1.BadRequestException(`Can\'t update timesheet for employee-${employeeId} of organization-${organizationId}`);
        }
        return await this.timesheetService.findOneByIdString(id);
    }
};
exports.TimesheetRecalculateHandler = TimesheetRecalculateHandler;
exports.TimesheetRecalculateHandler = TimesheetRecalculateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(timesheet_recalculate_command_1.TimesheetRecalculateCommand),
    tslib_1.__metadata("design:paramtypes", [timesheet_service_1.TimeSheetService,
        type_orm_time_slot_repository_1.TypeOrmTimeSlotRepository,
        mikro_orm_time_slot_repository_1.MikroOrmTimeSlotRepository])
], TimesheetRecalculateHandler);
//# sourceMappingURL=timesheet-recalculate.handler.js.map