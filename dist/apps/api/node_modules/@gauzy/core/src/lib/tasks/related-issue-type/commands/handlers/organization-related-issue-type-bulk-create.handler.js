"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationRelatedIssueTypeBulkCreateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const organization_related_issue_type_bulk_create_command_1 = require("../organization-related-issue-type-bulk-create.command");
const related_issue_type_service_1 = require("../../related-issue-type.service");
let OrganizationRelatedIssueTypeBulkCreateHandler = class OrganizationRelatedIssueTypeBulkCreateHandler {
    constructor(TaskRelatedIssueTypeervice) {
        this.TaskRelatedIssueTypeervice = TaskRelatedIssueTypeervice;
    }
    async execute(command) {
        const { input } = command;
        return await this.TaskRelatedIssueTypeervice.bulkCreateOrganizationRelatedIssueTypes(input);
    }
};
exports.OrganizationRelatedIssueTypeBulkCreateHandler = OrganizationRelatedIssueTypeBulkCreateHandler;
exports.OrganizationRelatedIssueTypeBulkCreateHandler = OrganizationRelatedIssueTypeBulkCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(organization_related_issue_type_bulk_create_command_1.OrganizationRelatedIssueTypeBulkCreateCommand),
    tslib_1.__metadata("design:paramtypes", [related_issue_type_service_1.TaskRelatedIssueTypeService])
], OrganizationRelatedIssueTypeBulkCreateHandler);
//# sourceMappingURL=organization-related-issue-type-bulk-create.handler.js.map