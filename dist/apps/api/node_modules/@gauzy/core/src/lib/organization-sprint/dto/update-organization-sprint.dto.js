"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateOrganizationSprintDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const dto_1 = require("../../core/dto");
const organization_sprint_dto_1 = require("./organization-sprint.dto");
/**
 * Update Organization Project DTO request validation
 */
class UpdateOrganizationSprintDTO extends (0, swagger_1.IntersectionType)(dto_1.TenantOrganizationBaseDTO, (0, swagger_1.PartialType)(organization_sprint_dto_1.OrganizationSprintDTO)) {
}
exports.UpdateOrganizationSprintDTO = UpdateOrganizationSprintDTO;
//# sourceMappingURL=update-organization-sprint.dto.js.map