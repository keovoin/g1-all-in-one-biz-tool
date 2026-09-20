"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateSourceBulkInputDTO = void 0;
const tslib_1 = require("tslib");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const create_candidate_source_dto_1 = require("./create-candidate-source.dto");
class CandidateSourceBulkInputDTO {
}
exports.CandidateSourceBulkInputDTO = CandidateSourceBulkInputDTO;
tslib_1.__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => create_candidate_source_dto_1.CreateCandidateSourceDTO),
    tslib_1.__metadata("design:type", Array)
], CandidateSourceBulkInputDTO.prototype, "list", void 0);
//# sourceMappingURL=candidate-source-bulk-input.dto.js.map