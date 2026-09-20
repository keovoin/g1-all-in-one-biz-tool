"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfficialHolidayQueryDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const dto_1 = require("./../../core/dto");
/**
 * Query filters for listing official holidays.
 */
class OfficialHolidayQueryDTO extends dto_1.TenantOrganizationBaseDTO {
}
exports.OfficialHolidayQueryDTO = OfficialHolidayQueryDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, minLength: 2, maxLength: 2 }),
    (0, class_transformer_1.Transform)(({ value }) => (typeof value === 'string' ? value.trim().toUpperCase() : value)),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(2, 2),
    tslib_1.__metadata("design:type", String)
], OfficialHolidayQueryDTO.prototype, "countryCode", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Number }),
    (0, class_transformer_1.Transform)(({ value }) => (value === undefined || value === null ? value : Number(value))),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1900),
    (0, class_validator_1.Max)(2999),
    tslib_1.__metadata("design:type", Number)
], OfficialHolidayQueryDTO.prototype, "year", void 0);
//# sourceMappingURL=official-holiday-query.dto.js.map