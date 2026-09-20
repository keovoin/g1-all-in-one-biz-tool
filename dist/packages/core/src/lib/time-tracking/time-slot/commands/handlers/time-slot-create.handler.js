"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeSlotCreateHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const moment = require("moment");
const contracts_1 = require("@gauzy/contracts");
const time_slot_create_command_1 = require("./../time-slot-create.command");
const context_1 = require("./../../../../core/context");
const type_orm_time_slot_repository_1 = require("../../repository/type-orm-time-slot.repository");
let TimeSlotCreateHandler = class TimeSlotCreateHandler {
    constructor(typeOrmTimeSlotRepository) {
        this.typeOrmTimeSlotRepository = typeOrmTimeSlotRepository;
    }
    async execute(command) {
        const { input } = command;
        const tenantId = context_1.RequestContext.currentTenantId();
        const { employeeId, duration, keyboard, mouse, overall, time_slot, organizationId } = input;
        try {
            const entity = this.typeOrmTimeSlotRepository.create({
                employeeId,
                duration,
                keyboard,
                mouse,
                overall,
                startedAt: new Date(moment(time_slot).format('YYYY-MM-DD HH:mm:ss')),
                organizationId,
                tenantId
            });
            return await this.typeOrmTimeSlotRepository.save(entity);
        }
        catch (error) {
            throw new common_1.BadRequestException(error, `Can\'t create ${contracts_1.IntegrationEntity.TIME_SLOT}`);
        }
    }
};
exports.TimeSlotCreateHandler = TimeSlotCreateHandler;
exports.TimeSlotCreateHandler = TimeSlotCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(time_slot_create_command_1.TimeSlotCreateCommand),
    tslib_1.__metadata("design:paramtypes", [type_orm_time_slot_repository_1.TypeOrmTimeSlotRepository])
], TimeSlotCreateHandler);
//# sourceMappingURL=time-slot-create.handler.js.map