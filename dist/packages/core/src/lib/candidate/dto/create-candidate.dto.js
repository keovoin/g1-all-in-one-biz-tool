"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCandidateDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const dto_1 = require("./../../tags/dto");
const dto_2 = require("./../../employee/dto");
/**
 * Candidate Create DTO
 *
 */
class CreateCandidateDTO extends (0, swagger_1.IntersectionType)(dto_2.EmploymentDTO, dto_1.RelationalTagDTO) {
}
exports.CreateCandidateDTO = CreateCandidateDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => dto_2.UserInputDTO, required: true }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsNotEmptyObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => dto_2.UserInputDTO),
    tslib_1.__metadata("design:type", dto_2.UserInputDTO)
], CreateCandidateDTO.prototype, "user", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, required: true }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Password should not be empty' }),
    (0, class_validator_1.MinLength)(8, {
        message: 'Password should be at least 8 characters long.'
    }),
    tslib_1.__metadata("design:type", String)
], CreateCandidateDTO.prototype, "password", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Object }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    tslib_1.__metadata("design:type", Array)
], CreateCandidateDTO.prototype, "documents", void 0);
//# sourceMappingURL=create-candidate.dto.js.map