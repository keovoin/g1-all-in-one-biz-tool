"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateOrganizationDepartmentDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const dto_1 = require("./../../core/dto");
class CreateOrganizationDepartmentDTO extends dto_1.TenantOrganizationBaseDTO {
}
exports.CreateOrganizationDepartmentDTO = CreateOrganizationDepartmentDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], CreateOrganizationDepartmentDTO.prototype, "name", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    tslib_1.__metadata("design:type", Array)
], CreateOrganizationDepartmentDTO.prototype, "tags", void 0);
//# sourceMappingURL=create-organization-department.dto.js.map