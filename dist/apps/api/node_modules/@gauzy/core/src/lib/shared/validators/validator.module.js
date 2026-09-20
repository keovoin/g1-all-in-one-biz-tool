"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidatorModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const user_organization_module_1 = require("../../user-organization/user-organization.module");
const role_module_1 = require("../../role/role.module");
const employee_module_1 = require("../../employee/employee.module");
const expense_categories_module_1 = require("../../expense-categories/expense-categories.module");
const organization_team_module_1 = require("../../organization-team/organization-team.module");
const constraints_1 = require("./constraints");
let ValidatorModule = class ValidatorModule {
};
exports.ValidatorModule = ValidatorModule;
exports.ValidatorModule = ValidatorModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [employee_module_1.EmployeeModule, user_organization_module_1.UserOrganizationModule, role_module_1.RoleModule, expense_categories_module_1.ExpenseCategoriesModule, organization_team_module_1.OrganizationTeamModule],
        providers: [
            constraints_1.TenantBelongsToUserConstraint,
            constraints_1.RoleAlreadyExistConstraint,
            constraints_1.RoleShouldExistConstraint,
            constraints_1.EmployeeBelongsToOrganizationConstraint,
            constraints_1.TeamAlreadyExistConstraint,
            constraints_1.ExpenseCategoryAlreadyExistConstraint,
            constraints_1.OrganizationBelongsToUserConstraint
        ]
    })
], ValidatorModule);
//# sourceMappingURL=validator.module.js.map