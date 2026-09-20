"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCandidateInterviewDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const create_candidate_interview_dto_1 = require("./create-candidate-interview.dto");
/**
 * UPDATE candidate interview DTO request validation
 *
 */
class UpdateCandidateInterviewDTO extends create_candidate_interview_dto_1.CreateCandidateInterviewDTO {
}
exports.UpdateCandidateInterviewDTO = UpdateCandidateInterviewDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean, readOnly: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    tslib_1.__metadata("design:type", Object)
], UpdateCandidateInterviewDTO.prototype, "isArchived", void 0);
//# sourceMappingURL=update-candidate-interview.dto.js.map