"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoalGeneralSetting = void 0;
const tslib_1 = require("tslib");
const contracts_1 = require("@gauzy/contracts");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const internal_1 = require("../core/entities/internal");
const entity_1 = require("./../core/decorators/entity");
const mikro_orm_goal_general_setting_repository_1 = require("./repository/mikro-orm-goal-general-setting.repository");
let GoalGeneralSetting = class GoalGeneralSetting extends internal_1.TenantOrganizationBaseEntity {
};
exports.GoalGeneralSetting = GoalGeneralSetting;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Number }),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", Number)
], GoalGeneralSetting.prototype, "maxObjectives", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Number }),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", Number)
], GoalGeneralSetting.prototype, "maxKeyResults", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Boolean }),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", Boolean)
], GoalGeneralSetting.prototype, "employeeCanCreateObjective", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, enum: contracts_1.GoalOwnershipEnum }),
    (0, class_validator_1.IsEnum)(contracts_1.GoalOwnershipEnum),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], GoalGeneralSetting.prototype, "canOwnObjectives", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, enum: contracts_1.GoalOwnershipEnum }),
    (0, class_validator_1.IsEnum)(contracts_1.GoalOwnershipEnum),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], GoalGeneralSetting.prototype, "canOwnKeyResult", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Boolean }),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", Boolean)
], GoalGeneralSetting.prototype, "krTypeKPI", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Boolean }),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", Boolean)
], GoalGeneralSetting.prototype, "krTypeTask", void 0);
exports.GoalGeneralSetting = GoalGeneralSetting = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('goal_general_setting', { mikroOrmRepository: () => mikro_orm_goal_general_setting_repository_1.MikroOrmGoalGeneralSettingRepository })
], GoalGeneralSetting);
//# sourceMappingURL=goal-general-setting.entity.js.map