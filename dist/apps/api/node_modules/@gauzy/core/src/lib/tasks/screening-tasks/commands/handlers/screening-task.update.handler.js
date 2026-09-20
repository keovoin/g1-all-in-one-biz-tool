"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScreeningTaskUpdateHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const screening_tasks_service_1 = require("../../screening-tasks.service");
const screening_task_update_command_1 = require("../screening-task.update.command");
let ScreeningTaskUpdateHandler = class ScreeningTaskUpdateHandler {
    constructor(screeningTasksService) {
        this.screeningTasksService = screeningTasksService;
    }
    /**
     * Executes the update command for a screening task.
     *
     * @param command - Contains the screening task ID and update input.
     * @returns The updated screening task.
     */
    async execute(command) {
        try {
            const { id, input } = command;
            return await this.screeningTasksService.update(id, input);
        }
        catch (error) {
            throw new common_1.HttpException(`Screening task update failed: ${error.message}`, error instanceof common_1.HttpException ? error.getStatus() : common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.ScreeningTaskUpdateHandler = ScreeningTaskUpdateHandler;
exports.ScreeningTaskUpdateHandler = ScreeningTaskUpdateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(screening_task_update_command_1.ScreeningTaskUpdateCommand),
    tslib_1.__metadata("design:paramtypes", [screening_tasks_service_1.ScreeningTasksService])
], ScreeningTaskUpdateHandler);
//# sourceMappingURL=screening-task.update.handler.js.map