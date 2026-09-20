"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateBulkInputDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const create_candidate_dto_1 = require("./create-candidate.dto");
class CandidateBulkInputDTO {
}
exports.CandidateBulkInputDTO = CandidateBulkInputDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Array, required: true }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => create_candidate_dto_1.CreateCandidateDTO),
    tslib_1.__metadata("design:type", Array)
], CandidateBulkInputDTO.prototype, "list", void 0);
//# sourceMappingURL=candidate-bulk-input.dto.js.map