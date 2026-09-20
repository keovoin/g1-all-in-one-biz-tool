"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationSprintDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const dto_1 = require("../../core/dto");
const organization_sprint_entity_1 = require("./../organization-sprint.entity");
class OrganizationSprintDTO extends (0, swagger_1.IntersectionType)(organization_sprint_entity_1.OrganizationSprint, dto_1.MemberEntityBasedDTO) {
}
exports.OrganizationSprintDTO = OrganizationSprintDTO;
//# sourceMappingURL=organization-sprint.dto.js.map