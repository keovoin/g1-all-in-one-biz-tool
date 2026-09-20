"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoalKpiTemplateModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const goal_kpi_template_controller_1 = require("./goal-kpi-template.controller");
const goal_kpi_template_service_1 = require("./goal-kpi-template.service");
const goal_kpi_template_entity_1 = require("./goal-kpi-template.entity");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const type_orm_goal_kpi_template_repository_1 = require("./repository/type-orm-goal-kpi-template.repository");
const mikro_orm_goal_kpi_template_repository_1 = require("./repository/mikro-orm-goal-kpi-template.repository");
let GoalKpiTemplateModule = class GoalKpiTemplateModule {
};
exports.GoalKpiTemplateModule = GoalKpiTemplateModule;
exports.GoalKpiTemplateModule = GoalKpiTemplateModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([goal_kpi_template_entity_1.GoalKPITemplate]),
            nestjs_1.MikroOrmModule.forFeature([goal_kpi_template_entity_1.GoalKPITemplate]),
            role_permission_module_1.RolePermissionModule
        ],
        controllers: [goal_kpi_template_controller_1.GoalKpiTemplateController],
        providers: [goal_kpi_template_service_1.GoalKpiTemplateService, type_orm_goal_kpi_template_repository_1.TypeOrmGoalKPITemplateRepository, mikro_orm_goal_kpi_template_repository_1.MikroOrmGoalKPITemplateRepository]
    })
], GoalKpiTemplateModule);
//# sourceMappingURL=goal-kpi-template.module.js.map