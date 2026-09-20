"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCandidateSkillDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const dto_1 = require("./../../core/dto");
class UpdateCandidateSkillDTO extends dto_1.TenantOrganizationBaseDTO {
}
exports.UpdateCandidateSkillDTO = UpdateCandidateSkillDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, required: true, readOnly: true }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], UpdateCandidateSkillDTO.prototype, "name", void 0);
//# sourceMappingURL=update-candidate-skill.dto.js.map