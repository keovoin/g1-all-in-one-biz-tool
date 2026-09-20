"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseReportQueryDTO = void 0;
const tslib_1 = require("tslib");
const contracts_1 = require("@gauzy/contracts");
const mapped_types_1 = require("@nestjs/mapped-types");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const dto_1 = require("./../../../shared/dto");
/**
 * Get expense report request DTO validation
 */
class ExpenseReportQueryDTO extends (0, mapped_types_1.IntersectionType)(dto_1.RelationsQueryDTO, dto_1.SelectorsQueryDTO) {
}
exports.ExpenseReportQueryDTO = ExpenseReportQueryDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Array, enum: contracts_1.ReportGroupFilterEnum }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contracts_1.ReportGroupFilterEnum),
    tslib_1.__metadata("design:type", String)
], ExpenseReportQueryDTO.prototype, "groupBy", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], ExpenseReportQueryDTO.prototype, "categoryId", void 0);
//# sourceMappingURL=expense-report-query.dto.js.map