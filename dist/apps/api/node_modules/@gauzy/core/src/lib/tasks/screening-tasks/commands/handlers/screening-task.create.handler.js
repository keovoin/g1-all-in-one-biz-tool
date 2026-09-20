"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScreeningTaskCreateHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const screening_tasks_service_1 = require("../../screening-tasks.service");
const screening_task_create_command_1 = require("../screening-task.create.command");
let ScreeningTaskCreateHandler = class ScreeningTaskCreateHandler {
    constructor(screeningTasksService) {
        this.screeningTasksService = screeningTasksService;
    }
    /**
     * Executes the create command for a screening task.
     *
     * @param command - The command containing the creation input for a screening task.
     * @returns A promise that resolves to the newly created screening task.
     */
    async execute(command) {
        try {
            const { input } = command;
            return await this.screeningTasksService.create(input);
        }
        catch (error) {
            throw new common_1.HttpException('Screening task creation failed', common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.ScreeningTaskCreateHandler = ScreeningTaskCreateHandler;
exports.ScreeningTaskCreateHandler = ScreeningTaskCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(screening_task_create_command_1.ScreeningTaskCreateCommand),
    tslib_1.__metadata("design:paramtypes", [screening_tasks_service_1.ScreeningTasksService])
], ScreeningTaskCreateHandler);
//# sourceMappingURL=screening-task.create.handler.js.map