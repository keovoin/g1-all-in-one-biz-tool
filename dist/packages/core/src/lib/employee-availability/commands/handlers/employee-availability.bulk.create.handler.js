"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeAvailabilityBulkCreateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const context_1 = require("../../../core/context");
const employee_availability_service_1 = require("../../employee-availability.service");
const employee_availability_bulk_create_command_1 = require("../employee-availability.bulk.create.command");
const employee_availability_entity_1 = require("../../employee-availability.entity");
/**
 * Handles the bulk creation of employee availability records.
 */
let EmployeeAvailabilityBulkCreateHandler = class EmployeeAvailabilityBulkCreateHandler {
    constructor(_availabilityService) {
        this._availabilityService = _availabilityService;
    }
    /**
     * Executes the bulk creation command for employee availability.
     *
     * @param command The command containing the list of availability records to create.
     * @returns A promise resolving to the list of created employee availability records.
     */
    async execute(command) {
        const { input } = command;
        const tenantId = context_1.RequestContext.currentTenantId();
        // Prepare employee availability records with tenantId
        const employeeAvailabilities = input.map(item => new employee_availability_entity_1.EmployeeAvailability({
            ...item,
            tenantId
        }));
        // Perform bulk insert using the availability service
        return await this._availabilityService.bulkCreate(employeeAvailabilities);
    }
};
exports.EmployeeAvailabilityBulkCreateHandler = EmployeeAvailabilityBulkCreateHandler;
exports.EmployeeAvailabilityBulkCreateHandler = EmployeeAvailabilityBulkCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(employee_availability_bulk_create_command_1.EmployeeAvailabilityBulkCreateCommand),
    tslib_1.__metadata("design:paramtypes", [employee_availability_service_1.EmployeeAvailabilityService])
], EmployeeAvailabilityBulkCreateHandler);
//# sourceMappingURL=employee-availability.bulk.create.handler.js.map