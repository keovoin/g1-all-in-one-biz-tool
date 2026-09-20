"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskLinkedIssue = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const contracts_1 = require("@gauzy/contracts");
const task_entity_1 = require("./../task.entity");
const internal_1 = require("./../../core/entities/internal");
const entity_1 = require("./../../core/decorators/entity");
const mikro_orm_linked_issue_repository_1 = require("./repository/mikro-orm-linked-issue.repository");
let TaskLinkedIssue = class TaskLinkedIssue extends internal_1.TenantOrganizationBaseEntity {
};
exports.TaskLinkedIssue = TaskLinkedIssue;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ enum: contracts_1.TaskRelatedIssuesRelationEnum }),
    (0, class_validator_1.IsEnum)(contracts_1.TaskRelatedIssuesRelationEnum),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", Number)
], TaskLinkedIssue.prototype, "action", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => task_entity_1.Task }),
    (0, class_validator_1.IsOptional)(),
    (0, entity_1.MultiORMManyToOne)(() => task_entity_1.Task),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], TaskLinkedIssue.prototype, "taskFrom", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.taskFrom),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ relationId: true }),
    tslib_1.__metadata("design:type", String)
], TaskLinkedIssue.prototype, "taskFromId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Object }),
    (0, class_validator_1.IsOptional)(),
    (0, entity_1.MultiORMManyToOne)(() => task_entity_1.Task, (it) => it.linkedIssues),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], TaskLinkedIssue.prototype, "taskTo", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.taskTo),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ relationId: true }),
    tslib_1.__metadata("design:type", String)
], TaskLinkedIssue.prototype, "taskToId", void 0);
exports.TaskLinkedIssue = TaskLinkedIssue = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('task_linked_issues', { mikroOrmRepository: () => mikro_orm_linked_issue_repository_1.MikroOrmTaskLinkedIssueRepository })
], TaskLinkedIssue);
//# sourceMappingURL=task-linked-issue.entity.js.map