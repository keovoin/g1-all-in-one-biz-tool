"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindRelatedIssueTypesHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const related_issue_type_service_1 = require("../../related-issue-type.service");
const find_related_issue_type_query_1 = require("../find-related-issue-type.query");
let FindRelatedIssueTypesHandler = class FindRelatedIssueTypesHandler {
    constructor(TaskRelatedIssueTypeervice) {
        this.TaskRelatedIssueTypeervice = TaskRelatedIssueTypeervice;
    }
    /**
     *
     * @param query
     * @returns
     */
    async execute(query) {
        const { options } = query;
        return await this.TaskRelatedIssueTypeervice.fetchAll(options);
    }
};
exports.FindRelatedIssueTypesHandler = FindRelatedIssueTypesHandler;
exports.FindRelatedIssueTypesHandler = FindRelatedIssueTypesHandler = tslib_1.__decorate([
    (0, cqrs_1.QueryHandler)(find_related_issue_type_query_1.FindRelatedIssueTypesQuery),
    tslib_1.__metadata("design:paramtypes", [related_issue_type_service_1.TaskRelatedIssueTypeService])
], FindRelatedIssueTypesHandler);
//# sourceMappingURL=find-related-issue-type.handler.js.map