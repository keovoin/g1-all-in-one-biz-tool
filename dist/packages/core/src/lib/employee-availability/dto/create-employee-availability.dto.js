"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateEmployeeAvailabilityDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const dto_1 = require("../../core/dto");
const employee_availability_entity_1 = require("../employee-availability.entity");
class CreateEmployeeAvailabilityDTO extends (0, swagger_1.IntersectionType)(dto_1.TenantOrganizationBaseDTO, (0, swagger_1.PickType)(employee_availability_entity_1.EmployeeAvailability, [
    'dayOfWeek',
    'startDate',
    'endDate',
    'availabilityNotes',
    'availabilityStatus',
    'employeeId'
])) {
}
exports.CreateEmployeeAvailabilityDTO = CreateEmployeeAvailabilityDTO;
//# sourceMappingURL=create-employee-availability.dto.js.map