"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateRangeQueryDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const validators_1 = require("./../../shared/validators");
const dto_1 = require("./../../core/dto");
/**
 * Get date range common request DTO validation
 */
class DateRangeQueryDTO extends (0, swagger_1.OmitType)(dto_1.TenantOrganizationBaseDTO, ['sentTo']) {
}
exports.DateRangeQueryDTO = DateRangeQueryDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Date }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    (0, validators_1.IsBeforeDate)(DateRangeQueryDTO, (it) => it.endDate, {
        message: "Start date must be before to the end date"
    }),
    tslib_1.__metadata("design:type", Date)
], DateRangeQueryDTO.prototype, "startDate", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Date }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    tslib_1.__metadata("design:type", Date)
], DateRangeQueryDTO.prototype, "endDate", void 0);
//# sourceMappingURL=date-range-query.dto.js.map