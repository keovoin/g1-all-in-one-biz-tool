"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllocateTimeOffBalanceDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const dto_1 = require("./../../core/dto");
/**
 * Set the accrued days of one employee/policy/year balance.
 */
class AllocateTimeOffBalanceDTO extends dto_1.TenantOrganizationBaseDTO {
}
exports.AllocateTimeOffBalanceDTO = AllocateTimeOffBalanceDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], AllocateTimeOffBalanceDTO.prototype, "employeeId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], AllocateTimeOffBalanceDTO.prototype, "policyId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Number }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1900),
    (0, class_validator_1.Max)(2999),
    tslib_1.__metadata("design:type", Number)
], AllocateTimeOffBalanceDTO.prototype, "year", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Number }),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(999999),
    tslib_1.__metadata("design:type", Number)
], AllocateTimeOffBalanceDTO.prototype, "accrued", void 0);
//# sourceMappingURL=allocate-time-off-balance.dto.js.map