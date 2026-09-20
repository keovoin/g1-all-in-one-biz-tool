"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTaskModeDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const dto_1 = require("./../../core/dto");
const organization_project_entity_1 = require("../organization-project.entity");
/**
 * Update task list view mode DTO validation
 */
class UpdateTaskModeDTO extends (0, swagger_1.IntersectionType)(dto_1.TenantOrganizationBaseDTO, (0, swagger_1.PickType)(organization_project_entity_1.OrganizationProject, ['taskListType'])) {
}
exports.UpdateTaskModeDTO = UpdateTaskModeDTO;
//# sourceMappingURL=update-task-mode.dto.js.map