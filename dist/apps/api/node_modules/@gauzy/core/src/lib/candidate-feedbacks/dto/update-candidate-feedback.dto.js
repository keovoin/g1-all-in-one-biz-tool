"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCandidateFeedbackDTO = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_candidate_feedback_dto_1 = require("./create-candidate-feedback.dto");
/**
 * UPDATE candidate feedback DTO request validation
 *
 */
class UpdateCandidateFeedbackDTO extends (0, mapped_types_1.OmitType)(create_candidate_feedback_dto_1.CreateCandidateFeedbackDTO, ['candidate', 'candidateId']) {
}
exports.UpdateCandidateFeedbackDTO = UpdateCandidateFeedbackDTO;
//# sourceMappingURL=update-candidate-feedback.dto.js.map