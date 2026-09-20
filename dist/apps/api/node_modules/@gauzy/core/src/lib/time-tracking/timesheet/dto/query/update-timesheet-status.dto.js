"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTimesheetStatusDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const dto_1 = require("./../../../../core/dto");
const timesheet_entity_1 = require("../../timesheet.entity");
/**
 * Update timesheets status request DTO validation
 */
class UpdateTimesheetStatusDTO extends (0, swagger_1.IntersectionType)(dto_1.TenantOrganizationBaseDTO, (0, swagger_1.PickType)(timesheet_entity_1.Timesheet, ['status'])) {
    constructor() {
        super(...arguments);
        this.ids = [];
    }
}
exports.UpdateTimesheetStatusDTO = UpdateTimesheetStatusDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Array }),
    (0, class_validator_1.ArrayNotEmpty)(),
    tslib_1.__metadata("design:type", Array)
], UpdateTimesheetStatusDTO.prototype, "ids", void 0);
//# sourceMappingURL=update-timesheet-status.dto.js.map