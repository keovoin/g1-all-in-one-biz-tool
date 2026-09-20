"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskViewUpdateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const task_view_update_command_1 = require("../task-view-update.command");
const view_service_1 = require("../../view.service");
let TaskViewUpdateHandler = class TaskViewUpdateHandler {
    constructor(taskViewService) {
        this.taskViewService = taskViewService;
    }
    async execute(command) {
        const { id, input } = command;
        return await this.taskViewService.update(id, input);
    }
};
exports.TaskViewUpdateHandler = TaskViewUpdateHandler;
exports.TaskViewUpdateHandler = TaskViewUpdateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(task_view_update_command_1.TaskViewUpdateCommand),
    tslib_1.__metadata("design:paramtypes", [view_service_1.TaskViewService])
], TaskViewUpdateHandler);
//# sourceMappingURL=task-view-update.handler.js.map