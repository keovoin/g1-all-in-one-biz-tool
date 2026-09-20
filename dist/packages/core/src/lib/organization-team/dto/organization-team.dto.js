"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationTeamDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const dto_1 = require("./../../core/dto");
const dto_2 = require("./../../tags/dto");
const organization_team_entity_1 = require("./../organization-team.entity");
const organization_project_entity_1 = require("../../organization-project/organization-project.entity");
class OrganizationTeamDTO extends (0, swagger_1.IntersectionType)((0, swagger_1.IntersectionType)(dto_1.TenantOrganizationBaseDTO, (0, swagger_1.IntersectionType)((0, swagger_1.PartialType)(dto_2.RelationalTagDTO), dto_1.MemberEntityBasedDTO)), (0, swagger_1.PickType)(organization_team_entity_1.OrganizationTeam, ['logo', 'prefix', 'imageId', 'shareProfileView', 'requirePlanToTrack'])) {
    constructor() {
        super(...arguments);
        this.projects = [];
    }
}
exports.OrganizationTeamDTO = OrganizationTeamDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    tslib_1.__metadata("design:type", Boolean)
], OrganizationTeamDTO.prototype, "public", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], OrganizationTeamDTO.prototype, "color", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], OrganizationTeamDTO.prototype, "emoji", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], OrganizationTeamDTO.prototype, "teamSize", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => organization_project_entity_1.OrganizationProject, isArray: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    tslib_1.__metadata("design:type", Array)
], OrganizationTeamDTO.prototype, "projects", void 0);
//# sourceMappingURL=organization-team.dto.js.map