"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcceptInviteDTO = exports.AcceptInviteUserDTO = void 0;
exports.trimOrNull = trimOrNull;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const contracts_1 = require("@gauzy/contracts");
const dto_1 = require("./../../terms-acceptance/dto");
/**
 * Null-safe counterpart of the shared `@Trimmed()` decorator, for an UNAUTHENTICATED route.
 *
 * `@Trimmed()` calls `.trim()` on whatever it is handed, and a `@Transform` runs inside the pipe
 * BEFORE any validator does — so `{ "firstName": {} }` on this `@Public()` endpoint raised a raw
 * `TypeError` and came back as a 500 with a stack trace rather than a 400. Non-strings are passed
 * through untouched here so that `@IsString()` can reject them properly.
 */
function trimOrNull({ value }) {
    return typeof value === 'string' ? value.trim() || null : value;
}
/**
 * The profile fields an invitee may set on the account the invitation creates.
 *
 * Everything that DECIDES something is deliberately absent — `id`, `email`, `role`, `roleId`,
 * `tenant`, `tenantId`, `organizations`, `tags`, `thirdPartyId`, `imageId`, the `default*`/`last*`
 * pointers, `isActive`/`isArchived` and every credential column. `InviteAcceptHandler` pins the
 * identity fields from the invitation itself, and a field listed here would silently outrank that
 * pin: the `roleId` column beats the `role` relation on persist, and `user.organizations` is a
 * `cascade: true` relation whose rows would be inserted as real organization memberships.
 *
 * The in-repo accept form sends `firstName`, `lastName`, `email`, `role` and `tenant`; the last
 * three are dropped here and re-supplied server-side from the invitation, which is the same value
 * the form was displaying.
 */
class AcceptInviteUserDTO {
}
exports.AcceptInviteUserDTO = AcceptInviteUserDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Transform)(trimOrNull),
    tslib_1.__metadata("design:type", String)
], AcceptInviteUserDTO.prototype, "firstName", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Transform)(trimOrNull),
    tslib_1.__metadata("design:type", String)
], AcceptInviteUserDTO.prototype, "lastName", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], AcceptInviteUserDTO.prototype, "imageUrl", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, enum: contracts_1.LanguagesEnum }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contracts_1.LanguagesEnum),
    tslib_1.__metadata("design:type", String)
], AcceptInviteUserDTO.prototype, "preferredLanguage", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], AcceptInviteUserDTO.prototype, "timeZone", void 0);
/**
 * Accept invite request DTO validation.
 *
 * `POST /invite/accept` is `@Public()` and had no pipe at all, so the whole body flowed into
 * `AuthService.register()` — the shared user-creation sink — and into the raw employee repository
 * behind it. Whitelisting it here is what stops a field nobody declared from reaching a `create()`.
 *
 * Two client contracts this has to keep working, hence the shape:
 * - the Angular accept form posts `{ user, password, terms, token, email }`;
 * - Ever Teams posts the `{ code, email, user, password }` variant.
 *
 * So `token` and `code` are both optional and neither may be made mandatory; the handler picks the
 * branch from whichever one arrived.
 */
class AcceptInviteDTO {
}
exports.AcceptInviteDTO = AcceptInviteDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)(),
    tslib_1.__metadata("design:type", String)
], AcceptInviteDTO.prototype, "email", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], AcceptInviteDTO.prototype, "token", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], AcceptInviteDTO.prototype, "code", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(4, { message: 'Password should be at least 4 characters long.' }),
    tslib_1.__metadata("design:type", String)
], AcceptInviteDTO.prototype, "password", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => AcceptInviteUserDTO }),
    (0, class_validator_1.IsNotEmptyObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => AcceptInviteUserDTO)
    // Declared as the contract type; @Type pins the class class-transformer actually builds, which
    // is what the whitelist is computed from.
    ,
    tslib_1.__metadata("design:type", Object)
], AcceptInviteDTO.prototype, "user", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => [dto_1.TermsAcceptanceClaimDTO] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayNotEmpty)({ message: 'Terms acceptance, when supplied, must list at least one document.' }),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => dto_1.TermsAcceptanceClaimDTO),
    tslib_1.__metadata("design:type", Array)
], AcceptInviteDTO.prototype, "terms", void 0);
//# sourceMappingURL=accept-invite.dto.js.map