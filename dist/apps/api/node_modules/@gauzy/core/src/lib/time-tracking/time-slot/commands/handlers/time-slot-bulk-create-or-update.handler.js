"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeSlotBulkCreateOrUpdateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const typeorm_1 = require("typeorm");
const moment = require("moment");
const _ = require("underscore");
const utils_1 = require("@gauzy/utils");
const time_slot_bulk_create_or_update_command_1 = require("./../time-slot-bulk-create-or-update.command");
const context_1 = require("../../../../core/context");
const time_slot_merge_command_1 = require("./../time-slot-merge.command");
const type_orm_time_log_repository_1 = require("../../../time-log/repository/type-orm-time-log.repository");
const type_orm_time_slot_repository_1 = require("../../repository/type-orm-time-slot.repository");
const type_orm_employee_repository_1 = require("../../../../employee/repository/type-orm-employee.repository");
let TimeSlotBulkCreateOrUpdateHandler = class TimeSlotBulkCreateOrUpdateHandler {
    constructor(typeOrmTimeLogRepository, typeOrmTimeSlotRepository, typeOrmEmployeeRepository, commandBus) {
        this.typeOrmTimeLogRepository = typeOrmTimeLogRepository;
        this.typeOrmTimeSlotRepository = typeOrmTimeSlotRepository;
        this.typeOrmEmployeeRepository = typeOrmEmployeeRepository;
        this.commandBus = commandBus;
    }
    async execute(command) {
        let { slots, employeeId, organizationId, tenantId } = command;
        if (slots.length === 0) {
            return [];
        }
        slots = slots.map((slot) => {
            slot.startedAt = moment.utc(slot.startedAt).toDate();
            return slot;
        });
        tenantId = tenantId || context_1.RequestContext.currentTenantId();
        /**
         * If organizationId is not provided, fallback to employee's organizationId
         */
        if ((0, utils_1.isEmpty)(organizationId)) {
            const employee = await this.typeOrmEmployeeRepository.findOneBy({
                id: employeeId,
                tenantId
            });
            organizationId = employee.organizationId;
        }
        const insertedSlots = await this.typeOrmTimeSlotRepository.find({
            where: {
                startedAt: (0, typeorm_1.In)(_.pluck(slots, 'startedAt')),
                tenantId,
                organizationId,
                employeeId
            },
            relations: {
                timeLogs: true
            }
        });
        const newSlotsTimeLogIds = _.chain(slots)
            .map((slot) => _.pluck(slot.timeLogs, 'id'))
            .flatten()
            .value();
        const oldSlotsTimeLogIds = _.chain(insertedSlots)
            .map((slot) => _.pluck(slot.timeLogs, 'id'))
            .flatten()
            .value();
        const timeLogIds = _.chain(oldSlotsTimeLogIds).concat(newSlotsTimeLogIds).uniq().values().value();
        const timeLogs = await this.typeOrmTimeLogRepository.find({
            where: {
                id: (0, typeorm_1.In)(timeLogIds),
                tenantId,
                organizationId,
                employeeId
            }
        });
        if (insertedSlots.length > 0) {
            slots = slots.map((slot) => {
                const oldSlot = insertedSlots.find((insertedSlot) => moment(insertedSlot.startedAt).format('YYYY-MM-DD HH:mm') ===
                    moment(slot.startedAt).format('YYYY-MM-DD HH:mm'));
                if (oldSlot) {
                    oldSlot.keyboard = oldSlot.keyboard + slot.keyboard;
                    oldSlot.mouse = oldSlot.mouse + slot.mouse;
                    oldSlot.overall = oldSlot.overall + slot.overall;
                    const foundTimeLogs = _.where(timeLogs, {
                        id: oldSlotsTimeLogIds
                    });
                    if (foundTimeLogs.length > 0) {
                        oldSlot.timeLogs = oldSlot.timeLogs.concat(foundTimeLogs);
                        oldSlot.timeLogs = _.uniq(oldSlot.timeLogs, 'id');
                    }
                    return oldSlot;
                }
                else {
                    if (!slot.organizationId) {
                        slot.organizationId = organizationId;
                    }
                    slot.tenantId = context_1.RequestContext.currentTenantId();
                    return slot;
                }
            });
        }
        await this.typeOrmTimeSlotRepository.save(slots);
        const dates = slots.map((slot) => moment.utc(slot.startedAt).toDate());
        const minDate = dates.reduce(function (a, b) {
            return a < b ? a : b;
        });
        const maxDate = dates.reduce(function (a, b) {
            return a > b ? a : b;
        });
        return await this.commandBus.execute(new time_slot_merge_command_1.TimeSlotMergeCommand(organizationId, employeeId, minDate, maxDate));
    }
};
exports.TimeSlotBulkCreateOrUpdateHandler = TimeSlotBulkCreateOrUpdateHandler;
exports.TimeSlotBulkCreateOrUpdateHandler = TimeSlotBulkCreateOrUpdateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(time_slot_bulk_create_or_update_command_1.TimeSlotBulkCreateOrUpdateCommand),
    tslib_1.__metadata("design:paramtypes", [type_orm_time_log_repository_1.TypeOrmTimeLogRepository,
        type_orm_time_slot_repository_1.TypeOrmTimeSlotRepository,
        type_orm_employee_repository_1.TypeOrmEmployeeRepository,
        cqrs_1.CommandBus])
], TimeSlotBulkCreateOrUpdateHandler);
//# sourceMappingURL=time-slot-bulk-create-or-update.handler.js.map