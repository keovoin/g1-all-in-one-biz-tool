"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdjustTimeOffBalanceDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const dto_1 = require("./../../core/dto");
/**
 * Spend days from, or give days back to, one employee/policy/year balance.
 *
 * `days` is always positive; the endpoint decides the direction, so a negative value can never
 * turn a deduction into a grant.
 */
class AdjustTimeOffBalanceDTO extends dto_1.TenantOrganizationBaseDTO {
}
exports.AdjustTimeOffBalanceDTO = AdjustTimeOffBalanceDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], AdjustTimeOffBalanceDTO.prototype, "employeeId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], AdjustTimeOffBalanceDTO.prototype, "policyId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Number }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1900),
    (0, class_validator_1.Max)(2999),
    tslib_1.__metadata("design:type", Number)
], AdjustTimeOffBalanceDTO.prototype, "year", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Number, minimum: 0.01 }),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.Min)(0.01),
    (0, class_validator_1.Max)(999999),
    tslib_1.__metadata("design:type", Number)
], AdjustTimeOffBalanceDTO.prototype, "days", void 0);
//# sourceMappingURL=adjust-time-off-balance.dto.js.map