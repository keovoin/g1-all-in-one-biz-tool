"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateOrganizationStrategicSignalsDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const contracts_1 = require("@gauzy/contracts");
/**
 * Update Organization Strategic Signals data validation request DTO
 */
class UpdateOrganizationStrategicSignalsDTO {
}
exports.UpdateOrganizationStrategicSignalsDTO = UpdateOrganizationStrategicSignalsDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, enum: contracts_1.OrganizationStrategicConfidenceLevelEnum }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contracts_1.OrganizationStrategicConfidenceLevelEnum),
    tslib_1.__metadata("design:type", String)
], UpdateOrganizationStrategicSignalsDTO.prototype, "confidenceLevel", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, enum: contracts_1.OrganizationStrategicPerceivedMomentumEnum }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contracts_1.OrganizationStrategicPerceivedMomentumEnum),
    tslib_1.__metadata("design:type", String)
], UpdateOrganizationStrategicSignalsDTO.prototype, "perceivedMomentum", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => [String] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    tslib_1.__metadata("design:type", Array)
], UpdateOrganizationStrategicSignalsDTO.prototype, "knownRisks", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], UpdateOrganizationStrategicSignalsDTO.prototype, "strategicNotes", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], UpdateOrganizationStrategicSignalsDTO.prototype, "lastAssessedById", void 0);
//# sourceMappingURL=update-organization-strategic-signals.dto.js.map