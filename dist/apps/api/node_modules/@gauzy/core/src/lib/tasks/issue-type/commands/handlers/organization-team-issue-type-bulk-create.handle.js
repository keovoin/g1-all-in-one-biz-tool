"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationTeamIssueTypeBulkCreateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const organization_team_issue_type_bulk_create_command_1 = require("./../organization-team-issue-type-bulk-create.command");
const issue_type_service_1 = require("./../../issue-type.service");
let OrganizationTeamIssueTypeBulkCreateHandler = class OrganizationTeamIssueTypeBulkCreateHandler {
    constructor(issueTypeService) {
        this.issueTypeService = issueTypeService;
    }
    async execute(command) {
        const { input } = command;
        const { id: organizationTeamId, organizationId } = input;
        /**
         * Create bulk issue types for specific organization team
         */
        return await this.issueTypeService.createBulkIssueTypeByEntity({
            organizationId,
            organizationTeamId,
        });
    }
};
exports.OrganizationTeamIssueTypeBulkCreateHandler = OrganizationTeamIssueTypeBulkCreateHandler;
exports.OrganizationTeamIssueTypeBulkCreateHandler = OrganizationTeamIssueTypeBulkCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(organization_team_issue_type_bulk_create_command_1.OrganizationTeamIssueTypeBulkCreateCommand),
    tslib_1.__metadata("design:paramtypes", [issue_type_service_1.IssueTypeService])
], OrganizationTeamIssueTypeBulkCreateHandler);
//# sourceMappingURL=organization-team-issue-type-bulk-create.handle.js.map