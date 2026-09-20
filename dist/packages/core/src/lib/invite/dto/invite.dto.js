"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InviteDTO = void 0;
const tslib_1 = require("tslib");
const contracts_1 = require("@gauzy/contracts");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const dto_1 = require("./../../core/dto");
/**
 * Invite DTO validation
 */
class InviteDTO extends dto_1.TenantOrganizationBaseDTO {
    constructor() {
        super(...arguments);
        this.emailIds = [];
        this.teamIds = [];
    }
}
exports.InviteDTO = InviteDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Array }),
    (0, class_validator_1.ArrayNotEmpty)(),
    tslib_1.__metadata("design:type", Array)
], InviteDTO.prototype, "emailIds", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Array }),
    (0, class_validator_1.ValidateIf)((it) => it.inviteType === contracts_1.InvitationTypeEnum.TEAM),
    (0, class_validator_1.ArrayNotEmpty)(),
    tslib_1.__metadata("design:type", Array)
], InviteDTO.prototype, "teamIds", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, enum: contracts_1.InvitationTypeEnum }),
    (0, class_validator_1.IsEnum)(contracts_1.InvitationTypeEnum),
    tslib_1.__metadata("design:type", String)
], InviteDTO.prototype, "inviteType", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Date }),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Date)
], InviteDTO.prototype, "startedWorkOn", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, enum: contracts_1.InvitationExpirationEnum }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contracts_1.InvitationExpirationEnum),
    tslib_1.__metadata("design:type", Object)
], InviteDTO.prototype, "invitationExpirationPeriod", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], InviteDTO.prototype, "fullName", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    tslib_1.__metadata("design:type", String)
], InviteDTO.prototype, "callbackUrl", void 0);
//# sourceMappingURL=invite.dto.js.map