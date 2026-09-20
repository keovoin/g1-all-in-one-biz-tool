"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateEmployeeJobSearchStatusHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const contracts_1 = require("@gauzy/contracts");
const plugin_integration_ai_1 = require("@gauzy/plugin-integration-ai");
const core_1 = require("@gauzy/core");
const update_employee_job_search_status_command_1 = require("../update-employee-job-search-status.command");
let UpdateEmployeeJobSearchStatusHandler = class UpdateEmployeeJobSearchStatusHandler {
    constructor(employeeService, gauzyAIService) {
        this.employeeService = employeeService;
        this.gauzyAIService = gauzyAIService;
    }
    /**
     * Executes the command to update an employee's job search status.
     *
     * @param command - The command containing the employee ID and input data.
     * @returns A promise resolving to the updated employee or the update result.
     */
    async execute(command) {
        const { input } = command;
        const { isJobSearchActive, organizationId } = input;
        let employeeId = command.employeeId;
        const tenantId = core_1.RequestContext.currentTenantId() ?? input.tenantId;
        // Check for permission CHANGE_SELECTED_EMPLOYEE
        if (!core_1.RequestContext.hasPermission(contracts_1.PermissionsEnum.CHANGE_SELECTED_EMPLOYEE)) {
            // Filter by current employee ID if the permission is not present
            employeeId = core_1.RequestContext.currentEmployeeId();
        }
        // Never query with an empty id: `where: { id: null }` used to drop the predicate and resolve
        // to an arbitrary employee of the tenant.
        if (!employeeId) {
            throw new common_1.BadRequestException('Employee context is required to update the job search status.');
        }
        if (!tenantId) {
            throw new common_1.BadRequestException('Tenant context is required to update the job search status.');
        }
        // Find the employee by ID
        const employee = await this.employeeService.findOneByIdString(employeeId, {
            where: { organizationId, tenantId },
            relations: { user: true, organization: true }
        });
        // Check if employee was found
        if (!employee) {
            throw new common_1.BadRequestException(`Employee with ID ${employeeId} not found. Please check the ID and try again.`);
        }
        try {
            // Get the user ID from the employee
            const userId = employee.userId;
            // Attempt to sync the employee with Gauzy AI
            const syncResult = await this.gauzyAIService.syncEmployees([employee]);
            if (syncResult) {
                try {
                    await this.gauzyAIService.updateEmployeeStatus({
                        employeeId,
                        userId,
                        tenantId,
                        organizationId,
                        isJobSearchActive
                    });
                    // Employee sync and status update were successful
                    console.log('Employee synced and job search status updated successfully.');
                }
                catch (error) {
                    // Handle errors during the status update operation
                    console.error('Error while updating employee job search status with Gauzy AI:', error.message);
                }
            }
            else {
                // Sync was not successful
                console.log('Employee sync with Gauzy AI failed.');
            }
        }
        catch (error) {
            // Handle errors during the sync operation
            console.error('Error while syncing employee with Gauzy AI:', error.message);
        }
        // Update the employee's job search status locally — scoped to the tenant explicitly (the
        // tenant-aware update relies on a request user, which this handler may run without).
        return await this.employeeService.update({ id: employeeId, tenantId }, { isJobSearchActive });
    }
};
exports.UpdateEmployeeJobSearchStatusHandler = UpdateEmployeeJobSearchStatusHandler;
exports.UpdateEmployeeJobSearchStatusHandler = UpdateEmployeeJobSearchStatusHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(update_employee_job_search_status_command_1.UpdateEmployeeJobSearchStatusCommand),
    tslib_1.__metadata("design:paramtypes", [core_1.EmployeeService, plugin_integration_ai_1.GauzyAIService])
], UpdateEmployeeJobSearchStatusHandler);
//# sourceMappingURL=update-employee-job-search-status.handler.js.map