"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCandidateFeedbackDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const mapped_types_1 = require("@nestjs/mapped-types");
const class_validator_1 = require("class-validator");
const contracts_1 = require("@gauzy/contracts");
const dto_1 = require("./../../core/dto");
const dto_2 = require("./../../candidate/dto");
const dto_3 = require("./../../candidate-interviewers/dto");
const dto_4 = require("./../../candidate-interview/dto");
/**
 * CREATE candidate feedback DTO request validation
 *
 */
class CreateCandidateFeedbackDTO extends (0, mapped_types_1.IntersectionType)(dto_1.TenantOrganizationBaseDTO, dto_2.CandidateFeatureDTO, dto_3.CandidateInterviewerFeatureDTO, dto_4.CandidateInterviewFeatureDTO) {
}
exports.CreateCandidateFeedbackDTO = CreateCandidateFeedbackDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, readOnly: true }),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", String)
], CreateCandidateFeedbackDTO.prototype, "description", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, readOnly: true }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    tslib_1.__metadata("design:type", Number)
], CreateCandidateFeedbackDTO.prototype, "rating", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, enum: contracts_1.CandidateStatusEnum, readOnly: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contracts_1.CandidateStatusEnum),
    tslib_1.__metadata("design:type", String)
], CreateCandidateFeedbackDTO.prototype, "status", void 0);
//# sourceMappingURL=create-candidate-feedback.dto.js.map