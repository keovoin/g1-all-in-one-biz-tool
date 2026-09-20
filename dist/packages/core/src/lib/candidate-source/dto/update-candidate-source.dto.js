"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCandidateSourceDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const dto_1 = require("./../../core/dto");
class UpdateCandidateSourceDTO extends dto_1.TenantOrganizationBaseDTO {
}
exports.UpdateCandidateSourceDTO = UpdateCandidateSourceDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, readOnly: true }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], UpdateCandidateSourceDTO.prototype, "name", void 0);
//# sourceMappingURL=update-candidate-source.dto.js.map