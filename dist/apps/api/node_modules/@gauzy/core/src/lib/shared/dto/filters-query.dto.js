"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FiltersQueryDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const contracts_1 = require("@gauzy/contracts");
const validators_1 = require("./../../shared/validators");
/**
 * Data Transfer Object for filtering time logs based on source, log type, and activity level.
 * This DTO provides optional filters to refine time log queries.
 */
class FiltersQueryDTO {
}
exports.FiltersQueryDTO = FiltersQueryDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: contracts_1.TimeLogSourceEnum }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contracts_1.TimeLogSourceEnum, { each: true }),
    tslib_1.__metadata("design:type", Array)
], FiltersQueryDTO.prototype, "source", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: contracts_1.TimeLogType }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contracts_1.TimeLogType, { each: true }),
    tslib_1.__metadata("design:type", Array)
], FiltersQueryDTO.prototype, "logType", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Object }),
    (0, class_validator_1.IsOptional)(),
    (0, validators_1.IsBetweenActivity)(FiltersQueryDTO, (it) => it.activityLevel),
    (0, class_transformer_1.Type)(() => Object),
    tslib_1.__metadata("design:type", Object)
], FiltersQueryDTO.prototype, "activityLevel", void 0);
//# sourceMappingURL=filters-query.dto.js.map