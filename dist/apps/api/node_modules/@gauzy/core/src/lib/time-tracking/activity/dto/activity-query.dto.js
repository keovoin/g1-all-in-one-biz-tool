"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityQueryDTO = void 0;
const tslib_1 = require("tslib");
const contracts_1 = require("@gauzy/contracts");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const dto_1 = require("../../../shared/dto");
/**
 * Get activities request DTO validation
 */
class ActivityQueryDTO extends (0, swagger_1.IntersectionType)(dto_1.FiltersQueryDTO, dto_1.SelectorsQueryDTO) {
}
exports.ActivityQueryDTO = ActivityQueryDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Array, enum: contracts_1.ReportGroupFilterEnum }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contracts_1.ReportGroupFilterEnum),
    tslib_1.__metadata("design:type", String)
], ActivityQueryDTO.prototype, "groupBy", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Array, isArray: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    tslib_1.__metadata("design:type", Array)
], ActivityQueryDTO.prototype, "types", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Array, isArray: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    tslib_1.__metadata("design:type", Array)
], ActivityQueryDTO.prototype, "titles", void 0);
//# sourceMappingURL=activity-query.dto.js.map