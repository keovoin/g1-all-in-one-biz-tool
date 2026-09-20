"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCandidateDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const dto_1 = require("./../../employee/dto");
const candidate_entity_1 = require("../candidate.entity");
class UpdateCandidateDTO extends (0, swagger_1.IntersectionType)(dto_1.UpdateProfileDTO, (0, swagger_1.PickType)(candidate_entity_1.Candidate, ['appliedDate', 'hiredDate', 'cvUrl', 'candidateLevel'])) {
}
exports.UpdateCandidateDTO = UpdateCandidateDTO;
//# sourceMappingURL=update-candidate.dto.js.map