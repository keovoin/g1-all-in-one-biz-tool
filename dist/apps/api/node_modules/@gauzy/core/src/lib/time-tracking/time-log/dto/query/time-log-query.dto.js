"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeLogQueryDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const contracts_1 = require("@gauzy/contracts");
const utils_1 = require("@gauzy/utils");
const dto_1 = require("../../../../shared/dto");
/**
 * Get time log request DTO validation
 */
class TimeLogQueryDTO extends (0, swagger_1.IntersectionType)(dto_1.FiltersQueryDTO, (0, swagger_1.IntersectionType)(dto_1.SelectorsQueryDTO, dto_1.RelationsQueryDTO)) {
}
exports.TimeLogQueryDTO = TimeLogQueryDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, enum: contracts_1.ReportGroupFilterEnum }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contracts_1.ReportGroupFilterEnum),
    tslib_1.__metadata("design:type", String)
], TimeLogQueryDTO.prototype, "groupBy", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", Object)
], TimeLogQueryDTO.prototype, "timesheetId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsTimeZone)(),
    tslib_1.__metadata("design:type", String)
], TimeLogQueryDTO.prototype, "timeZone", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (0, utils_1.parseToBoolean)(value)),
    tslib_1.__metadata("design:type", Boolean)
], TimeLogQueryDTO.prototype, "isEdited", void 0);
//# sourceMappingURL=time-log-query.dto.js.map