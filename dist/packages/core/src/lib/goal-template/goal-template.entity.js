"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoalTemplate = void 0;
const tslib_1 = require("tslib");
const contracts_1 = require("@gauzy/contracts");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const internal_1 = require("../core/entities/internal");
const entity_1 = require("./../core/decorators/entity");
const mikro_orm_goal_template_repository_1 = require("./repository/mikro-orm-goal-template.repository");
let GoalTemplate = class GoalTemplate extends internal_1.TenantOrganizationBaseEntity {
};
exports.GoalTemplate = GoalTemplate;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], GoalTemplate.prototype, "name", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, enum: contracts_1.GoalLevelEnum }),
    (0, class_validator_1.IsEnum)(contracts_1.GoalLevelEnum),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], GoalTemplate.prototype, "level", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, enum: contracts_1.GoalTemplateCategoriesEnum }),
    (0, class_validator_1.IsEnum)(contracts_1.GoalTemplateCategoriesEnum),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], GoalTemplate.prototype, "category", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToMany)(() => internal_1.KeyResultTemplate, (keyResult) => keyResult.goal),
    tslib_1.__metadata("design:type", Array)
], GoalTemplate.prototype, "keyResults", void 0);
exports.GoalTemplate = GoalTemplate = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('goal_template', { mikroOrmRepository: () => mikro_orm_goal_template_repository_1.MikroOrmGoalTemplateRepository })
], GoalTemplate);
//# sourceMappingURL=goal-template.entity.js.map