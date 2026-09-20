"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskViewCreateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const view_service_1 = require("../../view.service");
const task_view_create_command_1 = require("../task-view-create.command");
let TaskViewCreateHandler = class TaskViewCreateHandler {
    constructor(taskViewService) {
        this.taskViewService = taskViewService;
    }
    async execute(command) {
        const { input } = command;
        return await this.taskViewService.create(input);
    }
};
exports.TaskViewCreateHandler = TaskViewCreateHandler;
exports.TaskViewCreateHandler = TaskViewCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(task_view_create_command_1.TaskViewCreateCommand),
    tslib_1.__metadata("design:paramtypes", [view_service_1.TaskViewService])
], TaskViewCreateHandler);
//# sourceMappingURL=task-view-create.handler.js.map