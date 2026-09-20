"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResendInviteDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const dto_1 = require("./../../core/dto");
const invite_dto_1 = require("./invite.dto");
/**
 * Resend invite DTO validation
 */
class ResendInviteDTO extends (0, swagger_1.IntersectionType)(dto_1.TenantOrganizationBaseDTO, (0, swagger_1.PickType)(invite_dto_1.InviteDTO, ['callbackUrl', 'inviteType'])) {
}
exports.ResendInviteDTO = ResendInviteDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", Object)
], ResendInviteDTO.prototype, "inviteId", void 0);
//# sourceMappingURL=resend-invite.dto.js.map