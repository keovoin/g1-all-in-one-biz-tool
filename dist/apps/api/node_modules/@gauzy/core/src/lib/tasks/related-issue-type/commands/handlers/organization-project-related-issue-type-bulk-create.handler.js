"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationProjectRelatedIssueTypeBulkCreateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const organization_project_related_issue_type_bulk_create_command_1 = require("../organization-project-related-issue-type-bulk-create.command");
const related_issue_type_service_1 = require("../../related-issue-type.service");
let OrganizationProjectRelatedIssueTypeBulkCreateHandler = class OrganizationProjectRelatedIssueTypeBulkCreateHandler {
    constructor(TaskRelatedIssueTypeervice) {
        this.TaskRelatedIssueTypeervice = TaskRelatedIssueTypeervice;
    }
    async execute(command) {
        const { input } = command;
        const { id: projectId, organizationId } = input;
        /**
         * Create bulk task Related Issue Type for specific organization project
         */
        return await this.TaskRelatedIssueTypeervice.createBulkRelatedIssueTypesByEntity({
            organizationId,
            projectId,
        });
    }
};
exports.OrganizationProjectRelatedIssueTypeBulkCreateHandler = OrganizationProjectRelatedIssueTypeBulkCreateHandler;
exports.OrganizationProjectRelatedIssueTypeBulkCreateHandler = OrganizationProjectRelatedIssueTypeBulkCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(organization_project_related_issue_type_bulk_create_command_1.OrganizationProjectRelatedIssueTypeBulkCreateCommand),
    tslib_1.__metadata("design:paramtypes", [related_issue_type_service_1.TaskRelatedIssueTypeService])
], OrganizationProjectRelatedIssueTypeBulkCreateHandler);
//# sourceMappingURL=organization-project-related-issue-type-bulk-create.handler.js.map