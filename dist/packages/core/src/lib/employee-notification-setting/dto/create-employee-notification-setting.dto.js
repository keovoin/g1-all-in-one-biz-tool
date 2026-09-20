"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateEmployeeNotificationSettingDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const tenant_organization_base_dto_1 = require("../../core/dto/tenant-organization-base.dto");
const employee_notification_setting_entity_1 = require("../employee-notification-setting.entity");
/**
 * Create EmployeeNotificationSetting validation request DTO
 */
class CreateEmployeeNotificationSettingDTO extends (0, swagger_1.IntersectionType)(tenant_organization_base_dto_1.TenantOrganizationBaseDTO, (0, swagger_1.OmitType)(employee_notification_setting_entity_1.EmployeeNotificationSetting, ['employee', 'employeeId'])) {
}
exports.CreateEmployeeNotificationSettingDTO = CreateEmployeeNotificationSettingDTO;
//# sourceMappingURL=create-employee-notification-setting.dto.js.map