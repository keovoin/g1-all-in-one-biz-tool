"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationProjectModuleFindInputDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const dto_1 = require("./../../core/dto");
const create_organization_project_module_dto_1 = require("./create-organization-project-module.dto");
/** Organization Project Module query validation DTO */
class OrganizationProjectModuleFindInputDTO extends (0, swagger_1.IntersectionType)(dto_1.TenantOrganizationBaseDTO, (0, swagger_1.PartialType)((0, swagger_1.PickType)(create_organization_project_module_dto_1.CreateOrganizationProjectModuleDTO, ['name', 'projectId']))) {
}
exports.OrganizationProjectModuleFindInputDTO = OrganizationProjectModuleFindInputDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], OrganizationProjectModuleFindInputDTO.prototype, "organizationTeamId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], OrganizationProjectModuleFindInputDTO.prototype, "organizationSprintId", void 0);
//# sourceMappingURL=organization-project-module-find-input.dto.js.map