"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScreenshotCreateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const moment = require("moment");
const commands_1 = require("./../../../time-slot/commands");
const screenshot_create_command_1 = require("./../screenshot-create.command");
const screenshot_service_1 = require("./../../../screenshot/screenshot.service");
const time_slot_service_1 = require("./../../../time-slot/time-slot.service");
const context_1 = require("./../../../../core/context");
let ScreenshotCreateHandler = class ScreenshotCreateHandler {
    constructor(_screenshotService, _timeSlotService, _commandBus) {
        this._screenshotService = _screenshotService;
        this._timeSlotService = _timeSlotService;
        this._commandBus = _commandBus;
    }
    /**
     * Handles the creation of a screenshot and associates it with a time slot.
     * If a time slot does not exist for the given timestamp, a new time slot is created.
     *
     * @param {ScreenshotCreateCommand} command - The command containing the data required for screenshot creation.
     * @returns {Promise<any>} - The created screenshot entity or an error if the process fails.
     * @throws {BadRequestException} - Throws an exception if screenshot creation fails.
     */
    async execute(command) {
        try {
            const { input } = command;
            const { file, thumb, recordedAt, activityTimestamp, employeeId, organizationId } = input;
            const tenantId = context_1.RequestContext.currentTenantId();
            const startedAt = moment(moment.utc(activityTimestamp).format('YYYY-MM-DD HH:mm:ss')).toDate();
            const stoppedAt = moment(moment.utc(activityTimestamp).add(10, 'minutes').format('YYYY-MM-DD HH:mm:ss')).toDate();
            let timeSlot;
            try {
                timeSlot = await this._timeSlotService.findOneByWhereOptions({
                    employeeId,
                    organizationId,
                    tenantId,
                    startedAt: (0, typeorm_1.Between)(startedAt, stoppedAt)
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
            return await this._screenshotService.create({
                timeSlot,
                file,
                thumb,
                recordedAt,
                organizationId,
                tenantId
            });
        }
        catch (error) {
            throw new common_1.BadRequestException(error, `Unable to create screenshot for the specified time slot.`);
        }
    }
};
exports.ScreenshotCreateHandler = ScreenshotCreateHandler;
exports.ScreenshotCreateHandler = ScreenshotCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(screenshot_create_command_1.ScreenshotCreateCommand),
    tslib_1.__metadata("design:paramtypes", [screenshot_service_1.ScreenshotService,
        time_slot_service_1.TimeSlotService,
        cqrs_1.CommandBus])
], ScreenshotCreateHandler);
//# sourceMappingURL=screenshot-create.handler.js.map