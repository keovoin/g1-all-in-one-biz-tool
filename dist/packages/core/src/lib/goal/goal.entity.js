"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Goal = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const contracts_1 = require("@gauzy/contracts");
const internal_1 = require("../core/entities/internal");
const entity_1 = require("./../core/decorators/entity");
const mikro_orm_goal_repository_1 = require("./repository/mikro-orm-goal.repository");
let Goal = class Goal extends internal_1.TenantOrganizationBaseEntity {
};
exports.Goal = Goal;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], Goal.prototype, "name", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, entity_1.MultiORMColumn)(),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", String)
], Goal.prototype, "description", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], Goal.prototype, "deadline", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, enum: contracts_1.GoalLevelEnum }),
    (0, class_validator_1.IsEnum)(contracts_1.GoalLevelEnum),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], Goal.prototype, "level", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Number }),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", Number)
], Goal.prototype, "progress", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => internal_1.OrganizationTeam }),
    (0, entity_1.MultiORMManyToOne)(() => internal_1.OrganizationTeam, (team) => team.goals, {
        onDelete: 'CASCADE'
    }),
    tslib_1.__metadata("design:type", Object)
], Goal.prototype, "ownerTeam", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, typeorm_1.RelationId)((it) => it.ownerTeam),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], Goal.prototype, "ownerTeamId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => internal_1.Employee }),
    (0, entity_1.MultiORMManyToOne)(() => internal_1.Employee, (employee) => employee.goals, {
        onDelete: 'CASCADE'
    }),
    tslib_1.__metadata("design:type", Object)
], Goal.prototype, "ownerEmployee", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, typeorm_1.RelationId)((it) => it.ownerEmployee),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], Goal.prototype, "ownerEmployeeId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => internal_1.Employee }),
    (0, entity_1.MultiORMManyToOne)(() => internal_1.Employee, (employee) => employee.leads, {
        onDelete: 'CASCADE'
    }),
    tslib_1.__metadata("design:type", Object)
], Goal.prototype, "lead", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, typeorm_1.RelationId)((it) => it.lead),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], Goal.prototype, "leadId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => internal_1.KeyResult }),
    (0, entity_1.MultiORMManyToOne)(() => internal_1.KeyResult, (keyResult) => keyResult.id),
    tslib_1.__metadata("design:type", Object)
], Goal.prototype, "alignedKeyResult", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, typeorm_1.RelationId)((it) => it.alignedKeyResult),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], Goal.prototype, "alignedKeyResultId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Object }),
    (0, class_validator_1.IsOptional)(),
    (0, entity_1.MultiORMManyToOne)(() => internal_1.OrganizationStrategicInitiative, (initiative) => initiative.goals, {
        /** Indicates if relation column value can be nullable or not */
        nullable: true,
        /** Database cascade action on delete */
        onDelete: 'SET NULL'
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], Goal.prototype, "organizationStrategicInitiative", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.organizationStrategicInitiative),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], Goal.prototype, "organizationStrategicInitiativeId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => internal_1.KeyResult, isArray: true }),
    (0, entity_1.MultiORMOneToMany)(() => internal_1.KeyResult, (keyResult) => keyResult.goal, {
        cascade: true
    }),
    tslib_1.__metadata("design:type", Array)
], Goal.prototype, "keyResults", void 0);
exports.Goal = Goal = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('goal', { mikroOrmRepository: () => mikro_orm_goal_repository_1.MikroOrmGoalRepository })
], Goal);
//# sourceMappingURL=goal.entity.js.map