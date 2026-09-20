"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobPresetQueryDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const core_1 = require("@gauzy/core");
class JobPresetQueryDTO extends (0, swagger_1.IntersectionType)(core_1.TenantOrganizationBaseDTO, (0, swagger_1.PartialType)((0, swagger_1.PickType)(core_1.EmployeeFeatureDTO, ['employeeId']))) {
}
exports.JobPresetQueryDTO = JobPresetQueryDTO;
//# sourceMappingURL=job-preset-query.dto.js.map