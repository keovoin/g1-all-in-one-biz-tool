import { IUserUpdateInput } from '@gauzy/contracts';
import { User } from '../user.entity';
import { CreateUserDTO } from './create-user.dto';
declare const UpdateUserBaseDTO_base: import("@nestjs/common").Type<Pick<User, "imageId" | "defaultTeamId" | "lastTeamId" | "defaultOrganizationId" | "lastOrganizationId" | "isActive">>;
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
declare class UpdateUserBaseDTO extends UpdateUserBaseDTO_base {
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
declare class UpdateUserCredentialsDTO {
    readonly hash?: string;
}
declare const UpdateUserDTO_base: import("@nestjs/common").Type<Partial<CreateUserDTO> & UpdateUserBaseDTO & UpdateUserCredentialsDTO>;
/**
 * Update User Data Transfer Object (DTO) validation.
 */
export declare class UpdateUserDTO extends UpdateUserDTO_base implements IUserUpdateInput {
}
export {};
