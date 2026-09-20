"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationContactDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const organization_contact_entity_1 = require("./../organization-contact.entity");
const dto_1 = require("../../core/dto");
const dto_2 = require("../../tags/dto");
class OrganizationContactDTO extends (0, swagger_1.IntersectionType)(dto_1.TenantOrganizationBaseDTO, dto_2.RelationalTagDTO, (0, swagger_1.PickType)(organization_contact_entity_1.OrganizationContact, [
    'name',
    'primaryEmail',
    'primaryPhone',
    'inviteStatus',
    'contactType',
    'notes',
    'budget',
    'budgetType',
    'imageId'
])) {
}
exports.OrganizationContactDTO = OrganizationContactDTO;
//# sourceMappingURL=organization-contact.dto.js.map