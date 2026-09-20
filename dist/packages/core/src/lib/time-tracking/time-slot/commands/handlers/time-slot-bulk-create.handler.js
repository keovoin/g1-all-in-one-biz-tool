"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeSlotBulkCreateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const typeorm_1 = require("typeorm");
const moment = require("moment");
const underscore_1 = require("underscore");
const time_slot_bulk_create_command_1 = require("./../time-slot-bulk-create.command");
const time_slot_merge_command_1 = require("./../time-slot-merge.command");
const context_1 = require("../../../../core/context");
const utils_1 = require("./../../../../core/utils");
const type_orm_time_slot_repository_1 = require("../../repository/type-orm-time-slot.repository");
const type_orm_time_log_repository_1 = require("../../../time-log/repository/type-orm-time-log.repository");
let TimeSlotBulkCreateHandler = class TimeSlotBulkCreateHandler {
    constructor(typeOrmTimeLogRepository, typeOrmTimeSlotRepository, commandBus) {
        this.typeOrmTimeLogRepository = typeOrmTimeLogRepository;
        this.typeOrmTimeSlotRepository = typeOrmTimeSlotRepository;
        this.commandBus = commandBus;
    }
    async execute(command) {
        let { slots, employeeId, organizationId, tenantId } = command;
        if (slots.length === 0) {
            return [];
        }
        slots = slots.map((slot) => {
            const { start } = (0, utils_1.getDateRangeFormat)(moment.utc(slot.startedAt), moment.utc(slot.startedAt));
            slot.startedAt = start;
            return slot;
        });
        tenantId = tenantId || context_1.RequestContext.currentTenantId();
        const insertedSlots = await this.typeOrmTimeSlotRepository.find({
            where: {
                startedAt: (0, typeorm_1.In)((0, underscore_1.pluck)(slots, 'startedAt')),
                tenantId,
                organizationId,
                employeeId
            }
        });
        if (insertedSlots.length > 0) {
            slots = slots.filter((slot) => !insertedSlots.find((insertedSlot) => moment(insertedSlot.startedAt).isSame(moment(slot.startedAt))));
        }
        if (slots.length === 0) {
            return [];
        }
        const timeLogs = await this.typeOrmTimeLogRepository.find({
            where: {
                id: (0, typeorm_1.In)((0, underscore_1.chain)(slots).pluck('timeLogId').flatten().value().filter(Boolean)),
                organizationId,
                employeeId,
                tenantId
            }
        });
        slots = slots.map((slot) => {
            let timeLogIds;
            if (slot.timeLogId instanceof Array) {
                timeLogIds = slot.timeLogId;
            }
            else {
                timeLogIds = [slot.timeLogId];
            }
            slot.timeLogs = [];
            for (const timeLogId of timeLogIds) {
                slot.timeLogs.push(...(0, underscore_1.where)(timeLogs, { id: timeLogId }));
            }
            slot.organizationId = organizationId;
            slot.tenantId = tenantId;
            return slot;
        });
        if (slots.length > 0) {
            await this.typeOrmTimeSlotRepository.save(slots);
        }
        slots = insertedSlots.concat(slots);
        const dates = slots.map((slot) => moment(slot.startedAt).toDate());
        const minDate = dates.reduce(function (a, b) {
            return a < b ? a : b;
        });
        const maxDate = dates.reduce(function (a, b) {
            return a > b ? a : b;
        });
        return await this.commandBus.execute(new time_slot_merge_command_1.TimeSlotMergeCommand(organizationId, employeeId, minDate, maxDate));
    }
};
exports.TimeSlotBulkCreateHandler = TimeSlotBulkCreateHandler;
exports.TimeSlotBulkCreateHandler = TimeSlotBulkCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(time_slot_bulk_create_command_1.TimeSlotBulkCreateCommand),
    tslib_1.__metadata("design:paramtypes", [type_orm_time_log_repository_1.TypeOrmTimeLogRepository,
        type_orm_time_slot_repository_1.TypeOrmTimeSlotRepository,
        cqrs_1.CommandBus])
], TimeSlotBulkCreateHandler);
//# sourceMappingURL=time-slot-bulk-create.handler.js.map