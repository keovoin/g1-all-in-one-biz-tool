"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoalKpiModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const goal_kpi_controller_1 = require("./goal-kpi.controller");
const goal_kpi_service_1 = require("./goal-kpi.service");
const goal_kpi_entity_1 = require("./goal-kpi.entity");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const type_orm_goal_kpi_repository_1 = require("./repository/type-orm-goal-kpi.repository");
const mikro_orm_goal_kpi_repository_1 = require("./repository/mikro-orm-goal-kpi.repository");
let GoalKpiModule = class GoalKpiModule {
};
exports.GoalKpiModule = GoalKpiModule;
exports.GoalKpiModule = GoalKpiModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([goal_kpi_entity_1.GoalKPI]), nestjs_1.MikroOrmModule.forFeature([goal_kpi_entity_1.GoalKPI]), role_permission_module_1.RolePermissionModule],
        controllers: [goal_kpi_controller_1.GoalKpiController],
        providers: [goal_kpi_service_1.GoalKpiService, type_orm_goal_kpi_repository_1.TypeOrmGoalKPIRepository, mikro_orm_goal_kpi_repository_1.MikroOrmGoalKPIRepository]
    })
], GoalKpiModule);
//# sourceMappingURL=goal-kpi.module.js.map