"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BulkActivityInputDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const dto_1 = require("../../../core/dto");
const dto_2 = require("../../../employee/dto");
/**
 * Get activities request DTO validation
 */
class BulkActivityInputDTO extends (0, swagger_1.IntersectionType)(dto_1.TenantOrganizationBaseDTO, dto_2.EmployeeFeatureDTO) {
}
exports.BulkActivityInputDTO = BulkActivityInputDTO;
//# sourceMappingURL=bulk-activities-input.dto.js.map