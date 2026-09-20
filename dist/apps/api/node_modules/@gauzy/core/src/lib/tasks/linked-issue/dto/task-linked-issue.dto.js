"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskLinkedIssueDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const dto_1 = require("../../../core/dto");
const task_linked_issue_entity_1 = require("../task-linked-issue.entity");
class TaskLinkedIssueDTO extends (0, swagger_1.IntersectionType)(dto_1.TenantOrganizationBaseDTO, task_linked_issue_entity_1.TaskLinkedIssue) {
}
exports.TaskLinkedIssueDTO = TaskLinkedIssueDTO;
//# sourceMappingURL=task-linked-issue.dto.js.map