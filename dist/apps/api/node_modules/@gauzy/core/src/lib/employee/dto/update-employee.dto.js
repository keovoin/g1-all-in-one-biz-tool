"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateEmployeeDTO = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const swagger_1 = require("@nestjs/swagger");
const update_profile_dto_1 = require("./update-profile.dto");
const employee_entity_1 = require("../employee.entity");
/**
 * Only SUPER_ADMIN/ADMIN updates these fields
 * Private fields DTO
 */
class UpdateEmployeeDTO extends (0, mapped_types_1.IntersectionType)(update_profile_dto_1.UpdateProfileDTO, (0, swagger_1.PickType)(employee_entity_1.Employee, [
    'show_anonymous_bonus',
    'show_average_bonus',
    'show_average_expenses',
    'show_average_income',
    'show_billrate',
    'show_payperiod',
    'show_start_work_on'
]), (0, swagger_1.PickType)(employee_entity_1.Employee, [
    'isActive',
    'isArchived',
    'isVerified',
    'isVetted',
    'isOnline',
    'isTrackingEnabled',
    'isTrackingTime',
    'isJobSearchActive',
    'allowScreenshotCapture',
    'allowManualTime',
    'allowModifyTime',
    'allowDeleteTime',
    'allowAgentAppExit',
    'allowLogoutFromAgentApp',
    'trackKeyboardMouseActivity',
    'trackAllDisplays'
])) {
}
exports.UpdateEmployeeDTO = UpdateEmployeeDTO;
//# sourceMappingURL=update-employee.dto.js.map