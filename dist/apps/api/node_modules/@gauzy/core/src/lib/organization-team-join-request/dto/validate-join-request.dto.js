"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateJoinRequestDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const constants_1 = require("@gauzy/constants");
const validators_1 = require("../../shared/validators");
const dto_1 = require("../../user/dto");
const organization_team_join_request_entity_1 = require("../organization-team-join-request.entity");
/**
 * Validate team join request DTO validation
 */
class ValidateJoinRequestDTO extends (0, swagger_1.IntersectionType)(dto_1.UserEmailDTO, (0, swagger_1.PickType)(organization_team_join_request_entity_1.OrganizationTeamJoinRequest, ['organizationTeamId'])) {
}
exports.ValidateJoinRequestDTO = ValidateJoinRequestDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.ValidateIf)((it) => !it.token),
    (0, class_validator_1.IsString)(),
    (0, validators_1.CustomLength)(constants_1.ALPHA_NUMERIC_CODE_LENGTH),
    tslib_1.__metadata("design:type", String)
], ValidateJoinRequestDTO.prototype, "code", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.ValidateIf)((it) => !it.code),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], ValidateJoinRequestDTO.prototype, "token", void 0);
//# sourceMappingURL=validate-join-request.dto.js.map