"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubmitTimesheetStatusDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const dto_1 = require("../../../../core/dto");
/**
 * Submit timesheets status request DTO validation
 */
class SubmitTimesheetStatusDTO extends dto_1.TenantOrganizationBaseDTO {
    constructor() {
        super(...arguments);
        this.status = 'submit';
    }
}
exports.SubmitTimesheetStatusDTO = SubmitTimesheetStatusDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Array of timesheet IDs to submit/unsubmit' }),
    (0, class_validator_1.ArrayNotEmpty)({ message: 'At least one timesheet ID must be provided' }),
    tslib_1.__metadata("design:type", Array)
], SubmitTimesheetStatusDTO.prototype, "ids", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        enum: ['submit', 'unsubmit'],
        description: 'Status to set on the timesheet (either "submit" or "unsubmit")'
    }),
    (0, class_validator_1.IsEnum)(['submit', 'unsubmit'], { message: 'Status must be either "submit" or "unsubmit"' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Status must not be empty' }),
    tslib_1.__metadata("design:type", String)
], SubmitTimesheetStatusDTO.prototype, "status", void 0);
//# sourceMappingURL=submit-timesheet-status.dto.js.map