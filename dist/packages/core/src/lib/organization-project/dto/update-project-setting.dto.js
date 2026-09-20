"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProjectSettingDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const dto_1 = require("../../core/dto");
const organization_project_entity_1 = require("../organization-project.entity");
class UpdateProjectSettingDTO extends (0, swagger_1.IntersectionType)(dto_1.TenantOrganizationBaseDTO, (0, swagger_1.PickType)(organization_project_entity_1.OrganizationProject, ['isTasksAutoSync', 'isTasksAutoSyncOnLabel', 'syncTag'])) {
}
exports.UpdateProjectSettingDTO = UpdateProjectSettingDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Object }),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Object)
], UpdateProjectSettingDTO.prototype, "customFields", void 0);
//# sourceMappingURL=update-project-setting.dto.js.map