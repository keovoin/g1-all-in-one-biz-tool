"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewTimesheetProjectChangeDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const contracts_1 = require("@gauzy/contracts");
const dto_1 = require("./../../../core/dto");
/**
 * Payload an approver sends to approve or reject a pending project change request.
 *
 * `PENDING` is deliberately NOT accepted — a review always moves the request out of
 * the pending state.
 */
class ReviewTimesheetProjectChangeDTO extends dto_1.TenantOrganizationBaseDTO {
}
exports.ReviewTimesheetProjectChangeDTO = ReviewTimesheetProjectChangeDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ enum: [contracts_1.TimesheetProjectChangeStatus.APPROVED, contracts_1.TimesheetProjectChangeStatus.REJECTED] }),
    (0, class_validator_1.IsIn)([contracts_1.TimesheetProjectChangeStatus.APPROVED, contracts_1.TimesheetProjectChangeStatus.REJECTED]),
    tslib_1.__metadata("design:type", String)
], ReviewTimesheetProjectChangeDTO.prototype, "status", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, maxLength: 500 }),
    (0, class_transformer_1.Transform)(({ value }) => (typeof value === 'string' ? value.trim() : value)),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    tslib_1.__metadata("design:type", String)
], ReviewTimesheetProjectChangeDTO.prototype, "reviewNote", void 0);
//# sourceMappingURL=review-timesheet-project-change.dto.js.map