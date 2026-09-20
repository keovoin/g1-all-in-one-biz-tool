"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCandidateSourceDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const dto_1 = require("./../../core/dto");
class CreateCandidateSourceDTO extends dto_1.TenantOrganizationBaseDTO {
}
exports.CreateCandidateSourceDTO = CreateCandidateSourceDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, readOnly: true }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], CreateCandidateSourceDTO.prototype, "name", void 0);
//# sourceMappingURL=create-candidate-source.dto.js.map