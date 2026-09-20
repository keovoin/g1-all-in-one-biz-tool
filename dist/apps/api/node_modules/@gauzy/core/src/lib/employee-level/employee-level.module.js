"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeLevelModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const cqrs_1 = require("@nestjs/cqrs");
const nestjs_1 = require("@mikro-orm/nestjs");
const employee_level_controller_1 = require("./employee-level.controller");
const employee_level_service_1 = require("./employee-level.service");
const employee_level_entity_1 = require("./employee-level.entity");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const type_orm_employee_level_repository_1 = require("./repository/type-orm-employee-level.repository");
const mikro_orm_employee_level_repository_1 = require("./repository/mikro-orm-employee-level.repository");
let EmployeeLevelModule = class EmployeeLevelModule {
};
exports.EmployeeLevelModule = EmployeeLevelModule;
exports.EmployeeLevelModule = EmployeeLevelModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([employee_level_entity_1.EmployeeLevel]),
            nestjs_1.MikroOrmModule.forFeature([employee_level_entity_1.EmployeeLevel]),
            role_permission_module_1.RolePermissionModule,
            cqrs_1.CqrsModule
        ],
        controllers: [employee_level_controller_1.EmployeeLevelController],
        providers: [employee_level_service_1.EmployeeLevelService, type_orm_employee_level_repository_1.TypeOrmEmployeeLevelRepository, mikro_orm_employee_level_repository_1.MikroOrmEmployeeLevelRepository]
    })
], EmployeeLevelModule);
//# sourceMappingURL=employee-level.module.js.map