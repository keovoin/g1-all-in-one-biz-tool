"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const user_entity_1 = require("../user.entity");
const create_user_dto_1 = require("./create-user.dto");
/**
 * Base class for updating user-related fields.
 *
 * `imageId` is declared because the route validates with `whitelist: true`, which strips every
 * undeclared property. Without it a client could upload an avatar (creating the ImageAsset) and then
 * fail to attach it: `PUT /user/:id` with `{ imageId }` answered `202 Accepted` while silently
 * dropping the value, so the avatar never changed — and `{ imageId: null }` never cleared one.
 * It carries `@IsOptional()` + `@IsUUID()` from the entity, so `null` is accepted (clearing the
 * avatar) while a malformed id is still rejected.
 */
class UpdateUserBaseDTO extends (0, swagger_1.PickType)(user_entity_1.User, [
    'defaultOrganizationId',
    'defaultTeamId',
    'lastOrganizationId',
    'lastTeamId',
    'imageId',
    'isActive'
]) {
}
/**
 * The credential half of a profile update.
 *
 * `hash` carries the NEW PASSWORD in clear text (`UserService.updateProfile` hashes it before the
 * write) — that is the long-standing contract the profile form uses. It is declared explicitly so the
 * route can validate with `whitelist: true`: every property the DTO does not declare is stripped, which
 * is what keeps identity/verification columns (`id`, `emailVerifiedAt`, `emailToken`, `refreshToken`, …)
 * out of a body that is otherwise spread straight onto the entity.
 */
class UpdateUserCredentialsDTO {
}
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)()
    // Same floor as registration (`RegisterUserDTO` uses MinLength(8)). Without it this route was the
    // one way into the system to set a one-character password: `updateProfile` hashes whatever it is
    // given, so the weak value is stored just as happily as a strong one.
    ,
    (0, class_validator_1.MinLength)(8, { message: 'Password should be at least 8 characters long.' }),
    tslib_1.__metadata("design:type", String)
], UpdateUserCredentialsDTO.prototype, "hash", void 0);
/**
 * Update User Data Transfer Object (DTO) validation.
 */
class UpdateUserDTO extends (0, swagger_1.IntersectionType)((0, swagger_1.PartialType)(create_user_dto_1.CreateUserDTO), (0, swagger_1.IntersectionType)(UpdateUserBaseDTO, UpdateUserCredentialsDTO)) {
}
exports.UpdateUserDTO = UpdateUserDTO;
//# sourceMappingURL=update-user.dto.js.map