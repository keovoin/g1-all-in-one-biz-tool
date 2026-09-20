"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationProjectDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const dto_1 = require("../../core/dto");
const organization_project_entity_1 = require("./../organization-project.entity");
const update_task_mode_dto_1 = require("./update-task-mode.dto");
/**
 * Organization Project DTO request validation
 */
class OrganizationProjectDTO extends (0, swagger_1.IntersectionType)((0, swagger_1.PickType)(organization_project_entity_1.OrganizationProject, ['imageId', 'name', 'billing', 'budgetType']), (0, swagger_1.IntersectionType)((0, swagger_1.PartialType)(update_task_mode_dto_1.UpdateTaskModeDTO), dto_1.MemberEntityBasedDTO)) {
}
exports.OrganizationProjectDTO = OrganizationProjectDTO;
//# sourceMappingURL=organization-project.dto.js.map