"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskRelatedIssueType = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const internal_1 = require("../../core/entities/internal");
const entity_1 = require("./../../core/decorators/entity");
const mikro_orm_related_issue_type_repository_1 = require("./repository/mikro-orm-related-issue-type.repository");
let TaskRelatedIssueType = class TaskRelatedIssueType extends internal_1.TenantOrganizationBaseEntity {
};
exports.TaskRelatedIssueType = TaskRelatedIssueType;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], TaskRelatedIssueType.prototype, "name", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], TaskRelatedIssueType.prototype, "value", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], TaskRelatedIssueType.prototype, "description", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], TaskRelatedIssueType.prototype, "icon", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], TaskRelatedIssueType.prototype, "color", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean, default: false }),
    (0, entity_1.MultiORMColumn)({ default: false, update: false }),
    tslib_1.__metadata("design:type", Boolean)
], TaskRelatedIssueType.prototype, "isSystem", void 0);
tslib_1.__decorate([
    (0, entity_1.VirtualMultiOrmColumn)(),
    tslib_1.__metadata("design:type", String)
], TaskRelatedIssueType.prototype, "fullIconUrl", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToOne)(() => internal_1.OrganizationProject, (it) => it.relatedIssueTypes, {
        /** Indicates if the relation column value can be nullable or not. */
        nullable: true,
        /** Defines the database cascade action on delete. */
        onDelete: 'CASCADE'
    }),
    tslib_1.__metadata("design:type", Object)
], TaskRelatedIssueType.prototype, "project", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.project),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", Object)
], TaskRelatedIssueType.prototype, "projectId", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToOne)(() => internal_1.OrganizationTeam, (it) => it.relatedIssueTypes, {
        /** Indicates if the relation column value can be nullable or not. */
        nullable: true,
        /** Defines the database cascade action on delete. */
        onDelete: 'CASCADE'
    }),
    tslib_1.__metadata("design:type", Object)
], TaskRelatedIssueType.prototype, "organizationTeam", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.organizationTeam),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", Object)
], TaskRelatedIssueType.prototype, "organizationTeamId", void 0);
exports.TaskRelatedIssueType = TaskRelatedIssueType = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('task_related_issue_type', { mikroOrmRepository: () => mikro_orm_related_issue_type_repository_1.MikroOrmTaskRelatedIssueTypeRepository })
], TaskRelatedIssueType);
//# sourceMappingURL=related-issue-type.entity.js.map