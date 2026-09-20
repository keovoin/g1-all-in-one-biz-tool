"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateOrganizationTeamDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const organization_team_dto_1 = require("./organization-team.dto");
const validators_1 = require("./../../shared/validators");
/**
 * Update organization team request DTO's
 */
class UpdateOrganizationTeamDTO extends organization_team_dto_1.OrganizationTeamDTO {
}
exports.UpdateOrganizationTeamDTO = UpdateOrganizationTeamDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, required: true }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], UpdateOrganizationTeamDTO.prototype, "id", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, validators_1.IsTeamAlreadyExist)(),
    tslib_1.__metadata("design:type", String)
], UpdateOrganizationTeamDTO.prototype, "name", void 0);
//# sourceMappingURL=update-organization-team.dto.js.map