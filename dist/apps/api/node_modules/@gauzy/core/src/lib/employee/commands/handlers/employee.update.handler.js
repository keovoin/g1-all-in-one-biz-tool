"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeUpdateHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const contracts_1 = require("@gauzy/contracts");
const cqrs_1 = require("@nestjs/cqrs");
const employee_update_command_1 = require("./../employee.update.command");
const employee_service_1 = require("./../../employee.service");
const context_1 = require("./../../../core/context");
let EmployeeUpdateHandler = class EmployeeUpdateHandler {
    constructor(_employeeService) {
        this._employeeService = _employeeService;
    }
    /**
     * Handles the execution of the `EmployeeUpdateCommand`.
     * Ensures proper permissions are enforced and updates the employee's profile.
     *
     * @param command - The `EmployeeUpdateCommand` containing the employee ID and input data.
     * @returns The updated employee entity.
     * @throws ForbiddenException if the user lacks permissions or tries to edit another employee's profile.
     * @throws BadRequestException if the update operation fails.
     */
    async execute(command) {
        const { id, input } = command;
        const user = context_1.RequestContext.currentUser();
        /**
         * If user/employee has only own profile edit permission
         */
        if (context_1.RequestContext.hasPermission(contracts_1.PermissionsEnum.PROFILE_EDIT) &&
            !context_1.RequestContext.hasPermission(contracts_1.PermissionsEnum.ORG_EMPLOYEES_EDIT)) {
            if (user.employeeId !== id) {
                throw new common_1.ForbiddenException('Failed to update employee profile.');
            }
        }
        try {
            // Use `create` to save the entity, ensuring ManyToMany relations are persisted
            return await this._employeeService.create({
                ...input,
                upworkId: input.upworkId || null,
                linkedInId: input.linkedInId || null,
                id
            });
        }
        catch (error) {
            // Handle any errors during the update process
            throw new common_1.BadRequestException(error.message || 'Failed to update employee profile.');
        }
    }
};
exports.EmployeeUpdateHandler = EmployeeUpdateHandler;
exports.EmployeeUpdateHandler = EmployeeUpdateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(employee_update_command_1.EmployeeUpdateCommand),
    tslib_1.__metadata("design:paramtypes", [employee_service_1.EmployeeService])
], EmployeeUpdateHandler);
//# sourceMappingURL=employee.update.handler.js.map