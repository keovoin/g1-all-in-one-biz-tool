"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmploymentDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const dto_1 = require("./../../core/dto");
const dto_2 = require("./../../organization-employment-type/dto");
const dto_3 = require("./../../organization-department/dto");
const employee_entity_1 = require("../employee.entity");
class EmploymentDTO extends (0, swagger_1.IntersectionType)(dto_1.TenantOrganizationBaseDTO, (0, swagger_1.PickType)(employee_entity_1.Employee, [
    'startedWorkOn',
    'endWork',
    'short_description',
    'description',
    'anonymousBonus',
    'employeeLevel'
])) {
}
exports.EmploymentDTO = EmploymentDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => [dto_2.CreateOrganizationEmploymentTypeDTO] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => dto_2.CreateOrganizationEmploymentTypeDTO),
    tslib_1.__metadata("design:type", Array)
], EmploymentDTO.prototype, "organizationEmploymentTypes", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => [dto_3.CreateOrganizationDepartmentDTO] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => dto_3.CreateOrganizationDepartmentDTO),
    tslib_1.__metadata("design:type", Array)
], EmploymentDTO.prototype, "organizationDepartments", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Object }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    tslib_1.__metadata("design:type", Object)
], EmploymentDTO.prototype, "organizationPosition", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => [String] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    tslib_1.__metadata("design:type", Array)
], EmploymentDTO.prototype, "skills", void 0);
//# sourceMappingURL=employment.dto.js.map