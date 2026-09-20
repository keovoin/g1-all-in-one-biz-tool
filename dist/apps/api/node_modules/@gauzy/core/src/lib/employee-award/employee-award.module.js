"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeAwardModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const employee_award_entity_1 = require("./employee-award.entity");
const employee_award_controller_1 = require("./employee-award.controller");
const employee_award_service_1 = require("./employee-award.service");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const type_orm_employee_award_repository_1 = require("./repository/type-orm-employee-award.repository");
const mikro_orm_employee_award_repository_1 = require("./repository/mikro-orm-employee-award.repository");
let EmployeeAwardModule = class EmployeeAwardModule {
};
exports.EmployeeAwardModule = EmployeeAwardModule;
exports.EmployeeAwardModule = EmployeeAwardModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([employee_award_entity_1.EmployeeAward]),
            nestjs_1.MikroOrmModule.forFeature([employee_award_entity_1.EmployeeAward]),
            role_permission_module_1.RolePermissionModule
        ],
        controllers: [employee_award_controller_1.EmployeeAwardController],
        providers: [employee_award_service_1.EmployeeAwardService, type_orm_employee_award_repository_1.TypeOrmEmployeeAwardRepository, mikro_orm_employee_award_repository_1.MikroOrmEmployeeAwardRepository]
    })
], EmployeeAwardModule);
//# sourceMappingURL=employee-award.module.js.map