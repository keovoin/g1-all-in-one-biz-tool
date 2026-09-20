"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityUpdateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const contracts_1 = require("@gauzy/contracts");
const activity_update_command_1 = require("../activity-update.command");
const activity_service_1 = require("./../../../activity/activity.service");
let ActivityUpdateHandler = class ActivityUpdateHandler {
    constructor(_activityService) {
        this._activityService = _activityService;
    }
    async execute(command) {
        try {
            const { input } = command;
            const { id, title, duration, type, date, time, projectId, employeeId, taskId } = input;
            return await this._activityService.create({
                id,
                title,
                duration,
                type,
                date,
                time,
                projectId,
                employeeId,
                taskId
            });
        }
        catch (error) {
            throw new common_1.BadRequestException(error, `Can'\t update ${contracts_1.IntegrationEntity.ACTIVITY} for ${contracts_1.IntegrationEntity.TIME_SLOT}`);
        }
    }
};
exports.ActivityUpdateHandler = ActivityUpdateHandler;
exports.ActivityUpdateHandler = ActivityUpdateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(activity_update_command_1.ActivityUpdateCommand),
    tslib_1.__metadata("design:paramtypes", [activity_service_1.ActivityService])
], ActivityUpdateHandler);
//# sourceMappingURL=activity-update.handler.js.map