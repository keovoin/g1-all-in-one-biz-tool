"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestTimesheetProjectChangeDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const dto_1 = require("./../../../core/dto");
/**
 * Payload an employee sends to ask for the time logged against `previousProjectId`
 * in `timesheetId` to be moved to `requestedProjectId`.
 */
class RequestTimesheetProjectChangeDTO extends dto_1.TenantOrganizationBaseDTO {
}
exports.RequestTimesheetProjectChangeDTO = RequestTimesheetProjectChangeDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], RequestTimesheetProjectChangeDTO.prototype, "timesheetId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], RequestTimesheetProjectChangeDTO.prototype, "requestedProjectId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], RequestTimesheetProjectChangeDTO.prototype, "previousProjectId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, maxLength: 500 }),
    (0, class_transformer_1.Transform)(({ value }) => (typeof value === 'string' ? value.trim() : value)),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    (0, class_validator_1.MaxLength)(500),
    tslib_1.__metadata("design:type", String)
], RequestTimesheetProjectChangeDTO.prototype, "reason", void 0);
//# sourceMappingURL=request-timesheet-project-change.dto.js.map