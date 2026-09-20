"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MentionEmployeeIdsDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class MentionEmployeeIdsDTO {
}
exports.MentionEmployeeIdsDTO = MentionEmployeeIdsDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Array }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    tslib_1.__metadata("design:type", Array)
], MentionEmployeeIdsDTO.prototype, "mentionEmployeeIds", void 0);
//# sourceMappingURL=mentioned-employee-ids.dto.js.map