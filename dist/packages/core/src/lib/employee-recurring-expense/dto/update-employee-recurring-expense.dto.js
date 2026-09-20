"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateEmployeeRecurringExpenseDTO = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const swagger_1 = require("@nestjs/swagger");
const dto_1 = require("./../../employee/dto");
const dto_2 = require("./../../currency/dto");
const employee_recurring_expense_dto_1 = require("./employee-recurring-expense.dto");
class UpdateEmployeeRecurringExpenseDTO extends (0, mapped_types_1.IntersectionType)(employee_recurring_expense_dto_1.EmployeeRecurringExpenseDTO, 
// See CreateEmployeeRecurringExpenseDTO: `employee` / `employeeId` must stay optional so an
// existing recurring expense can be edited back to "All Employees" (employeeId null) without
// the same HTTP 400 (#8889).
(0, swagger_1.PartialType)(dto_1.EmployeeFeatureDTO), dto_2.RelationalCurrencyDTO) {
}
exports.UpdateEmployeeRecurringExpenseDTO = UpdateEmployeeRecurringExpenseDTO;
//# sourceMappingURL=update-employee-recurring-expense.dto.js.map