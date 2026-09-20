"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyResultBulkInputDTO = void 0;
const tslib_1 = require("tslib");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const create_key_result_dto_1 = require("./create-key-result.dto");
class KeyResultBulkInputDTO {
}
exports.KeyResultBulkInputDTO = KeyResultBulkInputDTO;
tslib_1.__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => create_key_result_dto_1.CreateKeyResultDTO),
    tslib_1.__metadata("design:type", Array)
], KeyResultBulkInputDTO.prototype, "list", void 0);
//# sourceMappingURL=key-result-bulk-input.dto.js.map