"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoalKPI = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const contracts_1 = require("@gauzy/contracts");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const internal_1 = require("../core/entities/internal");
const entity_1 = require("./../core/decorators/entity");
const mikro_orm_goal_kpi_repository_1 = require("./repository/mikro-orm-goal-kpi.repository");
let GoalKPI = class GoalKPI extends internal_1.TenantOrganizationBaseEntity {
};
exports.GoalKPI = GoalKPI;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], GoalKPI.prototype, "name", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], GoalKPI.prototype, "description", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, enum: contracts_1.KpiMetricEnum }),
    (0, entity_1.MultiORMColumn)(),
    (0, class_validator_1.IsEnum)(contracts_1.KpiMetricEnum),
    tslib_1.__metadata("design:type", String)
], GoalKPI.prototype, "type", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", String)
], GoalKPI.prototype, "unit", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], GoalKPI.prototype, "operator", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Number }),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", Number)
], GoalKPI.prototype, "currentValue", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Number }),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", Number)
], GoalKPI.prototype, "targetValue", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => internal_1.Employee }),
    (0, entity_1.MultiORMManyToOne)(() => internal_1.Employee, { nullable: true }),
    tslib_1.__metadata("design:type", Object)
], GoalKPI.prototype, "lead", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, readOnly: true }),
    (0, typeorm_1.RelationId)((it) => it.lead),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], GoalKPI.prototype, "leadId", void 0);
exports.GoalKPI = GoalKPI = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('goal_kpi', { mikroOrmRepository: () => mikro_orm_goal_kpi_repository_1.MikroOrmGoalKPIRepository })
], GoalKPI);
//# sourceMappingURL=goal-kpi.entity.js.map