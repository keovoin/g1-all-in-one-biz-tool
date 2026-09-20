"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskLinkedIssueUpdateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const task_linked_issue_update_command_1 = require("../task-linked-issue-update.command");
const task_linked_issue_service_1 = require("../../task-linked-issue.service");
let TaskLinkedIssueUpdateHandler = class TaskLinkedIssueUpdateHandler {
    constructor(taskLinkedIssueService) {
        this.taskLinkedIssueService = taskLinkedIssueService;
    }
    async execute(command) {
        const { id, input } = command;
        return await this.taskLinkedIssueService.update(id, input);
    }
};
exports.TaskLinkedIssueUpdateHandler = TaskLinkedIssueUpdateHandler;
exports.TaskLinkedIssueUpdateHandler = TaskLinkedIssueUpdateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(task_linked_issue_update_command_1.TaskLinkedIssueUpdateCommand),
    tslib_1.__metadata("design:paramtypes", [task_linked_issue_service_1.TaskLinkedIssueService])
], TaskLinkedIssueUpdateHandler);
//# sourceMappingURL=task-linked-issue-update.handler.js.map