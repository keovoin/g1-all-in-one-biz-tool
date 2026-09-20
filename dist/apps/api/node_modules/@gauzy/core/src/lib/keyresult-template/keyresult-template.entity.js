"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyResultTemplate = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const contracts_1 = require("@gauzy/contracts");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const internal_1 = require("../core/entities/internal");
const entity_1 = require("./../core/decorators/entity");
const mikro_orm_keyresult_template_repository_1 = require("./repository/mikro-orm-keyresult-template.repository");
let KeyResultTemplate = class KeyResultTemplate extends internal_1.TenantOrganizationBaseEntity {
};
exports.KeyResultTemplate = KeyResultTemplate;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], KeyResultTemplate.prototype, "name", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, enum: contracts_1.KeyResultTypeEnum }),
    (0, class_validator_1.IsEnum)(contracts_1.KeyResultTypeEnum),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], KeyResultTemplate.prototype, "type", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", String)
], KeyResultTemplate.prototype, "unit", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Number }),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Number)
], KeyResultTemplate.prototype, "targetValue", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Number }),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Number)
], KeyResultTemplate.prototype, "initialValue", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, enum: contracts_1.KeyResultDeadlineEnum }),
    (0, class_validator_1.IsEnum)(contracts_1.KeyResultDeadlineEnum),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], KeyResultTemplate.prototype, "deadline", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => internal_1.GoalKPITemplate }),
    (0, entity_1.MultiORMManyToOne)(() => internal_1.GoalKPITemplate, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'kpiId' }),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Object)
], KeyResultTemplate.prototype, "kpi", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, readOnly: true }),
    (0, typeorm_1.RelationId)((it) => it.kpi),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], KeyResultTemplate.prototype, "kpiId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => internal_1.GoalTemplate }),
    (0, entity_1.MultiORMManyToOne)(() => internal_1.GoalTemplate, (goalTemplate) => goalTemplate.keyResults, {
        onDelete: 'CASCADE'
    }),
    (0, typeorm_1.JoinColumn)({ name: 'goalId' }),
    tslib_1.__metadata("design:type", Object)
], KeyResultTemplate.prototype, "goal", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, readOnly: true }),
    (0, typeorm_1.RelationId)((it) => it.goal),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], KeyResultTemplate.prototype, "goalId", void 0);
exports.KeyResultTemplate = KeyResultTemplate = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('key_result_template', { mikroOrmRepository: () => mikro_orm_keyresult_template_repository_1.MikroOrmKeyResultTemplateRepository })
], KeyResultTemplate);
//# sourceMappingURL=keyresult-template.entity.js.map