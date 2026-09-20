"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePayrollRunDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const contracts_1 = require("@gauzy/contracts");
const dto_1 = require("./../../core/dto");
/**
 * Create Payroll Run request DTO.
 *
 * `status` and the totals are intentionally not accepted: the status only moves through the
 * workflow endpoints and the totals are derived from the run's items.
 */
class CreatePayrollRunDTO extends dto_1.TenantOrganizationBaseDTO {
}
exports.CreatePayrollRunDTO = CreatePayrollRunDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Date }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsDateString)(),
    tslib_1.__metadata("design:type", Date)
], CreatePayrollRunDTO.prototype, "periodStart", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Date }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsDateString)(),
    tslib_1.__metadata("design:type", Date)
], CreatePayrollRunDTO.prototype, "periodEnd", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Date }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsDateString)(),
    tslib_1.__metadata("design:type", Date)
], CreatePayrollRunDTO.prototype, "payDate", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ enum: contracts_1.PayrollFrequencyEnum }),
    (0, class_validator_1.IsEnum)(contracts_1.PayrollFrequencyEnum),
    tslib_1.__metadata("design:type", String)
], CreatePayrollRunDTO.prototype, "frequency", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, minLength: 3, maxLength: 3 }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(3, 3),
    tslib_1.__metadata("design:type", String)
], CreatePayrollRunDTO.prototype, "currency", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, maxLength: 500 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    tslib_1.__metadata("design:type", String)
], CreatePayrollRunDTO.prototype, "notes", void 0);
//# sourceMappingURL=create-payroll-run.dto.js.map