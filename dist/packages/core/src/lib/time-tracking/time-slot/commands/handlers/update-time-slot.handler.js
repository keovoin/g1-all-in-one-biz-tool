"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTimeSlotHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const moment = require("moment");
const contracts_1 = require("@gauzy/contracts");
const context_1 = require("../../../../core/context");
const activity_entity_1 = require("../../../activity/activity.entity");
const update_time_slot_command_1 = require("../update-time-slot.command");
const type_orm_time_slot_repository_1 = require("../../repository/type-orm-time-slot.repository");
const type_orm_activity_repository_1 = require("../../../activity/repository/type-orm-activity.repository");
let UpdateTimeSlotHandler = class UpdateTimeSlotHandler {
    constructor(typeOrmTimeSlotRepository, typeOrmActivityRepository) {
        this.typeOrmTimeSlotRepository = typeOrmTimeSlotRepository;
        this.typeOrmActivityRepository = typeOrmActivityRepository;
    }
    async execute(command) {
        const { input, id } = command;
        let employeeId = input.employeeId;
        if (!context_1.RequestContext.hasPermission(contracts_1.PermissionsEnum.CHANGE_SELECTED_EMPLOYEE)) {
            const user = context_1.RequestContext.currentUser();
            employeeId = user.employeeId;
        }
        let timeSlot = await this.typeOrmTimeSlotRepository.findOne({
            where: {
                ...(employeeId ? { employeeId: employeeId } : {}),
                id: id
            }
        });
        if (timeSlot) {
            if (input.startedAt) {
                input.startedAt = moment(input.startedAt)
                    //.set('minute', 0)
                    .set('millisecond', 0)
                    .toDate();
            }
            let newActivities = [];
            if (input.activities) {
                newActivities = input.activities.map((activity) => {
                    activity = new activity_entity_1.Activity(activity);
                    activity.employeeId = timeSlot.employeeId;
                    activity.tenantId = context_1.RequestContext.currentTenantId();
                    return activity;
                });
                await this.typeOrmActivityRepository.save(newActivities);
                input.activities = (timeSlot.activities || []).concat(newActivities);
            }
            await this.typeOrmTimeSlotRepository.update(id, input);
            timeSlot = await this.typeOrmTimeSlotRepository.findOne({
                where: {
                    ...(employeeId ? { employeeId } : {}),
                    id
                },
                relations: {
                    timeLogs: true,
                    screenshots: true,
                    activities: true
                }
            });
            return timeSlot;
        }
        else {
            return null;
        }
    }
};
exports.UpdateTimeSlotHandler = UpdateTimeSlotHandler;
exports.UpdateTimeSlotHandler = UpdateTimeSlotHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(update_time_slot_command_1.UpdateTimeSlotCommand),
    tslib_1.__metadata("design:paramtypes", [type_orm_time_slot_repository_1.TypeOrmTimeSlotRepository,
        type_orm_activity_repository_1.TypeOrmActivityRepository])
], UpdateTimeSlotHandler);
//# sourceMappingURL=update-time-slot.handler.js.map