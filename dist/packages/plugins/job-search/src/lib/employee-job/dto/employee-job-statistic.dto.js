"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeJobStatisticDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const core_1 = require("@gauzy/core");
/**
 * Employee Job Statistic DTO
 */
class EmployeeJobStatisticDTO extends core_1.TenantOrganizationBaseDTO {
}
exports.EmployeeJobStatisticDTO = EmployeeJobStatisticDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Boolean }),
    (0, class_validator_1.IsBoolean)(),
    tslib_1.__metadata("design:type", Boolean)
], EmployeeJobStatisticDTO.prototype, "isJobSearchActive", void 0);
//# sourceMappingURL=employee-job-statistic.dto.js.map