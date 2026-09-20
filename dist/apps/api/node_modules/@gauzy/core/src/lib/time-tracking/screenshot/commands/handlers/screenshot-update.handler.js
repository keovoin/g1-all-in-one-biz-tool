"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScreenshotUpdateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const screenshot_update_command_1 = require("../screenshot-update.command");
const screenshot_service_1 = require("../../../screenshot/screenshot.service");
let ScreenshotUpdateHandler = class ScreenshotUpdateHandler {
    constructor(_screenshotService) {
        this._screenshotService = _screenshotService;
    }
    /**
     * Handles the update of a screenshot entity.
     *
     * @param {ScreenshotUpdateCommand} command - The command containing the data required for screenshot update.
     * @returns {Promise<any>} - The updated screenshot entity or an error if the process fails.
     * @throws {BadRequestException} - Throws an exception if screenshot update fails.
     */
    async execute(command) {
        try {
            const { input } = command;
            const { id, file, thumb } = input;
            // Update the screenshot with the new file and thumbnail data
            await this._screenshotService.update(id, {
                file,
                thumb
            });
            // Fetch and return the updated screenshot entity
            return await this._screenshotService.findOneByIdString(id);
        }
        catch (error) {
            throw new common_1.BadRequestException('Unable to update screenshot for the specified time slot.', error);
        }
    }
};
exports.ScreenshotUpdateHandler = ScreenshotUpdateHandler;
exports.ScreenshotUpdateHandler = ScreenshotUpdateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(screenshot_update_command_1.ScreenshotUpdateCommand),
    tslib_1.__metadata("design:paramtypes", [screenshot_service_1.ScreenshotService])
], ScreenshotUpdateHandler);
//# sourceMappingURL=screenshot-update.handler.js.map