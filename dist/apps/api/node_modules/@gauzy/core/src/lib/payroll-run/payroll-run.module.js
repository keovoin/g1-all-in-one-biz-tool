"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayrollRunModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const employee_entity_1 = require("./../employee/employee.entity");
const payroll_item_entity_1 = require("./../payroll-item/payroll-item.entity");
const mikro_orm_payroll_item_repository_1 = require("./../payroll-item/repository/mikro-orm-payroll-item.repository");
const type_orm_payroll_item_repository_1 = require("./../payroll-item/repository/type-orm-payroll-item.repository");
const role_permission_module_1 = require("./../role-permission/role-permission.module");
const payroll_run_entity_1 = require("./payroll-run.entity");
const payroll_run_controller_1 = require("./payroll-run.controller");
const payroll_run_service_1 = require("./payroll-run.service");
const mikro_orm_payroll_run_repository_1 = require("./repository/mikro-orm-payroll-run.repository");
const type_orm_payroll_run_repository_1 = require("./repository/type-orm-payroll-run.repository");
/**
 * Payroll runs and their line items (issue #2453).
 *
 * `Employee` is registered with `forFeature` here so the service can verify that a line item is
 * paid to somebody in the caller's own organization, without importing `EmployeeModule` and
 * risking a cycle.
 */
let PayrollRunModule = class PayrollRunModule {
};
exports.PayrollRunModule = PayrollRunModule;
exports.PayrollRunModule = PayrollRunModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([payroll_run_entity_1.PayrollRun, payroll_item_entity_1.PayrollItem, employee_entity_1.Employee]),
            nestjs_1.MikroOrmModule.forFeature([payroll_run_entity_1.PayrollRun, payroll_item_entity_1.PayrollItem]),
            role_permission_module_1.RolePermissionModule
        ],
        controllers: [payroll_run_controller_1.PayrollRunController],
        providers: [
            payroll_run_service_1.PayrollRunService,
            type_orm_payroll_run_repository_1.TypeOrmPayrollRunRepository,
            mikro_orm_payroll_run_repository_1.MikroOrmPayrollRunRepository,
            type_orm_payroll_item_repository_1.TypeOrmPayrollItemRepository,
            mikro_orm_payroll_item_repository_1.MikroOrmPayrollItemRepository
        ],
        exports: [payroll_run_service_1.PayrollRunService, type_orm_payroll_run_repository_1.TypeOrmPayrollRunRepository, mikro_orm_payroll_run_repository_1.MikroOrmPayrollRunRepository]
    })
], PayrollRunModule);
//# sourceMappingURL=payroll-run.module.js.map