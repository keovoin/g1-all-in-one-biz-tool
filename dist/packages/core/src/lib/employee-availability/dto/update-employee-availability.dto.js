"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateEmployeeAvailabilityDTO = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_employee_availability_dto_1 = require("./create-employee-availability.dto");
const swagger_1 = require("@nestjs/swagger");
class UpdateEmployeeAvailabilityDTO extends (0, swagger_1.IntersectionType)((0, mapped_types_1.PartialType)(create_employee_availability_dto_1.CreateEmployeeAvailabilityDTO)) {
}
exports.UpdateEmployeeAvailabilityDTO = UpdateEmployeeAvailabilityDTO;
//# sourceMappingURL=update-employee-availability.dto.js.map