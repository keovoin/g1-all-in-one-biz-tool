"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationDepartmentEditByEmployeeHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const organization_department_edit_by_employee_command_1 = require("../organization-department.edit-by-employee.command");
const organization_department_service_1 = require("../../organization-department.service");
const handlers_1 = require("../../../shared/handlers");
let OrganizationDepartmentEditByEmployeeHandler = class OrganizationDepartmentEditByEmployeeHandler extends handlers_1.UpdateEntityByMembersHandler {
    constructor(organizationDepartmentService) {
        super(organizationDepartmentService);
        this.organizationDepartmentService = organizationDepartmentService;
    }
    /**
     * Executes the organization department edit command by an employee.
     *
     * @param command - The command containing the input for editing the organization department.
     * @returns A promise that resolves with the result of the command execution.
     */
    async execute(command) {
        // Extract the input from the command and execute the command logic
        return this.executeCommand(command.input);
    }
};
exports.OrganizationDepartmentEditByEmployeeHandler = OrganizationDepartmentEditByEmployeeHandler;
exports.OrganizationDepartmentEditByEmployeeHandler = OrganizationDepartmentEditByEmployeeHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(organization_department_edit_by_employee_command_1.OrganizationDepartmentEditByEmployeeCommand),
    tslib_1.__metadata("design:paramtypes", [organization_department_service_1.OrganizationDepartmentService])
], OrganizationDepartmentEditByEmployeeHandler);
//# sourceMappingURL=organization-department.edit-by-employee.handler.js.map