"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindMeQueryDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const utils_1 = require("@gauzy/utils");
const dto_1 = require("./../../shared/dto");
/**
 * DTO for "find me" queries to retrieve logged-in user details, extending from RelationsQueryDTO.
 */
class FindMeQueryDTO extends dto_1.RelationsQueryDTO {
}
exports.FindMeQueryDTO = FindMeQueryDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (0, utils_1.parseToBoolean)(value)),
    tslib_1.__metadata("design:type", Boolean)
], FindMeQueryDTO.prototype, "includeEmployee", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (0, utils_1.parseToBoolean)(value)),
    tslib_1.__metadata("design:type", Boolean)
], FindMeQueryDTO.prototype, "includeOrganization", void 0);
//# sourceMappingURL=find-me-query.dto.js.map