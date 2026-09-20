"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeOffBalanceQueryDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const dto_1 = require("./../../core/dto");
/**
 * Query filters for listing leave balances.
 */
class TimeOffBalanceQueryDTO extends dto_1.TenantOrganizationBaseDTO {
}
exports.TimeOffBalanceQueryDTO = TimeOffBalanceQueryDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], TimeOffBalanceQueryDTO.prototype, "employeeId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], TimeOffBalanceQueryDTO.prototype, "policyId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Number }),
    (0, class_transformer_1.Transform)(({ value }) => (value === undefined || value === null ? value : Number(value))),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1900),
    (0, class_validator_1.Max)(2999),
    tslib_1.__metadata("design:type", Number)
], TimeOffBalanceQueryDTO.prototype, "year", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Number, description: '1-based page number' }),
    (0, class_transformer_1.Transform)(({ value }) => (value === undefined || value === null ? value : Number(value))),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    tslib_1.__metadata("design:type", Number)
], TimeOffBalanceQueryDTO.prototype, "page", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Number, description: 'Rows per page, 1-200' }),
    (0, class_transformer_1.Transform)(({ value }) => (value === undefined || value === null ? value : Number(value))),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(200),
    tslib_1.__metadata("design:type", Number)
], TimeOffBalanceQueryDTO.prototype, "limit", void 0);
//# sourceMappingURL=time-off-balance-query.dto.js.map