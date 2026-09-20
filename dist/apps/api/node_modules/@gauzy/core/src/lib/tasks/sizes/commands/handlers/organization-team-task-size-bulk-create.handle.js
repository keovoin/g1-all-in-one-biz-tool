"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationTeamTaskSizeBulkCreateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const organization_team_task_size_bulk_create_command_1 = require("../organization-team-task-size-bulk-create.command");
const size_service_1 = require("./../../size.service");
let OrganizationTeamTaskSizeBulkCreateHandler = class OrganizationTeamTaskSizeBulkCreateHandler {
    constructor(taskSizeService) {
        this.taskSizeService = taskSizeService;
    }
    async execute(command) {
        const { input } = command;
        const { id: organizationTeamId, organizationId } = input;
        /**
         * Create bulk task size for specific organization team
         */
        return await this.taskSizeService.createBulkSizesByEntity({ organizationId, organizationTeamId });
    }
};
exports.OrganizationTeamTaskSizeBulkCreateHandler = OrganizationTeamTaskSizeBulkCreateHandler;
exports.OrganizationTeamTaskSizeBulkCreateHandler = OrganizationTeamTaskSizeBulkCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(organization_team_task_size_bulk_create_command_1.OrganizationTeamTaskSizeBulkCreateCommand),
    tslib_1.__metadata("design:paramtypes", [size_service_1.TaskSizeService])
], OrganizationTeamTaskSizeBulkCreateHandler);
//# sourceMappingURL=organization-team-task-size-bulk-create.handle.js.map