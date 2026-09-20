"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateOrganizationProjectModuleDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const dto_1 = require("./../../core/dto");
const organization_project_module_entity_1 = require("./../organization-project-module.entity");
/**
 * Create Project Module validation request DTO
 */
class CreateOrganizationProjectModuleDTO extends (0, swagger_1.IntersectionType)(dto_1.TenantOrganizationBaseDTO, (0, swagger_1.IntersectionType)((0, swagger_1.OmitType)(organization_project_module_entity_1.OrganizationProjectModule, ['organizationId', 'organization']), dto_1.MemberEntityBasedDTO)) {
}
exports.CreateOrganizationProjectModuleDTO = CreateOrganizationProjectModuleDTO;
//# sourceMappingURL=create-organization-project-module.dto.js.map