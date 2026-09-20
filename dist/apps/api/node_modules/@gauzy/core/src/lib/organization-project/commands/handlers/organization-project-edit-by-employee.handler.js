"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationProjectEditByEmployeeHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const organization_project_service_1 = require("../../organization-project.service");
const organization_project_edit_by_employee_command_1 = require("../organization-project-edit-by-employee.command");
let OrganizationProjectEditByEmployeeHandler = class OrganizationProjectEditByEmployeeHandler {
    constructor(organizationProjectService) {
        this.organizationProjectService = organizationProjectService;
    }
    /**
     * Executes the organization project edit command by an employee.
     *
     * @param command - The command containing the input for editing the organization project.
     * @returns A promise that resolves with the result of the command execution.
     */
    async execute(command) {
        // Extracts the input from the command and executes the command logic
        const { input } = command;
        // Update the organization project by an employee
        return await this.organizationProjectService.updateByEmployee(input);
    }
};
exports.OrganizationProjectEditByEmployeeHandler = OrganizationProjectEditByEmployeeHandler;
exports.OrganizationProjectEditByEmployeeHandler = OrganizationProjectEditByEmployeeHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(organization_project_edit_by_employee_command_1.OrganizationProjectEditByEmployeeCommand),
    tslib_1.__metadata("design:paramtypes", [organization_project_service_1.OrganizationProjectService])
], OrganizationProjectEditByEmployeeHandler);
//# sourceMappingURL=organization-project-edit-by-employee.handler.js.map