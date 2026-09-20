"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoalGeneralSettingModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const goal_general_setting_controller_1 = require("./goal-general-setting.controller");
const goal_general_setting_entity_1 = require("./goal-general-setting.entity");
const goal_general_setting_service_1 = require("./goal-general-setting.service");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const type_orm_goal_general_setting_repository_1 = require("./repository/type-orm-goal-general-setting.repository");
const mikro_orm_goal_general_setting_repository_1 = require("./repository/mikro-orm-goal-general-setting.repository");
let GoalGeneralSettingModule = class GoalGeneralSettingModule {
};
exports.GoalGeneralSettingModule = GoalGeneralSettingModule;
exports.GoalGeneralSettingModule = GoalGeneralSettingModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([goal_general_setting_entity_1.GoalGeneralSetting]),
            nestjs_1.MikroOrmModule.forFeature([goal_general_setting_entity_1.GoalGeneralSetting]),
            role_permission_module_1.RolePermissionModule
        ],
        controllers: [goal_general_setting_controller_1.GoalGeneralSettingController],
        providers: [goal_general_setting_service_1.GoalGeneralSettingService, type_orm_goal_general_setting_repository_1.TypeOrmGoalGeneralSettingRepository, mikro_orm_goal_general_setting_repository_1.MikroOrmGoalGeneralSettingRepository]
    })
], GoalGeneralSettingModule);
//# sourceMappingURL=goal-general-setting.module.js.map