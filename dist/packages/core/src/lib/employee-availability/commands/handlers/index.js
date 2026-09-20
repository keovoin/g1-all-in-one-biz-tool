"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandHandlers = void 0;
const employee_availability_bulk_create_handler_1 = require("./employee-availability.bulk.create.handler");
const employee_availability_create_handler_1 = require("./employee-availability.create.handler");
/**
 * Exports all command handlers for EmployeeAvailability.`
 */
exports.CommandHandlers = [employee_availability_bulk_create_handler_1.EmployeeAvailabilityBulkCreateHandler, employee_availability_create_handler_1.EmployeeAvailabilityCreateHandler];
//# sourceMappingURL=index.js.map