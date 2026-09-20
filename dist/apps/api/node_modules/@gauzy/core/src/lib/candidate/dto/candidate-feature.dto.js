"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateFeatureDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CandidateFeatureDTO {
}
exports.CandidateFeatureDTO = CandidateFeatureDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, readOnly: true }),
    (0, class_validator_1.ValidateIf)((it) => !it.candidate || it.candidateId),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], CandidateFeatureDTO.prototype, "candidateId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Object, readOnly: true }),
    (0, class_validator_1.ValidateIf)((it) => !it.candidateId || it.candidate),
    (0, class_validator_1.IsObject)(),
    tslib_1.__metadata("design:type", Object)
], CandidateFeatureDTO.prototype, "candidate", void 0);
//# sourceMappingURL=candidate-feature.dto.js.map