"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcceptOrganizationContactInviteDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const accept_invite_dto_1 = require("./accept-invite.dto");
/**
 * Accept organization-contact invite request DTO validation (`POST /invite/contact`).
 *
 * The route is `@Public()` and used to bind the raw contract interface with no pipe, so the whole
 * body reached `AuthService.register()`. Its `user` object was spread into the new account, and
 * `User.organizations` is a `cascade: true` relation: `user.organizations: [{ organizationId, tenantId }]`
 * would have been inserted as real memberships of ANY organization the caller could name.
 *
 * `user` is therefore whitelisted with the same profile-only class as `/invite/accept`; its `email`,
 * `role` and `tenant` are dropped here and re-supplied by `InviteAcceptOrganizationContactHandler`
 * from the invitation and from the tenant it provisions. `originalUrl` is not accepted from the body
 * either — the controller sets it from the `Origin` header after the pipe has run.
 *
 * `contactOrganization` is the organization-creation form's full output (organization settings and
 * flattened contact/address fields), so it is only shape-checked here. The handler strips the
 * identity and ownership columns from it before anything is persisted.
 */
class AcceptOrganizationContactInviteDTO {
}
exports.AcceptOrganizationContactInviteDTO = AcceptOrganizationContactInviteDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], AcceptOrganizationContactInviteDTO.prototype, "inviteId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(4, { message: 'Password should be at least 4 characters long.' }),
    tslib_1.__metadata("design:type", String)
], AcceptOrganizationContactInviteDTO.prototype, "password", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => accept_invite_dto_1.AcceptInviteUserDTO }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => accept_invite_dto_1.AcceptInviteUserDTO),
    tslib_1.__metadata("design:type", Object)
], AcceptOrganizationContactInviteDTO.prototype, "user", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Object }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsObject)(),
    tslib_1.__metadata("design:type", Object)
], AcceptOrganizationContactInviteDTO.prototype, "contactOrganization", void 0);
//# sourceMappingURL=accept-organization-contact-invite.dto.js.map