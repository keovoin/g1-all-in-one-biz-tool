"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationRecurringExpenseModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const handlers_1 = require("./commands/handlers");
const organization_recurring_expense_controller_1 = require("./organization-recurring-expense.controller");
const organization_recurring_expense_entity_1 = require("./organization-recurring-expense.entity");
const organization_recurring_expense_service_1 = require("./organization-recurring-expense.service");
const handlers_2 = require("./queries/handlers");
const employee_module_1 = require("../employee/employee.module");
const organization_module_1 = require("../organization/organization.module");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const type_orm_organization_recurring_expense_repository_1 = require("./repository/type-orm-organization-recurring-expense.repository");
const mikro_orm_organization_recurring_expense_repository_1 = require("./repository/mikro-orm-organization-recurring-expense.repository");
let OrganizationRecurringExpenseModule = class OrganizationRecurringExpenseModule {
};
exports.OrganizationRecurringExpenseModule = OrganizationRecurringExpenseModule;
exports.OrganizationRecurringExpenseModule = OrganizationRecurringExpenseModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([organization_recurring_expense_entity_1.OrganizationRecurringExpense]),
            nestjs_1.MikroOrmModule.forFeature([organization_recurring_expense_entity_1.OrganizationRecurringExpense]),
            role_permission_module_1.RolePermissionModule,
            employee_module_1.EmployeeModule,
            organization_module_1.OrganizationModule,
            cqrs_1.CqrsModule
        ],
        controllers: [organization_recurring_expense_controller_1.OrganizationRecurringExpenseController],
        providers: [
            organization_recurring_expense_service_1.OrganizationRecurringExpenseService,
            type_orm_organization_recurring_expense_repository_1.TypeOrmOrganizationRecurringExpenseRepository, mikro_orm_organization_recurring_expense_repository_1.MikroOrmOrganizationRecurringExpenseRepository,
            ...handlers_2.QueryHandlers,
            ...handlers_1.CommandHandlers
        ],
        exports: [organization_recurring_expense_service_1.OrganizationRecurringExpenseService]
    })
], OrganizationRecurringExpenseModule);
//# sourceMappingURL=organization-recurring-expense.module.js.map