"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationTeamTaskRelatedIssueTypeBulkCreateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const organization_team_task_related_issue_type_bulk_create_command_1 = require("../organization-team-task-related-issue-type-bulk-create.command");
const related_issue_type_service_1 = require("../../related-issue-type.service");
let OrganizationTeamTaskRelatedIssueTypeBulkCreateHandler = class OrganizationTeamTaskRelatedIssueTypeBulkCreateHandler {
    constructor(TaskRelatedIssueTypeervice) {
        this.TaskRelatedIssueTypeervice = TaskRelatedIssueTypeervice;
    }
    async execute(command) {
        const { input } = command;
        const { id: organizationTeamId, organizationId } = input;
        /**
         * Create bulk task statuses for specific organization team
         */
        return this.TaskRelatedIssueTypeervice.createBulkRelatedIssueTypesByEntity({
            organizationId,
            organizationTeamId,
        });
    }
};
exports.OrganizationTeamTaskRelatedIssueTypeBulkCreateHandler = OrganizationTeamTaskRelatedIssueTypeBulkCreateHandler;
exports.OrganizationTeamTaskRelatedIssueTypeBulkCreateHandler = OrganizationTeamTaskRelatedIssueTypeBulkCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(organization_team_task_related_issue_type_bulk_create_command_1.OrganizationTeamTaskRelatedIssueTypeBulkCreateCommand),
    tslib_1.__metadata("design:paramtypes", [related_issue_type_service_1.TaskRelatedIssueTypeService])
], OrganizationTeamTaskRelatedIssueTypeBulkCreateHandler);
//# sourceMappingURL=organization-team-task-related-issue-type-bulk-create.handle.js.map