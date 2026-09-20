"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationTeamFeatureDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const organization_team_entity_1 = require("../organization-team.entity");
class OrganizationTeamFeatureDTO {
}
exports.OrganizationTeamFeatureDTO = OrganizationTeamFeatureDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => organization_team_entity_1.OrganizationTeam }),
    (0, class_validator_1.ValidateIf)((it) => !it.organizationTeamId || it.organizationTeam),
    (0, class_validator_1.IsObject)(),
    tslib_1.__metadata("design:type", Object)
], OrganizationTeamFeatureDTO.prototype, "organizationTeam", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.ValidateIf)((it) => !it.organizationTeam || it.organizationTeamId),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], OrganizationTeamFeatureDTO.prototype, "organizationTeamId", void 0);
//# sourceMappingURL=organization-team-feature.dto.js.map