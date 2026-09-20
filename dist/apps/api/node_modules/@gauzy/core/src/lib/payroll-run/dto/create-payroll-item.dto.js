"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePayrollItemDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const contracts_1 = require("@gauzy/contracts");
const dto_1 = require("./../../core/dto");
/**
 * Add one earning or deduction line to a payroll run.
 *
 * `payrollRunId` is not part of the body — it comes from the route, so a caller cannot post an
 * item into somebody else's run by naming it here.
 */
class CreatePayrollItemDTO extends dto_1.TenantOrganizationBaseDTO {
}
exports.CreatePayrollItemDTO = CreatePayrollItemDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], CreatePayrollItemDTO.prototype, "employeeId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ enum: contracts_1.PayrollItemTypeEnum }),
    (0, class_validator_1.IsEnum)(contracts_1.PayrollItemTypeEnum),
    tslib_1.__metadata("design:type", String)
], CreatePayrollItemDTO.prototype, "type", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ enum: contracts_1.PayrollItemCategoryEnum }),
    (0, class_validator_1.IsEnum)(contracts_1.PayrollItemCategoryEnum),
    tslib_1.__metadata("design:type", String)
], CreatePayrollItemDTO.prototype, "category", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, maxLength: 500 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    tslib_1.__metadata("design:type", String)
], CreatePayrollItemDTO.prototype, "description", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Number, description: 'Always positive; `category` decides the sign' }),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(999999999999),
    tslib_1.__metadata("design:type", Number)
], CreatePayrollItemDTO.prototype, "amount", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Number }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 4 }),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(999999999999),
    tslib_1.__metadata("design:type", Number)
], CreatePayrollItemDTO.prototype, "quantity", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Number }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(999999999999),
    tslib_1.__metadata("design:type", Number)
], CreatePayrollItemDTO.prototype, "unitPrice", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    tslib_1.__metadata("design:type", Boolean)
], CreatePayrollItemDTO.prototype, "taxable", void 0);
//# sourceMappingURL=create-payroll-item.dto.js.map