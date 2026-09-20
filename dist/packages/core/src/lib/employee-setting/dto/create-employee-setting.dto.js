"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateEmployeeSettingDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const dto_1 = require("../../core/dto");
const employee_setting_entity_1 = require("../employee-setting.entity");
/**
 * Create Employee Setting DTO request validation
 */
class CreateEmployeeSettingDTO extends (0, swagger_1.IntersectionType)(dto_1.TenantOrganizationBaseDTO, employee_setting_entity_1.EmployeeSetting) {
}
exports.CreateEmployeeSettingDTO = CreateEmployeeSettingDTO;
//# sourceMappingURL=create-employee-setting.dto.js.map