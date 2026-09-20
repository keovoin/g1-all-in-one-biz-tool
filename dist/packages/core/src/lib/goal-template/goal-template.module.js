"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoalTemplateModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const goal_template_controller_1 = require("./goal-template.controller");
const goal_template_service_1 = require("./goal-template.service");
const goal_template_entity_1 = require("./goal-template.entity");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const type_orm_goal_template_repository_1 = require("./repository/type-orm-goal-template.repository");
const mikro_orm_goal_template_repository_1 = require("./repository/mikro-orm-goal-template.repository");
let GoalTemplateModule = class GoalTemplateModule {
};
exports.GoalTemplateModule = GoalTemplateModule;
exports.GoalTemplateModule = GoalTemplateModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([goal_template_entity_1.GoalTemplate]),
            nestjs_1.MikroOrmModule.forFeature([goal_template_entity_1.GoalTemplate]),
            role_permission_module_1.RolePermissionModule
        ],
        controllers: [goal_template_controller_1.GoalTemplateController],
        providers: [goal_template_service_1.GoalTemplateService, type_orm_goal_template_repository_1.TypeOrmGoalTemplateRepository, mikro_orm_goal_template_repository_1.MikroOrmGoalTemplateRepository]
    })
], GoalTemplateModule);
//# sourceMappingURL=goal-template.module.js.map