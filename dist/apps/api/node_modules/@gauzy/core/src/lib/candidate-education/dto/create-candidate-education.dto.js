"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCandidateEducationDTO = void 0;
const tslib_1 = require("tslib");
const mapped_types_1 = require("@nestjs/mapped-types");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const dto_1 = require("./../../core/dto");
const dto_2 = require("./../../candidate/dto");
class CreateCandidateEducationDTO extends (0, mapped_types_1.IntersectionType)(dto_2.CandidateFeatureDTO, dto_1.TenantOrganizationBaseDTO) {
}
exports.CreateCandidateEducationDTO = CreateCandidateEducationDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, readOnly: true }),
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", String)
], CreateCandidateEducationDTO.prototype, "schoolName", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, readOnly: true }),
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", String)
], CreateCandidateEducationDTO.prototype, "degree", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, readOnly: true }),
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", String)
], CreateCandidateEducationDTO.prototype, "field", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Date, readOnly: true }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsDateString)(),
    tslib_1.__metadata("design:type", Date)
], CreateCandidateEducationDTO.prototype, "completionDate", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, readOnly: true }),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", String)
], CreateCandidateEducationDTO.prototype, "notes", void 0);
//# sourceMappingURL=create-candidate-education.dto.js.map