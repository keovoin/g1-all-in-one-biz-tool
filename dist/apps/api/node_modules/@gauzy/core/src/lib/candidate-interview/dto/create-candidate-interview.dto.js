"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCandidateInterviewDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const mapped_types_1 = require("@nestjs/mapped-types");
const class_validator_1 = require("class-validator");
const dto_1 = require("./../../core/dto");
const dto_2 = require("./../../candidate/dto");
/**
 * CREATE candidate interview DTO request validation
 *
 */
class CreateCandidateInterviewDTO extends (0, mapped_types_1.IntersectionType)(dto_2.CandidateFeatureDTO, dto_1.TenantOrganizationBaseDTO) {
}
exports.CreateCandidateInterviewDTO = CreateCandidateInterviewDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, readOnly: true }),
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", Object)
], CreateCandidateInterviewDTO.prototype, "title", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Date, readOnly: true }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsDateString)(),
    tslib_1.__metadata("design:type", Object)
], CreateCandidateInterviewDTO.prototype, "startTime", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Date, readOnly: true }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsDateString)(),
    tslib_1.__metadata("design:type", Object)
], CreateCandidateInterviewDTO.prototype, "endTime", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, readOnly: true }),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Object)
], CreateCandidateInterviewDTO.prototype, "location", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, readOnly: true }),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Object)
], CreateCandidateInterviewDTO.prototype, "note", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Number, readOnly: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    tslib_1.__metadata("design:type", Object)
], CreateCandidateInterviewDTO.prototype, "rating", void 0);
//# sourceMappingURL=create-candidate-interview.dto.js.map