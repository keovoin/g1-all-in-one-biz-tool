"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandHandlers = void 0;
const employee_bulk_create_handler_1 = require("./employee.bulk.create.handler");
const employee_create_handler_1 = require("./employee.create.handler");
const employee_get_handler_1 = require("./employee.get.handler");
const employee_update_handler_1 = require("./employee.update.handler");
const working_employee_get_handler_1 = require("./working-employee.get.handler");
exports.CommandHandlers = [
    employee_create_handler_1.EmployeeCreateHandler,
    employee_bulk_create_handler_1.EmployeeBulkCreateHandler,
    employee_get_handler_1.EmployeeGetHandler,
    employee_update_handler_1.EmployeeUpdateHandler,
    working_employee_get_handler_1.WorkingEmployeeGetHandler
];
//# sourceMappingURL=index.js.map