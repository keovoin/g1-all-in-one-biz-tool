"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateEmployeeAwardDTO = void 0;
const tslib_1 = require("tslib");
const mapped_types_1 = require("@nestjs/mapped-types");
const class_validator_1 = require("class-validator");
const dto_1 = require("./../../core/dto");
const dto_2 = require("./../../employee/dto");
/**
 * Create employee award DTO validation
 */
class CreateEmployeeAwardDTO extends (0, mapped_types_1.IntersectionType)(dto_1.TenantOrganizationBaseDTO, dto_2.EmployeeFeatureDTO) {
}
exports.CreateEmployeeAwardDTO = CreateEmployeeAwardDTO;
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", String)
], CreateEmployeeAwardDTO.prototype, "name", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", String)
], CreateEmployeeAwardDTO.prototype, "year", void 0);
//# sourceMappingURL=create-employee-award.dto.js.map