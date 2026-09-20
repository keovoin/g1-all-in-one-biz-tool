"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoalKPITemplate = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const contracts_1 = require("@gauzy/contracts");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const internal_1 = require("../core/entities/internal");
const entity_1 = require("./../core/decorators/entity");
const mikro_orm_goal_kpi_template_repository_1 = require("./repository/mikro-orm-goal-kpi-template.repository");
let GoalKPITemplate = class GoalKPITemplate extends internal_1.TenantOrganizationBaseEntity {
};
exports.GoalKPITemplate = GoalKPITemplate;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], GoalKPITemplate.prototype, "name", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], GoalKPITemplate.prototype, "description", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, enum: contracts_1.KpiMetricEnum }),
    (0, entity_1.MultiORMColumn)(),
    (0, class_validator_1.IsEnum)(contracts_1.KpiMetricEnum),
    tslib_1.__metadata("design:type", String)
], GoalKPITemplate.prototype, "type", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", String)
], GoalKPITemplate.prototype, "unit", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], GoalKPITemplate.prototype, "operator", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => internal_1.Employee }),
    (0, entity_1.MultiORMManyToOne)(() => internal_1.Employee, { nullable: true }),
    (0, typeorm_1.JoinColumn)(),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Object)
], GoalKPITemplate.prototype, "lead", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Number }),
    (0, entity_1.MultiORMColumn)(),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Number)
], GoalKPITemplate.prototype, "currentValue", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Number }),
    (0, entity_1.MultiORMColumn)(),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Number)
], GoalKPITemplate.prototype, "targetValue", void 0);
exports.GoalKPITemplate = GoalKPITemplate = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('goal_kpi_template', { mikroOrmRepository: () => mikro_orm_goal_kpi_template_repository_1.MikroOrmGoalKPITemplateRepository })
], GoalKPITemplate);
//# sourceMappingURL=goal-kpi-template.entity.js.map