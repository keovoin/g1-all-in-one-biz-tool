"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyResult = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const contracts_1 = require("@gauzy/contracts");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const internal_1 = require("../core/entities/internal");
const entity_1 = require("./../core/decorators/entity");
const mikro_orm_keyresult_repository_1 = require("./repository/mikro-orm-keyresult.repository");
let KeyResult = class KeyResult extends internal_1.TenantOrganizationBaseEntity {
};
exports.KeyResult = KeyResult;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], KeyResult.prototype, "name", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, entity_1.MultiORMColumn)(),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", String)
], KeyResult.prototype, "description", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, enum: contracts_1.KeyResultTypeEnum }),
    (0, class_validator_1.IsEnum)(contracts_1.KeyResultTypeEnum),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], KeyResult.prototype, "type", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Number }),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Number)
], KeyResult.prototype, "targetValue", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Number }),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Number)
], KeyResult.prototype, "initialValue", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", String)
], KeyResult.prototype, "unit", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Number }),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", Number)
], KeyResult.prototype, "update", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Number }),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", Number)
], KeyResult.prototype, "progress", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, enum: contracts_1.KeyResultDeadlineEnum }),
    (0, class_validator_1.IsEnum)(contracts_1.KeyResultDeadlineEnum),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], KeyResult.prototype, "deadline", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Date }),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Date)
], KeyResult.prototype, "hardDeadline", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Date }),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Date)
], KeyResult.prototype, "softDeadline", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, entity_1.MultiORMColumn)(),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", String)
], KeyResult.prototype, "status", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", String)
], KeyResult.prototype, "weight", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => internal_1.Employee }),
    (0, entity_1.MultiORMManyToOne)(() => internal_1.Employee),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], KeyResult.prototype, "owner", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, typeorm_1.RelationId)((it) => it.owner),
    (0, class_validator_1.IsString)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ relationId: true }),
    tslib_1.__metadata("design:type", String)
], KeyResult.prototype, "ownerId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => internal_1.Employee }),
    (0, entity_1.MultiORMManyToOne)(() => internal_1.Employee, { nullable: true }),
    (0, typeorm_1.JoinColumn)(),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Object)
], KeyResult.prototype, "lead", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, typeorm_1.RelationId)((it) => it.lead),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], KeyResult.prototype, "leadId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => internal_1.OrganizationProject }),
    (0, entity_1.MultiORMManyToOne)(() => internal_1.OrganizationProject, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'projectId' }),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Object)
], KeyResult.prototype, "project", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, readOnly: true }),
    (0, typeorm_1.RelationId)((it) => it.project),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], KeyResult.prototype, "projectId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => internal_1.Task }),
    (0, entity_1.MultiORMManyToOne)(() => internal_1.Task, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'taskId' }),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Object)
], KeyResult.prototype, "task", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, readOnly: true }),
    (0, typeorm_1.RelationId)((it) => it.task),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], KeyResult.prototype, "taskId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => internal_1.GoalKPI }),
    (0, entity_1.MultiORMManyToOne)(() => internal_1.GoalKPI, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'kpiId' }),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Object)
], KeyResult.prototype, "kpi", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, readOnly: true }),
    (0, typeorm_1.RelationId)((it) => it.kpi),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], KeyResult.prototype, "kpiId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => internal_1.Goal }),
    (0, entity_1.MultiORMManyToOne)(() => internal_1.Goal, (goal) => goal.keyResults, {
        onDelete: 'CASCADE'
    }),
    (0, typeorm_1.JoinColumn)({ name: 'goalId' }),
    tslib_1.__metadata("design:type", Object)
], KeyResult.prototype, "goal", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, readOnly: true }),
    (0, typeorm_1.RelationId)((it) => it.goal),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], KeyResult.prototype, "goalId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => internal_1.KeyResultUpdate }),
    (0, entity_1.MultiORMOneToMany)(() => internal_1.KeyResultUpdate, (keyResultUpdate) => keyResultUpdate.keyResult, {
        cascade: true
    }),
    tslib_1.__metadata("design:type", Array)
], KeyResult.prototype, "updates", void 0);
exports.KeyResult = KeyResult = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('key_result', { mikroOrmRepository: () => mikro_orm_keyresult_repository_1.MikroOrmKeyResultRepository })
], KeyResult);
//# sourceMappingURL=keyresult.entity.js.map