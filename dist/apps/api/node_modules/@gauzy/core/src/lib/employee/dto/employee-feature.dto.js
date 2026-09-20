"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeFeatureDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const employee_entity_1 = require("./../employee.entity");
const validators_1 = require("./../../shared/validators");
class EmployeeFeatureDTO {
}
exports.EmployeeFeatureDTO = EmployeeFeatureDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => employee_entity_1.Employee }),
    (0, class_validator_1.ValidateIf)((it) => !it.employeeId || it.employee),
    (0, class_validator_1.IsObject)(),
    (0, validators_1.IsEmployeeBelongsToOrganization)(),
    tslib_1.__metadata("design:type", Object)
], EmployeeFeatureDTO.prototype, "employee", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.ValidateIf)((it) => !it.employee || it.employeeId),
    (0, class_validator_1.IsString)(),
    (0, validators_1.IsEmployeeBelongsToOrganization)(),
    tslib_1.__metadata("design:type", String)
], EmployeeFeatureDTO.prototype, "employeeId", void 0);
//# sourceMappingURL=employee-feature.dto.js.map