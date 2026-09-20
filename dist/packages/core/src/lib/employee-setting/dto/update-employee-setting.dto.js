"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateEmployeeSettingDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const dto_1 = require("../../core/dto");
const create_employee_setting_dto_1 = require("./create-employee-setting.dto");
class UpdateEmployeeSettingDTO extends (0, swagger_1.IntersectionType)(dto_1.TenantOrganizationBaseDTO, (0, swagger_1.OmitType)(create_employee_setting_dto_1.CreateEmployeeSettingDTO, ['employee', 'employeeId'])) {
}
exports.UpdateEmployeeSettingDTO = UpdateEmployeeSettingDTO;
//# sourceMappingURL=update-employee-setting.dto.js.map