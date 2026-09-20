"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityCreateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const moment = require("moment");
const typeorm_1 = require("typeorm");
const contracts_1 = require("@gauzy/contracts");
const commands_1 = require("./../../../time-slot/commands");
const activity_create_command_1 = require("../activity-create.command");
const activity_service_1 = require("./../../../activity/activity.service");
const time_slot_service_1 = require("./../../../time-slot/time-slot.service");
const context_1 = require("./../../../../core/context");
let ActivityCreateHandler = class ActivityCreateHandler {
    constructor(_activityService, _timeSlotService, _commandBus) {
        this._activityService = _activityService;
        this._timeSlotService = _timeSlotService;
        this._commandBus = _commandBus;
    }
    async execute(command) {
        try {
            const { input } = command;
            const { title, duration, type, projectId, date, time, employeeId, taskId, organizationId, activityTimestamp } = input;
            const tenantId = context_1.RequestContext.currentTenantId();
            const startedAt = moment(moment.utc(activityTimestamp).format('YYYY-MM-DD HH:mm:ss')).toDate();
            const stoppedAt = moment(moment.utc(activityTimestamp).add(10, 'minutes').format('YYYY-MM-DD HH:mm:ss')).toDate();
            let timeSlot;
            try {
                timeSlot = await this._timeSlotService.findOneByOptions({
                    where: {
                        employeeId,
                        organizationId,
                        tenantId,
                        startedAt: (0, typeorm_1.Between)(startedAt, stoppedAt),
                    }
                });
            }
            catch (error) {
                timeSlot = await this._commandBus.execute(new commands_1.TimeSlotCreateCommand({
                    tenantId,
                    organizationId,
                    employeeId,
                    duration: 0,
                    keyboard: 0,
                    mouse: 0,
                    overall: 0,
                    startedAt: new Date(moment.utc(activityTimestamp).format()),
                    time_slot: new Date(moment.utc(activityTimestamp).format())
                }));
            }
            return await this._activityService.create({
                title,
                duration,
                type,
                date,
                time,
                projectId,
                employeeId,
                taskId,
                organizationId,
                timeSlot
            });
        }
        catch (error) {
            throw new common_1.BadRequestException(error, `Can'\t create ${contracts_1.IntegrationEntity.ACTIVITY} for ${contracts_1.IntegrationEntity.TIME_SLOT}`);
        }
    }
};
exports.ActivityCreateHandler = ActivityCreateHandler;
exports.ActivityCreateHandler = ActivityCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(activity_create_command_1.ActivityCreateCommand),
    tslib_1.__metadata("design:paramtypes", [activity_service_1.ActivityService,
        time_slot_service_1.TimeSlotService,
        cqrs_1.CommandBus])
], ActivityCreateHandler);
//# sourceMappingURL=activity-create.handler.js.map