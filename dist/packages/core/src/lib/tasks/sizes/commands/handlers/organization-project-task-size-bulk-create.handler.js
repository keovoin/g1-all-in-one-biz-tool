"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationTaskProjectSizeBulkCreateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const organization_project_task_size_bulk_create_command_1 = require("../organization-project-task-size-bulk-create.command");
const size_service_1 = require("../../size.service");
let OrganizationTaskProjectSizeBulkCreateHandler = class OrganizationTaskProjectSizeBulkCreateHandler {
    constructor(taskSizeService) {
        this.taskSizeService = taskSizeService;
    }
    async execute(command) {
        const { input } = command;
        const { id: projectId, organizationId } = input;
        /**
         * Create bulk task size for specific organization team
         */
        return await this.taskSizeService.createBulkSizesByEntity({ organizationId, projectId });
    }
};
exports.OrganizationTaskProjectSizeBulkCreateHandler = OrganizationTaskProjectSizeBulkCreateHandler;
exports.OrganizationTaskProjectSizeBulkCreateHandler = OrganizationTaskProjectSizeBulkCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(organization_project_task_size_bulk_create_command_1.OrganizationProjectTaskSizeBulkCreateCommand),
    tslib_1.__metadata("design:paramtypes", [size_service_1.TaskSizeService])
], OrganizationTaskProjectSizeBulkCreateHandler);
//# sourceMappingURL=organization-project-task-size-bulk-create.handler.js.map