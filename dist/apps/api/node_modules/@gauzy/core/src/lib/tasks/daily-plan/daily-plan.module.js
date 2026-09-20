"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DailyPlanModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const nestjs_1 = require("@mikro-orm/nestjs");
const typeorm_1 = require("@nestjs/typeorm");
const daily_plan_service_1 = require("./daily-plan.service");
const daily_plan_controller_1 = require("./daily-plan.controller");
const role_permission_module_1 = require("../../role-permission/role-permission.module");
const daily_plan_entity_1 = require("./daily-plan.entity");
const employee_module_1 = require("../../employee/employee.module");
const task_module_1 = require("../task.module");
const type_orm_daily_plan_repository_1 = require("./repository/type-orm-daily-plan.repository");
const mikro_orm_daily_plan_repository_1 = require("./repository/mikro-orm-daily-plan.repository");
let DailyPlanModule = class DailyPlanModule {
};
exports.DailyPlanModule = DailyPlanModule;
exports.DailyPlanModule = DailyPlanModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([daily_plan_entity_1.DailyPlan]),
            nestjs_1.MikroOrmModule.forFeature([daily_plan_entity_1.DailyPlan]),
            role_permission_module_1.RolePermissionModule,
            employee_module_1.EmployeeModule,
            task_module_1.TaskModule
        ],
        controllers: [daily_plan_controller_1.DailyPlanController],
        providers: [daily_plan_service_1.DailyPlanService, type_orm_daily_plan_repository_1.TypeOrmDailyPlanRepository, mikro_orm_daily_plan_repository_1.MikroOrmDailyPlanRepository],
        exports: [daily_plan_service_1.DailyPlanService]
    })
], DailyPlanModule);
//# sourceMappingURL=daily-plan.module.js.map