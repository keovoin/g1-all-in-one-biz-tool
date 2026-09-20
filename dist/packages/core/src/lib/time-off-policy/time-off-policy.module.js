"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeOffPolicyModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const time_off_policy_service_1 = require("./time-off-policy.service");
const time_off_policy_entity_1 = require("./time-off-policy.entity");
const time_off_policy_controller_1 = require("./time-off-policy.controller");
const employee_module_1 = require("./../employee/employee.module");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const type_orm_time_off_policy_repository_1 = require("./repository/type-orm-time-off-policy.repository");
const mikro_orm_time_off_policy_repository_1 = require("./repository/mikro-orm-time-off-policy.repository");
let TimeOffPolicyModule = class TimeOffPolicyModule {
};
exports.TimeOffPolicyModule = TimeOffPolicyModule;
exports.TimeOffPolicyModule = TimeOffPolicyModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([time_off_policy_entity_1.TimeOffPolicy]),
            nestjs_1.MikroOrmModule.forFeature([time_off_policy_entity_1.TimeOffPolicy]),
            role_permission_module_1.RolePermissionModule,
            employee_module_1.EmployeeModule
        ],
        controllers: [time_off_policy_controller_1.TimeOffPolicyController],
        providers: [time_off_policy_service_1.TimeOffPolicyService, type_orm_time_off_policy_repository_1.TypeOrmTimeOffPolicyRepository, mikro_orm_time_off_policy_repository_1.MikroOrmTimeOffPolicyRepository],
        exports: [time_off_policy_service_1.TimeOffPolicyService, type_orm_time_off_policy_repository_1.TypeOrmTimeOffPolicyRepository, mikro_orm_time_off_policy_repository_1.MikroOrmTimeOffPolicyRepository]
    })
], TimeOffPolicyModule);
//# sourceMappingURL=time-off-policy.module.js.map