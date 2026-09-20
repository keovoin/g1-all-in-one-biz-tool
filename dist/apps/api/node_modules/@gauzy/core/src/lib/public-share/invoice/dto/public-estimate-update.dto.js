"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicEstimateUpdateDTO = void 0;
const tslib_1 = require("tslib");
const contracts_1 = require("@gauzy/contracts");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class PublicEstimateUpdateDTO {
}
exports.PublicEstimateUpdateDTO = PublicEstimateUpdateDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean, readOnly: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    tslib_1.__metadata("design:type", Boolean)
], PublicEstimateUpdateDTO.prototype, "isEstimate", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, enum: contracts_1.EstimateStatusTypesEnum, readOnly: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contracts_1.EstimateStatusTypesEnum),
    tslib_1.__metadata("design:type", String)
], PublicEstimateUpdateDTO.prototype, "status", void 0);
//# sourceMappingURL=public-estimate-update.dto.js.map