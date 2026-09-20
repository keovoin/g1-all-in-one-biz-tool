"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCandidateSkillDTO = void 0;
const tslib_1 = require("tslib");
const mapped_types_1 = require("@nestjs/mapped-types");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const dto_1 = require("./../../core/dto");
const dto_2 = require("./../../candidate/dto");
class CreateCandidateSkillDTO extends (0, mapped_types_1.IntersectionType)(dto_2.CandidateFeatureDTO, dto_1.TenantOrganizationBaseDTO) {
}
exports.CreateCandidateSkillDTO = CreateCandidateSkillDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, required: true, readOnly: true }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], CreateCandidateSkillDTO.prototype, "name", void 0);
//# sourceMappingURL=create-candidate-skill.dto.js.map