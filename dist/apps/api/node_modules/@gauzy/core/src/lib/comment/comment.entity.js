"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comment = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const core_1 = require("@mikro-orm/core");
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const contracts_1 = require("@gauzy/contracts");
const internal_1 = require("../core/entities/internal");
const entity_1 = require("../core/decorators/entity");
const pipes_1 = require("../shared/pipes");
const mikro_orm_comment_repository_1 = require("./repository/mikro-orm-comment.repository");
let Comment = class Comment extends internal_1.BasePerEntityType {
};
exports.Comment = Comment;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, entity_1.MultiORMColumn)({ type: 'text' }),
    tslib_1.__metadata("design:type", String)
], Comment.prototype, "comment", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: contracts_1.ActorTypeEnum }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contracts_1.ActorTypeEnum),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ type: 'int', nullable: true, transformer: new pipes_1.ActorTypeTransformer() }),
    tslib_1.__metadata("design:type", String)
], Comment.prototype, "actorType", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Boolean)
], Comment.prototype, "resolved", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Date }),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Date)
], Comment.prototype, "resolvedAt", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Date }),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Date)
], Comment.prototype, "editedAt", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToOne)(() => internal_1.Employee, {
        /** Indicates if relation column value can be nullable or not. */
        nullable: true,
        /** Database cascade action on delete. */
        onDelete: 'CASCADE'
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], Comment.prototype, "employee", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.employee),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], Comment.prototype, "employeeId", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToOne)(() => internal_1.Employee, {
        /** Indicates if relation column value can be nullable or not. */
        nullable: true,
        /** Database cascade action on delete. */
        onDelete: 'CASCADE'
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], Comment.prototype, "resolvedByEmployee", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.resolvedByEmployee),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], Comment.prototype, "resolvedByEmployeeId", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToOne)(() => Comment, (comment) => comment.replies, {
        /** Indicates if relation column value can be nullable or not. */
        nullable: true,
        /** Database cascade action on delete. */
        onDelete: 'SET NULL'
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], Comment.prototype, "parent", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], Comment.prototype, "parentId", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToMany)(() => Comment, (comment) => comment.parent),
    tslib_1.__metadata("design:type", Array)
], Comment.prototype, "replies", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToMany)(() => internal_1.Employee, (employee) => employee.assignedComments, {
        onUpdate: 'CASCADE', // Cascade action on update
        onDelete: 'CASCADE', // Cascade action on delete
        owner: true, // Ownership
        pivotTable: 'comment_employee', // Table name for pivot table
        joinColumn: 'commentId', // Column name for join table
        inverseJoinColumn: 'employeeId' // Column name for inverse join table
    }),
    (0, typeorm_1.JoinTable)({ name: 'comment_employee' }),
    tslib_1.__metadata("design:type", Array)
], Comment.prototype, "members", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToMany)(() => internal_1.OrganizationTeam, (team) => team.assignedComments, {
        onUpdate: 'CASCADE', // Cascade action on update
        onDelete: 'CASCADE', // Cascade action on delete
        owner: true, // Ownership
        pivotTable: 'comment_team', // Table name for pivot table
        joinColumn: 'commentId', // Column name for join table
        inverseJoinColumn: 'organizationTeamId' // Column name for inverse join table
    }),
    (0, typeorm_1.JoinTable)({ name: 'comment_team' }),
    tslib_1.__metadata("design:type", Array)
], Comment.prototype, "teams", void 0);
exports.Comment = Comment = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('comment', { mikroOrmRepository: () => mikro_orm_comment_repository_1.MikroOrmCommentRepository })
], Comment);
//# sourceMappingURL=comment.entity.js.map