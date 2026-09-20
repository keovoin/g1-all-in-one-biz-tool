"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateEmployeeRecurringExpenseDTO = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const swagger_1 = require("@nestjs/swagger");
const dto_1 = require("./../../employee/dto");
const dto_2 = require("./../../currency/dto");
const employee_recurring_expense_dto_1 = require("./employee-recurring-expense.dto");
class CreateEmployeeRecurringExpenseDTO extends (0, mapped_types_1.IntersectionType)(employee_recurring_expense_dto_1.EmployeeRecurringExpenseDTO, 
// `employee` / `employeeId` must stay OPTIONAL here, same as `CreateExpenseDTO` already wraps
// `EmployeeFeatureDTO` in `PartialType`: the UI's "All Employees" option (`ga-employee-selector`
// with `showAllEmployeesOption`) submits neither field (see
// `RecurringExpensesEmployeeComponent._recurringExpenseMutationResultTransform`, which sends
// `employeeId: null` and omits `employee` entirely for the ALL_EMPLOYEES_SELECTED sentinel).
// Without `PartialType`, `EmployeeFeatureDTO`'s `@ValidateIf` pair forces `@IsObject()` on the
// absent `employee` and `@IsString()` on the null `employeeId`, so both fail and every "All
// Employees" recurring expense is rejected with an HTTP 400 (#8889) even though
// `EmployeeBelongsToOrganizationConstraint` already tolerates an empty/null employee for this
// exact org-level case.
(0, swagger_1.PartialType)(dto_1.EmployeeFeatureDTO), dto_2.RelationalCurrencyDTO) {
}
exports.CreateEmployeeRecurringExpenseDTO = CreateEmployeeRecurringExpenseDTO;
//# sourceMappingURL=create-employee-recurring-expense.dto.js.map