"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateOrganizationSprintDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const dto_1 = require("./../../core/dto");
const organization_sprint_dto_1 = require("./organization-sprint.dto");
/**
 * Create Organization Sprint DTO request validation
 */
class CreateOrganizationSprintDTO extends (0, swagger_1.IntersectionType)(organization_sprint_dto_1.OrganizationSprintDTO, dto_1.TenantOrganizationBaseDTO) {
}
exports.CreateOrganizationSprintDTO = CreateOrganizationSprintDTO;
//# sourceMappingURL=create-organization-sprint.dto.js.map