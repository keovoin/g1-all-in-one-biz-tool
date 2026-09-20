"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationSettingDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const organization_entity_1 = require("../organization.entity");
/**
 * Organization Setting DTO validation
 */
class OrganizationSettingDTO extends (0, swagger_1.PickType)(organization_entity_1.Organization, [
    'defaultValueDateType',
    'startWeekOn',
    'inviteExpiryPeriod',
    'regionCode'
]) {
}
exports.OrganizationSettingDTO = OrganizationSettingDTO;
//# sourceMappingURL=organization-setting.dto.js.map