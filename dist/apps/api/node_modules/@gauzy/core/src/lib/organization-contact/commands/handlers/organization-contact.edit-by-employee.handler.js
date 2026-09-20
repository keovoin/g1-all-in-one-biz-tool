"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationContactEditByEmployeeHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const handlers_1 = require("../../../shared/handlers");
const organization_contact_service_1 = require("../../organization-contact.service");
const organization_contact_edit_by_employee_command_1 = require("../organization-contact.edit-by-employee.command");
let OrganizationContactEditByEmployeeHandler = class OrganizationContactEditByEmployeeHandler extends handlers_1.UpdateEntityByMembersHandler {
    constructor(organizationContactService) {
        super(organizationContactService);
        this.organizationContactService = organizationContactService;
    }
    /**
     * Executes the organization contact edit command by an employee.
     *
     * @param command - The command containing the input for editing the organization contact.
     * @returns A promise that resolves with the result of the command execution.
     */
    async execute(command) {
        // Extract the input from the command and execute the command logic
        return this.executeCommand(command.input);
    }
};
exports.OrganizationContactEditByEmployeeHandler = OrganizationContactEditByEmployeeHandler;
exports.OrganizationContactEditByEmployeeHandler = OrganizationContactEditByEmployeeHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(organization_contact_edit_by_employee_command_1.OrganizationContactEditByEmployeeCommand),
    tslib_1.__metadata("design:paramtypes", [organization_contact_service_1.OrganizationContactService])
], OrganizationContactEditByEmployeeHandler);
//# sourceMappingURL=organization-contact.edit-by-employee.handler.js.map