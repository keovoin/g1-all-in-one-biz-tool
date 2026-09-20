"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeOffBalanceModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const employee_entity_1 = require("./../employee/employee.entity");
const role_permission_module_1 = require("./../role-permission/role-permission.module");
const time_off_policy_entity_1 = require("./../time-off-policy/time-off-policy.entity");
const time_off_balance_entity_1 = require("./time-off-balance.entity");
const time_off_balance_controller_1 = require("./time-off-balance.controller");
const time_off_balance_service_1 = require("./time-off-balance.service");
const mikro_orm_time_off_balance_repository_1 = require("./repository/mikro-orm-time-off-balance.repository");
const type_orm_time_off_balance_repository_1 = require("./repository/type-orm-time-off-balance.repository");
/**
 * `Employee` and `TimeOffPolicy` are registered with `forFeature` here so the service can verify
 * that an allocation targets an employee and a policy of the caller's own organization, without
 * importing their modules and risking a cycle.
 */
let TimeOffBalanceModule = class TimeOffBalanceModule {
};
exports.TimeOffBalanceModule = TimeOffBalanceModule;
exports.TimeOffBalanceModule = TimeOffBalanceModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([time_off_balance_entity_1.TimeOffBalance, employee_entity_1.Employee, time_off_policy_entity_1.TimeOffPolicy]),
            nestjs_1.MikroOrmModule.forFeature([time_off_balance_entity_1.TimeOffBalance]),
            role_permission_module_1.RolePermissionModule
        ],
        controllers: [time_off_balance_controller_1.TimeOffBalanceController],
        providers: [time_off_balance_service_1.TimeOffBalanceService, type_orm_time_off_balance_repository_1.TypeOrmTimeOffBalanceRepository, mikro_orm_time_off_balance_repository_1.MikroOrmTimeOffBalanceRepository],
        exports: [time_off_balance_service_1.TimeOffBalanceService, type_orm_time_off_balance_repository_1.TypeOrmTimeOffBalanceRepository, mikro_orm_time_off_balance_repository_1.MikroOrmTimeOffBalanceRepository]
    })
], TimeOffBalanceModule);
//# sourceMappingURL=time-off-balance.module.js.map