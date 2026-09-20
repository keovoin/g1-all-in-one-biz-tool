"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForceDeleteBaseDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const utils_1 = require("@gauzy/utils");
const dto_1 = require("../../shared/dto");
/**
 * Common base DTO with the `forceDelete` flag.
 * If `true`, a hard delete will be performed; otherwise, a soft delete is used.
 * This field is optional and defaults to `false`.
 */
class ForceDeleteBaseDTO extends dto_1.DeleteQueryDTO {
}
exports.ForceDeleteBaseDTO = ForceDeleteBaseDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Transform)(({ value }) => (value ? (0, utils_1.parseToBoolean)(value) : false)),
    tslib_1.__metadata("design:type", Boolean)
], ForceDeleteBaseDTO.prototype, "forceDelete", void 0);
//# sourceMappingURL=force-delete-base.dto.js.map