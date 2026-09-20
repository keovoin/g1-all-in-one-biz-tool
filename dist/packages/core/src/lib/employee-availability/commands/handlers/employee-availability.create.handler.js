"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeAvailabilityCreateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const context_1 = require("../../../core/context");
const employee_availability_service_1 = require("../../employee-availability.service");
const employee_availability_entity_1 = require("../../employee-availability.entity");
const employee_availability_create_command_1 = require("../employee-availability.create.command");
let EmployeeAvailabilityCreateHandler = class EmployeeAvailabilityCreateHandler {
    constructor(_availabilityService) {
        this._availabilityService = _availabilityService;
    }
    /**
     * Handles the creation of an employee availability record.
     *
     * @param {EmployeeAvailabilityCreateCommand} command - The command containing employee availability details.
     * @returns {Promise<IEmployeeAvailability>} - The newly created employee availability record.
     * @throws {BadRequestException} - If any validation fails (e.g., missing fields, invalid dates).
     */
    async execute(command) {
        const { input } = command;
        const tenantId = context_1.RequestContext.currentTenantId() ?? input.tenantId;
        return await this._availabilityService.create(new employee_availability_entity_1.EmployeeAvailability({
            ...input,
            tenantId
        }));
    }
};
exports.EmployeeAvailabilityCreateHandler = EmployeeAvailabilityCreateHandler;
exports.EmployeeAvailabilityCreateHandler = EmployeeAvailabilityCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(employee_availability_create_command_1.EmployeeAvailabilityCreateCommand),
    tslib_1.__metadata("design:paramtypes", [employee_availability_service_1.EmployeeAvailabilityService])
], EmployeeAvailabilityCreateHandler);
//# sourceMappingURL=employee-availability.create.handler.js.map