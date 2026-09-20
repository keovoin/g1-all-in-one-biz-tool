"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateInterviewFeatureDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CandidateInterviewFeatureDTO {
}
exports.CandidateInterviewFeatureDTO = CandidateInterviewFeatureDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, readOnly: true }),
    (0, class_validator_1.ValidateIf)((it) => !it.interviewerId || it.interviewer),
    (0, class_validator_1.IsObject)(),
    tslib_1.__metadata("design:type", Object)
], CandidateInterviewFeatureDTO.prototype, "interview", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Object, readOnly: true }),
    (0, class_validator_1.ValidateIf)((it) => !it.interviewer || it.interviewerId),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", Object)
], CandidateInterviewFeatureDTO.prototype, "interviewId", void 0);
//# sourceMappingURL=candidate-interview-feature.dto.js.map