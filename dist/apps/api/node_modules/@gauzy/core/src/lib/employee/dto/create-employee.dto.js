"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateEmployeeDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const mapped_types_1 = require("@nestjs/mapped-types");
const employment_dto_1 = require("./employment.dto");
const user_input_dto_1 = require("./user-input-dto");
const dto_1 = require("./../../tags/dto");
/**
 * Employee Create DTO
 *
 */
class CreateEmployeeDTO extends (0, mapped_types_1.IntersectionType)(employment_dto_1.EmploymentDTO, dto_1.RelationalTagDTO) {
}
exports.CreateEmployeeDTO = CreateEmployeeDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => user_input_dto_1.UserInputDTO }),
    (0, class_validator_1.ValidateIf)((it) => !it.userId),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => user_input_dto_1.UserInputDTO),
    tslib_1.__metadata("design:type", user_input_dto_1.UserInputDTO)
], CreateEmployeeDTO.prototype, "user", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.ValidateIf)((it) => !it.user),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], CreateEmployeeDTO.prototype, "userId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, required: true }),
    (0, class_validator_1.ValidateIf)((it) => !it.userId),
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", String)
], CreateEmployeeDTO.prototype, "password", void 0);
//# sourceMappingURL=create-employee.dto.js.map