"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationTaskSizeBulkCreateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const organization_task_size_bulk_create_command_1 = require("../organization-task-size-bulk-create.command");
const size_service_1 = require("./../../size.service");
let OrganizationTaskSizeBulkCreateHandler = class OrganizationTaskSizeBulkCreateHandler {
    constructor(taskStatusService) {
        this.taskStatusService = taskStatusService;
    }
    async execute(command) {
        const { input } = command;
        // Create task sizes of the organization.
        return await this.taskStatusService.bulkCreateOrganizationTaskSizes(input);
    }
};
exports.OrganizationTaskSizeBulkCreateHandler = OrganizationTaskSizeBulkCreateHandler;
exports.OrganizationTaskSizeBulkCreateHandler = OrganizationTaskSizeBulkCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(organization_task_size_bulk_create_command_1.OrganizationTaskSizeBulkCreateCommand),
    tslib_1.__metadata("design:paramtypes", [size_service_1.TaskSizeService])
], OrganizationTaskSizeBulkCreateHandler);
//# sourceMappingURL=organization-task-size-bulk-create.handler.js.map