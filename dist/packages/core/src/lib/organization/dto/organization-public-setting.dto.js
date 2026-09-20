"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationPublicSettingDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const organization_entity_1 = require("../organization.entity");
/**
 * Organization Public Setting DTO
 */
class OrganizationPublicSettingDTO extends (0, swagger_1.PickType)(organization_entity_1.Organization, [
    'show_income',
    'show_profits',
    'show_bonuses_paid',
    'show_total_hours',
    'show_minimum_project_size',
    'show_projects_count',
    'show_clients_count',
    'show_clients',
    'show_employees_count'
]) {
}
exports.OrganizationPublicSettingDTO = OrganizationPublicSettingDTO;
//# sourceMappingURL=organization-public-setting.dto.js.map