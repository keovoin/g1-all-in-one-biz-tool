"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarryForwardTimeOffBalanceDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const dto_1 = require("./../../core/dto");
/**
 * Roll unused days of one policy from one year into the next.
 */
class CarryForwardTimeOffBalanceDTO extends dto_1.TenantOrganizationBaseDTO {
}
exports.CarryForwardTimeOffBalanceDTO = CarryForwardTimeOffBalanceDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], CarryForwardTimeOffBalanceDTO.prototype, "policyId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Number }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1900),
    (0, class_validator_1.Max)(2999),
    tslib_1.__metadata("design:type", Number)
], CarryForwardTimeOffBalanceDTO.prototype, "fromYear", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Number }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1900),
    (0, class_validator_1.Max)(2999),
    tslib_1.__metadata("design:type", Number)
], CarryForwardTimeOffBalanceDTO.prototype, "toYear", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Number, description: 'Cap on the days rolled over. Omitted or 0 means no cap.' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(999999),
    tslib_1.__metadata("design:type", Number)
], CarryForwardTimeOffBalanceDTO.prototype, "maxCarryForwardDays", void 0);
//# sourceMappingURL=carry-forward-time-off-balance.dto.js.map